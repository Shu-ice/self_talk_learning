import React, { useState, useMemo, useCallback } from 'react';
import { 
  HierarchicalSubject, 
  LargeCategory, 
  MediumCategory, 
  SmallCategory,
  MATH_HIERARCHICAL 
} from '../types/hierarchicalCurriculum';
import { KidsButton, KidsCard, StudyStartButton } from './ui/KidsUIComponents';
import { Subject, Topic } from '../types';

interface ImprovedHierarchicalSelectorProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled: boolean;
}

type SelectionStep = 'large' | 'medium' | 'small' | 'confirm';

interface SelectionState {
  step: SelectionStep;
  selectedLarge: LargeCategory | null;
  selectedMedium: MediumCategory | null;
  selectedSmall: SmallCategory | null;
}

const ImprovedHierarchicalSelector: React.FC<ImprovedHierarchicalSelectorProps> = ({ 
  onStartLearning, 
  disabled 
}) => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    step: 'large',
    selectedLarge: null,
    selectedMedium: null,
    selectedSmall: null
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<number | null>(null);
  const [recentSelections, setRecentSelections] = useState<string[]>(() => {
    const stored = localStorage.getItem('recent_topic_selections');
    return stored ? JSON.parse(stored) : [];
  });

  // 検索とフィルタリング
  const filteredItems = useMemo(() => {
    const { step, selectedLarge, selectedMedium } = selectionState;
    
    if (step === 'large') {
      return MATH_HIERARCHICAL.largeCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (step === 'medium' && selectedLarge) {
      return selectedLarge.mediumCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (step === 'small' && selectedMedium) {
      return selectedMedium.smallCategories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.keywords.some(keyword => 
                              keyword.toLowerCase().includes(searchTerm.toLowerCase())
                            );
        const matchesDifficulty = selectedDifficultyFilter === null || 
                                 Math.abs(category.difficulty - selectedDifficultyFilter) <= 1;
        return matchesSearch && matchesDifficulty;
      });
    }
    
    return [];
  }, [selectionState, searchTerm, selectedDifficultyFilter]);

  // 難易度ラベル
  const getDifficultyLabel = useCallback((difficulty: number): string => {
    if (difficulty <= 3) return '基礎';
    if (difficulty <= 6) return '標準';
    if (difficulty <= 8) return '応用';
    return '発展';
  }, []);

  // 難易度色
  const getDifficultyColor = useCallback((difficulty: number): string => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-blue-500';
    if (difficulty <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  }, []);

  // 選択ハンドラー
  const handleLargeSelect = useCallback((category: LargeCategory) => {
    console.log('大単元選択:', category.name);
    setSelectionState({
      step: 'medium',
      selectedLarge: category,
      selectedMedium: null,
      selectedSmall: null
    });
    setSearchTerm('');
  }, []);

  const handleMediumSelect = useCallback((category: MediumCategory) => {
    console.log('中単元選択:', category.name);
    setSelectionState(prev => ({
      ...prev,
      step: 'small',
      selectedMedium: category,
      selectedSmall: null
    }));
    setSearchTerm('');
  }, []);

  const handleSmallSelect = useCallback((category: SmallCategory) => {
    console.log('小単元選択:', category.name);
    setSelectionState(prev => ({
      ...prev,
      step: 'confirm',
      selectedSmall: category
    }));
    
    // 最近の選択に追加
    const newRecent = [category.id, ...recentSelections.filter(id => id !== category.id)].slice(0, 5);
    setRecentSelections(newRecent);
    localStorage.setItem('recent_topic_selections', JSON.stringify(newRecent));
  }, [recentSelections]);

  // 戻るボタン
  const handleBack = useCallback(() => {
    const { step } = selectionState;
    if (step === 'medium') {
      setSelectionState({
        step: 'large',
        selectedLarge: null,
        selectedMedium: null,
        selectedSmall: null
      });
    } else if (step === 'small') {
      setSelectionState(prev => ({
        ...prev,
        step: 'medium',
        selectedMedium: null,
        selectedSmall: null
      }));
    } else if (step === 'confirm') {
      setSelectionState(prev => ({
        ...prev,
        step: 'small',
        selectedSmall: null
      }));
    }
    setSearchTerm('');
  }, [selectionState]);

  // 学習開始
  const handleStartLearning = useCallback(() => {
    const { selectedSmall } = selectionState;
    if (!selectedSmall) return;

    console.log('学習開始:', selectedSmall.name);
    
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
      id: selectedSmall.id,
      name: selectedSmall.name,
      description: selectedSmall.description,
      subUnits: [],
      gradeLevel: ['5th'],
      estimatedHours: selectedSmall.estimatedHours,
      difficulty: selectedSmall.difficulty,
      examFrequency: {
        basic: 0.7,
        standard: 0.8,
        advanced: 0.9,
        elite: 1.0
      },
      learningObjectives: [selectedSmall.description]
    };

    onStartLearning(subject, topic);
  }, [selectionState, onStartLearning]);

  // ステップインジケーター
  const renderStepIndicator = () => {
    const steps = [
      { key: 'large', label: '大単元', icon: '📂' },
      { key: 'medium', label: '中単元', icon: '📁' },
      { key: 'small', label: '小単元', icon: '📄' },
      { key: 'confirm', label: '確認', icon: '✅' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === selectionState.step);

    return (
      <div className="flex items-center justify-center space-x-2 mb-6">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isClickable = index < currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              <button
                onClick={isClickable ? () => {
                  if (index === 0) setSelectionState({ step: 'large', selectedLarge: null, selectedMedium: null, selectedSmall: null });
                  else if (index === 1 && selectionState.selectedLarge) setSelectionState(prev => ({ ...prev, step: 'medium', selectedMedium: null, selectedSmall: null }));
                  else if (index === 2 && selectionState.selectedMedium) setSelectionState(prev => ({ ...prev, step: 'small', selectedSmall: null }));
                } : undefined}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-500 text-white scale-105' 
                    : isCompleted 
                    ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer' 
                    : 'bg-gray-200 text-gray-500'
                }`}
                disabled={!isClickable}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="font-medium text-sm">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`h-1 w-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // 検索バー
  const renderSearchBar = () => {
    if (selectionState.step === 'confirm') return null;

    return (
      <div className="mb-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder={`${selectionState.step === 'large' ? '大単元' : selectionState.step === 'medium' ? '中単元' : '小単元'}を検索...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
            🔍
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {selectionState.step === 'small' && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">難易度フィルター:</span>
            {[null, 3, 6, 8, 10].map(level => (
              <button
                key={level || 'all'}
                onClick={() => setSelectedDifficultyFilter(level)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedDifficultyFilter === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level === null ? 'すべて' : getDifficultyLabel(level)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // パンくずリスト
  const renderBreadcrumb = () => {
    const { selectedLarge, selectedMedium, selectedSmall } = selectionState;
    
    return (
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <div className="flex items-center flex-wrap gap-2 text-sm">
          <span className="text-blue-600 font-medium">📚 算数</span>
          {selectedLarge && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-blue-600 font-medium">{selectedLarge.name}</span>
            </>
          )}
          {selectedMedium && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-blue-600 font-medium">{selectedMedium.name}</span>
            </>
          )}
          {selectedSmall && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-blue-600 font-medium">{selectedSmall.name}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  // 大単元表示
  const renderLargeCategories = () => (
    <KidsCard title="📂 大単元を選んでね" icon="🗂️" color="purple">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((category: LargeCategory) => (
          <div
            key={category.id}
            onClick={() => handleLargeSelect(category)}
            className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
          >
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-md group-hover:shadow-lg group-hover:border-purple-400">
              <div className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-bold text-lg text-purple-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  {category.mediumCategories.length}個の中単元
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </KidsCard>
  );

  // 中単元表示
  const renderMediumCategories = () => (
    <KidsCard title={`📁 ${selectionState.selectedLarge?.name}の中単元`} icon="📁" color="blue">
      <p className="text-sm text-gray-600 mb-4">{selectionState.selectedLarge?.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredItems.map((category: MediumCategory) => (
          <KidsButton
            key={category.id}
            onClick={() => handleMediumSelect(category)}
            variant="secondary"
            size="medium"
            className="text-left justify-start h-auto p-4 hover:bg-blue-50"
          >
            <div>
              <div className="font-medium text-base mb-1">{category.name}</div>
              <div className="text-sm text-gray-500 mb-2">{category.description}</div>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs inline-block">
                {category.smallCategories.length}個の小単元
              </div>
            </div>
          </KidsButton>
        ))}
      </div>
    </KidsCard>
  );

  // 小単元表示
  const renderSmallCategories = () => (
    <KidsCard title={`📄 ${selectionState.selectedMedium?.name}の小単元`} icon="📄" color="green">
      <p className="text-sm text-gray-600 mb-4">{selectionState.selectedMedium?.description}</p>
      <div className="grid grid-cols-1 gap-3">
        {filteredItems.map((category: SmallCategory) => {
          const difficultyColor = getDifficultyColor(category.difficulty);
          const isRecent = recentSelections.includes(category.id);
          
          return (
            <div
              key={category.id}
              onClick={() => handleSmallSelect(category)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isRecent 
                  ? 'border-yellow-400 bg-yellow-50' 
                  : 'border-gray-200 hover:border-green-400 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-800">{category.name}</h4>
                    {isRecent && <span className="text-xs bg-yellow-400 text-yellow-800 px-2 py-1 rounded">最近選択</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${difficultyColor}`}>
                      {getDifficultyLabel(category.difficulty)} (Lv.{category.difficulty})
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      ⏱️ 約{category.estimatedHours}時間
                    </span>
                  </div>
                  
                  {category.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {category.keywords.slice(0, 3).map(keyword => (
                        <span key={keyword} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                      {category.keywords.length > 3 && (
                        <span className="text-xs text-gray-500">+{category.keywords.length - 3}個</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-green-500 text-xl">➤</div>
              </div>
            </div>
          );
        })}
      </div>
    </KidsCard>
  );

  // 確認画面
  const renderConfirmation = () => {
    const { selectedLarge, selectedMedium, selectedSmall } = selectionState;
    if (!selectedSmall) return null;

    const difficultyColor = getDifficultyColor(selectedSmall.difficulty);

    return (
      <KidsCard title="✅ 学習内容の確認" icon="🎯" color="green">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              {selectedSmall.name}
            </h2>
            <p className="text-green-700">{selectedSmall.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className={`inline-block px-3 py-1 rounded text-white text-sm ${difficultyColor}`}>
                {getDifficultyLabel(selectedSmall.difficulty)}
              </div>
              <div className="text-xs text-gray-500 mt-1">難易度レベル {selectedSmall.difficulty}</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="font-bold text-lg text-blue-600">{selectedSmall.estimatedHours}時間</div>
              <div className="text-xs text-gray-500">予想学習時間</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-bold text-lg text-purple-600">{selectedSmall.keywords.length}個</div>
              <div className="text-xs text-gray-500">学習キーワード</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-2">学習パス:</h4>
            <div className="bg-white p-3 rounded-lg text-sm">
              <span className="text-blue-600">{selectedLarge?.name}</span>
              <span className="text-gray-400 mx-2">→</span>
              <span className="text-blue-600">{selectedMedium?.name}</span>
              <span className="text-gray-400 mx-2">→</span>
              <span className="text-green-600 font-medium">{selectedSmall.name}</span>
            </div>
          </div>

          <StudyStartButton
            subjectName="算数"
            topicName={selectedSmall.name}
            estimatedTime={selectedSmall.estimatedHours * 60}
            disabled={disabled}
            onStart={handleStartLearning}
          />
        </div>
      </KidsCard>
    );
  };

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-sky-700 mb-4">🧮 算数の単元を選ぼう！</h2>
        <p className="text-lg text-slate-600">大単元から順番に選んでいくよ</p>
      </div>

      {/* ステップインジケーター */}
      {renderStepIndicator()}

      {/* パンくずリスト */}
      {(selectionState.selectedLarge || selectionState.selectedMedium || selectionState.selectedSmall) && renderBreadcrumb()}

      {/* 戻るボタン */}
      {selectionState.step !== 'large' && (
        <div className="flex justify-start">
          <KidsButton
            onClick={handleBack}
            variant="secondary"
            size="medium"
            icon="⬅️"
          >
            戻る
          </KidsButton>
        </div>
      )}

      {/* 検索バー */}
      {renderSearchBar()}

      {/* メインコンテンツ */}
      {selectionState.step === 'large' && renderLargeCategories()}
      {selectionState.step === 'medium' && renderMediumCategories()}
      {selectionState.step === 'small' && renderSmallCategories()}
      {selectionState.step === 'confirm' && renderConfirmation()}

      {/* 検索結果が空の場合 */}
      {filteredItems.length === 0 && searchTerm && selectionState.step !== 'confirm' && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">検索結果が見つかりません</h3>
          <p className="text-gray-600 mb-4">「{searchTerm}」に関する単元が見つかりませんでした</p>
          <KidsButton
            onClick={() => setSearchTerm('')}
            variant="primary"
            size="medium"
            icon="🔄"
          >
            検索をクリア
          </KidsButton>
        </div>
      )}
    </div>
  );
};

export default ImprovedHierarchicalSelector;