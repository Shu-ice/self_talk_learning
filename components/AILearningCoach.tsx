import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton,
  AnimatedProgress,
  HoverScaleCard,
  FloatingActionButton,
  ParticleBackground,
  SmileyRating,
  AchievementToast,
  FireworksEffect
} from './ui/MicroInteractions';

/**
 * 🤖 AI学習コーチ・メンターシステム
 * パーソナライズドAIによる包括的学習支援・指導・メンタリング
 */

interface AILearningCoachProps {
  userId: string;
  className?: string;
}

interface CoachingSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  sessionType: 'diagnostic' | 'guidance' | 'motivation' | 'strategy' | 'reflection';
  interactions: CoachInteraction[];
  insights: CoachingInsight[];
  recommendations: CoachRecommendation[];
  learnerResponse: LearnerResponse;
  effectiveness: number;
}

interface CoachInteraction {
  id: string;
  timestamp: Date;
  type: 'question' | 'explanation' | 'encouragement' | 'strategy_suggestion' | 'reflection_prompt';
  content: string;
  intent: string;
  personalizedFor: string[];
  learnerResponse?: string;
  emotionalTone: string;
  adaptationLevel: number;
}

interface CoachingInsight {
  type: 'learning_pattern' | 'strength' | 'challenge' | 'preference' | 'emotion' | 'strategy';
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  actionable: boolean;
  implications: string[];
  recommendations: string[];
}

interface CoachRecommendation {
  id: string;
  category: 'study_strategy' | 'time_management' | 'motivation' | 'skill_development' | 'wellbeing';
  priority: 'immediate' | 'short_term' | 'long_term';
  recommendation: string;
  rationale: string;
  implementation: ImplementationGuide;
  expectedBenefit: string;
  successMetrics: string[];
  personalizationScore: number;
}

interface ImplementationGuide {
  steps: string[];
  timeframe: string;
  resources: string[];
  supportNeeded: string[];
  potentialChallenges: string[];
  successTips: string[];
}

interface LearnerResponse {
  engagement: number;
  understanding: number;
  satisfaction: number;
  motivation: number;
  implementation_intent: number;
  feedback: string;
}

interface AICoachPersonality {
  name: string;
  avatar: string;
  characteristics: string[];
  communicationStyle: CommunicationStyle;
  specializations: string[];
  adaptabilityLevel: number;
}

interface CommunicationStyle {
  tone: 'encouraging' | 'direct' | 'gentle' | 'enthusiastic' | 'analytical';
  formality: number;
  emotionalIntelligence: number;
  patience: number;
  humorLevel: number;
  supportiveness: number;
}

interface LearningAnalysis {
  currentPerformance: PerformanceAnalysis;
  learningPatterns: LearningPattern[];
  strengths: StrengthArea[];
  challengeAreas: ChallengeArea[];
  motivationalState: MotivationalAnalysis;
  strategicRecommendations: StrategyRecommendation[];
}

interface PerformanceAnalysis {
  overallProgress: number;
  subjectPerformance: { [subject: string]: SubjectAnalysis };
  skillDevelopment: SkillDevelopmentAnalysis;
  consistencyMetrics: ConsistencyMetrics;
  improvementTrends: ImprovementTrend[];
}

interface SubjectAnalysis {
  currentLevel: number;
  progressRate: number;
  strengths: string[];
  challenges: string[];
  nextMilestones: string[];
  recommendedFocus: string[];
}

interface SkillDevelopmentAnalysis {
  cognitiveSkills: { [skill: string]: number };
  metacognitiveSkills: { [skill: string]: number };
  socialEmotionalSkills: { [skill: string]: number };
  developmentPriorities: string[];
}

interface ConsistencyMetrics {
  studyFrequency: number;
  sessionCompletionRate: number;
  goalAchievementRate: number;
  engagementStability: number;
  motivationConsistency: number;
}

interface ImprovementTrend {
  area: string;
  trend: 'improving' | 'stable' | 'declining';
  rate: number;
  timeframe: string;
  contributing_factors: string[];
}

interface LearningPattern {
  pattern: string;
  description: string;
  frequency: number;
  contexts: string[];
  impact: 'positive' | 'neutral' | 'negative';
  recommendations: string[];
}

interface StrengthArea {
  area: string;
  level: number;
  evidence: string[];
  utilization: number;
  development_potential: number;
  leverage_opportunities: string[];
}

interface ChallengeArea {
  area: string;
  severity: number;
  impact: number;
  root_causes: string[];
  intervention_strategies: string[];
  support_needed: string[];
  timeline_for_improvement: string;
}

interface MotivationalAnalysis {
  currentLevel: number;
  motivationType: string;
  intrinsicFactors: { [factor: string]: number };
  extrinsicFactors: { [factor: string]: number };
  barriers: string[];
  enhancers: string[];
  sustainability: number;
}

interface StrategyRecommendation {
  strategy: string;
  description: string;
  suitability: number;
  effectiveness_evidence: string;
  implementation_complexity: number;
  expected_timeline: string;
  success_indicators: string[];
}

interface ReflectionPrompt {
  id: string;
  prompt: string;
  type: 'self_assessment' | 'goal_reflection' | 'strategy_evaluation' | 'emotion_check' | 'progress_review';
  guidance: string;
  expectedInsights: string[];
}

interface GoalGuidance {
  currentGoals: LearningGoal[];
  goalAssessment: GoalAssessment;
  recommendations: GoalRecommendation[];
  nextSteps: string[];
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'skill' | 'habit' | 'motivation';
  timeframe: string;
  measurable: boolean;
  progress: number;
  milestones: Milestone[];
}

interface GoalAssessment {
  clarity: number;
  achievability: number;
  relevance: number;
  specificity: number;
  measurability: number;
  overall_quality: number;
}

interface GoalRecommendation {
  type: 'adjust' | 'add' | 'break_down' | 'timeline_adjust';
  description: string;
  rationale: string;
  implementation: string;
}

interface Milestone {
  title: string;
  deadline: Date;
  completed: boolean;
  progress: number;
}

const AILearningCoach: React.FC<AILearningCoachProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [selectedTab, setSelectedTab] = useState<'chat' | 'analysis' | 'goals' | 'reflection'>('chat');
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [learningAnalysis, setLearningAnalysis] = useState<LearningAnalysis | null>(null);
  const [coachPersonality, setCoachPersonality] = useState<AICoachPersonality | null>(null);
  const [chatMessages, setChatMessages] = useState<CoachInteraction[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  const [showInsight, setShowInsight] = useState<CoachingInsight | null>(null);
  const [goalGuidance, setGoalGuidance] = useState<GoalGuidance | null>(null);
  const [reflectionPrompts, setReflectionPrompts] = useState<ReflectionPrompt[]>([]);
  const [currentReflection, setCurrentReflection] = useState<ReflectionPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    initializeAICoach();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const initializeAICoach = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadCoachPersonality(),
        performLearningAnalysis(),
        initializeChatSession(),
        loadGoalGuidance(),
        generateReflectionPrompts()
      ]);
    } catch (error) {
      console.error('AIコーチ初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoachPersonality = async () => {
    // パーソナライズされたコーチ性格設定
    const personality: AICoachPersonality = {
      name: 'ココロ先生',
      avatar: '🤖',
      characteristics: [
        '共感性が高い',
        '個別指導の専門家',
        '成長マインドセット',
        '励ましが上手',
        '科学的根拠重視'
      ],
      communicationStyle: {
        tone: 'encouraging',
        formality: 0.7,
        emotionalIntelligence: 0.9,
        patience: 0.95,
        humorLevel: 0.6,
        supportiveness: 0.95
      },
      specializations: [
        '学習戦略指導',
        'モチベーション支援',
        'メタ認知開発',
        '目標設定ガイダンス',
        '感情サポート'
      ],
      adaptabilityLevel: 0.9
    };

    setCoachPersonality(personality);
  };

  const performLearningAnalysis = async () => {
    // 包括的学習分析
    const analysis: LearningAnalysis = {
      currentPerformance: {
        overallProgress: 78,
        subjectPerformance: {
          '算数': {
            currentLevel: 75,
            progressRate: 1.2,
            strengths: ['計算速度', '図形理解'],
            challenges: ['文章題', '応用問題'],
            nextMilestones: ['分数の計算マスター', '応用問題50%正答'],
            recommendedFocus: ['文章題読解力', '問題文の可視化']
          },
          '国語': {
            currentLevel: 82,
            progressRate: 0.8,
            strengths: ['読解力', '漢字'],
            challenges: ['作文', '文法'],
            nextMilestones: ['作文構成力向上', '敬語の使い分け'],
            recommendedFocus: ['文章構成', '語彙拡充']
          }
        },
        skillDevelopment: {
          cognitiveSkills: { '注意力': 0.8, '記憶力': 0.75, '思考力': 0.82 },
          metacognitiveSkills: { '自己認識': 0.7, '戦略選択': 0.65, '自己調整': 0.72 },
          socialEmotionalSkills: { '自己効力感': 0.78, '粘り強さ': 0.85, '協調性': 0.8 },
          developmentPriorities: ['メタ認知戦略', '自己調整スキル']
        },
        consistencyMetrics: {
          studyFrequency: 0.85,
          sessionCompletionRate: 0.92,
          goalAchievementRate: 0.75,
          engagementStability: 0.8,
          motivationConsistency: 0.78
        },
        improvementTrends: [
          {
            area: '算数計算',
            trend: 'improving',
            rate: 0.15,
            timeframe: '過去4週間',
            contributing_factors: ['毎日の練習', '基礎固め重視']
          },
          {
            area: '学習継続',
            trend: 'improving',
            rate: 0.12,
            timeframe: '過去6週間',
            contributing_factors: ['習慣化成功', '目標明確化']
          }
        ]
      },
      learningPatterns: [
        {
          pattern: '午後の集中力低下',
          description: '14-16時の学習効率が20%低下',
          frequency: 0.8,
          contexts: ['長時間学習後', '昼食後'],
          impact: 'negative',
          recommendations: ['午後は軽い復習中心', '短時間集中セッション']
        },
        {
          pattern: '視覚的説明時の理解向上',
          description: '図やイラスト併用時の理解度30%向上',
          frequency: 0.9,
          contexts: ['新概念学習', '複雑な問題'],
          impact: 'positive',
          recommendations: ['マインドマップ活用', '視覚的ノート作成']
        }
      ],
      strengths: [
        {
          area: '継続力',
          level: 0.85,
          evidence: ['28日間連続学習', '目標達成率75%'],
          utilization: 0.8,
          development_potential: 0.9,
          leverage_opportunities: ['長期目標設定', 'チャレンジ課題']
        },
        {
          area: '好奇心',
          level: 0.9,
          evidence: ['質問頻度高', '関連知識探索'],
          utilization: 0.7,
          development_potential: 0.95,
          leverage_opportunities: ['探究型学習', '自主研究プロジェクト']
        }
      ],
      challengeAreas: [
        {
          area: '計画性',
          severity: 0.6,
          impact: 0.7,
          root_causes: ['時間感覚の未発達', '優先順位付けの困難'],
          intervention_strategies: ['時間管理ツール導入', 'スケジュール視覚化'],
          support_needed: ['保護者のサポート', 'リマインダー機能'],
          timeline_for_improvement: '8-12週間'
        }
      ],
      motivationalState: {
        currentLevel: 0.78,
        motivationType: 'マスタリー指向',
        intrinsicFactors: { '成長実感': 0.8, '自律性': 0.7, '関連性': 0.75 },
        extrinsicFactors: { '称賛': 0.6, '報酬': 0.5, '競争': 0.4 },
        barriers: ['完璧主義傾向', '比較思考'],
        enhancers: ['進歩の可視化', '挑戦機会'],
        sustainability: 0.82
      },
      strategicRecommendations: [
        {
          strategy: '間隔反復学習',
          description: '遗忘曲線に基づく復習スケジューリング',
          suitability: 0.9,
          effectiveness_evidence: '記憶定着率30-50%向上',
          implementation_complexity: 0.3,
          expected_timeline: '2-4週間で効果実感',
          success_indicators: ['復習効率向上', '長期記憶改善']
        },
        {
          strategy: 'メタ認知的方略指導',
          description: '学習の仕方を学ぶメタスキル開発',
          suitability: 0.85,
          effectiveness_evidence: '学習効果20-40%向上',
          implementation_complexity: 0.6,
          expected_timeline: '6-8週間で習得',
          success_indicators: ['自己調整能力向上', '戦略選択の改善']
        }
      ]
    };

    setLearningAnalysis(analysis);
  };

  const initializeChatSession = async () => {
    const session: CoachingSession = {
      sessionId: `session_${Date.now()}`,
      startTime: new Date(),
      sessionType: 'guidance',
      interactions: [],
      insights: [],
      recommendations: [],
      learnerResponse: {
        engagement: 0,
        understanding: 0,
        satisfaction: 0,
        motivation: 0,
        implementation_intent: 0,
        feedback: ''
      },
      effectiveness: 0
    };

    setCurrentSession(session);

    // 初期挨拶メッセージ
    const initialMessage: CoachInteraction = {
      id: 'welcome',
      timestamp: new Date(),
      type: 'encouragement',
      content: `こんにちは！${coachPersonality?.name || 'ココロ先生'}です🤖✨\n\n今日のあなたの学習をサポートします。最近の頑張りを見ていて、本当に素晴らしい成長を感じています！\n\n今日は何から始めましょうか？学習の悩みや目標について、何でも気軽に相談してくださいね😊`,
      intent: 'establish_rapport',
      personalizedFor: ['encouragement_seeking', 'goal_oriented'],
      emotionalTone: 'warm_encouraging',
      adaptationLevel: 0.8
    };

    setChatMessages([initialMessage]);
  };

  const loadGoalGuidance = async () => {
    const guidance: GoalGuidance = {
      currentGoals: [
        {
          id: 'goal1',
          title: '算数の文章題克服',
          description: '文章題の正答率を70%以上にする',
          type: 'academic',
          timeframe: '8週間',
          measurable: true,
          progress: 45,
          milestones: [
            { title: '基本パターン理解', deadline: new Date(Date.now() + 14*24*60*60*1000), completed: true, progress: 100 },
            { title: '応用問題50%正答', deadline: new Date(Date.now() + 28*24*60*60*1000), completed: false, progress: 30 },
            { title: '目標達成70%', deadline: new Date(Date.now() + 56*24*60*60*1000), completed: false, progress: 0 }
          ]
        },
        {
          id: 'goal2',
          title: '毎日学習習慣の定着',
          description: '平日30分、休日60分の学習を継続',
          type: 'habit',
          timeframe: '12週間',
          measurable: true,
          progress: 78,
          milestones: [
            { title: '1週間継続', deadline: new Date(Date.now() - 21*24*60*60*1000), completed: true, progress: 100 },
            { title: '1ヶ月継続', deadline: new Date(Date.now() - 7*24*60*60*1000), completed: true, progress: 100 },
            { title: '3ヶ月継続', deadline: new Date(Date.now() + 35*24*60*60*1000), completed: false, progress: 60 }
          ]
        }
      ],
      goalAssessment: {
        clarity: 0.85,
        achievability: 0.8,
        relevance: 0.9,
        specificity: 0.75,
        measurability: 0.85,
        overall_quality: 0.83
      },
      recommendations: [
        {
          type: 'break_down',
          description: '算数目標をより具体的なステップに分解',
          rationale: '大きな目標は達成感を得にくく、モチベーション維持が困難',
          implementation: '週単位の小目標を設定し、達成度を毎週確認'
        }
      ],
      nextSteps: [
        '今週の具体的目標を決める',
        '進捗確認方法を設定する',
        '困った時のサポート体制を整える'
      ]
    };

    setGoalGuidance(guidance);
  };

  const generateReflectionPrompts = async () => {
    const prompts: ReflectionPrompt[] = [
      {
        id: 'weekly_reflection',
        prompt: '今週の学習を振り返って、一番成長できたと感じることは何ですか？',
        type: 'progress_review',
        guidance: '具体的な例や数字があると、より正確な自己理解につながります',
        expectedInsights: ['学習効果の実感', '成功要因の特定', '自己効力感向上']
      },
      {
        id: 'strategy_evaluation',
        prompt: '最近使っている学習方法で、効果的だと感じるものはありますか？逆に、うまくいかないものは？',
        type: 'strategy_evaluation',
        guidance: 'なぜ効果的（または非効果的）だと感じるのか、理由も考えてみてください',
        expectedInsights: ['戦略の有効性認識', '学習スタイルの理解', '改善点の発見']
      },
      {
        id: 'emotion_check',
        prompt: '勉強していて、どんな気持ちになることが多いですか？楽しい時とそうでない時の違いは何でしょう？',
        type: 'emotion_check',
        guidance: '感情に良い悪いはありません。素直な気持ちを表現してください',
        expectedInsights: ['感情パターンの認識', 'モチベーション要因の特定', '感情調整の手がかり']
      }
    ];

    setReflectionPrompts(prompts);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !currentSession) return;

    // ユーザーメッセージ追加
    const userMessage: CoachInteraction = {
      id: `user_${Date.now()}`,
      timestamp: new Date(),
      type: 'question',
      content: userInput.trim(),
      intent: 'user_input',
      personalizedFor: [],
      emotionalTone: 'neutral',
      adaptationLevel: 0,
      learnerResponse: userInput.trim()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsCoachThinking(true);

    // AI応答生成
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(userInput.trim());
      setChatMessages(prev => [...prev, aiResponse]);
      setIsCoachThinking(false);

      // インサイト生成
      const insights = await generateInsights(userInput.trim(), aiResponse);
      if (insights.length > 0) {
        setShowInsight(insights[0]);
      }
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = async (userInput: string): Promise<CoachInteraction> => {
    // 簡単なキーワードベース応答（実際はより高度なNLP処理）
    let response = '';
    let type: CoachInteraction['type'] = 'explanation';

    if (userInput.includes('難しい') || userInput.includes('分からない')) {
      response = `それは大変でしたね。でも、「難しい」と感じるのは、あなたが新しいことに挑戦している証拠です！\n\nまずは、どの部分が特に分からないか、具体的に教えてもらえますか？一緒に解決策を考えましょう。`;
      type = 'encouragement';
    } else if (userInput.includes('できた') || userInput.includes('分かった')) {
      response = `素晴らしいですね！🎉 その調子です！\n\n成功した時の方法や考え方を覚えておくと、次回も同じように上手くいきますよ。どんな工夫をしたのか、聞かせてください。`;
      type = 'encouragement';
    } else if (userInput.includes('目標') || userInput.includes('計画')) {
      response = `目標について考えているのですね。とても素晴らしい姿勢です！\n\n効果的な目標設定のコツをお教えしましょう：\n1. 具体的で測定可能にする\n2. 期限を決める\n3. 小さなステップに分ける\n\n今考えている目標を詳しく聞かせてください。`;
      type = 'strategy_suggestion';
    } else {
      response = `なるほど、${userInput}について考えているのですね。\n\nもう少し詳しく教えてもらえますか？あなたの状況を理解して、より良いアドバイスをしたいと思います。`;
      type = 'question';
    }

    return {
      id: `ai_${Date.now()}`,
      timestamp: new Date(),
      type,
      content: response,
      intent: 'supportive_guidance',
      personalizedFor: ['encouragement_seeking', 'growth_mindset'],
      emotionalTone: 'warm_supportive',
      adaptationLevel: 0.85
    };
  };

  const generateInsights = async (userInput: string, aiResponse: CoachInteraction): Promise<CoachingInsight[]> => {
    // 簡単なインサイト生成（実際はより詳細な分析）
    if (userInput.includes('難しい')) {
      return [{
        type: 'challenge',
        title: '困難に直面した時の対処',
        description: '学習者が困難を感じた際の反応パターンを分析',
        evidence: ['具体的な困難の表現', '感情的な反応'],
        confidence: 0.8,
        actionable: true,
        implications: ['サポートの必要性', '難易度調整の検討'],
        recommendations: ['段階的な説明', '追加のサポート提供']
      }];
    }
    return [];
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startReflection = (prompt: ReflectionPrompt) => {
    setCurrentReflection(prompt);
    const reflectionMessage: CoachInteraction = {
      id: `reflection_${Date.now()}`,
      timestamp: new Date(),
      type: 'reflection_prompt',
      content: `📝 振り返りの時間です\n\n${prompt.prompt}\n\n${prompt.guidance}`,
      intent: 'promote_metacognition',
      personalizedFor: ['reflective_learning'],
      emotionalTone: 'gentle_encouraging',
      adaptationLevel: 0.9
    };

    setChatMessages(prev => [...prev, reflectionMessage]);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">AIコーチ準備中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <ParticleBackground particleCount={20} color="#3B82F6" speed={0.2} />
      
      {/* インサイト表示 */}
      {showInsight && (
        <AchievementToast
          achievement={{
            title: showInsight.title,
            description: showInsight.description,
            icon: '💡',
            rarity: 'rare'
          }}
          onClose={() => setShowInsight(null)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🤖 AI学習コーチ {coachPersonality?.name}
            </h1>
            <p className="text-lg text-gray-600">
              あなた専用のパーソナル学習アドバイザー
            </p>
          </div>

          {/* タブナビゲーション */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {[
                  { key: 'chat', label: '💬 コーチング', icon: '💬' },
                  { key: 'analysis', label: '📊 学習分析', icon: '📊' },
                  { key: 'goals', label: '🎯 目標ガイド', icon: '🎯' },
                  { key: 'reflection', label: '🤔 振り返り', icon: '🤔' }
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

          {/* チャットタブ */}
          {selectedTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* メインチャット */}
              <div className="lg:col-span-3">
                <KidsCard title="💬 AIコーチとの対話" icon="🤖" color="blue">
                  <div className="space-y-4">
                    {/* メッセージ一覧 */}
                    <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.learnerResponse ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.learnerResponse
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            {!message.learnerResponse && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">{coachPersonality?.avatar}</span>
                                <span className="text-sm font-medium text-gray-600">
                                  {coachPersonality?.name}
                                </span>
                              </div>
                            )}
                            <div className="whitespace-pre-line text-sm">
                              {message.content}
                            </div>
                            <div className="text-xs opacity-75 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isCoachThinking && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{coachPersonality?.avatar}</span>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </div>

                    {/* 入力エリア */}
                    <div className="space-y-3">
                      <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="コーチに質問や相談をしてみましょう..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <KidsButton
                          variant="primary"
                          onClick={sendMessage}
                          disabled={!userInput.trim() || isCoachThinking}
                          className="flex-1"
                        >
                          送信
                        </KidsButton>
                        <KidsButton
                          variant="secondary"
                          onClick={() => setUserInput('今日の学習について相談したいです')}
                        >
                          💡
                        </KidsButton>
                      </div>
                    </div>
                  </div>
                </KidsCard>
              </div>

              {/* サイドパネル */}
              <div className="space-y-6">
                {/* コーチ情報 */}
                <KidsCard title="🤖 あなたのコーチ" icon="👨‍🏫" color="purple">
                  <div className="text-center">
                    <div className="text-6xl mb-3">{coachPersonality?.avatar}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {coachPersonality?.name}
                    </h3>
                    <div className="space-y-2">
                      {coachPersonality?.specializations.slice(0, 3).map((spec, index) => (
                        <div key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                </KidsCard>

                {/* クイック振り返り */}
                <KidsCard title="🤔 振り返りプロンプト" icon="💭" color="yellow">
                  <div className="space-y-3">
                    {reflectionPrompts.slice(0, 2).map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => startReflection(prompt)}
                        className="w-full text-left p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <div className="text-sm font-medium text-yellow-800 mb-1">
                          {prompt.type === 'progress_review' ? '📈 進捗振り返り' :
                           prompt.type === 'strategy_evaluation' ? '📋 戦略評価' :
                           prompt.type === 'emotion_check' ? '😊 感情チェック' : '🤔 振り返り'}
                        </div>
                        <div className="text-xs text-yellow-600">
                          {prompt.prompt.substring(0, 50)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </KidsCard>
              </div>
            </div>
          )}

          {/* 学習分析タブ */}
          {selectedTab === 'analysis' && learningAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* パフォーマンス分析 */}
              <KidsCard title="📊 学習パフォーマンス" icon="📈" color="green">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {learningAnalysis.currentPerformance.overallProgress}%
                    </div>
                    <div className="text-sm text-gray-600">全体進捗</div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(learningAnalysis.currentPerformance.subjectPerformance).map(([subject, analysis]) => (
                      <div key={subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject}</span>
                          <span>{analysis.currentLevel}%</span>
                        </div>
                        <AnimatedProgress 
                          progress={analysis.currentLevel}
                          color="green"
                        />
                        <div className="text-xs text-gray-600 mt-1">
                          強み: {analysis.strengths.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 mb-2">📈 改善傾向</h4>
                    {learningAnalysis.currentPerformance.improvementTrends.map((trend, index) => (
                      <div key={index} className="text-sm text-green-700">
                        • {trend.area}: {trend.timeframe}で{Math.round(trend.rate * 100)}%向上
                      </div>
                    ))}
                  </div>
                </div>
              </KidsCard>

              {/* 強みと課題 */}
              <KidsCard title="💪 強み・課題分析" icon="🔍" color="blue">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-3">🌟 あなたの強み</h4>
                    {learningAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-3 mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-blue-800">{strength.area}</span>
                          <span className="text-sm text-blue-600">{Math.round(strength.level * 100)}%</span>
                        </div>
                        <div className="text-xs text-blue-700">
                          活用機会: {strength.leverage_opportunities.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-800 mb-3">🎯 成長エリア</h4>
                    {learningAnalysis.challengeAreas.map((challenge, index) => (
                      <div key={index} className="bg-orange-50 rounded-lg p-3 mb-2">
                        <div className="font-medium text-orange-800 mb-1">{challenge.area}</div>
                        <div className="text-xs text-orange-700 mb-2">
                          改善予定: {challenge.timeline_for_improvement}
                        </div>
                        <div className="text-xs text-orange-600">
                          戦略: {challenge.intervention_strategies.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </KidsCard>

              {/* 学習パターン */}
              <KidsCard title="🔄 学習パターン分析" icon="📋" color="purple">
                <div className="space-y-3">
                  {learningAnalysis.learningPatterns.map((pattern, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{pattern.pattern}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          pattern.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          pattern.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pattern.impact === 'positive' ? '➕ 良い影響' :
                           pattern.impact === 'negative' ? '➖ 改善必要' : '➡️ 中立'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{pattern.description}</div>
                      <div className="text-xs text-gray-600">
                        頻度: {Math.round(pattern.frequency * 100)}% | 
                        推奨: {pattern.recommendations[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </KidsCard>

              {/* 戦略推奨 */}
              <KidsCard title="🚀 推奨学習戦略" icon="💡" color="yellow">
                <div className="space-y-3">
                  {learningAnalysis.strategicRecommendations.map((strategy, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="font-medium text-yellow-800 mb-2">{strategy.strategy}</div>
                      <div className="text-sm text-yellow-700 mb-2">{strategy.description}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-yellow-600">適合度: </span>
                          <span className="font-medium">{Math.round(strategy.suitability * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-yellow-600">効果見込み: </span>
                          <span className="font-medium">{strategy.expected_timeline}</span>
                        </div>
                      </div>
                      <div className="text-xs text-yellow-600 mt-2">
                        💡 {strategy.effectiveness_evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </KidsCard>
            </div>
          )}

          {/* 目標ガイドタブ */}
          {selectedTab === 'goals' && goalGuidance && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 現在の目標 */}
              <KidsCard title="🎯 現在の目標" icon="📋" color="blue">
                <div className="space-y-4">
                  {goalGuidance.currentGoals.map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {goal.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>進捗</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <AnimatedProgress progress={goal.progress} color="blue" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">マイルストーン</h4>
                        {goal.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <span className={`text-sm ${
                              milestone.completed ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {milestone.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {milestone.deadline.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </KidsCard>

              {/* 目標品質評価 */}
              <KidsCard title="📊 目標品質診断" icon="🔍" color="green">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round(goalGuidance.goalAssessment.overall_quality * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">総合品質スコア</div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(goalGuidance.goalAssessment).filter(([key]) => key !== 'overall_quality').map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            {key === 'clarity' ? '明確性' :
                             key === 'achievability' ? '達成可能性' :
                             key === 'relevance' ? '関連性' :
                             key === 'specificity' ? '具体性' :
                             key === 'measurability' ? '測定可能性' : key}
                          </span>
                          <span>{Math.round(value * 100)}%</span>
                        </div>
                        <AnimatedProgress progress={value * 100} color="green" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 mb-2">💡 改善提案</h4>
                    {goalGuidance.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-green-700 mb-2">
                        • {rec.description}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 mb-2">🚀 次のステップ</h4>
                    {goalGuidance.nextSteps.map((step, index) => (
                      <div key={index} className="text-sm text-blue-700">
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              </KidsCard>
            </div>
          )}

          {/* 振り返りタブ */}
          {selectedTab === 'reflection' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KidsCard title="🤔 振り返りプロンプト" icon="💭" color="purple">
                <div className="space-y-4">
                  {reflectionPrompts.map((prompt) => (
                    <HoverScaleCard
                      key={prompt.id}
                      onClick={() => startReflection(prompt)}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer bg-white hover:bg-purple-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-800">
                          {prompt.type === 'progress_review' ? '📈 進捗振り返り' :
                           prompt.type === 'strategy_evaluation' ? '📋 戦略評価' :
                           prompt.type === 'emotion_check' ? '😊 感情チェック' :
                           prompt.type === 'self_assessment' ? '🔍 自己評価' : '🤔 振り返り'}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          クリックして開始
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{prompt.prompt}</p>
                      <p className="text-xs text-gray-600">{prompt.guidance}</p>
                    </HoverScaleCard>
                  ))}
                </div>
              </KidsCard>

              <KidsCard title="📊 振り返り効果" icon="📈" color="yellow">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🤔</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    振り返りを始めましょう
                  </h3>
                  <p className="text-gray-600 mb-4">
                    左側のプロンプトを選んで、学習の振り返りを始めてください
                  </p>
                  <div className="text-sm text-gray-500">
                    定期的な振り返りは学習効果を20-30%向上させます
                  </div>
                </div>
              </KidsCard>
            </div>
          )}
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="🤖"
        onClick={() => {
          const encouragementMessages = [
            '今日も頑張ってますね！',
            '調子はどうですか？',
            '何か困ったことはありませんか？'
          ];
          const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
          setUserInput(randomMessage);
        }}
        tooltip="クイック質問"
        color="blue"
        position="bottom-right"
      />
    </div>
  );
};

export default AILearningCoach;