import React, { useState, useMemo } from 'react';
import { 
  HierarchicalSubject, 
  LargeCategory, 
  MediumCategory, 
  SmallCategory,
  MATH_HIERARCHICAL 
} from '../types/hierarchicalCurriculum';
import { KidsButton, KidsCard, StudyStartButton } from './ui/KidsUIComponents';
import { Subject, Topic } from '../types';

interface HierarchicalSubjectSelectorProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled: boolean;
}

const HierarchicalSubjectSelector: React.FC<HierarchicalSubjectSelectorProps> = ({ 
  onStartLearning, 
  disabled 
}) => {
  const [selectedLargeCategory, setSelectedLargeCategory] = useState<LargeCategory | null>(null);
  const [selectedMediumCategory, setSelectedMediumCategory] = useState<MediumCategory | null>(null);
  const [selectedSmallCategory, setSelectedSmallCategory] = useState<SmallCategory | null>(null);

  // 大項目選択時の処理
  const handleLargeCategorySelect = (category: LargeCategory) => {
    console.log('大項目選択:', category.name);
    setSelectedLargeCategory(category);
    setSelectedMediumCategory(null);
    setSelectedSmallCategory(null);
  };

  // 中項目選択時の処理
  const handleMediumCategorySelect = (category: MediumCategory) => {
    console.log('中項目選択:', category.name);
    setSelectedMediumCategory(category);
    setSelectedSmallCategory(null);
  };

  // 小項目選択時の処理
  const handleSmallCategorySelect = (category: SmallCategory) => {
    console.log('小項目選択:', category.name);
    setSelectedSmallCategory(category);
  };

  // 学習開始処理
  const handleStartLearning = () => {
    console.log('階層選択での学習開始ボタンが押されました', selectedSmallCategory);
    if (selectedSmallCategory) {
      // SmallCategoryをSubject、Topicに変換
      const subject: Subject = {
        id: 'math',
        name: '算数',
        description: MATH_HIERARCHICAL.description,
        topics: [],
        examWeight: {
          basic: 0.8,
          standard: 0.8,
          advanced: 0.9,
          elite: 1.0
        }
      };

      const topic: Topic = {
        id: selectedSmallCategory.id,
        name: selectedSmallCategory.name,
        description: selectedSmallCategory.description,
        subUnits: [],
        gradeLevel: ['5th'], // デフォルト
        estimatedHours: selectedSmallCategory.estimatedHours,
        difficulty: selectedSmallCategory.difficulty,
        examFrequency: {
          basic: 0.7,
          standard: 0.8,
          advanced: 0.9,
          elite: 1.0
        },
        learningObjectives: [selectedSmallCategory.description]
      };

      onStartLearning(subject, topic);
    }
  };

  // 難易度に応じた色の決定（メモ化）
  const getDifficultyColor = useMemo(() => (difficulty: number): string => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-blue-500';
    if (difficulty <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  }, []);

  // 難易度レベルの説明テキスト
  const getDifficultyLabel = useMemo(() => (difficulty: number): string => {
    if (difficulty <= 3) return '基礎レベル';
    if (difficulty <= 6) return '標準レベル';
    if (difficulty <= 8) return '応用レベル';
    return '発展レベル';
  }, []);

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-sky-700 mb-4">🧮 算数を勉強しよう！</h2>
        <p className="text-lg text-slate-600">好きな分野を選んでね！</p>
      </div>

      {/* 大項目選択 */}
      <KidsCard title="大分野を選ぼう" icon="📂" color="purple">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {MATH_HIERARCHICAL.largeCategories.map(category => {
            const isSelected = selectedLargeCategory?.id === category.id;
            return (
              <KidsButton
                key={category.id}
                onClick={() => handleLargeCategorySelect(category)}
                variant={isSelected ? 'primary' : 'secondary'}
                size="medium"
                disabled={disabled}
                icon={category.icon}
                className={`text-center text-xs sm:text-sm ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                aria-label={`大分野「${category.name}」を選択`}
                aria-pressed={isSelected}
              >
                {category.name}
              </KidsButton>
            );
          })}
        </div>
      </KidsCard>

      {/* 中項目選択 */}
      {selectedLargeCategory && (
        <KidsCard 
          title={`${selectedLargeCategory.name}の中分野`} 
          icon="📁" 
          color="blue"
        >
          <p className="text-sm text-gray-600 mb-4">{selectedLargeCategory.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedLargeCategory.mediumCategories.map(category => {
              const isSelected = selectedMediumCategory?.id === category.id;
              return (
                <KidsButton
                  key={category.id}
                  onClick={() => handleMediumCategorySelect(category)}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="medium"
                  disabled={disabled}
                  className={`text-left justify-start ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                  aria-label={`中分野「${category.name}」を選択`}
                  aria-pressed={isSelected}
                  aria-describedby={`medium-desc-${category.id}`}
                >
                  <div>
                    <div className="font-medium text-sm sm:text-base">{category.name}</div>
                    <div id={`medium-desc-${category.id}`} className="text-xs text-gray-500 mt-1 hidden sm:block">{category.description}</div>
                  </div>
                </KidsButton>
              );
            })}
          </div>
        </KidsCard>
      )}

      {/* 小項目選択 */}
      {selectedMediumCategory && (
        <KidsCard 
          title={`${selectedMediumCategory.name}の単元`} 
          icon="📄" 
          color="green"
        >
          <p className="text-sm text-gray-600 mb-4">{selectedMediumCategory.description}</p>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {selectedMediumCategory.smallCategories.map(category => {
              const isSelected = selectedSmallCategory?.id === category.id;
              const difficultyColor = getDifficultyColor(category.difficulty);
              
              return (
                <div 
                  key={category.id} 
                  className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSelected 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleSmallCategorySelect(category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSmallCategorySelect(category);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`単元「${category.name}」を選択 - ${getDifficultyLabel(category.difficulty)} - 約${category.estimatedHours}時間`}
                  aria-pressed={isSelected}
                  aria-describedby={`small-desc-${category.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{category.name}</h4>
                      <p id={`small-desc-${category.id}`} className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                      <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded text-white text-xs ${difficultyColor}`}>
                          難易度 {category.difficulty}/10
                        </span>
                        <span className="text-gray-500 text-xs">
                          ⏱️ 約{category.estimatedHours}時間
                        </span>
                      </div>
                      {category.keywords.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {category.keywords.slice(0, 3).map(keyword => (
                              <span key={keyword} className="text-xs bg-gray-100 text-gray-700 px-1.5 sm:px-2 py-1 rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="text-blue-500 text-lg sm:text-xl ml-2 flex-shrink-0">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </KidsCard>
      )}

      {/* 学習開始ボタン */}
      {selectedSmallCategory && (
        <StudyStartButton
          subjectName="算数"
          topicName={`${selectedLargeCategory?.name} ＞ ${selectedMediumCategory?.name} ＞ ${selectedSmallCategory.name}`}
          estimatedTime={selectedSmallCategory.estimatedHours * 60}
          disabled={disabled}
          onStart={handleStartLearning}
        />
      )}

      {/* パンくずリスト */}
      {(selectedLargeCategory || selectedMediumCategory || selectedSmallCategory) && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1">
            <span className="text-blue-600 font-medium">算数</span>
            {selectedLargeCategory && (
              <>
                <span className="mx-1">&gt;</span>
                <span className="text-blue-600 font-medium truncate max-w-[120px] sm:max-w-none">{selectedLargeCategory.name}</span>
              </>
            )}
            {selectedMediumCategory && (
              <>
                <span className="mx-1">&gt;</span>
                <span className="text-blue-600 font-medium truncate max-w-[120px] sm:max-w-none">{selectedMediumCategory.name}</span>
              </>
            )}
            {selectedSmallCategory && (
              <>
                <span className="mx-1">&gt;</span>
                <span className="text-blue-600 font-medium truncate max-w-[120px] sm:max-w-none">{selectedSmallCategory.name}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalSubjectSelector;