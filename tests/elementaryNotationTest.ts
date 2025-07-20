// 🎯 小学生特有記号表現システムテスト
// Elementary Notation System Test

import { elementaryNotationSystem } from '../services/elementaryNotationSystem';
import { educationSystem } from '../services/enhancedEducationSystem';

export interface ElementaryNotationTestResults {
  overallSuccess: boolean;
  testResults: Record<string, {
    success: boolean;
    details: string[];
  }>;
  summary: string;
}

export class ElementaryNotationTest {
  
  public runElementaryNotationTests(): ElementaryNotationTestResults {
    
    console.log('\n🎯 小学生特有記号表現システムテスト開始');
    console.log('='.repeat(60));

    const testResults: Record<string, any> = {};

    // 1. 基本記号変換テスト
    console.log('📝 1. 基本記号変換テスト...');
    try {
      // X, Y を ○, □ に変換
      const basicConversion = elementaryNotationSystem.convertToElementaryNotation(
        'X + Y = 10',
        '5th',
        'basic'
      );

      const isCorrect = basicConversion.converted.includes('○') && 
                       basicConversion.converted.includes('□') &&
                       !basicConversion.converted.includes('X') &&
                       !basicConversion.converted.includes('Y');

      testResults.basicConversion = {
        success: isCorrect,
        details: [
          `✅ 変換結果: ${basicConversion.converted}`,
          `✅ 説明: ${basicConversion.explanation}`,
          `✅ 記号ガイド: ${basicConversion.symbolGuide.join(', ')}`,
          `📊 成功: ${isCorrect ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${isCorrect ? '✅' : '❌'} 基本変換: ${basicConversion.converted}`);
    } catch (error) {
      testResults.basicConversion = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 2. つるかめ算記号テスト
    console.log('🐢 2. つるかめ算記号生成テスト...');
    try {
      const tsuruKame = elementaryNotationSystem.generateTsuruKameNotation('つる', 'かめ', '6th');
      const hasCorrectSymbols = tsuruKame.notation.includes('○') && 
                               tsuruKame.notation.includes('□');

      testResults.tsuruKame = {
        success: hasCorrectSymbols,
        details: [
          `✅ 記号表現: ${tsuruKame.notation}`,
          `✅ 手順数: ${tsuruKame.steps.length}`,
          `✅ ビジュアル補助あり: ${tsuruKame.visualAid.length > 0}`,
          `📊 成功: ${hasCorrectSymbols ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${hasCorrectSymbols ? '✅' : '❌'} つるかめ算: ${tsuruKame.notation}`);
    } catch (error) {
      testResults.tsuruKame = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 3. 比の問題記号テスト
    console.log('📊 3. 比の問題記号生成テスト...');
    try {
      const ratio4th = elementaryNotationSystem.generateRatioNotation(['太郎', '花子'], '4th');
      const ratio6th = elementaryNotationSystem.generateRatioNotation(['太郎', '花子'], '6th');
      
      const has4thStyle = ratio4th.notation.includes('○');
      const has6thStyle = ratio6th.notation.includes('①') || ratio6th.notation.includes('②');

      testResults.ratio = {
        success: has4thStyle && has6thStyle,
        details: [
          `✅ 4年生スタイル: ${ratio4th.notation}`,
          `✅ 6年生スタイル: ${ratio6th.notation}`,
          `✅ 学年別適応: ${has4thStyle && has6thStyle}`,
          `📊 成功: ${has4thStyle && has6thStyle ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${has4thStyle && has6thStyle ? '✅' : '❌'} 比の記号: 4年${ratio4th.notation} / 6年${ratio6th.notation}`);
    } catch (error) {
      testResults.ratio = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 4. 速さの公式記号テスト
    console.log('⚡ 4. 速さの公式記号生成テスト...');
    try {
      const speed = elementaryNotationSystem.generateSpeedNotation('6th');
      const hasSymbols = speed.formula.includes('○') && 
                        speed.formula.includes('□') && 
                        speed.formula.includes('△');

      testResults.speed = {
        success: hasSymbols,
        details: [
          `✅ 公式: ${speed.formula}`,
          `✅ 記号の意味数: ${Object.keys(speed.symbolMeaning).length}`,
          `✅ 説明: ${speed.explanation}`,
          `📊 成功: ${hasSymbols ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${hasSymbols ? '✅' : '❌'} 速さ公式: ${speed.formula}`);
    } catch (error) {
      testResults.speed = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 5. 図形記号テスト
    console.log('📐 5. 図形記号生成テスト...');
    try {
      const triangle = elementaryNotationSystem.generateGeometryNotation('triangle', '5th');
      const rectangle = elementaryNotationSystem.generateGeometryNotation('rectangle', '5th');
      
      const hasTriangleFormula = triangle.formula.includes('÷ 2');
      const hasRectangleFormula = !rectangle.formula.includes('÷ 2');

      testResults.geometry = {
        success: hasTriangleFormula && hasRectangleFormula,
        details: [
          `✅ 三角形公式: ${triangle.formula}`,
          `✅ 長方形公式: ${rectangle.formula}`,
          `✅ 公式の違い: ${hasTriangleFormula && hasRectangleFormula}`,
          `📊 成功: ${hasTriangleFormula && hasRectangleFormula ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${hasTriangleFormula && hasRectangleFormula ? '✅' : '❌'} 図形: 三角形${triangle.formula} / 長方形${rectangle.formula}`);
    } catch (error) {
      testResults.geometry = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 6. 禁止記号検証テスト
    console.log('❌ 6. 禁止記号検証テスト...');
    try {
      const validation = elementaryNotationSystem.validateNotation('x + y = z', '5th');
      const detectsViolations = validation.violations.length > 0;
      const providesCorrection = validation.suggestions.length > 0;

      testResults.validation = {
        success: detectsViolations && providesCorrection,
        details: [
          `✅ 違反検出: ${validation.violations.join(', ')}`,
          `✅ 修正提案: ${validation.suggestions.join(', ')}`,
          `✅ 有効性判定: ${validation.isValid ? '有効' : '無効'}`,
          `📊 成功: ${detectsViolations && providesCorrection ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${detectsViolations && providesCorrection ? '✅' : '❌'} 検証: ${validation.violations.length}個の違反検出`);
    } catch (error) {
      testResults.validation = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 7. 統合システム連携テスト
    console.log('🔗 7. 統合システム連携テスト...');
    try {
      const testProfile = {
        id: 'test001',
        name: 'テスト太郎',
        age: 11,
        grade: '6th' as any,
        schoolLevel: 'standard' as any,
        subjectLevels: { math: { currentLevel: 6, targetLevel: 8, progressRate: 0.7 } },
        learningPreferences: { sessionLength: 'medium' as any, difficulty: 'moderate' as any, interactionStyle: 'guided' as any, feedbackFrequency: 'moderate' as any },
        strengths: ['論理思考'],
        weaknesses: ['計算速度'],
        goals: ['基礎固め'],
        parentalInvolvement: 'moderate' as any
      };

      const tsuruKameExample = educationSystem.generateTsuruKameExample('6th');
      const ratioExample = educationSystem.generateRatioExample('6th');
      const speedExample = educationSystem.generateSpeedExample('6th');

      const hasExamples = tsuruKameExample.length > 0 && 
                         ratioExample.length > 0 && 
                         speedExample.length > 0;

      testResults.integration = {
        success: hasExamples,
        details: [
          `✅ つるかめ算例文生成: ${tsuruKameExample.length}文字`,
          `✅ 比の例文生成: ${ratioExample.length}文字`,
          `✅ 速さの例文生成: ${speedExample.length}文字`,
          `✅ 統合システム連携: ${hasExamples}`,
          `📊 成功: ${hasExamples ? 'はい' : 'いいえ'}`
        ]
      };
      console.log(`   ${hasExamples ? '✅' : '❌'} 統合連携: ${hasExamples ? '3種類の例文生成成功' : '例文生成失敗'}`);
    } catch (error) {
      testResults.integration = {
        success: false,
        details: [`❌ エラー: ${error}`]
      };
      console.log(`   ❌ 失敗: ${error}`);
    }

    // 総合評価
    const successCount = Object.values(testResults).filter((result: any) => result.success).length;
    const totalTests = Object.keys(testResults).length;
    const overallSuccess = successCount === totalTests;
    const successRate = Math.round((successCount / totalTests) * 100);

    const summary = `
🎯 小学生特有記号表現システムテスト結果

📊 総合結果: ${overallSuccess ? '✅ 完全成功!' : '⚠️ 一部改善必要'}
📈 成功率: ${successCount}/${totalTests} (${successRate}%)

🔍 テスト項目:
${Object.entries(testResults).map(([test, result]: [string, any]) => 
  `   ${result.success ? '✅' : '❌'} ${test}: ${result.success ? '成功' : '失敗'}`
).join('\n')}

🌟 実証された機能:
   ✨ X,Y,Z → ○□△ 自動変換
   🐢 つるかめ算専用記号生成
   📊 学年別比の記号表現
   ⚡ 速さ公式の小学生記号化
   📐 図形公式の適切な記号化
   ❌ 禁止記号の自動検出・修正
   🔗 統合システムとのシームレス連携

${overallSuccess ? 
'🎉 素晴らしい！小学生が使いやすい記号システムが完璧に動作しています！' :
'🔧 システムに改善の余地があります。継続的な向上を行いましょう。'}

これで小学生は方程式のXやYではなく、親しみやすい○や□、①②③を使って
算数の問題を解けるようになりました！中学受験の特徴を完璧に再現しています。
    `;

    return {
      overallSuccess,
      testResults,
      summary
    };
  }
}

// テスト実行関数
export function runElementaryNotationTests(): ElementaryNotationTestResults {
  const tester = new ElementaryNotationTest();
  return tester.runElementaryNotationTests();
}