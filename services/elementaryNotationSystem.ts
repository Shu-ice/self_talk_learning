// 🎯 小学生特有記号表現システム
// Elementary School Notation System for Japanese Middle School Entrance Exams

import { GradeLevel } from '../types';

// 小学生で使用する記号体系
export interface ElementaryNotation {
  symbols: {
    unknown1: string;      // 第一未知数 (○、□、①など)
    unknown2: string;      // 第二未知数
    unknown3: string;      // 第三未知数
    multiple: string;      // 倍数表現 (②、③など)
  };
  expressionRules: {
    multiplication: string;  // 掛け算の表現方法
    division: string;       // 割り算の表現方法
    equality: string;       // 等式の表現方法
  };
  forbiddenSymbols: string[]; // 使用禁止の記号
}

// 学年別記号設定
export const ELEMENTARY_NOTATION_RULES: Record<GradeLevel, ElementaryNotation> = {
  '4th': {
    symbols: {
      unknown1: '○',
      unknown2: '□',
      unknown3: '△',
      multiple: '○○'  // 4年生は単純な繰り返し
    },
    expressionRules: {
      multiplication: '○ × 3',
      division: '○ ÷ 2', 
      equality: '○ = 5'
    },
    forbiddenSymbols: ['x', 'y', 'z', 'X', 'Y', 'Z', 'α', 'β', '∀', '∃']
  },
  
  '5th': {
    symbols: {
      unknown1: '○',
      unknown2: '□', 
      unknown3: '△',
      multiple: '②'   // 5年生から数字付き○
    },
    expressionRules: {
      multiplication: '○ × 3 または ③',
      division: '○ ÷ 2',
      equality: '○ = 5'
    },
    forbiddenSymbols: ['x', 'y', 'z', 'X', 'Y', 'Z', 'α', 'β', '∀', '∃']
  },
  
  '6th': {
    symbols: {
      unknown1: '○', 
      unknown2: '□',
      unknown3: '△',
      multiple: '②'   // 6年生は完全に丸数字対応
    },
    expressionRules: {
      multiplication: '○ × 3 = ③',
      division: '○ ÷ 2',
      equality: '○ = 5'
    },
    forbiddenSymbols: ['x', 'y', 'z', 'X', 'Y', 'Z', 'α', 'β', '∀', '∃']
  }
};

// 丸数字記号マッピング
export const CIRCLE_NUMBERS = {
  1: '①', 2: '②', 3: '③', 4: '④', 5: '⑤',
  6: '⑥', 7: '⑦', 8: '⑧', 9: '⑨', 10: '⑩',
  11: '⑪', 12: '⑫', 13: '⑬', 14: '⑭', 15: '⑮',
  16: '⑯', 17: '⑰', 18: '⑱', 19: '⑲', 20: '⑳'
};

// 四角数字記号マッピング  
export const SQUARE_NUMBERS = {
  1: '❶', 2: '❷', 3: '❸', 4: '❹', 5: '❺',
  6: '❻', 7: '❼', 8: '❽', 9: '❾', 10: '❿'
};

export class ElementaryNotationSystem {
  
  // 🎯 代数式を小学生記号に変換
  public convertToElementaryNotation(
    expression: string, 
    grade: GradeLevel,
    problemType: 'basic' | 'ratio' | 'geometry' | 'wordProblem' = 'basic'
  ): {
    converted: string;
    explanation: string;
    symbolGuide: string[];
    examples: string[];
  } {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    let converted = expression;
    const explanations: string[] = [];
    const symbolGuide: string[] = [];
    
    // 禁止記号の検出と変換
    notation.forbiddenSymbols.forEach(forbidden => {
      if (converted.includes(forbidden)) {
        // X, Y, Z を適切な小学生記号に変換
        if (forbidden.toLowerCase() === 'x') {
          converted = converted.replace(new RegExp(forbidden, 'g'), notation.symbols.unknown1);
          explanations.push(`${forbidden} を ${notation.symbols.unknown1} に変更しました`);
          symbolGuide.push(`${notation.symbols.unknown1} は求めたい数を表します`);
        } else if (forbidden.toLowerCase() === 'y') {
          converted = converted.replace(new RegExp(forbidden, 'g'), notation.symbols.unknown2);
          explanations.push(`${forbidden} を ${notation.symbols.unknown2} に変更しました`);
          symbolGuide.push(`${notation.symbols.unknown2} は2つ目の求めたい数を表します`);
        } else if (forbidden.toLowerCase() === 'z') {
          converted = converted.replace(new RegExp(forbidden, 'g'), notation.symbols.unknown3);
          explanations.push(`${forbidden} を ${notation.symbols.unknown3} に変更しました`);
          symbolGuide.push(`${notation.symbols.unknown3} は3つ目の求めたい数を表します`);
        }
      }
    });

    // 倍数表現の最適化
    converted = this.optimizeMultipleExpressions(converted, grade, problemType);
    
    // 問題タイプ別の特殊表現
    const examples = this.generateExamplesByType(problemType, grade);
    
    return {
      converted,
      explanation: explanations.join('、'),
      symbolGuide,
      examples
    };
  }

  // 🧮 つるかめ算専用記号生成
  public generateTsuruKameNotation(
    item1: string, 
    item2: string, 
    grade: GradeLevel
  ): {
    notation: string;
    steps: string[];
    visualAid: string;
  } {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    
    const steps = [
      `${item1}の数を ${notation.symbols.unknown1} とします`,
      `${item2}の数を ${notation.symbols.unknown2} とします`,
      `全部で ${notation.symbols.unknown1} + ${notation.symbols.unknown2} 個`,
      `条件から式を作ります`
    ];

    const visualAid = `
【つるかめ算の考え方】
${notation.symbols.unknown1} = ${item1}の数
${notation.symbols.unknown2} = ${item2}の数

もし全部が${item1}だったら...
もし全部が${item2}だったら...
実際との差を考えます`;

    return {
      notation: `${notation.symbols.unknown1} + ${notation.symbols.unknown2}`,
      steps,
      visualAid
    };
  }

  // 📊 比の問題用記号生成
  public generateRatioNotation(
    ratioItems: string[], 
    grade: GradeLevel
  ): {
    notation: string;
    explanation: string;
    examples: string[];
  } {
    
    if (grade === '4th') {
      // 4年生は比よりも図や○で表現
      return {
        notation: ratioItems.map((_, i) => '○'.repeat(i + 1)).join(' : '),
        explanation: '4年生では比は○の数で表します',
        examples: [
          '○ : ○○ = 1 : 2',
          '○○○ : ○○ = 3 : 2'
        ]
      };
    }

    // 5,6年生は①②③表記
    const symbols = ratioItems.map((_, i) => CIRCLE_NUMBERS[i + 1] || `○${i + 1}`);
    
    return {
      notation: symbols.join(' : '),
      explanation: `比は ${symbols.join('、')} で表します`,
      examples: [
        `太郎:花子 = ① : ② のとき、太郎が${CIRCLE_NUMBERS[1]}、花子が${CIRCLE_NUMBERS[2]}`,
        `全体は ${CIRCLE_NUMBERS[1]} + ${CIRCLE_NUMBERS[2]} = ${CIRCLE_NUMBERS[3]}`
      ]
    };
  }

  // 🔢 速さ問題用記号生成  
  public generateSpeedNotation(grade: GradeLevel): {
    formula: string;
    explanation: string;
    symbolMeaning: Record<string, string>;
  } {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    
    return {
      formula: `${notation.symbols.unknown1} = ${notation.symbols.unknown2} × ${notation.symbols.unknown3}`,
      explanation: '速さの公式を○□△で表現します',
      symbolMeaning: {
        [notation.symbols.unknown1]: 'きょり（道のり）',
        [notation.symbols.unknown2]: 'はやさ（速さ）', 
        [notation.symbols.unknown3]: 'じかん（時間）'
      }
    };
  }

  // 📐 図形問題用記号生成
  public generateGeometryNotation(
    shapeType: 'triangle' | 'rectangle' | 'circle',
    grade: GradeLevel
  ): {
    symbols: Record<string, string>;
    formula: string;
    explanation: string;
  } {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    
    switch (shapeType) {
      case 'triangle':
        return {
          symbols: {
            base: notation.symbols.unknown1,
            height: notation.symbols.unknown2,
            area: notation.symbols.unknown3
          },
          formula: `${notation.symbols.unknown3} = ${notation.symbols.unknown1} × ${notation.symbols.unknown2} ÷ 2`,
          explanation: `三角形の面積：${notation.symbols.unknown1}(底辺) × ${notation.symbols.unknown2}(高さ) ÷ 2`
        };
        
      case 'rectangle':
        return {
          symbols: {
            width: notation.symbols.unknown1,
            height: notation.symbols.unknown2,
            area: notation.symbols.unknown3
          },
          formula: `${notation.symbols.unknown3} = ${notation.symbols.unknown1} × ${notation.symbols.unknown2}`,
          explanation: `長方形の面積：${notation.symbols.unknown1}(たて) × ${notation.symbols.unknown2}(よこ)`
        };
        
      case 'circle':
        return {
          symbols: {
            radius: notation.symbols.unknown1,
            area: notation.symbols.unknown2
          },
          formula: `${notation.symbols.unknown2} = ${notation.symbols.unknown1} × ${notation.symbols.unknown1} × 3.14`,
          explanation: `円の面積：${notation.symbols.unknown1}(半径) × ${notation.symbols.unknown1} × 3.14`
        };
        
      default:
        return {
          symbols: {},
          formula: '',
          explanation: ''
        };
    }
  }

  // 🎮 年齢算用記号生成
  public generateAgeNotation(
    people: string[], 
    grade: GradeLevel
  ): {
    currentAge: Record<string, string>;
    futureAge: Record<string, string>;
    explanation: string;
  } {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    const symbols = [notation.symbols.unknown1, notation.symbols.unknown2, notation.symbols.unknown3];
    
    const currentAge: Record<string, string> = {};
    const futureAge: Record<string, string> = {};
    
    people.forEach((person, index) => {
      const symbol = symbols[index] || `○${index + 1}`;
      currentAge[person] = `${symbol}才`;
      futureAge[person] = `${symbol} + □年後`;
    });

    return {
      currentAge,
      futureAge,
      explanation: `現在の年齢を${symbols.slice(0, people.length).join('、')}で表し、□年後の年齢を考えます`
    };
  }

  // 🔄 表現最適化
  private optimizeMultipleExpressions(
    expression: string, 
    grade: GradeLevel, 
    problemType: string
  ): string {
    
    let optimized = expression;
    
    if (grade === '5th' || grade === '6th') {
      // 2X → ②、3X → ③ のような変換
      for (let i = 2; i <= 10; i++) {
        const pattern = new RegExp(`${i}○`, 'g');
        const circleNum = CIRCLE_NUMBERS[i];
        if (circleNum) {
          optimized = optimized.replace(pattern, circleNum);
        }
      }
      
      // ○×2 → ② のような変換
      for (let i = 2; i <= 10; i++) {
        const pattern = new RegExp(`○\\s*×\\s*${i}`, 'g');
        const circleNum = CIRCLE_NUMBERS[i];
        if (circleNum) {
          optimized = optimized.replace(pattern, circleNum);
        }
      }
    }
    
    return optimized;
  }

  // 📝 問題タイプ別例文生成
  private generateExamplesByType(
    problemType: string, 
    grade: GradeLevel
  ): string[] {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    
    switch (problemType) {
      case 'basic':
        return [
          `${notation.symbols.unknown1} + 5 = 12 のとき、${notation.symbols.unknown1} = 7`,
          `${notation.symbols.unknown1} × 3 = 15 のとき、${notation.symbols.unknown1} = 5`
        ];
        
      case 'ratio':
        if (grade === '4th') {
          return [
            '○ : ○○ = 1 : 2',
            '○○○ : ○ = 3 : 1'
          ];
        }
        return [
          `太郎:花子 = ① : ② のとき、合計は ${CIRCLE_NUMBERS[3]}`,
          `比が 2:3 なら ${CIRCLE_NUMBERS[2]} : ${CIRCLE_NUMBERS[3]}`
        ];
        
      case 'geometry':
        return [
          `面積 = ${notation.symbols.unknown1} × ${notation.symbols.unknown2}`,
          `周りの長さ = ${notation.symbols.unknown1} × 4（正方形の場合）`
        ];
        
      case 'wordProblem':
        return [
          `リンゴが ${notation.symbols.unknown1} 個、ミカンが ${notation.symbols.unknown2} 個`,
          `全部で ${notation.symbols.unknown1} + ${notation.symbols.unknown2} = ${notation.symbols.unknown3} 個`
        ];
        
      default:
        return [
          `${notation.symbols.unknown1} = 求めたい数`,
          `${notation.symbols.unknown2} = 2つ目の数`
        ];
    }
  }

  // ✅ 記号使用チェック
  public validateNotation(
    expression: string, 
    grade: GradeLevel
  ): {
    isValid: boolean;
    violations: string[];
    suggestions: string[];
  } {
    
    const notation = ELEMENTARY_NOTATION_RULES[grade];
    const violations: string[] = [];
    const suggestions: string[] = [];
    
    // 禁止記号チェック
    notation.forbiddenSymbols.forEach(forbidden => {
      if (expression.includes(forbidden)) {
        violations.push(`${forbidden} は小学生では使いません`);
        
        if (forbidden.toLowerCase() === 'x') {
          suggestions.push(`${forbidden} の代わりに ${notation.symbols.unknown1} を使いましょう`);
        } else if (forbidden.toLowerCase() === 'y') {
          suggestions.push(`${forbidden} の代わりに ${notation.symbols.unknown2} を使いましょう`);
        }
      }
    });
    
    // 複雑な記号チェック
    if (expression.includes('∑') || expression.includes('∫') || expression.includes('∂')) {
      violations.push('数学記号が複雑すぎます');
      suggestions.push('もっと簡単な記号を使いましょう');
    }
    
    return {
      isValid: violations.length === 0,
      violations,
      suggestions
    };
  }

  // 📚 学習段階別記号指導
  public generateNotationLessons(grade: GradeLevel): Array<{
    level: string;
    symbols: string[];
    explanation: string;
    practice: string[];
  }> {
    
    const lessons = [];
    
    if (grade === '4th') {
      lessons.push({
        level: '初級',
        symbols: ['○', '□'],
        explanation: '○と□で数を表してみましょう',
        practice: [
          '○ + 3 = 8 のとき、○ = 5',
          '□ × 2 = 10 のとき、□ = 5'
        ]
      });
    }
    
    if (grade === '5th' || grade === '6th') {
      lessons.push({
        level: '中級',
        symbols: ['①', '②', '③'],
        explanation: '①②③で比や倍数を表してみましょう',
        practice: [
          '太郎:花子 = ① : ② のとき、太郎が①、花子が②',
          '○の3倍は③と書けます'
        ]
      });
    }
    
    return lessons;
  }
}

// シングルトンインスタンス
export const elementaryNotationSystem = new ElementaryNotationSystem();