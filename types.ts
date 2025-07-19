// 学習レベル定義
export type GradeLevel = '4th' | '5th' | '6th';

// 志望校レベル
export type SchoolLevel = 'basic' | 'standard' | 'advanced' | 'elite';

// 学習者プロフィール
export interface LearnerProfile {
  id: string;
  name: string;
  currentGrade: GradeLevel;
  targetGrade: GradeLevel; // 受験する学年
  
  // 志望校情報
  targetSchools: TargetSchool[];
  schoolLevel: SchoolLevel;
  
  // 学習状況
  studyStartDate: Date;
  examDate?: Date;
  availableStudyHours: {
    weekday: number; // 平日の1日あたり学習時間（時間）
    weekend: number; // 休日の1日あたり学習時間（時間）
  };
  
  // 学力レベル（教科別）
  subjectLevels: {
    [subjectId: string]: {
      currentLevel: number; // 1-10のレベル
      targetLevel: number;
      strengths: string[]; // 得意分野
      weaknesses: string[]; // 苦手分野
      lastAssessment?: Date;
    };
  };
  
  // 学習特性
  learningPreferences: {
    preferredDifficulty: 'gradual' | 'challenging' | 'mixed';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    sessionLength: 'short' | 'medium' | 'long'; // 20分/40分/60分
    motivationType: 'achievement' | 'progress' | 'competition' | 'exploration';
  };
  
  // 生活パターン
  schedule: {
    schoolSchedule: WeeklySchedule;
    studyTimeSlots: TimeSlot[];
    busyPeriods: BusyPeriod[]; // テスト期間など
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// 志望校情報
export interface TargetSchool {
  id: string;
  name: string;
  level: SchoolLevel;
  location: string;
  examDate: Date;
  requiredSubjects: string[];
  examStyle: {
    hasInterview: boolean;
    hasEssay: boolean;
    hasGroupDiscussion: boolean;
    specialRequirements: string[];
  };
  pastExamTrends: {
    frequentTopics: { [subjectId: string]: string[] };
    difficultyTrend: 'increasing' | 'stable' | 'decreasing';
    uniqueFeatures: string[];
  };
  priority: 'first_choice' | 'second_choice' | 'safety';
}

// 週間スケジュール
export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  schoolHours: TimeSlot[];
  extracurriculars: TimeSlot[];
  availableForStudy: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "HH:MM" format
  end: string;
  description?: string;
}

export interface BusyPeriod {
  start: Date;
  end: Date;
  type: 'school_exam' | 'school_event' | 'family_event' | 'illness';
  description: string;
  impactLevel: 'low' | 'medium' | 'high';
}

// アダプティブ学習計画
export interface AdaptiveLearningPlan {
  learnerId: string;
  planId: string;
  generatedAt: Date;
  validUntil: Date;
  
  // 全体目標
  overallGoals: {
    shortTerm: LearningGoal[]; // 1-2週間
    mediumTerm: LearningGoal[]; // 1-2ヶ月
    longTerm: LearningGoal[]; // 受験まで
  };
  
  // 週間学習計画
  weeklyPlan: WeeklyLearningPlan;
  
  // 教科別戦略
  subjectStrategies: {
    [subjectId: string]: SubjectStrategy;
  };
  
  // 進捗追跡
  progressTracking: {
    milestones: Milestone[];
    assessmentSchedule: AssessmentPlan[];
    adjustmentTriggers: AdjustmentTrigger[];
  };
}

export interface LearningGoal {
  id: string;
  description: string;
  subjectId: string;
  targetLevel: number;
  deadline: Date;
  measurableOutcomes: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
}

export interface WeeklyLearningPlan {
  weekStart: Date;
  totalStudyHours: number;
  dailyPlans: {
    [day: string]: DailyLearningPlan;
  };
}

export interface DailyLearningPlan {
  date: Date;
  plannedStudyTime: number;
  sessions: PlannedSession[];
  flexibleTime: number; // 自由学習時間
  reviewTime: number; // 復習時間
}

export interface PlannedSession {
  subjectId: string;
  topicId: string;
  duration: number;
  difficultyLevel: number;
  sessionType: 'learning' | 'practice' | 'review' | 'assessment';
  goals: string[];
  prerequisites: string[];
}

export interface SubjectStrategy {
  subjectId: string;
  currentFocus: string[];
  priorityTopics: string[];
  difficultyProgression: DifficultyProgression;
  practiceRatio: number; // 学習:練習の比率 (0-1)
  reviewFrequency: 'daily' | 'every_other_day' | 'weekly';
  specialTechniques: string[];
}

export interface DifficultyProgression {
  currentLevel: number;
  targetLevel: number;
  progressionRate: 'slow' | 'normal' | 'fast';
  adaptationFrequency: number; // 何セッションごとに調整するか
}

export interface Milestone {
  id: string;
  description: string;
  targetDate: Date;
  criteria: string[];
  reward?: string;
  status: 'upcoming' | 'due' | 'completed' | 'missed';
}

export interface AssessmentPlan {
  id: string;
  type: 'diagnostic' | 'progress' | 'mock_exam' | 'subject_test';
  subjectId?: string;
  scheduledDate: Date;
  duration: number;
  topics: string[];
  purposes: string[];
}

export interface AdjustmentTrigger {
  condition: 'low_performance' | 'high_performance' | 'time_shortage' | 'schedule_change' | 'motivation_drop';
  threshold: number;
  action: 'increase_difficulty' | 'decrease_difficulty' | 'change_focus' | 'add_support' | 'modify_schedule';
  description: string;
}

// サブユニット（詳細な学習項目）
export interface SubUnit {
  id: string;
  name: string;
  description: string;
  prerequisites: string[]; // 前提となるサブユニットID
  estimatedStudyTime: number; // 推定学習時間（分）
  difficultyRange: [number, number]; // 難易度範囲 [min, max]
  keywordTags: string[]; // 検索・分類用タグ
  gradeRelevance: {
    [grade in GradeLevel]: 'essential' | 'important' | 'supplementary' | 'advanced';
  };
  schoolLevelRelevance: {
    [level in SchoolLevel]: number; // 0-1の重要度
  };
}

// 単元（従来のTopic）
export interface Topic {
  id: string;
  name: string;
  description: string;
  subUnits: SubUnit[];
  gradeLevel: GradeLevel[];
  estimatedHours: number;
  difficulty: number; // 1-10
  examFrequency: {
    [level in SchoolLevel]: number; // 0-1の出題頻度
  };
  learningObjectives: string[]; // 学習目標リスト
  assessmentCriteria?: string[];
}

// 教科
export interface Subject {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  examWeight: {
    [level in SchoolLevel]: number; // 試験での重要度
  };
}

// チャットメッセージ
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  attachments?: MessageAttachment[];
  metadata?: {
    topicId?: string;
    difficultyLevel?: number;
    learningGoalId?: string;
    sessionType?: string;
  };
}

// 添付ファイル
export interface MessageAttachment {
  id: string;
  type: 'image' | 'pdf' | 'audio';
  fileName: string;
  fileSize: number;
  dataUrl: string;
  analysisResult?: ImageAnalysisResult;
}

// 画像解析結果
// 画像解析結果
export interface ImageAnalysisResult {
  detectedSubject: string;
  detectedTopic: string;
  difficultyLevel: number;
  extractedText: string;
  keyElements: string[];
  suggestedApproach: string;
  confidence: number;
  problemType?: 'calculation' | 'word_problem' | 'diagram' | 'multiple_choice' | 'fill_blank' | 'other';
}

// ユーザー進捗
export interface UserProgress {
  userId?: string;
  learnerProfile?: LearnerProfile;
  currentPlan?: AdaptiveLearningPlan;
  
  subjectProgress: {
    [subjectId: string]: {
      completedTopics: string[];
      currentTopic: string | null;
      masteryLevel: number; // 0-1
      timeSpent: number; // 分
      lastStudied: Date;
      streakDays: number;
      achievements: Achievement[];
    };
  };
  
  overallStats: {
    totalStudyTime: number;
    totalSessions: number;
    averageSessionLength: number;
    consistencyScore: number; // 0-1
    motivationLevel: number; // 0-1
    lastActiveDate: Date;
  };
  
  adaptiveMetrics: {
    learningVelocity: number; // トピック/時間
    retentionRate: number; // 0-1
    difficultyPreference: number; // 1-10
    optimalSessionLength: number; // 分
    bestStudyTimes: string[]; // "HH:MM" format
  };
  
  // Dashboard互換性のための追加フィールド
  learningStats: {
    currentStreak: number;
    totalSessions: number;
    totalStudyTime: number;
    overallCorrectRate: number;
    dailyStudyTime: { date: string; studyTime: number }[];
  };
  
  subjectProgresses: {
    subjectId: string;
    overallMasteryScore: number;
    totalSessions: number;
    totalStudyTime: number;
    lastStudiedAt: string;
    topicProgresses?: TopicProgress[];
  }[];
  
  achievements: Achievement[];
  
  preferences: {
    studyTimeGoal: number;
  };
}

// 達成項目
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'mastery' | 'speed' | 'accuracy' | 'consistency' | 'milestone';
  earnedAt: Date;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon?: string;
  title?: string;
  unlockedAt?: Date;
}

// 学習統計
export interface LearningStats {
  currentStreak: number;
  totalSessions: number;
  totalStudyTime: number;
  overallCorrectRate: number;
  dailyStudyTime: { date: string; studyTime: number }[];
}

// トピック進捗
export interface TopicProgress {
  topicId: string;
  masteryLevel: number;
  timeSpent: number;
  lastStudied: Date;
  attempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

// 学習セッション
export interface LearningSession {
  sessionId: string;
  userId: string;
  subjectId: string;
  topicId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  messagesCount: number;
  difficultyLevel: number;
  completionStatus: 'completed' | 'paused' | 'abandoned';
  learningOutcomes: string[];
  performanceMetrics: {
    responseTime: number;
    accuracy: number;
    engagement: number;
    comprehension: number;
  };
  adaptiveAdjustments: {
    difficultyChanged: boolean;
    focusShifted: boolean;
    timeAdjusted: boolean;
    supportAdded: boolean;
  };
  totalMessages?: number;
  totalStudyTime?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
}