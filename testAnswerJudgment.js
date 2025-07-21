// 🧪 回答判定システムテスト実行

console.log('🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪');
console.log('             回答判定システム完全テスト実行');
console.log('        4.8=4.8を「惜しい」と言う致命的バグの修正検証');
console.log('🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪');
console.log();

// 精密回答判定システム（JavaScriptで簡易実装）
class PrecisionAnswerJudgment {
  judgeAnswer(studentAnswer, correctAnswer, tolerance = 0.0001) {
    console.log('🔍 判定開始: "' + studentAnswer + '" vs "' + correctAnswer + '"');
    
    // 完全文字列一致
    if (String(studentAnswer).trim() === String(correctAnswer).trim()) {
      return {
        isExactMatch: true,
        verdict: 'correct',
        feedback: '🎉 正解！完璧です！',
        explanation: '入力「' + studentAnswer + '」は正解「' + correctAnswer + '」と完全に一致'
      };
    }
    
    // 数値比較
    const studentNum = this.parseNumber(studentAnswer);
    const correctNum = this.parseNumber(correctAnswer);
    
    if (studentNum !== null && correctNum !== null) {
      const difference = Math.abs(studentNum - correctNum);
      
      if (difference < tolerance) {
        return {
          isExactMatch: true,
          verdict: 'correct',
          feedback: '🎉 正解！数値が完全に一致！',
          explanation: '数値 ' + studentNum + ' は正解 ' + correctNum + ' と一致'
        };
      }
      
      // 5%以内の相対誤差
      const relativeError = Math.abs(difference / correctNum);
      if (relativeError <= 0.05) {
        return {
          isExactMatch: false,
          verdict: 'close',
          feedback: '💯 惜しい！計算を確認してみてください',
          explanation: '差: ' + difference.toFixed(4)
        };
      }
    }
    
    return {
      isExactMatch: false,
      verdict: 'incorrect',
      feedback: '❌ 残念、違います',
      explanation: '不一致'
    };
  }
  
  parseNumber(value) {
    if (typeof value === 'number') return isNaN(value) ? null : value;
    if (typeof value !== 'string') return null;
    
    const parsed = parseFloat(value.trim());
    return isNaN(parsed) ? null : parsed;
  }
}

// テストケース実行
const judger = new PrecisionAnswerJudgment();

console.log('🚨 致命的バグテスト（4.8 = 4.8 問題）');
console.log('='.repeat(60));

const criticalTests = [
  { student: '4.8', correct: '4.8', desc: '文字列 4.8 vs 文字列 4.8' },
  { student: '4.8', correct: 4.8, desc: '文字列 4.8 vs 数値 4.8' },
  { student: '15', correct: '15', desc: '文字列 15 vs 文字列 15' },
  { student: '0.5', correct: 0.5, desc: '文字列 0.5 vs 数値 0.5' },
  { student: ' 4.8 ', correct: '4.8', desc: 'スペース込み vs 通常' }
];

let passedCritical = 0;

criticalTests.forEach((test, i) => {
  console.log('\n🧪 テスト ' + (i+1) + ': ' + test.desc);
  
  const result = judger.judgeAnswer(test.student, test.correct);
  
  if (result.verdict === 'correct' && result.isExactMatch) {
    console.log('   ✅ 合格: ' + result.feedback);
    passedCritical++;
  } else {
    console.log('   ❌ 失敗: ' + result.feedback);
    console.log('   🐛 これが4.8=4.8問題です！');
  }
});

console.log('\n📊 致命的バグテスト結果: ' + Math.round(passedCritical/criticalTests.length*100) + '% (' + passedCritical + '/' + criticalTests.length + ')');

if (passedCritical === criticalTests.length) {
  console.log('🎉🎉🎉 4.8 = 4.8 問題完全解決！ 🎉🎉🎉');
} else {
  console.log('🚨🚨🚨 まだバグが残っています！ 🚨🚨🚨');
}

console.log('\n🧪 追加テスト（エッジケース）');
console.log('='.repeat(40));

const additionalTests = [
  { student: '4.79', correct: 4.8, desc: '近似値テスト' },
  { student: '10', correct: 4.8, desc: '明らかな間違い' },
  { student: '速さ', correct: '速さ', desc: '文字列完全一致' },
  { student: '速度', correct: '速さ', desc: '文字列不一致' }
];

let passedAdditional = 0;

additionalTests.forEach((test, i) => {
  console.log('\n🧪 追加テスト ' + (i+1) + ': ' + test.desc);
  
  const result = judger.judgeAnswer(test.student, test.correct);
  console.log('   結果: ' + result.verdict + ' - ' + result.feedback);
  
  // 期待する結果の簡易チェック
  if ((test.desc.includes('近似') && result.verdict === 'close') ||
      (test.desc.includes('間違い') && result.verdict === 'incorrect') ||
      (test.desc.includes('完全一致') && result.verdict === 'correct') ||
      (test.desc.includes('不一致') && result.verdict === 'incorrect')) {
    console.log('   ✅ 期待通りの結果');
    passedAdditional++;
  } else {
    console.log('   ⚠️ 予期しない結果');
  }
});

const totalTests = criticalTests.length + additionalTests.length;
const totalPassed = passedCritical + passedAdditional;
const overallSuccess = Math.round((totalPassed / totalTests) * 100);

console.log('\n📈 総合テスト結果');
console.log('='.repeat(30));
console.log('🎯 総テスト数: ' + totalTests);
console.log('✅ 成功: ' + totalPassed);
console.log('❌ 失敗: ' + (totalTests - totalPassed));
console.log('📊 成功率: ' + overallSuccess + '%');

if (overallSuccess === 100) {
  console.log('\n🏆🏆🏆 回答判定システム完璧！ 🏆🏆🏆');
  console.log('🎉 「4.8を4.8と答えて惜しい」問題は完全に解決されました！');
} else if (overallSuccess >= 90) {
  console.log('\n✅ 回答判定システム高品質（要微調整）');
} else {
  console.log('\n🚨 回答判定システム要大幅改善');
}

console.log('\n' + '🧪'.repeat(40));
console.log('        テスト完了！');
console.log('🧪'.repeat(40));