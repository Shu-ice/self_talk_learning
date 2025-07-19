import { LearningSession } from '../types';
import { loadUserProgress } from './progressService';

// 難易度レベル定義
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DifficultyAdjustment {
  newLevel: DifficultyLevel;
  reason: string;
  confidence: number; // 0-1 の信頼度
}

export interface AdaptiveLearningContext {
  subjectId: string;
  topicId: string;
  currentLevel: DifficultyLevel;
  recentPerformance: number[]; // 最近の正解率履歴
  sessionCount: number;
  averageCorrectRate: number;
  masteryScore: number;
}

// 難易度調整アルゴリズム
export const calculateDifficultyAdjustment = (
  context: AdaptiveLearningContext
): DifficultyAdjustment => {
  const { 
    currentLevel, 
    recentPerformance, 
    sessionCount, 
    averageCorrectRate, 
    masteryScore 
  } = context;

  // 最近3セッションの平均パフォーマンス
  const recentAverage = recentPerformance.length > 0 
    ? recentPerformance.reduce((sum, rate) => sum + rate, 0) / recentPerformance.length 
    : averageCorrectRate;

  let newLevel = currentLevel;
  let reason = '';
  let confidence = 0.5;

  // レベルアップ条件
  if (recentAverage >= 0.85 && sessionCount >= 3 && currentLevel < 5) {
    newLevel = Math.min(5, currentLevel + 1) as DifficultyLevel;
    reason = `正解率${Math.round(recentAverage * 100)}%で安定しているため、難易度を上げます`;
    confidence = Math.min(0.9, (recentAverage - 0.85) * 2 + 0.7);
  }
  // 大幅レベルアップ（優秀な成績が続いた場合）
  else if (recentAverage >= 0.95 && sessionCount >= 5 && masteryScore >= 80 && currentLevel < 4) {
    newLevel = Math.min(5, currentLevel + 2) as DifficultyLevel;
    reason = `優秀な成績が続いているため、2段階レベルアップします`;
    confidence = 0.95;
  }
  // レベルダウン条件
  else if (recentAverage <= 0.5 && sessionCount >= 2 && currentLevel > 1) {
    newLevel = Math.max(1, currentLevel - 1) as DifficultyLevel;
    reason = `正解率${Math.round(recentAverage * 100)}%と低めのため、難易度を下げます`;
    confidence = Math.min(0.9, (0.5 - recentAverage) * 2 + 0.7);
  }
  // 大幅レベルダウン（継続的に困難な場合）
  else if (recentAverage <= 0.3 && sessionCount >= 3 && currentLevel > 2) {
    newLevel = Math.max(1, currentLevel - 2) as DifficultyLevel;
    reason = `継続的に困難な状況のため、2段階レベルダウンします`;
    confidence = 0.9;
  }
  // 微調整：習熟度に基づく調整
  else if (sessionCount >= 5) {
    if (masteryScore >= 90 && averageCorrectRate >= 0.8 && currentLevel < 5) {
      newLevel = Math.min(5, currentLevel + 1) as DifficultyLevel;
      reason = `習熟度${masteryScore}%に達したため、チャレンジレベルに移行します`;
      confidence = 0.8;
    } else if (masteryScore <= 40 && averageCorrectRate <= 0.6 && currentLevel > 1) {
      newLevel = Math.max(1, currentLevel - 1) as DifficultyLevel;
      reason = `基礎固めが必要なため、レベルを下げて確実な理解を目指します`;
      confidence = 0.8;
    }
  }

  // 変更がない場合
  if (newLevel === currentLevel) {
    reason = `現在のレベル${currentLevel}が適切です`;
    confidence = 0.7;
  }

  return { newLevel, reason, confidence };
};

// 学習コンテキストの構築
export const buildLearningContext = (
  subjectId: string, 
  topicId: string
): AdaptiveLearningContext => {
  const userProgress = loadUserProgress();
  if (!userProgress) {
    // 初回学習の場合
    return {
      subjectId,
      topicId,
      currentLevel: 3, // デフォルト中級レベル
      recentPerformance: [],
      sessionCount: 0,
      averageCorrectRate: 0,
      masteryScore: 0
    };
  }

  const subjectProgress = userProgress.subjectProgresses.find(sp => sp.subjectId === subjectId);
  const topicProgress = subjectProgress?.topicProgresses.find(tp => tp.topicId === topicId);

  if (!topicProgress) {
    // この単元が初回の場合、他の単元の成績を参考にする
    const otherTopics = subjectProgress?.topicProgresses || [];
    const avgCorrectRate = otherTopics.length > 0
      ? otherTopics.reduce((sum, tp) => sum + tp.averageCorrectRate, 0) / otherTopics.length
      : 0;

    // 他の単元の成績に基づいて初期レベルを決定
    let initialLevel: DifficultyLevel = 3;
    if (avgCorrectRate >= 0.8) initialLevel = 4;
    else if (avgCorrectRate >= 0.6) initialLevel = 3;
    else if (avgCorrectRate >= 0.4) initialLevel = 2;
    else initialLevel = 1;

    return {
      subjectId,
      topicId,
      currentLevel: initialLevel,
      recentPerformance: [],
      sessionCount: 0,
      averageCorrectRate: avgCorrectRate,
      masteryScore: 0
    };
  }

  // 最近の成績履歴を推定（実際の実装では詳細な履歴を保存）
  const recentPerformance = generateRecentPerformanceEstimate(
    topicProgress.averageCorrectRate,
    topicProgress.totalSessions
  );

  return {
    subjectId,
    topicId,
    currentLevel: topicProgress.currentLevel as DifficultyLevel,
    recentPerformance,
    sessionCount: topicProgress.totalSessions,
    averageCorrectRate: topicProgress.averageCorrectRate,
    masteryScore: topicProgress.masteryScore
  };
};

// 最近のパフォーマンス推定（実際の実装では詳細履歴を保存推奨）
const generateRecentPerformanceEstimate = (
  averageCorrectRate: number,
  sessionCount: number
): number[] => {
  if (sessionCount === 0) return [];
  
  const recentSessionCount = Math.min(5, sessionCount);
  const performance: number[] = [];
  
  // 平均を中心とした正規分布風の値を生成
  for (let i = 0; i < recentSessionCount; i++) {
    const variance = 0.1; // 10%の分散
    const randomFactor = (Math.random() - 0.5) * variance * 2;
    const estimatedRate = Math.max(0, Math.min(1, averageCorrectRate + randomFactor));
    performance.push(estimatedRate);
  }
  
  return performance;
};

// 難易度レベルに基づくプロンプト調整
export const getDifficultyPromptModifier = (level: DifficultyLevel): string => {
  const modifiers = {
    1: `レベル1（基礎）: 基本的な概念を重視し、ステップバイステップで丁寧に説明してください。ヒントを多めに提供し、生徒が自信を持てるようサポートしてください。`,
    2: `レベル2（初級）: 基本問題を中心に、少しずつ応用要素を取り入れてください。間違いを恐れずチャレンジできる雰囲気を作ってください。`,
    3: `レベル3（中級）: 標準的な問題レベルで、思考プロセスを重視した質問をしてください。自分で考える時間を十分に与えてください。`,
    4: `レベル4（上級）: やや応用的な問題で、複数の解法や視点を考えさせてください。論理的思考力を伸ばす質問を心がけてください。`,
    5: `レベル5（応用）: 発展的な問題で、創造的思考や問題解決能力を鍛えてください。複合的な知識の活用を促してください。`
  };
  
  return modifiers[level];
};

// 実際の学習セッションでの難易度調整適用
export const applyAdaptiveLearning = (subjectId: string, topicId: string): {
  level: DifficultyLevel;
  promptModifier: string;
  adjustment?: DifficultyAdjustment;
} => {
  const context = buildLearningContext(subjectId, topicId);
  const adjustment = calculateDifficultyAdjustment(context);
  
  return {
    level: adjustment.newLevel,
    promptModifier: getDifficultyPromptModifier(adjustment.newLevel),
    adjustment: adjustment.newLevel !== context.currentLevel ? adjustment : undefined
  };
};

// 学習成果の評価とフィードバック
export const evaluateLearningOutcome = (
  session: LearningSession,
  _expectedLevel: DifficultyLevel
): {
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
  feedback: string;
  recommendations: string[];
} => {
  const correctRate = session.totalMessages > 0 
    ? session.correctAnswers / (session.correctAnswers + session.incorrectAnswers) || 0
    : 0;

  let performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
  let feedback: string;
  let recommendations: string[] = [];

  if (correctRate >= 0.9) {
    performance = 'excellent';
    feedback = '素晴らしい成績です！理解が非常に深まっています。';
    recommendations = [
      '次回はより高いレベルの問題にチャレンジしてみましょう',
      '学んだ内容を他の単元にも応用してみてください',
      '得意分野を活かして、苦手分野の学習にも取り組んでみてください'
    ];
  } else if (correctRate >= 0.7) {
    performance = 'good';
    feedback = '良い成績です！順調に理解が進んでいます。';
    recommendations = [
      '間違えた問題を見直して、理解を確実にしましょう',
      '類似問題で練習を重ねると、さらに力がつきます',
      '疑問点があれば、遠慮なく質問してください'
    ];
  } else if (correctRate >= 0.5) {
    performance = 'average';
    feedback = '基本的な理解はできています。もう少し練習しましょう。';
    recommendations = [
      '基礎的な内容を復習して、土台を固めましょう',
      '同じレベルの問題で繰り返し練習してみてください',
      '分からない部分は、より基本的な説明から始めましょう'
    ];
  } else {
    performance = 'needs_improvement';
    feedback = '基礎からじっくり取り組みましょう。焦らず一歩ずつ進めます。';
    recommendations = [
      '難易度を下げて、確実に理解できるレベルから始めましょう',
      '基本概念の復習に時間をかけることが大切です',
      '小さな成功を積み重ねて、自信をつけていきましょう'
    ];
  }

  return { performance, feedback, recommendations };
};