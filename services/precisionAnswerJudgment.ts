// 🎯 超高精度回答判定システム
// Ultra-Precision Answer Judgment System - 正解を「惜しい」と誤判定する問題の完全解決

export interface AnswerComparisonResult {
  isExactMatch: boolean;
  isNearMatch: boolean;
  similarity: number;
  verdict: 'correct' | 'close' | 'incorrect';
  feedback: string;
  explanation: string;
}

export interface AnswerValidation {
  originalInput: string;
  normalizedInput: string | number;
  expectedAnswer: string | number;
  comparisonType: 'exact_string' | 'exact_number' | 'approximate_number' | 'pattern_match';
  tolerance?: number;
}

export class PrecisionAnswerJudgment {
  
  // 🎯 完全一致の厳密判定（最優先）
  public judgeAnswer(
    studentAnswer: string,
    correctAnswer: string | number,
    tolerance: number = 0.0001
  ): AnswerComparisonResult {
    
    console.log('🔍 回答判定開始:', { studentAnswer, correctAnswer, tolerance });
    
    // ステップ1: 完全文字列一致チェック（最優先）
    const exactStringMatch = this.checkExactStringMatch(studentAnswer, correctAnswer);
    if (exactStringMatch.isExactMatch) {
      console.log('✅ 完全文字列一致検出');
      return exactStringMatch;
    }
    
    // ステップ2: 正規化後の数値一致チェック
    const numericMatch = this.checkNumericMatch(studentAnswer, correctAnswer, tolerance);
    if (numericMatch.isExactMatch) {
      console.log('✅ 数値完全一致検出');
      return numericMatch;
    }
    
    // ステップ3: 近似一致チェック（明確な間違いを除く）
    const approximateMatch = this.checkApproximateMatch(studentAnswer, correctAnswer, tolerance);
    if (approximateMatch.isNearMatch) {
      console.log('⚠️ 近似一致検出');
      return approximateMatch;
    }
    
    // ステップ4: 不正解
    console.log('❌ 不正解判定');
    return this.createIncorrectResult(studentAnswer, correctAnswer);
  }
  
  // 🎯 完全文字列一致チェック
  private checkExactStringMatch(
    studentAnswer: string,
    correctAnswer: string | number
  ): AnswerComparisonResult {
    
    const student = studentAnswer.trim();
    const correct = String(correctAnswer).trim();
    
    // 完全一致
    if (student === correct) {
      return {
        isExactMatch: true,
        isNearMatch: false,
        similarity: 1.0,
        verdict: 'correct',
        feedback: '🎉 正解！完璧です！',
        explanation: `入力「${student}」は正解「${correct}」と完全に一致しています。`
      };
    }
    
    // 大文字小文字を無視した一致
    if (student.toLowerCase() === correct.toLowerCase()) {
      return {
        isExactMatch: true,
        isNearMatch: false,
        similarity: 1.0,
        verdict: 'correct',
        feedback: '🎉 正解！（大文字小文字の違いはありますが、内容は完璧です！）',
        explanation: `入力「${student}」は正解「${correct}」と内容的に一致しています。`
      };
    }
    
    // スペースを除去した一致
    if (student.replace(/\s+/g, '') === correct.replace(/\s+/g, '')) {
      return {
        isExactMatch: true,
        isNearMatch: false,
        similarity: 1.0,
        verdict: 'correct',
        feedback: '🎉 正解！（スペースの違いはありますが、内容は完璧です！）',
        explanation: `入力「${student}」は正解「${correct}」と内容的に一致しています。`
      };
    }
    
    return {
      isExactMatch: false,
      isNearMatch: false,
      similarity: 0,
      verdict: 'incorrect',
      feedback: '',
      explanation: ''
    };
  }
  
  // 🎯 数値完全一致チェック
  private checkNumericMatch(
    studentAnswer: string,
    correctAnswer: string | number,
    tolerance: number
  ): AnswerComparisonResult {
    
    const studentNum = this.parseNumber(studentAnswer);
    const correctNum = this.parseNumber(correctAnswer);
    
    // 数値変換に失敗した場合はスキップ
    if (studentNum === null || correctNum === null) {
      return {
        isExactMatch: false,
        isNearMatch: false,
        similarity: 0,
        verdict: 'incorrect',
        feedback: '',
        explanation: ''
      };
    }
    
    // 完全一致（浮動小数点誤差も考慮）
    const difference = Math.abs(studentNum - correctNum);
    
    if (difference === 0) {
      return {
        isExactMatch: true,
        isNearMatch: false,
        similarity: 1.0,
        verdict: 'correct',
        feedback: '🎉 正解！数値が完全に一致しています！',
        explanation: `入力された数値 ${studentNum} は正解 ${correctNum} と完全に一致しています。`
      };
    }
    
    // 極小の浮動小数点誤差（実質的な完全一致）
    if (difference < tolerance) {
      return {
        isExactMatch: true,
        isNearMatch: false,
        similarity: 1.0,
        verdict: 'correct',
        feedback: '🎉 正解！数値が完全に一致しています！',
        explanation: `入力された数値 ${studentNum} は正解 ${correctNum} と実質的に一致しています（差: ${difference}）。`
      };
    }
    
    return {
      isExactMatch: false,
      isNearMatch: false,
      similarity: 0,
      verdict: 'incorrect',
      feedback: '',
      explanation: ''
    };
  }
  
  // 🎯 近似一致チェック（計算ミスなど）
  private checkApproximateMatch(
    studentAnswer: string,
    correctAnswer: string | number,
    tolerance: number
  ): AnswerComparisonResult {
    
    const studentNum = this.parseNumber(studentAnswer);
    const correctNum = this.parseNumber(correctAnswer);
    
    if (studentNum === null || correctNum === null) {
      return {
        isExactMatch: false,
        isNearMatch: false,
        similarity: 0,
        verdict: 'incorrect',
        feedback: '',
        explanation: ''
      };
    }
    
    const difference = Math.abs(studentNum - correctNum);
    const relativeError = Math.abs(difference / correctNum);
    
    // 5%以内の相対誤差は「惜しい」
    if (relativeError <= 0.05 && difference > tolerance) {
      const similarity = Math.max(0, 1 - relativeError);
      return {
        isExactMatch: false,
        isNearMatch: true,
        similarity,
        verdict: 'close',
        feedback: '💯 惜しい！計算を確認してみてください。',
        explanation: `入力 ${studentNum} は正解 ${correctNum} にとても近いです（差: ${difference.toFixed(4)}）。`
      };
    }
    
    // 10%以内の相対誤差は「近い」
    if (relativeError <= 0.10 && difference > tolerance) {
      const similarity = Math.max(0, 1 - relativeError);
      return {
        isExactMatch: false,
        isNearMatch: true,
        similarity,
        verdict: 'close',
        feedback: '🤔 近いですが、もう一度計算してみてください。',
        explanation: `入力 ${studentNum} は正解 ${correctNum} に近いです（差: ${difference.toFixed(4)}）。`
      };
    }
    
    return {
      isExactMatch: false,
      isNearMatch: false,
      similarity: 0,
      verdict: 'incorrect',
      feedback: '',
      explanation: ''
    };
  }
  
  // 🎯 不正解結果生成
  private createIncorrectResult(
    studentAnswer: string,
    correctAnswer: string | number
  ): AnswerComparisonResult {
    return {
      isExactMatch: false,
      isNearMatch: false,
      similarity: 0,
      verdict: 'incorrect',
      feedback: '❌ 残念、違います。もう一度考えてみてください。',
      explanation: `入力「${studentAnswer}」は正解「${correctAnswer}」と異なります。`
    };
  }
  
  // 🎯 安全な数値変換
  private parseNumber(value: string | number): number | null {
    if (typeof value === 'number') {
      return isNaN(value) ? null : value;
    }
    
    if (typeof value !== 'string') {
      return null;
    }
    
    // 文字列の正規化
    const normalized = value
      .trim()
      .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xFEE0)) // 全角数字を半角に
      .replace(/[．]/g, '.') // 全角ピリオドを半角に
      .replace(/[，]/g, '') // カンマ除去
      .replace(/\s+/g, ''); // スペース除去
    
    // 数値変換試行
    const parsed = parseFloat(normalized);
    
    if (isNaN(parsed) || !isFinite(parsed)) {
      return null;
    }
    
    return parsed;
  }
  
  // 🎯 分数対応（例: "1/2" = 0.5）
  public parseFraction(fractionStr: string): number | null {
    const match = fractionStr.trim().match(/^(\d+)\/(\d+)$/);
    if (match) {
      const numerator = parseInt(match[1]);
      const denominator = parseInt(match[2]);
      if (denominator !== 0) {
        return numerator / denominator;
      }
    }
    return null;
  }
  
  // 🎯 パーセント対応（例: "50%" = 0.5）
  public parsePercentage(percentStr: string): number | null {
    const match = percentStr.trim().match(/^(\d*\.?\d+)%$/);
    if (match) {
      return parseFloat(match[1]) / 100;
    }
    return null;
  }
  
  // 🎯 複数形式対応の統合判定
  public judgeAnswerFlexible(
    studentAnswer: string,
    correctAnswer: string | number,
    options: {
      allowFractions?: boolean;
      allowPercentages?: boolean;
      tolerance?: number;
    } = {}
  ): AnswerComparisonResult {
    
    const {
      allowFractions = true,
      allowPercentages = true,
      tolerance = 0.0001
    } = options;
    
    // 基本判定
    let result = this.judgeAnswer(studentAnswer, correctAnswer, tolerance);
    if (result.isExactMatch) {
      return result;
    }
    
    // 分数判定
    if (allowFractions) {
      const fractionValue = this.parseFraction(studentAnswer);
      if (fractionValue !== null) {
        result = this.judgeAnswer(String(fractionValue), correctAnswer, tolerance);
        if (result.isExactMatch) {
          result.feedback = '🎉 正解！分数の答えが正しいです！';
          return result;
        }
      }
    }
    
    // パーセント判定
    if (allowPercentages) {
      const percentValue = this.parsePercentage(studentAnswer);
      if (percentValue !== null) {
        result = this.judgeAnswer(String(percentValue), correctAnswer, tolerance);
        if (result.isExactMatch) {
          result.feedback = '🎉 正解！パーセントの答えが正しいです！';
          return result;
        }
      }
    }
    
    return result;
  }
  
  // 🎯 デバッグ用詳細ログ
  public debugAnswerComparison(
    studentAnswer: string,
    correctAnswer: string | number
  ): void {
    console.log('🔍 回答判定デバッグ:');
    console.log('  学生回答:', studentAnswer, '(型:', typeof studentAnswer, ')');
    console.log('  正解:', correctAnswer, '(型:', typeof correctAnswer, ')');
    console.log('  文字列化正解:', String(correctAnswer));
    console.log('  学生回答（正規化）:', this.parseNumber(studentAnswer));
    console.log('  正解（正規化）:', this.parseNumber(correctAnswer));
    
    const result = this.judgeAnswer(studentAnswer, correctAnswer);
    console.log('  判定結果:', result);
  }
}

// シングルトンインスタンス
export const precisionAnswerJudgment = new PrecisionAnswerJudgment();

// 簡易使用関数
export const judgeStudentAnswer = (
  studentAnswer: string,
  correctAnswer: string | number,
  tolerance: number = 0.0001
): AnswerComparisonResult => {
  return precisionAnswerJudgment.judgeAnswer(studentAnswer, correctAnswer, tolerance);
};

// 使用例:
// const result = judgeStudentAnswer("4.8", "4.8");
// console.log(result.feedback); // "🎉 正解！完璧です！"