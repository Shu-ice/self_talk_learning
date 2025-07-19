import { ChatMessage, LearningSession } from '../types';
import { VoiceAnalysis } from './speechRecognitionService';
import { RealTimeLearningAnalysis } from './realTimeLearningAnalyzer';

// 録画されたイベントの種類
export interface RecordedEvent {
  id: string;
  type: 'message' | 'voice_analysis' | 'learning_analysis' | 'handwriting' | 'image_upload' | 'break' | 'hint_request';
  timestamp: Date;
  data: any;
  sessionId: string;
  metadata?: {
    emotionalState?: string;
    comprehensionLevel?: number;
    engagementLevel?: string;
  };
}

// 録画されたセッション
export interface RecordedSession {
  id: string;
  sessionId: string;
  subjectId: string;
  topicId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // 秒
  events: RecordedEvent[];
  summary: SessionSummary;
  learningOutcomes: LearningOutcome[];
  keyMoments: KeyMoment[];
}

// セッション要約
export interface SessionSummary {
  totalMessages: number;
  totalProblems: number;
  problemsSolved: number;
  averageResponseTime: number;
  engagementLevels: {
    high: number; // 割合
    medium: number;
    low: number;
  };
  emotionalProgression: {
    start: string;
    middle: string;
    end: string;
  };
  comprehensionProgression: {
    start: number;
    peak: number;
    end: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

// 学習成果
export interface LearningOutcome {
  concept: string;
  masteryLevel: 'learning' | 'practicing' | 'mastered';
  evidence: string[];
  timestamp: Date;
}

// 重要な瞬間
export interface KeyMoment {
  id: string;
  timestamp: Date;
  type: 'breakthrough' | 'struggle' | 'insight' | 'confusion' | 'achievement';
  description: string;
  context: RecordedEvent[];
  significance: 'high' | 'medium' | 'low';
}

// 再生オプション
export interface PlaybackOptions {
  speed: 0.5 | 1 | 1.5 | 2;
  showAnalysis: boolean;
  showEmotions: boolean;
  showThoughts: boolean;
  filterEventTypes?: string[];
  startTime?: Date;
  endTime?: Date;
}

class SessionRecorderService {
  private recordings: Map<string, RecordedSession> = new Map();
  private activeRecording: RecordedSession | null = null;
  private isRecording: boolean = false;

  // 録画開始
  public startRecording(sessionId: string, subjectId: string, topicId: string): void {
    const recording: RecordedSession = {
      id: `recording_${Date.now()}_${Math.random()}`,
      sessionId,
      subjectId,
      topicId,
      startTime: new Date(),
      events: [],
      summary: this.createEmptySummary(),
      learningOutcomes: [],
      keyMoments: []
    };

    this.activeRecording = recording;
    this.isRecording = true;
    this.recordings.set(recording.id, recording);

    console.log(`学習セッション録画開始: ${recording.id}`);
  }

  // 録画停止
  public stopRecording(): RecordedSession | null {
    if (!this.activeRecording || !this.isRecording) return null;

    this.activeRecording.endTime = new Date();
    this.activeRecording.duration = (this.activeRecording.endTime.getTime() - this.activeRecording.startTime.getTime()) / 1000;

    // セッション要約を生成
    this.activeRecording.summary = this.generateSessionSummary(this.activeRecording);
    
    // 学習成果を分析
    this.activeRecording.learningOutcomes = this.analyzeLearningOutcomes(this.activeRecording);
    
    // 重要な瞬間を特定
    this.activeRecording.keyMoments = this.identifyKeyMoments(this.activeRecording);

    const completedRecording = { ...this.activeRecording };
    this.isRecording = false;
    this.activeRecording = null;

    console.log(`学習セッション録画終了: ${completedRecording.id}`);
    return completedRecording;
  }

  // イベント記録
  public recordEvent(event: Omit<RecordedEvent, 'id'>): void {
    if (!this.isRecording || !this.activeRecording) return;

    const recordedEvent: RecordedEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random()}`
    };

    this.activeRecording.events.push(recordedEvent);
  }

  // メッセージ記録
  public recordMessage(message: ChatMessage, sessionId: string): void {
    this.recordEvent({
      type: 'message',
      timestamp: message.timestamp,
      data: { message },
      sessionId,
      metadata: {
        emotionalState: this.inferEmotionalState(message.text),
        comprehensionLevel: this.inferComprehensionLevel(message.text)
      }
    });
  }

  // 音声分析記録
  public recordVoiceAnalysis(analysis: VoiceAnalysis, sessionId: string): void {
    this.recordEvent({
      type: 'voice_analysis',
      timestamp: new Date(),
      data: { analysis },
      sessionId,
      metadata: {
        emotionalState: analysis.emotion,
        comprehensionLevel: analysis.comprehensionLevel
      }
    });
  }

  // 学習分析記録
  public recordLearningAnalysis(analysis: RealTimeLearningAnalysis, sessionId: string): void {
    this.recordEvent({
      type: 'learning_analysis',
      timestamp: analysis.timestamp,
      data: { analysis },
      sessionId,
      metadata: {
        emotionalState: analysis.emotionalAnalysis.currentMood,
        comprehensionLevel: analysis.comprehensionAnalysis.conceptualUnderstanding,
        engagementLevel: analysis.behaviorAnalysis.engagementLevel
      }
    });
  }

  // 全ての録画セッションを取得
  public getAllRecordings(): RecordedSession[] {
    return Array.from(this.recordings.values()).sort((a, b) => 
      b.startTime.getTime() - a.startTime.getTime()
    );
  }

  // 特定の録画を取得
  public getRecording(id: string): RecordedSession | null {
    return this.recordings.get(id) || null;
  }

  // 教科別の録画を取得
  public getRecordingsBySubject(subjectId: string): RecordedSession[] {
    return this.getAllRecordings().filter(recording => recording.subjectId === subjectId);
  }

  // セッション要約生成
  private generateSessionSummary(recording: RecordedSession): SessionSummary {
    const messageEvents = recording.events.filter(e => e.type === 'message');
    const userMessages = messageEvents.filter(e => e.data.message.sender === 'user');
    const aiMessages = messageEvents.filter(e => e.data.message.sender === 'ai');

    // 応答時間計算
    const responseTimes: number[] = [];
    for (let i = 1; i < messageEvents.length; i++) {
      const prev = messageEvents[i - 1];
      const curr = messageEvents[i];
      if (prev.data.message.sender === 'ai' && curr.data.message.sender === 'user') {
        const responseTime = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000;
        responseTimes.push(responseTime);
      }
    }

    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    // エンゲージメントレベル分析
    const learningAnalyses = recording.events
      .filter(e => e.type === 'learning_analysis')
      .map(e => e.metadata?.engagementLevel);

    const engagementCounts = {
      high: learningAnalyses.filter(level => level === 'high').length,
      medium: learningAnalyses.filter(level => level === 'medium').length,
      low: learningAnalyses.filter(level => level === 'low').length
    };

    const total = learningAnalyses.length;
    const engagementLevels = {
      high: total > 0 ? engagementCounts.high / total : 0,
      medium: total > 0 ? engagementCounts.medium / total : 0,
      low: total > 0 ? engagementCounts.low / total : 0
    };

    // 感情の推移
    const emotionalStates = recording.events
      .filter(e => e.metadata?.emotionalState)
      .map(e => ({ emotion: e.metadata!.emotionalState!, timestamp: e.timestamp }));

    const emotionalProgression = {
      start: emotionalStates[0]?.emotion || 'neutral',
      middle: emotionalStates[Math.floor(emotionalStates.length / 2)]?.emotion || 'neutral',
      end: emotionalStates[emotionalStates.length - 1]?.emotion || 'neutral'
    };

    // 理解度の推移
    const comprehensionLevels = recording.events
      .filter(e => e.metadata?.comprehensionLevel !== undefined)
      .map(e => e.metadata!.comprehensionLevel!);

    const comprehensionProgression = {
      start: comprehensionLevels[0] || 0.5,
      peak: Math.max(...comprehensionLevels, 0.5),
      end: comprehensionLevels[comprehensionLevels.length - 1] || 0.5
    };

    return {
      totalMessages: messageEvents.length,
      totalProblems: this.countProblems(aiMessages),
      problemsSolved: this.countSolvedProblems(userMessages),
      averageResponseTime,
      engagementLevels,
      emotionalProgression,
      comprehensionProgression,
      strengths: this.identifyStrengths(recording),
      challenges: this.identifyChallenges(recording),
      recommendations: this.generateRecommendations(recording)
    };
  }

  // 学習成果分析
  private analyzeLearningOutcomes(recording: RecordedSession): LearningOutcome[] {
    const outcomes: LearningOutcome[] = [];
    const messageEvents = recording.events.filter(e => e.type === 'message');

    // 概念理解の証拠を探す
    const conceptKeywords = {
      '計算手順': ['順番', '手順', 'ステップ', '計算方法'],
      '公式理解': ['公式', '式', '定理', '法則'],
      '図形認識': ['図形', '角度', '面積', '体積', '形'],
      '読解力': ['文章', '意味', '内容', '理解', '解釈'],
      '論理思考': ['理由', '根拠', '論理', '推論', '証明']
    };

    Object.entries(conceptKeywords).forEach(([concept, keywords]) => {
      const evidence = messageEvents
        .filter(e => e.data.message.sender === 'user')
        .filter(e => keywords.some(keyword => e.data.message.text.includes(keyword)))
        .map(e => e.data.message.text);

      if (evidence.length > 0) {
        const masteryLevel: 'learning' | 'practicing' | 'mastered' = 
          evidence.length >= 3 ? 'mastered' : 
          evidence.length >= 2 ? 'practicing' : 'learning';

        outcomes.push({
          concept,
          masteryLevel,
          evidence: evidence.slice(0, 3), // 最初の3つの証拠
          timestamp: new Date()
        });
      }
    });

    return outcomes;
  }

  // 重要な瞬間の特定
  private identifyKeyMoments(recording: RecordedSession): KeyMoment[] {
    const moments: KeyMoment[] = [];
    const events = recording.events;

    // ブレークスルーの瞬間
    const breakthroughs = events.filter(e => 
      e.type === 'message' && 
      e.data.message.sender === 'user' &&
      (e.data.message.text.includes('わかった') || 
       e.data.message.text.includes('そうか') ||
       e.data.message.text.includes('理解できた'))
    );

    breakthroughs.forEach(event => {
      moments.push({
        id: `moment_${event.id}`,
        timestamp: event.timestamp,
        type: 'breakthrough',
        description: 'ブレークスルー：理解が深まった瞬間',
        context: this.getContextEvents(events, event.timestamp, 2),
        significance: 'high'
      });
    });

    // 困難な瞬間
    const struggles = events.filter(e => 
      e.type === 'message' && 
      e.data.message.sender === 'user' &&
      (e.data.message.text.includes('わからない') || 
       e.data.message.text.includes('難しい') ||
       e.data.message.text.includes('困る'))
    );

    struggles.forEach(event => {
      moments.push({
        id: `moment_${event.id}`,
        timestamp: event.timestamp,
        type: 'struggle',
        description: '困難：理解に苦労した瞬間',
        context: this.getContextEvents(events, event.timestamp, 2),
        significance: 'medium'
      });
    });

    return moments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // ヘルパーメソッド
  private createEmptySummary(): SessionSummary {
    return {
      totalMessages: 0,
      totalProblems: 0,
      problemsSolved: 0,
      averageResponseTime: 0,
      engagementLevels: { high: 0, medium: 0, low: 0 },
      emotionalProgression: { start: 'neutral', middle: 'neutral', end: 'neutral' },
      comprehensionProgression: { start: 0.5, peak: 0.5, end: 0.5 },
      strengths: [],
      challenges: [],
      recommendations: []
    };
  }

  private inferEmotionalState(text: string): string {
    if (text.includes('楽しい') || text.includes('面白い')) return 'excited';
    if (text.includes('わからない') || text.includes('困る')) return 'confused';
    if (text.includes('できた') || text.includes('わかった')) return 'confident';
    if (text.includes('難しい') || text.includes('むずかしい')) return 'frustrated';
    return 'neutral';
  }

  private inferComprehensionLevel(text: string): number {
    if (text.includes('完全に理解') || text.includes('よく分かった')) return 0.9;
    if (text.includes('わかった') || text.includes('理解')) return 0.7;
    if (text.includes('なんとなく') || text.includes('少し')) return 0.5;
    if (text.includes('わからない') || text.includes('難しい')) return 0.3;
    return 0.5;
  }

  private countProblems(aiMessages: RecordedEvent[]): number {
    return aiMessages.filter(e => 
      e.data.message.text.includes('問題') || 
      e.data.message.text.includes('？') ||
      e.data.message.text.includes('?')
    ).length;
  }

  private countSolvedProblems(userMessages: RecordedEvent[]): number {
    return userMessages.filter(e => 
      e.data.message.text.includes('答え') || 
      e.data.message.text.length > 20 // 長い回答は解答とみなす
    ).length;
  }

  private identifyStrengths(recording: RecordedSession): string[] {
    const strengths: string[] = [];
    const outcomes = recording.learningOutcomes || [];
    
    outcomes.forEach(outcome => {
      if (outcome.masteryLevel === 'mastered') {
        strengths.push(outcome.concept);
      }
    });

    return strengths;
  }

  private identifyChallenges(recording: RecordedSession): string[] {
    const challenges: string[] = [];
    const struggles = recording.keyMoments?.filter(m => m.type === 'struggle') || [];
    
    struggles.forEach(struggle => {
      challenges.push(struggle.description);
    });

    return [...new Set(challenges)];
  }

  private generateRecommendations(recording: RecordedSession): string[] {
    const recommendations: string[] = [];
    const summary = recording.summary;

    if (summary.engagementLevels.low > 0.3) {
      recommendations.push('学習時間を短くして集中力を高めましょう');
    }

    if (summary.comprehensionProgression.end < summary.comprehensionProgression.start) {
      recommendations.push('基礎概念の復習をおすすめします');
    }

    if (summary.averageResponseTime > 60) {
      recommendations.push('考える時間を十分に取れています。この調子で続けましょう');
    }

    return recommendations;
  }

  private getContextEvents(events: RecordedEvent[], timestamp: Date, contextSize: number): RecordedEvent[] {
    const eventIndex = events.findIndex(e => e.timestamp.getTime() === timestamp.getTime());
    const start = Math.max(0, eventIndex - contextSize);
    const end = Math.min(events.length, eventIndex + contextSize + 1);
    
    return events.slice(start, end);
  }

  // 録画の削除
  public deleteRecording(id: string): boolean {
    return this.recordings.delete(id);
  }

  // 録画の保存（ローカルストレージ）
  public saveToLocalStorage(): void {
    const recordingsArray = Array.from(this.recordings.entries());
    localStorage.setItem('session_recordings', JSON.stringify(recordingsArray));
  }

  // 録画の読み込み（ローカルストレージ）
  public loadFromLocalStorage(): void {
    const stored = localStorage.getItem('session_recordings');
    if (stored) {
      try {
        const recordingsArray = JSON.parse(stored);
        this.recordings = new Map(recordingsArray);
      } catch (error) {
        console.error('録画データの読み込みに失敗:', error);
      }
    }
  }
}

// シングルトンインスタンス
export const sessionRecorderService = new SessionRecorderService();