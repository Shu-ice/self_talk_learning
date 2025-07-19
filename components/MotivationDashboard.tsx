import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  AnimatedProgress, 
  HoverScaleCard,
  FloatingActionButton,
  ParticleBackground,
  AchievementToast,
  SmileyRating,
  FireworksEffect
} from './ui/MicroInteractions';

/**
 * 🎯 モチベーション・習慣化ダッシュボード
 * 学習継続とモチベーション維持のためのインタラクティブ管理画面
 */

interface MotivationDashboardProps {
  userId: string;
  className?: string;
}

interface MotivationSnapshot {
  currentLevel: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  primaryType: string;
  intrinsicScore: number;
  extrinsicScore: number;
  flowState: number;
  lastUpdated: Date;
}

interface HabitStatus {
  habitId: string;
  name: string;
  description: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  difficulty: number;
  habitStrength: number;
  nextMilestone: number;
  contextualCues: ContextualCue[];
  recentCompletions: boolean[];
}

interface ContextualCue {
  type: 'time' | 'location' | 'social' | 'emotional';
  value: string;
  effectiveness: number;
}

interface MotivationIntervention {
  id: string;
  type: 'encouragement' | 'challenge' | 'variety' | 'social' | 'reward' | 'purpose';
  title: string;
  description: string;
  estimatedEffectiveness: number;
  timeToImplement: number;
  personalizedFor: string;
  implemented: boolean;
  results?: InterventionResult;
}

interface InterventionResult {
  effectivenessScore: number;
  userFeedback: number;
  behaviorChange: number;
  duration: number;
}

interface Achievement {
  id: string;
  category: 'streak' | 'mastery' | 'consistency' | 'challenge' | 'social';
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  celebrationShown: boolean;
}

interface PersonalityInsight {
  trait: string;
  score: number;
  description: string;
  learningImplications: string[];
  motivationStrategies: string[];
}

const MotivationDashboard: React.FC<MotivationDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'habits' | 'interventions' | 'insights'>('overview');
  const [motivationSnapshot, setMotivationSnapshot] = useState<MotivationSnapshot | null>(null);
  const [habitStatuses, setHabitStatuses] = useState<HabitStatus[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<MotivationIntervention[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [personalityInsights, setPersonalityInsights] = useState<PersonalityInsight[]>([]);
  const [motivationHistory, setMotivationHistory] = useState<number[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [showCelebration, setShowCelebration] = useState<Achievement | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMotivationDashboard();
  }, [userId]);

  const initializeMotivationDashboard = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadMotivationSnapshot(),
        loadHabitStatuses(),
        loadAvailableInterventions(),
        loadRecentAchievements(),
        loadPersonalityInsights(),
        loadMotivationHistory()
      ]);
    } catch (error) {
      console.error('モチベーションダッシュボード初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMotivationSnapshot = async () => {
    // Mock data - 実際の実装ではMotivationEngineから取得
    const snapshot: MotivationSnapshot = {
      currentLevel: 78,
      trend: 'increasing',
      primaryType: 'マスタリー指向',
      intrinsicScore: 82,
      extrinsicScore: 74,
      flowState: 85,
      lastUpdated: new Date()
    };
    setMotivationSnapshot(snapshot);
  };

  const loadHabitStatuses = async () => {
    const habits: HabitStatus[] = [
      {
        habitId: 'daily_study',
        name: '毎日の学習',
        description: '毎日30分以上の学習を継続',
        currentStreak: 12,
        longestStreak: 28,
        completionRate: 85,
        difficulty: 3,
        habitStrength: 78,
        nextMilestone: 30,
        contextualCues: [
          { type: 'time', value: '19:00', effectiveness: 0.9 },
          { type: 'location', value: '勉強机', effectiveness: 0.8 }
        ],
        recentCompletions: [true, true, false, true, true, true, true]
      },
      {
        habitId: 'morning_review',
        name: '朝の復習',
        description: '朝食後の10分復習',
        currentStreak: 5,
        longestStreak: 15,
        completionRate: 68,
        difficulty: 2,
        habitStrength: 45,
        nextMilestone: 7,
        contextualCues: [
          { type: 'time', value: '07:30', effectiveness: 0.7 },
          { type: 'social', value: '朝食後', effectiveness: 0.6 }
        ],
        recentCompletions: [true, false, true, true, false, true, true]
      }
    ];
    setHabitStatuses(habits);
  };

  const loadAvailableInterventions = async () => {
    const interventions: MotivationIntervention[] = [
      {
        id: 'challenge_boost',
        type: 'challenge',
        title: '新しいチャレンジ',
        description: '普段より少し難しい問題に挑戦してマスタリー感を高めましょう',
        estimatedEffectiveness: 85,
        timeToImplement: 5,
        personalizedFor: 'マスタリー指向型',
        implemented: false
      },
      {
        id: 'variety_injection',
        type: 'variety',
        title: '学習方法の変化',
        description: 'ゲーム形式やクイズ形式で新鮮さを取り入れましょう',
        estimatedEffectiveness: 78,
        timeToImplement: 3,
        personalizedFor: '新奇性追求型',
        implemented: false
      },
      {
        id: 'social_connection',
        type: 'social',
        title: '家族との共有',
        description: '今日学んだことを家族に教えてあげましょう',
        estimatedEffectiveness: 72,
        timeToImplement: 10,
        personalizedFor: '社会的承認欲求',
        implemented: false
      }
    ];
    setAvailableInterventions(interventions);
  };

  const loadRecentAchievements = async () => {
    const achievements: Achievement[] = [
      {
        id: 'streak_7',
        category: 'streak',
        title: '継続の力',
        description: '7日間連続で学習を継続しました',
        icon: '🔥',
        rarity: 'rare',
        unlockedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        celebrationShown: false
      },
      {
        id: 'accuracy_90',
        category: 'mastery',
        title: '正確性マスター',
        description: '正答率90%以上を3日連続で達成',
        icon: '🎯',
        rarity: 'epic',
        unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        celebrationShown: true
      }
    ];
    setRecentAchievements(achievements);

    // 未表示のお祝いがあるかチェック
    const uncelebrated = achievements.find(a => !a.celebrationShown);
    if (uncelebrated) {
      setShowCelebration(uncelebrated);
      if (uncelebrated.rarity === 'legendary' || uncelebrated.rarity === 'epic') {
        setShowFireworks(true);
      }
    }
  };

  const loadPersonalityInsights = async () => {
    const insights: PersonalityInsight[] = [
      {
        trait: 'やり抜く力',
        score: 85,
        description: '困難に直面しても粘り強く取り組む傾向が強い',
        learningImplications: ['長期目標設定が効果的', '段階的な挑戦を好む'],
        motivationStrategies: ['マイルストーン設定', '進歩の可視化', '困難度の段階的上昇']
      },
      {
        trait: '好奇心',
        score: 92,
        description: '新しいことを学ぶことに強い興味を示す',
        learningImplications: ['多様な学習方法が効果的', '探索的学習を好む'],
        motivationStrategies: ['新規性の提供', '発見的学習', '関連知識の拡張']
      }
    ];
    setPersonalityInsights(insights);
  };

  const loadMotivationHistory = async () => {
    // 過去7日間のモチベーション推移
    const history = [72, 75, 68, 80, 77, 82, 78];
    setMotivationHistory(history);
  };

  const implementIntervention = async (intervention: MotivationIntervention) => {
    console.log('介入実装:', intervention.title);
    
    // 楽観的UI更新
    setAvailableInterventions(prev => 
      prev.map(i => 
        i.id === intervention.id 
          ? { ...i, implemented: true }
          : i
      )
    );

    // 実際の実装では、MotivationEngineに送信
    try {
      const result = await implementMotivationIntervention(intervention);
      
      // 結果に基づいてUI更新
      if (result.success) {
        // モチベーション向上のアニメーション
        await animateMotivationIncrease();
      }
    } catch (error) {
      console.error('介入実装エラー:', error);
      // エラー時は元に戻す
      setAvailableInterventions(prev => 
        prev.map(i => 
          i.id === intervention.id 
            ? { ...i, implemented: false }
            : i
        )
      );
    }
  };

  const updateHabitCompletion = async (habitId: string, completed: boolean) => {
    setHabitStatuses(prev => 
      prev.map(habit => 
        habit.habitId === habitId 
          ? {
              ...habit,
              currentStreak: completed ? habit.currentStreak + 1 : 0,
              recentCompletions: [completed, ...habit.recentCompletions.slice(0, 6)]
            }
          : habit
      )
    );

    if (completed) {
      // 習慣完了の祝福アニメーション
      await celebrateHabitCompletion(habitId);
    }
  };

  const updateMoodFeedback = async (mood: number) => {
    setCurrentMood(mood);
    
    // 気分に基づいた適応的介入の提案
    if (mood <= 2) {
      await suggestMoodBoostingInterventions();
    }
  };

  const implementMotivationIntervention = async (intervention: MotivationIntervention): Promise<any> => {
    // API呼び出し実装
    return { success: true, effectivenessIncrease: 0.1 };
  };

  const animateMotivationIncrease = async () => {
    // モチベーション上昇アニメーション
    if (motivationSnapshot) {
      const currentLevel = motivationSnapshot.currentLevel;
      const targetLevel = Math.min(100, currentLevel + 5);
      
      // アニメーション効果
      for (let i = currentLevel; i <= targetLevel; i++) {
        setTimeout(() => {
          setMotivationSnapshot(prev => prev ? { ...prev, currentLevel: i } : null);
        }, (i - currentLevel) * 50);
      }
    }
  };

  const celebrateHabitCompletion = async (habitId: string) => {
    const habit = habitStatuses.find(h => h.habitId === habitId);
    if (habit && habit.currentStreak > 0 && habit.currentStreak % 7 === 0) {
      // 週間連続達成の祝福
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 3000);
    }
  };

  const suggestMoodBoostingInterventions = async () => {
    const moodBoostInterventions: MotivationIntervention[] = [
      {
        id: 'quick_win',
        type: 'encouragement',
        title: '簡単な成功体験',
        description: '簡単な問題から始めて自信を回復しましょう',
        estimatedEffectiveness: 80,
        timeToImplement: 2,
        personalizedFor: '気分向上',
        implemented: false
      }
    ];
    
    setAvailableInterventions(prev => [...moodBoostInterventions, ...prev]);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* モチベーションメーター */}
      <KidsCard title="🎯 現在のモチベーション" icon="📊" color="blue">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {motivationSnapshot?.currentLevel}%
              </div>
              <div className={`text-lg font-medium ${
                motivationSnapshot?.trend === 'increasing' ? 'text-green-600' :
                motivationSnapshot?.trend === 'stable' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {motivationSnapshot?.trend === 'increasing' ? '📈 上昇中' :
                 motivationSnapshot?.trend === 'stable' ? '➡️ 安定' : '📉 低下傾向'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>内発的モチベーション</span>
                  <span>{motivationSnapshot?.intrinsicScore}%</span>
                </div>
                <AnimatedProgress 
                  progress={motivationSnapshot?.intrinsicScore || 0}
                  color="green"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>外発的モチベーション</span>
                  <span>{motivationSnapshot?.extrinsicScore}%</span>
                </div>
                <AnimatedProgress 
                  progress={motivationSnapshot?.extrinsicScore || 0}
                  color="blue"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>フロー状態</span>
                  <span>{motivationSnapshot?.flowState}%</span>
                </div>
                <AnimatedProgress 
                  progress={motivationSnapshot?.flowState || 0}
                  color="purple"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 モチベーション推移 (7日間)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-end justify-between">
              {motivationHistory.map((level, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-blue-500 rounded-t w-8 transition-all duration-500"
                    style={{ height: `${(level / 100) * 120}px` }}
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    {index === 6 ? '今日' : `${6-index}日前`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </KidsCard>

      {/* 今日の気分 */}
      <KidsCard title="😊 今日の気分チェック" icon="💭" color="yellow">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            今の気分を教えてください。あなたに合ったサポートを提案します。
          </p>
          <SmileyRating
            value={currentMood}
            onChange={updateMoodFeedback}
            size="large"
          />
          <div className="mt-4 text-sm text-gray-600">
            {currentMood <= 2 ? '気持ちを上げるサポートを用意しています' :
             currentMood <= 3 ? '今日も一緒に頑張りましょう' :
             currentMood <= 4 ? '調子が良いですね！' :
             '素晴らしい気分ですね！この調子で続けましょう'}
          </div>
        </div>
      </KidsCard>

      {/* 最近の達成 */}
      <KidsCard title="🏆 最近の達成" icon="🎉" color="green">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentAchievements.slice(0, 4).map((achievement) => (
            <HoverScaleCard
              key={achievement.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {achievement.description}
                </p>
                <div className={`text-xs px-2 py-1 rounded ${
                  achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {achievement.rarity === 'legendary' ? '✨ 伝説' :
                   achievement.rarity === 'epic' ? '💜 エピック' :
                   achievement.rarity === 'rare' ? '💎 レア' : '🥉 通常'}
                </div>
              </div>
            </HoverScaleCard>
          ))}
        </div>
      </KidsCard>
    </div>
  );

  const renderHabitsTab = () => (
    <div className="space-y-6">
      {habitStatuses.map((habit) => (
        <KidsCard key={habit.habitId} title={habit.name} icon="🔄" color="purple">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 習慣の基本情報 */}
            <div>
              <p className="text-gray-700 mb-4">{habit.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">現在の連続記録</span>
                  <span className="font-bold text-purple-600">{habit.currentStreak}日</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">最長記録</span>
                  <span className="font-bold text-gray-800">{habit.longestStreak}日</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">達成率</span>
                  <span className="font-bold text-green-600">{habit.completionRate}%</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>習慣の強さ</span>
                  <span>{habit.habitStrength}%</span>
                </div>
                <AnimatedProgress 
                  progress={habit.habitStrength}
                  color="purple"
                />
              </div>
            </div>

            {/* 最近の実行状況 */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">📅 最近7日間</h4>
              <div className="flex space-x-2 mb-4">
                {habit.recentCompletions.map((completed, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {completed ? '✓' : '×'}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <KidsButton
                  variant={habit.recentCompletions[0] ? 'success' : 'primary'}
                  onClick={() => updateHabitCompletion(habit.habitId, !habit.recentCompletions[0])}
                  disabled={habit.recentCompletions[0]}
                >
                  {habit.recentCompletions[0] ? '✅ 今日は完了' : '📝 今日実行する'}
                </KidsButton>
              </div>
            </div>

            {/* 習慣のきっかけ */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">💡 成功のきっかけ</h4>
              <div className="space-y-2">
                {habit.contextualCues.map((cue, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {cue.type === 'time' ? '⏰' :
                         cue.type === 'location' ? '📍' :
                         cue.type === 'social' ? '👥' : '💭'} {cue.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        効果: {Math.round(cue.effectiveness * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-purple-500 h-1 rounded-full"
                        style={{ width: `${cue.effectiveness * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600 mb-2">
                  次のマイルストーン: {habit.nextMilestone}日
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(habit.currentStreak / habit.nextMilestone) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </KidsCard>
      ))}
    </div>
  );

  const renderInterventionsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🚀 あなた専用のモチベーション向上法
        </h2>
        <p className="text-gray-600">
          あなたの学習パターンと性格に合わせてカスタマイズされた提案です
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableInterventions.map((intervention) => (
          <HoverScaleCard
            key={intervention.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {intervention.type === 'challenge' ? '🎯' :
                 intervention.type === 'variety' ? '🎨' :
                 intervention.type === 'social' ? '👥' :
                 intervention.type === 'reward' ? '🎁' :
                 intervention.type === 'purpose' ? '🌟' : '💪'}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {intervention.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {intervention.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">効果予測</span>
                <span className="font-medium text-green-600">
                  {intervention.estimatedEffectiveness}%
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">所要時間</span>
                <span className="font-medium text-blue-600">
                  {intervention.timeToImplement}分
                </span>
              </div>

              <div className="text-xs text-gray-500 text-center">
                {intervention.personalizedFor} 向けにカスタマイズ
              </div>

              <KidsButton
                variant={intervention.implemented ? 'success' : 'primary'}
                onClick={() => implementIntervention(intervention)}
                disabled={intervention.implemented}
                className="w-full"
              >
                {intervention.implemented ? '✅ 実装済み' : '🚀 今すぐ試す'}
              </KidsButton>
            </div>
          </HoverScaleCard>
        ))}
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <KidsCard title="🧠 あなたの学習個性分析" icon="🔍" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalityInsights.map((insight, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {insight.trait}
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {insight.score}%
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${insight.score}%` }}
                />
              </div>

              <p className="text-sm text-gray-700 mb-4">
                {insight.description}
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    💡 学習への影響
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {insight.learningImplications.map((implication, i) => (
                      <li key={i}>• {implication}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    🎯 効果的な戦略
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {insight.motivationStrategies.map((strategy, i) => (
                      <li key={i}>• {strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </KidsCard>

      <KidsCard title="📊 モチベーションタイプ" icon="🎭" color="purple">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {motivationSnapshot?.primaryType}
          </h3>
          <p className="text-gray-600 mb-6">
            あなたは「達成感」と「スキル向上」に最も強く動機づけられます
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">強み</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 困難な問題への挑戦を楽しむ</li>
                <li>• 継続的な成長を重視</li>
                <li>• 自主的な学習を好む</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">最適な環境</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 段階的な難易度上昇</li>
                <li>• 明確な進歩の可視化</li>
                <li>• 選択の自由がある環境</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">注意点</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 過度な外部評価への依存</li>
                <li>• 完璧主義による停滞</li>
                <li>• 単調さへの飽きやすさ</li>
              </ul>
            </div>
          </div>
        </div>
      </KidsCard>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">モチベーション分析中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <ParticleBackground particleCount={20} color="#3B82F6" speed={0.3} />
      
      {/* 花火エフェクト */}
      <FireworksEffect trigger={showFireworks} />
      
      {/* 達成祝いトースト */}
      {showCelebration && (
        <AchievementToast
          achievement={{
            title: showCelebration.title,
            description: showCelebration.description,
            icon: showCelebration.icon,
            rarity: showCelebration.rarity
          }}
          onClose={() => setShowCelebration(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎯 モチベーション・コントロール
            </h1>
            <p className="text-lg text-gray-600">
              あなた専用の学習継続サポートシステム
            </p>
          </div>

          {/* ナビゲーションタブ */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {[
                  { key: 'overview', label: '📊 概要', icon: '📊' },
                  { key: 'habits', label: '🔄 習慣', icon: '🔄' },
                  { key: 'interventions', label: '🚀 向上法', icon: '🚀' },
                  { key: 'insights', label: '🧠 分析', icon: '🧠' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedTab === tab.key
                        ? 'bg-blue-500 text-white shadow-md'
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
          <div className="space-y-6">
            {selectedTab === 'overview' && renderOverviewTab()}
            {selectedTab === 'habits' && renderHabitsTab()}
            {selectedTab === 'interventions' && renderInterventionsTab()}
            {selectedTab === 'insights' && renderInsightsTab()}
          </div>
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="🎯"
        onClick={() => {
          // 即座にモチベーション向上アクション
          console.log('クイックモチベーションブースト');
        }}
        tooltip="クイックブースト"
        color="purple"
        position="bottom-right"
        pulse={currentMood <= 2}
      />
    </div>
  );
};

export default MotivationDashboard;