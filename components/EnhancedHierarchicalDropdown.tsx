import React, { useState, useEffect, useRef } from 'react';
import { Subject, Topic } from '../types';
import { SUBJECTS_DATA } from '../constants';

interface EnhancedHierarchicalDropdownProps {
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
  gradient: string;
  description: string;
}

// 中項目の定義（難易度やカテゴリで分類）
interface SubCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  topics: Topic[];
}

const EnhancedHierarchicalDropdown: React.FC<EnhancedHierarchicalDropdownProps> = ({
  onStartLearning,
  disabled = false,
  className = ''
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<'main' | 'sub' | 'topic' | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  // 大項目（教科）の設定
  const mainCategories: MainCategory[] = [
    {
      id: 'math',
      name: '算数',
      icon: '🧮',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      description: '数と計算の世界を探究'
    },
    {
      id: 'japanese',
      name: '国語',
      icon: '📖',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '言葉と文章の力を育成'
    },
    {
      id: 'science',
      name: '理科',
      icon: '🔬',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      description: '自然と科学の不思議を発見'
    },
    {
      id: 'social',
      name: '社会',
      icon: '🌍',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600',
      description: '歴史と地理の知識を習得'
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
            description: '四則演算・計算のきまり・筆算',
            icon: '🔢',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('計算') || t.name.includes('四則') || t.name.includes('小数') || 
              t.name.includes('分数') || t.name.includes('筆算') || t.name.includes('暗算')
            )
          },
          {
            id: 'geometry',
            name: '図形と空間',
            description: '平面図形・立体図形・角度',
            icon: '📐',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('図形') || t.name.includes('面積') || t.name.includes('体積') || 
              t.name.includes('角度') || t.name.includes('三角形') || t.name.includes('円')
            )
          },
          {
            id: 'measurement',
            name: '量と測定',
            description: '長さ・重さ・時間・単位変換',
            icon: '📏',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('単位') || t.name.includes('時間') || t.name.includes('長さ') || 
              t.name.includes('重さ') || t.name.includes('測定')
            )
          },
          {
            id: 'word_problems',
            name: '文章題・応用',
            description: '速さ・割合・比例・文章問題',
            icon: '📝',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('速さ') || t.name.includes('割合') || t.name.includes('比例') || 
              t.name.includes('文章') || t.name.includes('問題')
            )
          },
          {
            id: 'data_probability',
            name: 'データと確率',
            description: 'グラフ・表・確率・統計',
            icon: '📊',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('グラフ') || t.name.includes('表') || t.name.includes('確率') || 
              t.name.includes('統計') || t.name.includes('データ')
            )
          },
          {
            id: 'other_math',
            name: 'その他の算数',
            description: '上記に分類されない算数分野',
            icon: '🎯',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('計算') && !t.name.includes('四則') && !t.name.includes('小数') && 
              !t.name.includes('分数') && !t.name.includes('筆算') && !t.name.includes('暗算') &&
              !t.name.includes('図形') && !t.name.includes('面積') && !t.name.includes('体積') && 
              !t.name.includes('角度') && !t.name.includes('三角形') && !t.name.includes('円') &&
              !t.name.includes('単位') && !t.name.includes('時間') && !t.name.includes('長さ') && 
              !t.name.includes('重さ') && !t.name.includes('測定') &&
              !t.name.includes('速さ') && !t.name.includes('割合') && !t.name.includes('比例') && 
              !t.name.includes('文章') && !t.name.includes('問題') &&
              !t.name.includes('グラフ') && !t.name.includes('表') && !t.name.includes('確率') && 
              !t.name.includes('統計') && !t.name.includes('データ')
            )
          }
        ];

      case 'japanese':
        return [
          {
            id: 'reading_comprehension',
            name: '読解・読書',
            description: '物語文・説明文・論説文の読解',
            icon: '📚',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('読解') || t.name.includes('物語') || t.name.includes('説明文') || 
              t.name.includes('文章') || t.name.includes('読書') || t.name.includes('論説')
            )
          },
          {
            id: 'grammar_vocabulary',
            name: '文法・語彙',
            description: '漢字・語彙・文法・品詞',
            icon: '📝',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('漢字') || t.name.includes('語彙') || t.name.includes('文法') || 
              t.name.includes('品詞') || t.name.includes('熟語') || t.name.includes('ことわざ')
            )
          },
          {
            id: 'writing_expression',
            name: '作文・表現',
            description: '作文・記述・表現技法・詩',
            icon: '✍️',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('作文') || t.name.includes('記述') || t.name.includes('表現') || 
              t.name.includes('書く') || t.name.includes('詩') || t.name.includes('短歌')
            )
          },
          {
            id: 'classical_literature',
            name: '古典・文学',
            description: '古典文学・俳句・短歌・文学史',
            icon: '📜',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('古典') || t.name.includes('俳句') || t.name.includes('短歌') || 
              t.name.includes('文学') || t.name.includes('古文')
            )
          },
          {
            id: 'other_japanese',
            name: 'その他の国語',
            description: '上記に分類されない国語分野',
            icon: '🎭',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('読解') && !t.name.includes('物語') && !t.name.includes('説明文') && 
              !t.name.includes('文章') && !t.name.includes('読書') && !t.name.includes('論説') &&
              !t.name.includes('漢字') && !t.name.includes('語彙') && !t.name.includes('文法') && 
              !t.name.includes('品詞') && !t.name.includes('熟語') && !t.name.includes('ことわざ') &&
              !t.name.includes('作文') && !t.name.includes('記述') && !t.name.includes('表現') && 
              !t.name.includes('書く') && !t.name.includes('詩') && !t.name.includes('短歌') &&
              !t.name.includes('古典') && !t.name.includes('俳句') && !t.name.includes('文学') && 
              !t.name.includes('古文')
            )
          }
        ];

      case 'science':
        return [
          {
            id: 'physics',
            name: '物理・力学',
            description: '力・運動・光・音・電気',
            icon: '⚡',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('力') || t.name.includes('運動') || t.name.includes('光') || 
              t.name.includes('音') || t.name.includes('電気') || t.name.includes('磁石') ||
              t.name.includes('エネルギー')
            )
          },
          {
            id: 'chemistry',
            name: '化学・物質',
            description: '物質・燃焼・溶解・気体',
            icon: '🧪',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('物質') || t.name.includes('燃焼') || t.name.includes('溶解') || 
              t.name.includes('気体') || t.name.includes('液体') || t.name.includes('固体') ||
              t.name.includes('化学')
            )
          },
          {
            id: 'biology',
            name: '生物・生命',
            description: '植物・動物・人体・生命',
            icon: '🌱',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('植物') || t.name.includes('動物') || t.name.includes('人体') || 
              t.name.includes('生物') || t.name.includes('細胞') || t.name.includes('遺伝') ||
              t.name.includes('生命')
            )
          },
          {
            id: 'earth_science',
            name: '地学・天体',
            description: '天体・気象・地質・環境',
            icon: '🌍',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('天体') || t.name.includes('気象') || t.name.includes('地質') || 
              t.name.includes('星') || t.name.includes('地球') || t.name.includes('天気') ||
              t.name.includes('環境')
            )
          },
          {
            id: 'other_science',
            name: 'その他の理科',
            description: '上記に分類されない理科分野',
            icon: '🔬',
            topics: selectedSubject.topics.filter(t => 
              !t.name.includes('力') && !t.name.includes('運動') && !t.name.includes('光') && 
              !t.name.includes('音') && !t.name.includes('電気') && !t.name.includes('磁石') &&
              !t.name.includes('エネルギー') &&
              !t.name.includes('物質') && !t.name.includes('燃焼') && !t.name.includes('溶解') && 
              !t.name.includes('気体') && !t.name.includes('液体') && !t.name.includes('固体') &&
              !t.name.includes('化学') &&
              !t.name.includes('植物') && !t.name.includes('動物') && !t.name.includes('人体') && 
              !t.name.includes('生物') && !t.name.includes('細胞') && !t.name.includes('遺伝') &&
              !t.name.includes('生命') &&
              !t.name.includes('天体') && !t.name.includes('気象') && !t.name.includes('地質') && 
              !t.name.includes('星') && !t.name.includes('地球') && !t.name.includes('天気') &&
              !t.name.includes('環境')
            )
          }
        ];

      case 'social':
        return [
          {
            id: 'japanese_history',
            name: '日本史',
            description: '古代から現代までの日本の歴史',
            icon: '🏯',
            topics: selectedSubject.topics.filter(t => 
              (t.name.includes('歴史') || t.name.includes('時代') || t.name.includes('年代') || 
              t.name.includes('戦国') || t.name.includes('江戸') || t.name.includes('明治') || 
              t.name.includes('昭和') || t.name.includes('平安') || t.name.includes('鎌倉') ||
              t.name.includes('室町') || t.name.includes('大正')) && 
              !t.name.includes('世界')
            )
          },
          {
            id: 'world_history',
            name: '世界史・国際',
            description: '世界の歴史・国際関係',
            icon: '🌐',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('世界') && (t.name.includes('歴史') || t.name.includes('文明') ||
              t.name.includes('国際') || t.name.includes('戦争'))
            )
          },
          {
            id: 'japanese_geography',
            name: '日本地理',
            description: '日本の地形・気候・都道府県',
            icon: '🗾',
            topics: selectedSubject.topics.filter(t => 
              (t.name.includes('地理') || t.name.includes('地形') || t.name.includes('気候') || 
              t.name.includes('都道府県') || t.name.includes('山地') || t.name.includes('平野') || 
              t.name.includes('川') || t.name.includes('県') || t.name.includes('地方')) &&
              !t.name.includes('世界')
            )
          },
          {
            id: 'world_geography',
            name: '世界地理',
            description: '世界の地形・気候・各国',
            icon: '🗺️',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('世界') && (t.name.includes('地理') || t.name.includes('地形') ||
              t.name.includes('気候') || t.name.includes('大陸') || t.name.includes('国'))
            )
          },
          {
            id: 'politics_civics',
            name: '政治・公民',
            description: '政治制度・憲法・公民・経済',
            icon: '🏛️',
            topics: selectedSubject.topics.filter(t => 
              t.name.includes('政治') || t.name.includes('憲法') || t.name.includes('公民') || 
              t.name.includes('選挙') || t.name.includes('法律') || t.name.includes('制度') ||
              t.name.includes('経済') || t.name.includes('税金')
            )
          },
          {
            id: 'other_social',
            name: 'その他の社会',
            description: '上記に分類されない社会分野',
            icon: '📋',
            topics: selectedSubject.topics.filter(t => 
              !(t.name.includes('歴史') || t.name.includes('時代') || t.name.includes('年代') || 
                t.name.includes('戦国') || t.name.includes('江戸') || t.name.includes('明治') || 
                t.name.includes('昭和') || t.name.includes('平安') || t.name.includes('鎌倉') ||
                t.name.includes('室町') || t.name.includes('大正')) &&
              !(t.name.includes('世界') && (t.name.includes('歴史') || t.name.includes('文明') ||
                t.name.includes('国際') || t.name.includes('戦争'))) &&
              !(t.name.includes('地理') || t.name.includes('地形') || t.name.includes('気候') || 
                t.name.includes('都道府県') || t.name.includes('山地') || t.name.includes('平野') || 
                t.name.includes('川') || t.name.includes('県') || t.name.includes('地方')) &&
              !(t.name.includes('世界') && (t.name.includes('地理') || t.name.includes('地形') ||
                t.name.includes('気候') || t.name.includes('大陸') || t.name.includes('国'))) &&
              !t.name.includes('政治') && !t.name.includes('憲法') && !t.name.includes('公民') && 
              !t.name.includes('選挙') && !t.name.includes('法律') && !t.name.includes('制度') &&
              !t.name.includes('経済') && !t.name.includes('税金')
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

  // 検索機能
  const filteredMainCategories = mainCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTopics = availableTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 選択リセット
  const resetSelection = (level: 'sub' | 'topic') => {
    if (level === 'sub') {
      setSelectedSubCategory('');
      setSelectedTopic('');
    } else if (level === 'topic') {
      setSelectedTopic('');
    }
  };

  // モーダル外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(null);
        setSearchTerm('');
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(null);
        setSearchTerm('');
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  // 学習開始
  const handleStartLearning = () => {
    if (selectedSubject && selectedTopicData) {
      onStartLearning(selectedSubject, selectedTopicData);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 relative overflow-visible ${className}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">学習内容を選択</h2>
        <p className="text-gray-600 text-lg">大項目→中項目→小項目の順に選んでください</p>
      </div>

      <div className="space-y-6">
        {/* 進捗インジケーター */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              selectedMainCategory ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <span className="text-sm font-bold">1</span>
            </div>
            <div className={`w-12 h-1 rounded transition-all duration-300 ${
              selectedMainCategory ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              selectedSubCategory ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <span className="text-sm font-bold">2</span>
            </div>
            <div className={`w-12 h-1 rounded transition-all duration-300 ${
              selectedSubCategory ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              selectedTopic ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <span className="text-sm font-bold">3</span>
            </div>
          </div>
        </div>

        {/* 選択ボタン達 */}
        <div className="space-y-4">
          {/* 1️⃣ 大項目（教科）選択 */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700 flex items-center">
              <span className="mr-2">1️⃣</span>
              教科を選択
            </label>
            <button
              onClick={() => {
                setIsModalOpen('main');
                setSearchTerm('');
              }}
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl px-6 py-4 text-left focus:outline-none focus:border-blue-500 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              disabled={disabled}
            >
              {selectedMainCategory ? (
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${mainCategories.find(c => c.id === selectedMainCategory)?.gradient} flex items-center justify-center`}>
                    <span className="text-xl">{mainCategories.find(c => c.id === selectedMainCategory)?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl text-gray-800">{mainCategories.find(c => c.id === selectedMainCategory)?.name}</div>
                    <div className="text-gray-600">{mainCategories.find(c => c.id === selectedMainCategory)?.description}</div>
                  </div>
                  <div className="text-blue-500 text-2xl">📝</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3 text-gray-500 py-4">
                  <span className="text-3xl">🎯</span>
                  <span className="text-xl font-medium">教科を選択してください</span>
                </div>
              )}
            </button>
          </div>

          {/* 2️⃣ 中項目選択 */}
          {selectedMainCategory && (
            <div className="space-y-2 animate-fadeIn">
              <label className="block text-lg font-semibold text-gray-700 flex items-center">
                <span className="mr-2">2️⃣</span>
                分野を選択
              </label>
              <button
                onClick={() => {
                  setIsModalOpen('sub');
                  setSearchTerm('');
                }}
                className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl px-6 py-4 text-left focus:outline-none focus:border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                disabled={disabled}
              >
                {selectedSubCategory ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-xl">{selectedSubCategoryData?.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl text-gray-800">{selectedSubCategoryData?.name}</div>
                      <div className="text-gray-600">{selectedSubCategoryData?.description}</div>
                      <div className="text-sm text-purple-600 font-medium mt-1">
                        {selectedSubCategoryData?.topics.length}個の単元
                      </div>
                    </div>
                    <div className="text-purple-500 text-2xl">📋</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3 text-gray-500 py-4">
                    <span className="text-3xl">📂</span>
                    <span className="text-xl font-medium">分野を選択してください</span>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* 3️⃣ 小項目（単元）選択 */}
          {selectedSubCategory && availableTopics.length > 0 && (
            <div className="space-y-2 animate-fadeIn">
              <label className="block text-lg font-semibold text-gray-700 flex items-center">
                <span className="mr-2">3️⃣</span>
                単元を選択
              </label>
              <button
                onClick={() => {
                  setIsModalOpen('topic');
                  setSearchTerm('');
                }}
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-6 py-4 text-left focus:outline-none focus:border-green-500 hover:border-green-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                disabled={disabled}
              >
                {selectedTopic ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-xl">📖</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl text-gray-800">{selectedTopicData?.name}</div>
                      <div className="text-gray-600">{selectedTopicData?.description}</div>
                    </div>
                    <div className="text-green-500 text-2xl">✅</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3 text-gray-500 py-4">
                    <span className="text-3xl">📝</span>
                    <span className="text-xl font-medium">単元を選択してください</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 学習開始ボタン */}
        {selectedMainCategory && selectedSubCategory && selectedTopic && (
          <div className="pt-8 animate-fadeIn">
            <button
              onClick={handleStartLearning}
              disabled={disabled}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-6 px-8 rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl animate-bounce">🚀</span>
                <div>
                  <div className="text-2xl font-bold">学習を開始する</div>
                  <div className="text-sm mt-1 opacity-90">
                    {mainCategories.find(c => c.id === selectedMainCategory)?.name} → {selectedSubCategoryData?.name} → {selectedTopicData?.name}
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* モーダルオーバーレイ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* モーダルヘッダー */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {isModalOpen === 'main' && '📚 教科を選択'}
                  {isModalOpen === 'sub' && '📂 分野を選択'}
                  {isModalOpen === 'topic' && '📝 単元を選択'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(null);
                    setSearchTerm('');
                  }}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>
              
              {/* 検索バー */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* モーダルコンテンツ */}
            <div className="overflow-y-auto max-h-96 p-6">
              {isModalOpen === 'main' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMainCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedMainCategory(category.id);
                        resetSelection('sub');
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="p-6 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-all rounded-xl border-2 border-transparent hover:border-blue-200 transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center`}>
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div>
                          <div className="font-bold text-xl text-gray-800">{category.name}</div>
                          <div className="text-gray-600">{category.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isModalOpen === 'sub' && (
                <div className="space-y-3">
                  {filteredSubCategories.map(subCategory => (
                    <button
                      key={subCategory.id}
                      onClick={() => {
                        setSelectedSubCategory(subCategory.id);
                        resetSelection('topic');
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="w-full p-4 text-left hover:bg-purple-50 focus:outline-none focus:bg-purple-50 transition-all rounded-xl border-2 border-transparent hover:border-purple-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                          <span className="text-xl">{subCategory.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-800">{subCategory.name}</div>
                          <div className="text-gray-600">{subCategory.description}</div>
                          <div className="text-sm text-purple-600 font-medium mt-1">
                            {subCategory.topics.length}個の単元
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isModalOpen === 'topic' && (
                <div className="space-y-2">
                  {filteredTopics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="w-full p-4 text-left hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-all rounded-xl border-2 border-transparent hover:border-green-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                          <span className="text-lg">📖</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-800">{topic.name}</div>
                          <div className="text-gray-600 text-sm">{topic.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EnhancedHierarchicalDropdown;