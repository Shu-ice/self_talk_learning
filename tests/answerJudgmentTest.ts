// 🧪 回答判定システム完全テスト
// Comprehensive Answer Judgment System Test Suite

import { precisionAnswerJudgment, judgeStudentAnswer } from '../services/precisionAnswerJudgment';
import { answerValidationIntegration } from '../services/answerValidationIntegration';

export interface TestCase {
  description: string;
  studentAnswer: string;
  correctAnswer: string | number;
  expectedVerdict: 'correct' | 'close' | 'incorrect';
  expectedFeedback: string;
  tolerance?: number;
}

export interface TestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  failedCases: Array<{
    test: TestCase;
    result: any;
    reason: string;
  }>;
}

export class AnswerJudgmentTestSuite {
  
  // 🧪 致命的バグのテストケース（4.8 = 4.8 問題）
  private criticalBugTests: TestCase[] = [
    {
      description: '【致命的バグ】4.8 = 4.8 完全一致',
      studentAnswer: '4.8',
      correctAnswer: '4.8',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '【致命的バグ】4.8 = 4.8 (数値型)',
      studentAnswer: '4.8',
      correctAnswer: 4.8,
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '【致命的バグ】15 = 15 整数完全一致',
      studentAnswer: '15',
      correctAnswer: '15',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '【致命的バグ】0.5 = 0.5 小数完全一致',
      studentAnswer: '0.5',
      correctAnswer: 0.5,
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    }
  ];
  
  // 🧪 数値精度テストケース
  private precisionTests: TestCase[] = [
    {
      description: '浮動小数点誤差テスト',
      studentAnswer: '0.1',
      correctAnswer: 0.1,
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '計算結果の誤差（4.79 vs 4.8）',
      studentAnswer: '4.79',
      correctAnswer: 4.8,
      expectedVerdict: 'close',
      expectedFeedback: '💯 惜しい！'
    },
    {
      description: '大きな誤差（4.5 vs 4.8）',
      studentAnswer: '4.5',
      correctAnswer: 4.8,
      expectedVerdict: 'close',
      expectedFeedback: '🤔 近いですが'
    },
    {
      description: '明らかな間違い（10 vs 4.8）',
      studentAnswer: '10',
      correctAnswer: 4.8,
      expectedVerdict: 'incorrect',
      expectedFeedback: '❌ 残念、違います'
    }
  ];
  
  // 🧪 文字列・フォーマットテスト
  private formatTests: TestCase[] = [
    {
      description: 'スペース込み完全一致',
      studentAnswer: ' 4.8 ',
      correctAnswer: '4.8',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '全角数字の正規化',
      studentAnswer: '４．８',
      correctAnswer: '4.8',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: 'カンマ区切り数字',
      studentAnswer: '1,000',
      correctAnswer: 1000,
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '分数入力（1/2 = 0.5）',
      studentAnswer: '1/2',
      correctAnswer: 0.5,
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！分数の答えが正しいです！'
    },
    {
      description: 'パーセント入力（50% = 0.5）',
      studentAnswer: '50%',
      correctAnswer: 0.5,
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！パーセントの答えが正しいです！'
    }
  ];
  
  // 🧪 文字列回答テスト
  private stringTests: TestCase[] = [
    {
      description: '単語完全一致',
      studentAnswer: '速さ',
      correctAnswer: '速さ',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！完璧です！'
    },
    {
      description: '大文字小文字違い',
      studentAnswer: 'area',
      correctAnswer: 'Area',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！'
    },
    {
      description: 'スペース違い',
      studentAnswer: '三角形の面積',
      correctAnswer: '三角形 の 面積',
      expectedVerdict: 'correct',
      expectedFeedback: '🎉 正解！'
    }
  ];
  
  // 🎯 全テスト実行
  public runAllTests(): TestResults {
    console.log('\n🧪🧪🧪 回答判定システム完全テスト開始 🧪🧪🧪');
    console.log('='.repeat(80));
    
    const allTests = [
      ...this.criticalBugTests,
      ...this.precisionTests,
      ...this.formatTests,
      ...this.stringTests
    ];
    
    let passedTests = 0;
    const failedCases: any[] = [];
    
    for (let i = 0; i < allTests.length; i++) {
      const test = allTests[i];
      console.log(`\\n🧪 テスト ${i + 1}/${allTests.length}: ${test.description}`);
      console.log(`   入力: "${test.studentAnswer}" vs 正解: "${test.correctAnswer}"`);
      
      try {
        const result = precisionAnswerJudgment.judgeAnswerFlexible(
          test.studentAnswer,
          test.correctAnswer,
          { tolerance: test.tolerance }
        );
        
        const passed = this.validateTestResult(result, test);
        
        if (passed) {
          console.log(`   ✅ 合格: ${result.verdict} - ${result.feedback}`);
          passedTests++;
        } else {
          console.log(`   ❌ 失敗: 期待 ${test.expectedVerdict}, 実際 ${result.verdict}`);
          console.log(`   実際のフィードバック: ${result.feedback}`);
          failedCases.push({
            test,
            result,
            reason: `期待: ${test.expectedVerdict}, 実際: ${result.verdict}`
          });
        }
        
      } catch (error) {
        console.log(`   💥 エラー: ${error}`);
        failedCases.push({
          test,
          result: null,
          reason: `実行エラー: ${error}`
        });
      }
    }
    
    const successRate = Math.round((passedTests / allTests.length) * 100);
    
    console.log('\\n📊 テスト結果サマリー');
    console.log('='.repeat(50));
    console.log(`🎯 総テスト数: ${allTests.length}`);
    console.log(`✅ 成功: ${passedTests}`);
    console.log(`❌ 失敗: ${allTests.length - passedTests}`);
    console.log(`📈 成功率: ${successRate}%`);
    
    if (failedCases.length > 0) {
      console.log('\\n❌ 失敗したテスト:');
      failedCases.forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.test.description}`);
        console.log(`      理由: ${failure.reason}`);
      });
    }
    
    if (successRate === 100) {
      console.log('\\n🎉🎉🎉 全テスト合格！回答判定システム完璧！ 🎉🎉🎉');
    } else if (successRate >= 95) {
      console.log('\\n✅ 回答判定システム高品質（95%以上成功）');
    } else if (successRate >= 90) {
      console.log('\\n⚠️ 回答判定システム要改善（90%以上だが100%未達）');
    } else {
      console.log('\\n🚨 回答判定システム重大な問題あり（90%未満）');
    }
    
    return {
      totalTests: allTests.length,
      passedTests,
      failedTests: allTests.length - passedTests,
      successRate,
      failedCases
    };
  }
  
  // 🎯 特定のバグテスト（4.8問題）
  public testCriticalBug(): TestResults {
    console.log('\\n🚨 致命的バグテスト（4.8 = 4.8 問題）');
    console.log('='.repeat(50));
    
    let passedTests = 0;
    const failedCases: any[] = [];
    
    for (const test of this.criticalBugTests) {
      console.log(`\\n🧪 ${test.description}`);
      
      const result = precisionAnswerJudgment.judgeAnswer(
        test.studentAnswer,
        test.correctAnswer
      );
      
      if (result.verdict === 'correct' && result.isExactMatch) {
        console.log('   ✅ 合格: 完全一致を正しく検出');
        passedTests++;
      } else {
        console.log(`   ❌ 失敗: ${result.verdict} - ${result.feedback}`);
        failedCases.push({ test, result, reason: '完全一致の検出失敗' });
      }
    }
    
    const successRate = Math.round((passedTests / this.criticalBugTests.length) * 100);
    
    console.log(`\\n📊 致命的バグテスト結果: ${successRate}% (${passedTests}/${this.criticalBugTests.length})`);
    
    if (successRate === 100) {
      console.log('🎉 4.8 = 4.8 問題完全解決！');
    } else {
      console.log('🚨 まだ4.8 = 4.8 問題が残っています！');
    }
    
    return {
      totalTests: this.criticalBugTests.length,
      passedTests,
      failedTests: this.criticalBugTests.length - passedTests,
      successRate,
      failedCases
    };
  }
  
  // 🎯 テスト結果検証
  private validateTestResult(result: any, test: TestCase): boolean {
    // 判定結果の確認
    if (result.verdict !== test.expectedVerdict) {
      return false;
    }
    
    // フィードバックの確認（部分マッチ）
    if (test.expectedFeedback && 
        !result.feedback.includes(test.expectedFeedback.substring(0, 5))) {
      return false;
    }
    
    return true;
  }
  
  // 🎯 パフォーマンステスト
  public runPerformanceTest(): void {
    console.log('\\n⚡ パフォーマンステスト');
    console.log('='.repeat(30));
    
    const iterations = 1000;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      precisionAnswerJudgment.judgeAnswer('4.8', '4.8');
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / iterations;
    
    console.log(`📊 ${iterations}回実行 平均時間: ${avgTime.toFixed(4)}ms`);
    
    if (avgTime < 1) {
      console.log('✅ パフォーマンス優秀（1ms未満）');
    } else if (avgTime < 5) {
      console.log('⚠️ パフォーマンス良好（5ms未満）');
    } else {
      console.log('🚨 パフォーマンス要改善（5ms以上）');
    }
  }
  
  // 🎯 統合テスト（実際のAI連携）
  public async runIntegrationTest(): Promise<void> {
    console.log('\\n🔗 統合テスト（AI連携なし）');
    console.log('='.repeat(40));
    
    // AI連携は実際のAPIキーが必要なので、ここでは設定のテストのみ
    answerValidationIntegration.updateConfig({
      useClientSideValidation: true,
      strictMode: true,
      numericTolerance: 0.0001
    });
    
    console.log('✅ 統合システム設定完了');
    console.log('💡 実際のAI連携テストには有効なAPIキーが必要です');
  }
  
  // 🎯 デバッグテスト
  public runDebugTest(): void {
    console.log('\\n🐛 デバッグテスト');
    console.log('='.repeat(30));
    
    precisionAnswerJudgment.debugAnswerComparison('4.8', '4.8');
    precisionAnswerJudgment.debugAnswerComparison('4.8', 4.8);
    precisionAnswerJudgment.debugAnswerComparison('速さ', '速さ');
  }
}

// テスト実行関数
export const runAnswerJudgmentTests = (): TestResults => {
  const testSuite = new AnswerJudgmentTestSuite();
  return testSuite.runAllTests();
};

export const testCriticalBugFix = (): TestResults => {
  const testSuite = new AnswerJudgmentTestSuite();
  return testSuite.testCriticalBug();
};

export const runPerformanceTest = (): void => {
  const testSuite = new AnswerJudgmentTestSuite();
  testSuite.runPerformanceTest();
};

export const runDebugTest = (): void => {
  const testSuite = new AnswerJudgmentTestSuite();
  testSuite.runDebugTest();
};

// メイン実行
if (require.main === module) {
  const testSuite = new AnswerJudgmentTestSuite();
  
  console.log('🧪 回答判定システム完全テストスイート');
  console.log('=====================================');
  
  // 1. 致命的バグテスト
  testSuite.testCriticalBug();
  
  // 2. 全テスト実行
  testSuite.runAllTests();
  
  // 3. パフォーマンステスト
  testSuite.runPerformanceTest();
  
  // 4. デバッグテスト
  testSuite.runDebugTest();
  
  // 5. 統合テスト
  testSuite.runIntegrationTest();
  
  console.log('\\n🎯 全テスト完了！');
}