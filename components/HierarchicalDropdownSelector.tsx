import React, { useState, useEffect } from 'react';
import { Subject, Topic } from '../types';
import { SUBJECTS_DATA } from '../constants';

interface HierarchicalDropdownSelectorProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled?: boolean;
  className?: string;
}

// 大項目（教科）の定義
interface MainCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// 中項目の定義（難易度やカテゴリで分類）
interface SubCategory {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
}

const HierarchicalDropdownSelector: React.FC<HierarchicalDropdownSelectorProps> = ({
  onStartLearning,
  disabled = false,
  className = ''
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isOpen, setIsOpen] = useState<'main' | 'sub' | 'topic' | null>(null);

  // 大項目（教科）の設定
  const mainCategories: MainCategory[] = [
    {
      id: 'math',
      name: '算数',
      icon: '🧮',
      color: 'bg-blue-500',
      description: '数と計算の世界'
    },
    {
      id: 'japanese',
      name: '国語',
      icon: '📖',
      color: 'bg-red-500',
      description: '言葉と文章の力'
    },
    {
      id: 'science',
      name: '理科',
      icon: '🔬',
      color: 'bg-purple-500',
      description: '自然と科学の探究'
    },
    {
      id: 'social',
      name: '社会',
      icon: '🌍',
      color: 'bg-green-500',
      description: '歴史と地理の学習'
    }
  ];

  // 選択された教科の取得
  const selectedSubject = SUBJECTS_DATA.find(s => s.id === selectedMainCategory);

  // 中項目の生成（トピックを難易度やカテゴリで分類）
  const getSubCategories = (): SubCategory[] => {
    if (!selectedSubject) return [];

    // 教科ごとの分類ロジック
    switch (selectedMainCategory) {
      case 'math':
        return [
          {
            id: 'basic_calculation',
            name: '計算の基礎',
            description: '四則演算・計算のきまり',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('計算') || t.name.includes('四則') || t.name.includes('小数') || t.name.includes('分数')
            )
          },
          {
            id: 'geometry',
            name: '図形',
            description: '平面図形・立体図形',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('図形') || t.name.includes('面積') || t.name.includes('体積') || t.name.includes('角度')
            )
          },
          {
            id: 'measurement',
            name: '量と測定',
            description: '長さ・重さ・時間・単位',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('単位') || t.name.includes('時間') || t.name.includes('長さ') || t.name.includes('重さ')
            )
          },
          {
            id: 'word_problems',
            name: '文章題',
            description: '速さ・割合・比例など',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('速さ') || t.name.includes('割合') || t.name.includes('比例') || t.name.includes('文章')
            )
          },
          {
            id: 'other_math',
            name: 'その他',
            description: '上記以外の算数分野',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('計算') && !t.name.includes('四則') && !t.name.includes('小数') && 
              !t.name.includes('分数') && !t.name.includes('図形') && !t.name.includes('面積') && 
              !t.name.includes('体積') && !t.name.includes('角度') && !t.name.includes('単位') && 
              !t.name.includes('時間') && !t.name.includes('長さ') && !t.name.includes('重さ') && 
              !t.name.includes('速さ') && !t.name.includes('割合') && !t.name.includes('比例') && 
              !t.name.includes('文章')
            )
          }
        ];

      case 'japanese':
        return [
          {
            id: 'reading_comprehension',
            name: '読解',
            description: '物語文・説明文の読解',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('読解') || t.name.includes('物語') || t.name.includes('説明文') || t.name.includes('文章')
            )
          },
          {
            id: 'grammar',
            name: '文法・語彙',
            description: '漢字・語彙・文法',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('漢字') || t.name.includes('語彙') || t.name.includes('文法') || t.name.includes('品詞')
            )
          },
          {
            id: 'writing',
            name: '作文・表現',
            description: '作文・記述・表現技法',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('作文') || t.name.includes('記述') || t.name.includes('表現') || t.name.includes('書く')
            )
          },
          {
            id: 'other_japanese',
            name: 'その他',
            description: '上記以外の国語分野',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('読解') && !t.name.includes('物語') && !t.name.includes('説明文') && 
              !t.name.includes('文章') && !t.name.includes('漢字') && !t.name.includes('語彙') && 
              !t.name.includes('文法') && !t.name.includes('品詞') && !t.name.includes('作文') && 
              !t.name.includes('記述') && !t.name.includes('表現') && !t.name.includes('書く')
            )
          }
        ];

      case 'science':
        return [
          {
            id: 'physics',
            name: '物理',
            description: '力・運動・光・音など',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('力') || t.name.includes('運動') || t.name.includes('光') || t.name.includes('音') || 
              t.name.includes('電気') || t.name.includes('磁石')
            )
          },
          {
            id: 'chemistry',
            name: '化学',
            description: '物質・燃焼・溶解など',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('物質') || t.name.includes('燃焼') || t.name.includes('溶解') || t.name.includes('気体') || 
              t.name.includes('液体') || t.name.includes('固体')
            )
          },
          {
            id: 'biology',
            name: '生物',
            description: '植物・動物・人体など',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('植物') || t.name.includes('動物') || t.name.includes('人体') || t.name.includes('生物') || 
              t.name.includes('細胞') || t.name.includes('遺伝')
            )
          },
          {
            id: 'earth_science',
            name: '地学',
            description: '天体・気象・地質など',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('天体') || t.name.includes('気象') || t.name.includes('地質') || t.name.includes('星') || 
              t.name.includes('地球') || t.name.includes('天気')
            )
          },
          {
            id: 'other_science',
            name: 'その他',
            description: '上記以外の理科分野',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('力') && !t.name.includes('運動') && !t.name.includes('光') && 
              !t.name.includes('音') && !t.name.includes('電気') && !t.name.includes('磁石') && 
              !t.name.includes('物質') && !t.name.includes('燃焼') && !t.name.includes('溶解') && 
              !t.name.includes('気体') && !t.name.includes('液体') && !t.name.includes('固体') && 
              !t.name.includes('植物') && !t.name.includes('動物') && !t.name.includes('人体') && 
              !t.name.includes('生物') && !t.name.includes('細胞') && !t.name.includes('遺伝') && 
              !t.name.includes('天体') && !t.name.includes('気象') && !t.name.includes('地質') && 
              !t.name.includes('星') && !t.name.includes('地球') && !t.name.includes('天気')
            )
          }
        ];

      case 'social':
        return [
          {
            id: 'history',
            name: '歴史',
            description: '日本史・世界史',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('歴史') || t.name.includes('時代') || t.name.includes('年代') || t.name.includes('戦国') || 
              t.name.includes('江戸') || t.name.includes('明治') || t.name.includes('昭和')
            )
          },
          {
            id: 'geography',
            name: '地理',
            description: '日本地理・世界地理',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('地理') || t.name.includes('地形') || t.name.includes('気候') || t.name.includes('都道府県') || 
              t.name.includes('山地') || t.name.includes('平野') || t.name.includes('川')
            )
          },
          {
            id: 'politics',
            name: '政治・公民',
            description: '政治制度・憲法・公民',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('政治') || t.name.includes('憲法') || t.name.includes('公民') || t.name.includes('選挙') || 
              t.name.includes('法律') || t.name.includes('制度')
            )
          },
          {
            id: 'other_social',
            name: 'その他',
            description: '上記以外の社会分野',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('歴史') && !t.name.includes('時代') && !t.name.includes('年代') && 
              !t.name.includes('戦国') && !t.name.includes('江戸') && !t.name.includes('明治') && 
              !t.name.includes('昭和') && !t.name.includes('地理') && !t.name.includes('地形') && 
              !t.name.includes('気候') && !t.name.includes('都道府県') && !t.name.includes('山地') && 
              !t.name.includes('平野') && !t.name.includes('川') && !t.name.includes('政治') && 
              !t.name.includes('憲法') && !t.name.includes('公民') && !t.name.includes('選挙') && 
              !t.name.includes('法律') && !t.name.includes('制度')
            )
          }
        ];

      default:
        return [];
    }
  };

  const subCategories = getSubCategories();
  const selectedSubCategoryData = subCategories.find(sc => sc.id === selectedSubCategory);
  const availableTopics = selectedSubCategoryData?.topics || [];
  const selectedTopicData = availableTopics.find(t => t.id === selectedTopic);

  // 選択リセット
  const resetSelection = (level: 'sub' | 'topic') => {
    if (level === 'sub') {
      setSelectedSubCategory('');
      setSelectedTopic('');
    } else if (level === 'topic') {
      setSelectedTopic('');
    }
  };

  // 学習開始
  const handleStartLearning = () => {
    if (selectedSubject && selectedTopicData) {
      onStartLearning(selectedSubject, selectedTopicData);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📚 学習内容を選択</h2>
        <p className="text-gray-600">大項目→中項目→小項目の順に選んでください</p>
      </div>

      <div className="space-y-4">
        {/* 大項目（教科）選択 */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1️⃣ 教科を選択
          </label>
          <button
            onClick={() => setIsOpen(isOpen === 'main' ? null : 'main')}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:border-blue-500 hover:border-gray-400 transition-colors"
            disabled={disabled}
          >
            {selectedMainCategory ? (
              <div className="flex items-center space-x-3">
                <span className="text-xl">{mainCategories.find(c => c.id === selectedMainCategory)?.icon}</span>
                <span className="font-medium">{mainCategories.find(c => c.id === selectedMainCategory)?.name}</span>
                <span className="text-gray-500 text-sm">
                  {mainCategories.find(c => c.id === selectedMainCategory)?.description}
                </span>
              </div>
            ) : (
              <span className="text-gray-500">教科を選択してください</span>
            )}
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isOpen === 'main' ? '🔼' : '🔽'}
            </span>
          </button>

          {isOpen === 'main' && (
            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {mainCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedMainCategory(category.id);
                    resetSelection('sub');
                    setIsOpen(null);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 中項目選択 */}
        {selectedMainCategory && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2️⃣ 分野を選択
            </label>
            <button
              onClick={() => setIsOpen(isOpen === 'sub' ? null : 'sub')}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:border-blue-500 hover:border-gray-400 transition-colors"
              disabled={disabled}
            >
              {selectedSubCategory ? (
                <div>
                  <div className="font-medium">{selectedSubCategoryData?.name}</div>
                  <div className="text-sm text-gray-500">{selectedSubCategoryData?.description}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {selectedSubCategoryData?.topics.length}個の単元
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">分野を選択してください</span>
              )}
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isOpen === 'sub' ? '🔼' : '🔽'}
              </span>
            </button>

            {isOpen === 'sub' && subCategories.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {subCategories.map(subCategory => (
                  <button
                    key={subCategory.id}
                    onClick={() => {
                      setSelectedSubCategory(subCategory.id);
                      resetSelection('topic');
                      setIsOpen(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{subCategory.name}</div>
                    <div className="text-sm text-gray-500">{subCategory.description}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {subCategory.topics.length}個の単元
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 小項目（単元）選択 */}
        {selectedSubCategory && availableTopics.length > 0 && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3️⃣ 単元を選択
            </label>
            <button
              onClick={() => setIsOpen(isOpen === 'topic' ? null : 'topic')}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:border-blue-500 hover:border-gray-400 transition-colors"
              disabled={disabled}
            >
              {selectedTopic ? (
                <div>
                  <div className="font-medium">{selectedTopicData?.name}</div>
                  <div className="text-sm text-gray-500">{selectedTopicData?.description}</div>
                </div>
              ) : (
                <span className="text-gray-500">単元を選択してください</span>
              )}
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isOpen === 'topic' ? '🔼' : '🔽'}
              </span>
            </button>

            {isOpen === 'topic' && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {availableTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setIsOpen(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-sm text-gray-500">{topic.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 学習開始ボタン */}
        {selectedMainCategory && selectedSubCategory && selectedTopic && (
          <div className="pt-4">
            <button
              onClick={handleStartLearning}
              disabled={disabled}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">🚀</span>
                <span>学習を開始する</span>
              </div>
              <div className="text-sm mt-1 opacity-90">
                {mainCategories.find(c => c.id === selectedMainCategory)?.name} → {selectedSubCategoryData?.name} → {selectedTopicData?.name}
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 背景クリックで閉じる */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(null)}
        />
      )}
    </div>
  );
};

export default HierarchicalDropdownSelector;