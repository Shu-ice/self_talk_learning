import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton,
  AnimatedProgress, 
  HoverScaleCard,
  FloatingActionButton,
  SmileyRating,
  FireworksEffect
} from './ui/MicroInteractions';

/**
 * 🔄 習慣トラッカー
 * 学習習慣の形成・維持・強化のための包括的管理システム
 */

interface HabitTrackerProps {
  userId: string;
  className?: string;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'health' | 'mindset' | 'social';
  frequency: 'daily' | 'weekly' | 'custom';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  difficulty: number;
  importance: number;
  habitStrength: number;
  completionHistory: CompletionRecord[];
  cues: HabitCue[];
  rewards: HabitReward[];
  barriers: HabitBarrier[];
  createdAt: Date;
  lastCompleted?: Date;
  nextDue?: Date;
  isActive: boolean;
}

interface CompletionRecord {
  date: Date;
  completed: boolean;
  quality: number; // 1-5 scale
  notes?: string;
  context: CompletionContext;
  mood: number;
  energy: number;
}

interface CompletionContext {
  time: string;
  location: string;
  social: string;
  environment: string;
  triggers: string[];
}

interface HabitCue {
  type: 'time' | 'location' | 'social' | 'emotional' | 'activity';
  value: string;
  effectiveness: number;
  consistency: number;
  lastTriggered?: Date;
}

interface HabitReward {
  type: 'intrinsic' | 'extrinsic';
  description: string;
  value: number;
  immediacy: 'immediate' | 'delayed' | 'variable';
  frequency: number;
}

interface HabitBarrier {
  type: 'time' | 'energy' | 'motivation' | 'skill' | 'environment';
  description: string;
  severity: number;
  frequency: number;
  strategies: string[];
}

interface HabitFormationStage {
  stage: 'initiation' | 'learning' | 'stability' | 'integration';
  duration: number;
  characteristics: string[];
  strategies: string[];
  milestones: Milestone[];
}

interface Milestone {
  days: number;
  title: string;
  description: string;
  reward: string;
  achieved: boolean;
  achievedAt?: Date;
}

interface HabitInsight {
  type: 'pattern' | 'correlation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  impact: 'low' | 'medium' | 'high';
}

interface WeeklyHabitReport {
  weekStart: Date;
  weekEnd: Date;
  totalCompletions: number;
  averageQuality: number;
  consistencyScore: number;
  habitStrengthChange: number;
  insights: HabitInsight[];
  recommendations: string[];
  nextWeekGoals: string[];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewHabitForm, setShowNewHabitForm] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyHabitReport | null>(null);
  const [habitInsights, setHabitInsights] = useState<HabitInsight[]>([]);
  const [showCelebration, setShowCelebration] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'tracker' | 'analysis' | 'formation'>('tracker');

  // New habit form state
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('learning');
  const [newHabitFrequency, setNewHabitFrequency] = useState<Habit['frequency']>('daily');

  useEffect(() => {
    initializeHabitTracker();
  }, [userId]);

  const initializeHabitTracker = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUserHabits(),
        loadWeeklyReport(),
        loadHabitInsights()
      ]);
    } catch (error) {
      console.error('習慣トラッカー初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserHabits = async () => {
    // Mock data - 実際の実装ではAPIから取得
    const mockHabits: Habit[] = [
      {
        id: 'habit1',
        name: '毎日の学習',
        description: '30分以上の勉強を毎日継続する',
        category: 'learning',
        frequency: 'daily',
        targetCount: 1,
        currentStreak: 14,
        longestStreak: 28,
        difficulty: 3,
        importance: 5,
        habitStrength: 78,
        completionHistory: generateMockCompletionHistory(30),
        cues: [
          {
            type: 'time',
            value: '19:00',
            effectiveness: 0.9,
            consistency: 0.85,
            lastTriggered: new Date()
          },
          {
            type: 'location',
            value: '勉強机',
            effectiveness: 0.8,
            consistency: 0.75
          }
        ],
        rewards: [
          {
            type: 'intrinsic',
            description: '知識の習得感',
            value: 0.9,
            immediacy: 'immediate',
            frequency: 1.0
          }
        ],
        barriers: [
          {
            type: 'motivation',
            description: '疲れているときのやる気不足',
            severity: 0.6,
            frequency: 0.3,
            strategies: ['小さな目標設定', '短時間から開始']
          }
        ],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextDue: new Date(),
        isActive: true
      },
      {
        id: 'habit2',
        name: '朝の振り返り',
        description: '昨日の学習を5分間振り返る',
        category: 'mindset',
        frequency: 'daily',
        targetCount: 1,
        currentStreak: 7,
        longestStreak: 15,
        difficulty: 2,
        importance: 4,
        habitStrength: 45,
        completionHistory: generateMockCompletionHistory(20),
        cues: [
          {
            type: 'activity',
            value: '朝食後',
            effectiveness: 0.7,
            consistency: 0.6
          }
        ],
        rewards: [
          {
            type: 'intrinsic',
            description: '一日の準備感',
            value: 0.7,
            immediacy: 'immediate',
            frequency: 1.0
          }
        ],
        barriers: [
          {
            type: 'time',
            description: '朝の忙しさ',
            severity: 0.7,
            frequency: 0.4,
            strategies: ['前日夜に準備', '短縮版の作成']
          }
        ],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextDue: new Date(),
        isActive: true
      }
    ];

    setHabits(mockHabits);
    if (mockHabits.length > 0) {
      setSelectedHabit(mockHabits[0].id);
    }
  };

  const loadWeeklyReport = async () => {
    const mockReport: WeeklyHabitReport = {
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      weekEnd: new Date(),
      totalCompletions: 12,
      averageQuality: 4.2,
      consistencyScore: 85,
      habitStrengthChange: +5,
      insights: [
        {
          type: 'pattern',
          title: '平日の成功パターン',
          description: '月曜日から金曜日の完遂率が90%と非常に高い',
          confidence: 0.95,
          actionable: true,
          recommendations: ['週末の環境を平日に近づける'],
          impact: 'medium'
        }
      ],
      recommendations: [
        '週末の学習環境を整備する',
        '土日用の短縮プログラムを作成する'
      ],
      nextWeekGoals: [
        '週末の完遂率を70%以上にする',
        '新しい学習方法を1つ試す'
      ]
    };

    setWeeklyReport(mockReport);
  };

  const loadHabitInsights = async () => {
    const insights: HabitInsight[] = [
      {
        type: 'correlation',
        title: '気分と完遂率の相関',
        description: '気分が4以上の日は95%の確率で習慣を完遂している',
        confidence: 0.88,
        actionable: true,
        recommendations: ['気分向上のルーチンを習慣の前に組み込む'],
        impact: 'high'
      },
      {
        type: 'prediction',
        title: '習慣強度予測',
        description: '現在のペースでは3週間後に習慣強度が90%に達する見込み',
        confidence: 0.82,
        actionable: false,
        recommendations: [],
        impact: 'medium'
      }
    ];

    setHabitInsights(insights);
  };

  const generateMockCompletionHistory = (days: number): CompletionRecord[] => {
    const history: CompletionRecord[] = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const completed = Math.random() > 0.2; // 80% completion rate
      
      history.push({
        date,
        completed,
        quality: completed ? Math.floor(Math.random() * 2) + 4 : 1, // 4-5 if completed
        context: {
          time: '19:00',
          location: '自宅',
          social: '一人',
          environment: '静か',
          triggers: ['時計', '勉強机']
        },
        mood: Math.floor(Math.random() * 2) + 4, // 4-5
        energy: Math.floor(Math.random() * 2) + 3 // 3-4
      });
    }
    return history;
  };

  const completeHabit = async (habitId: string, quality: number, notes?: string) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === habitId) {
          const newCompletion: CompletionRecord = {
            date: new Date(),
            completed: true,
            quality,
            notes,
            context: {
              time: new Date().toTimeString().slice(0, 5),
              location: '自宅',
              social: '一人',
              environment: '集中',
              triggers: ['時間', '環境']
            },
            mood: 4,
            energy: 4
          };

          const updatedHabit = {
            ...habit,
            currentStreak: habit.currentStreak + 1,
            longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1),
            habitStrength: Math.min(100, habit.habitStrength + 2),
            completionHistory: [newCompletion, ...habit.completionHistory.slice(0, 29)],
            lastCompleted: new Date(),
            nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000)
          };

          // マイルストーンチェック
          checkMilestones(updatedHabit);

          return updatedHabit;
        }
        return habit;
      })
    );

    // 完了アニメーション
    await celebrateCompletion(habitId);
  };

  const checkMilestones = (habit: Habit) => {
    const milestones: Milestone[] = [
      { days: 7, title: '1週間達成！', description: '継続の第一歩', reward: '特別バッジ', achieved: false },
      { days: 21, title: '習慣化成功！', description: '21日ルール達成', reward: '習慣マスターバッジ', achieved: false },
      { days: 66, title: '自動化完了！', description: '習慣が自然になりました', reward: '伝説バッジ', achieved: false }
    ];

    const currentMilestone = milestones.find(m => 
      m.days === habit.currentStreak && !m.achieved
    );

    if (currentMilestone) {
      currentMilestone.achieved = true;
      currentMilestone.achievedAt = new Date();
      setShowCelebration(currentMilestone);
    }
  };

  const celebrateCompletion = async (habitId: string) => {
    // 完了祝いアニメーション実装
    console.log(`習慣完了祝い: ${habitId}`);
  };

  const addNewHabit = async () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      name: newHabitName.trim(),
      description: newHabitDescription.trim(),
      category: newHabitCategory,
      frequency: newHabitFrequency,
      targetCount: 1,
      currentStreak: 0,
      longestStreak: 0,
      difficulty: 3,
      importance: 4,
      habitStrength: 0,
      completionHistory: [],
      cues: [],
      rewards: [],
      barriers: [],
      createdAt: new Date(),
      nextDue: new Date(),
      isActive: true
    };

    setHabits(prev => [...prev, newHabit]);
    setShowNewHabitForm(false);
    setNewHabitName('');
    setNewHabitDescription('');
    setSelectedHabit(newHabit.id);
  };

  const renderHabitCard = (habit: Habit) => {
    const today = new Date();
    const todayCompletion = habit.completionHistory.find(record => 
      record.date.toDateString() === today.toDateString()
    );
    const isCompletedToday = todayCompletion?.completed || false;
    const recentCompletions = habit.completionHistory.slice(0, 7);

    return (
      <HoverScaleCard
        key={habit.id}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedHabit === habit.id 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => setSelectedHabit(habit.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-2xl">
                {habit.category === 'learning' ? '📚' :
                 habit.category === 'health' ? '🏃' :
                 habit.category === 'mindset' ? '🧠' : '👥'}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-blue-600 font-medium">
                🔥 {habit.currentStreak}日連続
              </span>
              <span className="text-gray-500">
                最長: {habit.longestStreak}日
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {habit.habitStrength}%
            </div>
            <div className="text-xs text-gray-500">習慣強度</div>
          </div>
        </div>

        {/* 最近7日間の完遂状況 */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-2">最近7日間</div>
          <div className="flex space-x-1">
            {Array.from({ length: 7 }, (_, i) => {
              const targetDate = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
              const completion = habit.completionHistory.find(record => 
                record.date.toDateString() === targetDate.toDateString()
              );
              const completed = completion?.completed || false;
              
              return (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {completed ? '✓' : '○'}
                </div>
              );
            })}
          </div>
        </div>

        {/* 習慣強度プログレスバー */}
        <div className="mb-4">
          <AnimatedProgress 
            progress={habit.habitStrength}
            color="purple"
            label="習慣強度"
            showPercentage={false}
          />
        </div>

        {/* 今日の完了ボタン */}
        <div className="space-y-2">
          {isCompletedToday ? (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-green-600 font-medium">
                <span>✅</span>
                <span>今日は完了済み</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                品質: {todayCompletion?.quality}/5 ⭐
              </div>
            </div>
          ) : (
            <SuccessAnimatedButton
              onClick={() => completeHabit(habit.id, 5)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              successMessage="完了！"
            >
              今日の{habit.name}を完了
            </SuccessAnimatedButton>
          )}
        </div>
      </HoverScaleCard>
    );
  };

  const renderHabitAnalysis = () => {
    const selectedHabitData = habits.find(h => h.id === selectedHabit);
    if (!selectedHabitData) return null;

    return (
      <div className="space-y-6">
        <KidsCard title={`📊 ${selectedHabitData.name} の詳細分析`} icon="🔍" color="blue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 完遂パターン分析 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 完遂パターン</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>全体完遂率</span>
                    <span className="font-medium">
                      {Math.round((selectedHabitData.completionHistory.filter(r => r.completed).length / 
                        selectedHabitData.completionHistory.length) * 100)}%
                    </span>
                  </div>
                  <AnimatedProgress 
                    progress={(selectedHabitData.completionHistory.filter(r => r.completed).length / 
                      selectedHabitData.completionHistory.length) * 100}
                    color="green"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>平均品質</span>
                    <span className="font-medium">
                      {(selectedHabitData.completionHistory
                        .filter(r => r.completed)
                        .reduce((sum, r) => sum + r.quality, 0) / 
                        selectedHabitData.completionHistory.filter(r => r.completed).length
                      ).toFixed(1)}/5
                    </span>
                  </div>
                  <AnimatedProgress 
                    progress={(selectedHabitData.completionHistory
                      .filter(r => r.completed)
                      .reduce((sum, r) => sum + r.quality, 0) / 
                      selectedHabitData.completionHistory.filter(r => r.completed).length
                    ) / 5 * 100}
                    color="blue"
                  />
                </div>
              </div>
            </div>

            {/* 成功要因分析 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 成功要因</h3>
              <div className="space-y-3">
                {selectedHabitData.cues.map((cue, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {cue.type === 'time' ? '⏰' :
                         cue.type === 'location' ? '📍' :
                         cue.type === 'social' ? '👥' :
                         cue.type === 'activity' ? '🎯' : '💭'} {cue.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        効果: {Math.round(cue.effectiveness * 100)}%
                      </span>
                    </div>
                    <AnimatedProgress 
                      progress={cue.effectiveness * 100}
                      color="purple"
                      showPercentage={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </KidsCard>

        {/* 障害と対策 */}
        <KidsCard title="🚧 よくある障害と対策" icon="💡" color="orange">
          <div className="space-y-4">
            {selectedHabitData.barriers.map((barrier, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{barrier.description}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>深刻度: {Math.round(barrier.severity * 100)}%</span>
                      <span>頻度: {Math.round(barrier.frequency * 100)}%</span>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {barrier.type === 'time' ? '⏰' :
                     barrier.type === 'energy' ? '⚡' :
                     barrier.type === 'motivation' ? '💪' :
                     barrier.type === 'skill' ? '🎯' : '🌍'}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-800 mb-2">💡 対策</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {barrier.strategies.map((strategy, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </KidsCard>

        {/* 習慣形成段階 */}
        <KidsCard title="📈 習慣形成の進捗" icon="🎯" color="green">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-4xl mb-2">
                {selectedHabitData.habitStrength < 30 ? '🌱' :
                 selectedHabitData.habitStrength < 60 ? '🌿' :
                 selectedHabitData.habitStrength < 90 ? '🌳' : '🏆'}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedHabitData.habitStrength < 30 ? '初期段階' :
                 selectedHabitData.habitStrength < 60 ? '学習段階' :
                 selectedHabitData.habitStrength < 90 ? '安定段階' : '自動化段階'}
              </h3>
              <p className="text-gray-600">
                {selectedHabitData.habitStrength < 30 ? '習慣を始めたばかりです。継続することが大切です。' :
                 selectedHabitData.habitStrength < 60 ? '習慣が身に付き始めています。もう少しで安定します。' :
                 selectedHabitData.habitStrength < 90 ? '習慣が安定してきました。もう少しで自動的になります。' :
                 '習慣が完全に身に付きました！自然に行えるようになっています。'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { threshold: 30, title: '習慣化', days: '21日', icon: '🎯' },
                { threshold: 66, title: '自動化', days: '66日', icon: '🤖' },
                { threshold: 90, title: '完全習得', days: '90日', icon: '🏆' }
              ].map((milestone, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    selectedHabitData.habitStrength >= milestone.threshold
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{milestone.icon}</div>
                  <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                  <p className="text-sm text-gray-600">{milestone.days}継続</p>
                  {selectedHabitData.habitStrength >= milestone.threshold && (
                    <div className="text-green-600 text-sm font-medium mt-1">✅ 達成済み</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </KidsCard>
      </div>
    );
  };

  const renderNewHabitForm = () => (
    <KidsCard title="➕ 新しい習慣を作る" icon="🎯" color="green">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            習慣の名前 *
          </label>
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="例: 毎日の読書"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            詳細説明
          </label>
          <textarea
            value={newHabitDescription}
            onChange={(e) => setNewHabitDescription(e.target.value)}
            placeholder="この習慣の内容を詳しく説明してください"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value as Habit['category'])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="learning">📚 学習</option>
              <option value="health">🏃 健康</option>
              <option value="mindset">🧠 マインドセット</option>
              <option value="social">👥 社会性</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              頻度
            </label>
            <select
              value={newHabitFrequency}
              onChange={(e) => setNewHabitFrequency(e.target.value as Habit['frequency'])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">毎日</option>
              <option value="weekly">週に数回</option>
              <option value="custom">カスタム</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <KidsButton
            variant="primary"
            onClick={addNewHabit}
            disabled={!newHabitName.trim()}
            className="flex-1"
          >
            🎯 習慣を作成
          </KidsButton>
          <KidsButton
            variant="secondary"
            onClick={() => setShowNewHabitForm(false)}
          >
            キャンセル
          </KidsButton>
        </div>
      </div>
    </KidsCard>
  );

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">習慣データ読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 ${className}`}>
      {/* 花火エフェクト（マイルストーン達成時） */}
      <FireworksEffect trigger={!!showCelebration} />

      {/* マイルストーン祝い */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {showCelebration.title}
            </h2>
            <p className="text-gray-600 mb-4">{showCelebration.description}</p>
            <div className="text-sm text-yellow-600 mb-6">
              🏆 報酬: {showCelebration.reward}
            </div>
            <KidsButton
              variant="primary"
              onClick={() => setShowCelebration(null)}
              className="w-full"
            >
              ありがとう！
            </KidsButton>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🔄 習慣トラッカー
            </h1>
            <p className="text-lg text-gray-600">
              小さな積み重ねが大きな成果を生む
            </p>
          </div>

          {/* ナビゲーションタブ */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {[
                  { key: 'tracker', label: '🔄 習慣管理', icon: '🔄' },
                  { key: 'analysis', label: '📊 分析', icon: '📊' },
                  { key: 'formation', label: '🌱 形成支援', icon: '🌱' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedView(tab.key as any)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedView === tab.key
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          {selectedView === 'tracker' && (
            <div className="space-y-6">
              {/* 新規習慣作成フォーム */}
              {showNewHabitForm && renderNewHabitForm()}

              {/* 習慣一覧 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.filter(h => h.isActive).map(renderHabitCard)}
                
                {/* 新規習慣追加カード */}
                <HoverScaleCard
                  onClick={() => setShowNewHabitForm(true)}
                  className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">➕</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      新しい習慣を作る
                    </h3>
                    <p className="text-sm text-gray-500">
                      継続したい新しい習慣を追加しましょう
                    </p>
                  </div>
                </HoverScaleCard>
              </div>

              {/* 週間レポート */}
              {weeklyReport && (
                <KidsCard title="📈 今週のレポート" icon="📊" color="blue">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {weeklyReport.totalCompletions}
                      </div>
                      <div className="text-sm text-gray-600">総完了数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {weeklyReport.averageQuality.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">平均品質</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {weeklyReport.consistencyScore}%
                      </div>
                      <div className="text-sm text-gray-600">一貫性</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        weeklyReport.habitStrengthChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {weeklyReport.habitStrengthChange >= 0 ? '+' : ''}{weeklyReport.habitStrengthChange}
                      </div>
                      <div className="text-sm text-gray-600">習慣強度変化</div>
                    </div>
                  </div>
                </KidsCard>
              )}
            </div>
          )}

          {selectedView === 'analysis' && renderHabitAnalysis()}

          {selectedView === 'formation' && (
            <div className="space-y-6">
              <KidsCard title="🌱 習慣形成ガイド" icon="📚" color="green">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    習慣形成支援機能
                  </h3>
                  <p className="text-gray-600">
                    科学的根拠に基づく習慣形成ガイドを準備中です
                  </p>
                </div>
              </KidsCard>
            </div>
          )}
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="🔄"
        onClick={() => {
          // クイック習慣完了
          const pendingHabit = habits.find(h => {
            const today = new Date();
            const todayCompletion = h.completionHistory.find(record => 
              record.date.toDateString() === today.toDateString()
            );
            return !todayCompletion?.completed;
          });
          
          if (pendingHabit) {
            completeHabit(pendingHabit.id, 4, 'クイック完了');
          }
        }}
        tooltip="クイック完了"
        color="purple"
        position="bottom-right"
      />
    </div>
  );
};

export default HabitTracker;