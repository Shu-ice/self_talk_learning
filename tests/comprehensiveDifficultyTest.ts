// 🧪 全レベル対応難易度制御システム完全テスト
// Comprehensive Difficulty Control System Test Suite

import { gradeAwareDifficultyController } from '../services/gradeAwareDifficultyController';
import { comprehensiveProblemDatabase } from '../services/comprehensiveProblemDatabase';
import { eliteDifficultyController } from '../services/eliteDifficultyController';

export interface ComprehensiveTestCase {
  description: string;
  grade: '4th' | '5th' | '6th';
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite';
  expectedDifficultyRange: [number, number];
  expectedTimeRange: [number, number];
  shouldBeAppropriate: boolean;
}

export class ComprehensiveDifficultyTestSuite {
  
  // 🧪 全レベル×全学年の適正性テスト
  private readonly COMPREHENSIVE_TEST_CASES: ComprehensiveTestCase[] = [
    // 4年生全レベル
    { description: '4年生×基礎校', grade: '4th', schoolLevel: 'basic', expectedDifficultyRange: [2, 3], expectedTimeRange: [10, 20], shouldBeAppropriate: true },
    { description: '4年生×標準校', grade: '4th', schoolLevel: 'standard', expectedDifficultyRange: [3, 4], expectedTimeRange: [15, 25], shouldBeAppropriate: true },
    { description: '4年生×上位校', grade: '4th', schoolLevel: 'advanced', expectedDifficultyRange: [4, 5], expectedTimeRange: [20, 30], shouldBeAppropriate: true },
    { description: '4年生×最難関校', grade: '4th', schoolLevel: 'elite', expectedDifficultyRange: [5, 6], expectedTimeRange: [25, 35], shouldBeAppropriate: false }, // 発達段階的に厳しい
    
    // 5年生全レベル  
    { description: '5年生×基礎校', grade: '5th', schoolLevel: 'basic', expectedDifficultyRange: [3, 4], expectedTimeRange: [15, 25], shouldBeAppropriate: true },
    { description: '5年生×標準校', grade: '5th', schoolLevel: 'standard', expectedDifficultyRange: [5, 6], expectedTimeRange: [20, 30], shouldBeAppropriate: true },
    { description: '5年生×上位校', grade: '5th', schoolLevel: 'advanced', expectedDifficultyRange: [6, 7], expectedTimeRange: [25, 35], shouldBeAppropriate: true },
    { description: '5年生×最難関校', grade: '5th', schoolLevel: 'elite', expectedDifficultyRange: [7, 8], expectedTimeRange: [30, 40], shouldBeAppropriate: true },
    
    // 6年生全レベル
    { description: '6年生×基礎校', grade: '6th', schoolLevel: 'basic', expectedDifficultyRange: [4, 5], expectedTimeRange: [20, 30], shouldBeAppropriate: true },
    { description: '6年生×標準校', grade: '6th', schoolLevel: 'standard', expectedDifficultyRange: [6, 7], expectedTimeRange: [25, 35], shouldBeAppropriate: true },
    { description: '6年生×上位校', grade: '6th', schoolLevel: 'advanced', expectedDifficultyRange: [8, 9], expectedTimeRange: [30, 40], shouldBeAppropriate: true },
    { description: '6年生×最難関校', grade: '6th', schoolLevel: 'elite', expectedDifficultyRange: [9, 10], expectedTimeRange: [35, 50], shouldBeAppropriate: true }
  ];
  
  // 🎯 メイン統合テスト実行
  public runComprehensiveDifficultyTest(): {
    overallSuccess: boolean;
    testResults: Record<string, any>;
    levelSpecificResults: Record<string, { passed: number; total: number; successRate: number }>;
    summary: string;
  } {
    
    console.log('\n🧪🧪🧪 全レベル対応難易度制御システム完全テスト 🧪🧪🧪');
    console.log('='.repeat(80));
    console.log('🎯 目標: 基礎校〜最難関校×4-6年生の完全適正化');
    console.log('📚 範囲: 全12パターンの学年×志望校レベル組み合わせ');
    console.log('⚡ 基準: 各レベルに適切な難易度と学習時間');
    console.log('='.repeat(80));
    
    const testResults: Record<string, any> = {};
    const levelSpecificResults: Record<string, { passed: number; total: number; successRate: number }> = {
      'basic': { passed: 0, total: 0, successRate: 0 },
      'standard': { passed: 0, total: 0, successRate: 0 },
      'advanced': { passed: 0, total: 0, successRate: 0 },
      'elite': { passed: 0, total: 0, successRate: 0 }
    };
    
    let totalTests = 0;
    let passedTests = 0;
    
    console.log('\\n📊 学年×志望校レベル適正性テスト');
    console.log('-'.repeat(60));
    
    this.COMPREHENSIVE_TEST_CASES.forEach((test, index) => {
      totalTests++;
      levelSpecificResults[test.schoolLevel].total++;
      
      console.log(`\\n🧪 テスト ${index + 1}: ${test.description}`);
      
      // 学年×志望校の組み合わせ適正チェック
      const combinationCheck = gradeAwareDifficultyController.isGradeSchoolCombinationAppropriate(
        test.grade, test.schoolLevel
      );
      
      // 難易度計算テスト  
      const difficultyCalc = gradeAwareDifficultyController.calculateGradeAwareDifficulty(
        test.grade, test.schoolLevel, 0.7, 0.7 // 標準的な性能値
      );
      
      // 問題データベーステスト
      const problems = comprehensiveProblemDatabase.getProblemsForLevel(
        test.grade, test.schoolLevel, 'math', 3
      );
      
      console.log(`   📊 計算難易度: ${difficultyCalc.targetDifficulty}`);
      console.log(`   ⏰ 推奨時間: ${difficultyCalc.timeRecommendation}分`);
      console.log(`   📚 利用可能問題数: ${problems.length}問`);
      
      // 適正性評価
      const difficultyInRange = 
        difficultyCalc.targetDifficulty >= test.expectedDifficultyRange[0] && 
        difficultyCalc.targetDifficulty <= test.expectedDifficultyRange[1];
      
      const timeInRange = 
        difficultyCalc.timeRecommendation >= test.expectedTimeRange[0] && 
        difficultyCalc.timeRecommendation <= test.expectedTimeRange[1];
      
      const combinationAppropriate = combinationCheck.isAppropriate === test.shouldBeAppropriate;
      
      const problemsAvailable = problems.length > 0;
      
      const allChecksPass = difficultyInRange && timeInRange && combinationAppropriate && problemsAvailable;
      
      if (allChecksPass) {
        console.log('   ✅ 合格: 全基準を満たしています');
        if (test.shouldBeAppropriate) {
          console.log(`   💡 ${combinationCheck.reasoning}`);
        } else {
          console.log(`   ⚠️ 適切な警告: ${combinationCheck.reasoning}`);
        }
        passedTests++;
        levelSpecificResults[test.schoolLevel].passed++;
      } else {
        console.log('   ❌ 失敗: 基準を満たしていません');
        if (!difficultyInRange) console.log(`   🐛 難易度が範囲外: ${difficultyCalc.targetDifficulty}`);
        if (!timeInRange) console.log(`   🐛 時間が範囲外: ${difficultyCalc.timeRecommendation}分`);
        if (!combinationAppropriate) console.log(`   🐛 組み合わせ適正性の判定ミス`);
        if (!problemsAvailable) console.log(`   🐛 問題データベースが空`);
      }
    });
    
    // レベル別成功率計算
    Object.keys(levelSpecificResults).forEach(level => {
      const result = levelSpecificResults[level];
      result.successRate = result.total > 0 ? Math.round((result.passed / result.total) * 100) : 0;
    });
    
    const overallSuccessRate = Math.round((passedTests / totalTests) * 100);
    
    console.log('\\n📈 レベル別テスト結果');
    console.log('-'.repeat(40));
    Object.entries(levelSpecificResults).forEach(([level, result]) => {
      const icon = result.successRate === 100 ? '✅' : result.successRate >= 80 ? '⚠️' : '❌';
      console.log(`${icon} ${level}: ${result.successRate}% (${result.passed}/${result.total})`);
    });
    
    testResults.difficultyAppropriatenessTest = {
      success: passedTests === totalTests,
      details: [
        `総テスト: ${totalTests}`,
        `成功: ${passedTests}`,
        `成功率: ${overallSuccessRate}%`
      ]
    };
    
    return {
      overallSuccess: passedTests === totalTests,
      testResults,
      levelSpecificResults,
      summary: this.generateTestSummary(overallSuccessRate, levelSpecificResults)
    };
  }
  
  // 🧪 実際の問題生成テスト
  public runProblemGenerationTest(): {
    success: boolean;
    generationResults: Record<string, any>;
    qualityAssessment: string[];
  } {
    
    console.log('\\n🎲 実際の問題生成品質テスト');
    console.log('-'.repeat(50));
    
    const generationResults: Record<string, any> = {};
    const qualityAssessment: string[] = [];
    let allGenerationSuccess = true;
    
    // 各レベルでの問題生成テスト
    const testCombinations = [
      { grade: '4th' as const, level: 'basic' as const },
      { grade: '5th' as const, level: 'standard' as const },
      { grade: '6th' as const, level: 'advanced' as const },
      { grade: '6th' as const, level: 'elite' as const }
    ];
    
    testCombinations.forEach(combo => {
      console.log(`\\n🧪 ${combo.grade} × ${combo.level} 問題生成テスト`);
      
      const problems = comprehensiveProblemDatabase.getProblemsForLevel(
        combo.grade, combo.level, 'math', 5
      );
      
      if (problems.length > 0) {
        const avgDifficulty = problems.reduce((sum, p) => sum + p.difficulty, 0) / problems.length;
        const avgTime = problems.reduce((sum, p) => sum + p.expectedTime, 0) / problems.length;
        
        console.log(`   ✅ 問題生成成功: ${problems.length}問`);
        console.log(`   📊 平均難易度: ${avgDifficulty.toFixed(1)}`);
        console.log(`   ⏰ 平均時間: ${avgTime.toFixed(1)}分`);
        
        generationResults[`${combo.grade}_${combo.level}`] = {
          success: true,
          problemCount: problems.length,
          averageDifficulty: avgDifficulty,
          averageTime: avgTime
        };
        
        // 品質評価
        if (combo.level === 'basic' && avgDifficulty <= 4) {
          qualityAssessment.push(`✅ ${combo.grade}×${combo.level}: 適切な基礎レベル`);
        } else if (combo.level === 'standard' && avgDifficulty >= 4 && avgDifficulty <= 6) {
          qualityAssessment.push(`✅ ${combo.grade}×${combo.level}: 適切な標準レベル`);
        } else if (combo.level === 'advanced' && avgDifficulty >= 6 && avgDifficulty <= 8) {
          qualityAssessment.push(`✅ ${combo.grade}×${combo.level}: 適切な上位レベル`);
        } else if (combo.level === 'elite' && avgDifficulty >= 8) {
          qualityAssessment.push(`✅ ${combo.grade}×${combo.level}: 適切な最難関レベル`);
        } else {
          qualityAssessment.push(`⚠️ ${combo.grade}×${combo.level}: 難易度要調整`);
        }
        
      } else {
        console.log(`   ❌ 問題生成失敗: 利用可能な問題なし`);
        allGenerationSuccess = false;
        generationResults[`${combo.grade}_${combo.level}`] = {
          success: false,
          problemCount: 0
        };
        qualityAssessment.push(`❌ ${combo.grade}×${combo.level}: 問題データベース不足`);
      }
    });
    
    return {
      success: allGenerationSuccess,
      generationResults,
      qualityAssessment
    };
  }
  
  // 🧪 適応型問題選択テスト
  public runAdaptiveProblemTest(): {
    success: boolean;
    adaptationResults: Record<string, any>;
    insights: string[];
  } {
    
    console.log('\\n🎯 適応型問題選択システムテスト');
    console.log('-'.repeat(45));
    
    const adaptationResults: Record<string, any> = {};
    const insights: string[] = [];
    let adaptationSuccess = true;
    
    // 異なるパフォーマンスでの適応テスト
    const performanceScenarios = [
      {
        name: '高パフォーマンス',
        performance: { recentAccuracy: 0.9, averageTime: 15, weakAreas: [], strongAreas: ['計算'] }
      },
      {
        name: '中パフォーマンス', 
        performance: { recentAccuracy: 0.7, averageTime: 25, weakAreas: ['図形'], strongAreas: ['計算'] }
      },
      {
        name: '低パフォーマンス',
        performance: { recentAccuracy: 0.4, averageTime: 35, weakAreas: ['計算', '図形'], strongAreas: [] }
      }
    ];
    
    performanceScenarios.forEach(scenario => {
      console.log(`\\n🧪 ${scenario.name}学習者の適応テスト`);
      
      const adaptiveProblem = comprehensiveProblemDatabase.getAdaptiveProblem(
        '5th', 'standard', scenario.performance
      );
      
      if (adaptiveProblem) {
        console.log(`   ✅ 適応問題選択成功: ${adaptiveProblem.title}`);
        console.log(`   📊 選択された難易度: ${adaptiveProblem.difficulty}`);
        console.log(`   📚 対象トピック: ${adaptiveProblem.topic}`);
        
        adaptationResults[scenario.name] = {
          success: true,
          selectedDifficulty: adaptiveProblem.difficulty,
          selectedTopic: adaptiveProblem.topic
        };
        
        // 適応の妥当性チェック
        if (scenario.name === '高パフォーマンス' && adaptiveProblem.difficulty >= 5) {
          insights.push('✅ 高パフォーマンス学習者に適切な高難度問題を選択');
        } else if (scenario.name === '低パフォーマンス' && adaptiveProblem.difficulty <= 4) {
          insights.push('✅ 低パフォーマンス学習者に適切な基礎問題を選択');
        }
        
      } else {
        console.log(`   ❌ 適応問題選択失敗`);
        adaptationSuccess = false;
        adaptationResults[scenario.name] = { success: false };
        insights.push(`❌ ${scenario.name}学習者への適応問題選択失敗`);
      }
    });
    
    return {
      success: adaptationSuccess,
      adaptationResults,
      insights
    };
  }
  
  // 🎯 統合テスト実行
  public runAllComprehensiveTests(): {
    overallSuccess: boolean;
    summary: string;
    detailedResults: Record<string, any>;
    recommendations: string[];
  } {
    
    console.log('\\n🏆🏆🏆 全レベル対応難易度制御システム統合テスト 🏆🏆🏆');
    console.log('='.repeat(80));
    console.log('🎯 目標: 基礎校〜最難関校×4-6年生の完璧な適正化確認');
    console.log('='.repeat(80));
    
    // 1. 総合難易度テスト
    const difficultyTest = this.runComprehensiveDifficultyTest();
    
    // 2. 問題生成テスト
    const generationTest = this.runProblemGenerationTest();
    
    // 3. 適応型テスト
    const adaptiveTest = this.runAdaptiveProblemTest();
    
    // 総合評価
    const allTestsPassed = 
      difficultyTest.overallSuccess && 
      generationTest.success && 
      adaptiveTest.success;
    
    console.log('\\n📈 統合テスト結果');
    console.log('='.repeat(50));
    console.log(`🎯 難易度適正性: ${difficultyTest.overallSuccess ? '✅ 合格' : '❌ 不合格'}`);
    console.log(`🎲 問題生成品質: ${generationTest.success ? '✅ 合格' : '❌ 不合格'}`);
    console.log(`🔄 適応型選択: ${adaptiveTest.success ? '✅ 合格' : '❌ 不合格'}`);
    
    const recommendations: string[] = [];
    
    if (!difficultyTest.overallSuccess) {
      recommendations.push('難易度制御アルゴリズムの調整が必要');
    }
    if (!generationTest.success) {
      recommendations.push('問題データベースの拡充が必要');
    }
    if (!adaptiveTest.success) {
      recommendations.push('適応型選択ロジックの改善が必要');
    }
    
    let summary: string;
    if (allTestsPassed) {
      summary = '🎉🎉🎉 全レベル対応難易度制御システム完璧！基礎校〜最難関校×学年別の適正化が完全に実現されました！';
    } else {
      summary = `🔧 ${3 - [difficultyTest.overallSuccess, generationTest.success, adaptiveTest.success].filter(Boolean).length}個のシステムで改善が必要です。`;
    }
    
    console.log('\\n' + summary);
    
    return {
      overallSuccess: allTestsPassed,
      summary,
      detailedResults: {
        difficultyTest: difficultyTest,
        generationTest: generationTest,
        adaptiveTest: adaptiveTest
      },
      recommendations
    };
  }
  
  // 📊 データベース統計表示
  public showDatabaseStatistics(): void {
    console.log('\\n📊 総合問題データベース統計');
    console.log('-'.repeat(40));
    
    const stats = comprehensiveProblemDatabase.getDatabaseStats();
    
    console.log(`📚 総問題数: ${stats.totalProblems}問`);
    console.log(`👦 学年別分布:`, stats.byGrade);
    console.log(`🏫 学校レベル別分布:`, stats.bySchool);
    console.log(`📖 教科別分布:`, stats.bySubject);
    console.log(`📊 レベル別平均難易度:`, stats.averageDifficulty);
  }
  
  // サマリー生成
  private generateTestSummary(
    overallSuccessRate: number, 
    levelResults: Record<string, { passed: number; total: number; successRate: number }>
  ): string {
    
    if (overallSuccessRate === 100) {
      return '🎉 全レベル×全学年の難易度制御が完璧に動作しています！';
    } else if (overallSuccessRate >= 90) {
      return '✅ 高品質な難易度制御を実現していますが、微調整の余地があります。';
    } else if (overallSuccessRate >= 80) {
      return '⚠️ 基本的な難易度制御は動作していますが、改善が必要です。';
    } else {
      return '🚨 難易度制御システムに重大な問題があります。全面的な見直しが必要です。';
    }
  }
}

// テスト実行関数
export const runComprehensiveDifficultyTests = () => {
  const testSuite = new ComprehensiveDifficultyTestSuite();
  return testSuite.runAllComprehensiveTests();
};

export const showDatabaseStats = () => {
  const testSuite = new ComprehensiveDifficultyTestSuite();
  testSuite.showDatabaseStatistics();
};

// メイン実行
if (require.main === module) {
  const testSuite = new ComprehensiveDifficultyTestSuite();
  
  console.log('🏆 全レベル対応難易度制御システムテストスイート');
  console.log('================================================');
  
  const results = testSuite.runAllComprehensiveTests();
  
  console.log('\\n🎯 統合テスト完了！');
  console.log(results.summary);
  
  testSuite.showDatabaseStatistics();
}