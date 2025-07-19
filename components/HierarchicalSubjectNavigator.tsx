import React, { useState, useEffect } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  HoverScaleCard,
  AnimatedProgress,
  ParticleBackground
} from './ui/MicroInteractions';

/**
 * 📚 Hierarchical Subject Navigator
 * 階層構造の教科・単元ナビゲーター
 * 大項目→中項目→小項目の3段階階層で学習内容を整理
 */

interface HierarchicalSubjectNavigatorProps {
  userId: string;
  onUnitSelect: (unit: LearningUnit) => void;
  className?: string;
}

interface SubjectHierarchy {
  subjectId: string;
  subjectName: string;
  icon: string;
  color: string;
  description: string;
  majorCategories: MajorCategory[];
  progress: SubjectProgress;
}

interface MajorCategory {
  categoryId: string;
  categoryName: string;
  description: string;
  icon: string;
  estimatedHours: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  midCategories: MidCategory[];
  progress: CategoryProgress;
}

interface MidCategory {
  categoryId: string;
  categoryName: string;
  description: string;
  prerequisites: string[];
  learningObjectives: string[];
  estimatedHours: number;
  minorCategories: MinorCategory[];
  progress: CategoryProgress;
}

interface MinorCategory {
  categoryId: string;
  categoryName: string;
  description: string;
  learningUnits: LearningUnit[];
  progress: CategoryProgress;
}

interface LearningUnit {
  unitId: string;
  unitName: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  type: 'concept' | 'practice' | 'application' | 'test';
  progress: UnitProgress;
}

interface SubjectProgress {
  completedUnits: number;
  totalUnits: number;
  completionRate: number;
  masteryLevel: number;
  timeSpent: number;
  lastAccessed: Date;
}

interface CategoryProgress {
  completedUnits: number;
  totalUnits: number;
  completionRate: number;
  masteryLevel: number;
  isUnlocked: boolean;
}

interface UnitProgress {
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
  score: number;
  attempts: number;
  timeSpent: number;
  lastAccessed?: Date;
}

const HierarchicalSubjectNavigator: React.FC<HierarchicalSubjectNavigatorProps> = ({
  userId,
  onUnitSelect,
  className = ''
}) => {
  const [subjects] = useState<SubjectHierarchy[]>(getSubjectHierarchy());
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<string | null>(null);
  const [selectedMidCategory, setSelectedMidCategory] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  // パンくずリスト更新
  useEffect(() => {
    const newBreadcrumbs = [];
    
    if (selectedSubject) {
      const subject = subjects.find(s => s.subjectId === selectedSubject);
      if (subject) newBreadcrumbs.push(subject.subjectName);
    }
    
    if (selectedMajorCategory) {
      const subject = subjects.find(s => s.subjectId === selectedSubject);
      const majorCategory = subject?.majorCategories.find(c => c.categoryId === selectedMajorCategory);
      if (majorCategory) newBreadcrumbs.push(majorCategory.categoryName);
    }
    
    if (selectedMidCategory) {
      const subject = subjects.find(s => s.subjectId === selectedSubject);
      const majorCategory = subject?.majorCategories.find(c => c.categoryId === selectedMajorCategory);
      const midCategory = majorCategory?.midCategories.find(c => c.categoryId === selectedMidCategory);
      if (midCategory) newBreadcrumbs.push(midCategory.categoryName);
    }
    
    setBreadcrumbs(newBreadcrumbs);
  }, [selectedSubject, selectedMajorCategory, selectedMidCategory, subjects]);

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedMajorCategory(null);
    setSelectedMidCategory(null);
  };

  const handleMajorCategorySelect = (categoryId: string) => {
    setSelectedMajorCategory(categoryId);
    setSelectedMidCategory(null);
  };

  const handleMidCategorySelect = (categoryId: string) => {
    setSelectedMidCategory(categoryId);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setSelectedMajorCategory(null);
      setSelectedMidCategory(null);
    } else if (index === 1) {
      setSelectedMidCategory(null);
    }
  };

  const handleBack = () => {
    if (selectedMidCategory) {
      setSelectedMidCategory(null);
    } else if (selectedMajorCategory) {
      setSelectedMajorCategory(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#4ade80';
    if (progress >= 60) return '#facc15';
    if (progress >= 40) return '#fb923c';
    return '#f87171';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '基礎';
      case 'intermediate': return '標準';
      case 'advanced': return '応用';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked': return '🔒';
      case 'available': return '⭐';
      case 'in_progress': return '🔄';
      case 'completed': return '✅';
      case 'mastered': return '🏆';
      default: return '⭐';
    }
  };

  const filteredSubjects = subjects.filter(subject => 
    subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSubject = subjects.find(s => s.subjectId === selectedSubject);
  const currentMajorCategory = currentSubject?.majorCategories.find(c => c.categoryId === selectedMajorCategory);
  const currentMidCategory = currentMajorCategory?.midCategories.find(c => c.categoryId === selectedMidCategory);

  return (
    <div className={`hierarchical-navigator ${className}`}>
      <ParticleBackground />
      
      {/* ヘッダー */}
      <div className="navigator-header">
        <div className="header-top">
          <h1>📚 学習ナビゲーター</h1>
          <div className="header-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="単元を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="difficulty-filter"
            >
              <option value="all">全ての難易度</option>
              <option value="basic">基礎</option>
              <option value="intermediate">標準</option>
              <option value="advanced">応用</option>
            </select>
          </div>
        </div>

        {/* パンくずリスト */}
        {breadcrumbs.length > 0 && (
          <div className="breadcrumbs">
            <button 
              onClick={() => setSelectedSubject(null)}
              className="breadcrumb-item home"
            >
              🏠 ホーム
            </button>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className="breadcrumb-separator">›</span>
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'current' : ''}`}
                >
                  {crumb}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* 戻るボタン */}
        {(selectedSubject || selectedMajorCategory || selectedMidCategory) && (
          <div className="navigation-controls">
            <KidsButton
              onClick={handleBack}
              variant="secondary"
              className="back-button"
            >
              ← 戻る
            </KidsButton>
          </div>
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="navigator-content">
        {/* 教科選択画面 */}
        {!selectedSubject && (
          <div className="subject-selection">
            <h2>📖 教科を選択してください</h2>
            <div className="subjects-grid">
              {filteredSubjects.map((subject) => (
                <HoverScaleCard
                  key={subject.subjectId}
                  className="subject-card"
                  onClick={() => handleSubjectSelect(subject.subjectId)}
                >
                  <div className="subject-header">
                    <div className="subject-icon" style={{ backgroundColor: subject.color }}>
                      {subject.icon}
                    </div>
                    <div className="subject-info">
                      <h3>{subject.subjectName}</h3>
                      <p>{subject.description}</p>
                    </div>
                  </div>
                  <div className="subject-progress">
                    <div className="progress-stats">
                      <span className="progress-text">
                        {subject.progress.completedUnits}/{subject.progress.totalUnits} 単元完了
                      </span>
                      <span className="progress-percentage">
                        {Math.round(subject.progress.completionRate)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${subject.progress.completionRate}%`,
                          backgroundColor: getProgressColor(subject.progress.completionRate)
                        }}
                      />
                    </div>
                  </div>
                  <div className="subject-stats">
                    <div className="stat">
                      <span className="stat-label">習熟度</span>
                      <span className="stat-value">{Math.round(subject.progress.masteryLevel)}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">学習時間</span>
                      <span className="stat-value">{Math.round(subject.progress.timeSpent / 60)}h</span>
                    </div>
                  </div>
                </HoverScaleCard>
              ))}
            </div>
          </div>
        )}

        {/* 大項目選択画面 */}
        {selectedSubject && !selectedMajorCategory && currentSubject && (
          <div className="major-category-selection">
            <div className="section-header">
              <h2>📋 {currentSubject.subjectName} - 大項目を選択</h2>
              <p>学習したい分野を選んでください</p>
            </div>
            <div className="categories-grid">
              {currentSubject.majorCategories.map((category) => (
                <HoverScaleCard
                  key={category.categoryId}
                  className={`category-card ${!category.progress.isUnlocked ? 'locked' : ''}`}
                  onClick={() => category.progress.isUnlocked && handleMajorCategorySelect(category.categoryId)}
                >
                  <div className="category-header">
                    <div className="category-icon">
                      {category.progress.isUnlocked ? category.icon : '🔒'}
                    </div>
                    <div className="category-info">
                      <h3>{category.categoryName}</h3>
                      <p>{category.description}</p>
                    </div>
                    <div className="category-difficulty">
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(category.difficulty) }}
                      >
                        {getDifficultyLabel(category.difficulty)}
                      </span>
                    </div>
                  </div>
                  
                  {category.progress.isUnlocked && (
                    <>
                      <div className="category-progress">
                        <div className="progress-stats">
                          <span className="progress-text">
                            {category.progress.completedUnits}/{category.progress.totalUnits} 完了
                          </span>
                          <span className="progress-percentage">
                            {Math.round(category.progress.completionRate)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${category.progress.completionRate}%`,
                              backgroundColor: getProgressColor(category.progress.completionRate)
                            }}
                          />
                        </div>
                      </div>
                      <div className="category-stats">
                        <div className="stat">
                          <span className="stat-label">予想時間</span>
                          <span className="stat-value">{category.estimatedHours}h</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">習熟度</span>
                          <span className="stat-value">{Math.round(category.progress.masteryLevel)}%</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!category.progress.isUnlocked && (
                    <div className="locked-message">
                      <p>前の単元を完了すると解放されます</p>
                    </div>
                  )}
                </HoverScaleCard>
              ))}
            </div>
          </div>
        )}

        {/* 中項目選択画面 */}
        {selectedSubject && selectedMajorCategory && !selectedMidCategory && currentMajorCategory && (
          <div className="mid-category-selection">
            <div className="section-header">
              <h2>📝 {currentMajorCategory.categoryName} - 中項目を選択</h2>
              <p>具体的な学習内容を選んでください</p>
            </div>
            <div className="categories-grid">
              {currentMajorCategory.midCategories.map((category) => (
                <HoverScaleCard
                  key={category.categoryId}
                  className={`category-card ${!category.progress.isUnlocked ? 'locked' : ''}`}
                  onClick={() => category.progress.isUnlocked && handleMidCategorySelect(category.categoryId)}
                >
                  <div className="category-header">
                    <div className="category-info">
                      <h3>{category.categoryName}</h3>
                      <p>{category.description}</p>
                    </div>
                  </div>
                  
                  {category.progress.isUnlocked && (
                    <>
                      <div className="learning-objectives">
                        <h4>学習目標</h4>
                        <ul>
                          {category.learningObjectives.slice(0, 3).map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                          {category.learningObjectives.length > 3 && (
                            <li className="more-objectives">他{category.learningObjectives.length - 3}個...</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="category-progress">
                        <div className="progress-stats">
                          <span className="progress-text">
                            {category.progress.completedUnits}/{category.progress.totalUnits} 完了
                          </span>
                          <span className="progress-percentage">
                            {Math.round(category.progress.completionRate)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${category.progress.completionRate}%`,
                              backgroundColor: getProgressColor(category.progress.completionRate)
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="category-stats">
                        <div className="stat">
                          <span className="stat-label">予想時間</span>
                          <span className="stat-value">{category.estimatedHours}h</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">習熟度</span>
                          <span className="stat-value">{Math.round(category.progress.masteryLevel)}%</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!category.progress.isUnlocked && (
                    <div className="locked-message">
                      <p>前提条件を満たすと解放されます</p>
                    </div>
                  )}
                </HoverScaleCard>
              ))}
            </div>
          </div>
        )}

        {/* 小項目・学習単元選択画面 */}
        {selectedSubject && selectedMajorCategory && selectedMidCategory && currentMidCategory && (
          <div className="learning-units-selection">
            <div className="section-header">
              <h2>📚 {currentMidCategory.categoryName} - 学習単元</h2>
              <p>学習を開始する単元を選んでください</p>
            </div>
            
            {currentMidCategory.minorCategories.map((minorCategory) => (
              <div key={minorCategory.categoryId} className="minor-category-section">
                <div className="minor-category-header">
                  <h3>{minorCategory.categoryName}</h3>
                  <p>{minorCategory.description}</p>
                  <div className="minor-category-progress">
                    <span className="progress-text">
                      {minorCategory.progress.completedUnits}/{minorCategory.progress.totalUnits} 完了
                    </span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${minorCategory.progress.completionRate}%`,
                          backgroundColor: getProgressColor(minorCategory.progress.completionRate)
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="learning-units-grid">
                  {minorCategory.learningUnits
                    .filter(unit => {
                      if (filterDifficulty !== 'all' && unit.difficulty !== filterDifficulty) return false;
                      if (!showCompleted && unit.progress.status === 'completed') return false;
                      return true;
                    })
                    .map((unit) => (
                      <HoverScaleCard
                        key={unit.unitId}
                        className={`learning-unit-card ${unit.progress.status}`}
                        onClick={() => unit.progress.status !== 'locked' && onUnitSelect(unit)}
                      >
                        <div className="unit-header">
                          <div className="unit-status">
                            {getStatusIcon(unit.progress.status)}
                          </div>
                          <div className="unit-info">
                            <h4>{unit.unitName}</h4>
                            <p>{unit.description}</p>
                          </div>
                          <div className="unit-difficulty">
                            <span 
                              className="difficulty-badge"
                              style={{ backgroundColor: getDifficultyColor(unit.difficulty) }}
                            >
                              {getDifficultyLabel(unit.difficulty)}
                            </span>
                          </div>
                        </div>
                        
                        {unit.progress.status !== 'locked' && (
                          <div className="unit-details">
                            <div className="unit-stats">
                              <div className="stat">
                                <span className="stat-label">時間</span>
                                <span className="stat-value">{unit.estimatedMinutes}分</span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">タイプ</span>
                                <span className="stat-value">
                                  {unit.type === 'concept' ? '概念' :
                                   unit.type === 'practice' ? '練習' :
                                   unit.type === 'application' ? '応用' : 'テスト'}
                                </span>
                              </div>
                              {unit.progress.score > 0 && (
                                <div className="stat">
                                  <span className="stat-label">スコア</span>
                                  <span className="stat-value">{unit.progress.score}点</span>
                                </div>
                              )}
                            </div>
                            
                            {unit.progress.status === 'in_progress' && (
                              <div className="unit-progress">
                                <span className="progress-text">学習中...</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {unit.progress.status === 'locked' && (
                          <div className="locked-message">
                            <p>前の単元を完了してください</p>
                          </div>
                        )}
                      </HoverScaleCard>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 教科階層データ（実際の中学受験カリキュラムに基づく）
function getSubjectHierarchy(): SubjectHierarchy[] {
  return [
    {
      subjectId: 'math',
      subjectName: '算数',
      icon: '🔢',
      color: '#3b82f6',
      description: '数の概念から高度な応用問題まで',
      progress: {
        completedUnits: 45,
        totalUnits: 120,
        completionRate: 37.5,
        masteryLevel: 72,
        timeSpent: 2700, // minutes
        lastAccessed: new Date()
      },
      majorCategories: [
        {
          categoryId: 'numbers',
          categoryName: '数の性質',
          description: '整数・小数・分数の基本概念と性質',
          icon: '🔢',
          estimatedHours: 15,
          difficulty: 'basic',
          progress: {
            completedUnits: 12,
            totalUnits: 15,
            completionRate: 80,
            masteryLevel: 85,
            isUnlocked: true
          },
          midCategories: [
            {
              categoryId: 'integers',
              categoryName: '整数',
              description: '正の数・負の数・素数・約数・倍数',
              prerequisites: [],
              learningObjectives: [
                '正の数と負の数の概念を理解する',
                '素数と合成数を判別できる',
                '約数と倍数の関係を理解する',
                '最大公約数と最小公倍数を求められる'
              ],
              estimatedHours: 5,
              progress: {
                completedUnits: 8,
                totalUnits: 10,
                completionRate: 80,
                masteryLevel: 85,
                isUnlocked: true
              },
              minorCategories: [
                {
                  categoryId: 'basic_integers',
                  categoryName: '整数の基本',
                  description: '正の数・負の数・0の概念',
                  progress: {
                    completedUnits: 3,
                    totalUnits: 4,
                    completionRate: 75,
                    masteryLevel: 80,
                    isUnlocked: true
                  },
                  learningUnits: [
                    {
                      unitId: 'int_001',
                      unitName: '正の数・負の数',
                      description: '正の数と負の数の基本概念',
                      estimatedMinutes: 30,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 95,
                        attempts: 2,
                        timeSpent: 28,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'int_002',
                      unitName: '数の大小関係',
                      description: '正の数・負の数・0の大小関係',
                      estimatedMinutes: 25,
                      difficulty: 'basic',
                      type: 'practice',
                      progress: {
                        status: 'completed',
                        score: 88,
                        attempts: 1,
                        timeSpent: 22,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'int_003',
                      unitName: '整数の性質',
                      description: '偶数・奇数の性質',
                      estimatedMinutes: 20,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 92,
                        attempts: 1,
                        timeSpent: 18,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'int_004',
                      unitName: '整数の基本テスト',
                      description: '整数の基本概念の確認テスト',
                      estimatedMinutes: 15,
                      difficulty: 'basic',
                      type: 'test',
                      progress: {
                        status: 'available',
                        score: 0,
                        attempts: 0,
                        timeSpent: 0
                      }
                    }
                  ]
                },
                {
                  categoryId: 'prime_numbers',
                  categoryName: '素数・合成数',
                  description: '素数と合成数の判別',
                  progress: {
                    completedUnits: 2,
                    totalUnits: 3,
                    completionRate: 67,
                    masteryLevel: 75,
                    isUnlocked: true
                  },
                  learningUnits: [
                    {
                      unitId: 'prime_001',
                      unitName: '素数とは',
                      description: '素数の定義と性質',
                      estimatedMinutes: 35,
                      difficulty: 'intermediate',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 90,
                        attempts: 2,
                        timeSpent: 40,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'prime_002',
                      unitName: '素数の判別',
                      description: '100以下の素数の判別方法',
                      estimatedMinutes: 30,
                      difficulty: 'intermediate',
                      type: 'practice',
                      progress: {
                        status: 'completed',
                        score: 85,
                        attempts: 3,
                        timeSpent: 45,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'prime_003',
                      unitName: '素数の応用',
                      description: '素数を使った問題解決',
                      estimatedMinutes: 40,
                      difficulty: 'advanced',
                      type: 'application',
                      progress: {
                        status: 'in_progress',
                        score: 0,
                        attempts: 1,
                        timeSpent: 15
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          categoryId: 'speed',
          categoryName: '速さ',
          description: '速さ・時間・距離の関係と応用問題',
          icon: '🏃',
          estimatedHours: 20,
          difficulty: 'intermediate',
          progress: {
            completedUnits: 5,
            totalUnits: 18,
            completionRate: 28,
            masteryLevel: 65,
            isUnlocked: true
          },
          midCategories: [
            {
              categoryId: 'basic_speed',
              categoryName: '速さの基本',
              description: '速さ・時間・距離の基本関係',
              prerequisites: ['numbers'],
              learningObjectives: [
                '速さの公式を理解する',
                '時間・距離・速さの関係を把握する',
                '単位変換ができる',
                '基本的な速さの問題を解ける'
              ],
              estimatedHours: 6,
              progress: {
                completedUnits: 5,
                totalUnits: 8,
                completionRate: 63,
                masteryLevel: 70,
                isUnlocked: true
              },
              minorCategories: [
                {
                  categoryId: 'speed_formula',
                  categoryName: '速さの公式',
                  description: '距離÷時間=速さの関係',
                  progress: {
                    completedUnits: 3,
                    totalUnits: 4,
                    completionRate: 75,
                    masteryLevel: 80,
                    isUnlocked: true
                  },
                  learningUnits: [
                    {
                      unitId: 'speed_001',
                      unitName: '速さの定義',
                      description: '速さとは何かを理解する',
                      estimatedMinutes: 25,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 95,
                        attempts: 1,
                        timeSpent: 22,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'speed_002',
                      unitName: '速さの公式',
                      description: '距離・時間・速さの関係式',
                      estimatedMinutes: 30,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 88,
                        attempts: 2,
                        timeSpent: 35,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'speed_003',
                      unitName: '基本問題演習',
                      description: '速さの基本問題を解く',
                      estimatedMinutes: 35,
                      difficulty: 'basic',
                      type: 'practice',
                      progress: {
                        status: 'completed',
                        score: 82,
                        attempts: 3,
                        timeSpent: 42,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'speed_004',
                      unitName: '基本テスト',
                      description: '速さの基本理解度テスト',
                      estimatedMinutes: 20,
                      difficulty: 'basic',
                      type: 'test',
                      progress: {
                        status: 'available',
                        score: 0,
                        attempts: 0,
                        timeSpent: 0
                      }
                    }
                  ]
                }
              ]
            },
            {
              categoryId: 'river_problems',
              categoryName: '流水算',
              description: '川の流れを考慮した速さの問題',
              prerequisites: ['basic_speed'],
              learningObjectives: [
                '流水算の基本概念を理解する',
                '上流・下流での速さの違いを把握する',
                '静水時の速さと流れの速さを求められる',
                '複雑な流水算問題を解ける'
              ],
              estimatedHours: 8,
              progress: {
                completedUnits: 0,
                totalUnits: 10,
                completionRate: 0,
                masteryLevel: 0,
                isUnlocked: false
              },
              minorCategories: [
                {
                  categoryId: 'river_basic',
                  categoryName: '流水算の基本',
                  description: '川の流れと速さの関係',
                  progress: {
                    completedUnits: 0,
                    totalUnits: 4,
                    completionRate: 0,
                    masteryLevel: 0,
                    isUnlocked: false
                  },
                  learningUnits: [
                    {
                      unitId: 'river_001',
                      unitName: '流水算とは',
                      description: '流水算の基本概念',
                      estimatedMinutes: 30,
                      difficulty: 'intermediate',
                      type: 'concept',
                      progress: {
                        status: 'locked',
                        score: 0,
                        attempts: 0,
                        timeSpent: 0
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      subjectId: 'japanese',
      subjectName: '国語',
      icon: '📝',
      color: '#ef4444',
      description: '読解力・表現力・語彙力の総合的な向上',
      progress: {
        completedUnits: 28,
        totalUnits: 95,
        completionRate: 29.5,
        masteryLevel: 68,
        timeSpent: 2100,
        lastAccessed: new Date()
      },
      majorCategories: [
        {
          categoryId: 'reading',
          categoryName: '読解',
          description: '文章読解と内容理解',
          icon: '📖',
          estimatedHours: 25,
          difficulty: 'intermediate',
          progress: {
            completedUnits: 15,
            totalUnits: 35,
            completionRate: 43,
            masteryLevel: 72,
            isUnlocked: true
          },
          midCategories: [
            {
              categoryId: 'narrative',
              categoryName: '物語文',
              description: '小説・物語の読解',
              prerequisites: [],
              learningObjectives: [
                '登場人物の心情を読み取る',
                '場面の様子を理解する',
                '物語の主題を把握する',
                '表現技法を理解する'
              ],
              estimatedHours: 10,
              progress: {
                completedUnits: 8,
                totalUnits: 12,
                completionRate: 67,
                masteryLevel: 75,
                isUnlocked: true
              },
              minorCategories: [
                {
                  categoryId: 'character_psychology',
                  categoryName: '登場人物の心情',
                  description: '心情の変化と読み取り方',
                  progress: {
                    completedUnits: 4,
                    totalUnits: 6,
                    completionRate: 67,
                    masteryLevel: 75,
                    isUnlocked: true
                  },
                  learningUnits: [
                    {
                      unitId: 'char_001',
                      unitName: '心情語彙',
                      description: '心情を表す言葉の理解',
                      estimatedMinutes: 40,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 90,
                        attempts: 1,
                        timeSpent: 38,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'char_002',
                      unitName: '心情の変化',
                      description: '物語の中での心情変化',
                      estimatedMinutes: 45,
                      difficulty: 'intermediate',
                      type: 'practice',
                      progress: {
                        status: 'completed',
                        score: 85,
                        attempts: 2,
                        timeSpent: 52,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'char_003',
                      unitName: '心情読解演習',
                      description: '実際の文章での心情読解',
                      estimatedMinutes: 50,
                      difficulty: 'intermediate',
                      type: 'application',
                      progress: {
                        status: 'completed',
                        score: 78,
                        attempts: 3,
                        timeSpent: 65,
                        lastAccessed: new Date()
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      subjectId: 'science',
      subjectName: '理科',
      icon: '🔬',
      color: '#10b981',
      description: '自然現象の理解と科学的思考力の育成',
      progress: {
        completedUnits: 20,
        totalUnits: 80,
        completionRate: 25,
        masteryLevel: 60,
        timeSpent: 1800,
        lastAccessed: new Date()
      },
      majorCategories: [
        {
          categoryId: 'physics',
          categoryName: '物理',
          description: '力・運動・エネルギーの理解',
          icon: '⚡',
          estimatedHours: 18,
          difficulty: 'intermediate',
          progress: {
            completedUnits: 8,
            totalUnits: 20,
            completionRate: 40,
            masteryLevel: 65,
            isUnlocked: true
          },
          midCategories: [
            {
              categoryId: 'mechanics',
              categoryName: '力学',
              description: '力と運動の基本法則',
              prerequisites: [],
              learningObjectives: [
                '力の概念を理解する',
                '運動の法則を把握する',
                '重力と質量の関係を理解する',
                '簡単な力学問題を解ける'
              ],
              estimatedHours: 8,
              progress: {
                completedUnits: 4,
                totalUnits: 8,
                completionRate: 50,
                masteryLevel: 60,
                isUnlocked: true
              },
              minorCategories: [
                {
                  categoryId: 'force_basics',
                  categoryName: '力の基本',
                  description: '力の定義と性質',
                  progress: {
                    completedUnits: 2,
                    totalUnits: 4,
                    completionRate: 50,
                    masteryLevel: 60,
                    isUnlocked: true
                  },
                  learningUnits: [
                    {
                      unitId: 'force_001',
                      unitName: '力とは何か',
                      description: '力の定義と単位',
                      estimatedMinutes: 35,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 88,
                        attempts: 2,
                        timeSpent: 42,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'force_002',
                      unitName: '力の種類',
                      description: '重力・摩擦力・弾性力',
                      estimatedMinutes: 40,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 85,
                        attempts: 1,
                        timeSpent: 38,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'force_003',
                      unitName: '力の合成',
                      description: '複数の力の合成方法',
                      estimatedMinutes: 45,
                      difficulty: 'intermediate',
                      type: 'practice',
                      progress: {
                        status: 'available',
                        score: 0,
                        attempts: 0,
                        timeSpent: 0
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      subjectId: 'social',
      subjectName: '社会',
      icon: '🌍',
      color: '#f59e0b',
      description: '歴史・地理・公民の総合的な学習',
      progress: {
        completedUnits: 18,
        totalUnits: 75,
        completionRate: 24,
        masteryLevel: 58,
        timeSpent: 1500,
        lastAccessed: new Date()
      },
      majorCategories: [
        {
          categoryId: 'history',
          categoryName: '歴史',
          description: '日本史・世界史の理解',
          icon: '🏛️',
          estimatedHours: 20,
          difficulty: 'intermediate',
          progress: {
            completedUnits: 10,
            totalUnits: 25,
            completionRate: 40,
            masteryLevel: 62,
            isUnlocked: true
          },
          midCategories: [
            {
              categoryId: 'ancient_japan',
              categoryName: '古代日本',
              description: '縄文・弥生・古墳時代',
              prerequisites: [],
              learningObjectives: [
                '各時代の特徴を理解する',
                '重要な出来事を覚える',
                '文化の発展を把握する',
                '時代の流れを理解する'
              ],
              estimatedHours: 6,
              progress: {
                completedUnits: 5,
                totalUnits: 8,
                completionRate: 63,
                masteryLevel: 70,
                isUnlocked: true
              },
              minorCategories: [
                {
                  categoryId: 'jomon',
                  categoryName: '縄文時代',
                  description: '縄文文化と生活',
                  progress: {
                    completedUnits: 3,
                    totalUnits: 4,
                    completionRate: 75,
                    masteryLevel: 80,
                    isUnlocked: true
                  },
                  learningUnits: [
                    {
                      unitId: 'jomon_001',
                      unitName: '縄文時代とは',
                      description: '縄文時代の特徴',
                      estimatedMinutes: 30,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 92,
                        attempts: 1,
                        timeSpent: 28,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'jomon_002',
                      unitName: '縄文土器',
                      description: '縄文土器の特徴と用途',
                      estimatedMinutes: 25,
                      difficulty: 'basic',
                      type: 'concept',
                      progress: {
                        status: 'completed',
                        score: 88,
                        attempts: 2,
                        timeSpent: 32,
                        lastAccessed: new Date()
                      }
                    },
                    {
                      unitId: 'jomon_003',
                      unitName: '縄文の生活',
                      description: '狩猟採集による生活',
                      estimatedMinutes: 35,
                      difficulty: 'basic',
                      type: 'practice',
                      progress: {
                        status: 'completed',
                        score: 85,
                        attempts: 1,
                        timeSpent: 33,
                        lastAccessed: new Date()
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export default HierarchicalSubjectNavigator;
export type { SubjectHierarchy, MajorCategory, MidCategory, MinorCategory, LearningUnit };