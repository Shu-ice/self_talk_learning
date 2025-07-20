// 🧠 次世代アダプティブラーニングエンジン
// Next-Generation Adaptive Learning Algorithm with Deep Personalization

import { LearnerProfile } from '../types';
import { UltraLearningMetrics, ultraLearningAnalyzer } from './ultraLearningAnalyzer';
import { educationSystem } from './enhancedEducationSystem';

// 学習者のコンピテンシーモデル
interface CompetencyModel {
  subject: string;
  competencies: Record<string, {
    level: number; // 0-100
    confidence: number; // 0-1
    lastAssessed: Date;
    masteryTrajectory: number[]; // 習得の軌跡
    transferPotential: number; // 0-1
  }>;
  learningStyle: {
    visualPreference: number; // 0-1
    auditoryPreference: number;
    kinestheticPreference: number;
    readingPreference: number;
    processingSpeed: number; // concepts/minute
    workingMemoryCapacity: number; // 7±2
  };
  cognitiveProfile: {
    analyticalThinking: number; // 0-100
    creativeProblemSolving: number;
    spatialReasoning: number;
    verbalReasoning: number;
    memoryStrength: number;
    attentionSpan: number; // minutes
  };
}

// 動的難易度調整システム
interface DifficultyAdjustment {
  currentDifficulty: number; // 1-10
  targetDifficulty: number;
  adjustmentRate: number; // per problem
  justification: string;
  expectedOutcome: string;
  riskFactors: string[];
}

// 個別化学習経路
interface PersonalizedLearningPath {
  pathId: string;
  learnerProfile: LearnerProfile;
  currentPosition: {
    subject: string;
    topic: string;
    subtopic: string;
    masteryLevel: number;
  };
  nextSteps: Array<{
    activity: string;
    estimatedDuration: number;
    difficultyLevel: number;
    learningObjectives: string[];
    successCriteria: string[];
    adaptations: string[];
  }>;
  alternativePaths: Array<{
    condition: string;
    path: PersonalizedLearningPath;
  }>;
  milestones: Array<{
    name: string;
    targetDate: Date;
    competencyRequirements: Record<string, number>;
    assessmentMethod: string;
  }>;
}

// 学習最適化戦略
interface OptimizationStrategy {
  name: string;
  applicableConditions: string[];
  implementation: {
    timing: string;
    duration: number;
    parameters: Record<string, any>;
  };
  expectedBenefits: string[];
  riskMitigation: string[];
  successMetrics: string[];
}

export class NextGenAdaptiveLearning {
  private competencyModels: Map<string, CompetencyModel> = new Map();
  private learningPaths: Map<string, PersonalizedLearningPath> = new Map();
  private optimizationStrategies: OptimizationStrategy[] = [];

  constructor() {
    this.initializeOptimizationStrategies();
  }

  // 🎯 コンピテンシーベース適応
  public adaptBasedOnCompetency(
    learnerProfile: LearnerProfile,
    recentPerformance: Array<{
      topic: string;
      accuracy: number;
      responseTime: number;
      difficulty: number;
      timestamp: Date;
    }>,
    targetCompetencies: Record<string, number>
  ): DifficultyAdjustment {
    
    const competencyModel = this.getOrCreateCompetencyModel(learnerProfile);
    
    // パフォーマンス分析
    const performanceAnalysis = this.analyzeRecentPerformance(recentPerformance);
    
    // 現在の能力レベル推定
    const currentAbility = this.estimateCurrentAbility(
      performanceAnalysis, 
      competencyModel
    );
    
    // ゾーン・オブ・プロキシマル・ディベロップメント計算
    const zpd = this.calculateZPD(currentAbility, competencyModel);
    
    // 最適難易度決定
    const targetDifficulty = this.optimizeDifficulty(
      zpd, 
      targetCompetencies, 
      performanceAnalysis
    );
    
    // 調整率計算
    const adjustmentRate = this.calculateAdjustmentRate(
      performanceAnalysis,
      competencyModel.cognitiveProfile.processingSpeed
    );

    return {
      currentDifficulty: currentAbility.estimatedLevel,
      targetDifficulty,
      adjustmentRate,
      justification: this.generateJustification(currentAbility, targetDifficulty),
      expectedOutcome: this.predictOutcome(targetDifficulty, competencyModel),
      riskFactors: this.identifyRiskFactors(targetDifficulty, competencyModel)
    };
  }

  // 🧠 認知負荷理論に基づく最適化
  public optimizeForCognitiveLoad(
    currentMetrics: UltraLearningMetrics,
    contentComplexity: number, // 1-10
    learnerProfile: LearnerProfile
  ): {
    adjustedComplexity: number;
    scaffoldingLevel: number;
    recommendedBreaks: number[];
    cognitiveStrategies: string[];
  } {
    
    const cognitiveCapacity = this.estimateCognitiveCapacity(learnerProfile);
    const currentLoad = currentMetrics.cognitiveLoad.currentLevel;
    
    // 内在的認知負荷（コンテンツの本質的複雑さ）
    const intrinsicLoad = contentComplexity * 10;
    
    // 外在的認知負荷（設計による負荷）
    const extraneousLoad = this.calculateExtraneousLoad(currentMetrics);
    
    // 適正負荷（学習に有効な負荷）
    const germaneLoad = Math.max(0, cognitiveCapacity - intrinsicLoad - extraneousLoad);
    
    // 最適化戦略
    let adjustedComplexity = contentComplexity;
    let scaffoldingLevel = 0;
    const cognitiveStrategies: string[] = [];
    
    if (currentLoad > 80) {
      // 認知過負荷状態
      adjustedComplexity = Math.max(1, contentComplexity - 2);
      scaffoldingLevel = 3; // 高レベルサポート
      cognitiveStrategies.push('情報チャンキング', '視覚的支援', '段階的開示');
    } else if (currentLoad < 40) {
      // 認知負荷不足
      adjustedComplexity = Math.min(10, contentComplexity + 1);
      scaffoldingLevel = 1; // 最小限サポート
      cognitiveStrategies.push('複合問題提示', '自己説明促進');
    } else {
      // 最適範囲
      scaffoldingLevel = 2; // 適度なサポート
      cognitiveStrategies.push('メタ認知促進', '関連付け支援');
    }
    
    // 推奨休憩時間（分）
    const recommendedBreaks = this.calculateOptimalBreaks(
      currentLoad,
      learnerProfile.learningPreferences.sessionLength
    );

    return {
      adjustedComplexity,
      scaffoldingLevel,
      recommendedBreaks,
      cognitiveStrategies
    };
  }

  // 🎮 ゲーミフィケーション適応
  public adaptGamification(
    motivationalState: UltraLearningMetrics['motivationalState'],
    learnerProfile: LearnerProfile,
    currentProgress: number
  ): {
    challengeLevel: number;
    rewardSystem: string;
    competitiveElements: string[];
    narrativeTheme: string;
    feedbackStyle: string;
  } {
    
    const motivationType = this.identifyPrimaryMotivationType(motivationalState);
    
    // 動機タイプ別適応
    switch (motivationType) {
      case 'achievement':
        return {
          challengeLevel: Math.min(10, currentProgress + 2),
          rewardSystem: 'badge_progression',
          competitiveElements: ['leaderboard', 'personal_best'],
          narrativeTheme: 'hero_journey',
          feedbackStyle: 'achievement_focused'
        };
        
      case 'progress':
        return {
          challengeLevel: currentProgress + 1,
          rewardSystem: 'progress_bars',
          competitiveElements: ['self_improvement'],
          narrativeTheme: 'skill_building',
          feedbackStyle: 'growth_oriented'
        };
        
      case 'competition':
        return {
          challengeLevel: Math.min(10, currentProgress + 3),
          rewardSystem: 'ranking_system',
          competitiveElements: ['peer_comparison', 'team_challenges'],
          narrativeTheme: 'tournament',
          feedbackStyle: 'competitive'
        };
        
      default:
        return {
          challengeLevel: currentProgress,
          rewardSystem: 'exploration_rewards',
          competitiveElements: ['discovery'],
          narrativeTheme: 'adventure',
          feedbackStyle: 'exploratory'
        };
    }
  }

  // 📊 マルチモーダル学習最適化
  public optimizeMultimodalLearning(
    learnerProfile: LearnerProfile,
    contentType: string,
    performance: UltraLearningMetrics
  ): {
    primaryModality: string;
    secondaryModality: string;
    modalityRatio: number; // primary:secondary
    adaptiveElements: string[];
    deliverySequence: string[];
  } {
    
    const competencyModel = this.competencyModels.get(learnerProfile.id);
    if (!competencyModel) {
      return this.getDefaultModalityOptimization();
    }
    
    const modalityScores = {
      visual: competencyModel.learningStyle.visualPreference * 100,
      auditory: competencyModel.learningStyle.auditoryPreference * 100,
      kinesthetic: competencyModel.learningStyle.kinestheticPreference * 100,
      reading: competencyModel.learningStyle.readingPreference * 100
    };
    
    // 最適モダリティの決定
    const sortedModalities = Object.entries(modalityScores)
      .sort(([,a], [,b]) => b - a);
    
    const primaryModality = sortedModalities[0][0];
    const secondaryModality = sortedModalities[1][0];
    const modalityRatio = sortedModalities[0][1] / sortedModalities[1][1];
    
    // コンテンツタイプ別適応
    const contentAdaptations = this.getContentAdaptations(contentType, primaryModality);
    
    // 配信シーケンス最適化
    const deliverySequence = this.optimizeDeliverySequence(
      primaryModality,
      secondaryModality,
      performance
    );

    return {
      primaryModality,
      secondaryModality,
      modalityRatio,
      adaptiveElements: contentAdaptations,
      deliverySequence
    };
  }

  // 🔄 リアルタイム適応制御
  public realTimeAdaptation(
    currentSession: {
      duration: number; // minutes
      problemsSolved: number;
      averageAccuracy: number;
      averageResponseTime: number;
      frustrationIndicators: number;
      engagementLevel: number; // 0-100
    },
    learnerProfile: LearnerProfile
  ): {
    immediateActions: string[];
    parameterAdjustments: Record<string, number>;
    contentModifications: string[];
    supportLevel: number; // 0-5
  } {
    
    const adaptations = {
      immediateActions: [] as string[],
      parameterAdjustments: {} as Record<string, number>,
      contentModifications: [] as string[],
      supportLevel: 2
    };

    // 学習疲労検出
    if (currentSession.duration > 45 && currentSession.averageAccuracy < 0.6) {
      adaptations.immediateActions.push('suggest_break');
      adaptations.contentModifications.push('reduce_complexity');
    }

    // フラストレーション対応
    if (currentSession.frustrationIndicators > 3) {
      adaptations.immediateActions.push('provide_encouragement');
      adaptations.supportLevel = 4;
      adaptations.contentModifications.push('add_scaffolding');
      adaptations.parameterAdjustments.difficulty = -1;
    }

    // エンゲージメント低下対応
    if (currentSession.engagementLevel < 40) {
      adaptations.immediateActions.push('gamify_next_problem');
      adaptations.contentModifications.push('add_interactive_elements');
      adaptations.parameterAdjustments.novelty = 1;
    }

    // 高パフォーマンス対応
    if (currentSession.averageAccuracy > 0.9 && currentSession.averageResponseTime < 30) {
      adaptations.immediateActions.push('increase_challenge');
      adaptations.parameterAdjustments.difficulty = 1;
      adaptations.contentModifications.push('add_extension_problems');
    }

    return adaptations;
  }

  // 🎯 個別化学習パス生成
  public generatePersonalizedPath(
    learnerProfile: LearnerProfile,
    targetObjectives: string[],
    timeConstraints: { dailyMinutes: number; targetDate: Date },
    currentCompetencies: Record<string, number>
  ): PersonalizedLearningPath {
    
    const pathId = `path_${learnerProfile.id}_${Date.now()}`;
    
    // 能力ギャップ分析
    const competencyGaps = this.analyzeCompetencyGaps(
      currentCompetencies,
      targetObjectives
    );
    
    // 学習シーケンス最適化
    const optimizedSequence = this.optimizeLearningSequence(
      competencyGaps,
      learnerProfile,
      timeConstraints
    );
    
    // マイルストーン設定
    const milestones = this.generateMilestones(
      optimizedSequence,
      timeConstraints.targetDate
    );
    
    // 代替パス生成
    const alternativePaths = this.generateAlternativePaths(
      learnerProfile,
      optimizedSequence
    );

    const path: PersonalizedLearningPath = {
      pathId,
      learnerProfile,
      currentPosition: {
        subject: 'math', // 現在の位置
        topic: optimizedSequence[0]?.activity || '',
        subtopic: '',
        masteryLevel: currentCompetencies[optimizedSequence[0]?.activity] || 0
      },
      nextSteps: optimizedSequence,
      alternativePaths,
      milestones
    };

    this.learningPaths.set(pathId, path);
    return path;
  }

  // ヘルパーメソッド群

  private initializeOptimizationStrategies() {
    this.optimizationStrategies = [
      {
        name: 'cognitive_load_balancing',
        applicableConditions: ['high_cognitive_load'],
        implementation: {
          timing: 'real_time',
          duration: 300, // 5 minutes
          parameters: { complexity_reduction: 0.3, scaffolding_increase: 0.5 }
        },
        expectedBenefits: ['reduced_frustration', 'improved_retention'],
        riskMitigation: ['monitor_engagement'],
        successMetrics: ['accuracy_improvement', 'time_reduction']
      },
      {
        name: 'spaced_repetition_optimization',
        applicableConditions: ['low_retention'],
        implementation: {
          timing: 'scheduled',
          duration: 900, // 15 minutes
          parameters: { interval_multiplier: 2.5, difficulty_adjustment: -0.2 }
        },
        expectedBenefits: ['improved_long_term_retention'],
        riskMitigation: ['avoid_overlearning'],
        successMetrics: ['retention_rate_improvement']
      }
    ];
  }

  private getOrCreateCompetencyModel(learnerProfile: LearnerProfile): CompetencyModel {
    if (!this.competencyModels.has(learnerProfile.id)) {
      const model: CompetencyModel = {
        subject: 'math',
        competencies: {},
        learningStyle: {
          visualPreference: 0.7, // デフォルト値
          auditoryPreference: 0.3,
          kinestheticPreference: 0.4,
          readingPreference: 0.6,
          processingSpeed: 1.2,
          workingMemoryCapacity: 7
        },
        cognitiveProfile: {
          analyticalThinking: 70,
          creativeProblemSolving: 60,
          spatialReasoning: 65,
          verbalReasoning: 70,
          memoryStrength: 75,
          attentionSpan: 25
        }
      };
      this.competencyModels.set(learnerProfile.id, model);
    }
    return this.competencyModels.get(learnerProfile.id)!;
  }

  private analyzeRecentPerformance(performance: Array<any>) {
    const accuracyTrend = performance.map(p => p.accuracy);
    const timeTrend = performance.map(p => p.responseTime);
    const difficultyTrend = performance.map(p => p.difficulty);

    return {
      averageAccuracy: accuracyTrend.reduce((a, b) => a + b, 0) / accuracyTrend.length,
      averageTime: timeTrend.reduce((a, b) => a + b, 0) / timeTrend.length,
      difficultyProgression: difficultyTrend,
      consistencyScore: this.calculateConsistency(accuracyTrend),
      improvementRate: this.calculateImprovementRate(accuracyTrend)
    };
  }

  private estimateCurrentAbility(analysis: any, model: CompetencyModel) {
    return {
      estimatedLevel: Math.round(analysis.averageAccuracy * 10),
      confidence: analysis.consistencyScore,
      processingEfficiency: 1 / (analysis.averageTime / 1000)
    };
  }

  private calculateZPD(ability: any, model: CompetencyModel) {
    const lowerBound = Math.max(1, ability.estimatedLevel - 1);
    const upperBound = Math.min(10, ability.estimatedLevel + 2);
    return { lower: lowerBound, upper: upperBound, optimal: ability.estimatedLevel + 1 };
  }

  private optimizeDifficulty(zpd: any, targets: Record<string, number>, analysis: any) {
    if (analysis.improvementRate > 0.1) {
      return Math.min(zpd.upper, zpd.optimal + 0.5);
    } else if (analysis.improvementRate < -0.1) {
      return Math.max(zpd.lower, zpd.optimal - 0.5);
    }
    return zpd.optimal;
  }

  private calculateAdjustmentRate(analysis: any, processingSpeed: number): number {
    const baseRate = 0.1;
    const speedBonus = (processingSpeed - 1) * 0.05;
    const consistencyBonus = analysis.consistencyScore * 0.05;
    return Math.min(0.3, baseRate + speedBonus + consistencyBonus);
  }

  private generateJustification(ability: any, target: number): string {
    if (target > ability.estimatedLevel) {
      return `現在の能力レベル${ability.estimatedLevel}から成長促進のため難易度を上げます`;
    } else if (target < ability.estimatedLevel) {
      return `認知負荷軽減のため難易度を下げて基礎固めを行います`;
    }
    return `現在の難易度が最適です`;
  }

  private predictOutcome(difficulty: number, model: CompetencyModel): string {
    if (difficulty > 7) {
      return '高い挑戦によるスキル向上が期待できます';
    } else if (difficulty < 4) {
      return '自信回復と基礎固めが期待できます';
    }
    return '安定した学習進捗が期待できます';
  }

  private identifyRiskFactors(difficulty: number, model: CompetencyModel): string[] {
    const risks: string[] = [];
    if (difficulty > 8) risks.push('フラストレーション増加のリスク');
    if (difficulty < 3) risks.push('退屈による集中力低下のリスク');
    if (model.cognitiveProfile.attentionSpan < 20) risks.push('集中力持続の課題');
    return risks;
  }

  private estimateCognitiveCapacity(profile: LearnerProfile): number {
    // 認知容量の推定（Miller's 7±2 Rule を基準）
    return 100; // 基本容量
  }

  private calculateExtraneousLoad(metrics: UltraLearningMetrics): number {
    // 外在的認知負荷の計算
    return Math.max(0, metrics.cognitiveLoad.currentLevel - 50);
  }

  private calculateOptimalBreaks(load: number, sessionLength: string): number[] {
    const baseInterval = sessionLength === 'short' ? 15 : sessionLength === 'medium' ? 25 : 45;
    if (load > 70) {
      return [10, 20, 35]; // 頻繁な休憩
    } else if (load < 40) {
      return [baseInterval]; // 通常の休憩
    }
    return [15, 30]; // 適度な休憩
  }

  private identifyPrimaryMotivationType(state: UltraLearningMetrics['motivationalState']): string {
    const scores = {
      achievement: state.intrinsicMotivation * 0.7 + state.confidenceLevel * 0.3,
      progress: state.intrinsicMotivation * 0.5 + state.flowState * 0.5,
      competition: state.extrinsicMotivation * 0.6 + state.confidenceLevel * 0.4,
      exploration: state.intrinsicMotivation * 0.8 + state.flowState * 0.2
    };
    
    return Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
  }

  private getDefaultModalityOptimization() {
    return {
      primaryModality: 'visual',
      secondaryModality: 'auditory',
      modalityRatio: 0.7,
      adaptiveElements: ['visual_aids', 'audio_support'],
      deliverySequence: ['visual_introduction', 'auditory_explanation', 'visual_practice']
    };
  }

  private getContentAdaptations(contentType: string, modality: string): string[] {
    const adaptationMap: Record<string, Record<string, string[]>> = {
      'math': {
        'visual': ['diagrams', 'charts', 'color_coding'],
        'auditory': ['verbal_explanations', 'sound_effects'],
        'kinesthetic': ['manipulatives', 'gestures'],
        'reading': ['text_problems', 'step_by_step_text']
      }
    };
    return adaptationMap[contentType]?.[modality] || [];
  }

  private optimizeDeliverySequence(primary: string, secondary: string, performance: UltraLearningMetrics): string[] {
    // パフォーマンスに基づいた配信シーケンス最適化
    if (performance.comprehensionDepth.deepLevel < 50) {
      return [`${primary}_introduction`, `${secondary}_reinforcement`, `${primary}_practice`];
    }
    return [`${primary}_challenge`, `${secondary}_support`, `${primary}_mastery`];
  }

  private analyzeCompetencyGaps(current: Record<string, number>, targets: string[]): Array<{gap: number, priority: number}> {
    return targets.map(target => ({
      gap: Math.max(0, 80 - (current[target] || 0)), // 80を目標とする
      priority: Math.random() // 簡略化
    }));
  }

  private optimizeLearningSequence(gaps: any[], profile: LearnerProfile, constraints: any) {
    // 学習シーケンスの最適化
    return gaps.map((gap, index) => ({
      activity: `topic_${index}`,
      estimatedDuration: 30,
      difficultyLevel: 5,
      learningObjectives: [`objective_${index}`],
      successCriteria: [`criteria_${index}`],
      adaptations: []
    }));
  }

  private generateMilestones(sequence: any[], targetDate: Date) {
    return [{
      name: 'Mid-term Assessment',
      targetDate: new Date(targetDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      competencyRequirements: {},
      assessmentMethod: 'comprehensive_test'
    }];
  }

  private generateAlternativePaths(profile: LearnerProfile, sequence: any[]) {
    return [{
      condition: 'if_struggling',
      path: {} as PersonalizedLearningPath // 簡略化
    }];
  }

  private calculateConsistency(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.max(0, 1 - Math.sqrt(variance));
  }

  private calculateImprovementRate(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
    const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;
    return secondAvg - firstAvg;
  }
}

// シングルトンインスタンス
export const nextGenAdaptiveLearning = new NextGenAdaptiveLearning();