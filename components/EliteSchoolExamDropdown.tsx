import React, { useState, useEffect, useRef } from 'react';
import { Subject, Topic } from '../types';
import { SUBJECTS_DATA } from '../constants';

interface EliteSchoolExamDropdownProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled?: boolean;
  className?: string;
}

// 志望校レベル設定
type SchoolLevel = 'standard' | 'advanced' | 'elite';

interface SchoolLevelOption {
  id: SchoolLevel;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  examples: string[];
}

// 超難関中学対応の教科情報
interface EliteSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

// 難易度別分野情報
interface EliteCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  standardKeywords: string[]; // 標準レベル
  advancedKeywords: string[]; // 応用レベル
  eliteKeywords: string[]; // 最難関レベル
  excludeKeywords?: string[];
  difficultyLevels: SchoolLevel[];
}

const EliteSchoolExamDropdown: React.FC<EliteSchoolExamDropdownProps> = ({
  onStartLearning,
  disabled = false,
  className = ''
}) => {
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<SchoolLevel>('standard');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<'level' | 'main' | 'sub' | 'topic' | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  // 志望校レベル設定
  const schoolLevelOptions: SchoolLevelOption[] = [
    {
      id: 'standard',
      name: '標準校',
      description: '基本的な中学受験レベル',
      icon: '📚',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      examples: ['公立中高一貫校', '地域有名私立', '偏差値50-60']
    },
    {
      id: 'advanced', 
      name: '上位校',
      description: '応用力が必要な進学校',
      icon: '🎯',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      examples: ['早慶附属', '明大明治', '偏差値60-68']
    },
    {
      id: 'elite',
      name: '最難関校',
      description: '超高度な思考力を要求',
      icon: '👑',
      color: 'bg-red-500', 
      gradient: 'from-red-400 to-red-600',
      examples: ['灘', '開成', '筑駒', '桜蔭', '偏差値68+']
    }
  ];

  // 超難関対応教科設定
  const eliteSubjects: EliteSubject[] = [
    {
      id: 'math',
      name: '算数',
      icon: '🧮',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      description: '思考力と論理力の極致'
    },
    {
      id: 'japanese',
      name: '国語',
      icon: '📖', 
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
      description: '深い読解力と表現力'
    },
    {
      id: 'science',
      name: '理科',
      icon: '🔬',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      description: '科学的思考と実験考察'
    },
    {
      id: 'social',
      name: '社会',
      icon: '🌍',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600',
      description: '深い知識と分析力'
    }
  ];

  // 選択された教科の取得
  const selectedSubject = SUBJECTS_DATA.find(s => s.id === selectedMainCategory);

  // 難易度別分野分類
  const getEliteCategories = (): EliteCategory[] => {
    if (!selectedSubject) return [];

    switch (selectedMainCategory) {
      case 'math':
        return [
          {
            id: 'number_theory_advanced',
            name: '数の性質（高度）',
            description: '約数倍数・素数・覆面算・規則性の発展',
            icon: '🔢',
            standardKeywords: ['約数', '倍数', '公約数', '公倍数', '素数'],
            advancedKeywords: ['覆面算', '規則性', '数列', '合同式', '剰余'],
            eliteKeywords: ['高度な規則性', '数の分解', '論理パズル', '数理パズル'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'geometry_extreme',
            name: '図形（超発展）',
            description: '立体切断・角度推理・面積比・証明的思考',
            icon: '📐',
            standardKeywords: ['面積', '体積', '角度', '三角形', '円'],
            advancedKeywords: ['相似', '面積比', '立体', '展開図', '投影'],
            eliteKeywords: ['立体切断', '複雑な角度', '証明', '幾何学的推理', '空間図形'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'logic_reasoning',
            name: '論理・推理',
            description: '論理パズル・推理問題・思考力問題',
            icon: '🧠',
            standardKeywords: ['場合の数', '組み合わせ'],
            advancedKeywords: ['確率', '推理', '論理'],
            eliteKeywords: ['論理パズル', '推理問題', '思考力', '創作問題', 'パズル'],
            difficultyLevels: ['advanced', 'elite']
          },
          {
            id: 'word_problems_complex',
            name: '文章題（複合）',
            description: '複数条件・複合問題・高度な速さ',
            icon: '📝',
            standardKeywords: ['速さ', '時間', '距離', '仕事算'],
            advancedKeywords: ['旅人算', '流水算', '通過算', '時計算'],
            eliteKeywords: ['複合条件', '多段階問題', '高度な速さ', '複雑な仕事算'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'ratio_proportion_advanced',
            name: '割合・比（発展）',
            description: '複雑な比・連比・濃度・売買損益の発展',
            icon: '⚖️',
            standardKeywords: ['割合', '比', '比例', '反比例'],
            advancedKeywords: ['連比', '濃度', '売買', '損益'],
            eliteKeywords: ['複雑な比', '多段階の割合', '高度な濃度', '複合的売買'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          }
        ];

      case 'japanese':
        return [
          {
            id: 'narrative_advanced',
            name: '物語文（高度）',
            description: '心情の機微・複雑な人物関係・高度な表現技法',
            icon: '📚',
            standardKeywords: ['物語', '小説', '心情', '登場人物'],
            advancedKeywords: ['心理描写', '人物関係', '主題', '象徴'],
            eliteKeywords: ['複雑な心情', '微細な表現', '文学的技法', '深層心理'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'expository_complex',
            name: '説明文・論説文（発展）',
            description: '抽象的概念・論理構造・批判的読解',
            icon: '📋',
            standardKeywords: ['説明文', '論説', '要約', '主題'],
            advancedKeywords: ['論理構造', '因果関係', '対比', '具体と抽象'],
            eliteKeywords: ['抽象概念', '哲学的思考', '批判的読解', '高度な論理'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'vocabulary_elite',
            name: '語彙・文法（最高レベル）',
            description: '高度な語彙・敬語・言語感覚の発展',
            icon: '📝',
            standardKeywords: ['漢字', '語句', 'ことわざ', '文法'],
            advancedKeywords: ['熟語', '慣用句', '敬語', '品詞'],
            eliteKeywords: ['高度な語彙', '言語感覚', '語源', '語法'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'writing_advanced',
            name: '記述・表現（高度）',
            description: '論理的記述・創造的表現・高度な作文',
            icon: '✍️',
            standardKeywords: ['作文', '記述', '表現'],
            advancedKeywords: ['要約', '意見文', '説明文'],
            eliteKeywords: ['論理的記述', '創造的表現', '高度な構成力'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'poetry_advanced',
            name: '詩・短歌・俳句（発展）',
            description: '詩・短歌・俳句の鑑賞と表現技法',
            icon: '📜',
            standardKeywords: ['詩', '短歌', '俳句', '季語'],
            advancedKeywords: ['韻律', '表現技法', '修辞'],
            eliteKeywords: ['高度な韻文', '文学的表現', '詩歌の鑑賞'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          }
        ];

      case 'science':
        return [
          {
            id: 'biology_advanced',
            name: '生物（発展）',
            description: '生態系・進化・遺伝の基礎・生理機能',
            icon: '🌱',
            standardKeywords: ['植物', '動物', '人体', '呼吸', '消化'],
            advancedKeywords: ['生態系', '食物連鎖', '適応', '進化'],
            eliteKeywords: ['生物の多様性', '環境適応', '生命現象の探究'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'chemistry_advanced',
            name: '化学（発展）',
            description: '化学変化の詳細・物質の性質・反応の原理',
            icon: '🧪',
            standardKeywords: ['物質', '状態変化', '燃焼', '溶解'],
            advancedKeywords: ['化学変化', '酸性', 'アルカリ性', '中和'],
            eliteKeywords: ['化学反応の原理', '物質の本質', '分子レベルの理解'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'physics_advanced',
            name: '物理（発展）',
            description: '力学の原理・エネルギー・波動・電磁気',
            icon: '⚡',
            standardKeywords: ['力', '運動', '光', '音', '電気'],
            advancedKeywords: ['エネルギー', '仕事', '波動', '電磁気'],
            eliteKeywords: ['力学の原理', '波の性質', '電磁気学の基礎'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'earth_space_advanced',
            name: '地学・天文（発展）',
            description: '地球科学・天体運動・気象現象の原理',
            icon: '🌍',
            standardKeywords: ['天体', '気象', '地層', '火山', '地震'],
            advancedKeywords: ['天体運動', '気象現象', '地球の歴史'],
            eliteKeywords: ['宇宙科学', '地球システム', '天体力学'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'experiment_analysis',
            name: '実験・考察（高度）',
            description: '実験計画・データ分析・科学的思考',
            icon: '🔍',
            standardKeywords: ['実験', '観察', '測定'],
            advancedKeywords: ['データ', '分析', '考察'],
            eliteKeywords: ['実験計画', 'データ解析', '科学的推論'],
            difficultyLevels: ['advanced', 'elite']
          }
        ];

      case 'social':
        return [
          {
            id: 'history_analysis',
            name: '歴史（分析）',
            description: '歴史の流れ・因果関係・史料読解',
            icon: '🏯',
            standardKeywords: ['歴史', '時代', '人物', '文化'],
            advancedKeywords: ['因果関係', '歴史の流れ', '史料'],
            eliteKeywords: ['史料読解', '歴史分析', '時代背景の探究'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'geography_analysis',
            name: '地理（分析）',
            description: '地理的思考・地域分析・環境と人間',
            icon: '🗾',
            standardKeywords: ['地形', '気候', '産業', '都道府県'],
            advancedKeywords: ['地域特色', '環境', '人間活動'],
            eliteKeywords: ['地理的分析', '地域システム', '空間認識'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'civics_advanced',
            name: '公民（発展）',
            description: '政治制度・経済システム・社会問題',
            icon: '🏛️',
            standardKeywords: ['政治', '経済', '憲法', '権利'],
            advancedKeywords: ['制度', 'システム', '社会問題'],
            eliteKeywords: ['政治分析', '経済理論', '社会構造の理解'],
            difficultyLevels: ['standard', 'advanced', 'elite']
          },
          {
            id: 'current_affairs',
            name: '時事・国際（発展）',
            description: '国際情勢・現代社会・グローバル化',
            icon: '🌐',
            standardKeywords: ['国際', '現代', '社会'],
            advancedKeywords: ['グローバル', '環境問題', '国際協力'],
            eliteKeywords: ['国際情勢分析', '現代社会の課題', 'グローバル思考'],
            difficultyLevels: ['advanced', 'elite']
          },
          {
            id: 'integrated_studies',
            name: '総合・分析（最高）',
            description: '複合的思考・統合的理解・問題解決',
            icon: '🧩',
            standardKeywords: [],
            advancedKeywords: ['統合', '関連', '比較'],
            eliteKeywords: ['総合的思考', '統合的理解', '複合分析'],
            difficultyLevels: ['elite']
          }
        ];

      default:
        return [];
    }
  };

  const eliteCategories = getEliteCategories();

  // 現在の選択レベルに応じたカテゴリフィルタリング
  const availableCategories = eliteCategories.filter(cat => 
    cat.difficultyLevels.includes(selectedSchoolLevel)
  );

  // トピックフィルタリング（選択レベルに応じて）
  const getFilteredTopics = (): Topic[] => {
    if (!selectedSubject || !selectedSubCategory) return [];

    const selectedCategory = availableCategories.find(cat => cat.id === selectedSubCategory);
    if (!selectedCategory) return [];

    return selectedSubject.topics.filter(topic => {
      // 除外キーワードチェック
      if (selectedCategory.excludeKeywords) {
        const hasExcludeKeyword = selectedCategory.excludeKeywords.some(keyword =>
          topic.name.includes(keyword) || topic.description.includes(keyword)
        );
        if (hasExcludeKeyword) return false;
      }

      // レベル別キーワードチェック
      let keywords: string[] = [];
      switch (selectedSchoolLevel) {
        case 'standard':
          keywords = selectedCategory.standardKeywords;
          break;
        case 'advanced':
          keywords = [...selectedCategory.standardKeywords, ...selectedCategory.advancedKeywords];
          break;
        case 'elite':
          keywords = [...selectedCategory.standardKeywords, ...selectedCategory.advancedKeywords, ...selectedCategory.eliteKeywords];
          break;
      }

      return keywords.some(keyword =>
        topic.name.includes(keyword) || topic.description.includes(keyword)
      );
    });
  };

  const availableTopics = getFilteredTopics();
  const selectedTopicData = availableTopics.find(t => t.id === selectedTopic);

  // 検索機能
  const filteredSchoolLevels = schoolLevelOptions.filter(level =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEliteSubjects = eliteSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEliteCategories = availableCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTopics = availableTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 選択リセット
  const resetSelection = (level: 'main' | 'sub' | 'topic') => {
    if (level === 'main') {
      setSelectedMainCategory('');
      setSelectedSubCategory('');
      setSelectedTopic('');
    } else if (level === 'sub') {
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

  // レベル変更時のリセット
  useEffect(() => {
    resetSelection('main');
  }, [selectedSchoolLevel]);

  return (
    <div className={`bg-gradient-to-br from-white via-purple-50 to-red-50 rounded-3xl shadow-2xl p-8 border-2 border-purple-200 ${className}`}>
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 rounded-full mb-4 shadow-xl">
          <span className="text-4xl">👑</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">最難関中学対応カリキュラム</h2>
        <p className="text-gray-600 text-xl">志望校レベル別・完全対応システム</p>
        <div className="text-lg text-red-600 mt-3 font-bold">
          🏆 灘・開成・筑駒・桜蔭完全対応 🏆
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          {['👑', '📚', '🎯', '🚀'].map((icon, index) => (
            <React.Fragment key={index}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg ${
                (index === 0 && selectedSchoolLevel) ||
                (index === 1 && selectedMainCategory) ||
                (index === 2 && selectedSubCategory) ||
                (index === 3 && selectedTopic)
                  ? 'bg-gradient-to-r from-purple-500 to-red-500 text-white transform scale-110'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <span className="text-lg">{icon}</span>
              </div>
              {index < 3 && (
                <div className={`w-16 h-2 rounded-full transition-all duration-300 ${
                  (index === 0 && selectedSchoolLevel) ||
                  (index === 1 && selectedMainCategory) ||
                  (index === 2 && selectedSubCategory)
                    ? 'bg-gradient-to-r from-purple-500 to-red-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* 👑 志望校レベル選択 */}
        <div className="space-y-3">
          <label className="block text-2xl font-bold text-gray-700 flex items-center">
            <span className="mr-3 text-3xl">👑</span>
            志望校レベルを選択
          </label>
          <button
            onClick={() => {
              setIsModalOpen('level');
              setSearchTerm('');
            }}
            className="w-full bg-gradient-to-r from-purple-50 to-red-50 border-4 border-purple-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
            disabled={disabled}
          >
            {selectedSchoolLevel ? (
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.gradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-2xl text-gray-800">{schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}</div>
                  <div className="text-gray-600 text-lg">{schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.description}</div>
                  <div className="text-sm text-purple-600 font-semibold mt-1">
                    例：{schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.examples.join('・')}
                  </div>
                </div>
                <div className="text-purple-500 text-3xl">🎯</div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                <span className="text-4xl">👑</span>
                <span className="text-2xl font-semibold">志望校レベルを選択してください</span>
              </div>
            )}
          </button>
        </div>

        {/* 📚 教科選択 */}
        {selectedSchoolLevel && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-2xl font-bold text-gray-700 flex items-center">
              <span className="mr-3 text-3xl">📚</span>
              教科を選択
            </label>
            <button
              onClick={() => {
                setIsModalOpen('main');
                setSearchTerm('');
              }}
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-blue-500 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedMainCategory ? (
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${eliteSubjects.find(s => s.id === selectedMainCategory)?.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{eliteSubjects.find(s => s.id === selectedMainCategory)?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{eliteSubjects.find(s => s.id === selectedMainCategory)?.name}</div>
                    <div className="text-gray-600 text-lg">{eliteSubjects.find(s => s.id === selectedMainCategory)?.description}</div>
                    <div className="text-sm text-blue-600 font-semibold mt-1">
                      {schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}レベル対応
                    </div>
                  </div>
                  <div className="text-blue-500 text-3xl">📚</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">📚</span>
                  <span className="text-2xl font-semibold">教科を選択してください</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* 🎯 分野選択 */}
        {selectedMainCategory && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-2xl font-bold text-gray-700 flex items-center">
              <span className="mr-3 text-3xl">🎯</span>
              分野を選択
            </label>
            <button
              onClick={() => {
                setIsModalOpen('sub');
                setSearchTerm('');
              }}
              className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedSubCategory ? (
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{availableCategories.find(c => c.id === selectedSubCategory)?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{availableCategories.find(c => c.id === selectedSubCategory)?.name}</div>
                    <div className="text-gray-600 text-lg">{availableCategories.find(c => c.id === selectedSubCategory)?.description}</div>
                    <div className="text-sm text-purple-600 font-semibold mt-2">
                      📖 {availableTopics.length}個の{schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}レベル単元
                    </div>
                  </div>
                  <div className="text-purple-500 text-3xl">🎯</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">🎯</span>
                  <span className="text-2xl font-semibold">分野を選択してください</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* 🚀 単元選択 */}
        {selectedSubCategory && availableTopics.length > 0 && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-2xl font-bold text-gray-700 flex items-center">
              <span className="mr-3 text-3xl">🚀</span>
              単元を選択
            </label>
            <button
              onClick={() => {
                setIsModalOpen('topic');
                setSearchTerm('');
              }}
              className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-200 rounded-2xl px-8 py-6 text-left focus:outline-none focus:border-green-500 hover:border-green-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              disabled={disabled}
            >
              {selectedTopic ? (
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-2xl text-gray-800">{selectedTopicData?.name}</div>
                    <div className="text-gray-600 text-lg">{selectedTopicData?.description}</div>
                    <div className="text-sm text-green-600 font-semibold mt-2">
                      ✅ {schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}レベル対応済み
                    </div>
                  </div>
                  <div className="text-green-500 text-3xl">✅</div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 text-gray-500 py-6">
                  <span className="text-4xl">🚀</span>
                  <span className="text-2xl font-semibold">単元を選択してください</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 学習開始ボタン */}
      {selectedSchoolLevel && selectedMainCategory && selectedSubCategory && selectedTopic && (
        <div className="pt-8 animate-fadeIn">
          <button
            onClick={handleStartLearning}
            disabled={disabled}
            className="w-full bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 text-white font-bold py-8 px-10 rounded-3xl hover:from-purple-600 hover:via-red-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl animate-bounce">👑</span>
              <div>
                <div className="text-3xl font-bold">
                  {schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}レベル 学習開始！
                </div>
                <div className="text-lg mt-2 opacity-90">
                  {eliteSubjects.find(s => s.id === selectedMainCategory)?.name} → {availableCategories.find(c => c.id === selectedSubCategory)?.name} → {selectedTopicData?.name}
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-purple-200"
          >
            {/* モーダルヘッダー */}
            <div className="bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 text-white p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold">
                  {isModalOpen === 'level' && '👑 志望校レベルを選択'}
                  {isModalOpen === 'main' && '📚 教科を選択'}
                  {isModalOpen === 'sub' && '🎯 分野を選択'}
                  {isModalOpen === 'topic' && '🚀 単元を選択'}
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
              {isModalOpen === 'level' && (
                <div className="space-y-4">
                  {filteredSchoolLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => {
                        setSelectedSchoolLevel(level.id);
                        setIsModalOpen(null);
                        setSearchTerm('');
                      }}
                      className="w-full p-8 text-left hover:bg-purple-50 focus:outline-none focus:bg-purple-50 transition-all rounded-2xl border-2 border-transparent hover:border-purple-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-6">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${level.gradient} flex items-center justify-center shadow-lg`}>
                          <span className="text-3xl">{level.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-2xl text-gray-800">{level.name}</div>
                          <div className="text-gray-600 text-lg">{level.description}</div>
                          <div className="text-sm text-purple-600 font-semibold mt-2">
                            例：{level.examples.join('・')}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isModalOpen === 'main' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEliteSubjects.map(subject => (
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
                  {filteredEliteCategories.map(category => (
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
                            📖 {getFilteredTopics().length}個の{schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}レベル単元
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
                          <span className="text-xl">🚀</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-gray-800">{topic.name}</div>
                          <div className="text-gray-600">{topic.description}</div>
                          <div className="text-sm text-green-600 font-semibold mt-1">
                            ✅ {schoolLevelOptions.find(l => l.id === selectedSchoolLevel)?.name}レベル対応
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

        .border-4 {
          border-width: 4px;
        }
      `}</style>
    </div>
  );
};

export default EliteSchoolExamDropdown;