// ゲーミフィケーション機能の型定義
// クエスト、レベルアップ、フレンド機能などの学習モチベーション向上機能

// プレイヤーレベルシステム
export interface PlayerLevel {
  currentLevel: number;
  currentXP: number;
  requiredXPForNext: number;
  totalXP: number;
  levelBenefits: LevelBenefit[];
}

export interface LevelBenefit {
  id: string;
  type: 'feature_unlock' | 'cosmetic' | 'power_up' | 'title';
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// クエストシステム
export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special' | 'story';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  
  objectives: QuestObjective[];
  rewards: QuestReward[];
  
  requirements: {
    minLevel?: number;
    prerequisiteQuests?: string[];
    timeLimit?: Date;
    subjects?: string[];
  };
  
  progress: {
    started: boolean;
    startedAt?: Date;
    completed: boolean;
    completedAt?: Date;
    currentObjectiveIndex: number;
  };
  
  metadata: {
    estimatedTime: number; // 分
    xpReward: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    tags: string[];
  };
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'study_time' | 'problems_solved' | 'streak' | 'accuracy' | 'topic_completion' | 'custom';
  target: number;
  current: number;
  completed: boolean;
  
  // 目標の詳細設定
  criteria?: {
    subjects?: string[];
    topics?: string[];
    difficulty?: number;
    timeframe?: 'session' | 'day' | 'week';
    minAccuracy?: number;
  };
}

export interface QuestReward {
  type: 'xp' | 'coins' | 'item' | 'title' | 'avatar' | 'powerup';
  amount?: number;
  itemId?: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// アバター・カスタマイゼーション
export interface Avatar {
  id: string;
  name: string;
  currentOutfit: AvatarOutfit;
  unlockedItems: AvatarItem[];
  coins: number;
}

export interface AvatarOutfit {
  head?: string;
  body?: string;
  accessory?: string;
  background?: string;
  pet?: string;
}

export interface AvatarItem {
  id: string;
  name: string;
  category: 'head' | 'body' | 'accessory' | 'background' | 'pet';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  cost: number;
  unlockCondition?: {
    type: 'level' | 'quest' | 'achievement' | 'purchase';
    requirement: string | number;
  };
  imageUrl: string;
  description: string;
}

// フレンド・ソーシャル機能
export interface Friend {
  id: string;
  name: string;
  avatar: Pick<Avatar, 'name' | 'currentOutfit'>;
  level: number;
  status: 'online' | 'studying' | 'offline';
  lastActive: Date;
  
  stats: {
    totalStudyTime: number;
    currentStreak: number;
    favoriteSubject: string;
    recentAchievements: string[];
  };
  
  friendship: {
    addedAt: Date;
    relationshipLevel: 'acquaintance' | 'friend' | 'best_friend' | 'study_buddy';
    sharedActivities: number;
    mutualEncouragement: number;
  };
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: Date;
  respondedAt?: Date;
}

// チャレンジ・競争機能
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'speed' | 'accuracy' | 'endurance' | 'knowledge' | 'collaborative';
  
  participants: ChallengeParticipant[];
  rules: ChallengeRules;
  rewards: ChallengeReward[];
  
  schedule: {
    startTime: Date;
    endTime: Date;
    duration: number; // 分
    timezone: string;
  };
  
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  
  leaderboard: LeaderboardEntry[];
  
  metadata: {
    maxParticipants: number;
    minLevel: number;
    subjects: string[];
    difficulty: number;
  };
}

export interface ChallengeParticipant {
  userId: string;
  userName: string;
  avatar: Pick<Avatar, 'name' | 'currentOutfit'>;
  level: number;
  registeredAt: Date;
  score?: number;
  rank?: number;
  status: 'registered' | 'active' | 'completed' | 'forfeited';
}

export interface ChallengeRules {
  scoringMethod: 'points' | 'accuracy' | 'speed' | 'combined';
  timeLimit: number;
  allowedRetries: number;
  powerUpsAllowed: boolean;
  collaborationAllowed: boolean;
  subjects: string[];
  topics?: string[];
  difficultyRange: [number, number];
}

export interface ChallengeReward {
  rank: 'winner' | 'top3' | 'top10' | 'participant';
  xp: number;
  coins: number;
  items: string[];
  titles: string[];
  badges: string[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  completionTime?: number;
  accuracy?: number;
  badge?: string;
}

// バッジ・タイトルシステム
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'academic' | 'social' | 'special' | 'seasonal';
  
  unlockCondition: {
    type: 'achievement' | 'quest' | 'challenge' | 'time_based' | 'social';
    criteria: any; // 具体的な条件
    secret: boolean; // 隠しバッジかどうか
  };
  
  benefits?: {
    xpBonus?: number;
    coinBonus?: number;
    specialAbilities?: string[];
  };
  
  earnedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

export interface Title {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  color: string;
  prefix?: string; // "Master of"
  suffix?: string; // "the Great"
  
  unlockCondition: {
    type: 'level' | 'achievement' | 'quest' | 'social' | 'seasonal';
    requirement: any;
  };
  
  isActive: boolean;
  earnedAt?: Date;
}

// パワーアップ・アイテム
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  type: 'learning_boost' | 'time_extension' | 'hint_reveal' | 'mistake_forgive' | 'xp_multiplier';
  
  effect: {
    duration: number; // 分、0の場合は即座効果
    magnitude: number; // 効果の強さ（倍率など）
    scope: 'session' | 'topic' | 'subject' | 'global';
  };
  
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  cost: number; // コイン
  
  usageRules: {
    maxPerSession: number;
    maxPerDay: number;
    cooldown: number; // 分
    levelRequirement: number;
  };
  
  visualEffects: {
    icon: string;
    animation: string;
    soundEffect?: string;
  };
}

// 学習ストリーク・習慣
export interface LearningStreak {
  current: number;
  longest: number;
  weeklyGoal: number;
  monthlyGoal: number;
  
  history: StreakRecord[];
  milestones: StreakMilestone[];
  
  motivationMessages: {
    encouragement: string[];
    warnings: string[];
    celebrations: string[];
  };
}

export interface StreakRecord {
  date: string; // YYYY-MM-DD
  completed: boolean;
  studyTime: number;
  subjects: string[];
  qualityScore: number; // 0-1
}

export interface StreakMilestone {
  days: number;
  name: string;
  description: string;
  rewards: QuestReward[];
  achieved: boolean;
  achievedAt?: Date;
}

// 学習グループ・チーム
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  
  members: StudyGroupMember[];
  settings: {
    isPublic: boolean;
    maxMembers: number;
    subjectFocus: string[];
    levelRange: [number, number];
    studySchedule: {
      timezone: string;
      regularSessions: GroupStudySession[];
    };
  };
  
  activities: {
    groupChallenges: string[];
    sharedGoals: string[];
    studySessions: string[];
    achievements: string[];
  };
  
  stats: {
    totalStudyTime: number;
    averageLevel: number;
    groupStreak: number;
    completedChallenges: number;
  };
  
  createdAt: Date;
  createdBy: string;
}

export interface StudyGroupMember {
  userId: string;
  userName: string;
  avatar: Pick<Avatar, 'name' | 'currentOutfit'>;
  level: number;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  
  contribution: {
    studyTime: number;
    helpedOthers: number;
    sharedKnowledge: number;
    participationScore: number; // 0-1
  };
  
  status: 'active' | 'inactive' | 'on_break';
}

export interface GroupStudySession {
  id: string;
  title: string;
  subject: string;
  topics: string[];
  scheduledTime: Date;
  duration: number;
  participants: string[];
  
  type: 'collaborative_learning' | 'quiz_battle' | 'peer_teaching' | 'group_challenge';
  
  results?: {
    attendance: string[];
    avgScore: number;
    insights: string[];
    nextSession?: Date;
  };
}

// ゲーミフィケーション統計
export interface GamificationStats {
  userId: string;
  
  levels: PlayerLevel;
  quests: {
    completed: number;
    active: string[];
    available: string[];
  };
  
  social: {
    friends: number;
    groupsJoined: number;
    challengesWon: number;
    helpedOthers: number;
  };
  
  collection: {
    badges: Badge[];
    titles: Title[];
    avatarItems: AvatarItem[];
    powerUps: { [itemId: string]: number }; // アイテムID: 所有数
  };
  
  streaks: LearningStreak;
  
  economy: {
    totalXPEarned: number;
    totalCoinsEarned: number;
    totalCoinsSpent: number;
    currentCoins: number;
  };
  
  preferences: {
    showLeaderboards: boolean;
    allowFriendRequests: boolean;
    shareProgress: boolean;
    notificationSettings: {
      questCompleted: boolean;
      levelUp: boolean;
      friendActivity: boolean;
      challengeInvites: boolean;
    };
  };
}