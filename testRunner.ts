// テスト実行スクリプト
import { runEducationSystemTests } from './tests/enhancedEducationSystemTest';

console.log('🚀 世界最高の中学受験教育アプリ - システムテスト開始！');
console.log('='.repeat(60));

try {
  const testResults = runEducationSystemTests();
  
  console.log(testResults.summary);
  
  // 詳細結果の表示
  console.log('\n📋 詳細テスト結果:');
  console.log('='.repeat(60));
  
  Object.entries(testResults.detailedResults).forEach(([testName, result]) => {
    console.log(`\n🔍 ${testName.toUpperCase()}:`);
    console.log(`   状態: ${result.success ? '✅ 成功' : '❌ 改善必要'}`);
    result.details.forEach(detail => console.log(`   ${detail}`));
  });
  
  if (testResults.overallSuccess) {
    console.log('\n🎉 おめでとうございます！世界最高レベルの教育システムが完成しています！');
  } else {
    console.log('\n⚠️ システムの改善を続けて、さらに良いものにしていきましょう！');
  }
  
} catch (error) {
  console.error('❌ テスト実行中にエラーが発生しました:', error);
}