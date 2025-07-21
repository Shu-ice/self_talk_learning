// 🎯 個別最適化学習パス生成システム - 完全パーソナライズド学習体験
// Personalized Learning Path Generator for Maximum Individual Learning Optimization

import { gradeAwareDifficultyController } from './gradeAwareDifficultyController';
import { comprehensiveProblemDatabase } from './comprehensiveProblemDatabase';
import { metacognitiveLearningSupport, MetacognitiveState } from './metacognitiveLearningSupport';

export interface LearnerProfile {
  id: string;
  grade: '4th' | '5th' | '6th';
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite';
  targetSchools: string[];
  subjects: ('math' | 'japanese' | 'science' | 'social')[];
  
  // 認知特性
  cognitiveProfile: {
    processingSpeed: number;      // 処理速度 (0-1)
    workingMemory: number;        // ワーキングメモリ (0-1)
    attentionSpan: number;        // 注意持続時間 (分)
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    comprehensionDepth: number;   // 理解の深さ (0-1)
  };
  
  // 学習特性
  learningCharacteristics: {
    motivation: number;           // 学習意欲 (0-1)
    resilience: number;          // 挫折耐性 (0-1)
    autonomy: number;            // 自律性 (0-1)
    competitiveness: number;     // 競争心 (0-1)
    perfectionism: number;       // 完璧主義傾向 (0-1)
  };
  
  // パフォーマンス履歴
  performanceHistory: {
    recentAccuracy: number;
    averageTime: number;
    consecutiveCorrect: number;
    consecutiveIncorrect: number;
    totalProblemsAttempted: number;
    strongTopics: string[];
    weakTopics: string[];
    improvingTopics: string[];
    plateauTopics: string[];
  };
  
  // 時間制約
  timeConstraints: {
    dailyStudyTime: number;      // 分
    weeklyStudyDays: number;
    preferredStudyTimes: string[];
    examDate?: Date;
    prioritySubjects: string[];
  };
  
  // メタ認知状態
  metacognitiveState: MetacognitiveState;
}

export interface LearningPathStep {
  stepId: string;
  type: 'concept_intro' | 'skill_practice' | 'application' | 'assessment' | 'review' | 'challenge';
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: number;
  prerequisites: string[];
  learningObjectives: string[];
  content: any;
  adaptationRules: string[];
  successCriteria: {
    minAccuracy: number;
    maxTime: number;
    understanding: string[];
  };
}

export interface PersonalizedLearningPath {
  pathId: string;
  learnerProfile: LearnerProfile;
  totalDuration: number; // 分
  totalSteps: number;
  currentStep: number;
  completionRate: number;
  
  // 学習フェーズ
  phases: {
    phase: 'foundation' | 'development' | 'mastery' | 'application' | 'exam_prep';
    steps: LearningPathStep[];
    estimatedDuration: number;
    objectives: string[];
    adaptationStrategy: string;
  }[];
  
  // 適応機構
  adaptationMechanisms: {
    performanceTriggers: any[];
    difficultyAdjustments: any[];
    paceModifications: any[];
    contentAlternatives: any[];
  };
  
  // 予測指標
  predictions: {
    expectedCompletionDate: Date;
    probabilityOfSuccess: number;
    riskFactors: string[];
    recommendedInterventions: string[];
  };
}

export class PersonalizedLearningPathGenerator {
  
  // 🧠 学習者タイプ分類システム
  private readonly LEARNER_ARCHETYPES = {
    'methodical_planner': {
      name: '計画的実行者',
      characteristics: ['高い自律性', '段階的学習', '確実性重視'],
      optimalStrategies: ['structured_progression', 'detailed_feedback', 'milestone_tracking'],
      avoidStrategies: ['random_practice', 'high_uncertainty']
    },
    'creative_explorer': {
      name: '創造的探求者',
      characteristics: ['高い好奇心', '発見的学習', '多様性重視'],
      optimalStrategies: ['discovery_learning', 'varied_problems', 'open_exploration'],
      avoidStrategies: ['rigid_structure', 'repetitive_drill']
    },
    'competitive_achiever': {
      name: '競争的達成者',
      characteristics: ['高い競争心', '成果重視', '挑戦志向'],
      optimalStrategies: ['challenge_problems', 'ranking_systems', 'achievement_badges'],
      avoidStrategies: ['non_competitive', 'easy_problems']
    },
    'careful_perfectionist': {
      name: '慎重な完璧主義者',
      characteristics: ['高い完璧主義', '確実性重視', '時間をかけた理解'],
      optimalStrategies: ['thorough_explanation', 'multiple_examples', 'gradual_progression'],
      avoidStrategies: ['time_pressure', 'incomplete_feedback']
    },
    'resilient_warrior': {
      name: '粘り強い戦士',
      characteristics: ['高い挫折耐性', '努力重視', '継続力'],
      optimalStrategies: ['challenging_problems', 'growth_mindset', 'persistence_rewards'],
      avoidStrategies: ['easy_success', 'fixed_mindset']
    }
  };
  
  // 📊 学習フェーズ定義
  private readonly LEARNING_PHASES = {
    foundation: {
      name: '基礎固め期',
      focus: '基本概念の確実な理解と定着',
      duration: 0.25, // 全体の25%
      objectives: ['基本概念理解', '基礎計算力向上', '学習習慣確立'],
      successCriteria: { accuracy: 0.8, confidence: 0.7, speed: 0.6 }
    },
    development: {
      name: '発展期',
      focus: '応用力と思考力の育成',
      duration: 0.35, // 全体の35%
      objectives: ['応用問題解決', '論理的思考', '戦略的アプローチ'],
      successCriteria: { accuracy: 0.75, confidence: 0.8, speed: 0.7 }
    },
    mastery: {
      name: '習熟期',
      focus: '高度な問題解決能力の完成',
      duration: 0.25, // 全体の25%
      objectives: ['複雑問題解決', '創造的思考', '効率的解法'],
      successCriteria: { accuracy: 0.85, confidence: 0.9, speed: 0.8 }
    },
    application: {
      name: '応用期',
      focus: '実戦的な問題解決能力',
      duration: 0.10, // 全体の10%
      objectives: ['実戦問題対応', '時間管理', '総合力発揮'],
      successCriteria: { accuracy: 0.8, confidence: 0.85, speed: 0.85 }
    },
    exam_prep: {
      name: '受験準備期',
      focus: '入試本番への最終調整',
      duration: 0.05, // 全体の5%
      objectives: ['入試形式慣れ', '精神的準備', '最終確認'],
      successCriteria: { accuracy: 0.9, confidence: 0.95, speed: 0.9 }
    }
  };
  
  // 🎯 学習目標階層
  private readonly LEARNING_OBJECTIVES_HIERARCHY = {
    math: {
      foundation: ['四則演算', '基本図形', '単位換算', '文章題基本'],
      development: ['分数・小数', '割合・比', '面積・体積', '速さ基本'],
      mastery: ['複合図形', '場合の数', '規則性', '論理推理'],
      application: ['入試標準問題', '複合問題', '時間制約問題'],
      exam_prep: ['入試過去問', '予想問題', '弱点克服']
    },
    japanese: {
      foundation: ['漢字・語彙', '基本読解', '文の構造', '文章の流れ'],
      development: ['物語文読解', '説明文読解', '詩・短歌', '文法応用'],
      mastery: ['論説文読解', '記述問題', '表現技法', '批判的読解'],
      application: ['入試読解問題', '記述応用', '総合問題'],
      exam_prep: ['入試過去問', '時間配分', '記述完成']
    }
  };
  
  // 🚀 個別最適化学習パス生成
  public generatePersonalizedPath(
    learnerProfile: LearnerProfile,
    targetDuration: number, // 週数
    subjects: string[]
  ): PersonalizedLearningPath {
    
    console.log('🚀 個別最適化学習パス生成開始');
    console.log(`👤 学習者: ${learnerProfile.grade} × ${learnerProfile.schoolLevel}`);
    console.log(`📅 期間: ${targetDuration}週間, 教科: ${subjects.join(', ')}`);
    
    // 1. 学習者タイプ分析
    const learnerArchetype = this.analyzeLearnerArchetype(learnerProfile);
    
    // 2. 学習目標設定
    const learningGoals = this.defineLearningGoals(
      learnerProfile, targetDuration, subjects
    );
    
    // 3. フェーズ別プラン構築
    const phases = this.constructLearningPhases(
      learnerProfile, learnerArchetype, learningGoals, targetDuration
    );
    
    // 4. 適応機構設計
    const adaptationMechanisms = this.designAdaptationMechanisms(
      learnerProfile, learnerArchetype
    );
    
    // 5. 予測モデル構築
    const predictions = this.generatePredictions(
      learnerProfile, phases, targetDuration
    );
    
    const pathId = `path_${learnerProfile.id}_${Date.now()}`;
    
    console.log(`✨ パス生成完了: ${phases.length}フェーズ, ${this.countTotalSteps(phases)}ステップ`);
    
    return {
      pathId,
      learnerProfile,
      totalDuration: targetDuration * 7 * learnerProfile.timeConstraints.dailyStudyTime,
      totalSteps: this.countTotalSteps(phases),
      currentStep: 0,
      completionRate: 0,
      phases,
      adaptationMechanisms,
      predictions
    };
  }
  
  // 🧠 学習者タイプ分析
  private analyzeLearnerArchetype(profile: LearnerProfile): {
    primaryType: string;
    secondaryType: string;
    confidence: number;
    recommendations: string[];
  } {
    
    const characteristics = profile.learningCharacteristics;
    const cognitive = profile.cognitiveProfile;
    const metacognitive = profile.metacognitiveState;
    
    // 特性スコア計算
    const scores = {
      methodical_planner: characteristics.autonomy * 0.4 + metacognitive.planningSkills * 0.3 + (1 - characteristics.competitiveness) * 0.3,
      creative_explorer: cognitive.comprehensionDepth * 0.3 + (1 - characteristics.perfectionism) * 0.3 + characteristics.motivation * 0.4,
      competitive_achiever: characteristics.competitiveness * 0.5 + characteristics.motivation * 0.3 + cognitive.processingSpeed * 0.2,
      careful_perfectionist: characteristics.perfectionism * 0.4 + (1 - cognitive.processingSpeed) * 0.3 + metacognitive.evaluationSkills * 0.3,
      resilient_warrior: characteristics.resilience * 0.5 + characteristics.autonomy * 0.3 + metacognitive.regulationSkills * 0.2
    };
    
    // 主要・副次タイプ決定
    const sortedTypes = Object.entries(scores).sort(([,a], [,b]) => b - a);
    const primaryType = sortedTypes[0][0];
    const secondaryType = sortedTypes[1][0];
    const confidence = sortedTypes[0][1] - sortedTypes[1][1];
    
    // 推奨事項生成
    const archetype = this.LEARNER_ARCHETYPES[primaryType];
    const recommendations = [
      `主要戦略: ${archetype.optimalStrategies.join(', ')}`,
      `避けるべき: ${archetype.avoidStrategies.join(', ')}`,
      `補助的アプローチ: ${this.LEARNER_ARCHETYPES[secondaryType].name}の特性を活用`
    ];
    
    console.log(`🧠 学習者タイプ分析: ${archetype.name} (信頼度: ${(confidence * 100).toFixed(1)}%)`);
    
    return {
      primaryType,
      secondaryType,
      confidence,
      recommendations
    };
  }
  
  // 🎯 学習目標設定
  private defineLearningGoals(
    profile: LearnerProfile,
    duration: number,
    subjects: string[]
  ): {
    primaryGoals: string[];
    secondaryGoals: string[];
    phaseGoals: Record<string, string[]>;
    successMetrics: any;
  } {
    
    const primaryGoals: string[] = [];
    const secondaryGoals: string[] = [];
    const phaseGoals: Record<string, string[]> = {};
    
    // 志望校レベル別目標設定
    if (profile.schoolLevel === 'elite') {
      primaryGoals.push('最難関校合格レベルの思考力獲得', '時間制約下での正確な問題解決');
    } else if (profile.schoolLevel === 'advanced') {
      primaryGoals.push('上位校合格に必要な応用力獲得', '複雑問題への対応力強化');
    } else {
      primaryGoals.push('基礎学力の確実な定着', '標準問題の安定した解決');
    }
    
    // 学年別目標調整
    if (profile.grade === '6th') {
      primaryGoals.push('入試本番での実戦力完成');
      secondaryGoals.push('精神的強さの育成', '時間管理スキル向上');
    } else if (profile.grade === '5th') {
      secondaryGoals.push('論理的思考力の向上', '応用力の基盤構築');
    } else {
      secondaryGoals.push('学習習慣の確立', '基礎概念の確実な理解');
    }
    
    // フェーズ別目標設定
    Object.keys(this.LEARNING_PHASES).forEach(phase => {
      phaseGoals[phase] = this.LEARNING_PHASES[phase].objectives;
    });
    
    const successMetrics = {
      accuracy: this.calculateTargetAccuracy(profile),
      efficiency: this.calculateTargetEfficiency(profile),
      retention: 0.85,
      application: 0.80
    };
    
    console.log(`🎯 学習目標設定: 主要${primaryGoals.length}項目, 副次${secondaryGoals.length}項目`);
    
    return {
      primaryGoals,
      secondaryGoals,
      phaseGoals,
      successMetrics
    };
  }
  
  // 🏗️ 学習フェーズ構築
  private constructLearningPhases(
    profile: LearnerProfile,
    archetype: any,
    goals: any,
    totalDuration: number
  ) {
    
    const phases = [];
    
    Object.entries(this.LEARNING_PHASES).forEach(([phaseKey, phaseConfig]) => {
      const phaseDuration = Math.floor(totalDuration * phaseConfig.duration);
      
      if (phaseDuration > 0) {
        const steps = this.generatePhaseSteps(
          phaseKey, phaseConfig, profile, archetype, phaseDuration
        );
        
        phases.push({
          phase: phaseKey,
          steps,
          estimatedDuration: phaseDuration,
          objectives: phaseConfig.objectives,
          adaptationStrategy: this.selectAdaptationStrategy(phaseKey, archetype)
        });
      }
    });
    
    console.log(`🏗️ フェーズ構築完了: ${phases.length}フェーズ`);
    
    return phases;
  }
  
  // 📝 フェーズ内ステップ生成
  private generatePhaseSteps(
    phaseKey: string,
    phaseConfig: any,
    profile: LearnerProfile,
    archetype: any,
    duration: number
  ): LearningPathStep[] {
    
    const steps: LearningPathStep[] = [];
    const stepsPerWeek = Math.max(3, Math.floor(duration / 2)); // 週あたりステップ数
    
    for (let i = 0; i < duration; i++) {
      const stepType = this.selectStepType(phaseKey, i, duration, archetype.primaryType);
      const difficulty = this.calculateStepDifficulty(phaseKey, i, duration, profile);
      
      const step: LearningPathStep = {
        stepId: `${phaseKey}_step_${i + 1}`,
        type: stepType,
        title: this.generateStepTitle(stepType, phaseKey, profile.grade),
        description: this.generateStepDescription(stepType, phaseKey, profile),
        estimatedTime: profile.timeConstraints.dailyStudyTime,
        difficulty,
        prerequisites: this.identifyPrerequisites(i, phaseKey),
        learningObjectives: this.selectStepObjectives(stepType, phaseKey, profile),
        content: this.generateStepContent(stepType, phaseKey, difficulty, profile),
        adaptationRules: this.defineAdaptationRules(stepType, archetype),
        successCriteria: {
          minAccuracy: phaseConfig.successCriteria.accuracy,
          maxTime: profile.timeConstraints.dailyStudyTime * 1.2,
          understanding: ['concept_grasp', 'application_ability']
        }
      };
      
      steps.push(step);
    }
    
    return steps;
  }
  
  // ⚙️ 適応機構設計
  private designAdaptationMechanisms(
    profile: LearnerProfile,
    archetype: any
  ) {
    
    return {
      performanceTriggers: [
        {
          condition: 'accuracy < 0.6',
          action: 'reduce_difficulty',
          magnitude: 0.2
        },
        {
          condition: 'consecutive_correct > 5',
          action: 'increase_difficulty',
          magnitude: 0.1
        },
        {
          condition: 'time > 1.5 * estimated',
          action: 'provide_hints',
          magnitude: 0.3
        }
      ],
      difficultyAdjustments: [
        'dynamic_scaffolding',
        'adaptive_hints',
        'personalized_examples'
      ],
      paceModifications: [
        'fast_track_on_mastery',
        'slow_down_on_struggle',
        'break_insertion'
      ],
      contentAlternatives: [
        'visual_explanations',
        'alternative_approaches',
        'simplified_versions'
      ]
    };
  }
  
  // 📊 予測モデル構築
  private generatePredictions(
    profile: LearnerProfile,
    phases: any[],
    duration: number
  ) {
    
    const baseSuccessRate = this.calculateBaseSuccessRate(profile);
    const riskFactors = this.identifyRiskFactors(profile);
    const probabilityOfSuccess = Math.max(0.1, baseSuccessRate - riskFactors.length * 0.1);
    
    const expectedCompletionDate = new Date();
    expectedCompletionDate.setDate(expectedCompletionDate.getDate() + duration * 7);
    
    const recommendedInterventions = this.generateInterventionRecommendations(
      profile, riskFactors
    );
    
    return {
      expectedCompletionDate,
      probabilityOfSuccess,
      riskFactors,
      recommendedInterventions
    };
  }
  
  // 🔄 動的パス調整
  public adaptLearningPath(
    currentPath: PersonalizedLearningPath,
    recentPerformance: any[],
    currentProgress: number
  ): {
    adjustedPath: PersonalizedLearningPath;
    modifications: string[];
    reasoning: string[];
  } {
    
    console.log('🔄 学習パス動的調整開始');
    
    const modifications: string[] = [];
    const reasoning: string[] = [];
    
    // パフォーマンス分析
    const performanceAnalysis = this.analyzeRecentPerformance(recentPerformance);
    
    // 困難度調整
    if (performanceAnalysis.averageAccuracy < 0.6) {
      modifications.push('難易度を下げる');
      reasoning.push('正答率が低いため、基礎固めに注力');
    } else if (performanceAnalysis.averageAccuracy > 0.9) {
      modifications.push('難易度を上げる');
      reasoning.push('高い正答率を維持しているため、より挑戦的な内容へ');
    }
    
    // ペース調整
    if (performanceAnalysis.averageTime > currentPath.learnerProfile.timeConstraints.dailyStudyTime * 1.5) {
      modifications.push('学習ペースを緩める');
      reasoning.push('時間超過が頻発しているため');
    }
    
    // 調整されたパス生成
    const adjustedPath = { ...currentPath };
    // 実際の調整ロジックをここに実装
    
    console.log(`✨ パス調整完了: ${modifications.length}項目修正`);
    
    return {
      adjustedPath,
      modifications,
      reasoning
    };
  }
  
  // ヘルパーメソッド群
  private countTotalSteps(phases: any[]): number {
    return phases.reduce((total, phase) => total + phase.steps.length, 0);
  }
  
  private calculateTargetAccuracy(profile: LearnerProfile): number {
    const baseAccuracy = { basic: 0.85, standard: 0.80, advanced: 0.75, elite: 0.70 };
    return baseAccuracy[profile.schoolLevel];
  }
  
  private calculateTargetEfficiency(profile: LearnerProfile): number {
    return profile.cognitiveProfile.processingSpeed * 0.7 + 0.3;
  }
  
  private selectAdaptationStrategy(phase: string, archetype: any): string {
    if (archetype.primaryType === 'methodical_planner') return 'structured_progression';
    if (archetype.primaryType === 'creative_explorer') return 'discovery_learning';
    return 'balanced_approach';
  }
  
  private selectStepType(phase: string, index: number, total: number, archetypeType: string): any {
    const progress = index / total;
    if (progress < 0.3) return 'concept_intro';
    if (progress < 0.7) return 'skill_practice';
    if (progress < 0.9) return 'application';
    return 'assessment';
  }
  
  private calculateStepDifficulty(phase: string, index: number, total: number, profile: LearnerProfile): number {
    const phaseBase = { foundation: 3, development: 5, mastery: 7, application: 8, exam_prep: 9 };
    const base = phaseBase[phase] || 5;
    const progress = index / total;
    return Math.min(10, base + progress * 2);
  }
  
  private generateStepTitle(type: string, phase: string, grade: string): string {
    return `${phase}_${type}_${grade}`;
  }
  
  private generateStepDescription(type: string, phase: string, profile: LearnerProfile): string {
    return `${type}タイプの学習ステップ（${phase}フェーズ）`;
  }
  
  private identifyPrerequisites(index: number, phase: string): string[] {
    if (index === 0) return [];
    return [`${phase}_step_${index}`];
  }
  
  private selectStepObjectives(type: string, phase: string, profile: LearnerProfile): string[] {
    return ['基本理解', '技能習得'];
  }
  
  private generateStepContent(type: string, phase: string, difficulty: number, profile: LearnerProfile): any {
    return {
      type: 'practice_problems',
      difficulty,
      quantity: 3,
      topics: ['基本計算']
    };
  }
  
  private defineAdaptationRules(type: string, archetype: any): string[] {
    return ['performance_based_adjustment', 'time_based_modification'];
  }
  
  private calculateBaseSuccessRate(profile: LearnerProfile): number {
    return (profile.performanceHistory.recentAccuracy + profile.learningCharacteristics.motivation + profile.cognitiveProfile.workingMemory) / 3;
  }
  
  private identifyRiskFactors(profile: LearnerProfile): string[] {
    const risks: string[] = [];
    if (profile.performanceHistory.recentAccuracy < 0.6) risks.push('低正答率');
    if (profile.learningCharacteristics.motivation < 0.5) risks.push('低モチベーション');
    if (profile.timeConstraints.dailyStudyTime < 30) risks.push('学習時間不足');
    return risks;
  }
  
  private generateInterventionRecommendations(profile: LearnerProfile, risks: string[]): string[] {
    const interventions: string[] = [];
    if (risks.includes('低正答率')) interventions.push('基礎復習の強化');
    if (risks.includes('低モチベーション')) interventions.push('動機づけ戦略の実施');
    return interventions;
  }
  
  private analyzeRecentPerformance(performance: any[]): any {
    if (performance.length === 0) {
      return { averageAccuracy: 0.5, averageTime: 30 };
    }
    
    const accuracy = performance.reduce((sum, p) => sum + (p.correct ? 1 : 0), 0) / performance.length;
    const time = performance.reduce((sum, p) => sum + p.time, 0) / performance.length;
    
    return {
      averageAccuracy: accuracy,
      averageTime: time
    };
  }
}

// シングルトンインスタンス
export const personalizedLearningPathGenerator = new PersonalizedLearningPathGenerator();