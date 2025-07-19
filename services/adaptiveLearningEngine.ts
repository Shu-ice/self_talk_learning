/**
 * 🧠 AI適応学習エンジン
 * 認知心理学・学習科学に基づくインテリジェント学習最適化システム
 */

interface LearningSession {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  startTime: Date;
  endTime?: Date;
  problems: ProblemAttempt[];
  cognitiveState: CognitiveState;
  engagement: EngagementMetrics;
}

interface ProblemAttempt {
  problemId: string;
  difficulty: number;
  timeToAnswer: number;
  isCorrect: boolean;
  attempts: number;
  hintUsed: boolean;
  confidenceLevel: number; // 1-10
  cognitiveLoad: number;   // 1-10
}

interface CognitiveState {
  workingMemoryLoad: number;    // 1-10
  attentionLevel: number;       // 1-10
  fatigueLevel: number;         // 1-10
  frustrationType: 'none' | 'mild' | 'moderate' | 'severe';
  flowState: boolean;
  metacognitionActive: boolean;
}

interface EngagementMetrics {
  sessionDuration: number;
  clickFrequency: number;
  scrollBehavior: 'focused' | 'distracted' | 'browsing';
  pauseFrequency: number;
  backgroundSwitches: number;
  responseLatency: number;
}

interface LearningProfile {
  userId: string;
  cognitiveProfile: CognitiveProfile;
  learningStyle: LearningStyle;
  motivationProfile: MotivationProfile;
  performanceHistory: PerformanceHistory;
  adaptiveParameters: AdaptiveParameters;
}

interface CognitiveProfile {
  workingMemoryCapacity: number;     // 5-9 (individual differences)
  processingSpeed: number;           // relative to age norm
  attentionSpan: number;            // minutes
  metacognitiveMmaturity: number;    // 1-10
  executiveFunction: number;         // 1-10
}

interface LearningStyle {
  modality: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  informationProcessing: 'sequential' | 'holistic' | 'adaptive';
  feedbackPreference: 'immediate' | 'delayed' | 'summary';
  difficultyProgression: 'gradual' | 'stepped' | 'adaptive';
  socialLearning: boolean;
}

interface MotivationProfile {
  intrinsicMotivation: number;       // 1-10
  achievementOrientation: number;    // 1-10
  competitiveOrientation: number;    // 1-10
  socialApproval: number;           // 1-10
  masteryGoals: number;             // 1-10
  performanceGoals: number;         // 1-10
  optimalChallengeLevel: number;    // 1-10
}

interface PerformanceHistory {
  subjectMastery: Record<string, SubjectMastery>;
  learningVelocity: number;         // topics per hour
  retentionRate: number;            // percentage
  transferAbility: number;          // cross-topic application
  errorPatterns: ErrorPattern[];
  recoveryPatterns: RecoveryPattern[];
}

interface SubjectMastery {
  subject: string;
  overallLevel: number;             // 1-10
  topicMastery: Record<string, number>;
  conceptualUnderstanding: number;
  proceduralFluency: number;
  problemSolving: number;
  lastAssessed: Date;
}

class AdaptiveLearningEngine {
  private learningProfiles: Map<string, LearningProfile> = new Map();
  private activeSession: Map<string, LearningSession> = new Map();

  /**
   * 🎯 学習セッション開始
   */
  async startLearningSession(
    userId: string, 
    subject: string, 
    topic: string
  ): Promise<LearningSession> {
    const profile = await this.getLearningProfile(userId);
    const cognitiveState = await this.assessCognitiveState(userId);
    
    const session: LearningSession = {
      id: this.generateSessionId(),
      userId,
      subject,
      topic,
      startTime: new Date(),
      problems: [],
      cognitiveState,
      engagement: {
        sessionDuration: 0,
        clickFrequency: 0,
        scrollBehavior: 'focused',
        pauseFrequency: 0,
        backgroundSwitches: 0,
        responseLatency: 0
      }
    };

    this.activeSession.set(userId, session);
    return session;
  }

  /**
   * 🧮 次の問題を適応的に選択
   */
  async selectNextProblem(userId: string): Promise<Problem> {
    const session = this.activeSession.get(userId);
    if (!session) throw new Error('No active session');

    const profile = await this.getLearningProfile(userId);
    const currentState = await this.updateCognitiveState(userId);
    
    // フロー理論に基づく最適難易度計算
    const optimalDifficulty = this.calculateOptimalDifficulty(
      profile, 
      currentState, 
      session.problems
    );

    // 認知負荷理論に基づく問題選択
    const problem = await this.selectProblemWithOptimalLoad(
      session.subject,
      session.topic,
      optimalDifficulty,
      profile.cognitiveProfile.workingMemoryCapacity
    );

    return problem;
  }

  /**
   * 📊 学習パフォーマンス分析
   */
  async analyzePerformance(
    userId: string, 
    problemAttempt: ProblemAttempt
  ): Promise<LearningInsights> {
    const session = this.activeSession.get(userId)!;
    const profile = await this.getLearningProfile(userId);

    // リアルタイム学習分析
    const insights = await this.generateLearningInsights(
      problemAttempt,
      session,
      profile
    );

    // 学習プロファイル更新
    await this.updateLearningProfile(userId, problemAttempt, insights);

    // 次回学習推奨の更新
    await this.updateLearningRecommendations(userId, insights);

    return insights;
  }

  /**
   * 🎯 最適難易度計算（フロー理論適用）
   */
  private calculateOptimalDifficulty(
    profile: LearningProfile,
    cognitiveState: CognitiveState,
    recentAttempts: ProblemAttempt[]
  ): number {
    // 基本スキルレベル
    const baseSkill = this.estimateCurrentSkillLevel(recentAttempts);
    
    // 認知状態による調整
    const cognitiveAdjustment = this.calculateCognitiveAdjustment(cognitiveState);
    
    // 動機状態による調整
    const motivationAdjustment = this.calculateMotivationAdjustment(
      profile.motivationProfile,
      recentAttempts
    );

    // フロー状態の維持（challenge ≈ skill + 0.2）
    const flowAdjustment = cognitiveState.flowState ? 0.2 : 0.5;

    return Math.min(10, Math.max(1, 
      baseSkill + cognitiveAdjustment + motivationAdjustment + flowAdjustment
    ));
  }

  /**
   * 🧠 認知状態評価
   */
  private async assessCognitiveState(userId: string): Promise<CognitiveState> {
    const session = this.activeSession.get(userId);
    if (!session) {
      return {
        workingMemoryLoad: 3,
        attentionLevel: 8,
        fatigueLevel: 2,
        frustrationType: 'none',
        flowState: true,
        metacognitionActive: true
      };
    }

    const recentAttempts = session.problems.slice(-5);
    
    // 作業記憶負荷の推定
    const workingMemoryLoad = this.estimateWorkingMemoryLoad(recentAttempts);
    
    // 注意レベルの推定
    const attentionLevel = this.estimateAttentionLevel(
      session.engagement,
      recentAttempts
    );
    
    // 疲労レベルの推定
    const fatigueLevel = this.estimateFatigueLevel(
      session.startTime,
      session.engagement
    );
    
    // 挫折感の推定
    const frustrationType = this.estimateFrustration(recentAttempts);
    
    // フロー状態の判定
    const flowState = this.isInFlowState(
      workingMemoryLoad,
      attentionLevel,
      fatigueLevel,
      recentAttempts
    );

    return {
      workingMemoryLoad,
      attentionLevel,
      fatigueLevel,
      frustrationType,
      flowState,
      metacognitionActive: attentionLevel > 6
    };
  }

  /**
   * 🎮 スペーシング効果による復習最適化
   */
  async optimizeReviewSchedule(userId: string): Promise<ReviewSchedule> {
    const profile = await this.getLearningProfile(userId);
    const performanceHistory = profile.performanceHistory;

    const reviews: ReviewItem[] = [];

    // エビングハウス忘却曲線に基づく復習タイミング
    for (const [subject, mastery] of Object.entries(performanceHistory.subjectMastery)) {
      for (const [topic, level] of Object.entries(mastery.topicMastery)) {
        const daysSinceStudy = this.calculateDaysSince(mastery.lastAssessed);
        const forgettingRate = this.calculateForgettingRate(level, daysSinceStudy);
        
        if (forgettingRate > 0.3) { // 30%以上忘れている可能性
          const urgency = this.calculateReviewUrgency(forgettingRate, level);
          reviews.push({
            subject,
            topic,
            urgency,
            estimatedTime: this.estimateReviewTime(level),
            reviewType: this.determineReviewType(forgettingRate)
          });
        }
      }
    }

    // 優先度順にソート
    reviews.sort((a, b) => b.urgency - a.urgency);

    return {
      userId,
      scheduledDate: new Date(),
      reviews: reviews.slice(0, 5), // 上位5件
      totalEstimatedTime: reviews.reduce((sum, r) => sum + r.estimatedTime, 0)
    };
  }

  /**
   * 📈 学習効果予測
   */
  async predictLearningOutcome(
    userId: string,
    plannedStudyTime: number,
    topics: string[]
  ): Promise<LearningPrediction> {
    const profile = await this.getLearningProfile(userId);
    
    const predictions: TopicPrediction[] = [];
    
    for (const topic of topics) {
      const currentMastery = this.getCurrentMastery(profile, topic);
      const learningVelocity = profile.performanceHistory.learningVelocity;
      const optimalStudyTime = this.calculateOptimalStudyTime(
        currentMastery,
        profile.cognitiveProfile
      );
      
      const predicted = {
        topic,
        currentMastery,
        predictedMastery: this.predictMastery(
          currentMastery,
          plannedStudyTime,
          learningVelocity
        ),
        confidence: this.calculatePredictionConfidence(profile),
        recommendedTime: optimalStudyTime
      };
      
      predictions.push(predicted);
    }

    return {
      userId,
      totalStudyTime: plannedStudyTime,
      predictions,
      overallImprovement: this.calculateOverallImprovement(predictions),
      riskFactors: this.identifyRiskFactors(profile, plannedStudyTime)
    };
  }

  /**
   * 🎯 パーソナライズド学習推奨
   */
  async generatePersonalizedRecommendations(
    userId: string
  ): Promise<LearningRecommendations> {
    const profile = await this.getLearningProfile(userId);
    const cognitiveState = await this.assessCognitiveState(userId);
    
    return {
      optimalStudyTime: this.calculateOptimalDailyStudyTime(profile),
      bestStudyHours: this.predictBestStudyHours(profile),
      priorityTopics: await this.identifyPriorityTopics(profile),
      studyStrategy: this.recommendStudyStrategy(profile, cognitiveState),
      motivationalApproach: this.recommendMotivationalApproach(profile),
      recoveryStrategies: this.recommendRecoveryStrategies(profile)
    };
  }

  // Helper Methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getLearningProfile(userId: string): Promise<LearningProfile> {
    if (!this.learningProfiles.has(userId)) {
      // 新規ユーザーの場合、初期プロファイル作成
      const initialProfile = await this.createInitialProfile(userId);
      this.learningProfiles.set(userId, initialProfile);
    }
    return this.learningProfiles.get(userId)!;
  }

  private async createInitialProfile(userId: string): Promise<LearningProfile> {
    // 初期プロファイル（後に学習データで更新）
    return {
      userId,
      cognitiveProfile: {
        workingMemoryCapacity: 7, // 平均値
        processingSpeed: 1.0,
        attentionSpan: 25, // ポモドーロ基準
        metacognitiveMmaturity: 5,
        executiveFunction: 5
      },
      learningStyle: {
        modality: 'mixed',
        informationProcessing: 'adaptive',
        feedbackPreference: 'immediate',
        difficultyProgression: 'gradual',
        socialLearning: true
      },
      motivationProfile: {
        intrinsicMotivation: 6,
        achievementOrientation: 7,
        competitiveOrientation: 5,
        socialApproval: 6,
        masteryGoals: 6,
        performanceGoals: 5,
        optimalChallengeLevel: 6
      },
      performanceHistory: {
        subjectMastery: {},
        learningVelocity: 1.0,
        retentionRate: 0.7,
        transferAbility: 0.5,
        errorPatterns: [],
        recoveryPatterns: []
      },
      adaptiveParameters: {
        difficultyIncrement: 0.3,
        motivationSensitivity: 0.5,
        fatigueThreshold: 0.7,
        flowStateTarget: true
      }
    };
  }

  private estimateCurrentSkillLevel(attempts: ProblemAttempt[]): number {
    if (attempts.length === 0) return 5; // 中間値

    const recentAttempts = attempts.slice(-10);
    const accuracy = recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length;
    const avgDifficulty = recentAttempts.reduce((sum, a) => sum + a.difficulty, 0) / recentAttempts.length;
    
    // 正答率と取り組んだ難易度から推定
    return avgDifficulty * (0.5 + accuracy * 0.5);
  }

  private calculateCognitiveAdjustment(state: CognitiveState): number {
    let adjustment = 0;
    
    // 疲労による調整
    if (state.fatigueLevel > 7) adjustment -= 1.5;
    else if (state.fatigueLevel > 5) adjustment -= 0.5;
    
    // 注意レベルによる調整
    if (state.attentionLevel < 4) adjustment -= 1.0;
    else if (state.attentionLevel > 8) adjustment += 0.3;
    
    // 挫折感による調整
    if (state.frustrationType === 'severe') adjustment -= 2.0;
    else if (state.frustrationType === 'moderate') adjustment -= 1.0;
    else if (state.frustrationType === 'mild') adjustment -= 0.3;
    
    return adjustment;
  }

  private calculateMotivationAdjustment(
    motivation: MotivationProfile,
    attempts: ProblemAttempt[]
  ): number {
    let adjustment = 0;
    
    // 連続正解でモチベーション上昇
    const recentCorrect = attempts.slice(-3).filter(a => a.isCorrect).length;
    if (recentCorrect === 3 && motivation.achievementOrientation > 7) {
      adjustment += 0.5; // チャレンジ意欲向上
    }
    
    // 連続不正解でモチベーション低下
    const recentIncorrect = attempts.slice(-3).filter(a => !a.isCorrect).length;
    if (recentIncorrect >= 2) {
      adjustment -= 0.5; // 難易度を下げて成功体験を
    }
    
    return adjustment;
  }

  private estimateWorkingMemoryLoad(attempts: ProblemAttempt[]): number {
    if (attempts.length === 0) return 3;
    
    const recent = attempts.slice(-3);
    const avgCognitiveLoad = recent.reduce((sum, a) => sum + a.cognitiveLoad, 0) / recent.length;
    return avgCognitiveLoad;
  }

  private estimateAttentionLevel(
    engagement: EngagementMetrics,
    attempts: ProblemAttempt[]
  ): number {
    let attentionLevel = 8; // 初期値
    
    // 反応速度による判定
    if (engagement.responseLatency > 10000) attentionLevel -= 2; // 10秒以上
    else if (engagement.responseLatency > 5000) attentionLevel -= 1;
    
    // 一時停止頻度による判定
    if (engagement.pauseFrequency > 3) attentionLevel -= 1;
    
    // バックグラウンド切り替えによる判定
    if (engagement.backgroundSwitches > 0) attentionLevel -= 2;
    
    return Math.max(1, Math.min(10, attentionLevel));
  }

  private estimateFatigueLevel(startTime: Date, engagement: EngagementMetrics): number {
    const sessionMinutes = (Date.now() - startTime.getTime()) / (1000 * 60);
    
    let fatigueLevel = 1;
    
    // セッション時間による疲労
    if (sessionMinutes > 45) fatigueLevel += 3;
    else if (sessionMinutes > 30) fatigueLevel += 2;
    else if (sessionMinutes > 20) fatigueLevel += 1;
    
    // エンゲージメント低下による疲労推定
    if (engagement.clickFrequency < 0.5) fatigueLevel += 1;
    if (engagement.responseLatency > 8000) fatigueLevel += 1;
    
    return Math.min(10, fatigueLevel);
  }

  private estimateFrustration(attempts: ProblemAttempt[]): CognitiveState['frustrationType'] {
    const recent = attempts.slice(-5);
    const incorrectCount = recent.filter(a => !a.isCorrect).length;
    const multipleAttempts = recent.filter(a => a.attempts > 1).length;
    
    if (incorrectCount >= 4 || multipleAttempts >= 3) return 'severe';
    if (incorrectCount >= 3 || multipleAttempts >= 2) return 'moderate';
    if (incorrectCount >= 2) return 'mild';
    return 'none';
  }

  private isInFlowState(
    workingMemoryLoad: number,
    attentionLevel: number,
    fatigueLevel: number,
    attempts: ProblemAttempt[]
  ): boolean {
    // フロー状態の条件
    const cognitiveCondition = workingMemoryLoad >= 4 && workingMemoryLoad <= 8;
    const attentionCondition = attentionLevel >= 7;
    const fatigueCondition = fatigueLevel <= 5;
    const performanceCondition = attempts.slice(-3).filter(a => a.isCorrect).length >= 2;
    
    return cognitiveCondition && attentionCondition && fatigueCondition && performanceCondition;
  }

  private calculateDaysSince(date: Date): number {
    return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  }

  private calculateForgettingRate(masteryLevel: number, daysSince: number): number {
    // エビングハウス忘却曲線の近似
    // R = e^(-t/S) where S is strength (mastery level)
    const strength = Math.max(1, masteryLevel);
    return 1 - Math.exp(-daysSince / strength);
  }

  private calculateReviewUrgency(forgettingRate: number, masteryLevel: number): number {
    // 忘却率が高く、習熟度が重要なトピックほど緊急度が高い
    return forgettingRate * masteryLevel * 10;
  }

  private estimateReviewTime(masteryLevel: number): number {
    // 習熟度が低いほど復習時間が長い
    return Math.max(5, 30 - masteryLevel * 2);
  }

  private determineReviewType(forgettingRate: number): 'quick' | 'standard' | 'intensive' {
    if (forgettingRate > 0.7) return 'intensive';
    if (forgettingRate > 0.4) return 'standard';
    return 'quick';
  }
}

// 型定義
interface Problem {
  id: string;
  subject: string;
  topic: string;
  difficulty: number;
  estimatedCognitiveLoad: number;
  content: string;
  options?: string[];
  solution: string;
  explanation: string;
  hints: string[];
}

interface LearningInsights {
  userId: string;
  sessionId: string;
  timestamp: Date;
  cognitiveInsights: {
    workingMemoryUtilization: number;
    attentionSustainability: number;
    processingEfficiency: number;
  };
  performanceInsights: {
    accuracyTrend: number;
    speedTrend: number;
    difficultyComfort: number;
  };
  motivationalInsights: {
    engagementLevel: number;
    frustrationType: string;
    flowStateAchievement: boolean;
  };
  recommendations: {
    nextDifficulty: number;
    breakRecommendation: boolean;
    strategySuggestion: string;
  };
}

interface ReviewSchedule {
  userId: string;
  scheduledDate: Date;
  reviews: ReviewItem[];
  totalEstimatedTime: number;
}

interface ReviewItem {
  subject: string;
  topic: string;
  urgency: number;
  estimatedTime: number;
  reviewType: 'quick' | 'standard' | 'intensive';
}

interface LearningPrediction {
  userId: string;
  totalStudyTime: number;
  predictions: TopicPrediction[];
  overallImprovement: number;
  riskFactors: string[];
}

interface TopicPrediction {
  topic: string;
  currentMastery: number;
  predictedMastery: number;
  confidence: number;
  recommendedTime: number;
}

interface LearningRecommendations {
  optimalStudyTime: number;
  bestStudyHours: number[];
  priorityTopics: string[];
  studyStrategy: string;
  motivationalApproach: string;
  recoveryStrategies: string[];
}

interface AdaptiveParameters {
  difficultyIncrement: number;
  motivationSensitivity: number;
  fatigueThreshold: number;
  flowStateTarget: boolean;
}

interface ErrorPattern {
  type: string;
  frequency: number;
  subjects: string[];
  remediation: string;
}

interface RecoveryPattern {
  context: string;
  strategy: string;
  effectiveness: number;
}

export default AdaptiveLearningEngine;