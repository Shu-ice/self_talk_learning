import { TopicProgress, LearningSession } from '../types';
import { loadUserProgress } from './progressService';

// 弱点分析の結果
export interface WeaknessAnalysis {
  subjectId: string;
  topicId: string;
  weaknessLevel: 'critical' | 'moderate' | 'minor' | 'none';
  identifiedWeaknesses: WeaknessPattern[];
  recommendations: Recommendation[];
  focusAreas: string[];
  estimatedImprovementTime: number; // 改善予想時間（分）
}

// 弱点パターン
export interface WeaknessPattern {
  type: 'conceptual' | 'procedural' | 'application' | 'speed' | 'carelessness';
  description: string;
  severity: number; // 1-10 の重要度
  examples: string[];
  suggestedActions: string[];
}

// 推奨アクション
export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  estimatedTime: number; // 分
  resources?: string[];
}

// 弱点分析のメイン関数
export const analyzeWeaknesses = (subjectId: string, topicId?: string): WeaknessAnalysis[] => {
  const userProgress = loadUserProgress();
  if (!userProgress) return [];

  const subjectProgress = userProgress.subjectProgresses.find(sp => sp.subjectId === subjectId);
  if (!subjectProgress) return [];

  if (topicId) {
    // 特定の単元の分析
    const topicProgress = subjectProgress.topicProgresses.find(tp => tp.topicId === topicId);
    if (!topicProgress) return [];
    return [analyzeTopicWeaknesses(subjectId, topicProgress)];
  } else {
    // 教科全体の分析
    return subjectProgress.topicProgresses.map(tp => 
      analyzeTopicWeaknesses(subjectId, tp)
    );
  }
};

// 単元別弱点分析
const analyzeTopicWeaknesses = (subjectId: string, topicProgress: TopicProgress): WeaknessAnalysis => {
  const weaknessPatterns = identifyWeaknessPatterns(subjectId, topicProgress);
  const weaknessLevel = determineWeaknessLevel(topicProgress, weaknessPatterns);
  const recommendations = generateRecommendations(subjectId, topicProgress.topicId, weaknessPatterns);
  const focusAreas = extractFocusAreas(subjectId, topicProgress.topicId, weaknessPatterns);
  const estimatedTime = calculateImprovementTime(weaknessLevel, weaknessPatterns);

  return {
    subjectId,
    topicId: topicProgress.topicId,
    weaknessLevel,
    identifiedWeaknesses: weaknessPatterns,
    recommendations,
    focusAreas,
    estimatedImprovementTime: estimatedTime
  };
};

// 弱点パターンの特定
const identifyWeaknessPatterns = (subjectId: string, topicProgress: TopicProgress): WeaknessPattern[] => {
  const patterns: WeaknessPattern[] = [];
  const { averageCorrectRate, masteryScore, totalSessions, totalStudyTime } = topicProgress;

  // 1. 概念理解の問題
  if (averageCorrectRate < 0.6 && totalSessions >= 3) {
    patterns.push({
      type: 'conceptual',
      description: '基本概念の理解が不十分です',
      severity: 9,
      examples: getConceptualExamples(subjectId, topicProgress.topicId),
      suggestedActions: [
        '基本概念の復習から始める',
        '具体例を使った説明を重視する',
        '関連する前提知識を確認する'
      ]
    });
  }

  // 2. 手続き的知識の問題
  if (averageCorrectRate >= 0.6 && averageCorrectRate < 0.8 && masteryScore < 70) {
    patterns.push({
      type: 'procedural',
      description: '解法の手順や方法に課題があります',
      severity: 7,
      examples: getProceduralExamples(subjectId, topicProgress.topicId),
      suggestedActions: [
        '段階的な解法を練習する',
        '手順を明確化する',
        '類似問題での反復練習'
      ]
    });
  }

  // 3. 応用力の問題
  if (averageCorrectRate >= 0.7 && masteryScore < 80 && totalSessions >= 5) {
    patterns.push({
      type: 'application',
      description: '知識の応用や発展問題に課題があります',
      severity: 6,
      examples: getApplicationExamples(subjectId, topicProgress.topicId),
      suggestedActions: [
        '多様な問題パターンに触れる',
        '知識の関連付けを強化する',
        '実際の場面での活用を考える'
      ]
    });
  }

  // 4. 学習速度の問題
  const avgTimePerSession = totalSessions > 0 ? totalStudyTime / totalSessions : 0;
  if (avgTimePerSession > 1800 && averageCorrectRate < 0.8) { // 30分以上かつ正解率低い
    patterns.push({
      type: 'speed',
      description: '学習に時間がかかりすぎています',
      severity: 5,
      examples: ['問題解決に時間がかかる', '迷いが多い', '効率的な方法を見つけられない'],
      suggestedActions: [
        '時間を意識した練習をする',
        '解法パターンを暗記する',
        '効率的な解法を学ぶ'
      ]
    });
  }

  // 5. ケアレスミスの問題
  if (averageCorrectRate >= 0.7 && averageCorrectRate < 0.9 && totalSessions >= 4) {
    patterns.push({
      type: 'carelessness',
      description: 'ケアレスミスが学習効果を下げています',
      severity: 4,
      examples: ['計算ミス', '読み間違い', '確認不足'],
      suggestedActions: [
        '見直しの習慣をつける',
        '集中力を高める練習をする',
        'チェックリストを作成する'
      ]
    });
  }

  return patterns.sort((a, b) => b.severity - a.severity);
};

// 弱点レベルの決定
const determineWeaknessLevel = (
  topicProgress: TopicProgress, 
  patterns: WeaknessPattern[]
): 'critical' | 'moderate' | 'minor' | 'none' => {
  const { averageCorrectRate, masteryScore, totalSessions } = topicProgress;
  const maxSeverity = patterns.length > 0 ? Math.max(...patterns.map(p => p.severity)) : 0;

  if (averageCorrectRate < 0.4 || (masteryScore < 30 && totalSessions >= 3) || maxSeverity >= 9) {
    return 'critical';
  } else if (averageCorrectRate < 0.7 || masteryScore < 60 || maxSeverity >= 7) {
    return 'moderate';
  } else if (averageCorrectRate < 0.85 || masteryScore < 80 || maxSeverity >= 5) {
    return 'minor';
  } else {
    return 'none';
  }
};

// 推奨アクションの生成
const generateRecommendations = (
  _subjectId: string, 
  _topicId: string, 
  patterns: WeaknessPattern[]
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  patterns.forEach(pattern => {
    switch (pattern.type) {
      case 'conceptual':
        recommendations.push({
          priority: 'high',
          action: '基礎概念の復習',
          description: '基本的な概念から丁寧に学び直しましょう',
          estimatedTime: 30,
          resources: ['基礎教材', '解説動画', '図解資料']
        });
        break;
      
      case 'procedural':
        recommendations.push({
          priority: 'high',
          action: '手順の練習',
          description: '解法の手順を明確にして反復練習しましょう',
          estimatedTime: 25,
          resources: ['練習問題', 'ステップ解説']
        });
        break;
      
      case 'application':
        recommendations.push({
          priority: 'medium',
          action: '応用問題への挑戦',
          description: '様々なパターンの問題に取り組みましょう',
          estimatedTime: 35,
          resources: ['応用問題集', '過去問題']
        });
        break;
      
      case 'speed':
        recommendations.push({
          priority: 'medium',
          action: '時間を意識した練習',
          description: '制限時間を設けて効率的な解法を身につけましょう',
          estimatedTime: 20,
          resources: ['時間測定アプリ', '速解テクニック']
        });
        break;
      
      case 'carelessness':
        recommendations.push({
          priority: 'low',
          action: '見直し習慣の確立',
          description: '答えを出した後の確認を習慣化しましょう',
          estimatedTime: 15,
          resources: ['チェックリスト', '見直し方法ガイド']
        });
        break;
    }
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// 重点学習領域の抽出
const extractFocusAreas = (subjectId: string, topicId: string, patterns: WeaknessPattern[]): string[] => {
  const focusAreaMap: { [key: string]: { [key: string]: string[] } } = {
    'math': {
      'math_ratios': ['割合の概念', '比の性質', '文章題の読解', '計算精度'],
      'math_speed': ['速さの公式', '時間・距離・速さの関係', 'グラフの読み取り', '単位変換'],
      'math_area': ['面積公式', '体積公式', '図形の性質', '立体の展開'],
      'math_number_theory': ['約数・倍数', '素数', '数の性質', '規則性']
    },
    'japanese': {
      'jp_narrative': ['登場人物の心情', '場面設定', '表現技法', '主題理解'],
      'jp_explanatory': ['論理構造', '要旨把握', '筆者の主張', '根拠と結論'],
      'jp_kanji_idioms': ['漢字の読み書き', '語句の意味', '文法知識', '敬語']
    },
    'science': {
      'sci_plants_animals': ['生物の分類', '生態系', '体のつくり', '生命現象'],
      'sci_earth_space': ['天気の変化', '地層と化石', '天体の動き', '地震と火山'],
      'sci_matter_energy': ['物の性質', '力の働き', '電気回路', '光と音'],
      'sci_chemistry': ['物質の変化', '水溶液の性質', '燃焼と酸化', '中和反応']
    },
    'social_studies': {
      'soc_history_jp': ['時代の流れ', '歴史上の人物', '文化と社会', '政治の変化'],
      'soc_geography_jp': ['地形と気候', '産業と貿易', '人口と都市', '交通と通信'],
      'soc_civics': ['政治制度', '国際関係', '経済の仕組み', '現代の課題']
    }
  };

  const subjectAreas = focusAreaMap[subjectId];
  if (!subjectAreas || !subjectAreas[topicId]) {
    return ['基本概念', '応用力', '問題解決能力'];
  }

  // 弱点の深刻度に応じて重点領域を決定
  const criticalPatterns = patterns.filter(p => p.severity >= 8);
  if (criticalPatterns.length > 0) {
    return subjectAreas[topicId].slice(0, 2); // 最重要な2領域に集中
  }

  return subjectAreas[topicId];
};

// 改善予想時間の計算
const calculateImprovementTime = (
  weaknessLevel: 'critical' | 'moderate' | 'minor' | 'none',
  patterns: WeaknessPattern[]
): number => {
  const baseTime = {
    critical: 120, // 2時間
    moderate: 60,  // 1時間
    minor: 30,     // 30分
    none: 0
  };

  const patternTime = patterns.reduce((total, pattern) => total + (pattern.severity * 5), 0);
  
  return baseTime[weaknessLevel] + patternTime;
};

// 教科・単元別の具体例生成
const getConceptualExamples = (_subjectId: string, _topicId: string): string[] => {
  return ['基本概念の理解不足', '知識の定着が不十分'];
};

const getProceduralExamples = (_subjectId: string, _topicId: string): string[] => {
  return ['解法手順が不安定', '方法の選択に迷いがある'];
};

const getApplicationExamples = (_subjectId: string, _topicId: string): string[] => {
  return [
    '応用問題で知識を活用できない',
    '複合的な問題に対応できない',
    '実際の場面での応用が困難'
  ];
};

// 弱点改善の進捗追跡
export const trackWeaknessImprovement = (
  subjectId: string,
  topicId: string,
  previousAnalysis: WeaknessAnalysis,
  currentSession: LearningSession
): {
  improvement: boolean;
  improvementAreas: string[];
  remainingWeaknesses: WeaknessPattern[];
  nextFocus: string;
} => {
  const currentAnalysis = analyzeTopicWeaknesses(subjectId, {
    topicId,
    totalSessions: currentSession.totalMessages,
    totalStudyTime: currentSession.totalStudyTime,
    averageCorrectRate: currentSession.correctAnswers / (currentSession.correctAnswers + currentSession.incorrectAnswers) || 0,
    currentLevel: currentSession.difficultyLevel,
    masteryScore: 0, // セッション単体では計算困難
    lastStudiedAt: new Date(),
    weakPoints: []
  });

  const improvement = currentAnalysis.weaknessLevel < previousAnalysis.weaknessLevel ||
                     currentAnalysis.identifiedWeaknesses.length < previousAnalysis.identifiedWeaknesses.length;

  const improvementAreas = previousAnalysis.identifiedWeaknesses
    .filter(prev => !currentAnalysis.identifiedWeaknesses.find(curr => curr.type === prev.type))
    .map(pattern => pattern.description);

  const remainingWeaknesses = currentAnalysis.identifiedWeaknesses;
  const nextFocus = remainingWeaknesses.length > 0 
    ? remainingWeaknesses[0].suggestedActions[0]
    : '引き続き習熟度向上に取り組みましょう';

  return {
    improvement,
    improvementAreas,
    remainingWeaknesses,
    nextFocus
  };
};