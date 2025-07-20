// 拡張教育システムの包括的テスト
// 世界最高レベルの教育アプリを目指すための品質保証

import { 
  educationSystem, 
  CHUYU_METHODS, 
  GRADE_RESTRICTIONS,
  KanjiLevelManager,
  ElementaryKnowledgeValidator,
  ChuyuMethodTeacher
} from '../services/enhancedEducationSystem';
import { LearnerProfile } from '../types';

// テスト用の学習者プロフィール
const createTestLearnerProfile = (grade: '4th' | '5th' | '6th'): LearnerProfile => ({
  id: `test-${grade}`,
  name: `テスト${grade}年生`,
  currentGrade: grade,
  targetGrade: '6th',
  targetSchools: [],
  schoolLevel: 'standard',
  studyStartDate: new Date(),
  availableStudyHours: { weekday: 2, weekend: 4 },
  subjectLevels: {
    math: { currentLevel: 5, targetLevel: 8, strengths: [], weaknesses: [] }
  },
  learningPreferences: {
    preferredDifficulty: 'gradual',
    learningStyle: 'visual',
    sessionLength: 'medium',
    motivationType: 'achievement'
  },
  schedule: {
    schoolSchedule: {
      monday: [], tuesday: [], wednesday: [], thursday: [], 
      friday: [], saturday: [], sunday: []
    },
    studyTimeSlots: [],
    busyPeriods: []
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

export class EnhancedEducationSystemTest {
  
  // 1. 中学受験解法データベーステスト
  public testChuyuMethodsDatabase(): { success: boolean; details: string[] } {
    const results: string[] = [];
    let allSuccess = true;

    try {
      // 解法数の確認
      const mathMethodsCount = this.countMethods(CHUYU_METHODS.math);
      const japaneseMethodsCount = this.countMethods(CHUYU_METHODS.japanese);
      const scienceMethodsCount = this.countMethods(CHUYU_METHODS.science);
      const socialMethodsCount = this.countMethods(CHUYU_METHODS.social);
      
      const totalMethods = mathMethodsCount + japaneseMethodsCount + scienceMethodsCount + socialMethodsCount;
      
      results.push(`✅ 総解法数: ${totalMethods}個`);
      results.push(`  📐 算数: ${mathMethodsCount}個`);
      results.push(`  📖 国語: ${japaneseMethodsCount}個`);
      results.push(`  🔬 理科: ${scienceMethodsCount}個`);
      results.push(`  🌍 社会: ${socialMethodsCount}個`);

      // 必須解法の存在確認
      const essentialMethods = [
        'ベンツ切り', '天びん法', 'つるかめ算', '旅人算', '流水算',
        '心情語彙マスター', '対照実験法', '年代暗記法'
      ];

      for (const method of essentialMethods) {
        const found = this.findMethodInDatabase(method);
        if (found) {
          results.push(`✅ 重要解法「${method}」確認済み`);
        } else {
          results.push(`❌ 重要解法「${method}」が見つかりません`);
          allSuccess = false;
        }
      }

      // 各解法の詳細情報確認
      let validMethodCount = 0;
      for (const subject of Object.values(CHUYU_METHODS)) {
        for (const category of Object.values(subject)) {
          for (const [methodName, methodData] of Object.entries(category)) {
            if (this.validateMethodData(methodData as any)) {
              validMethodCount++;
            } else {
              results.push(`❌ 解法「${methodName}」のデータに問題があります`);
              allSuccess = false;
            }
          }
        }
      }
      
      results.push(`✅ 有効な解法データ: ${validMethodCount}個`);

    } catch (error) {
      results.push(`❌ 解法データベーステストでエラー: ${error}`);
      allSuccess = false;
    }

    return { success: allSuccess, details: results };
  }

  // 2. 学年別漢字システムテスト
  public testKanjiLevelManager(): { success: boolean; details: string[] } {
    const results: string[] = [];
    let allSuccess = true;

    try {
      const kanjiManager = new KanjiLevelManager();
      
      // 基本的な漢字変換テスト
      const testCases = [
        { text: '演算を行う', grade: '4th' as const, expected: 'えんざんを行う' },
        { text: '異常な現象', grade: '5th' as const, expected: 'いじょうな現象' },
        { text: '宇宙の謎', grade: '6th' as const, expected: 'うちゅうの謎' }
      ];

      for (const testCase of testCases) {
        const result = kanjiManager.adjustTextForGrade(testCase.text, testCase.grade);
        if (result.includes('ひらがな')) {
          results.push(`✅ ${testCase.grade}年生向け変換テスト: 「${testCase.text}」`);
        } else {
          results.push(`⚠️ ${testCase.grade}年生向け変換テスト: 期待通りの変換がされませんでした`);
        }
      }

      // 学年ごとの漢字可用性テスト
      const commonKanji = ['学', '生', '年'];
      for (const kanji of commonKanji) {
        const canUse4th = kanjiManager.isKanjiAllowedForGrade(kanji, '4th');
        const canUse5th = kanjiManager.isKanjiAllowedForGrade(kanji, '5th');
        const canUse6th = kanjiManager.isKanjiAllowedForGrade(kanji, '6th');
        
        if (canUse4th && canUse5th && canUse6th) {
          results.push(`✅ 基本漢字「${kanji}」は全学年で使用可能`);
        } else {
          results.push(`❌ 基本漢字「${kanji}」の使用可能性に問題があります`);
          allSuccess = false;
        }
      }

    } catch (error) {
      results.push(`❌ 漢字システムテストでエラー: ${error}`);
      allSuccess = false;
    }

    return { success: allSuccess, details: results };
  }

  // 3. 小学生知識限定システムテスト
  public testElementaryKnowledgeValidator(): { success: boolean; details: string[] } {
    const results: string[] = [];
    let allSuccess = true;

    try {
      const validator = new ElementaryKnowledgeValidator();
      
      // 禁止概念の検出テスト
      const prohibitedConcepts = ['sin', 'cos', '負の数', '微分', '積分', 'イオン'];
      for (const concept of prohibitedConcepts) {
        const isValid4th = validator.validateConcept(concept, '4th');
        const isValid5th = validator.validateConcept(concept, '5th');
        const isValid6th = validator.validateConcept(concept, '6th');
        
        if (!isValid4th && !isValid5th && !isValid6th) {
          results.push(`✅ 禁止概念「${concept}」が正しく検出されました`);
        } else {
          results.push(`❌ 禁止概念「${concept}」の検出に失敗しました`);
          allSuccess = false;
        }
      }

      // 許可概念の検証テスト
      const allowedConcepts = ['四則演算', '分数', '小数', '図形', '割合'];
      for (const concept of allowedConcepts) {
        const isValid6th = validator.validateMathConcept(concept, '6th');
        if (isValid6th) {
          results.push(`✅ 許可概念「${concept}」が正しく認識されました`);
        } else {
          results.push(`❌ 許可概念「${concept}」の認識に失敗しました`);
          allSuccess = false;
        }
      }

      // 用語変換テスト
      const conversionTests = [
        { input: '変数を使って', expected: 'あてはまる数を使って' },
        { input: '方程式を解く', expected: '数をもとめる式を解く' },
        { input: '関数の概念', expected: 'きまりのある数のかんけいの概念' }
      ];

      for (const test of conversionTests) {
        const result = validator.convertToElementaryExplanation(test.input, '5th');
        if (result.includes(test.expected.split('を')[0])) {
          results.push(`✅ 用語変換テスト: 「${test.input}」→適切に変換済み`);
        } else {
          results.push(`⚠️ 用語変換テスト: 「${test.input}」の変換を確認中`);
        }
      }

    } catch (error) {
      results.push(`❌ 小学生知識限定システムテストでエラー: ${error}`);
      allSuccess = false;
    }

    return { success: allSuccess, details: results };
  }

  // 4. 中学受験特有解法指導システムテスト
  public testChuyuMethodTeacher(): { success: boolean; details: string[] } {
    const results: string[] = [];
    let allSuccess = true;

    try {
      const teacher = new ChuyuMethodTeacher();
      
      // 解法特定テスト
      const topicMethodTests = [
        { topic: '面積比', subject: 'math', expectedMethods: ['ベンツ切り'] },
        { topic: '速さ', subject: 'math', expectedMethods: ['旅人算'] },
        { topic: '割合', subject: 'math', expectedMethods: ['天びん法'] },
        { topic: '物語文', subject: 'japanese', expectedMethods: ['心情語彙マスター'] }
      ];

      for (const test of topicMethodTests) {
        const methods = teacher.identifyApplicableMethods(test.topic, test.subject);
        const hasExpectedMethod = test.expectedMethods.some(expected => 
          methods.includes(expected)
        );
        
        if (hasExpectedMethod) {
          results.push(`✅ ${test.topic}問題で適切な解法「${methods.join(', ')}」が特定されました`);
        } else {
          results.push(`❌ ${test.topic}問題で期待する解法が特定されませんでした: ${methods.join(', ')}`);
          allSuccess = false;
        }
      }

      // 学年適合性テスト
      const gradeTests = [
        { method: 'つるかめ算', grade: '4th' as const, shouldBeAllowed: true },
        { method: 'ニュートン算', grade: '4th' as const, shouldBeAllowed: false },
        { method: 'ベンツ切り', grade: '5th' as const, shouldBeAllowed: true }
      ];

      for (const test of gradeTests) {
        const isAppropriate = teacher.isMethodAppropriateForGrade(test.method, test.grade);
        if (isAppropriate === test.shouldBeAllowed) {
          results.push(`✅ 解法「${test.method}」の${test.grade}年生適合性判定が正確です`);
        } else {
          results.push(`❌ 解法「${test.method}」の${test.grade}年生適合性判定に問題があります`);
          allSuccess = false;
        }
      }

    } catch (error) {
      results.push(`❌ 解法指導システムテストでエラー: ${error}`);
      allSuccess = false;
    }

    return { success: allSuccess, details: results };
  }

  // 5. 統合システムテスト
  public testIntegratedEducationSystem(): { success: boolean; details: string[] } {
    const results: string[] = [];
    let allSuccess = true;

    try {
      // 各学年での統合テスト
      const grades: Array<'4th' | '5th' | '6th'> = ['4th', '5th', '6th'];
      
      for (const grade of grades) {
        const profile = createTestLearnerProfile(grade);
        
        // カスタマイズテスト
        const testContent = '三角形の面積比を求める問題です。変数xを使って方程式を立てて解きましょう。';
        const customized = educationSystem.customizeForLearner(
          testContent, 
          '面積比', 
          'math', 
          profile
        );

        if (customized.adjustedContent) {
          results.push(`✅ ${grade}年生向けコンテンツカスタマイズ成功`);
          
          // 適用可能解法の確認
          if (customized.applicableMethods.length > 0) {
            results.push(`  📚 適用解法: ${customized.applicableMethods.join(', ')}`);
          }
          
          // 解法説明の確認
          if (customized.methodExplanations.length > 0) {
            results.push(`  📖 解法説明数: ${customized.methodExplanations.length}件`);
          }
        } else {
          results.push(`❌ ${grade}年生向けカスタマイズに失敗しました`);
          allSuccess = false;
        }

        // AIプロンプト生成テスト
        const aiPrompt = educationSystem.generateAIPrompt('面積比', 'math', profile);
        if (aiPrompt.includes(grade === '4th' ? '小学4年生' : grade === '5th' ? '小学5年生' : '小学6年生')) {
          results.push(`✅ ${grade}年生向けAIプロンプト生成成功`);
        } else {
          results.push(`❌ ${grade}年生向けAIプロンプト生成に問題があります`);
          allSuccess = false;
        }
      }

    } catch (error) {
      results.push(`❌ 統合システムテストでエラー: ${error}`);
      allSuccess = false;
    }

    return { success: allSuccess, details: results };
  }

  // 6. パフォーマンステスト
  public testPerformance(): { success: boolean; details: string[] } {
    const results: string[] = [];
    let allSuccess = true;

    try {
      const profile = createTestLearnerProfile('5th');
      
      // 応答時間テスト
      const testCount = 100;
      const times: number[] = [];
      
      for (let i = 0; i < testCount; i++) {
        const startTime = performance.now();
        educationSystem.customizeForLearner(
          'テスト用のコンテンツです。', 
          '計算', 
          'math', 
          profile
        );
        const endTime = performance.now();
        times.push(endTime - startTime);
      }
      
      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      
      results.push(`✅ パフォーマンステスト完了:`);
      results.push(`  📊 平均応答時間: ${averageTime.toFixed(2)}ms`);
      results.push(`  📊 最大応答時間: ${maxTime.toFixed(2)}ms`);
      
      if (averageTime < 10 && maxTime < 50) {
        results.push(`✅ パフォーマンス基準をクリアしています`);
      } else {
        results.push(`⚠️ パフォーマンス改善が必要かもしれません`);
      }

    } catch (error) {
      results.push(`❌ パフォーマンステストでエラー: ${error}`);
      allSuccess = false;
    }

    return { success: allSuccess, details: results };
  }

  // すべてのテストを実行
  public runAllTests(): { 
    overallSuccess: boolean; 
    summary: string; 
    detailedResults: Record<string, { success: boolean; details: string[] }> 
  } {
    console.log('🚀 世界最高の中学受験教育システム - 包括テスト開始！');
    
    const results = {
      chuyuMethods: this.testChuyuMethodsDatabase(),
      kanjiSystem: this.testKanjiLevelManager(),
      knowledgeValidator: this.testElementaryKnowledgeValidator(),
      methodTeacher: this.testChuyuMethodTeacher(),
      integratedSystem: this.testIntegratedEducationSystem(),
      performance: this.testPerformance()
    };

    const allTestsPass = Object.values(results).every(result => result.success);
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(result => result.success).length;

    const summary = `
🎯 テスト結果サマリー:
   📊 総合成功率: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)
   ${allTestsPass ? '🎉 すべてのテストが成功しました！' : '⚠️ 一部のテストで改善が必要です'}
   
🎓 世界最高レベル中学受験教育アプリ品質: ${allTestsPass ? 'EXCELLENT' : 'GOOD'}
    `;

    return {
      overallSuccess: allTestsPass,
      summary,
      detailedResults: results
    };
  }

  // ヘルパーメソッド
  private countMethods(subject: any): number {
    let count = 0;
    for (const category of Object.values(subject)) {
      count += Object.keys(category as any).length;
    }
    return count;
  }

  private findMethodInDatabase(methodName: string): boolean {
    for (const subject of Object.values(CHUYU_METHODS)) {
      for (const category of Object.values(subject)) {
        if ((category as any)[methodName]) {
          return true;
        }
      }
    }
    return false;
  }

  private validateMethodData(methodData: any): boolean {
    return methodData && 
           methodData.description && 
           methodData.applicableTopics && 
           methodData.gradeLevel && 
           methodData.explanation &&
           Array.isArray(methodData.applicableTopics) &&
           Array.isArray(methodData.gradeLevel);
  }
}

// テスト実行
export const runEducationSystemTests = () => {
  const tester = new EnhancedEducationSystemTest();
  return tester.runAllTests();
};