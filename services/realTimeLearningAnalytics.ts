// 📊 リアルタイム学習分析エンジン - 瞬時学習データ解析・予測・最適化
// Real-Time Learning Analytics Engine for Instant Data Analysis, Prediction & Optimization

export interface LearningEvent {
  timestamp: Date;
  eventType: 'problem_start' | 'problem_submit' | 'hint_request' | 'explanation_view' | 'pause' | 'resume';
  userId: string;
  sessionId: string;
  problemId: string;
  data: {
    answer?: string;
    timeSpent: number;
    keystrokes?: number;
    mouseMoves?: number;
    hesitationPauses?: number;
    confidence?: number;
    difficulty?: number;
    topic?: string;
    context?: any;
  };
}

export interface CognitiveLoadIndicators {
  processingTime: number;        // 処理時間延長
  hesitationRate: number;        // 迷い率
  errorFrequency: number;        // エラー頻度
  revisionCount: number;         // 修正回数
  attentionFluctuation: number;  // 注意変動
  fatigueLevel: number;          // 疲労度
}

export interface LearningStateSnapshot {
  timestamp: Date;
  cognitiveLoad: CognitiveLoadIndicators;
  emotionalState: {
    frustration: number;    // イライラ度
    confidence: number;     // 自信度
    engagement: number;     // 集中度
    motivation: number;     // やる気
  };
  performanceMetrics: {
    accuracy: number;
    speed: number;
    efficiency: number;
    consistency: number;
  };
  learningProgress: {
    conceptMastery: Record<string, number>;
    skillDevelopment: Record<string, number>;
    knowledgeRetention: Record<string, number>;
  };
}

export interface RealTimePrediction {
  nextProblemDifficulty: number;
  successProbability: number;
  optimalBreakTime: number;
  riskOfFrustration: number;
  expectedLearningGain: number;
  recommendedIntervention: string[];
}

export interface LearningInsight {
  type: 'pattern' | 'anomaly' | 'opportunity' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  recommendations: string[];
  confidence: number;
  timestamp: Date;
}

export class RealTimeLearningAnalytics {
  
  private eventBuffer: LearningEvent[] = [];
  private stateHistory: LearningStateSnapshot[] = [];
  private currentState: LearningStateSnapshot | null = null;
  private analysisInterval: NodeJS.Timeout | null = null;
  
  // 🧠 認知負荷検出アルゴリズム
  private readonly COGNITIVE_LOAD_THRESHOLDS = {
    processingTime: {
      low: 1.0,      // 通常時間の1倍
      medium: 1.5,   // 通常時間の1.5倍
      high: 2.0,     // 通常時間の2倍
      critical: 3.0  // 通常時間の3倍
    },
    hesitationRate: {
      low: 0.1,      // 10%以下の迷い
      medium: 0.2,   // 20%以下の迷い
      high: 0.3,     // 30%以下の迷い
      critical: 0.4  // 40%以上の迷い
    },
    errorFrequency: {
      low: 0.1,      // 10%以下のエラー率
      medium: 0.2,   // 20%以下のエラー率
      high: 0.3,     // 30%以下のエラー率
      critical: 0.4  // 40%以上のエラー率
    }
  };
  
  // 📈 パフォーマンスパターン認識
  private readonly PERFORMANCE_PATTERNS = {
    'steady_improvement': {
      signature: [0.1, 0.2, 0.3, 0.4, 0.5], // 段階的向上
      description: '着実な成長パターン',
      prediction: 'continued_growth',
      intervention: 'maintain_current_pace'
    },
    'rapid_mastery': {
      signature: [0.2, 0.5, 0.8, 0.9, 0.95], // 急速習得
      description: '急速習得パターン',
      prediction: 'ready_for_advancement',
      intervention: 'increase_difficulty'
    },
    'plateau_struggle': {
      signature: [0.6, 0.6, 0.6, 0.6, 0.6], // 停滞
      description: '学習停滞パターン',
      prediction: 'need_strategy_change',
      intervention: 'alternative_approach'
    },
    'zigzag_progress': {
      signature: [0.3, 0.6, 0.4, 0.7, 0.5], // ジグザグ進歩
      description: '不安定な進歩パターン',
      prediction: 'consolidation_needed',
      intervention: 'stabilize_foundation'
    },
    'burnout_decline': {
      signature: [0.8, 0.7, 0.6, 0.5, 0.4], // 燃え尽き低下
      description: '燃え尽き症候群パターン',
      prediction: 'risk_of_disengagement',
      intervention: 'immediate_support'
    }
  };
  
  // 🎯 感情状態検出指標
  private readonly EMOTIONAL_INDICATORS = {
    frustration: {
      rapidKeystrokes: 0.3,      // 急激なキーストローク増加
      longPauses: 0.2,           // 長時間の停止
      multipleErasures: 0.3,     // 複数回の消去
      timeoutEvents: 0.2         // タイムアウト発生
    },
    confidence: {
      quickSubmission: 0.4,      // 迅速な回答提出
      fewRevisions: 0.3,         // 少ない修正回数
      consistentTiming: 0.3      // 一貫した解答時間
    },
    engagement: {
      steadyActivity: 0.4,       // 安定した活動
      optimalPacing: 0.3,        // 最適なペース
      focusedAttention: 0.3      // 集中した注意
    }
  };
  
  // ⚡ リアルタイム分析開始
  public startRealTimeAnalysis(userId: string): void {
    console.log(`⚡ リアルタイム分析開始: ユーザー${userId}`);
    
    this.analysisInterval = setInterval(() => {
      this.performRealTimeAnalysis(userId);
    }, 5000); // 5秒間隔で分析
  }
  
  // 🛑 分析停止
  public stopRealTimeAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
      console.log('🛑 リアルタイム分析停止');
    }
  }
  
  // 📝 学習イベント記録
  public recordLearningEvent(event: LearningEvent): void {
    event.timestamp = new Date();
    this.eventBuffer.push(event);
    
    // バッファサイズ制限
    if (this.eventBuffer.length > 1000) {
      this.eventBuffer = this.eventBuffer.slice(-500);
    }
    
    // 即座に分析トリガー
    this.triggerImmediateAnalysis(event);
  }
  
  // ⚡ 即時分析トリガー
  private triggerImmediateAnalysis(event: LearningEvent): void {
    // 緊急度の高いイベントの検出
    if (event.data.timeSpent > 300000) { // 5分以上
      this.generateWarning('long_processing_time', event);
    }
    
    if (event.eventType === 'hint_request' && this.getRecentHintCount(event.userId) > 3) {
      this.generateWarning('excessive_hint_requests', event);
    }
  }
  
  // 🔬 包括的リアルタイム分析
  private performRealTimeAnalysis(userId: string): void {
    const recentEvents = this.getRecentEvents(userId, 60000); // 直近1分間
    
    if (recentEvents.length === 0) return;
    
    // 1. 認知負荷分析
    const cognitiveLoad = this.analyzeCognitiveLoad(recentEvents);
    
    // 2. 感情状態分析
    const emotionalState = this.analyzeEmotionalState(recentEvents);
    
    // 3. パフォーマンス分析
    const performanceMetrics = this.analyzePerformance(recentEvents);
    
    // 4. 学習進捗分析
    const learningProgress = this.analyzeLearningProgress(recentEvents, userId);
    
    // 5. 状態スナップショット更新
    this.currentState = {
      timestamp: new Date(),
      cognitiveLoad,
      emotionalState,
      performanceMetrics,
      learningProgress
    };
    
    this.stateHistory.push(this.currentState);
    
    // 6. パターン認識
    const patterns = this.recognizePatterns(userId);
    
    // 7. 予測生成
    const predictions = this.generatePredictions(this.currentState, patterns);
    
    // 8. インサイト生成
    const insights = this.generateInsights(this.currentState, patterns, predictions);
    
    // 9. 適応的介入判定
    this.evaluateInterventionNeeds(insights, predictions);
    
    console.log(`🔬 リアルタイム分析完了: 認知負荷${cognitiveLoad.fatigueLevel.toFixed(2)}, 集中度${emotionalState.engagement.toFixed(2)}`);
  }
  
  // 🧠 認知負荷分析
  private analyzeCognitiveLoad(events: LearningEvent[]): CognitiveLoadIndicators {
    let totalProcessingTime = 0;
    let hesitationCount = 0;
    let errorCount = 0;
    let revisionCount = 0;
    let attentionFluctuations = 0;
    
    events.forEach(event => {
      totalProcessingTime += event.data.timeSpent;
      
      if (event.data.hesitationPauses) {
        hesitationCount += event.data.hesitationPauses;
      }
      
      if (event.eventType === 'problem_submit' && event.data.answer) {
        // エラー判定ロジック（簡略版）
        if (event.data.answer.includes('修正')) {
          revisionCount++;
        }
      }
      
      // 注意変動の検出
      if (event.data.mouseMoves && event.data.mouseMoves > 50) {
        attentionFluctuations++;
      }
    });
    
    const avgProcessingTime = totalProcessingTime / events.length;
    const hesitationRate = hesitationCount / events.length;
    const errorFrequency = errorCount / events.length;
    
    // 疲労度計算（複合指標）
    const fatigueLevel = Math.min(1.0, 
      (avgProcessingTime / 30000) * 0.3 +  // 処理時間の影響
      hesitationRate * 0.3 +               // 迷いの影響
      (attentionFluctuations / events.length) * 0.4 // 注意散漫の影響
    );
    
    return {
      processingTime: avgProcessingTime,
      hesitationRate,
      errorFrequency,
      revisionCount,
      attentionFluctuation: attentionFluctuations / events.length,
      fatigueLevel
    };
  }
  
  // 😊 感情状態分析
  private analyzeEmotionalState(events: LearningEvent[]): any {
    let frustrationScore = 0;
    let confidenceScore = 0;
    let engagementScore = 0;
    
    events.forEach(event => {
      // フラストレーション指標
      if (event.data.timeSpent > 60000) frustrationScore += 0.2; // 1分以上
      if (event.eventType === 'hint_request') frustrationScore += 0.1;
      
      // 自信指標
      if (event.data.timeSpent < 30000 && event.eventType === 'problem_submit') {
        confidenceScore += 0.3; // 迅速な回答
      }
      
      // 集中指標
      if (event.data.mouseMoves && event.data.mouseMoves < 20) {
        engagementScore += 0.2; // 少ないマウス移動＝集中
      }
    });
    
    // 正規化
    frustrationScore = Math.min(1.0, frustrationScore / events.length);
    confidenceScore = Math.min(1.0, confidenceScore);
    engagementScore = Math.min(1.0, engagementScore);
    
    return {
      frustration: frustrationScore,
      confidence: confidenceScore,
      engagement: engagementScore,
      motivation: Math.max(0, 1 - frustrationScore + confidenceScore) / 2
    };
  }
  
  // 📊 パフォーマンス分析
  private analyzePerformance(events: LearningEvent[]): any {
    const submitEvents = events.filter(e => e.eventType === 'problem_submit');
    
    if (submitEvents.length === 0) {
      return { accuracy: 0.5, speed: 0.5, efficiency: 0.5, consistency: 0.5 };
    }
    
    // 正答率計算（簡略版）
    const accuracy = 0.7; // 実際は回答の正誤判定が必要
    
    // 速度計算
    const avgTime = submitEvents.reduce((sum, e) => sum + e.data.timeSpent, 0) / submitEvents.length;
    const speed = Math.max(0, 1 - (avgTime / 60000)); // 1分を基準とした相対速度
    
    // 効率性計算
    const efficiency = accuracy * speed;
    
    // 一貫性計算
    const timeVariance = this.calculateVariance(submitEvents.map(e => e.data.timeSpent));
    const consistency = Math.max(0, 1 - (timeVariance / (avgTime * avgTime)));
    
    return { accuracy, speed, efficiency, consistency };
  }
  
  // 📈 学習進捗分析
  private analyzeLearningProgress(events: LearningEvent[], userId: string): any {
    // 概念習得度分析
    const conceptMastery: Record<string, number> = {};
    const skillDevelopment: Record<string, number> = {};
    const knowledgeRetention: Record<string, number> = {};
    
    events.forEach(event => {
      if (event.data.topic) {
        const topic = event.data.topic;
        
        // 習得度更新（簡略版）
        if (!conceptMastery[topic]) conceptMastery[topic] = 0.5;
        
        if (event.eventType === 'problem_submit') {
          conceptMastery[topic] = Math.min(1.0, conceptMastery[topic] + 0.1);
        }
        
        if (event.eventType === 'hint_request') {
          conceptMastery[topic] = Math.max(0, conceptMastery[topic] - 0.05);
        }
      }
    });
    
    return {
      conceptMastery,
      skillDevelopment,
      knowledgeRetention
    };
  }
  
  // 🔍 パターン認識
  private recognizePatterns(userId: string): string[] {
    const recentStates = this.stateHistory.slice(-10); // 直近10回の状態
    
    if (recentStates.length < 5) return [];
    
    const recognizedPatterns: string[] = [];
    
    // 性能推移パターン
    const accuracyTrend = recentStates.map(s => s.performanceMetrics.accuracy);
    const pattern = this.matchPerformancePattern(accuracyTrend);
    
    if (pattern) {
      recognizedPatterns.push(pattern);
    }
    
    // 疲労累積パターン
    const fatigueTrend = recentStates.map(s => s.cognitiveLoad.fatigueLevel);
    if (this.isIncreasingTrend(fatigueTrend)) {
      recognizedPatterns.push('increasing_fatigue');
    }
    
    // 集中力変動パターン
    const engagementTrend = recentStates.map(s => s.emotionalState.engagement);
    if (this.hasHighVariance(engagementTrend)) {
      recognizedPatterns.push('attention_fluctuation');
    }
    
    return recognizedPatterns;
  }
  
  // 🔮 予測生成
  private generatePredictions(
    currentState: LearningStateSnapshot,
    patterns: string[]
  ): RealTimePrediction {
    
    // 次問題難易度予測
    let nextDifficulty = 5; // デフォルト
    if (currentState.performanceMetrics.accuracy > 0.8) {
      nextDifficulty += 1;
    } else if (currentState.performanceMetrics.accuracy < 0.6) {
      nextDifficulty -= 1;
    }
    
    // 成功確率予測
    const successProbability = Math.min(0.95, 
      currentState.performanceMetrics.accuracy * 0.6 +
      currentState.emotionalState.confidence * 0.3 +
      (1 - currentState.cognitiveLoad.fatigueLevel) * 0.1
    );
    
    // 最適休憩時間予測
    const optimalBreakTime = currentState.cognitiveLoad.fatigueLevel > 0.7 ? 
      10 : currentState.cognitiveLoad.fatigueLevel > 0.5 ? 5 : 0;
    
    // フラストレーションリスク
    const riskOfFrustration = currentState.emotionalState.frustration * 0.7 +
      currentState.cognitiveLoad.fatigueLevel * 0.3;
    
    // 期待学習効果
    const expectedLearningGain = successProbability * 
      currentState.emotionalState.engagement * 
      (1 - currentState.cognitiveLoad.fatigueLevel);
    
    // 推奨介入
    const recommendedIntervention: string[] = [];
    if (riskOfFrustration > 0.7) {
      recommendedIntervention.push('励ましメッセージ');
    }
    if (currentState.cognitiveLoad.fatigueLevel > 0.8) {
      recommendedIntervention.push('休憩推奨');
    }
    if (successProbability > 0.9) {
      recommendedIntervention.push('難易度上昇');
    }
    
    return {
      nextProblemDifficulty: nextDifficulty,
      successProbability,
      optimalBreakTime,
      riskOfFrustration,
      expectedLearningGain,
      recommendedIntervention
    };
  }
  
  // 💡 インサイト生成
  private generateInsights(
    currentState: LearningStateSnapshot,
    patterns: string[],
    predictions: RealTimePrediction
  ): LearningInsight[] {
    
    const insights: LearningInsight[] = [];
    
    // 高疲労検出
    if (currentState.cognitiveLoad.fatigueLevel > 0.8) {
      insights.push({
        type: 'warning',
        severity: 'high',
        title: '高疲労状態検出',
        description: '認知負荷が高い状態が続いています',
        evidence: [`疲労度: ${(currentState.cognitiveLoad.fatigueLevel * 100).toFixed(0)}%`],
        recommendations: ['10分間の休憩', '軽い運動', '水分補給'],
        confidence: 0.9,
        timestamp: new Date()
      });
    }
    
    // 急速進歩検出
    if (patterns.includes('rapid_mastery')) {
      insights.push({
        type: 'opportunity',
        severity: 'medium',
        title: '急速な習得進歩',
        description: '理解が急速に進んでいます',
        evidence: ['高い正答率の維持', '安定した解答時間'],
        recommendations: ['より難しい問題への挑戦', '応用問題の導入'],
        confidence: 0.85,
        timestamp: new Date()
      });
    }
    
    // 学習停滞検出
    if (patterns.includes('plateau_struggle')) {
      insights.push({
        type: 'pattern',
        severity: 'medium',
        title: '学習停滞パターン',
        description: '同レベルでの停滞が続いています',
        evidence: ['正答率の横ばい', '時間改善なし'],
        recommendations: ['アプローチ変更', '基礎復習', '異なる解法提示'],
        confidence: 0.8,
        timestamp: new Date()
      });
    }
    
    return insights;
  }
  
  // 🚨 介入必要性評価
  private evaluateInterventionNeeds(
    insights: LearningInsight[],
    predictions: RealTimePrediction
  ): void {
    
    const criticalInsights = insights.filter(i => i.severity === 'critical');
    const highSeverityInsights = insights.filter(i => i.severity === 'high');
    
    if (criticalInsights.length > 0) {
      console.log('🚨 緊急介入必要:', criticalInsights.map(i => i.title).join(', '));
      this.triggerImmediateIntervention(criticalInsights);
    } else if (highSeverityInsights.length > 0) {
      console.log('⚠️ 介入推奨:', highSeverityInsights.map(i => i.title).join(', '));
    }
    
    if (predictions.riskOfFrustration > 0.8) {
      console.log('😤 フラストレーションリスク高');
    }
    
    if (predictions.optimalBreakTime > 0) {
      console.log(`😴 休憩推奨: ${predictions.optimalBreakTime}分`);
    }
  }
  
  // ⚡ 即座介入トリガー
  private triggerImmediateIntervention(insights: LearningInsight[]): void {
    // 緊急介入ロジック
    insights.forEach(insight => {
      console.log(`🚨 緊急介入実行: ${insight.title}`);
      // 実際の介入アクション（UI通知、難易度調整等）
    });
  }
  
  // ヘルパーメソッド群
  private getRecentEvents(userId: string, timeWindow: number): LearningEvent[] {
    const cutoff = new Date(Date.now() - timeWindow);
    return this.eventBuffer.filter(e => 
      e.userId === userId && e.timestamp >= cutoff
    );
  }
  
  private getRecentHintCount(userId: string): number {
    const recentEvents = this.getRecentEvents(userId, 300000); // 5分間
    return recentEvents.filter(e => e.eventType === 'hint_request').length;
  }
  
  private generateWarning(type: string, event: LearningEvent): void {
    console.log(`⚠️ 警告生成: ${type}`, event.data);
  }
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
  
  private matchPerformancePattern(accuracyTrend: number[]): string | null {
    // パターンマッチングロジック（簡略版）
    if (this.isIncreasingTrend(accuracyTrend)) return 'steady_improvement';
    if (this.isFlatTrend(accuracyTrend)) return 'plateau_struggle';
    if (this.hasHighVariance(accuracyTrend)) return 'zigzag_progress';
    return null;
  }
  
  private isIncreasingTrend(values: number[]): boolean {
    if (values.length < 3) return false;
    let increases = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i-1]) increases++;
    }
    return increases > values.length * 0.6;
  }
  
  private isFlatTrend(values: number[]): boolean {
    const variance = this.calculateVariance(values);
    return variance < 0.01; // 非常に小さい分散
  }
  
  private hasHighVariance(values: number[]): boolean {
    const variance = this.calculateVariance(values);
    return variance > 0.05; // 大きい分散
  }
  
  // 📊 分析結果取得API
  public getCurrentAnalysis(): {
    currentState: LearningStateSnapshot | null;
    recentInsights: LearningInsight[];
    predictions: RealTimePrediction | null;
  } {
    const recentInsights = []; // 実際は最近のインサイトを取得
    const predictions = this.currentState ? 
      this.generatePredictions(this.currentState, []) : null;
    
    return {
      currentState: this.currentState,
      recentInsights,
      predictions
    };
  }
}

// シングルトンインスタンス
export const realTimeLearningAnalytics = new RealTimeLearningAnalytics();