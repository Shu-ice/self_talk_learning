import { ImageAnalysisResult, Topic, SubUnit, GradeLevel } from '../types';
import { DETAILED_SUBJECTS, getTopicsByGrade, checkPrerequisites } from '../data/detailedCurriculum';
import { loadUserProgress } from './progressService';

// 問題解析の詳細結果
export interface DetailedProblemAnalysis {
  originalAnalysis: ImageAnalysisResult;
  confirmedTopic: Topic | null;
  relevantSubUnits: SubUnit[];
  prerequisiteCheck: {
    missingPrerequisites: string[];
    readySubUnits: string[];
    recommendedOrder: string[];
  };
  difficultyAssessment: {
    estimatedLevel: number;
    reasonForLevel: string;
    appropriateForUser: boolean;
    suggestedAdjustment?: 'easier' | 'harder';
  };
  learningPath: {
    immediateGoals: string[];
    shortTermGoals: string[];
    longTermGoals: string[];
    estimatedTimeToMastery: number; // 分
  };
  practiceRecommendations: {
    similarProblems: string[];
    skillBuilding: string[];
    assessmentQuestions: string[];
  };
}

// 問題の包括的解析
export const analyzeProblemInDetail = async (
  analysisResult: ImageAnalysisResult,
  userGrade?: GradeLevel
): Promise<DetailedProblemAnalysis> => {
  
  // 1. 教科・単元の確認と調整
  const confirmedTopic = await confirmTopicFromAnalysis(analysisResult, userGrade);
  
  // 2. 関連サブユニットの特定
  const relevantSubUnits = findRelevantSubUnits(analysisResult, confirmedTopic);
  
  // 3. 前提条件チェック
  const prerequisiteCheck = checkUserPrerequisites(relevantSubUnits);
  
  // 4. 難易度評価
  const difficultyAssessment = assessDifficultyForUser(
    analysisResult, 
    confirmedTopic, 
    relevantSubUnits
  );
  
  // 5. 学習パス生成
  const learningPath = generateLearningPath(
    confirmedTopic, 
    relevantSubUnits, 
    prerequisiteCheck,
    difficultyAssessment
  );
  
  // 6. 練習問題推奨
  const practiceRecommendations = generatePracticeRecommendations(
    analysisResult,
    confirmedTopic,
    relevantSubUnits
  );
  
  return {
    originalAnalysis: analysisResult,
    confirmedTopic,
    relevantSubUnits,
    prerequisiteCheck,
    difficultyAssessment,
    learningPath,
    practiceRecommendations
  };
};

// 教科・単元の確認と調整
const confirmTopicFromAnalysis = async (
  analysis: ImageAnalysisResult,
  userGrade?: GradeLevel
): Promise<Topic | null> => {
  
  // 検出された教科から該当する Subject を見つける
  const detectedSubject = DETAILED_SUBJECTS.find(subject => 
    subject.name === analysis.detectedSubject || 
    subject.id === analysis.detectedSubject
  );
  
  if (!detectedSubject) return null;
  
  // 学年が指定されている場合は学年に応じたトピックのみを対象とする
  const candidateTopics = userGrade 
    ? getTopicsByGrade(detectedSubject.id, userGrade)
    : detectedSubject.topics;
  
  // 解析結果から最も適切なトピックを選択
  let bestMatch: Topic | null = null;
  let bestScore = 0;
  
  for (const topic of candidateTopics) {
    const score = calculateTopicMatchScore(analysis, topic);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }
  
  return bestMatch;
};

// トピックマッチ度の計算
const calculateTopicMatchScore = (analysis: ImageAnalysisResult, topic: Topic): number => {
  let score = 0;
  
  // トピック名のマッチ
  if (topic.name.includes(analysis.detectedTopic) || 
      analysis.detectedTopic.includes(topic.name)) {
    score += 50;
  }
  
  // キーワードのマッチ
  for (const keyword of analysis.keyElements) {
    for (const subUnit of topic.subUnits) {
      if (subUnit.keywordTags.some(tag => 
          tag.includes(keyword) || keyword.includes(tag))) {
        score += 10;
      }
    }
  }
  
  // 難易度の一致
  const topicDifficultyRange = [
    Math.min(...topic.subUnits.map(su => su.difficultyRange[0])),
    Math.max(...topic.subUnits.map(su => su.difficultyRange[1]))
  ];
  
  if (analysis.difficultyLevel >= topicDifficultyRange[0] && 
      analysis.difficultyLevel <= topicDifficultyRange[1]) {
    score += 20;
  }
  
  return score;
};

// 関連サブユニットの特定
const findRelevantSubUnits = (
  analysis: ImageAnalysisResult, 
  confirmedTopic: Topic | null
): SubUnit[] => {
  if (!confirmedTopic) return [];
  
  const relevantSubUnits: SubUnit[] = [];
  
  // キーワードマッチでサブユニットを特定
  for (const subUnit of confirmedTopic.subUnits) {
    let relevanceScore = 0;
    
    // キーワードマッチ
    for (const keyword of analysis.keyElements) {
      if (subUnit.keywordTags.some(tag => 
          tag.includes(keyword) || keyword.includes(tag))) {
        relevanceScore += 10;
      }
    }
    
    // 難易度範囲のマッチ
    if (analysis.difficultyLevel >= subUnit.difficultyRange[0] && 
        analysis.difficultyLevel <= subUnit.difficultyRange[1]) {
      relevanceScore += 5;
    }
    
    // 問題種別のマッチ
    if (analysis.problemType === 'calculation' && 
        subUnit.keywordTags.some(tag => tag.includes('計算'))) {
      relevanceScore += 5;
    }
    
    if (relevanceScore > 0) {
      relevantSubUnits.push(subUnit);
    }
  }
  
  // 関連度順でソート
  return relevantSubUnits.sort((a, b) => {
    const scoreA = calculateSubUnitRelevance(analysis, a);
    const scoreB = calculateSubUnitRelevance(analysis, b);
    return scoreB - scoreA;
  });
};

// サブユニット関連度計算
const calculateSubUnitRelevance = (analysis: ImageAnalysisResult, subUnit: SubUnit): number => {
  let score = 0;
  
  for (const keyword of analysis.keyElements) {
    if (subUnit.keywordTags.some(tag => tag.includes(keyword))) {
      score += 10;
    }
  }
  
  return score;
};

// ユーザーの前提条件チェック
const checkUserPrerequisites = (relevantSubUnits: SubUnit[]): {
  missingPrerequisites: string[];
  readySubUnits: string[];
  recommendedOrder: string[];
} => {
  const userProgress = loadUserProgress();
  const completedSubUnits = userProgress ? 
    userProgress.subjectProgresses.flatMap(sp => 
      sp.topicProgresses.flatMap(tp => tp.weakPoints || [])
    ) : [];
  
  const missingPrerequisites: string[] = [];
  const readySubUnits: string[] = [];
  const recommendedOrder: string[] = [];
  
  // 前提条件チェック
  for (const subUnit of relevantSubUnits) {
    const hasPrerequisites = checkPrerequisites(subUnit.id, completedSubUnits);
    
    if (hasPrerequisites) {
      readySubUnits.push(subUnit.name);
    } else {
      // 不足している前提条件を特定
      for (const prereq of subUnit.prerequisites) {
        if (!completedSubUnits.includes(prereq) && 
            !missingPrerequisites.includes(prereq)) {
          missingPrerequisites.push(prereq);
        }
      }
    }
  }
  
  // 推奨学習順序の生成
  const sortedSubUnits = [...relevantSubUnits].sort((a, b) => {
    // 前提条件の少ない順、難易度の低い順
    const prereqDiff = a.prerequisites.length - b.prerequisites.length;
    if (prereqDiff !== 0) return prereqDiff;
    
    return a.difficultyRange[0] - b.difficultyRange[0];
  });
  
  recommendedOrder.push(...sortedSubUnits.map(su => su.name));
  
  return {
    missingPrerequisites,
    readySubUnits,
    recommendedOrder
  };
};

// ユーザーにとっての難易度評価
const assessDifficultyForUser = (
  analysis: ImageAnalysisResult,
  confirmedTopic: Topic | null,
  relevantSubUnits: SubUnit[]
): {
  estimatedLevel: number;
  reasonForLevel: string;
  appropriateForUser: boolean;
  suggestedAdjustment?: 'easier' | 'harder';
} => {
  const userProgress = loadUserProgress();
  
  // ユーザーの現在のレベルを推定
  let userCurrentLevel = 3; // デフォルト
  if (userProgress && confirmedTopic) {
    const topicProgress = userProgress.subjectProgresses
      .find(sp => sp.subjectId === confirmedTopic.id)
      ?.topicProgresses.find(tp => tp.topicId === confirmedTopic.id);
    
    if (topicProgress) {
      userCurrentLevel = topicProgress.currentLevel || 3;
    }
  }
  
  const problemLevel = analysis.difficultyLevel;
  const levelDifference = problemLevel - userCurrentLevel;
  
  let appropriateForUser = Math.abs(levelDifference) <= 1;
  let suggestedAdjustment: 'easier' | 'harder' | undefined;
  let reasonForLevel = '';
  
  if (levelDifference > 1) {
    appropriateForUser = false;
    suggestedAdjustment = 'easier';
    reasonForLevel = `現在のレベル（${userCurrentLevel}）より${levelDifference}段階高く、基礎固めが必要です`;
  } else if (levelDifference < -1) {
    suggestedAdjustment = 'harder';
    reasonForLevel = `現在のレベルより${Math.abs(levelDifference)}段階低く、より挑戦的な問題が適しています`;
  } else {
    reasonForLevel = appropriateForUser 
      ? `現在のレベルに適しています`
      : `現在のレベルから${levelDifference > 0 ? '少し' : 'やや'}${levelDifference > 0 ? '高い' : '低い'}レベルです`;
  }
  
  return {
    estimatedLevel: problemLevel,
    reasonForLevel,
    appropriateForUser,
    suggestedAdjustment
  };
};

// 学習パス生成
const generateLearningPath = (
  confirmedTopic: Topic | null,
  relevantSubUnits: SubUnit[],
  prerequisiteCheck: any,
  difficultyAssessment: any
): {
  immediateGoals: string[];
  shortTermGoals: string[];
  longTermGoals: string[];
  estimatedTimeToMastery: number;
} => {
  const immediateGoals: string[] = [];
  const shortTermGoals: string[] = [];
  const longTermGoals: string[] = [];
  
  // 前提条件が不足している場合
  if (prerequisiteCheck.missingPrerequisites.length > 0) {
    immediateGoals.push('不足している前提知識の補強');
    immediateGoals.push(...prerequisiteCheck.missingPrerequisites.map(
      prereq => `${prereq}の理解と習得`
    ));
  }
  
  // 現在のレベルに応じた目標設定
  if (difficultyAssessment.appropriateForUser) {
    immediateGoals.push('この問題の解法を理解する');
    shortTermGoals.push('類似問題での練習');
    shortTermGoals.push('応用問題への挑戦');
  } else if (difficultyAssessment.suggestedAdjustment === 'easier') {
    immediateGoals.push('基礎レベルの問題から始める');
    shortTermGoals.push('段階的に難易度を上げる');
  } else {
    immediateGoals.push('より挑戦的な問題に取り組む');
  }
  
  // 関連サブユニットに基づく長期目標
  if (confirmedTopic) {
    longTermGoals.push(`${confirmedTopic.name}の完全習得`);
    longTermGoals.push(...confirmedTopic.learningObjectives);
  }
  
  // 推定習得時間の計算
  const totalEstimatedTime = relevantSubUnits.reduce(
    (total, subUnit) => total + subUnit.estimatedStudyTime, 0
  );
  
  return {
    immediateGoals,
    shortTermGoals,
    longTermGoals,
    estimatedTimeToMastery: Math.max(totalEstimatedTime, 30)
  };
};

// 練習問題推奨の生成
const generatePracticeRecommendations = (
  analysis: ImageAnalysisResult,
  confirmedTopic: Topic | null,
  relevantSubUnits: SubUnit[]
): {
  similarProblems: string[];
  skillBuilding: string[];
  assessmentQuestions: string[];
} => {
  return {
    similarProblems: [
      '同じ解法パターンを使う類似問題',
      '数値や条件を変えた同種の問題',
      '同じ概念を異なる文脈で扱う問題'
    ],
    skillBuilding: relevantSubUnits.map(subUnit => 
      `${subUnit.name}の基礎練習問題`
    ),
    assessmentQuestions: [
      '理解度確認のための応用問題',
      '制限時間内での解答練習',
      '説明力を試す論述問題'
    ]
  };
};

// 学習成果の予測
export const predictLearningOutcome = (
  analysis: DetailedProblemAnalysis,
  currentUserLevel: number
): {
  expectedMasteryTime: number;
  successProbability: number;
  recommendedApproach: string;
  milestones: { description: string; estimatedTime: number }[];
} => {
  const { difficultyAssessment, learningPath, relevantSubUnits } = analysis;
  
  const levelGap = Math.abs(difficultyAssessment.estimatedLevel - currentUserLevel);
  const successProbability = Math.max(0.1, 1 - (levelGap * 0.2));
  
  const baseTime = learningPath.estimatedTimeToMastery;
  const adjustedTime = baseTime * (1 + levelGap * 0.3);
  
  const milestones = [
    { description: '基礎概念の理解', estimatedTime: Math.round(adjustedTime * 0.3) },
    { description: '解法の習得', estimatedTime: Math.round(adjustedTime * 0.5) },
    { description: '応用力の獲得', estimatedTime: Math.round(adjustedTime * 0.8) },
    { description: '習熟と定着', estimatedTime: Math.round(adjustedTime) }
  ];
  
  let recommendedApproach = '';
  if (levelGap <= 1) {
    recommendedApproach = '直接的なアプローチで効率的に学習できます';
  } else if (levelGap <= 2) {
    recommendedApproach = '段階的なアプローチで着実に進めましょう';
  } else {
    recommendedApproach = '基礎固めから丁寧に取り組む必要があります';
  }
  
  return {
    expectedMasteryTime: Math.round(adjustedTime),
    successProbability,
    recommendedApproach,
    milestones
  };
};