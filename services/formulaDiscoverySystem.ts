// 🔍 公式発見型学習システム
// Formula Discovery Learning System - Help students discover formulas themselves

import { LearnerProfile, GradeLevel } from '../types';
import { elementaryNotationSystem } from './elementaryNotationSystem';

// 発見学習ステップ
export interface DiscoveryStep {
  step: number;
  type: 'observation' | 'hypothesis' | 'testing' | 'generalization' | 'verification';
  question: string;
  hint?: string;
  expectedInsight: string;
  commonMistakes: string[];
  encouragement: string;
}

// 公式発見プロセス
export interface FormulaDiscoveryProcess {
  formula: string;
  topic: string;
  discoverySteps: DiscoveryStep[];
  concreteExamples: Array<{
    situation: string;
    visualAid: string;
    numbers: Record<string, number>;
    calculation: string;
  }>;
  patterns: string[];
  finalRealization: string;
}

export class FormulaDiscoverySystem {
  
  // 🔍 速さの公式発見プロセス
  public generateSpeedFormulaDiscovery(grade: GradeLevel): FormulaDiscoveryProcess {
    
    const notation = elementaryNotationSystem.generateSpeedNotation(grade);
    
    return {
      formula: notation.formula,
      topic: '速さ・時間・距離の関係',
      discoverySteps: [
        {
          step: 1,
          type: 'observation',
          question: 'まず、歩くときのことを考えてみましょう。1分間に60m歩く人が、3分間歩いたら何m進むでしょうか？',
          expectedInsight: '60 × 3 = 180m になることに気づく',
          commonMistakes: ['60 + 3 = 63m と足し算で考える'],
          encouragement: 'そうですね！時間が長いほど、たくさん進みますね。'
        },
        {
          step: 2,
          type: 'hypothesis',
          question: 'では、同じ人が5分間歩いたら？10分間歩いたら？何か決まりが見えてきませんか？',
          hint: '「1分間に進む距離」と「何分歩いたか」を使って考えてみましょう',
          expectedInsight: '「1分間の距離 × 時間 = 全体の距離」という関係に気づく',
          commonMistakes: ['パターンに気づかず個別に計算してしまう'],
          encouragement: '素晴らしい！きまりを見つけることができましたね！'
        },
        {
          step: 3,
          type: 'testing',
          question: 'この決まりが本当に正しいか、違う例で確かめてみましょう。分速80mで2分間歩いた場合はどうですか？',
          expectedInsight: '80 × 2 = 160m で、決まりが成り立つことを確認',
          commonMistakes: ['計算ミスで決まりが成り立たないと思ってしまう'],
          encouragement: 'すごい！あなたが見つけた決まりは正しいですね！'
        },
        {
          step: 4,
          type: 'generalization',
          question: 'この決まりを、○□△の記号で表すとどうなりますか？',
          hint: '距離を○、速さを□、時間を△とすると...',
          expectedInsight: '○ = □ × △ という式を自分で作る',
          commonMistakes: ['記号の意味を取り違える'],
          encouragement: 'わあ！あなたが自分で公式を作り出しました！'
        },
        {
          step: 5,
          type: 'verification',
          question: 'この公式○ = □ × △を使って、最初の問題をもう一度解いてみてください。うまくいきますか？',
          expectedInsight: '自分が作った公式で問題が解けることを実感',
          commonMistakes: ['公式の使い方を間違える'],
          encouragement: '完璧です！あなたが発見した公式は、とても役に立ちますね！'
        }
      ],
      concreteExamples: [
        {
          situation: '太郎君のお散歩',
          visualAid: '🚶‍♂️ → → → (1分で60m)',
          numbers: { speed: 60, time: 3, distance: 180 },
          calculation: '60m × 3分 = 180m'
        },
        {
          situation: '花子さんのジョギング',
          visualAid: '🏃‍♀️ → → → → (1分で80m)',
          numbers: { speed: 80, time: 2, distance: 160 },
          calculation: '80m × 2分 = 160m'
        }
      ],
      patterns: [
        '速く進むほど、同じ時間で遠くまで行ける',
        '長い時間進むほど、遠くまで行ける',
        '「1分間の距離 × 時間 = 全体の距離」がいつも成り立つ'
      ],
      finalRealization: 'あなたは自分の力で「距離 = 速さ × 時間」という公式を発見しました！これは世界中の人が使っている大切な公式です。'
    };
  }

  // 🔍 面積の公式発見プロセス
  public generateAreaFormulaDiscovery(
    shape: 'rectangle' | 'triangle' | 'circle',
    grade: GradeLevel
  ): FormulaDiscoveryProcess {
    
    const geometry = elementaryNotationSystem.generateGeometryNotation(shape, grade);
    
    if (shape === 'rectangle') {
      return {
        formula: geometry.formula,
        topic: '長方形の面積',
        discoverySteps: [
          {
            step: 1,
            type: 'observation',
            question: '1cm × 1cmの正方形が何個並んでいるか数えてみましょう。たて3cm、よこ4cmの長方形には何個入りますか？',
            expectedInsight: '3 × 4 = 12個の正方形が入ることに気づく',
            commonMistakes: ['1個ずつ数えて間違える', '足し算で3 + 4 = 7と考える'],
            encouragement: 'よく数えられましたね！規則正しく並んでいますね。'
          },
          {
            step: 2,
            type: 'hypothesis',
            question: '違うサイズの長方形でも試してみましょう。たて2cm、よこ5cmならどうですか？',
            hint: '縦の列がいくつ、横の列がいくつあるか考えてみて',
            expectedInsight: '2 × 5 = 10個で、「たて × よこ」の決まりに気づく',
            commonMistakes: ['個別に数えてパターンに気づかない'],
            encouragement: 'すごい発見ですね！きまりが見えてきました！'
          },
          {
            step: 3,
            type: 'testing',
            question: 'この決まりが正しいか、たて6cm、よこ2cmの長方形で確かめてみましょう。',
            expectedInsight: '6 × 2 = 12個で決まりが成り立つことを確認',
            commonMistakes: ['計算ミス'],
            encouragement: 'あなたが見つけた決まりは正しいですね！'
          },
          {
            step: 4,
            type: 'generalization',
            question: 'この決まりを○□で表すとどうなりますか？面積を○、たてを□、よこを△とすると...',
            expectedInsight: '○ = □ × △ という公式を自分で作る',
            commonMistakes: ['記号を逆に使う'],
            encouragement: '素晴らしい！あなたが長方形の面積公式を発見しました！'
          },
          {
            step: 5,
            type: 'verification',
            question: 'この公式を使って、教室の床の面積を計算できそうですか？',
            expectedInsight: '実際の問題に公式が使えることを理解',
            commonMistakes: ['理論と実践を結びつけられない'],
            encouragement: '完璧です！あなたの発見は本当に役に立ちますね！'
          }
        ],
        concreteExamples: [
          {
            situation: '1cm正方形を敷き詰める',
            visualAid: '□□□□\n□□□□\n□□□□ (3×4の長方形)',
            numbers: { length: 4, width: 3, area: 12 },
            calculation: '4 × 3 = 12個'
          }
        ],
        patterns: [
          'たてが長いほど、面積が大きくなる',
          'よこが長いほど、面積が大きくなる',
          '「たて × よこ = 面積」がいつも成り立つ'
        ],
        finalRealization: 'あなたは「面積 = たて × よこ」という公式を自分で発見しました！'
      };
    }
    
    // 他の図形のケースも同様に実装...
    return this.generateDefaultDiscovery(shape, geometry.formula);
  }

  // 🔍 つるかめ算の考え方発見プロセス
  public generateTsuruKameDiscovery(grade: GradeLevel): FormulaDiscoveryProcess {
    
    return {
      formula: '○ + □ = 全体の数、○×2 + □×4 = 全体の足の数',
      topic: 'つるかめ算の考え方',
      discoverySteps: [
        {
          step: 1,
          type: 'observation',
          question: 'つるの足は何本ですか？かめの足は何本ですか？実際に数えてみましょう。',
          expectedInsight: 'つる2本、かめ4本ということを確認',
          commonMistakes: ['数え間違い'],
          encouragement: 'そうですね！つるとかめは足の数が違いますね。'
        },
        {
          step: 2,
          type: 'hypothesis',
          question: 'もし動物が全部つるだったら、足の数はどうなるでしょうか？',
          hint: '8匹全部がつるなら、足は何本になるかな？',
          expectedInsight: '8匹 × 2本 = 16本になることに気づく',
          commonMistakes: ['8 + 2 = 10本と足し算で考える'],
          encouragement: 'いいですね！全部つるなら16本ですね。'
        },
        {
          step: 3,
          type: 'testing',
          question: 'でも実際の足の数は26本です。16本と26本の違いは何本ですか？なぜ違うのでしょう？',
          expectedInsight: '26 - 16 = 10本多い。かめがいるからだと気づく',
          commonMistakes: ['差の意味を理解できない'],
          encouragement: 'すごい！10本多いのは、かめがいるからですね！'
        },
        {
          step: 4,
          type: 'generalization',
          question: 'つる1匹をかめ1匹に変えると、足の数はどう変わりますか？',
          hint: 'つる2本 → かめ4本に変わると...',
          expectedInsight: '2本減って4本増えるので、合計2本増えることに気づく',
          commonMistakes: ['変化量を正しく計算できない'],
          encouragement: '素晴らしい発見！1匹変わると2本増えるんですね！'
        },
        {
          step: 5,
          type: 'verification',
          question: '10本多いということは、何匹がかめに変わったのでしょうか？',
          expectedInsight: '10 ÷ 2 = 5匹がかめだと分かる',
          commonMistakes: ['割り算の意味を理解できない'],
          encouragement: '完璧です！あなたがつるかめ算を発見しました！'
        }
      ],
      concreteExamples: [
        {
          situation: '全部つるの場合',
          visualAid: '🐦🐦🐦🐦🐦🐦🐦🐦 (8匹)\n足: || || || || || || || || (16本)',
          numbers: { crane: 8, turtle: 0, legs: 16 },
          calculation: '8匹 × 2本 = 16本'
        },
        {
          situation: '実際の場合',
          visualAid: '🐦🐦🐦🐢🐢🐢🐢🐢 (8匹)\n足: || || || |||| |||| |||| |||| |||| (26本)',
          numbers: { crane: 3, turtle: 5, legs: 26 },
          calculation: '3×2 + 5×4 = 6 + 20 = 26本'
        }
      ],
      patterns: [
        'つるをかめに変えると足が2本増える',
        '全部つると仮定してから考える',
        '差から本当の数を求められる'
      ],
      finalRealization: 'あなたは「仮定して考える」という、とても高度な思考方法を発見しました！これはつるかめ算の本質です。'
    };
  }

  // 🎓 発見学習セッション実行
  public conductDiscoverySession(
    topic: string,
    learnerProfile: LearnerProfile,
    studentResponse?: string
  ): {
    currentStep: DiscoveryStep;
    nextQuestion: string;
    feedback: string;
    progressIndicator: string;
    encouragement: string;
  } {
    
    // トピックに応じた発見プロセスを取得
    let discoveryProcess: FormulaDiscoveryProcess;
    
    if (topic.includes('速さ')) {
      discoveryProcess = this.generateSpeedFormulaDiscovery(learnerProfile.grade);
    } else if (topic.includes('面積')) {
      discoveryProcess = this.generateAreaFormulaDiscovery('rectangle', learnerProfile.grade);
    } else if (topic.includes('つるかめ')) {
      discoveryProcess = this.generateTsuruKameDiscovery(learnerProfile.grade);
    } else {
      discoveryProcess = this.generateDefaultDiscovery(topic, '○ = □ × △');
    }
    
    // 現在のステップを決定（簡略化のため最初のステップ）
    const currentStep = discoveryProcess.discoverySteps[0];
    
    const feedback = studentResponse ? 
      this.generateFeedback(studentResponse, currentStep) : 
      '一緒に発見の旅を始めましょう！';
    
    return {
      currentStep,
      nextQuestion: currentStep.question,
      feedback,
      progressIndicator: `発見ステップ ${currentStep.step}/5: ${currentStep.type}`,
      encouragement: currentStep.encouragement
    };
  }

  // 🌟 学習者の気づきを促進
  public promptInsight(
    studentThinking: string,
    expectedInsight: string,
    topic: string
  ): {
    guidingQuestions: string[];
    hints: string[];
    encouragement: string;
  } {
    
    const guidingQuestions = [
      'なぜそう思ったのですか？',
      '他にも似たような例はありますか？',
      'もしこの数字が違ったらどうなりますか？',
      'この方法はいつでも使えそうですか？'
    ];
    
    const hints = [
      '数字の間にどんな関係があるか見てみましょう',
      '具体的な例で確かめてみませんか？',
      'パターンや規則性はありそうですか？'
    ];
    
    return {
      guidingQuestions,
      hints,
      encouragement: 'いい考えですね！その調子で探求を続けましょう！'
    };
  }

  // ヘルパーメソッド
  private generateDefaultDiscovery(topic: string, formula: string): FormulaDiscoveryProcess {
    return {
      formula,
      topic,
      discoverySteps: [
        {
          step: 1,
          type: 'observation',
          question: `${topic}について、具体的な例を見てみましょう。`,
          expectedInsight: '具体例から規則性に気づく',
          commonMistakes: ['個別の例にとらわれる'],
          encouragement: 'よく観察していますね！'
        }
      ],
      concreteExamples: [],
      patterns: [],
      finalRealization: `あなたが${topic}の規則性を発見しました！`
    };
  }

  private generateFeedback(response: string, step: DiscoveryStep): string {
    if (response.includes('わからない') || response.includes('困っ')) {
      return '大丈夫です！一緒に考えていきましょう。' + (step.hint || '');
    } else if (response.includes('できた') || response.includes('わかった')) {
      return '素晴らしい発見ですね！なぜそうなるのか説明してもらえますか？';
    } else {
      return 'いい考えですね！もう少し詳しく聞かせてください。';
    }
  }
}

// シングルトンインスタンス
export const formulaDiscoverySystem = new FormulaDiscoverySystem();