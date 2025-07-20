// 🧠 メタコグニション対応AI - 世界最高レベル学習思考支援
// Metacognition-Enhanced AI for Deep Learning Support

import { LearnerProfile } from '../types';
import { UltraLearningMetrics } from './ultraLearningAnalyzer';
import { educationSystem } from './enhancedEducationSystem';

// メタ認知スキルレベル
export interface MetacognitionLevel {
  planning: number; // 0-100 (学習計画立案能力)
  monitoring: number; // 0-100 (学習監視能力)
  evaluation: number; // 0-100 (学習評価能力)
  strategy: number; // 0-100 (戦略選択能力)
  awareness: number; // 0-100 (自己認識能力)
  regulation: number; // 0-100 (学習調整能力)
}

// 思考プロセス分析
export interface ThinkingProcess {
  stage: 'understanding' | 'planning' | 'executing' | 'monitoring' | 'evaluating';
  strategies: string[];
  misconceptions: string[];
  confidence: number; // 0-1
  reasoning: string;
  transferConnections: string[];
}

// AI指導戦略
export interface MetacognitionStrategy {
  type: 'socratic' | 'scaffolding' | 'modeling' | 'prompting' | 'reflection';
  intervention: string;
  timing: 'before' | 'during' | 'after';
  purpose: string;
  expectedOutcome: string;
}

export class MetacognitionAI {
  
  // 🎯 学習者のメタ認知レベル評価
  public assessMetacognitionLevel(
    learningHistory: Array<{
      problem: string;
      solution: string;
      explanation: string;
      selfAssessment: number; // 1-5
      actualPerformance: number; // 0-1
      strategiesUsed: string[];
      timeSpent: number;
    }>,
    learnerProfile: LearnerProfile
  ): MetacognitionLevel {
    
    // プランニング能力分析
    const planning = this.assessPlanningSkills(learningHistory);
    
    // モニタリング能力分析
    const monitoring = this.assessMonitoringSkills(learningHistory);
    
    // 評価能力分析
    const evaluation = this.assessEvaluationSkills(learningHistory);
    
    // 戦略選択能力分析
    const strategy = this.assessStrategySelection(learningHistory);
    
    // 自己認識能力分析
    const awareness = this.assessSelfAwareness(learningHistory);
    
    // 調整能力分析
    const regulation = this.assessRegulationSkills(learningHistory);

    return {
      planning,
      monitoring,
      evaluation,
      strategy,
      awareness,
      regulation
    };
  }

  // 🤔 思考プロセス分析とサポート
  public analyzeThinkingProcess(
    problem: string,
    studentResponse: string,
    responseTime: number,
    metacognitionLevel: MetacognitionLevel
  ): {
    process: ThinkingProcess;
    interventions: MetacognitionStrategy[];
    nextQuestions: string[];
  } {
    
    // 思考段階の特定
    const stage = this.identifyThinkingStage(studentResponse, responseTime);
    
    // 使用戦略の分析
    const strategies = this.identifyStrategies(studentResponse, problem);
    
    // 誤解や盲点の検出
    const misconceptions = this.detectMisconceptions(studentResponse, problem);
    
    // 自信レベルの推定
    const confidence = this.estimateConfidence(studentResponse, responseTime);
    
    // 推論プロセスの分析
    const reasoning = this.analyzeReasoning(studentResponse);
    
    // 転移・関連性の発見
    const transferConnections = this.findTransferConnections(problem, studentResponse);

    const process: ThinkingProcess = {
      stage,
      strategies,
      misconceptions,
      confidence,
      reasoning,
      transferConnections
    };

    // 介入戦略の決定
    const interventions = this.selectInterventions(process, metacognitionLevel);
    
    // 次の質問の生成
    const nextQuestions = this.generateMetacognitiveQuestions(process, metacognitionLevel);

    return {
      process,
      interventions,
      nextQuestions
    };
  }

  // 🎓 ソクラテス式対話生成
  public generateSocraticDialogue(
    topic: string,
    studentLevel: number,
    learnerProfile: LearnerProfile,
    currentUnderstanding: string
  ): {
    questionSequence: Array<{
      question: string;
      purpose: string;
      expectedThinking: string;
      followUps: string[];
    }>;
    guidingPrinciples: string[];
  } {
    
    const metacognitionLevel = this.assessMetacognitionLevel([], learnerProfile);
    
    // ソクラテス式質問の生成
    const questionSequence = [
      {
        question: this.generateOpeningQuestion(topic, studentLevel),
        purpose: '既存知識の活性化と前提確認',
        expectedThinking: '自分が知っていることを整理する',
        followUps: this.generateFollowUpQuestions('activation', topic)
      },
      {
        question: this.generateExplorationQuestion(topic, currentUnderstanding),
        purpose: '深い思考の促進と概念の探求',
        expectedThinking: '問題の核心を考える',
        followUps: this.generateFollowUpQuestions('exploration', topic)
      },
      {
        question: this.generateApplicationQuestion(topic, studentLevel),
        purpose: '学習内容の応用と転移',
        expectedThinking: '他の場面での活用を考える',
        followUps: this.generateFollowUpQuestions('application', topic)
      },
      {
        question: this.generateReflectionQuestion(topic),
        purpose: '学習プロセスの振り返りと定着',
        expectedThinking: '自分の学習を客観視する',
        followUps: this.generateFollowUpQuestions('reflection', topic)
      }
    ];

    const guidingPrinciples = [
      '学習者の発言を否定せず、思考を深める方向に導く',
      '答えを直接教えず、気づきを促す質問をする',
      '学習者のペースに合わせて質問の深度を調整する',
      '間違いや迷いも学習の一部として受け入れる',
      '常に「なぜ？」「どうして？」の探求を促す'
    ];

    return {
      questionSequence,
      guidingPrinciples
    };
  }

  // 📚 学習戦略指導システム
  public teachLearningStrategies(
    problem: string,
    subject: string,
    difficulty: number,
    learnerProfile: LearnerProfile,
    metacognitionLevel: MetacognitionLevel
  ): {
    recommendedStrategies: Array<{
      name: string;
      description: string;
      when: string;
      how: string;
      example: string;
      effectiveness: number; // 0-1
    }>;
    strategicThinking: string;
    metacognitivePractice: string;
  } {
    
    const strategies = [];

    // 問題理解戦略
    if (metacognitionLevel.planning < 60) {
      strategies.push({
        name: '問題分析法',
        description: '問題を要素に分解して理解する方法',
        when: '問題を読んだ直後',
        how: '何を求められているか、何がわかっているかを明確にする',
        example: '「太郎君が...」→主人公、「3個のりんごと2個のみかん」→数量情報',
        effectiveness: 0.8
      });
    }

    // 解法選択戦略
    if (metacognitionLevel.strategy < 60) {
      strategies.push({
        name: '解法パターンマッチング',
        description: '過去に学んだ似た問題との関連付け',
        when: '解き方を考える時',
        how: '「この問題は○○の問題に似ている」と考える',
        example: '速さの問題→「距離 = 速さ × 時間」のパターン',
        effectiveness: 0.7
      });
    }

    // 実行監視戦略
    if (metacognitionLevel.monitoring < 60) {
      strategies.push({
        name: 'セルフチェック法',
        description: '解いている途中で答えが合理的かチェック',
        when: '計算の各段階',
        how: '「この答えは現実的か？」「計算ミスはないか？」',
        example: '速さ100km/時→「車は高速道路並みに速い」',
        effectiveness: 0.9
      });
    }

    // 振り返り戦略
    if (metacognitionLevel.evaluation < 60) {
      strategies.push({
        name: '解法振り返り法',
        description: '解いた後に別の方法がないか考える',
        when: '問題を解き終わった後',
        how: '「他にも解き方があるかな？」「もっと簡単な方法は？」',
        example: 'つるかめ算→表を作る方法、式を立てる方法',
        effectiveness: 0.6
      });
    }

    const strategicThinking = `
この問題では特に「${strategies[0]?.name || '問題分析法'}」が効果的です。
${subject}の問題では、まず${this.getSubjectSpecificAdvice(subject)}を意識しましょう。
難易度レベル${difficulty}では、${this.getDifficultySpecificAdvice(difficulty)}が重要になります。
    `;

    const metacognitivePractice = `
解く前に: 「この問題で何がわからないかな？」
解いている時: 「今どの段階にいるかな？」  
解いた後: 「なぜこの方法で解けたのかな？」
このような自問自答を習慣にしましょう。
    `;

    return {
      recommendedStrategies: strategies,
      strategicThinking,
      metacognitivePractice
    };
  }

  // 🔄 リアルタイム思考支援
  public provideRealTimeSupport(
    currentThinking: string,
    problemContext: string,
    timeElapsed: number,
    strugglingIndicators: string[]
  ): {
    immediateHint: string;
    thinkingPrompt: string;
    encouragement: string;
    nextStep: string;
  } {
    
    let immediateHint = '';
    let thinkingPrompt = '';
    let encouragement = '';
    let nextStep = '';

    // 困っている様子の検出
    if (strugglingIndicators.includes('long_pause') || timeElapsed > 300000) { // 5分以上
      immediateHint = '問題を小さな部分に分けて考えてみましょう。まず、この問題で「わかっていること」は何でしょうか？';
      thinkingPrompt = '今どんなことを考えていますか？思っていることを言葉にしてみてください。';
      encouragement = '時間をかけて考えることは、とても大切です。焦らずに一歩ずつ進みましょう。';
      nextStep = '何がわかっていて、何を求められているかを整理してみませんか？';
    }
    
    // 間違った方向への推論を検出
    else if (strugglingIndicators.includes('wrong_direction')) {
      immediateHint = '少し違う方向に向かっているかもしれません。もう一度問題文を読み返してみましょう。';
      thinkingPrompt = 'なぜその方法を選んだのか教えてください。';
      encouragement = '試行錯誤することは学習にとって とても価値があります。';
      nextStep = '問題で本当に求められていることは何か、確認してみましょう。';
    }
    
    // 順調な進捗の場合
    else {
      immediateHint = 'いい感じです！そのまま進めてみてください。';
      thinkingPrompt = '今の解き方について、どう思いますか？';
      encouragement = '順調に進んでいますね。その調子です！';
      nextStep = '次の段階に進む準備ができていそうですね。';
    }

    return {
      immediateHint,
      thinkingPrompt,
      encouragement,
      nextStep
    };
  }

  // 📈 メタ認知成長促進プログラム
  public generateMetacognitionGrowthProgram(
    currentLevel: MetacognitionLevel,
    learnerProfile: LearnerProfile,
    targetImprovement: Partial<MetacognitionLevel>
  ): {
    weeklyProgram: Array<{
      week: number;
      focus: string;
      activities: string[];
      reflectionPrompts: string[];
      progressIndicators: string[];
    }>;
    longTermGoals: string[];
    assessmentMethods: string[];
  } {
    
    const program = [];
    let weekNumber = 1;

    // プランニングスキル向上週
    if ((targetImprovement.planning || 0) > currentLevel.planning) {
      program.push({
        week: weekNumber++,
        focus: '学習計画立案スキル',
        activities: [
          '問題を見る前に「どんな手順で解くか」を予想する練習',
          '1つの問題に対して複数の解法を考える練習',
          '解く前に「何分で解けそうか」を予測する練習'
        ],
        reflectionPrompts: [
          '予想した手順と実際の手順はどう違いましたか？',
          '計画を立てることで、解きやすくなりましたか？'
        ],
        progressIndicators: [
          '解法の見通しが立つようになった',
          '計画と実行のズレが小さくなった'
        ]
      });
    }

    // モニタリングスキル向上週
    if ((targetImprovement.monitoring || 0) > currentLevel.monitoring) {
      program.push({
        week: weekNumber++,
        focus: '学習監視スキル',
        activities: [
          '解いている途中で「今どの段階にいるか」を確認する練習',
          '計算の各ステップで「この答えは妥当か」をチェックする練習',
          '困った時に「何がわからないか」を明確にする練習'
        ],
        reflectionPrompts: [
          '途中でチェックすることで、ミスを防げましたか？',
          '自分の理解度を正確に把握できるようになりましたか？'
        ],
        progressIndicators: [
          '計算ミスが減った',
          '詰まった時に原因を特定できるようになった'
        ]
      });
    }

    // 評価スキル向上週
    if ((targetImprovement.evaluation || 0) > currentLevel.evaluation) {
      program.push({
        week: weekNumber++,
        focus: '学習評価スキル',
        activities: [
          '解いた後に「なぜこの方法で解けたか」を説明する練習',
          '自分の解答に点数をつけて、実際の点数と比較する練習',
          '「今日学んだこと」を3つ挙げる練習'
        ],
        reflectionPrompts: [
          '自己評価と実際の評価は近づいてきましたか？',
          '学習の成果を具体的に表現できるようになりましたか？'
        ],
        progressIndicators: [
          '自己評価の精度が向上した',
          '学習内容を整理して説明できるようになった'
        ]
      });
    }

    const longTermGoals = [
      '自分で学習計画を立てられるようになる',
      '困った時に適切な対処法を選べるようになる',
      '学習の成果を客観的に評価できるようになる',
      '新しい問題でも既習内容を活用できるようになる'
    ];

    const assessmentMethods = [
      '学習日記による自己振り返り',
      '週次の自己評価チェックリスト',
      '解法説明による理解度確認',
      '類似問題での転移度測定'
    ];

    return {
      weeklyProgram: program,
      longTermGoals,
      assessmentMethods
    };
  }

  // ヘルパーメソッド群
  
  private assessPlanningSkills(history: any[]): number {
    // 学習計画立案能力の評価
    const planningIndicators = history.filter(h => 
      h.explanation.includes('まず') || 
      h.explanation.includes('次に') ||
      h.explanation.includes('手順')
    );
    return Math.min(100, (planningIndicators.length / history.length) * 100);
  }

  private assessMonitoringSkills(history: any[]): number {
    // 学習監視能力の評価
    const monitoringIndicators = history.filter(h => 
      h.explanation.includes('確認') ||
      h.explanation.includes('チェック') ||
      h.explanation.includes('見直し')
    );
    return Math.min(100, (monitoringIndicators.length / history.length) * 100);
  }

  private assessEvaluationSkills(history: any[]): number {
    // 自己評価と実際のパフォーマンスの一致度
    if (history.length === 0) return 50;
    
    const evaluationAccuracy = history.map(h => {
      const selfAssessmentNormalized = h.selfAssessment / 5;
      return 1 - Math.abs(selfAssessmentNormalized - h.actualPerformance);
    });
    
    const averageAccuracy = evaluationAccuracy.reduce((a, b) => a + b, 0) / evaluationAccuracy.length;
    return Math.round(averageAccuracy * 100);
  }

  private assessStrategySelection(history: any[]): number {
    // 戦略選択の多様性と適切性
    const uniqueStrategies = new Set();
    history.forEach(h => h.strategiesUsed.forEach((s: string) => uniqueStrategies.add(s)));
    return Math.min(100, uniqueStrategies.size * 20);
  }

  private assessSelfAwareness(history: any[]): number {
    // 自己認識の深さ（説明の詳細度）
    const averageExplanationLength = history.reduce((sum, h) => sum + h.explanation.length, 0) / history.length;
    return Math.min(100, averageExplanationLength / 2); // 200文字で100点
  }

  private assessRegulationSkills(history: any[]): number {
    // 学習調整能力（パフォーマンス向上の傾向）
    if (history.length < 3) return 50;
    
    const recentPerformance = history.slice(-3).map(h => h.actualPerformance);
    const earlyPerformance = history.slice(0, 3).map(h => h.actualPerformance);
    
    const recentAvg = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
    const earlyAvg = earlyPerformance.reduce((a, b) => a + b, 0) / earlyPerformance.length;
    
    const improvement = recentAvg - earlyAvg;
    return Math.min(100, 50 + improvement * 100);
  }

  private identifyThinkingStage(response: string, time: number): ThinkingProcess['stage'] {
    if (response.includes('わからない') || response.includes('困って')) {
      return 'understanding';
    } else if (response.includes('まず') || response.includes('手順')) {
      return 'planning';
    } else if (response.includes('計算') || response.includes('解いて')) {
      return 'executing';
    } else if (response.includes('確認') || response.includes('チェック')) {
      return 'monitoring';
    } else {
      return 'evaluating';
    }
  }

  private identifyStrategies(response: string, problem: string): string[] {
    const strategies: string[] = [];
    
    if (response.includes('図') || response.includes('絵')) strategies.push('視覚化');
    if (response.includes('表') || response.includes('整理')) strategies.push('構造化');
    if (response.includes('式') || response.includes('計算')) strategies.push('数式化');
    if (response.includes('似て') || response.includes('前に')) strategies.push('類推');
    
    return strategies;
  }

  private detectMisconceptions(response: string, problem: string): string[] {
    const misconceptions: string[] = [];
    
    // 一般的な誤解の検出
    if (response.includes('足す') && problem.includes('割合')) {
      misconceptions.push('割合問題で単純加算');
    }
    if (response.includes('大きい') && problem.includes('分数')) {
      misconceptions.push('分数の大小判断の誤解');
    }
    
    return misconceptions;
  }

  private estimateConfidence(response: string, time: number): number {
    let confidence = 0.5; // 基準値
    
    if (response.includes('思います') || response.includes('多分')) confidence -= 0.2;
    if (response.includes('確実') || response.includes('絶対')) confidence += 0.3;
    if (time < 30000) confidence += 0.2; // 30秒未満で回答
    if (time > 300000) confidence -= 0.3; // 5分以上考えた
    
    return Math.max(0, Math.min(1, confidence));
  }

  private analyzeReasoning(response: string): string {
    if (response.includes('なぜなら') || response.includes('だから')) {
      return '因果関係に基づく論理的推論';
    } else if (response.includes('同じ') || response.includes('似て')) {
      return '類推による推論';
    } else if (response.includes('手順') || response.includes('まず')) {
      return '手続き的推論';
    } else {
      return '直感的推論';
    }
  }

  private findTransferConnections(problem: string, response: string): string[] {
    const connections: string[] = [];
    
    if (response.includes('前に習った') || response.includes('○○と同じ')) {
      connections.push('既習内容との関連付け');
    }
    if (response.includes('日常') || response.includes('普段')) {
      connections.push('日常生活への転移');
    }
    
    return connections;
  }

  private selectInterventions(process: ThinkingProcess, level: MetacognitionLevel): MetacognitionStrategy[] {
    const interventions: MetacognitionStrategy[] = [];
    
    if (process.confidence < 0.3) {
      interventions.push({
        type: 'scaffolding',
        intervention: '段階的な手がかりを提供',
        timing: 'during',
        purpose: '自信回復と理解促進',
        expectedOutcome: '安心感と次のステップの明確化'
      });
    }
    
    if (process.misconceptions.length > 0) {
      interventions.push({
        type: 'socratic',
        intervention: '誤解を気づかせる質問',
        timing: 'during',
        purpose: '誤概念の修正',
        expectedOutcome: '正しい理解への転換'
      });
    }
    
    return interventions;
  }

  private generateMetacognitiveQuestions(process: ThinkingProcess, level: MetacognitionLevel): string[] {
    const questions: string[] = [];
    
    switch (process.stage) {
      case 'understanding':
        questions.push('この問題で一番大切なポイントは何だと思いますか？');
        questions.push('似たような問題を解いたことはありますか？');
        break;
      case 'planning':
        questions.push('どんな手順で解こうと思いますか？');
        questions.push('なぜその方法を選んだのですか？');
        break;
      case 'executing':
        questions.push('今どの段階にいるか説明してください');
        questions.push('この計算結果は妥当だと思いますか？');
        break;
      case 'monitoring':
        questions.push('順調に進んでいると思いますか？');
        questions.push('困っていることはありませんか？');
        break;
      case 'evaluating':
        questions.push('この解法の良い点は何ですか？');
        questions.push('他にも解き方があると思いますか？');
        break;
    }
    
    return questions;
  }

  private generateOpeningQuestion(topic: string, level: number): string {
    return `${topic}について、今まで学んだことで覚えていることはありますか？`;
  }

  private generateExplorationQuestion(topic: string, understanding: string): string {
    return `なぜ${topic}が重要だと思いますか？日常生活のどんな場面で使えそうでしょうか？`;
  }

  private generateApplicationQuestion(topic: string, level: number): string {
    return `今学んだ${topic}の考え方を使って、違う問題も解けると思いますか？`;
  }

  private generateReflectionQuestion(topic: string): string {
    return `${topic}を学んで、自分の考え方にどんな変化がありましたか？`;
  }

  private generateFollowUpQuestions(type: string, topic: string): string[] {
    const questionBank: Record<string, string[]> = {
      'activation': [
        'もう少し詳しく教えてください',
        'それについてどう思いますか？',
        '確かにそうですね。他には？'
      ],
      'exploration': [
        'それはなぜだと思いますか？',
        '例を挙げて説明してもらえますか？',
        '反対の場合はどうでしょうか？'
      ],
      'application': [
        '具体的にはどんな場面でしょうか？',
        'その考え方で他の問題も解けますか？',
        '実際にやってみましょうか？'
      ],
      'reflection': [
        '最初の考えと今の考えを比べてください',
        '一番印象に残ったことは何ですか？',
        '友達に説明するとしたらどう言いますか？'
      ]
    };
    
    return questionBank[type] || [];
  }

  private getSubjectSpecificAdvice(subject: string): string {
    const adviceMap: Record<string, string> = {
      'math': '数量関係と図形の性質',
      'japanese': '文脈と作者の意図',
      'science': '原因と結果の関係',
      'social': '時代背景と因果関係'
    };
    return adviceMap[subject] || '基本概念と応用';
  }

  private getDifficultySpecificAdvice(difficulty: number): string {
    if (difficulty <= 3) return '基礎的な理解の確認';
    if (difficulty <= 6) return '解法パターンの習得';
    if (difficulty <= 8) return '応用力と思考力';
    return '創造的問題解決';
  }
}

// シングルトンインスタンス
export const metacognitionAI = new MetacognitionAI();