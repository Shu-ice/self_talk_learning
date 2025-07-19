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

// 学習行動のイベント
export interface LearningEvent {
  type: 'message_sent' | 'voice_input' | 'image_uploaded' | 'handwriting_created' | 'pause_detected';
  timestamp: Date;
  data: any;
  sessionId: string;
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

  // 理解度分析
  private analyzeComprehension(messages: ChatMessage[], voiceAnalyses: VoiceAnalysis[]): any {
    const userMessages = messages.filter(m => m.sender === 'user');
    
    // 概念的理解の評価
    const conceptualKeywords = ['理解', 'わかった', 'なるほど', '意味', '概念', '原理'];
    const conceptualScore = this.calculateKeywordScore(userMessages, conceptualKeywords);
    
    // 手続き的流暢性の評価
    const proceduralKeywords = ['計算', '手順', '方法', 'やり方', 'ステップ', '解法'];
    const proceduralScore = this.calculateKeywordScore(userMessages, proceduralKeywords);
    
    // 問題解決能力の評価
    const problemSolvingKeywords = ['考える', '分析', '推理', '判断', '比較', '結論'];
    const problemSolvingScore = this.calculateKeywordScore(userMessages, problemSolvingKeywords);

    // 音声分析からの理解度情報
    const voiceComprehensionScore = voiceAnalyses.length > 0
      ? voiceAnalyses.reduce((sum, va) => sum + va.comprehensionLevel, 0) / voiceAnalyses.length
      : 0.5;

    // 知識ギャップの特定
    const confusionKeywords = ['わからない', '難しい', '迷う', '困る', '理解できない'];
    const knowledgeGaps = this.identifyKnowledgeGaps(userMessages, confusionKeywords);
    
    // 強い分野の特定
    const strengthKeywords = ['簡単', 'できる', '得意', 'わかる', '理解'];
    const strengthAreas = this.identifyStrengthAreas(userMessages, strengthKeywords);

    return {
      conceptualUnderstanding: Math.min(1, (conceptualScore + voiceComprehensionScore) / 2),
      proceduralFluency: proceduralScore,
      problemSolvingAbility: problemSolvingScore,
      knowledgeGaps,
      strengthAreas
    };
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

  // 即座推奨アクション生成
  private generateImmediateRecommendations(messages: ChatMessage[], voiceAnalyses: VoiceAnalysis[], events: LearningEvent[]): any {
    const recentMessages = messages.slice(-5); // 最近5メッセージ
    const recentVoiceAnalysis = voiceAnalyses.slice(-1)[0]; // 最新の音声分析
    
    // 休憩推奨
    const sessionDuration = events.length > 0 
      ? (new Date().getTime() - events[0].timestamp.getTime()) / 1000 / 60 
      : 0;
    const shouldTakeBreak = sessionDuration > 25; // 25分以上

    // 説明簡略化推奨
    const confusionIndicators = recentMessages.filter(m => 
      m.sender === 'user' && (m.text.includes('わからない') || m.text.includes('難しい'))
    ).length;
    const shouldSimplifyExplanation = confusionIndicators >= 2;

    // 励まし推奨
    const shouldProvideEncouragement = recentVoiceAnalysis?.emotion === 'frustrated' || 
      recentMessages.some(m => m.text.includes('できない') || m.text.includes('いやだ'));

    // ヒント提供推奨
    const shouldOfferHint = recentMessages.filter(m => 
      m.sender === 'user' && m.text.length < 10
    ).length >= 3; // 短い返答が続く場合

    // トピック変更推奨
    const shouldSwitchTopic = shouldTakeBreak && confusionIndicators >= 3;

    // カスタムメッセージ
    let customMessage;
    if (shouldProvideEncouragement) {
      customMessage = '一緒に考えていきましょう。少しずつでも理解が深まっています。';
    } else if (shouldSimplifyExplanation) {
      customMessage = 'もう少し簡単に説明し直しますね。';
    } else if (shouldOfferHint) {
      customMessage = 'ヒントが必要でしたら、遠慮なく聞いてくださいね。';
    }

    return {
      shouldTakeBreak,
      shouldSimplifyExplanation,
      shouldProvideEncouragement,
      shouldOfferHint,
      shouldSwitchTopic,
      customMessage
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