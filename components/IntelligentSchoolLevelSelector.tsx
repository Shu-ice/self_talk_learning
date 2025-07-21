import React, { useState } from 'react';
import { Subject, Topic } from '../types';

interface IntelligentSchoolLevelSelectorProps {
  onStartLearning: (subject: Subject, topic: Topic, schoolLevel?: string) => void;
  disabled?: boolean;
  className?: string;
}

type SchoolLevel = 'basic' | 'standard' | 'advanced' | 'elite';
type SelectionFlow = 'level_first' | 'subject_first' | 'difficulty_adaptive';

interface SchoolLevelOption {
  id: SchoolLevel;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  directPath: boolean; // 直接この レベル専用の問題に進むかどうか
}

const IntelligentSchoolLevelSelector: React.FC<IntelligentSchoolLevelSelectorProps> = ({
  onStartLearning,
  disabled = false,
  className = ''
}) => {
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectionFlow, setSelectionFlow] = useState<SelectionFlow>('level_first');

  // 🎯 改善されたUIフロー設計
  const schoolLevelOptions: SchoolLevelOption[] = [
    {
      id: 'basic',
      name: '基礎校レベル',
      description: '基礎力をしっかり固めたい',
      icon: '🌱',
      color: 'bg-green-500',
      examples: ['基礎問題中心', '丁寧な解説', '段階的学習'],
      directPath: true
    },
    {
      id: 'standard',
      name: '標準校レベル',
      description: '基本的な中学受験対策',
      icon: '📚',
      color: 'bg-blue-500',
      examples: ['公立中高一貫', '地域有名私立', '偏差値50-60'],
      directPath: true
    },
    {
      id: 'advanced', 
      name: '上位校レベル',
      description: '応用力が必要な進学校対策',
      icon: '🎯',
      color: 'bg-purple-500',
      examples: ['早慶附属', '明大明治', '偏差値60-68'],
      directPath: true
    },
    {
      id: 'elite',
      name: '最難関校レベル',
      description: '超高度な思考力を要求する最高峰',
      icon: '👑',
      color: 'bg-red-500',
      examples: ['灘', '開成', '筑駒', '桜蔭', '偏差値68+'],
      directPath: true
    }
  ];

  const subjects = [
    { id: 'math', name: '算数', icon: '🧮', description: '数的思考力を鍛える' },
    { id: 'japanese', name: '国語', icon: '📖', description: '読解力と表現力を向上' },
    { id: 'science', name: '理科', icon: '🔬', description: '科学的思考を身につける' },
    { id: 'social', name: '社会', icon: '🌍', description: '幅広い知識と分析力を習得' }
  ];

  // 💡 改善されたロジック：二度選択を避ける
  const handleLevelSelection = (level: SchoolLevel) => {
    setSelectedLevel(level);
    
    // レベル選択後は即座に教科選択へ
    // 「志望校レベルを再選択」という混乱を避ける
  };

  const handleSubjectSelection = (subjectId: string) => {
    setSelectedSubject(subjectId);
    
    if (selectedLevel && selectedSubject) {
      // レベルと教科が決まったら即座に学習開始
      // トピック選択は学習内でAIが動的に調整
      startLearningSession(selectedLevel, subjectId);
    }
  };

  const startLearningSession = (level: SchoolLevel, subjectId: string) => {
    // 選択されたレベルに応じて適切な Topic を自動生成
    const adaptiveTopic: Topic = {
      id: `${level}_${subjectId}_adaptive`,
      name: `${getSchoolLevelName(level)}対応${getSubjectName(subjectId)}`,
      keywords: getKeywordsForLevel(level, subjectId),
      difficulty: getDifficultyForLevel(level),
      description: `${getSchoolLevelName(level)}レベルの${getSubjectName(subjectId)}問題`
    };

    const subject: Subject = {
      id: subjectId,
      name: getSubjectName(subjectId),
      topics: [adaptiveTopic]
    };

    onStartLearning(subject, adaptiveTopic, level);
  };

  // ヘルパー関数
  const getSchoolLevelName = (level: SchoolLevel): string => {
    const option = schoolLevelOptions.find(opt => opt.id === level);
    return option ? option.name : level;
  };

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  const getKeywordsForLevel = (level: SchoolLevel, subjectId: string): string[] => {
    // レベル別キーワード生成
    const baseKeywords = {
      math: ['計算', '図形', '文章題'],
      japanese: ['読解', '漢字', '文法'],
      science: ['物理', '化学', '生物'],
      social: ['地理', '歴史', '公民']
    };

    const levelKeywords = {
      basic: ['基本'],
      standard: ['標準', '応用'],
      advanced: ['発展', '応用'],
      elite: ['最難関', '超発展', '創造的思考']
    };

    return [
      ...baseKeywords[subjectId] || [],
      ...levelKeywords[level] || []
    ];
  };

  const getDifficultyForLevel = (level: SchoolLevel): number => {
    const difficultyMap = {
      basic: 3,
      standard: 5,
      advanced: 7,
      elite: 9
    };
    return difficultyMap[level];
  };

  return (
    <div className={`intelligent-selector ${className}`}>
      {/* フェーズ1: 志望校レベル選択 */}
      {!selectedLevel && (
        <div className="level-selection-phase">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎯 学習レベルを選択してください
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            お子様の志望校に合わせて、最適な学習内容をお選びします
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schoolLevelOptions.map((option) => (
              <div
                key={option.id}
                className={`cursor-pointer border-2 border-gray-200 hover:border-blue-400 rounded-lg p-6 transition-all transform hover:scale-105 ${option.color} text-white`}
                onClick={() => handleLevelSelection(option.id)}
              >
                <div className="text-4xl mb-4 text-center">{option.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-center">{option.name}</h3>
                <p className="text-sm mb-4 text-center opacity-90">{option.description}</p>
                <div className="text-xs">
                  <p className="font-semibold mb-1">対象例：</p>
                  <ul className="list-disc list-inside space-y-1">
                    {option.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フェーズ2: 教科選択 */}
      {selectedLevel && !selectedSubject && (
        <div className="subject-selection-phase">
          <div className="mb-6">
            <button
              onClick={() => setSelectedLevel(null)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← 志望校レベルを変更
            </button>
            <h2 className="text-2xl font-bold mb-2">
              📚 学習する教科を選択
            </h2>
            <p className="text-gray-600">
              {getSchoolLevelName(selectedLevel)}レベルの学習を開始します
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="cursor-pointer border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 transition-all transform hover:scale-105 bg-white hover:bg-gray-50"
                onClick={() => handleSubjectSelection(subject.id)}
              >
                <div className="text-3xl mb-2 text-center">{subject.icon}</div>
                <h3 className="font-bold text-center mb-1">{subject.name}</h3>
                <p className="text-xs text-gray-600 text-center">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 選択状況表示 */}
      {selectedLevel && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            ✅ 選択中: {getSchoolLevelName(selectedLevel)}
            {selectedSubject && ` → ${getSubjectName(selectedSubject)}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default IntelligentSchoolLevelSelector;