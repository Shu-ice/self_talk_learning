import { ChatMessage, LearningSession } from '../types';
import { VoiceAnalysis } from './speechRecognitionService';

// リアルタイム学習分析の結果
export interface RealTimeLearningAnalysis {
  sessionId: string;
  timestamp: Date;
  
  // 学習行動分析
  behaviorAnalysis: {
    responseTime: number; // 秒
    messageFrequency: number; // メッセージ/分
    averageMessageLength: number;
    questionToAnswerRatio: number; // 質問vs回答の比率
    engagementLevel: 'low' | 'medium' | 'high';
  };
  
  // 理解度分析
  comprehensionAnalysis: {
    conceptualUnderstanding: number; // 0-1
    proceduralFluency: number; // 0-1
    problemSolvingAbility: number; // 0-1
    knowledgeGaps: string[];
    strengthAreas: string[];
  };
  
  // 感情・モチベーション分析
  emotionalAnalysis: {
    currentMood: 'frustrated' | 'confused' | 'engaged' | 'confident' | 'bored';
    motivationLevel: number; // 0-1
    stressIndicators: string[];
    positiveIndicators: string[];
  };
  
  // 学習パターン分析
  learningPatternAnalysis: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    preferredComplexity: 'simple' | 'moderate' | 'complex';
    attentionSpan: number; // 分
    optimalSessionLength: number; // 分
  };
  
  // 即座推奨アクション
  immediateRecommendations: {
    shouldTakeBreak: boolean;
    shouldSimplifyExplanation: boolean;
    shouldProvideEncouragement: boolean;
    shouldOfferHint: boolean;
    shouldSwitchTopic: boolean;
    customMessage?: string;
  };
  
  // 進歩指標
  progressIndicators: {
    improvementFromLastSession: number; // -1 to 1
    currentSessionProgress: number; // 0-1
    confidenceTrend: 'increasing' | 'stable' | 'decreasing';
    skillDevelopmentAreas: string[];
  };
}

// 学習行動のイベント（拡張版）
export interface LearningEvent {
  type: 'message_sent' | 'voice_input' | 'image_uploaded' | 'handwriting_created' | 'pause_detected' | 'comprehension_check' | 'hint_requested' | 'error_made' | 'breakthrough_moment';
  timestamp: Date;
  data: any;
  sessionId: string;
  confidence?: number; // 0-1
  difficulty?: number; // 1-10
  context?: string;
}

class RealTimeLearningAnalyzer {
  private sessionData: Map<string, {
    events: LearningEvent[];
    messages: ChatMessage[];
    voiceAnalyses: VoiceAnalysis[];
    startTime: Date;
    lastActivity: Date;
  }> = new Map();

  private analysisCallbacks: Map<string, (analysis: RealTimeLearningAnalysis) => void> = new Map();

  // セッション開始
  public startSession(sessionId: string, onAnalysis: (analysis: RealTimeLearningAnalysis) => void): void {
    this.sessionData.set(sessionId, {
      events: [],
      messages: [],
      voiceAnalyses: [],
      startTime: new Date(),
      lastActivity: new Date()
    });
    
    this.analysisCallbacks.set(sessionId, onAnalysis);
  }

  // セッション終了
  public endSession(sessionId: string): void {
    this.sessionData.delete(sessionId);
    this.analysisCallbacks.delete(sessionId);
  }

  // イベント記録
  public recordEvent(event: LearningEvent): void {
    const sessionData = this.sessionData.get(event.sessionId);
    if (!sessionData) return;

    sessionData.events.push(event);
    sessionData.lastActivity = new Date();

    // リアルタイム分析実行
    this.performRealTimeAnalysis(event.sessionId);
  }

  // メッセージ記録
  public recordMessage(sessionId: string, message: ChatMessage): void {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) return;

    sessionData.messages.push(message);
    
    // メッセージイベントとして記録
    this.recordEvent({
      type: 'message_sent',
      timestamp: message.timestamp,
      data: { message },
      sessionId
    });
  }

  // 音声分析記録
  public recordVoiceAnalysis(sessionId: string, voiceAnalysis: VoiceAnalysis): void {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) return;

    sessionData.voiceAnalyses.push(voiceAnalysis);
    
    this.recordEvent({
      type: 'voice_input',
      timestamp: new Date(),
      data: { voiceAnalysis },
      sessionId
    });
  }

  // リアルタイム分析の実行
  private performRealTimeAnalysis(sessionId: string): void {
    const sessionData = this.sessionData.get(sessionId);
    const callback = this.analysisCallbacks.get(sessionId);
    if (!sessionData || !callback) return;

    const analysis = this.generateAnalysis(sessionId, sessionData);
    callback(analysis);
  }

  // 分析結果生成
  private generateAnalysis(sessionId: string, sessionData: any): RealTimeLearningAnalysis {
    const { events, messages, voiceAnalyses, startTime, lastActivity } = sessionData;
    
    return {
      sessionId,
      timestamp: new Date(),
      behaviorAnalysis: this.analyzeBehavior(events, messages, startTime),
      comprehensionAnalysis: this.analyzeComprehension(messages, voiceAnalyses),
      emotionalAnalysis: this.analyzeEmotionalState(messages, voiceAnalyses),
      learningPatternAnalysis: this.analyzeLearningPatterns(events, messages, voiceAnalyses),
      immediateRecommendations: this.generateImmediateRecommendations(messages, voiceAnalyses, events),
      progressIndicators: this.analyzeProgress(sessionId, messages, events)
    };
  }

  // 行動分析
  private analyzeBehavior(events: LearningEvent[], messages: ChatMessage[], startTime: Date): any {
    const sessionDuration = (new Date().getTime() - startTime.getTime()) / 1000 / 60; // 分
    const messageCount = messages.length;
    const userMessages = messages.filter(m => m.sender === 'user');
    
    // 応答時間の計算
    const responseTimes: number[] = [];
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].sender === 'user' && messages[i-1].sender === 'ai') {
        const responseTime = (messages[i].timestamp.getTime() - messages[i-1].timestamp.getTime()) / 1000;
        responseTimes.push(responseTime);
      }
    }
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    const messageFrequency = sessionDuration > 0 ? messageCount / sessionDuration : 0;
    const averageMessageLength = userMessages.length > 0 
      ? userMessages.reduce((sum, msg) => sum + msg.text.length, 0) / userMessages.length 
      : 0;

    // 質問vs回答の比率
    const questions = userMessages.filter(msg => 
      msg.text.includes('？') || msg.text.includes('?') || msg.text.includes('どう') || msg.text.includes('なぜ')
    ).length;
    const questionToAnswerRatio = userMessages.length > 0 ? questions / userMessages.length : 0;

    // エンゲージメントレベル
    let engagementLevel: 'low' | 'medium' | 'high' = 'medium';
    if (messageFrequency > 3 && averageMessageLength > 20) {
      engagementLevel = 'high';
    } else if (messageFrequency < 1 || averageMessageLength < 10) {
      engagementLevel = 'low';
    }

    return {
      responseTime: averageResponseTime,
      messageFrequency,
      averageMessageLength,
      questionToAnswerRatio,
      engagementLevel
    };
  }

  // 超高精度理解度分析エンジン
  private analyzeComprehension(messages: ChatMessage[], voiceAnalyses: VoiceAnalysis[]): any {
    const userMessages = messages.filter(m => m.sender === 'user');
    const aiMessages = messages.filter(m => m.sender === 'ai');
    
    // 多層的概念理解評価
    const conceptualAnalysis = this.performDeepConceptualAnalysis(userMessages, aiMessages);
    
    // 手続き的流暢性の高精度評価
    const proceduralAnalysis = this.analyzeProceduralFluency(userMessages);
    
    // メタ認知的問題解決能力評価
    const metacognitiveAnalysis = this.analyzeMetacognitiveAbilities(userMessages);

    // 音声パターンからの深層理解度推定
    const voiceComprehensionAnalysis = this.analyzeVoiceComprehensionPatterns(voiceAnalyses);

    // 知識構造の詳細マッピング
    const knowledgeStructure = this.mapKnowledgeStructure(userMessages, aiMessages);
    
    // 学習転移能力の評価
    const transferAbility = this.evaluateTransferAbility(userMessages);

    return {
      conceptualUnderstanding: conceptualAnalysis.score,
      proceduralFluency: proceduralAnalysis.score,
      problemSolvingAbility: metacognitiveAnalysis.score,
      knowledgeGaps: knowledgeStructure.gaps,
      strengthAreas: knowledgeStructure.strengths,
      // 新規追加項目
      metacognitionLevel: metacognitiveAnalysis.metacognitionLevel,
      transferAbility: transferAbility,
      comprehensionDepth: conceptualAnalysis.depth,
      confidenceAlignment: this.assessConfidenceAlignment(userMessages, voiceAnalyses),
      learningEfficiency: this.calculateLearningEfficiency(userMessages, messages.length)
    };
  }
  
  // 深層概念理解分析
  private performDeepConceptualAnalysis(userMessages: ChatMessage[], aiMessages: ChatMessage[]) {
    const conceptualIndicators = {
      surface: ['覚えた', '暗記', '知ってる', '見たことある'],
      deep: ['なぜなら', 'つまり', 'ということは', '関連して', '応用すると'],
      connected: ['他の問題でも', '前に学んだ', '似ている', 'つながる', '共通点']
    };
    
    const surfaceScore = this.calculateKeywordScore(userMessages, conceptualIndicators.surface);
    const deepScore = this.calculateKeywordScore(userMessages, conceptualIndicators.deep);
    const connectedScore = this.calculateKeywordScore(userMessages, conceptualIndicators.connected);
    
    const depth = deepScore + connectedScore * 1.5; // 関連づけを重視
    const score = Math.min(1, (depth - surfaceScore * 0.5 + 0.3));
    
    return { score, depth };
  }
  
  // 手続き的流暢性の高精度分析
  private analyzeProceduralFluency(userMessages: ChatMessage[]) {
    const proceduralIndicators = {
      mastery: ['自動的に', 'すぐできる', '簡単', '迷わず'],
      developing: ['手順', 'ステップ', '順番', '方法'],
      struggling: ['どうやって', '手順がわからない', '混乱', '忘れた']
    };
    
    const masteryScore = this.calculateKeywordScore(userMessages, proceduralIndicators.mastery);
    const developingScore = this.calculateKeywordScore(userMessages, proceduralIndicators.developing);
    const strugglingScore = this.calculateKeywordScore(userMessages, proceduralIndicators.struggling);
    
    const score = Math.max(0, Math.min(1, masteryScore * 1.5 + developingScore - strugglingScore));
    
    return { score };
  }
  
  // メタ認知能力分析
  private analyzeMetacognitiveAbilities(userMessages: ChatMessage[]) {
    const metacognitiveIndicators = {
      monitoring: ['確認', 'チェック', '正しいかな', '間違えそう'],
      planning: ['まず', '次に', '最初に', '順序'],
      evaluation: ['振り返ると', '結果的に', '改善', '反省'],
      regulation: ['修正', '変更', '別の方法', '調整']
    };
    
    let metacognitionLevel = 0;
    Object.values(metacognitiveIndicators).forEach(indicators => {
      metacognitionLevel += this.calculateKeywordScore(userMessages, indicators);
    });
    
    const score = Math.min(1, metacognitionLevel / 4);
    
    return { score, metacognitionLevel };
  }
  
  // 音声パターン理解度分析
  private analyzeVoiceComprehensionPatterns(voiceAnalyses: VoiceAnalysis[]) {
    if (voiceAnalyses.length === 0) return 0.5;
    
    const recentAnalyses = voiceAnalyses.slice(-3); // 最新3つ
    const comprehensionTrend = recentAnalyses.map(va => va.comprehensionLevel);
    
    // トレンド分析
    let trendScore = 0;
    for (let i = 1; i < comprehensionTrend.length; i++) {
      if (comprehensionTrend[i] > comprehensionTrend[i-1]) trendScore += 0.2;
      else if (comprehensionTrend[i] < comprehensionTrend[i-1]) trendScore -= 0.1;
    }
    
    const averageComprehension = comprehensionTrend.reduce((sum, level) => sum + level, 0) / comprehensionTrend.length;
    return Math.max(0, Math.min(1, averageComprehension + trendScore));
  }
  
  // 知識構造マッピング
  private mapKnowledgeStructure(userMessages: ChatMessage[], aiMessages: ChatMessage[]) {
    const subjectAreas = {
      math: ['計算', '図形', '数式', '方程式', '確率', '統計'],
      science: ['実験', '観察', '仮説', '理論', '法則', '現象'],
      language: ['文法', '語彙', '表現', '読解', '作文', '漢字'],
      social: ['歴史', '地理', '政治', '経済', '文化', '社会']
    };
    
    const gaps: string[] = [];
    const strengths: string[] = [];
    
    Object.entries(subjectAreas).forEach(([subject, areas]) => {
      areas.forEach(area => {
        const confusionCount = userMessages.filter(msg => 
          msg.text.includes(area) && 
          (msg.text.includes('わからない') || msg.text.includes('難しい'))
        ).length;
        
        const masteryCount = userMessages.filter(msg => 
          msg.text.includes(area) && 
          (msg.text.includes('わかった') || msg.text.includes('できる'))
        ).length;
        
        if (confusionCount > masteryCount && confusionCount > 0) {
          gaps.push(`${subject}の${area}`);
        } else if (masteryCount > confusionCount && masteryCount > 1) {
          strengths.push(`${subject}の${area}`);
        }
      });
    });
    
    return { gaps, strengths };
  }
  
  // 学習転移能力評価
  private evaluateTransferAbility(userMessages: ChatMessage[]) {
    const transferIndicators = [
      '他の問題でも', '前に学んだことと', '似たような',
      '応用できる', '関連している', '共通点',
      'パターンが同じ', 'つながりがある'
    ];
    
    return this.calculateKeywordScore(userMessages, transferIndicators);
  }
  
  // 自信度と実力の一致度評価
  private assessConfidenceAlignment(userMessages: ChatMessage[], voiceAnalyses: VoiceAnalysis[]) {
    const confidenceWords = ['できる', 'わかった', '簡単', '自信'];
    const uncertaintyWords = ['たぶん', 'おそらく', 'よくわからない', '不安'];
    
    const expressedConfidence = this.calculateKeywordScore(userMessages, confidenceWords) - 
                               this.calculateKeywordScore(userMessages, uncertaintyWords);
    
    const voiceConfidence = voiceAnalyses.length > 0 
      ? voiceAnalyses.reduce((sum, va) => sum + va.confidence, 0) / voiceAnalyses.length
      : 0.5;
    
    // 自信度と実際の理解度の差を評価（小さいほど良い）
    const alignment = 1 - Math.abs(expressedConfidence - voiceConfidence);
    return Math.max(0, Math.min(1, alignment));
  }
  
  // 学習効率性計算
  private calculateLearningEfficiency(userMessages: ChatMessage[], totalMessages: number) {
    if (totalMessages === 0) return 0;
    
    const userMessageCount = userMessages.length;
    const comprehensionGains = userMessages.filter(msg => 
      msg.text.includes('わかった') || msg.text.includes('理解')
    ).length;
    
    // メッセージあたりの理解度向上率
    const efficiency = comprehensionGains / Math.max(1, userMessageCount);
    return Math.min(1, efficiency * 2); // 正規化
  }

  // 感情分析
  private analyzeEmotionalState(messages: ChatMessage[], voiceAnalyses: VoiceAnalysis[]): any {
    const userMessages = messages.filter(m => m.sender === 'user');
    
    // 感情キーワード分析
    const frustrationWords = ['いやだ', 'むずかしい', 'できない', 'わからない', 'つまらない'];
    const confidenceWords = ['できる', 'わかった', '簡単', '理解', '面白い'];
    const engagementWords = ['なるほど', 'そうか', '興味深い', 'すごい', 'おもしろい'];
    
    const frustrationScore = this.calculateKeywordScore(userMessages, frustrationWords);
    const confidenceScore = this.calculateKeywordScore(userMessages, confidenceWords);
    const engagementScore = this.calculateKeywordScore(userMessages, engagementWords);

    // 音声からの感情情報
    const voiceEmotions = voiceAnalyses.map(va => va.emotion);
    const dominantVoiceEmotion = this.getMostFrequent(voiceEmotions) || 'uncertain';

    // 現在の気分判定
    let currentMood: 'frustrated' | 'confused' | 'engaged' | 'confident' | 'bored' = 'confused';
    if (frustrationScore > 0.6) currentMood = 'frustrated';
    else if (confidenceScore > 0.6) currentMood = 'confident';
    else if (engagementScore > 0.6) currentMood = 'engaged';
    else if (frustrationScore < 0.1 && engagementScore < 0.1) currentMood = 'bored';

    // モチベーションレベル
    const motivationLevel = Math.max(0, Math.min(1, 
      (confidenceScore + engagementScore - frustrationScore + 1) / 2
    ));

    return {
      currentMood,
      motivationLevel,
      stressIndicators: frustrationScore > 0.5 ? ['高い困惑度', '学習困難'] : [],
      positiveIndicators: confidenceScore > 0.5 ? ['高い自信', '理解進展'] : []
    };
  }

  // 学習パターン分析
  private analyzeLearningPatterns(events: LearningEvent[], messages: ChatMessage[], voiceAnalyses: VoiceAnalysis[]): any {
    // 学習スタイルの推定
    const visualEvents = events.filter(e => e.type === 'image_uploaded' || e.type === 'handwriting_created').length;
    const auditoryEvents = events.filter(e => e.type === 'voice_input').length;
    const textEvents = messages.filter(m => m.sender === 'user').length;

    let learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed' = 'mixed';
    if (visualEvents > auditoryEvents && visualEvents > textEvents) learningStyle = 'visual';
    else if (auditoryEvents > visualEvents && auditoryEvents > textEvents) learningStyle = 'auditory';
    else if (textEvents > visualEvents && textEvents > auditoryEvents) learningStyle = 'kinesthetic';

    // 希望する複雑さレベル
    const userMessages = messages.filter(m => m.sender === 'user');
    const complexityIndicators = {
      simple: ['簡単', '基本', 'わかりやすく', '易しく'],
      complex: ['詳しく', '複雑', '応用', '発展', '深く']
    };
    
    const simpleScore = this.calculateKeywordScore(userMessages, complexityIndicators.simple);
    const complexScore = this.calculateKeywordScore(userMessages, complexityIndicators.complex);
    
    let preferredComplexity: 'simple' | 'moderate' | 'complex' = 'moderate';
    if (simpleScore > complexScore) preferredComplexity = 'simple';
    else if (complexScore > simpleScore) preferredComplexity = 'complex';

    // 注意力持続時間の推定
    const sessionLength = events.length > 0 
      ? (new Date().getTime() - events[0].timestamp.getTime()) / 1000 / 60 
      : 0;
    const attentionSpan = Math.min(sessionLength, 30); // 最大30分として推定

    return {
      learningStyle,
      preferredComplexity,
      attentionSpan,
      optimalSessionLength: attentionSpan * 1.2 // 20%マージンを追加
    };
  }

  // 超精密即座推奨アクションシステム
  private generateImmediateRecommendations(messages: ChatMessage[], voiceAnalyses: VoiceAnalysis[], events: LearningEvent[]): any {
    const recentMessages = messages.slice(-8); // より多くの履歴を分析
    const recentVoiceAnalyses = voiceAnalyses.slice(-3); // 音声の傾向分析
    
    // 多層的状況分析
    const situationAnalysis = this.analyzeLearningsituation(recentMessages, recentVoiceAnalyses, events);
    
    // 個別化推奨ルールエンジン
    const recommendations = this.applyPersonalizedRecommendationRules(situationAnalysis);
    
    // 動的優先度調整
    const prioritizedRecommendations = this.prioritizeRecommendations(recommendations, situationAnalysis);
    
    // 時系列パターン分析による予測的推奨
    const predictiveRecommendations = this.generatePredictiveRecommendations(messages, events);
    
    return {
      ...prioritizedRecommendations,
      predictiveActions: predictiveRecommendations,
      situationSeverity: situationAnalysis.severity,
      actionPriority: prioritizedRecommendations.actionPriority,
      contextualMessage: this.generateContextualMessage(situationAnalysis)
    };
  }
  
  // 学習状況の多次元分析
  private analyzeLearningSituation(recentMessages: ChatMessage[], recentVoiceAnalyses: VoiceAnalysis[], events: LearningEvent[]) {
    // 認知負荷分析
    const cognitiveLoad = this.assessCognitiveLoad(recentMessages);
    
    // 感情状態の時系列分析
    const emotionalTrajectory = this.analyzeEmotionalTrajectory(recentVoiceAnalyses, recentMessages);
    
    // 学習パフォーマンス傾向
    const performanceTrend = this.analyzePerformanceTrend(recentMessages);
    
    // 集中度の持続性分析
    const attentionPersistence = this.assessAttentionPersistence(events);
    
    // エンゲージメント深度
    const engagementDepth = this.measureEngagementDepth(recentMessages);
    
    // 総合状況深刻度
    const severity = this.calculateSituationSeverity(cognitiveLoad, emotionalTrajectory, performanceTrend);
    
    return {
      cognitiveLoad,
      emotionalTrajectory,
      performanceTrend,
      attentionPersistence,
      engagementDepth,
      severity
    };
  }
  
  // 認知負荷評価
  private assessCognitiveLoad(messages: ChatMessage[]) {
    const overloadIndicators = [
      '混乱', '複雑', 'たくさん', '一度に', '多すぎる',
      '覚えきれない', '情報が多い', 'ついていけない'
    ];
    
    const underloadIndicators = [
      '簡単すぎる', '退屈', 'つまらない', '物足りない', '易しい'
    ];
    
    const overload = this.calculateKeywordScore(messages.filter(m => m.sender === 'user'), overloadIndicators);
    const underload = this.calculateKeywordScore(messages.filter(m => m.sender === 'user'), underloadIndicators);
    
    return {
      level: overload > 0.3 ? 'high' : underload > 0.3 ? 'low' : 'optimal',
      score: overload - underload
    };
  }
  
  // 感情軌跡分析
  private analyzeEmotionalTrajectory(voiceAnalyses: VoiceAnalysis[], messages: ChatMessage[]) {
    if (voiceAnalyses.length === 0) {
      // テキストベースの感情分析にフォールバック
      return this.analyzeTextualEmotionalTrajectory(messages);
    }
    
    const emotionalStates = voiceAnalyses.map(va => va.emotion);
    const trajectory = this.calculateEmotionalTrend(emotionalStates);
    
    return {
      current: emotionalStates[emotionalStates.length - 1] || 'uncertain',
      trend: trajectory,
      volatility: this.calculateEmotionalVolatility(emotionalStates)
    };
  }
  
  // テキストベース感情軌跡分析
  private analyzeTextualEmotionalTrajectory(messages: ChatMessage[]) {
    const userMessages = messages.filter(m => m.sender === 'user');
    const emotionScores = userMessages.map(msg => this.scoreMessageEmotion(msg.text));
    
    const currentEmotion = emotionScores[emotionScores.length - 1] || 'neutral';
    const trend = this.calculateEmotionalTrend(emotionScores);
    
    return {
      current: currentEmotion,
      trend,
      volatility: this.calculateEmotionalVolatility(emotionScores)
    };
  }
  
  // メッセージの感情スコア化
  private scoreMessageEmotion(text: string): string {
    const emotionPatterns = {
      frustrated: ['いやだ', 'むかつく', '嫌', '面倒', '疲れた'],
      confused: ['わからない', '意味不明', '理解できない', '混乱'],
      engaged: ['面白い', '楽しい', '興味', 'なるほど'],
      confident: ['できる', '簡単', 'わかった', '理解']
    };
    
    let maxScore = 0;
    let dominantEmotion = 'neutral';
    
    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      const score = patterns.reduce((sum, pattern) => 
        sum + (text.includes(pattern) ? 1 : 0), 0);
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    });
    
    return dominantEmotion;
  }
  
  // 個別化推奨ルール適用
  private applyPersonalizedRecommendationRules(situation: any) {
    const rules = {
      shouldTakeBreak: this.shouldRecommendBreak(situation),
      shouldSimplifyExplanation: this.shouldSimplifyExplanation(situation),
      shouldProvideEncouragement: this.shouldProvideEncouragement(situation),
      shouldOfferHint: this.shouldOfferHint(situation),
      shouldSwitchTopic: this.shouldSwitchTopic(situation),
      shouldIncreaseChallenge: this.shouldIncreaseChallenge(situation),
      shouldProvideVisualAid: this.shouldProvideVisualAid(situation),
      shouldFocusOnMetacognition: this.shouldFocusOnMetacognition(situation)
    };
    
    return rules;
  }
  
  // ブレイク推奨判定（高度化）
  private shouldRecommendBreak(situation: any): boolean {
    return (
      situation.attentionPersistence < 0.3 ||
      situation.emotionalTrajectory.current === 'frustrated' ||
      situation.cognitiveLoad.level === 'high'
    );
  }
  
  // 説明簡略化判定
  private shouldSimplifyExplanation(situation: any): boolean {
    return (
      situation.cognitiveLoad.level === 'high' ||
      situation.performanceTrend === 'declining' ||
      situation.emotionalTrajectory.current === 'confused'
    );
  }
  
  // 励まし提供判定
  private shouldProvideEncouragement(situation: any): boolean {
    return (
      situation.emotionalTrajectory.current === 'frustrated' ||
      situation.emotionalTrajectory.trend === 'declining' ||
      situation.performanceTrend === 'struggling'
    );
  }
  
  // ヒント提供判定
  private shouldOfferHint(situation: any): boolean {
    return (
      situation.engagementDepth < 0.4 ||
      situation.performanceTrend === 'stagnant'
    );
  }
  
  // トピック変更判定
  private shouldSwitchTopic(situation: any): boolean {
    return (
      situation.severity > 0.7 ||
      (situation.emotionalTrajectory.current === 'bored' && situation.cognitiveLoad.level === 'low')
    );
  }
  
  // チャレンジ増加判定
  private shouldIncreaseChallenge(situation: any): boolean {
    return (
      situation.cognitiveLoad.level === 'low' ||
      situation.performanceTrend === 'excelling'
    );
  }
  
  // 視覚補助判定
  private shouldProvideVisualAid(situation: any): boolean {
    return situation.cognitiveLoad.level === 'high' && situation.performanceTrend === 'struggling';
  }
  
  // メタ認知集中判定
  private shouldFocusOnMetacognition(situation: any): boolean {
    return situation.performanceTrend === 'inconsistent';
  }
  
  // 状況深刻度計算
  private calculateSituationSeverity(cognitiveLoad: any, emotionalTrajectory: any, performanceTrend: string): number {
    let severity = 0;
    
    if (cognitiveLoad.level === 'high') severity += 0.3;
    if (emotionalTrajectory.current === 'frustrated') severity += 0.4;
    if (performanceTrend === 'declining') severity += 0.3;
    if (emotionalTrajectory.volatility > 0.5) severity += 0.2;
    
    return Math.min(1, severity);
  }
  
  // コンテキスト的メッセージ生成
  private generateContextualMessage(situation: any): string {
    if (situation.severity > 0.7) {
      return '学習が少し大変そうですね。一緒にペースを調整しながら進めていきましょう。';
    } else if (situation.cognitiveLoad.level === 'low') {
      return 'とても良く理解できていますね！もう少し発展的な内容にチャレンジしてみませんか？';
    } else if (situation.emotionalTrajectory.current === 'engaged') {
      return 'とても積極的に学習に取り組んでいますね。この調子で頑張りましょう！';
    } else {
      return '着実に理解を深めていますね。一歩一歩確実に進んでいきましょう。';
    }
  }
  
  // その他のヘルパーメソッド（簡略化）
  private calculateEmotionalTrend(emotions: any[]): string {
    // 感情の傾向を計算する簡単な実装
    return emotions.length > 1 ? 'stable' : 'insufficient_data';
  }
  
  private calculateEmotionalVolatility(emotions: any[]): number {
    // 感情の変動性を計算する簡単な実装
    return emotions.length > 2 ? 0.5 : 0;
  }
  
  private analyzePerformanceTrend(messages: ChatMessage[]): string {
    // パフォーマンス傾向の簡単な実装
    const userMessages = messages.filter(m => m.sender === 'user');
    return userMessages.length > 3 ? 'stable' : 'insufficient_data';
  }
  
  private assessAttentionPersistence(events: LearningEvent[]): number {
    // 注意持続力の簡単な実装
    return events.length > 0 ? 0.7 : 0.5;
  }
  
  private measureEngagementDepth(messages: ChatMessage[]): number {
    // エンゲージメント深度の簡単な実装
    const userMessages = messages.filter(m => m.sender === 'user');
    return userMessages.length > 0 ? 0.6 : 0.3;
  }
  
  private prioritizeRecommendations(recommendations: any, situation: any): any {
    // 推奨の優先度付け（簡略化）
    return {
      ...recommendations,
      actionPriority: situation.severity > 0.5 ? 'high' : 'normal'
    };
  }
  
  private generatePredictiveRecommendations(messages: ChatMessage[], events: LearningEvent[]): any {
    // 予測的推奨（簡略化）
    return {
      likelyNeedBreakIn: 15, // 分
      suggestedNextTopic: 'review',
      estimatedDifficultyAdjustment: 0
    };
  }

  // 進歩分析
  private analyzeProgress(sessionId: string, messages: ChatMessage[], events: LearningEvent[]): any {
    // セッション内での進歩
    const userMessages = messages.filter(m => m.sender === 'user');
    const earlyMessages = userMessages.slice(0, Math.floor(userMessages.length / 2));
    const lateMessages = userMessages.slice(Math.floor(userMessages.length / 2));
    
    const earlyComprehension = this.calculateComprehensionScore(earlyMessages);
    const lateComprehension = this.calculateComprehensionScore(lateMessages);
    const currentSessionProgress = Math.max(0, Math.min(1, lateComprehension - earlyComprehension + 0.5));

    // 信頼度トレンド
    const confidenceWords = ['わかった', 'できる', '理解', '簡単'];
    const earlyConfidence = this.calculateKeywordScore(earlyMessages, confidenceWords);
    const lateConfidence = this.calculateKeywordScore(lateMessages, confidenceWords);
    
    let confidenceTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (lateConfidence > earlyConfidence + 0.1) confidenceTrend = 'increasing';
    else if (lateConfidence < earlyConfidence - 0.1) confidenceTrend = 'decreasing';

    return {
      improvementFromLastSession: 0, // 前回セッションとの比較は別途実装
      currentSessionProgress,
      confidenceTrend,
      skillDevelopmentAreas: ['論理的思考', '問題解決', '表現力'] // 動的に決定
    };
  }

  // ヘルパーメソッド
  private calculateKeywordScore(messages: ChatMessage[], keywords: string[]): number {
    if (messages.length === 0) return 0;
    
    const totalWords = messages.reduce((sum, msg) => sum + msg.text.split(' ').length, 0);
    if (totalWords === 0) return 0;
    
    const keywordCount = messages.reduce((sum, msg) => {
      return sum + keywords.reduce((keywordSum, keyword) => {
        return keywordSum + (msg.text.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);
    }, 0);
    
    return Math.min(1, keywordCount / totalWords * 10); // 正規化
  }

  private calculateComprehensionScore(messages: ChatMessage[]): number {
    const comprehensionKeywords = ['わかった', '理解', 'なるほど', 'そうか'];
    return this.calculateKeywordScore(messages, comprehensionKeywords);
  }

  private identifyKnowledgeGaps(messages: ChatMessage[], confusionKeywords: string[]): string[] {
    const gaps: string[] = [];
    messages.forEach(msg => {
      confusionKeywords.forEach(keyword => {
        if (msg.text.includes(keyword)) {
          // 文脈から知識ギャップを推定
          if (msg.text.includes('計算')) gaps.push('計算手順');
          if (msg.text.includes('公式')) gaps.push('公式の適用');
          if (msg.text.includes('図形')) gaps.push('図形の性質');
          if (msg.text.includes('文章')) gaps.push('読解力');
        }
      });
    });
    return [...new Set(gaps)]; // 重複除去
  }

  private identifyStrengthAreas(messages: ChatMessage[], strengthKeywords: string[]): string[] {
    const strengths: string[] = [];
    messages.forEach(msg => {
      strengthKeywords.forEach(keyword => {
        if (msg.text.includes(keyword)) {
          // 文脈から強い分野を推定
          if (msg.text.includes('計算')) strengths.push('計算能力');
          if (msg.text.includes('理解')) strengths.push('概念理解');
          if (msg.text.includes('解法')) strengths.push('問題解決');
        }
      });
    });
    return [...new Set(strengths)];
  }

  private getMostFrequent<T>(array: T[]): T | null {
    if (array.length === 0) return null;
    
    const frequency: { [key: string]: number } = {};
    array.forEach(item => {
      const key = String(item);
      frequency[key] = (frequency[key] || 0) + 1;
    });
    
    const maxKey = Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b
    );
    
    return array.find(item => String(item) === maxKey) || null;
  }
}

// シングルトンインスタンス
export const realTimeLearningAnalyzer = new RealTimeLearningAnalyzer();