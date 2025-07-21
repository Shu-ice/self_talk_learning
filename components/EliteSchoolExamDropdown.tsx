import React, { useState, useEffect, useRef } from 'react';
import { Subject, Topic } from '../types';
import { SUBJECTS_DATA } from '../constants';

interface EliteSchoolExamDropdownProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled?: boolean;
  className?: string;
}

// 最難関受験に特化した教科情報
interface ExamSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

// 最難関受験に特化した分野情報
interface ExamCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  keywords: string[]; // フィルタリング用キーワード
  excludeKeywords?: string[]; // 除外キーワード
}

const EliteSchoolExamDropdown: React.FC<EliteSchoolExamDropdownProps> = ({
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

  // 最難関受験に特化した教科設定
  const examSubjects: ExamSubject[] = [
    {
      id: 'math',
      name: '算数',
      icon: '🧮',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '最難関校レベルの数学的思考力'
    },
    {
      id: 'japanese',
      name: '国語',
      icon: '📖',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '最難関校レベルの言語能力'
    },
    {
      id: 'science',
      name: '理科',
      icon: '🔬',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '最難関校レベルの科学的探究力'
    },
    {
      id: 'social',
      name: '社会',
      icon: '🌍',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '最難関校レベルの社会分析力'
    }
  ];

  // 選択された教科の取得
  const selectedSubject = SUBJECTS_DATA.find(s => s.id === selectedMainCategory);

  // 最難関受験に特化した分野分類（より高度なカテゴリ）
  const getExamCategories = (): ExamCategory[] => {
    if (!selectedSubject) return [];

    switch (selectedMainCategory) {
      case 'math':
        return [
          {
            id: 'advanced_calculation',
            name: '高度な計算技法',
            description: '複雑な計算・数の性質・高度な四則演算',
            icon: '🔢',
            keywords: ['計算', '四則', '分数', '小数', '整数', '約数', '倍数', '公約数', '公倍数', '素数', '最大', '最小'],
            excludeKeywords: ['基本', '簡単']
          },
          {
            id: 'complex_geometry',
            name: '発展的図形問題',
            description: '複雑な図形・立体の切断・回転・展開図',
            icon: '📐',
            keywords: ['図形', '面積', '体積', '角度', '三角形', '円', '立体', '切断', '回転', '展開', '相似', '合同'],
            excludeKeywords: ['基本図形']
          },
          {
            id: 'advanced_word_problems',
            name: '超難関文章題',
            description: '多段階思考・複合条件・創造的解法が必要な問題',
            icon: '📝',
            keywords: ['速さ', '時間', '距離', '仕事算', '鶴亀', '旅人算', '流水算', '通過算', '時計算', '年齢算', '植木算'],
            excludeKeywords: ['基本']
          },
          {
            id: 'logical_thinking',
            name: '論理的思考問題',
            description: '場合の数・推理・パズル的思考',
            icon: '🧩',
            keywords: ['場合の数', '順列', '組み合わせ', '論理', '推理', 'パズル', '規則性'],
            excludeKeywords: ['確率', '統計']
          },
          {
            id: 'special_techniques',
            name: '特殊算・高等技法',
            description: '中学入試特有の特殊な解法技術',
            icon: '⚡',
            keywords: ['特殊算', '和差算', '倍数算', '相当算', '過不足算', '方陣算', '消去算'],
            excludeKeywords: []
          }
        ];

      case 'japanese':
        return [
          {
            id: 'advanced_reading',
            name: '高度な読解問題',
            description: '複雑な文章構造・抽象的内容の読解',
            icon: '📚',
            keywords: ['読解', '文章', '論理', '構造', '主張', '根拠', '要約', '内容', '心情'],
            excludeKeywords: ['基本', '簡単']
          },
          {
            id: 'advanced_vocabulary',
            name: '高度な語彙・文法',
            description: '難解な語彙・複雑な文法・敬語の応用',
            icon: '📝',
            keywords: ['語彙', '漢字', '文法', '敬語', '慣用句', 'ことわざ', '四字熟語', '品詞'],
            excludeKeywords: ['基本漢字']
          },
          {
            id: 'creative_writing',
            name: '創造的表現・記述',
            description: '高度な作文・記述・表現技法',
            icon: '✍️',
            keywords: ['作文', '記述', '表現', '創作', '意見文', '説明文'],
            excludeKeywords: []
          },
          {
            id: 'literature_analysis',
            name: '文学的分析',
            description: '詩・短歌・俳句・古典の深い理解',
            icon: '🎭',
            keywords: ['詩', '短歌', '俳句', '古典', '文学', '表現技法', '修辞'],
            excludeKeywords: []
          },
          {
            id: 'critical_thinking',
            name: '批判的思考・論理構成',
            description: '論理的思考・批判的読解・議論の組み立て',
            icon: '🧠',
            keywords: ['論理', '批判', '議論', '根拠', '反論', '構成'],
            excludeKeywords: []
          }
        ];

      case 'science':
        return [
          {
            id: 'advanced_physics',
            name: '高度な物理現象',
            description: '複雑な力学・電気・光・音の応用問題',
            icon: '⚡',
            keywords: ['力', '運動', '電気', '光', '音', 'てこ', 'ばね', '振り子', '滑車', '輪軸'],
            excludeKeywords: ['基本']
          },
          {
            id: 'advanced_chemistry',
            name: '発展的化学変化',
            description: '複雑な物質変化・燃焼・溶解の応用',
            icon: '🧪',
            keywords: ['物質', '変化', '燃焼', '溶解', '蒸発', '凝固', '反応', '混合'],
            excludeKeywords: ['基本実験']
          },
          {
            id: 'advanced_biology',
            name: '生物の複雑なしくみ',
            description: '動植物の高度な生命現象・生態系',
            icon: '🌱',
            keywords: ['植物', '動物', '人体', '生態', '環境', '食物連鎖', '適応'],
            excludeKeywords: ['基本的な体のつくり']
          },
          {
            id: 'earth_space_advanced',
            name: '地球・宇宙の探究',
            description: '天体運動・地層・気象の複雑な現象',
            icon: '🌍',
            keywords: ['天体', '地層', '気象', '地震', '火山', '季節', '月', '星'],
            excludeKeywords: ['基本的な季節の変化']
          },
          {
            id: 'experimental_thinking',
            name: '実験的思考・探究',
            description: '仮説設定・実験計画・データ分析',
            icon: '🔍',
            keywords: ['実験', '観察', '仮説', 'データ', '分析', '考察', '探究'],
            excludeKeywords: []
          }
        ];

      case 'social':
        return [
          {
            id: 'advanced_history',
            name: '高度な歴史分析',
            description: '歴史の流れ・因果関係・多角的視点',
            icon: '🏯',
            keywords: ['歴史', '古代', '中世', '近世', '近代', '現代', '因果関係', '歴史の流れ'],
            excludeKeywords: ['基本的な年代暗記']
          },
          {
            id: 'advanced_geography',
            name: '発展的地理・地形',
            description: '複雑な地形・気候・産業の相互関係',
            icon: '🗾',
            keywords: ['地形', '気候', '産業', '都道府県', '地域', '特色', '結びつき'],
            excludeKeywords: ['基本的な県名']
          },
          {
            id: 'political_systems',
            name: '政治・経済のしくみ',
            description: '政治制度・経済活動の複雑な関係',
            icon: '🏛️',
            keywords: ['政治', '経済', '憲法', '権利', '義務', '選挙', '税金', '国際'],
            excludeKeywords: []
          },
          {
            id: 'global_perspective',
            name: '国際理解・世界情勢',
            description: '世界の国々・国際関係・グローバル化',
            icon: '🌐',
            keywords: ['世界', '国際', 'グローバル', '文化', '宗教', '民族', '外交'],
            excludeKeywords: []
          },
          {
            id: 'critical_social_thinking',
            name: '社会的思考・問題解決',
            description: '社会問題・環境問題・未来への提案',
            icon: '💡',
            keywords: ['社会問題', '環境', '人権', '平和', '持続可能', '未来'],
            excludeKeywords: []
          }
        ];

      default:
        return [];
    }
  };

  const examCategories = getExamCategories();

  // トピックフィルタリング（最難関レベルに適したもののみ）
  const getFilteredTopics = (): Topic[] => {
    if (!selectedSubject || !selectedSubCategory) return [];

    const selectedCategory = examCategories.find(cat => cat.id === selectedSubCategory);
    if (!selectedCategory) return [];

    return selectedSubject.topics.filter(topic => {
      // 除外キーワードチェック
      if (selectedCategory.excludeKeywords) {
        const hasExcludeKeyword = selectedCategory.excludeKeywords.some(keyword =>
          topic.name.includes(keyword) || topic.description.includes(keyword)
        );
        if (hasExcludeKeyword) return false;
      }

      // 含有キーワードチェック
      return selectedCategory.keywords.some(keyword =>
        topic.name.includes(keyword) || topic.description.includes(keyword)
      );
    });
  };

  const availableTopics = getFilteredTopics();
  const selectedTopicData = availableTopics.find(t => t.id === selectedTopic);

  // 検索機能
  const filteredExamSubjects = examSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExamCategories = examCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  // モーダル制御
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(null);
        setSearchTerm('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(null);
        setSearchTerm('');
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // 学習開始
  const handleStartLearning = () => {
    if (selectedSubject && selectedTopicData) {
      onStartLearning(selectedSubject, selectedTopicData);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-2xl p-8 border border-red-100 ${className}`}>
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
          <span className="text-3xl">👑</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">最難関校受験 学習内容選択</h2>
        <p className="text-gray-600 text-lg">超高度な思考力を要求する最難関レベル</p>
        <div className="text-sm text-red-600 mt-2 font-medium">
          ✨ 灘・開成・筑駒・桜蔭レベル ✨ 創造的思考重視 ✨
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
            selectedMainCategory ? 'bg-gradient-to-r from-red-500 to-red-600 text-white transform scale-110' : 'bg-gray-200 text-gray-400'
          }`}>
            <span className="font-bold">1</span>
          </div>
          <div className={`w-16 h-2 rounded-full transition-all duration-300 ${
            selectedMainCategory ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
          }`} />
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
            selectedSubCategory ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white transform scale-110' : 'bg-gray-200 text-gray-400'
          }`}>
            <span className="font-bold">2</span>
          </div>
          <div className={`w-16 h-2 rounded-full transition-all duration-300 ${
            selectedSubCategory ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gray-200'
          }`} />
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
            selectedTopic ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white transform scale-110' : 'bg-gray-200 text-gray-400'
          }`}>
            <span className="font-bold">3</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1️⃣ 教科選択 */}
        <div className="space-y-3">
          <label className="block text-xl font-bold text-gray-700 flex items-center">
            <span className="mr-3 text-2xl">1️⃣</span>
            教科を選択
          </label>
          <button
            onClick={() => {
              setIsModalOpen('main');
              setSearchTerm('');
            }}
            className="w-full bg-gradient-to-r from-red-50 to-red-100 border-3 border-red-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-red-500 hover:border-red-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
            disabled={disabled}
          >
            {selectedMainCategory ? (
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${examSubjects.find(s => s.id === selectedMainCategory)?.gradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{examSubjects.find(s => s.id === selectedMainCategory)?.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-2xl text-gray-800">{examSubjects.find(s => s.id === selectedMainCategory)?.name}</div>
                  <div className="text-gray-600 text-lg">{examSubjects.find(s => s.id === selectedMainCategory)?.description}</div>
                </div>
                <div className="text-red-500 text-3xl">👑</div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                <span className="text-4xl">🎯</span>
                <span className="text-2xl font-semibold">教科を選択してください</span>
              </div>
            )}
          </button>
        </div>

        {/* 2️⃣ 分野選択 */}
        {selectedMainCategory && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-xl font-bold text-gray-700 flex items-center">
              <span className="mr-3 text-2xl">2️⃣</span>
              分野を選択
            </label>
            <button
              onClick={() => {
                setIsModalOpen('sub');
                setSearchTerm('');
              }}
              className="w-full bg-gradient-to-r from-orange-50 to-orange-100 border-3 border-orange-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-orange-500 hover:border-orange-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedSubCategory ? (
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{examCategories.find(c => c.id === selectedSubCategory)?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{examCategories.find(c => c.id === selectedSubCategory)?.name}</div>
                    <div className="text-gray-600 text-lg">{examCategories.find(c => c.id === selectedSubCategory)?.description}</div>
                    <div className="text-sm text-orange-600 font-semibold mt-2">
                      👑 {availableTopics.length}個の最難関レベル単元
                    </div>
                  </div>
                  <div className="text-orange-500 text-3xl">🔥</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">🔥</span>
                  <span className="text-2xl font-semibold">分野を選択してください</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* 3️⃣ 単元選択 */}
        {selectedSubCategory && availableTopics.length > 0 && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-xl font-bold text-gray-700 flex items-center">
              <span className="mr-3 text-2xl">3️⃣</span>
              単元を選択
            </label>
            <button
              onClick={() => {
                setIsModalOpen('topic');
                setSearchTerm('');
              }}
              className="w-full bg-gradient-to-r from-yellow-50 to-yellow-100 border-3 border-yellow-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-yellow-500 hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedTopic ? (
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{selectedTopicData?.name}</div>
                    <div className="text-gray-600 text-lg">{selectedTopicData?.description}</div>
                    <div className="text-sm text-yellow-600 font-semibold mt-2">
                      👑 最難関レベル ⭐ 超高度思考力
                    </div>
                  </div>
                  <div className="text-yellow-500 text-3xl">⭐</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">⭐</span>
                  <span className="text-2xl font-semibold">単元を選択してください</span>
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
            className="w-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold py-8 px-10 rounded-3xl hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl animate-bounce">👑</span>
              <div>
                <div className="text-3xl font-bold">最難関校対策 学習開始！</div>
                <div className="text-lg mt-2 opacity-90">
                  {examSubjects.find(s => s.id === selectedMainCategory)?.name} → {examCategories.find(c => c.id === selectedSubCategory)?.name} → {selectedTopicData?.name}
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-gray-200"
          >
            {/* モーダルヘッダー */}
            <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold">
                  {isModalOpen === 'main' && '👑 教科を選択'}
                  {isModalOpen === 'sub' && '🔥 分野を選択'}
                  {isModalOpen === 'topic' && '⭐ 単元を選択'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(null);
                    setSearchTerm('');
                  }}
                  className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* 検索バー */}
              <div className="mt-6">
                <input
                  type="text"
                  placeholder="🔍 検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-xl"
                />
              </div>
            </div>

            {/* モーダルコンテンツ */}
            <div className="overflow-y-auto max-h-96 p-8">
              {isModalOpen === 'main' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredExamSubjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedMainCategory(subject.id);
                        resetSelection('sub');
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="p-8 text-left hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-all rounded-2xl border-2 border-transparent hover:border-red-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-6">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${subject.gradient} flex items-center justify-center shadow-lg`}>
                          <span className="text-3xl">{subject.icon}</span>
                        </div>
                        <div>
                          <div className="font-bold text-2xl text-gray-800">{subject.name}</div>
                          <div className="text-gray-600 text-lg">{subject.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isModalOpen === 'sub' && (
                <div className="space-y-4">
                  {filteredExamCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedSubCategory(category.id);
                        resetSelection('topic');
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="w-full p-6 text-left hover:bg-orange-50 focus:outline-none focus:bg-orange-50 transition-all rounded-2xl border-2 border-transparent hover:border-orange-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-gray-800">{category.name}</div>
                          <div className="text-gray-600 text-lg">{category.description}</div>
                          <div className="text-sm text-orange-600 font-semibold mt-2">
                            👑 {getFilteredTopics().length}個の最難関レベル単元
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isModalOpen === 'topic' && (
                <div className="space-y-3">
                  {filteredTopics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="w-full p-6 text-left hover:bg-yellow-50 focus:outline-none focus:bg-yellow-50 transition-all rounded-2xl border-2 border-transparent hover:border-yellow-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl">⭐</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-gray-800">{topic.name}</div>
                          <div className="text-gray-600">{topic.description}</div>
                          <div className="text-sm text-yellow-600 font-semibold mt-1">
                            👑 最難関レベル ⭐ 超高度思考力
                          </div>
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default EliteSchoolExamDropdown;