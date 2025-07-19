import { 
  UserProgress, 
  LearningSession, 
  SubjectProgress, 
  TopicProgress, 
  LearningStats,
  Achievement
} from '../types';

const STORAGE_KEY = 'aiSelfTalkLearning_userProgress';
const DEFAULT_USER_ID = 'default_user';

// ローカルストレージからの進捗データ読み込み
export const loadUserProgress = (): UserProgress | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    // Date型の復元
    data.lastUpdated = new Date(data.lastUpdated);
    data.subjectProgresses.forEach((sp: SubjectProgress) => {
      sp.lastStudiedAt = new Date(sp.lastStudiedAt);
      sp.topicProgresses.forEach((tp: TopicProgress) => {
        tp.lastStudiedAt = new Date(tp.lastStudiedAt);
      });
    });
    data.achievements.forEach((achievement: Achievement) => {
      achievement.unlockedAt = new Date(achievement.unlockedAt);
    });
    
    return data;
  } catch (error) {
    console.error('進捗データの読み込みに失敗しました:', error);
    return null;
  }
};

// ローカルストレージへの進捗データ保存
export const saveUserProgress = (progress: UserProgress): void => {
  try {
    progress.lastUpdated = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('進捗データの保存に失敗しました:', error);
  }
};

// 初期ユーザー進捗データ作成
export const createInitialUserProgress = (): UserProgress => {
  return {
    userId: DEFAULT_USER_ID,
    subjectProgresses: [],
    learningStats: {
      totalStudyDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalStudyTime: 0,
      overallCorrectRate: 0,
      dailyStudyTime: [],
      weeklyProgress: []
    },
    achievements: [],
    preferences: {
      preferredDifficulty: 3,
      studyTimeGoal: 20,
      enableNotifications: true
    },
    lastUpdated: new Date()
  };
};

// 学習セッション開始時の記録
export const startLearningSession = (subjectId: string, topicId: string): LearningSession => {
  const session: LearningSession = {
    id: crypto.randomUUID(),
    subjectId,
    topicId,
    startTime: new Date(),
    totalMessages: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalStudyTime: 0,
    difficultyLevel: 3 // デフォルト中級
  };
  
  return session;
};

// 学習セッション終了時の記録
export const endLearningSession = (session: LearningSession): LearningSession => {
  if (!session.endTime) {
    session.endTime = new Date();
    session.totalStudyTime = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
  }
  return session;
};

// メッセージ送信時の統計更新
export const updateSessionStats = (
  session: LearningSession, 
  isCorrect?: boolean
): LearningSession => {
  session.totalMessages++;
  if (isCorrect === true) {
    session.correctAnswers++;
  } else if (isCorrect === false) {
    session.incorrectAnswers++;
  }
  return session;
};

// 教科別進捗の取得または作成
export const getOrCreateSubjectProgress = (
  userProgress: UserProgress, 
  subjectId: string
): SubjectProgress => {
  let subjectProgress = userProgress.subjectProgresses.find(sp => sp.subjectId === subjectId);
  
  if (!subjectProgress) {
    subjectProgress = {
      subjectId,
      totalSessions: 0,
      totalStudyTime: 0,
      averageCorrectRate: 0,
      topicProgresses: [],
      overallMasteryScore: 0,
      lastStudiedAt: new Date()
    };
    userProgress.subjectProgresses.push(subjectProgress);
  }
  
  return subjectProgress;
};

// 単元別進捗の取得または作成
export const getOrCreateTopicProgress = (
  subjectProgress: SubjectProgress, 
  topicId: string
): TopicProgress => {
  let topicProgress = subjectProgress.topicProgresses.find(tp => tp.topicId === topicId);
  
  if (!topicProgress) {
    topicProgress = {
      topicId,
      totalSessions: 0,
      totalStudyTime: 0,
      averageCorrectRate: 0,
      currentLevel: 1,
      masteryScore: 0,
      lastStudiedAt: new Date(),
      weakPoints: []
    };
    subjectProgress.topicProgresses.push(topicProgress);
  }
  
  return topicProgress;
};

// 学習セッション完了後の進捗更新
export const updateProgressAfterSession = (session: LearningSession): void => {
  let userProgress = loadUserProgress();
  if (!userProgress) {
    userProgress = createInitialUserProgress();
  }
  
  const subjectProgress = getOrCreateSubjectProgress(userProgress, session.subjectId);
  const topicProgress = getOrCreateTopicProgress(subjectProgress, session.topicId);
  
  // セッション統計更新
  const correctRate = session.totalMessages > 0 
    ? session.correctAnswers / (session.correctAnswers + session.incorrectAnswers) || 0 
    : 0;
  
  // 単元進捗更新
  topicProgress.totalSessions++;
  topicProgress.totalStudyTime += session.totalStudyTime;
  topicProgress.averageCorrectRate = calculateNewAverage(
    topicProgress.averageCorrectRate,
    correctRate,
    topicProgress.totalSessions
  );
  topicProgress.lastStudiedAt = new Date();
  
  // 習熟度計算 (正解率、学習時間、セッション数を考慮)
  topicProgress.masteryScore = Math.min(100, Math.floor(
    (topicProgress.averageCorrectRate * 0.6 + 
     Math.min(topicProgress.totalSessions / 10, 1) * 0.3 +
     Math.min(topicProgress.totalStudyTime / 3600, 1) * 0.1) * 100
  ));
  
  // 現在のレベルを更新（新規の場合はセッションの難易度を使用）
  if (!topicProgress.currentLevel) {
    topicProgress.currentLevel = session.difficultyLevel;
  }
  
  // 教科進捗更新
  subjectProgress.totalSessions++;
  subjectProgress.totalStudyTime += session.totalStudyTime;
  subjectProgress.averageCorrectRate = calculateNewAverage(
    subjectProgress.averageCorrectRate,
    correctRate,
    subjectProgress.totalSessions
  );
  subjectProgress.lastStudiedAt = new Date();
  subjectProgress.overallMasteryScore = Math.floor(
    subjectProgress.topicProgresses.reduce((sum, tp) => sum + tp.masteryScore, 0) / 
    subjectProgress.topicProgresses.length
  );
  
  // 全体統計更新
  updateOverallStats(userProgress, session);
  
  // 実績チェック
  checkAndUnlockAchievements(userProgress);
  
  saveUserProgress(userProgress);
};

// 新しい平均値計算
const calculateNewAverage = (currentAverage: number, newValue: number, totalCount: number): number => {
  if (totalCount <= 1) return newValue;
  return ((currentAverage * (totalCount - 1)) + newValue) / totalCount;
};

// 全体統計更新
const updateOverallStats = (userProgress: UserProgress, session: LearningSession): void => {
  const stats = userProgress.learningStats;
  
  stats.totalSessions++;
  stats.totalStudyTime += session.totalStudyTime;
  
  const today = new Date().toISOString().split('T')[0];
  
  // 今日の学習時間更新
  let todayEntry = stats.dailyStudyTime.find(d => d.date === today);
  if (!todayEntry) {
    todayEntry = { date: today, studyTime: 0 };
    stats.dailyStudyTime.push(todayEntry);
  }
  todayEntry.studyTime += session.totalStudyTime;
  
  // 過去30日のデータのみ保持
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  stats.dailyStudyTime = stats.dailyStudyTime.filter(
    d => new Date(d.date) >= thirtyDaysAgo
  );
  
  // 連続学習日数更新
  updateStreakCount(stats);
  
  // 全体正解率計算
  const totalCorrect = userProgress.subjectProgresses.reduce((sum, sp) => 
    sum + sp.totalSessions * sp.averageCorrectRate, 0
  );
  const totalSessions = userProgress.subjectProgresses.reduce((sum, sp) => 
    sum + sp.totalSessions, 0
  );
  stats.overallCorrectRate = totalSessions > 0 ? totalCorrect / totalSessions : 0;
};

// 連続学習日数計算
const updateStreakCount = (stats: LearningStats): void => {
  const sortedDays = stats.dailyStudyTime
    .filter(d => d.studyTime > 0)
    .map(d => d.date)
    .sort()
    .reverse();
  
  if (sortedDays.length === 0) {
    stats.currentStreak = 0;
    return;
  }
  
  let streak = 0;
  let currentDate = new Date();
  
  // 今日から遡って連続日数をカウント
  for (let i = 0; i < sortedDays.length; i++) {
    const checkDate = currentDate.toISOString().split('T')[0];
    if (sortedDays.includes(checkDate)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  stats.currentStreak = streak;
  stats.longestStreak = Math.max(stats.longestStreak, streak);
  stats.totalStudyDays = new Set(sortedDays).size;
};

// 実績解除チェック
const checkAndUnlockAchievements = (userProgress: UserProgress): void => {
  const stats = userProgress.learningStats;
  const achievements = userProgress.achievements;
  
  // 既に解除済みの実績IDリスト
  const unlockedIds = new Set(achievements.map(a => a.id));
  
  // 実績定義と解除条件チェック
  const achievementChecks = [
    {
      id: 'first_session',
      title: '学習スタート！',
      description: '初回学習セッションを完了しました',
      type: 'accuracy' as const,
      condition: () => stats.totalSessions >= 1,
      icon: '🎯'
    },
    {
      id: 'streak_3',
      title: '3日連続学習',
      description: '3日連続で学習を継続しました',
      type: 'streak' as const,
      condition: () => stats.currentStreak >= 3,
      icon: '🔥'
    },
    {
      id: 'streak_7',
      title: '1週間連続学習',
      description: '7日連続で学習を継続しました',
      type: 'streak' as const,
      condition: () => stats.currentStreak >= 7,
      icon: '⭐'
    },
    {
      id: 'time_60',
      title: '60分学習達成',
      description: '累計60分の学習を達成しました',
      type: 'time' as const,
      condition: () => stats.totalStudyTime >= 3600,
      icon: '⏰'
    }
  ];
  
  achievementChecks.forEach(check => {
    if (!unlockedIds.has(check.id) && check.condition()) {
      achievements.push({
        id: check.id,
        title: check.title,
        description: check.description,
        type: check.type,
        unlockedAt: new Date(),
        icon: check.icon
      });
    }
  });
};