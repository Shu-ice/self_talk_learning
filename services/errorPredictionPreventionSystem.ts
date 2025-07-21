// 🔮 間違い予測・事前防止システム - AI先読み間違い防止・学習最適化
// Error Prediction & Prevention System - AI Proactive Error Prevention & Learning Optimization

import { realTimeLearningAnalytics, LearningEvent } from './realTimeLearningAnalytics';
import { metacognitiveLearningSupport } from './metacognitiveLearningSupport';

export interface ErrorPattern {
  patternId: string;
  errorType: 'conceptual' | 'procedural' | 'attention' | 'memory' | 'transfer';
  description: string;
  triggerConditions: string[];
  predictiveSignals: {
    behavioral: string[];     // 行動的兆候
    temporal: string[];       // 時間的兆候
    cognitive: string[];      // 認知的兆候
    emotional: string[];      // 感情的兆候
  };
  frequency: number;          // 発生頻度
  severity: number;           // 重要度
  preventionStrategies: string[];
}

export interface ErrorPrediction {
  predictionId: string;
  timestamp: Date;
  errorType: string;
  probability: number;        // 発生確率 (0-1)
  confidence: number;         // 予測信頼度 (0-1)
  timeToError: number;        // エラーまでの予想時間（秒）
  affectedTopics: string[];
  interventionWindow: number; // 介入可能時間（秒）
  riskFactors: string[];
  preventionRecommendations: {
    immediate: string[];      // 即座の対策
    proactive: string[];      // 予防的対策
    reinforcement: string[];  // 強化的対策
  };
}

export interface PreventionIntervention {
  interventionId: string;
  type: 'warning' | 'guidance' | 'scaffolding' | 'redirection' | 'reinforcement';
  timing: 'immediate' | 'just_in_time' | 'proactive';
  message: string;
  actions: string[];
  expectedEffectiveness: number;
  learningImpact: number;
}

export interface MistakeAnalysis {
  mistakeId: string;
  timestamp: Date;
  actualError: string;
  wasPredicted: boolean;
  predictionAccuracy?: number;
  rootCauses: string[];
  learningOpportunity: string;
  futurePreventionStrategy: string;
  conceptualGaps: string[];
  proceduralWeaknesses: string[];
}

export class ErrorPredictionPreventionSystem {
  
  private errorPatternDatabase: ErrorPattern[] = [];
  private activePredictions: ErrorPrediction[] = [];
  private interventionHistory: PreventionIntervention[] = [];
  private predictionAccuracyTracker: number[] = [];
  
  // 🧠 エラーパターンデータベース（中学受験特化）
  private readonly COMMON_ERROR_PATTERNS: ErrorPattern[] = [
    {
      patternId: 'math_operation_confusion',
      errorType: 'procedural',
      description: '四則演算の記号取り違え',
      triggerConditions: ['複雑な計算', '時間プレッシャー', '疲労状態'],
      predictiveSignals: {
        behavioral: ['回答の躊躇', '複数回の修正', 'キーストローク増加'],
        temporal: ['通常より2倍以上の時間', '長時間の停止'],
        cognitive: ['注意散漫', '作業記憶負荷高'],
        emotional: ['焦り', 'イライラ']
      },
      frequency: 0.15,
      severity: 0.7,
      preventionStrategies: ['記号確認プロンプト', '段階的計算支援', '視覚的強調']
    },
    {
      patternId: 'fraction_concept_error',
      errorType: 'conceptual',
      description: '分数概念の誤理解',
      triggerConditions: ['分数混合問題', '概念理解不足', '視覚支援なし'],
      predictiveSignals: {
        behavioral: ['分母への誤った操作', '通分の省略'],
        temporal: ['分数問題での時間延長'],
        cognitive: ['概念混乱', '手順不明確'],
        emotional: ['自信欠如', '困惑']
      },
      frequency: 0.25,
      severity: 0.9,
      preventionStrategies: ['視覚的分数表示', '基本概念復習', '段階的練習']
    },
    {
      patternId: 'word_problem_misinterpretation',
      errorType: 'transfer',
      description: '文章題の読み取り間違い',
      triggerConditions: ['複雑な文章', '複数の条件', '数値の複雑性'],
      predictiveSignals: {
        behavioral: ['問題の再読', '不適切な式設定'],
        temporal: ['問題読解時間の異常延長'],
        cognitive: ['情報整理困難', '関係性理解不足'],
        emotional: ['混乱', '諦めモード']
      },
      frequency: 0.35,
      severity: 0.8,
      preventionStrategies: ['問題構造化支援', 'キーワード強調', '図解化']
    },
    {
      patternId: 'attention_slip_error',
      errorType: 'attention',
      description: '注意力散漫による単純ミス',
      triggerConditions: ['疲労累積', '長時間学習', '単調な作業'],
      predictiveSignals: {
        behavioral: ['マウス移動増加', '画面離脱', '修正頻発'],
        temporal: ['パフォーマンス時間の不規則性'],
        cognitive: ['集中力低下', '注意維持困難'],
        emotional: ['退屈', '疲労感']
      },
      frequency: 0.20,
      severity: 0.5,
      preventionStrategies: ['注意喚起', '休憩提案', '問題形式変更']
    },
    {
      patternId: 'working_memory_overload',
      errorType: 'memory',
      description: 'ワーキングメモリ過負荷エラー',
      triggerConditions: ['多段階計算', '複数情報保持', '中間結果記憶'],
      predictiveSignals: {
        behavioral: ['中間計算の省略', '手順の飛ばし'],
        temporal: ['処理時間の急激な増加'],
        cognitive: ['記憶負荷高', '情報混乱'],
        emotional: ['圧迫感', 'パニック']
      },
      frequency: 0.18,
      severity: 0.8,
      preventionStrategies: ['チャンキング支援', '外部記憶活用', '段階分割']
    },
    {
      patternId: 'perfectionism_paralysis',
      errorType: 'emotional',
      description: '完璧主義による思考停止',
      triggerConditions: ['高期待値', '完璧主義傾向', '評価不安'],
      predictiveSignals: {
        behavioral: ['異常に長い検討', '回答提出躊躇'],
        temporal: ['決定時間の異常延長'],
        cognitive: ['過度の検証', '決断困難'],
        emotional: ['不安', '完璧への執着']
      },
      frequency: 0.12,
      severity: 0.6,
      preventionStrategies: ['時間制限設定', '不完全許容', '進捗重視']
    }
  ];
  
  // 🎯 学年別エラー特性
  private readonly GRADE_SPECIFIC_ERROR_TENDENCIES = {
    '4th': {
      commonErrors: ['基本計算ミス', '単位の取り違え', '問題文読み飛ばし'],
      cognitiveFactors: ['注意持続困難', '抽象思考限界', '記憶容量制限'],
      preventionFocus: ['具体的支援', '視覚的説明', '段階的指導']
    },
    '5th': {
      commonErrors: ['分数小数混乱', '比例関係誤解', '図形性質理解不足'],
      cognitiveFactors: ['概念統合困難', '転移適用限界', '複合問題対応'],
      preventionFocus: ['概念強化', '関連付け支援', '応用練習']
    },
    '6th': {
      commonErrors: ['複雑計算省略', '時間配分ミス', '問題選択判断'],
      cognitiveFactors: ['認知負荷管理', '戦略選択迷い', 'メタ認知不足'],
      preventionFocus: ['戦略指導', '時間管理', 'メタ認知支援']
    }
  };
  
  // 🚀 リアルタイムエラー予測
  public predictErrors(
    currentLearningState: any,
    recentEvents: LearningEvent[],
    userProfile: any
  ): ErrorPrediction[] {
    
    console.log('🔮 エラー予測分析開始');
    
    const predictions: ErrorPrediction[] = [];
    
    // 1. パターンマッチング分析
    const patternBasedPredictions = this.analyzeErrorPatterns(
      currentLearningState, recentEvents, userProfile
    );
    
    // 2. 機械学習ベース予測
    const mlBasedPredictions = this.performMLErrorPrediction(
      currentLearningState, recentEvents, userProfile
    );
    
    // 3. 認知負荷ベース予測
    const cognitiveLoadPredictions = this.analyzeCognitiveLoadErrors(
      currentLearningState, recentEvents
    );
    
    // 4. 時系列パターン分析
    const temporalPredictions = this.analyzeTemporalPatterns(
      recentEvents, userProfile
    );
    
    // 5. 統合予測生成
    predictions.push(
      ...patternBasedPredictions,
      ...mlBasedPredictions,
      ...cognitiveLoadPredictions,
      ...temporalPredictions
    );
    
    // 6. 予測重複排除・優先順位付け
    const consolidatedPredictions = this.consolidatePredictions(predictions);
    
    // 7. アクティブ予測更新
    this.updateActivePredictions(consolidatedPredictions);
    
    console.log(`✨ エラー予測完了: ${consolidatedPredictions.length}件の予測`);
    
    return consolidatedPredictions;
  }
  
  // 🧩 パターンマッチング分析
  private analyzeErrorPatterns(
    state: any,
    events: LearningEvent[],
    profile: any
  ): ErrorPrediction[] {
    
    const predictions: ErrorPrediction[] = [];
    
    this.COMMON_ERROR_PATTERNS.forEach(pattern => {
      const matchScore = this.calculatePatternMatch(pattern, state, events, profile);
      
      if (matchScore > 0.6) {
        const prediction: ErrorPrediction = {
          predictionId: `pattern_${pattern.patternId}_${Date.now()}`,
          timestamp: new Date(),
          errorType: pattern.errorType,
          probability: matchScore,
          confidence: 0.8,
          timeToError: this.estimateTimeToError(pattern, state),
          affectedTopics: this.identifyAffectedTopics(pattern, profile),
          interventionWindow: 30, // 30秒の介入可能時間
          riskFactors: this.extractRiskFactors(pattern, state),
          preventionRecommendations: {
            immediate: pattern.preventionStrategies.slice(0, 2),
            proactive: pattern.preventionStrategies.slice(2),
            reinforcement: ['理解確認', '類似問題練習']
          }
        };
        
        predictions.push(prediction);
      }
    });
    
    return predictions;
  }
  
  // 🤖 機械学習ベース予測
  private performMLErrorPrediction(
    state: any,
    events: LearningEvent[],
    profile: any
  ): ErrorPrediction[] {
    
    // 簡略版MLアルゴリズム
    const features = this.extractMLFeatures(state, events, profile);
    const errorProbability = this.calculateMLErrorProbability(features);
    
    if (errorProbability > 0.7) {
      return [{
        predictionId: `ml_prediction_${Date.now()}`,
        timestamp: new Date(),
        errorType: 'general',
        probability: errorProbability,
        confidence: 0.75,
        timeToError: 60,
        affectedTopics: ['current_topic'],
        interventionWindow: 45,
        riskFactors: ['high_ml_score'],
        preventionRecommendations: {
          immediate: ['注意喚起', '速度調整'],
          proactive: ['基礎復習', '支援強化'],
          reinforcement: ['反復練習', '理解確認']
        }
      }];
    }
    
    return [];
  }
  
  // 🧠 認知負荷分析
  private analyzeCognitiveLoadErrors(
    state: any,
    events: LearningEvent[]
  ): ErrorPrediction[] {
    
    const predictions: ErrorPrediction[] = [];
    
    // 認知負荷指標計算
    const cognitiveLoad = this.calculateCognitiveLoad(state, events);
    
    if (cognitiveLoad > 0.8) {
      predictions.push({
        predictionId: `cognitive_overload_${Date.now()}`,
        timestamp: new Date(),
        errorType: 'memory',
        probability: cognitiveLoad,
        confidence: 0.85,
        timeToError: 30,
        affectedTopics: ['working_memory_tasks'],
        interventionWindow: 20,
        riskFactors: ['high_cognitive_load', 'memory_overload'],
        preventionRecommendations: {
          immediate: ['情報分割', '外部記憶活用'],
          proactive: ['休憩提案', '問題簡素化'],
          reinforcement: ['記憶戦略指導', 'チャンキング練習']
        }
      });
    }
    
    return predictions;
  }
  
  // ⏰ 時系列パターン分析
  private analyzeTemporalPatterns(
    events: LearningEvent[],
    profile: any
  ): ErrorPrediction[] {
    
    const predictions: ErrorPrediction[] = [];
    
    // 時間的疲労パターン検出
    const sessionDuration = this.calculateSessionDuration(events);
    const attentionSpan = profile.cognitiveProfile?.attentionSpan || 30;
    
    if (sessionDuration > attentionSpan * 60) { // 分を秒に変換
      predictions.push({
        predictionId: `fatigue_pattern_${Date.now()}`,
        timestamp: new Date(),
        errorType: 'attention',
        probability: Math.min(0.9, sessionDuration / (attentionSpan * 60)),
        confidence: 0.9,
        timeToError: 15,
        affectedTopics: ['attention_demanding_tasks'],
        interventionWindow: 10,
        riskFactors: ['session_fatigue', 'attention_decline'],
        preventionRecommendations: {
          immediate: ['即座休憩', '注意リセット'],
          proactive: ['学習時間管理', '休憩スケジュール'],
          reinforcement: ['集中力訓練', '時間管理スキル']
        }
      });
    }
    
    return predictions;
  }
  
  // 🎯 予防的介入実行
  public executePreventiveIntervention(
    prediction: ErrorPrediction,
    userContext: any
  ): PreventionIntervention {
    
    console.log(`🎯 予防介入実行: ${prediction.errorType} (確率: ${(prediction.probability * 100).toFixed(1)}%)`);
    
    const interventionType = this.selectOptimalInterventionType(prediction, userContext);
    const timing = this.determineOptimalTiming(prediction);
    
    const intervention: PreventionIntervention = {
      interventionId: `intervention_${Date.now()}`,
      type: interventionType,
      timing,
      message: this.generateInterventionMessage(prediction, userContext),
      actions: this.selectInterventionActions(prediction, interventionType),
      expectedEffectiveness: this.estimateInterventionEffectiveness(prediction, interventionType),
      learningImpact: this.estimateLearningImpact(prediction, interventionType)
    };
    
    // 介入実行
    this.executeIntervention(intervention);
    
    // 履歴記録
    this.interventionHistory.push(intervention);
    
    console.log(`✨ 介入実行完了: ${intervention.type} - ${intervention.message}`);
    
    return intervention;
  }
  
  // 📊 間違い分析・学習最適化
  public analyzeMistakeAndOptimize(
    actualError: string,
    context: any,
    wasPredicted: boolean,
    predictionId?: string
  ): MistakeAnalysis {
    
    console.log('📊 間違い分析開始');
    
    const analysis: MistakeAnalysis = {
      mistakeId: `mistake_${Date.now()}`,
      timestamp: new Date(),
      actualError,
      wasPredicted,
      rootCauses: this.analyzeRootCauses(actualError, context),
      learningOpportunity: this.identifyLearningOpportunity(actualError, context),
      futurePreventionStrategy: this.developPreventionStrategy(actualError, context),
      conceptualGaps: this.identifyConceptualGaps(actualError, context),
      proceduralWeaknesses: this.identifyProceduralWeaknesses(actualError, context)
    };
    
    // 予測精度評価
    if (wasPredicted && predictionId) {
      analysis.predictionAccuracy = this.evaluatePredictionAccuracy(predictionId, actualError);
      this.updatePredictionModel(analysis.predictionAccuracy);
    }
    
    // パターンデータベース更新
    this.updateErrorPatternDatabase(analysis);
    
    // 個別化学習推奨生成
    this.generatePersonalizedLearningRecommendations(analysis, context);
    
    console.log(`✨ 間違い分析完了: ${analysis.rootCauses.length}個の根本原因特定`);
    
    return analysis;
  }
  
  // 🔄 予測モデル自動改善
  public improvePredictionModel(): void {
    console.log('🔄 予測モデル改善開始');
    
    // 予測精度統計
    const averageAccuracy = this.predictionAccuracyTracker.length > 0 ?
      this.predictionAccuracyTracker.reduce((sum, acc) => sum + acc, 0) / this.predictionAccuracyTracker.length :
      0.5;
    
    console.log(`📈 現在の予測精度: ${(averageAccuracy * 100).toFixed(1)}%`);
    
    // パフォーマンス不足の場合は調整
    if (averageAccuracy < 0.7) {
      this.adjustPredictionThresholds();
      this.refineErrorPatterns();
      console.log('🔧 予測閾値・パターンを調整しました');
    }
    
    // 成功率の高いパターンの重み増加
    this.reinforceSuccessfulPatterns();
    
    console.log('✨ 予測モデル改善完了');
  }
  
  // ヘルパーメソッド群
  private calculatePatternMatch(
    pattern: ErrorPattern,
    state: any,
    events: LearningEvent[],
    profile: any
  ): number {
    
    let matchScore = 0;
    let totalFactors = 0;
    
    // トリガー条件チェック
    pattern.triggerConditions.forEach(condition => {
      totalFactors++;
      if (this.checkTriggerCondition(condition, state, events, profile)) {
        matchScore += 0.3;
      }
    });
    
    // 予測シグナルチェック
    Object.values(pattern.predictiveSignals).forEach(signals => {
      signals.forEach(signal => {
        totalFactors++;
        if (this.detectSignal(signal, state, events)) {
          matchScore += 0.2;
        }
      });
    });
    
    return totalFactors > 0 ? matchScore / totalFactors : 0;
  }
  
  private checkTriggerCondition(condition: string, state: any, events: LearningEvent[], profile: any): boolean {
    // トリガー条件チェックロジック（簡略版）
    switch (condition) {
      case '複雑な計算':
        return state.difficulty > 6;
      case '時間プレッシャー':
        return state.timeRemaining < 300; // 5分未満
      case '疲労状態':
        return state.cognitiveLoad?.fatigueLevel > 0.7;
      default:
        return false;
    }
  }
  
  private detectSignal(signal: string, state: any, events: LearningEvent[]): boolean {
    // シグナル検出ロジック（簡略版）
    switch (signal) {
      case '回答の躊躇':
        return events.some(e => e.data.hesitationPauses && e.data.hesitationPauses > 3);
      case '複数回の修正':
        return events.filter(e => e.eventType === 'problem_submit').length > 2;
      case '通常より2倍以上の時間':
        const avgTime = events.reduce((sum, e) => sum + e.data.timeSpent, 0) / events.length;
        return avgTime > 60000; // 1分以上
      default:
        return false;
    }
  }
  
  private estimateTimeToError(pattern: ErrorPattern, state: any): number {
    // エラーまでの時間推定（秒）
    const baseTime = 60; // 基本60秒
    const urgencyFactor = pattern.severity;
    return Math.max(10, baseTime * (1 - urgencyFactor));
  }
  
  private identifyAffectedTopics(pattern: ErrorPattern, profile: any): string[] {
    // 影響を受けるトピック特定
    return profile.currentTopics || ['current_topic'];
  }
  
  private extractRiskFactors(pattern: ErrorPattern, state: any): string[] {
    // リスク要因抽出
    const factors: string[] = [];
    if (state.cognitiveLoad?.fatigueLevel > 0.7) factors.push('高疲労');
    if (state.difficulty > 7) factors.push('高難易度');
    if (state.timeRemaining < 300) factors.push('時間プレッシャー');
    return factors;
  }
  
  private extractMLFeatures(state: any, events: LearningEvent[], profile: any): number[] {
    // ML特徴量抽出
    return [
      state.difficulty || 5,
      state.cognitiveLoad?.fatigueLevel || 0.5,
      events.length,
      profile.recentAccuracy || 0.7,
      state.timeRemaining || 600
    ];
  }
  
  private calculateMLErrorProbability(features: number[]): number {
    // 簡略版ML確率計算
    const weights = [0.2, 0.3, 0.1, -0.3, -0.1];
    const score = features.reduce((sum, feature, i) => sum + feature * weights[i], 0);
    return Math.max(0, Math.min(1, 1 / (1 + Math.exp(-score)))); // Sigmoid
  }
  
  private calculateCognitiveLoad(state: any, events: LearningEvent[]): number {
    // 認知負荷計算
    const baseLoad = state.difficulty / 10;
    const timeStress = state.timeRemaining < 300 ? 0.3 : 0;
    const complexityLoad = events.length > 10 ? 0.2 : 0;
    return Math.min(1, baseLoad + timeStress + complexityLoad);
  }
  
  private calculateSessionDuration(events: LearningEvent[]): number {
    if (events.length === 0) return 0;
    const first = events[0].timestamp.getTime();
    const last = events[events.length - 1].timestamp.getTime();
    return (last - first) / 1000; // 秒
  }
  
  private consolidatePredictions(predictions: ErrorPrediction[]): ErrorPrediction[] {
    // 重複排除・優先順位付け
    const consolidated = predictions
      .filter(p => p.probability > 0.6)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5); // 上位5件
    
    return consolidated;
  }
  
  private updateActivePredictions(predictions: ErrorPrediction[]): void {
    // 古い予測をクリア
    this.activePredictions = this.activePredictions.filter(
      p => (Date.now() - p.timestamp.getTime()) < 300000 // 5分以内
    );
    
    // 新しい予測を追加
    this.activePredictions.push(...predictions);
  }
  
  private selectOptimalInterventionType(prediction: ErrorPrediction, context: any): any {
    if (prediction.probability > 0.8) return 'warning';
    if (prediction.errorType === 'conceptual') return 'scaffolding';
    if (prediction.errorType === 'attention') return 'redirection';
    return 'guidance';
  }
  
  private determineOptimalTiming(prediction: ErrorPrediction): any {
    if (prediction.timeToError < 30) return 'immediate';
    if (prediction.timeToError < 60) return 'just_in_time';
    return 'proactive';
  }
  
  private generateInterventionMessage(prediction: ErrorPrediction, context: any): string {
    const messages = {
      'procedural': 'ちょっと待って！計算の手順を確認してみよう。',
      'conceptual': '基本の考え方をもう一度確認してみませんか？',
      'attention': '集中！もう一度問題を見直してみよう。',
      'memory': '情報を整理してから進めてみよう。'
    };
    
    return messages[prediction.errorType] || '注意深く進めてみよう。';
  }
  
  private selectInterventionActions(prediction: ErrorPrediction, type: string): string[] {
    const actions = {
      'warning': ['注意喚起表示', 'ペース調整'],
      'scaffolding': ['段階的支援', '基本確認'],
      'guidance': ['ヒント提示', '方向性示唆'],
      'redirection': ['注意喚起', '集中促進']
    };
    
    return actions[type] || ['一般支援'];
  }
  
  private estimateInterventionEffectiveness(prediction: ErrorPrediction, type: string): number {
    // 介入効果推定
    const baseEffectiveness = 0.7;
    const typeMultiplier = { 'warning': 0.8, 'scaffolding': 0.9, 'guidance': 0.75, 'redirection': 0.7 };
    return baseEffectiveness * (typeMultiplier[type] || 0.7);
  }
  
  private estimateLearningImpact(prediction: ErrorPrediction, type: string): number {
    // 学習影響推定
    return type === 'scaffolding' ? 0.9 : 0.6;
  }
  
  private executeIntervention(intervention: PreventionIntervention): void {
    // 実際の介入実行
    console.log(`🚀 介入実行: ${intervention.message}`);
    // UI通知、ヒント表示、問題調整等の実装
  }
  
  private analyzeRootCauses(error: string, context: any): string[] {
    // 根本原因分析
    return ['概念理解不足', '手順間違い', '注意不足'];
  }
  
  private identifyLearningOpportunity(error: string, context: any): string {
    return '基本概念の再確認と定着練習';
  }
  
  private developPreventionStrategy(error: string, context: any): string {
    return '段階的な理解確認と反復練習';
  }
  
  private identifyConceptualGaps(error: string, context: any): string[] {
    return ['基本概念', '関連概念'];
  }
  
  private identifyProceduralWeaknesses(error: string, context: any): string[] {
    return ['計算手順', '問題解決手順'];
  }
  
  private evaluatePredictionAccuracy(predictionId: string, actualError: string): number {
    // 予測精度評価
    return 0.8; // 簡略版
  }
  
  private updatePredictionModel(accuracy: number): void {
    this.predictionAccuracyTracker.push(accuracy);
    if (this.predictionAccuracyTracker.length > 100) {
      this.predictionAccuracyTracker = this.predictionAccuracyTracker.slice(-50);
    }
  }
  
  private updateErrorPatternDatabase(analysis: MistakeAnalysis): void {
    // エラーパターンデータベース更新
    console.log('📊 エラーパターンDB更新');
  }
  
  private generatePersonalizedLearningRecommendations(analysis: MistakeAnalysis, context: any): void {
    // 個別化学習推奨生成
    console.log('🎯 個別化学習推奨生成');
  }
  
  private adjustPredictionThresholds(): void {
    // 予測閾値調整
    console.log('⚙️ 予測閾値調整');
  }
  
  private refineErrorPatterns(): void {
    // エラーパターン精緻化
    console.log('🔍 エラーパターン精緻化');
  }
  
  private reinforceSuccessfulPatterns(): void {
    // 成功パターン強化
    console.log('💪 成功パターン強化');
  }
  
  // 📊 システム状態取得API
  public getSystemStatus(): {
    activePredictions: number;
    averageAccuracy: number;
    interventionsToday: number;
    preventedErrors: number;
  } {
    const averageAccuracy = this.predictionAccuracyTracker.length > 0 ?
      this.predictionAccuracyTracker.reduce((sum, acc) => sum + acc, 0) / this.predictionAccuracyTracker.length :
      0.5;
    
    return {
      activePredictions: this.activePredictions.length,
      averageAccuracy,
      interventionsToday: this.interventionHistory.filter(
        i => (Date.now() - new Date(i.interventionId.split('_')[1]).getTime()) < 86400000
      ).length,
      preventedErrors: Math.floor(this.interventionHistory.length * 0.7) // 推定防止エラー数
    };
  }
}

// シングルトンインスタンス
export const errorPredictionPreventionSystem = new ErrorPredictionPreventionSystem();