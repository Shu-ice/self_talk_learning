// メタ認知学習促進システム - 学習者の「学び方を学ぶ」を支援
import { ChatMessage, LearnerProfile } from '../types';
import { RealTimeLearningAnalysis } from './realTimeLearningAnalyzer';

// メタ認知スキルの評価結果
export interface MetacognitionAssessment {
  planningSkills: number; // 0-1: 計画立案能力
  monitoringSkills: number; // 0-1: 学習監視能力
  evaluationSkills: number; // 0-1: 振り返り評価能力
  regulationSkills: number; // 0-1: 学習調整能力
  
  // 詳細分析
  strengths: string[];
  weaknesses: string[];
  developmentStage: 'novice' | 'developing' | 'proficient' | 'expert';
  recommendations: MetacognitionRecommendation[];
}

// メタ認知向上のための推奨事項
export interface MetacognitionRecommendation {
  type: 'planning' | 'monitoring' | 'evaluation' | 'regulation';
  action: string;
  explanation: string;
  priority: 'high' | 'medium' | 'low';
  exercises: string[];
}

// 学習戦略の評価と提案
export interface LearningStrategy {
  name: string;
  description: string;
  effectiveness: number; // 0-1
  applicableScenarios: string[];
  steps: string[];
  benefits: string[];
  whenToUse: string;
}

class MetacognitiveLearningSupport {
  private learningStrategies: LearningStrategy[] = [
    {
      name: 'SQ3R法（Survey, Question, Read, Recite, Review）',
      description: '読解と理解を深める体系的な学習方法',
      effectiveness: 0.9,
      applicableScenarios: ['国語読解', '社会科資料読み取り', '理科教科書学習'],
      steps: [
        '1. Survey: 全体を概観する',
        '2. Question: 疑問点を明確化する',
        '3. Read: 詳細に読み込む',
        '4. Recite: 要点を声に出して確認',
        '5. Review: 振り返りと整理'
      ],
      benefits: ['体系的理解', '記憶定着向上', '効率的学習'],
      whenToUse: '新しい内容を学習する時、長文読解の時'
    },
    {
      name: 'ポモドーロ・テクニック',
      description: '集中力を最大化する時間管理法',
      effectiveness: 0.8,
      applicableScenarios: ['計算練習', '暗記学習', '集中を要する作業'],
      steps: [
        '1. 25分間集中して学習',
        '2. 5分間の短い休憩',
        '3. これを4回繰り返す',
        '4. 長い休憩（15-30分）を取る'
      ],
      benefits: ['集中力向上', '疲労軽減', 'モチベーション維持'],
      whenToUse: '集中力が続かない時、長時間学習する時'
    },
    {
      name: '説明学習法（ファインマン・テクニック）',
      description: '他人に説明することで理解を深める方法',
      effectiveness: 0.95,
      applicableScenarios: ['概念理解', '公式の理解', '原理の説明'],
      steps: [
        '1. 学習内容を選択',
        '2. 小学生にも分かるように説明',
        '3. 理解できていない部分を特定',
        '4. 資料に戻って再学習',
        '5. 簡単な言葉で再説明'
      ],
      benefits: ['深い理解', '記憶の長期定着', '説明力向上'],
      whenToUse: '難しい概念を学ぶ時、理解度チェック時'
    },
    {
      name: '間隔反復学習',
      description: '忘却曲線に基づく効率的復習法',
      effectiveness: 0.85,
      applicableScenarios: ['漢字学習', '英単語', '計算練習', '暗記事項'],
      steps: [
        '1. 初回学習後1日で復習',
        '2. 3日後に復習',
        '3. 1週間後に復習',
        '4. 2週間後に復習',
        '5. 1ヶ月後に復習'
      ],
      benefits: ['長期記憶への定着', '効率的復習', '忘却防止'],
      whenToUse: '暗記が必要な時、長期記憶に定着させたい時'
    }
  ];

  // メタ認知能力の包括的評価
  public assessMetacognition(
    messages: ChatMessage[], 
    learnerProfile: LearnerProfile,
    recentAnalysis: RealTimeLearningAnalysis[]
  ): MetacognitionAssessment {
    const planningSkills = this.assessPlanningSkills(messages);
    const monitoringSkills = this.assessMonitoringSkills(messages, recentAnalysis);
    const evaluationSkills = this.assessEvaluationSkills(messages);
    const regulationSkills = this.assessRegulationSkills(messages);

    const overallLevel = (planningSkills + monitoringSkills + evaluationSkills + regulationSkills) / 4;
    const developmentStage = this.determineDevelopmentStage(overallLevel);
    
    const strengths = this.identifyMetacognitionStrengths(planningSkills, monitoringSkills, evaluationSkills, regulationSkills);
    const weaknesses = this.identifyMetacognitionWeaknesses(planningSkills, monitoringSkills, evaluationSkills, regulationSkills);
    
    const recommendations = this.generateMetacognitionRecommendations(
      { planningSkills, monitoringSkills, evaluationSkills, regulationSkills },
      learnerProfile
    );

    return {
      planningSkills,
      monitoringSkills,
      evaluationSkills,
      regulationSkills,
      strengths,
      weaknesses,
      developmentStage,
      recommendations
    };
  }

  // 計画立案能力の評価
  private assessPlanningSkills(messages: ChatMessage[]): number {
    const planningIndicators = [
      'まず', '最初に', '計画', '手順', 'ステップ', '順序',
      '目標', '目的', '方針', 'どうやって', '戦略', 'アプローチ'
    ];

    const userMessages = messages.filter(m => m.sender === 'user');
    const planningScore = this.calculateMetacognitionScore(userMessages, planningIndicators);
    
    // 学習開始時の計画性を特に重視
    const earlyMessages = userMessages.slice(0, 3);
    const earlyPlanningScore = this.calculateMetacognitionScore(earlyMessages, planningIndicators);
    
    return Math.min(1, (planningScore + earlyPlanningScore * 1.5) / 2);
  }

  // 学習監視能力の評価
  private assessMonitoringSkills(messages: ChatMessage[], recentAnalysis: RealTimeLearningAnalysis[]): number {
    const monitoringIndicators = [
      '確認', 'チェック', '正しいかな', '間違えそう', 'わかっているか',
      '理解できているか', '進捗', '状況', '様子', 'どのくらい'
    ];

    const userMessages = messages.filter(m => m.sender === 'user');
    const monitoringScore = this.calculateMetacognitionScore(userMessages, monitoringIndicators);
    
    // リアルタイム分析からの自己監視の証拠
    const selfAwarenessScore = recentAnalysis.length > 0
      ? recentAnalysis.reduce((sum, analysis) => 
          sum + ((analysis.comprehensionAnalysis as any).metacognitionLevel || 0), 0) / recentAnalysis.length
      : 0.3;
    
    return Math.min(1, (monitoringScore + selfAwarenessScore) / 2);
  }

  // 振り返り評価能力の評価
  private assessEvaluationSkills(messages: ChatMessage[]): number {
    const evaluationIndicators = [
      '振り返ると', '結果的に', '評価', '反省', '改善', '良かった点',
      '悪かった点', '次回は', '学んだこと', 'わかったこと', '課題'
    ];

    const userMessages = messages.filter(m => m.sender === 'user');
    const evaluationScore = this.calculateMetacognitionScore(userMessages, evaluationIndicators);
    
    // セッション後半での振り返りを重視
    const lateMessages = userMessages.slice(Math.floor(userMessages.length * 0.7));
    const lateEvaluationScore = this.calculateMetacognitionScore(lateMessages, evaluationIndicators);
    
    return Math.min(1, (evaluationScore + lateEvaluationScore * 1.3) / 2);
  }

  // 学習調整能力の評価
  private assessRegulationSkills(messages: ChatMessage[]): number {
    const regulationIndicators = [
      '方法を変える', '戦略を変更', '別のアプローチ', '修正', '調整',
      '工夫', '改良', 'やり方を変える', '別の方法', 'アレンジ'
    ];

    const userMessages = messages.filter(m => m.sender === 'user');
    const regulationScore = this.calculateMetacognitionScore(userMessages, regulationIndicators);
    
    // 困難に直面した時の調整能力を評価
    const difficultyMessages = userMessages.filter(msg => 
      msg.text.includes('難しい') || msg.text.includes('わからない')
    );
    const adaptationAfterDifficulty = difficultyMessages.length > 0
      ? this.assessAdaptationResponse(messages, difficultyMessages)
      : 0.5;
    
    return Math.min(1, (regulationScore + adaptationAfterDifficulty) / 2);
  }

  // 困難後の適応反応評価
  private assessAdaptationResponse(allMessages: ChatMessage[], difficultyMessages: ChatMessage[]): number {
    let adaptationScore = 0;
    
    difficultyMessages.forEach(diffMsg => {
      const msgIndex = allMessages.findIndex(m => m.id === diffMsg.id);
      if (msgIndex === -1) return;
      
      // 困難メッセージの後3つのメッセージを確認
      const followupMessages = allMessages.slice(msgIndex + 1, msgIndex + 4);
      const adaptationIndicators = ['別の方法', 'やり直し', '工夫', '変更', 'アプローチ'];
      
      const hasAdaptation = followupMessages.some(msg => 
        adaptationIndicators.some(indicator => msg.text.includes(indicator))
      );
      
      if (hasAdaptation) adaptationScore += 0.3;
    });
    
    return Math.min(1, adaptationScore);
  }

  // 発達段階の判定
  private determineDevelopmentStage(overallLevel: number): 'novice' | 'developing' | 'proficient' | 'expert' {
    if (overallLevel >= 0.8) return 'expert';
    if (overallLevel >= 0.6) return 'proficient';
    if (overallLevel >= 0.4) return 'developing';
    return 'novice';
  }

  // メタ認知の強み特定
  private identifyMetacognitionStrengths(planning: number, monitoring: number, evaluation: number, regulation: number): string[] {
    const skills = [
      { name: '学習計画立案', score: planning },
      { name: '学習状況の監視', score: monitoring },
      { name: '振り返り評価', score: evaluation },
      { name: '学習方法の調整', score: regulation }
    ];
    
    return skills
      .filter(skill => skill.score >= 0.6)
      .map(skill => skill.name);
  }

  // メタ認知の弱み特定
  private identifyMetacognitionWeaknesses(planning: number, monitoring: number, evaluation: number, regulation: number): string[] {
    const skills = [
      { name: '学習計画立案', score: planning },
      { name: '学習状況の監視', score: monitoring },
      { name: '振り返り評価', score: evaluation },
      { name: '学習方法の調整', score: regulation }
    ];
    
    return skills
      .filter(skill => skill.score < 0.4)
      .map(skill => skill.name);
  }

  // メタ認知向上推奨事項生成
  private generateMetacognitionRecommendations(
    skills: { planningSkills: number; monitoringSkills: number; evaluationSkills: number; regulationSkills: number },
    learnerProfile: LearnerProfile
  ): MetacognitionRecommendation[] {
    const recommendations: MetacognitionRecommendation[] = [];
    
    // 計画立案能力向上
    if (skills.planningSkills < 0.5) {
      recommendations.push({
        type: 'planning',
        action: '学習開始前に必ず5W1Hで計画を立てる',
        explanation: '何を（What）、いつ（When）、どこで（Where）、なぜ（Why）、どのように（How）、どのくらい（How much）を明確にしましょう。',
        priority: 'high',
        exercises: [
          '今日の学習目標を3つ書き出す',
          '予想される困難点を2つ予測する',
          '使用する学習方法を事前に決める',
          '学習時間の配分を計画する'
        ]
      });
    }
    
    // 監視能力向上
    if (skills.monitoringSkills < 0.5) {
      recommendations.push({
        type: 'monitoring',
        action: '10分ごとに理解度をチェックする習慣をつける',
        explanation: '定期的に「今、どのくらい理解できているか？」「困っていることはないか？」を自問自答しましょう。',
        priority: 'high',
        exercises: [
          'タイマーを10分にセットして理解度確認',
          '学習中に「理解度メーター」を意識する',
          '困った時に「何がわからないか」を明確化',
          '進捗を5段階で自己評価'
        ]
      });
    }
    
    // 評価能力向上
    if (skills.evaluationSkills < 0.5) {
      recommendations.push({
        type: 'evaluation',
        action: '学習後に必ず3つの質問で振り返る',
        explanation: '「何ができるようになったか？」「何が難しかったか？」「次回はどう改善するか？」を毎回考えましょう。',
        priority: 'medium',
        exercises: [
          '学習ノートに振り返りコーナーを作る',
          '今日の学びベスト3を選ぶ',
          '次回への改善点を1つ決める',
          '理解度の変化をグラフ化する'
        ]
      });
    }
    
    // 調整能力向上
    if (skills.regulationSkills < 0.5) {
      recommendations.push({
        type: 'regulation',
        action: '困った時の「作戦変更リスト」を準備する',
        explanation: 'うまくいかない時に試す別の方法を3つ以上用意しておきましょう。',
        priority: 'medium',
        exercises: [
          '理解できない時の3つの対処法を決める',
          '集中できない時の環境変更方法を準備',
          '異なる学習方法を週に1つ試す',
          '困難レベル別の対応策を作成'
        ]
      });
    }
    
    return recommendations;
  }

  // 最適な学習戦略の推奨
  public recommendLearningStrategies(
    currentTask: string,
    learnerProfile: LearnerProfile,
    metacognitionLevel: number
  ): LearningStrategy[] {
    const relevantStrategies = this.learningStrategies.filter(strategy => 
      strategy.applicableScenarios.some(scenario => 
        currentTask.toLowerCase().includes(scenario.toLowerCase()) ||
        this.isTaskRelevant(currentTask, scenario)
      )
    );
    
    // メタ認知レベルに応じて推奨の調整
    return relevantStrategies
      .map(strategy => ({
        ...strategy,
        effectiveness: strategy.effectiveness * (0.7 + metacognitionLevel * 0.3) // メタ認知レベルで効果調整
      }))
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3); // 上位3つを推奨
  }

  // 学習戦略実行ガイド生成
  public generateStrategyGuide(strategy: LearningStrategy, learnerProfile: LearnerProfile): string {
    let guide = `📚 **${strategy.name}** を実践してみましょう！\n\n`;
    guide += `**この方法について:**\n${strategy.description}\n\n`;
    guide += `**実践ステップ:**\n`;
    strategy.steps.forEach((step, index) => {
      guide += `${step}\n`;
    });
    guide += `\n**期待できる効果:**\n`;
    strategy.benefits.forEach(benefit => {
      guide += `• ${benefit}\n`;
    });
    guide += `\n**使うタイミング:** ${strategy.whenToUse}\n\n`;
    guide += `💡 **${learnerProfile.name}さんへのアドバイス:**\n`;
    guide += this.generatePersonalizedAdvice(strategy, learnerProfile);
    
    return guide;
  }

  // 個別化されたアドバイス生成
  private generatePersonalizedAdvice(strategy: LearningStrategy, profile: LearnerProfile): string {
    const grade = profile.currentGrade;
    const schoolLevel = profile.schoolLevel;
    
    let advice = '';
    
    if (strategy.name.includes('SQ3R')) {
      if (grade === '4th') {
        advice = '4年生のあなたには、まず「Survey（見渡し）」から始めて、全体像を掴むことを重視しましょう。';
      } else if (schoolLevel === 'elite') {
        advice = '最難関校を目指すあなたには、Question段階で「なぜ？」「どうして？」を深く追求することが重要です。';
      }
    } else if (strategy.name.includes('ポモドーロ')) {
      if (profile.learningPreferences.sessionLength === 'short') {
        advice = '短時間集中型のあなたにぴったりの方法です。25分でも長く感じる場合は、15分から始めてみましょう。';
      }
    } else if (strategy.name.includes('説明学習')) {
      advice = 'AIコーチに説明する練習から始めて、慣れてきたら家族やお友達に説明してみましょう。';
    }
    
    return advice || 'この方法をあなたの学習スタイルに合わせて調整してみてください。';
  }

  // ヘルパーメソッド
  private calculateMetacognitionScore(messages: ChatMessage[], indicators: string[]): number {
    if (messages.length === 0) return 0;
    
    const totalWords = messages.reduce((sum, msg) => sum + msg.text.split(' ').length, 0);
    if (totalWords === 0) return 0;
    
    const indicatorCount = messages.reduce((sum, msg) => {
      return sum + indicators.reduce((keywordSum, indicator) => {
        return keywordSum + (msg.text.toLowerCase().includes(indicator.toLowerCase()) ? 1 : 0);
      }, 0);
    }, 0);
    
    return Math.min(1, indicatorCount / totalWords * 15); // 正規化
  }

  private isTaskRelevant(currentTask: string, scenario: string): boolean {
    const taskKeywords = currentTask.toLowerCase().split(' ');
    const scenarioKeywords = scenario.toLowerCase().split(' ');
    
    return scenarioKeywords.some(keyword => 
      taskKeywords.some(taskWord => taskWord.includes(keyword) || keyword.includes(taskWord))
    );
  }
}

// シングルトンインスタンス
export const metacognitiveLearningSupport = new MetacognitiveLearningSupport();