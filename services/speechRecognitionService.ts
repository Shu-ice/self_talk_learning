// 音声認識の設定とサービス
export interface SpeechRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

export interface VoiceAnalysis {
  emotion: 'confident' | 'uncertain' | 'confused' | 'excited' | 'frustrated';
  speakingPace: 'slow' | 'normal' | 'fast';
  hesitationCount: number;
  thinkingWords: string[]; // 「えーと」「あの」など
  keyPhrasesDetected: string[];
  comprehensionLevel: number; // 0-1の理解度推定
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((result: SpeechResult) => void) | null = null;
  private onAnalysisCallback: ((analysis: VoiceAnalysis) => void) | null = null;
  private currentTranscript: string = '';
  private sessionStartTime: Date = new Date();
  private voiceData: {
    transcripts: string[];
    timestamps: Date[];
    confidences: number[];
  } = { transcripts: [], timestamps: [], confidences: [] };

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    // ブラウザサポートチェック
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('このブラウザは音声認識をサポートしていません');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // 設定
    this.recognition.lang = 'ja-JP';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;

    // イベントハンドラー設定
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.sessionStartTime = new Date();
      this.voiceData = { transcripts: [], timestamps: [], confidences: [] };
      console.log('音声認識開始');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('音声認識終了');
      
      // セッション全体の分析
      if (this.onAnalysisCallback) {
        const analysis = this.analyzeVoiceSession();
        this.onAnalysisCallback(analysis);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('音声認識エラー:', event.error);
      this.isListening = false;
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // 結果を処理
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.5;

        if (result.isFinal) {
          finalTranscript += transcript;
          this.voiceData.transcripts.push(transcript);
          this.voiceData.timestamps.push(new Date());
          this.voiceData.confidences.push(confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      // 最終結果の処理
      if (finalTranscript && this.onResultCallback) {
        const speechResult: SpeechResult = {
          transcript: finalTranscript.trim(),
          confidence: this.voiceData.confidences[this.voiceData.confidences.length - 1] || 0.5,
          isFinal: true,
          timestamp: new Date()
        };
        this.onResultCallback(speechResult);
        this.currentTranscript += finalTranscript;
      }

      // 中間結果の処理
      if (interimTranscript && this.onResultCallback) {
        const speechResult: SpeechResult = {
          transcript: interimTranscript.trim(),
          confidence: 0.5,
          isFinal: false,
          timestamp: new Date()
        };
        this.onResultCallback(speechResult);
      }
    };
  }

  // 音声認識開始
  public startListening(
    onResult: (result: SpeechResult) => void,
    onAnalysis?: (analysis: VoiceAnalysis) => void
  ): boolean {
    if (!this.recognition) {
      console.error('音声認識が利用できません');
      return false;
    }

    if (this.isListening) {
      console.warn('既に音声認識中です');
      return false;
    }

    this.onResultCallback = onResult;
    this.onAnalysisCallback = onAnalysis;
    this.currentTranscript = '';

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('音声認識開始エラー:', error);
      return false;
    }
  }

  // 音声認識停止
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // 音声認識状態取得
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // 音声セッション分析
  private analyzeVoiceSession(): VoiceAnalysis {
    const fullTranscript = this.voiceData.transcripts.join(' ');
    
    // 感情分析
    const emotion = this.detectEmotion(fullTranscript);
    
    // 話すペース分析
    const speakingPace = this.analyzeSpeakingPace();
    
    // 迷いの分析
    const hesitationCount = this.countHesitations(fullTranscript);
    const thinkingWords = this.extractThinkingWords(fullTranscript);
    
    // キーフレーズ検出
    const keyPhrasesDetected = this.detectKeyPhrases(fullTranscript);
    
    // 理解度推定
    const comprehensionLevel = this.estimateComprehension(fullTranscript, this.voiceData.confidences);

    return {
      emotion,
      speakingPace,
      hesitationCount,
      thinkingWords,
      keyPhrasesDetected,
      comprehensionLevel
    };
  }

  // 感情検出
  private detectEmotion(transcript: string): VoiceAnalysis['emotion'] {
    const confidentWords = ['わかった', '理解できた', '簡単', 'できる', 'そうか'];
    const uncertainWords = ['わからない', 'むずかしい', '迷う', 'どうしよう'];
    const confusedWords = ['え？', 'あれ？', '意味が', 'なんで'];
    const excitedWords = ['すごい', 'おもしろい', 'やった', 'できた'];
    const frustratedWords = ['だめだ', 'うまくいかない', 'いやだ', 'つらい'];

    const confidentCount = this.countWordsInText(transcript, confidentWords);
    const uncertainCount = this.countWordsInText(transcript, uncertainWords);
    const confusedCount = this.countWordsInText(transcript, confusedWords);
    const excitedCount = this.countWordsInText(transcript, excitedWords);
    const frustratedCount = this.countWordsInText(transcript, frustratedWords);

    const scores = {
      confident: confidentCount,
      uncertain: uncertainCount,
      confused: confusedCount,
      excited: excitedCount,
      frustrated: frustratedCount
    };

    // 最も高いスコアの感情を返す
    const maxEmotion = Object.keys(scores).reduce((a, b) => 
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    ) as VoiceAnalysis['emotion'];

    return maxEmotion;
  }

  // 話すペース分析
  private analyzeSpeakingPace(): VoiceAnalysis['speakingPace'] {
    if (this.voiceData.transcripts.length === 0) return 'normal';

    const totalDuration = (new Date().getTime() - this.sessionStartTime.getTime()) / 1000;
    const totalWords = this.voiceData.transcripts.join(' ').split(' ').length;
    const wordsPerSecond = totalWords / totalDuration;

    if (wordsPerSecond < 1.5) return 'slow';
    if (wordsPerSecond > 3) return 'fast';
    return 'normal';
  }

  // 迷いの回数をカウント
  private countHesitations(transcript: string): number {
    const hesitationPatterns = ['えーと', 'あの', 'その', 'まあ', 'えー', 'あー', 'うーん'];
    return this.countWordsInText(transcript, hesitationPatterns);
  }

  // 思考を表す言葉を抽出
  private extractThinkingWords(transcript: string): string[] {
    const thinkingPatterns = ['えーと', 'あの', 'その', 'まあ', 'えー', 'あー', 'うーん', 'そうですね'];
    const found: string[] = [];
    
    thinkingPatterns.forEach(pattern => {
      if (transcript.includes(pattern)) {
        found.push(pattern);
      }
    });
    
    return [...new Set(found)]; // 重複を除去
  }

  // キーフレーズ検出
  private detectKeyPhrases(transcript: string): string[] {
    const mathKeywords = ['計算', '答え', '式', '数字', '足し算', '引き算', '掛け算', '割り算', '分数', '小数'];
    const japaneseKeywords = ['文章', '意味', '登場人物', '気持ち', '理由', '主題'];
    const scienceKeywords = ['実験', '観察', '変化', '原因', '結果'];
    const socialKeywords = ['歴史', '地理', '政治', '経済', '文化'];

    const allKeywords = [...mathKeywords, ...japaneseKeywords, ...scienceKeywords, ...socialKeywords];
    const detected: string[] = [];

    allKeywords.forEach(keyword => {
      if (transcript.includes(keyword)) {
        detected.push(keyword);
      }
    });

    return [...new Set(detected)];
  }

  // 理解度推定
  private estimateComprehension(transcript: string, confidences: number[]): number {
    // 基本的な理解度スコア
    const avgConfidence = confidences.length > 0 
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length 
      : 0.5;

    // 説明の一貫性チェック
    const explanationQuality = this.assessExplanationQuality(transcript);
    
    // 専門用語の使用度
    const terminologyUsage = this.assessTerminologyUsage(transcript);

    // 総合的な理解度計算
    const comprehensionScore = (avgConfidence * 0.4 + explanationQuality * 0.4 + terminologyUsage * 0.2);
    
    return Math.min(1, Math.max(0, comprehensionScore));
  }

  // 説明品質評価
  private assessExplanationQuality(transcript: string): number {
    const qualityIndicators = ['なぜなら', 'だから', 'つまり', 'まず', '次に', '最後に', '理由は'];
    const qualityCount = this.countWordsInText(transcript, qualityIndicators);
    
    // 文の長さと構造も考慮
    const sentences = transcript.split('。').filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    const lengthScore = Math.min(1, avgSentenceLength / 20); // 20文字程度が理想
    const structureScore = Math.min(1, qualityCount / 3); // 3つ以上の論理的接続詞が理想
    
    return (lengthScore + structureScore) / 2;
  }

  // 専門用語使用度評価
  private assessTerminologyUsage(transcript: string): number {
    const mathTerms = ['公式', '定理', '法則', '関数', '比例', '反比例', '面積', '体積', '角度'];
    const academicTerms = ['概念', '原理', '仮説', '結論', '根拠', '論理'];
    
    const allTerms = [...mathTerms, ...academicTerms];
    const termCount = this.countWordsInText(transcript, allTerms);
    
    return Math.min(1, termCount / 5); // 5つ以上の専門用語使用が理想
  }

  // テキスト内の単語数をカウント
  private countWordsInText(text: string, words: string[]): number {
    let count = 0;
    words.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  }

  // ブラウザサポートチェック
  public static isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // リアルタイム分析（学習中に即座フィードバック）
  public analyzeRealTime(transcript: string): {
    needsEncouragement: boolean;
    suggestedPrompt: string;
    confidenceLevel: 'low' | 'medium' | 'high';
  } {
    const hesitationWords = ['えーと', 'あの', 'うーん', 'わからない'];
    const hesitationCount = this.countWordsInText(transcript, hesitationWords);
    
    const confidenceWords = ['わかった', 'そうか', 'なるほど', 'できる'];
    const confidenceCount = this.countWordsInText(transcript, confidenceWords);
    
    const needsEncouragement = hesitationCount > 2 || transcript.includes('わからない');
    
    let suggestedPrompt = '';
    let confidenceLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (hesitationCount > 3) {
      confidenceLevel = 'low';
      suggestedPrompt = '少し戸惑っているようですね。一緒に整理してみましょう。どの部分が分からないですか？';
    } else if (confidenceCount > 1) {
      confidenceLevel = 'high';
      suggestedPrompt = '理解が進んでいますね！その調子です。';
    } else {
      suggestedPrompt = '考えをもう少し詳しく聞かせてください。';
    }
    
    return {
      needsEncouragement,
      suggestedPrompt,
      confidenceLevel
    };
  }
}

// シングルトンインスタンス
export const speechRecognitionService = new SpeechRecognitionService();

// 音声入力の便利関数
export const startVoiceInput = (
  onTranscript: (text: string, isFinal: boolean) => void,
  onAnalysis?: (analysis: VoiceAnalysis) => void
): boolean => {
  return speechRecognitionService.startListening(
    (result) => onTranscript(result.transcript, result.isFinal),
    onAnalysis
  );
};

export const stopVoiceInput = (): void => {
  speechRecognitionService.stopListening();
};

export const isVoiceInputSupported = (): boolean => {
  return SpeechRecognitionService.isSupported();
};