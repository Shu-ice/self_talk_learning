// 🧪 最難関レベル難易度適正テスト
// Elite Difficulty Appropriateness Test Suite

import { eliteDifficultyController } from '../services/eliteDifficultyController';
import { eliteProblemDatabase } from '../services/eliteProblemDatabase';

export interface DifficultyTestCase {
  description: string;
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite';
  difficulty: number;
  problemContent?: string;
  expectedResult: boolean;
  reasoning: string;
}

export interface EliteProblemTestCase {
  description: string;
  problemContent: string;
  expectedComplexity: number;
  shouldPass: boolean;
}

export class EliteDifficultyTestSuite {
  
  // 🧪 学校レベル別難易度適正テスト
  private readonly DIFFICULTY_APPROPRIATENESS_TESTS: DifficultyTestCase[] = [
    // 基礎校テスト
    {
      description: '基礎校 - 適正難易度（難易度3）',
      schoolLevel: 'basic',
      difficulty: 3,
      expectedResult: true,
      reasoning: '基礎校には2-4が適正'
    },
    {
      description: '基礎校 - 低すぎる難易度（難易度1）',
      schoolLevel: 'basic', 
      difficulty: 1,
      expectedResult: false,
      reasoning: '基礎校でも最低2以上が必要'
    },
    {
      description: '基礎校 - 高すぎる難易度（難易度6）',
      schoolLevel: 'basic',
      difficulty: 6,
      expectedResult: false,
      reasoning: '基礎校には4以上は不適切'
    },
    
    // 標準校テスト
    {
      description: '標準校 - 適正難易度（難易度5）',
      schoolLevel: 'standard',
      difficulty: 5,
      expectedResult: true,
      reasoning: '標準校には4-6が適正'
    },
    
    // 上位校テスト  
    {
      description: '上位校 - 適正難易度（難易度7）',
      schoolLevel: 'advanced',
      difficulty: 7,
      expectedResult: true,
      reasoning: '上位校には6-8が適正'
    },
    
    // 最難関校テスト（重要）
    {
      description: '最難関校 - 最低適正難易度（難易度8）',
      schoolLevel: 'elite',
      difficulty: 8,
      expectedResult: true,
      reasoning: '最難関校は最低でも8以上'
    },
    {
      description: '最難関校 - 最高難易度（難易度10）',
      schoolLevel: 'elite',
      difficulty: 10,
      expectedResult: true,
      reasoning: '最難関校は10まで対応'
    },
    {
      description: '🚨 最難関校 - 不適切な低難易度（難易度5）',
      schoolLevel: 'elite',
      difficulty: 5,
      expectedResult: false,
      reasoning: '最難関校に標準レベルは絶対禁止'
    },
    {
      description: '🚨 最難関校 - 不適切な低難易度（難易度7）',
      schoolLevel: 'elite',
      difficulty: 7,
      expectedResult: false,
      reasoning: '最難関校に上位校レベルも不適切'
    }
  ];
  
  // 🧪 最難関問題内容テスト
  private readonly ELITE_PROBLEM_CONTENT_TESTS: EliteProblemTestCase[] = [
    {
      description: '最難関適正問題 - 複合図形・比・論理思考',
      problemContent: `
      正方形の内部に点Pをとり、各頂点との距離の比が2:3:4となる。
      この時の面積比を求め、作図で点Pの位置を示し、根拠を説明せよ。
      `,
      expectedComplexity: 9,
      shouldPass: true
    },
    {
      description: '🚨 不適切な簡単問題 - 基本計算',
      problemContent: '12 + 8 = ?',
      expectedComplexity: 1,
      shouldPass: false
    },
    {
      description: '🚨 不適切な標準問題 - 単純図形',
      problemContent: '長方形の面積を求めなさい。たて5cm、よこ3cm',
      expectedComplexity: 2,
      shouldPass: false
    },
    {
      description: '最難関適正問題 - 数の性質・複合条件',
      problemContent: `
      3桁の自然数Nで、7で割った余りが3、各桁の和が18、
      正の約数が12個のものをすべて求めよ。
      `,
      expectedComplexity: 10,
      shouldPass: true
    }
  ];
  
  // 🎯 メイン難易度テスト実行
  public runDifficultyAppropriatenessTest(): {
    overallSuccess: boolean;
    testResults: Record<string, { success: boolean; details: string[] }>;
    eliteSpecificResults: { passed: number; total: number; successRate: number };
  } {
    
    console.log('\n🧪🧪🧪 最難関レベル難易度適正テスト開始 🧪🧪🧪');
    console.log('='.repeat(80));
    console.log('🎯 目標: 最難関校に簡単すぎる問題が出る問題の完全解決');
    console.log('🔍 重点: elite レベルの難易度基準厳格遵守');
    console.log('='.repeat(80));
    
    const testResults: Record<string, { success: boolean; details: string[] }> = {};
    let totalTests = 0;
    let passedTests = 0;
    
    // elite専用統計
    let elitePassed = 0;
    let eliteTotal = 0;
    
    console.log('\n📊 学校レベル別難易度適正性テスト');
    console.log('-'.repeat(60));
    
    this.DIFFICULTY_APPROPRIATENESS_TESTS.forEach((test, index) => {
      totalTests++;
      if (test.schoolLevel === 'elite') eliteTotal++;
      
      console.log(`\\n🧪 テスト ${index + 1}: ${test.description}`);
      
      const result = eliteDifficultyController.isDifficultyAppropriate(
        test.difficulty,
        test.schoolLevel,
        test.problemContent
      );
      
      const passed = result === test.expectedResult;
      
      if (passed) {
        console.log(`   ✅ 合格: 期待通り${test.expectedResult ? '適正' : '不適正'}と判定`);
        console.log(`   💡 理由: ${test.reasoning}`);
        passedTests++;
        if (test.schoolLevel === 'elite') elitePassed++;
      } else {
        console.log(`   ❌ 失敗: 期待${test.expectedResult ? '適正' : '不適正'}、実際${result ? '適正' : '不適正'}`);
        console.log(`   🐛 これは重大な問題です: ${test.reasoning}`);
      }
    });
    
    // elite レベル専用結果
    const eliteSuccessRate = Math.round((elitePassed / eliteTotal) * 100);
    
    console.log('\\n🏆 最難関校レベル専用結果');
    console.log('-'.repeat(40));
    console.log(`📊 最難関テスト成功率: ${eliteSuccessRate}% (${elitePassed}/${eliteTotal})`);
    
    if (eliteSuccessRate === 100) {
      console.log('🎉 最難関校の難易度制御は完璧です！');
    } else {
      console.log('🚨 最難関校の難易度制御に問題があります！');
    }
    
    testResults.difficultyAppropriateness = {
      success: passedTests === totalTests,
      details: [
        `総テスト: ${totalTests}`,
        `成功: ${passedTests}`,
        `成功率: ${Math.round((passedTests/totalTests)*100)}%`,
        `最難関専用成功率: ${eliteSuccessRate}%`
      ]
    };
    
    return {
      overallSuccess: passedTests === totalTests,
      testResults,
      eliteSpecificResults: {
        passed: elitePassed,
        total: eliteTotal,
        successRate: eliteSuccessRate
      }
    };
  }
  
  // 🧪 最難関問題内容テスト
  public runEliteProblemContentTest(): {
    success: boolean;
    details: string[];
    problematicProblems: string[];
  } {
    
    console.log('\\n🏆 最難関問題内容適正性テスト');
    console.log('-'.repeat(50));
    
    let passedTests = 0;
    const problematicProblems: string[] = [];
    const details: string[] = [];
    
    this.ELITE_PROBLEM_CONTENT_TESTS.forEach((test, index) => {
      console.log(`\\n🧪 内容テスト ${index + 1}: ${test.description}`);
      
      const isValid = eliteDifficultyController.isDifficultyAppropriate(
        8, // 最難関の最低難易度
        'elite',
        test.problemContent
      );
      
      const passed = isValid === test.shouldPass;
      
      if (passed) {
        console.log(`   ✅ 合格: 期待通り${test.shouldPass ? '適正' : '不適正'}と判定`);
        passedTests++;
      } else {
        console.log(`   ❌ 失敗: 期待${test.shouldPass ? '適正' : '不適正'}、実際${isValid ? '適正' : '不適正'}`);
        if (!test.shouldPass && isValid) {
          problematicProblems.push(test.description);
          console.log('   🚨 簡単すぎる問題が最難関適正と誤判定されました！');
        }
      }
    });
    
    const successRate = Math.round((passedTests / this.ELITE_PROBLEM_CONTENT_TESTS.length) * 100);
    
    details.push(`内容テスト成功率: ${successRate}%`);
    details.push(`問題のある判定: ${problematicProblems.length}件`);
    
    return {
      success: passedTests === this.ELITE_PROBLEM_CONTENT_TESTS.length,
      details,
      problematicProblems
    };
  }
  
  // 🧪 最難関問題データベーステスト
  public runEliteProblemDatabaseTest(): {
    success: boolean;
    stats: any;
    qualityCheck: string[];
  } {
    
    console.log('\\n💎 最難関問題データベース品質テスト');
    console.log('-'.repeat(50));
    
    const stats = eliteProblemDatabase.getEliteProblemStats();
    const qualityCheck: string[] = [];
    
    console.log(`📊 データベース統計:`);
    console.log(`   総問題数: ${stats.totalProblems}`);
    console.log(`   平均難易度: ${stats.averageDifficulty}`);
    console.log(`   平均所要時間: ${stats.averageTime}分`);
    console.log(`   教科別分布:`, stats.bySubject);
    console.log(`   難易度別分布:`, stats.byDifficulty);
    
    // 品質チェック
    if (stats.averageDifficulty >= 8.5) {
      console.log('✅ 平均難易度は最難関基準を満たしています');
      qualityCheck.push('平均難易度: 適正');
    } else {
      console.log('❌ 平均難易度が最難関基準を下回っています');
      qualityCheck.push('平均難易度: 要改善');
    }
    
    if (stats.averageTime >= 20) {
      console.log('✅ 平均所要時間は十分な思考時間を確保');
      qualityCheck.push('所要時間: 適正');
    } else {
      console.log('⚠️ 平均所要時間が短めです');
      qualityCheck.push('所要時間: 要確認');
    }
    
    // 各教科の問題数チェック
    const minProblemsPerSubject = 2;
    let subjectBalance = true;
    
    Object.entries(stats.bySubject).forEach(([subject, count]) => {
      if (count < minProblemsPerSubject) {
        console.log(`⚠️ ${subject}の問題数が不足 (${count}問)`);
        qualityCheck.push(`${subject}: 問題数不足`);
        subjectBalance = false;
      } else {
        console.log(`✅ ${subject}: ${count}問（十分）`);
      }
    });
    
    const overallQuality = stats.averageDifficulty >= 8.5 && subjectBalance;
    
    return {
      success: overallQuality,
      stats,
      qualityCheck
    };
  }
  
  // 🎯 統合テスト実行
  public runAllEliteTests(): {
    overallSuccess: boolean;
    summary: string;
    detailedResults: Record<string, any>;
  } {
    
    console.log('\\n🏆🏆🏆 最難関レベル完全テストスイート実行 🏆🏆🏆');
    console.log('='.repeat(80));
    console.log('🎯 目標: 「最難関なのに簡単な問題」問題の完全解決確認');
    console.log('='.repeat(80));
    
    // 1. 難易度適正性テスト
    const difficultyTest = this.runDifficultyAppropriatenessTest();
    
    // 2. 問題内容テスト
    const contentTest = this.runEliteProblemContentTest();
    
    // 3. データベーステスト
    const databaseTest = this.runEliteProblemDatabaseTest();
    
    // 総合評価
    const allTestsPassed = 
      difficultyTest.overallSuccess && 
      contentTest.success && 
      databaseTest.success;
    
    const eliteSpecificSuccess = difficultyTest.eliteSpecificResults.successRate === 100;
    
    console.log('\\n📈 総合テスト結果');
    console.log('='.repeat(50));
    console.log(`🎯 難易度適正性: ${difficultyTest.overallSuccess ? '✅ 合格' : '❌ 不合格'}`);
    console.log(`📝 問題内容品質: ${contentTest.success ? '✅ 合格' : '❌ 不合格'}`);
    console.log(`💎 データベース品質: ${databaseTest.success ? '✅ 合格' : '❌ 不合格'}`);
    console.log(`🏆 最難関専用テスト: ${eliteSpecificSuccess ? '✅ 完璧' : '❌ 要改善'}`);
    
    let summary: string;
    
    if (allTestsPassed && eliteSpecificSuccess) {
      summary = '🎉🎉🎉 最難関レベル難易度制御完璧！「簡単すぎる問題」問題は完全解決されました！';
    } else if (eliteSpecificSuccess) {
      summary = '🏆 最難関レベルの難易度制御は完璧ですが、他の部分で改善の余地があります。';
    } else {
      summary = '🚨 最難関レベルの難易度制御にまだ問題があります。追加の修正が必要です。';
    }
    
    console.log('\\n' + summary);
    
    return {
      overallSuccess: allTestsPassed,
      summary,
      detailedResults: {
        difficultyTest: difficultyTest,
        contentTest: contentTest,
        databaseTest: databaseTest,
        eliteSpecific: {
          successRate: difficultyTest.eliteSpecificResults.successRate,
          isPerfect: eliteSpecificSuccess
        }
      }
    };
  }
  
  // 🎯 実際の問題生成テスト
  public testRealProblemGeneration(): void {
    console.log('\\n🎲 実際の最難関問題生成テスト');
    console.log('-'.repeat(40));
    
    // 数学問題生成テスト
    const mathProblem = eliteProblemDatabase.getRandomEliteProblem('math');
    if (mathProblem) {
      console.log(`✅ 数学問題生成成功:`);
      console.log(`   タイトル: ${mathProblem.title}`);
      console.log(`   難易度: ${mathProblem.difficulty}/10`);
      console.log(`   所要時間: ${mathProblem.expectedTime}分`);
      console.log(`   認知負荷: ${mathProblem.cognitiveLoad}/10`);
    } else {
      console.log(`❌ 数学問題生成失敗`);
    }
    
    // 統計表示
    const stats = eliteProblemDatabase.getEliteProblemStats();
    console.log(`\\n📊 利用可能な最難関問題: ${stats.totalProblems}問`);
    console.log(`💎 平均難易度: ${stats.averageDifficulty}/10`);
  }
}

// テスト実行関数
export const runEliteDifficultyTests = () => {
  const testSuite = new EliteDifficultyTestSuite();
  return testSuite.runAllEliteTests();
};

export const testEliteProblemGeneration = () => {
  const testSuite = new EliteDifficultyTestSuite();
  testSuite.testRealProblemGeneration();
};

// メイン実行
if (require.main === module) {
  const testSuite = new EliteDifficultyTestSuite();
  
  console.log('🏆 最難関レベル難易度制御テストスイート');
  console.log('========================================');
  
  const results = testSuite.runAllEliteTests();
  
  console.log('\\n🎯 テスト完了！');
  console.log(results.summary);
}