// 保護者向けダッシュボード関連の型定義

import { LearnerProfile, UserProgress, Achievement } from '../types';

// 保護者アカウント
export interface ParentAccount {
  id: string;
  name: string;
  email: string;
  children: string[]; // 子供のLearnerProfile IDのリスト
  notificationPreferences: NotificationPreferences;
  accessLevel: 'full' | 'summary' | 'progress_only';
  createdAt: Date;
  lastLoginAt: Date;
}

// 通知設定
export interface NotificationPreferences {
  dailyProgress: boolean;
  weeklyReport: boolean;
  achievements: boolean;
  strugglingAlerts: boolean;
  scheduleReminders: boolean;
  methods: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  quietHours: {
    start: string; // "HH:MM"
    end: string;
  };
}

// 学習レポート
export interface LearningReport {
  id: string;
  learnerId: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  
  summary: {
    totalStudyTime: number;
    sessionsCompleted: number;
    averageSessionLength: number;
    topicsCompleted: number;
    overallProgress: number; // 0-1
    motivationLevel: number; // 0-1
  };
  
  subjectBreakdown: {
    [subjectId: string]: {
      timeSpent: number;
      progress: number;
      strengths: string[];
      improvements: string[];
      nextGoals: string[];
    };
  };
  
  learningInsights: {
    bestStudyTimes: string[];
    preferredLearningStyle: string;
    attentionSpanTrend: 'improving' | 'stable' | 'declining';
    difficultyComfortZone: number;
    collaborationNeeds: string[];
  };
  
  parentRecommendations: ParentRecommendation[];
  concernAreas: ConcernArea[];
  celebrations: Achievement[];
}

// 保護者向け推奨事項
export interface ParentRecommendation {
  id: string;
  category: 'study_environment' | 'schedule' | 'motivation' | 'subject_support' | 'health';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  expectedOutcome: string;
  timeframe: string;
  resources: {
    articles: string[];
    videos: string[];
    tools: string[];
  };
}

// 懸念事項
export interface ConcernArea {
  id: string;
  type: 'academic' | 'motivation' | 'time_management' | 'stress' | 'technical';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  indicators: string[];
  suggestedActions: string[];
  monitoringPlan: string;
  followUpDate: Date;
}

// 学習目標設定（保護者と子供の協働）
export interface FamilyLearningGoal {
  id: string;
  learnerId: string;
  title: string;
  description: string;
  category: 'academic' | 'habit' | 'motivation' | 'exam_prep';
  targetDate: Date;
  createdBy: 'parent' | 'child' | 'collaborative';
  
  milestones: {
    id: string;
    description: string;
    targetDate: Date;
    completed: boolean;
    completedAt?: Date;
    celebration?: string;
  }[];
  
  parentRole: string;
  childRole: string;
  checkInFrequency: 'daily' | 'weekly' | 'biweekly';
  
  progress: {
    currentPhase: number;
    overallCompletion: number; // 0-1
    lastUpdated: Date;
    notes: string;
  };
  
  rewards: {
    milestoneRewards: string[];
    finalReward: string;
    agreed: boolean;
    agreedAt?: Date;
  };
}

// 親子コミュニケーション記録
export interface FamilyInteraction {
  id: string;
  learnerId: string;
  type: 'study_session' | 'goal_setting' | 'problem_solving' | 'celebration' | 'check_in';
  date: Date;
  duration: number; // 分
  
  topics: string[];
  mood: {
    parent: 'positive' | 'neutral' | 'concerned';
    child: 'enthusiastic' | 'neutral' | 'resistant' | 'stressed';
  };
  
  outcomes: string[];
  actionItems: string[];
  nextMeeting: Date;
  
  notes: {
    parent: string;
    child?: string;
  };
}

// スケジュール管理
export interface FamilySchedule {
  id: string;
  learnerId: string;
  weekStart: Date;
  
  plannedStudySessions: {
    dayOfWeek: number; // 0-6
    timeSlot: string; // "HH:MM-HH:MM"
    subjects: string[];
    parentSupport: boolean;
    location: 'home' | 'library' | 'tutoring' | 'online';
  }[];
  
  familyActivities: {
    date: Date;
    activity: string;
    learningConnection?: string;
  }[];
  
  adjustments: {
    date: Date;
    reason: string;
    change: string;
    approvedBy: 'parent' | 'child' | 'both';
  }[];
}

// 保護者向け学習分析
export interface ParentAnalytics {
  learnerId: string;
  analysisDate: Date;
  
  // 学習効率分析
  efficiencyMetrics: {
    focusTimeRatio: number; // 実際の集中時間/総学習時間
    comprehensionRate: number; // 理解できた内容の割合
    retentionRate: number; // 覚えていた内容の割合
    applicationSuccess: number; // 応用問題の成功率
  };
  
  // 成長傾向
  growthTrends: {
    academicProgress: 'accelerating' | 'steady' | 'plateau' | 'declining';
    confidenceLevel: 'increasing' | 'stable' | 'decreasing';
    independenceLevel: 'increasing' | 'stable' | 'decreasing';
    motivationTrend: 'increasing' | 'stable' | 'decreasing';
  };
  
  // 比較データ（匿名化）
  peerComparison: {
    academicPerformance: 'above_average' | 'average' | 'below_average';
    studyHabits: 'excellent' | 'good' | 'needs_improvement';
    progressRate: 'faster' | 'similar' | 'slower';
    disclaimer: string;
  };
  
  // 将来予測
  projections: {
    examReadiness: {
      currentLevel: number; // 0-100
      projectedLevel: number;
      confidence: number; // 予測の信頼度
      keyFactors: string[];
    };
    
    recommendedIntensity: 'maintain' | 'increase' | 'reduce';
    criticalPeriods: Date[];
    suggestedFocus: string[];
  };
}

// 保護者向け設定
export interface ParentSettings {
  learnerId: string;
  
  // 監視設定
  monitoring: {
    screenTime: boolean;
    progressTracking: boolean;
    difficultyAdjustment: boolean;
    emotionalState: boolean;
  };
  
  // 制限設定
  limits: {
    dailyScreenTime: number; // 分
    sessionLength: number; // 分
    breakFrequency: number; // 分おき
    accessTimes: {
      start: string; // "HH:MM"
      end: string;
    };
    weekendDifference: boolean;
  };
  
  // 自動調整設定
  autoAdjustments: {
    difficultyLevel: boolean;
    studyPace: boolean;
    breakReminders: boolean;
    encouragementMessages: boolean;
  };
  
  // プライバシー設定
  privacy: {
    shareWithTutors: boolean;
    anonymousDataSharing: boolean;
    researchParticipation: boolean;
    dataRetentionPeriod: number; // 月
  };
}

// 保護者向けダッシュボード状態
export interface ParentDashboardState {
  selectedChild: string | null;
  timeRange: 'today' | 'week' | 'month' | 'custom';
  customRange?: {
    start: Date;
    end: Date;
  };
  viewMode: 'overview' | 'detailed' | 'compare';
  activeReport: LearningReport | null;
  pendingRecommendations: ParentRecommendation[];
  upcomingGoals: FamilyLearningGoal[];
  recentInteractions: FamilyInteraction[];
}