import React, { useState, useEffect, useRef } from 'react';
import { Subject, Topic } from '../types';
import { SUBJECTS_DATA } from '../constants';

interface MiddleSchoolExamDropdownProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled?: boolean;
  className?: string;
}

// 中学受験に特化した教科情報
interface ExamSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

// 中学受験に特化した分野情報
interface ExamCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  keywords: string[]; // フィルタリング用キーワード
  excludeKeywords?: string[]; // 除外キーワード
}

const MiddleSchoolExamDropdown: React.FC<MiddleSchoolExamDropdownProps> = ({
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

  // 中学受験に特化した教科設定
  const examSubjects: ExamSubject[] = [
    {
      id: 'math',
      name: '算数',
      icon: '🧮',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      description: '中学受験算数の重要分野'
    },
    {
      id: 'japanese',
      name: '国語',
      icon: '📖',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '読解力と語彙力を育成'
    },
    {
      id: 'science',
      name: '理科',
      icon: '🔬',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      description: '実験観察と自然理解'
    },
    {
      id: 'social',
      name: '社会',
      icon: '🌍',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600',
      description: '歴史地理と公民の基礎'
    }
  ];

  // 選択された教科の取得
  const selectedSubject = SUBJECTS_DATA.find(s => s.id === selectedMainCategory);

  // 中学受験に特化した分野分類
  const getExamCategories = (): ExamCategory[] => {
    if (!selectedSubject) return [];

    switch (selectedMainCategory) {
      case 'math':
        return [
          {
            id: 'calculation_basics',
            name: '計算の基礎',
            description: '四則演算・分数・小数・整数の性質',
            icon: '🔢',
            keywords: ['計算', '四則', '分数', '小数', '整数', '約数', '倍数', '公約数', '公倍数', '素数'],
            excludeKeywords: ['負の数', '記数法', 'フラクタル', '帰納法', 'グラフ理論', '符号理論']
          },
          {
            id: 'geometry_measurement',
            name: '図形と測定',
            description: '平面図形・立体図形・面積・体積・角度',
            icon: '📐',
            keywords: ['図形', '面積', '体積', '角度', '三角形', '円', '正方形', '長方形', '立方体', '円柱', '円錐'],
            excludeKeywords: ['変換', '移動', '切断', '証明技法']
          },
          {
            id: 'ratio_proportion',
            name: '割合と比',
            description: '割合・比・比例・反比例',
            icon: '⚖️',
            keywords: ['割合', '比', '比例', '反比例', 'パーセント', '歩合'],
            excludeKeywords: []
          },
          {
            id: 'word_problems',
            name: '文章題',
            description: '速さ・時間・距離・仕事算・鶴亀算',
            icon: '📝',
            keywords: ['速さ', '時間', '距離', '仕事算', '鶴亀', '旅人算', '流水算', '通過算'],
            excludeKeywords: ['最適化']
          },
          {
            id: 'data_graphs',
            name: 'データとグラフ',
            description: '表・グラフ・平均・場合の数',
            icon: '📊',
            keywords: ['表', 'グラフ', '平均', '場合の数', '順列', '組み合わせ'],
            excludeKeywords: ['確率', '統計的分析', '分散', '標準偏差']
          }
        ];

      case 'japanese':
        return [
          {
            id: 'narrative_reading',
            name: '物語文読解',
            description: '物語文・小説の読解と心情理解',
            icon: '📚',
            keywords: ['物語', '小説', '読解', '心情', '登場人物', '情景'],
            excludeKeywords: ['批判的読解', 'メディアリテラシー']
          },
          {
            id: 'expository_reading',
            name: '説明文読解',
            description: '説明文・論説文の読解と要約',
            icon: '📋',
            keywords: ['説明文', '論説', '要約', '段落', '主題', '論理'],
            excludeKeywords: []
          },
          {
            id: 'vocabulary_grammar',
            name: '語彙・文法',
            description: '漢字・語句・ことわざ・慣用句・文法',
            icon: '📝',
            keywords: ['漢字', '語句', 'ことわざ', '慣用句', '文法', '品詞', '敬語', '熟語'],
            excludeKeywords: ['古典文法', '現代語と古語']
          },
          {
            id: 'writing_expression',
            name: '作文・表現',
            description: '作文・記述・表現技法',
            icon: '✍️',
            keywords: ['作文', '記述', '表現', '文章', '書く', '要約'],
            excludeKeywords: []
          },
          {
            id: 'poetry_literature',
            name: '詩・短歌・俳句',
            description: '詩・短歌・俳句・季語',
            icon: '🎭',
            keywords: ['詩', '短歌', '俳句', '季語', '韻律', '表現技法'],
            excludeKeywords: []
          }
        ];

      case 'science':
        return [
          {
            id: 'biology_basics',
            name: '生物の基礎',
            description: '植物・動物・人体の基本的なしくみ',
            icon: '🌱',
            keywords: ['植物', '動物', '人体', '生物', '呼吸', '消化', '血液', '骨格'],
            excludeKeywords: ['遺伝', 'バイオテクノロジー', '細胞分裂']
          },
          {
            id: 'matter_changes',
            name: '物質と変化',
            description: '物質の性質・状態変化・燃焼',
            icon: '🧪',
            keywords: ['物質', '状態変化', '燃焼', '溶解', '蒸発', '凝固', '気体', '液体', '固体'],
            excludeKeywords: ['高分子', '触媒', '状態図', '化学式']
          },
          {
            id: 'forces_energy',
            name: '力とエネルギー',
            description: '力・運動・光・音・電気の基礎',
            icon: '⚡',
            keywords: ['力', '運動', '光', '音', '電気', '磁石', 'てこ', 'ばね', '振り子'],
            excludeKeywords: []
          },
          {
            id: 'earth_space',
            name: '地球と宇宙',
            description: '天気・天体・地層・火山・地震',
            icon: '🌍',
            keywords: ['天気', '天体', '地層', '火山', '地震', '星', '月', '太陽', '雲', '風'],
            excludeKeywords: ['地球の内部構造', '気候変動の詳細']
          },
          {
            id: 'environment_observation',
            name: '環境と観察',
            description: '季節の変化・自然観察・実験方法',
            icon: '🔍',
            keywords: ['季節', '自然', '観察', '実験', '測定', '記録'],
            excludeKeywords: []
          }
        ];

      case 'social':
        return [
          {
            id: 'japanese_history',
            name: '日本の歴史',
            description: '古代から現代までの日本史（小学生レベル）',
            icon: '🏯',
            keywords: ['歴史', '古代', '中世', '近世', '近代', '現代', '時代', '人物', '文化'],
            excludeKeywords: []
          },
          {
            id: 'world_history',
            name: '世界の歴史',
            description: '世界の主要な文明と歴史（基礎レベル）',
            icon: '🌐',
            keywords: ['世界', '文明', '国際', '文化交流'],
            excludeKeywords: ['国際政治', '外交政策']
          },
          {
            id: 'japanese_geography',
            name: '日本の地理',
            description: '都道府県・地形・気候・産業',
            icon: '🗾',
            keywords: ['都道府県', '地形', '気候', '産業', '農業', '工業', '山地', '平野', '川', '県庁所在地'],
            excludeKeywords: []
          },
          {
            id: 'world_geography',
            name: '世界の地理',
            description: '大陸・国・地形・気候（基礎レベル）',
            icon: '🗺️',
            keywords: ['大陸', '国', '首都', '地形', '気候'],
            excludeKeywords: []
          },
          {
            id: 'civics_basics',
            name: '公民の基礎',
            description: '政治・経済・社会の基本的なしくみ',
            icon: '🏛️',
            keywords: ['政治', '選挙', '憲法', '権利', '義務', '税金', '公共'],
            excludeKeywords: ['憲法改正', '国際経済', '労働と雇用', '司法制度詳細', '金融詳細']
          }
        ];

      default:
        return [];
    }
  };

  const examCategories = getExamCategories();

  // トピックフィルタリング（中学受験に適したもののみ）
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

      // 含含キーワードチェック
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
    <div className={`bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 border border-blue-100 ${className}`}>
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <span className="text-3xl">🎓</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">中学受験 学習内容選択</h2>
        <p className="text-gray-600 text-lg">小学生向けに厳選された中学受験対応カリキュラム</p>
        <div className="text-sm text-blue-600 mt-2 font-medium">
          ✨ 中学生内容は除外済み ✨ 小学生に最適化 ✨
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
            selectedMainCategory ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white transform scale-110' : 'bg-gray-200 text-gray-400'
          }`}>
            <span className="font-bold">1</span>
          </div>
          <div className={`w-16 h-2 rounded-full transition-all duration-300 ${
            selectedMainCategory ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
          }`} />
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
            selectedSubCategory ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white transform scale-110' : 'bg-gray-200 text-gray-400'
          }`}>
            <span className="font-bold">2</span>
          </div>
          <div className={`w-16 h-2 rounded-full transition-all duration-300 ${
            selectedSubCategory ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
          }`} />
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
            selectedTopic ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white transform scale-110' : 'bg-gray-200 text-gray-400'
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
            className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-3 border-blue-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-blue-500 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
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
                <div className="text-blue-500 text-3xl">📚</div>
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
              className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedSubCategory ? (
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{examCategories.find(c => c.id === selectedSubCategory)?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{examCategories.find(c => c.id === selectedSubCategory)?.name}</div>
                    <div className="text-gray-600 text-lg">{examCategories.find(c => c.id === selectedSubCategory)?.description}</div>
                    <div className="text-sm text-purple-600 font-semibold mt-2">
                      📖 {availableTopics.length}個の単元（中学受験対応）
                    </div>
                  </div>
                  <div className="text-purple-500 text-3xl">📂</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">📂</span>
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
              className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-3 border-green-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-green-500 hover:border-green-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedTopic ? (
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{selectedTopicData?.name}</div>
                    <div className="text-gray-600 text-lg">{selectedTopicData?.description}</div>
                    <div className="text-sm text-green-600 font-semibold mt-2">
                      ✅ 中学受験対応済み ✅ 小学生レベル
                    </div>
                  </div>
                  <div className="text-green-500 text-3xl">✅</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">📝</span>
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
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-8 px-10 rounded-3xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl animate-bounce">🚀</span>
              <div>
                <div className="text-3xl font-bold">中学受験対策 学習開始！</div>
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
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold">
                  {isModalOpen === 'main' && '📚 教科を選択'}
                  {isModalOpen === 'sub' && '📂 分野を選択'}
                  {isModalOpen === 'topic' && '📝 単元を選択'}
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
                      className="p-8 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-all rounded-2xl border-2 border-transparent hover:border-blue-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                      className="w-full p-6 text-left hover:bg-purple-50 focus:outline-none focus:bg-purple-50 transition-all rounded-2xl border-2 border-transparent hover:border-purple-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-gray-800">{category.name}</div>
                          <div className="text-gray-600 text-lg">{category.description}</div>
                          <div className="text-sm text-purple-600 font-semibold mt-2">
                            📖 {getFilteredTopics().length}個の単元（中学受験対応）
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
                      className="w-full p-6 text-left hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-all rounded-2xl border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl">📖</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-gray-800">{topic.name}</div>
                          <div className="text-gray-600">{topic.description}</div>
                          <div className="text-sm text-green-600 font-semibold mt-1">
                            ✅ 小学生対応 ✅ 中学受験頻出
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

export default MiddleSchoolExamDropdown;