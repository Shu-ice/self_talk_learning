import { LearnerProfile, UserProgress, AdaptiveLearningPlan } from '../types';
import { adaptiveLearningPlanner } from './adaptiveLearningPlanner';

class ProfileService {
  private readonly STORAGE_KEY = 'learner_profile';
  private readonly PROGRESS_KEY = 'user_progress';

  // プロフィール保存
  public saveProfile(profile: LearnerProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
      console.log('プロフィールを保存しました:', profile.id);
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
    }
  }

  // プロフィール読み込み
  public loadProfile(): LearnerProfile | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const profile = JSON.parse(stored);
      
      // 日付フィールドの復元
      profile.studyStartDate = new Date(profile.studyStartDate);
      profile.createdAt = new Date(profile.createdAt);
      profile.updatedAt = new Date(profile.updatedAt);
      
      if (profile.examDate) {
        profile.examDate = new Date(profile.examDate);
      }

      // 志望校の日付復元
      if (profile.targetSchools) {
        profile.targetSchools.forEach((school: any) => {
          school.examDate = new Date(school.examDate);
        });
      }

      return profile;
    } catch (error) {
      console.error('プロフィール読み込みエラー:', error);
      return null;
    }
  }

  // プロフィール更新
  public updateProfile(updates: Partial<LearnerProfile>): LearnerProfile | null {
    const currentProfile = this.loadProfile();
    if (!currentProfile) return null;

    const updatedProfile: LearnerProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date()
    };

    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  // プロフィール削除
  public deleteProfile(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
  }

  // 進捗データ保存
  public saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('進捗保存エラー:', error);
    }
  }

  // 進捗データ読み込み
  public loadProgress(): UserProgress | null {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      if (!stored) return null;

      const progress = JSON.parse(stored);
      
      // 日付フィールドの復元
      Object.values(progress.subjectProgress).forEach((subjectProg: any) => {
        if (subjectProg.lastStudied) {
          subjectProg.lastStudied = new Date(subjectProg.lastStudied);
        }
        if (subjectProg.achievements) {
          subjectProg.achievements.forEach((achievement: any) => {
            achievement.earnedAt = new Date(achievement.earnedAt);
          });
        }
      });

      progress.overallStats.lastActiveDate = new Date(progress.overallStats.lastActiveDate);

      return progress;
    } catch (error) {
      console.error('進捗読み込みエラー:', error);
      return null;
    }
  }

  // 初期進捗データ作成
  public createInitialProgress(profile: LearnerProfile): UserProgress {
    console.log('Creating initial progress for profile:', profile.id);
    const now = new Date();
    
    try {
      const initialProgress: UserProgress = {
        userId: profile.id,
        learnerProfile: profile,
        currentPlan: adaptiveLearningPlanner.generateLearningPlan(profile),
      subjectProgress: {},
      overallStats: {
        totalStudyTime: 0,
        totalSessions: 0,
        averageSessionLength: 0,
        consistencyScore: 1.0,
        motivationLevel: 0.8,
        lastActiveDate: now
      },
      adaptiveMetrics: {
        learningVelocity: 0.5,
        retentionRate: 0.8,
        difficultyPreference: profile.subjectLevels.math?.currentLevel || 5,
        optimalSessionLength: this.getSessionDurationMinutes(profile.learningPreferences.sessionLength),
        bestStudyTimes: this.generateOptimalStudyTimes(profile)
      }
    };

    // 各教科の初期進捗
    Object.entries(profile.subjectLevels).forEach(([subjectId, levels]) => {
      initialProgress.subjectProgress[subjectId] = {
        completedTopics: [],
        currentTopic: null,
        masteryLevel: levels.currentLevel / 10,
        timeSpent: 0,
        lastStudied: now,
        streakDays: 0,
        achievements: []
      };
    });

      this.saveProgress(initialProgress);
      console.log('Initial progress created successfully');
      return initialProgress;
    } catch (error) {
      console.error('Error creating initial progress:', error);
      // フォールバック: 最小限の進捗データを作成
      const fallbackProgress: UserProgress = {
        userId: profile.id,
        learnerProfile: profile,
        currentPlan: null,
        subjectProgress: {},
        overallStats: {
          totalStudyTime: 0,
          totalSessions: 0,
          averageSessionLength: 0,
          completionRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: now,
          difficultyPreference: 5,
          optimalSessionLength: 45,
          bestStudyTimes: []
        }
      };

      // 各教科の基本進捗データ
      Object.keys(profile.subjectLevels).forEach(subjectId => {
        fallbackProgress.subjectProgress[subjectId] = {
          completedTopics: [],
          currentTopic: null,
          masteryLevel: 0.5,
          timeSpent: 0,
          lastStudied: now,
          streakDays: 0,
          achievements: []
        };
      });

      this.saveProgress(fallbackProgress);
      return fallbackProgress;
    }
  }

  // プロフィール検証
  public validateProfile(profile: LearnerProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name || profile.name.trim().length === 0) {
      errors.push('名前は必須です');
    }

    if (!profile.currentGrade) {
      errors.push('現在の学年を選択してください');
    }

    if (!profile.targetGrade) {
      errors.push('受験学年を選択してください');
    }

    if (profile.availableStudyHours.weekday <= 0) {
      errors.push('平日の学習時間は0より大きい値を設定してください');
    }

    if (profile.availableStudyHours.weekend <= 0) {
      errors.push('休日の学習時間は0より大きい値を設定してください');
    }

    // 志望校の検証
    if (profile.targetSchools.length === 0) {
      errors.push('少なくとも1つの志望校を設定してください');
    }

    // 教科別レベルの検証
    Object.entries(profile.subjectLevels).forEach(([subjectId, levels]) => {
      if (levels.targetLevel <= levels.currentLevel) {
        errors.push(`${subjectId}の目標レベルは現在レベルより高く設定してください`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 学習計画の再生成
  public regenerateLearningPlan(profile: LearnerProfile, progress?: UserProgress): AdaptiveLearningPlan {
    const newPlan = adaptiveLearningPlanner.generateLearningPlan(profile, progress);
    
    if (progress) {
      progress.currentPlan = newPlan;
      this.saveProgress(progress);
    }

    return newPlan;
  }

  // 志望校レベルに基づく推奨設定
  public getRecommendedSettings(schoolLevel: string): {
    studyHours: { weekday: number; weekend: number };
    sessionLength: string;
    difficulty: string;
  } {
    switch (schoolLevel) {
      case 'elite':
        return {
          studyHours: { weekday: 3, weekend: 6 },
          sessionLength: 'long',
          difficulty: 'challenging'
        };
      case 'advanced':
        return {
          studyHours: { weekday: 2.5, weekend: 5 },
          sessionLength: 'medium',
          difficulty: 'mixed'
        };
      case 'standard':
        return {
          studyHours: { weekday: 2, weekend: 4 },
          sessionLength: 'medium',
          difficulty: 'gradual'
        };
      case 'basic':
      default:
        return {
          studyHours: { weekday: 1.5, weekend: 3 },
          sessionLength: 'short',
          difficulty: 'gradual'
        };
    }
  }

  // 学習進捗の更新
  public updateLearningProgress(
    subjectId: string,
    sessionData: {
      timeSpent: number;
      comprehensionLevel: number;
      topicId: string;
      completed: boolean;
    }
  ): UserProgress | null {
    const progress = this.loadProgress();
    if (!progress) return null;

    const subjectProgress = progress.subjectProgress[subjectId];
    if (!subjectProgress) return null;

    // セッションデータの更新
    subjectProgress.timeSpent += sessionData.timeSpent;
    subjectProgress.lastStudied = new Date();
    
    // 理解度の更新（移動平均）
    const currentMastery = subjectProgress.masteryLevel;
    subjectProgress.masteryLevel = (currentMastery * 0.8) + (sessionData.comprehensionLevel * 0.2);

    // トピック完了の処理
    if (sessionData.completed && !subjectProgress.completedTopics.includes(sessionData.topicId)) {
      subjectProgress.completedTopics.push(sessionData.topicId);
    }

    // 連続学習日数の更新
    this.updateStreakDays(subjectProgress);

    // 全体統計の更新
    progress.overallStats.totalStudyTime += sessionData.timeSpent;
    progress.overallStats.totalSessions += 1;
    progress.overallStats.averageSessionLength = 
      progress.overallStats.totalStudyTime / progress.overallStats.totalSessions;
    progress.overallStats.lastActiveDate = new Date();

    // アダプティブメトリクスの更新
    this.updateAdaptiveMetrics(progress, sessionData);

    this.saveProgress(progress);
    return progress;
  }

  // アチーブメントの確認・付与
  public checkAndAwardAchievements(progress: UserProgress): string[] {
    const newAchievements: string[] = [];

    Object.entries(progress.subjectProgress).forEach(([subjectId, subjectProg]) => {
      // 連続学習アチーブメント
      if (subjectProg.streakDays >= 7 && !this.hasAchievement(subjectProg.achievements, 'week_streak')) {
        subjectProg.achievements.push({
          id: 'week_streak',
          name: '継続は力なり',
          description: '7日連続で学習を続けました',
          type: 'streak',
          earnedAt: new Date(),
          value: subjectProg.streakDays,
          rarity: 'common'
        });
        newAchievements.push(`${subjectId}: 継続は力なり`);
      }

      // マスタリーアチーブメント
      if (subjectProg.masteryLevel >= 0.8 && !this.hasAchievement(subjectProg.achievements, 'mastery_80')) {
        subjectProg.achievements.push({
          id: 'mastery_80',
          name: '理解のエキスパート',
          description: '理解度80%に到達しました',
          type: 'mastery',
          earnedAt: new Date(),
          value: Math.round(subjectProg.masteryLevel * 100),
          rarity: 'uncommon'
        });
        newAchievements.push(`${subjectId}: 理解のエキスパート`);
      }
    });

    if (newAchievements.length > 0) {
      this.saveProgress(progress);
    }

    return newAchievements;
  }

  // ヘルパーメソッド
  private getSessionDurationMinutes(sessionLength: string): number {
    switch (sessionLength) {
      case 'short': return 25;
      case 'medium': return 45;
      case 'long': return 65;
      default: return 45;
    }
  }

  private generateOptimalStudyTimes(profile: LearnerProfile): string[] {
    // 基本的な推奨時間帯
    const baseTimeslots = ['16:00', '17:00', '19:00', '20:00'];
    
    // 学年に応じた調整
    if (profile.currentGrade === '6th') {
      // 受験生はより集中できる時間帯を追加
      baseTimeslots.push('21:00');
    }

    return baseTimeslots;
  }

  private updateStreakDays(subjectProgress: any): void {
    const today = new Date();
    const lastStudied = new Date(subjectProgress.lastStudied);
    
    const daysDiff = Math.floor((today.getTime() - lastStudied.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysDiff === 0) {
      // 今日も学習した
      // 連続日数はそのまま
    } else if (daysDiff === 1) {
      // 昨日に続いて今日も学習
      subjectProgress.streakDays += 1;
    } else {
      // 間隔が空いたのでリセット
      subjectProgress.streakDays = 1;
    }
  }

  private updateAdaptiveMetrics(progress: UserProgress, sessionData: any): void {
    const metrics = progress.adaptiveMetrics;
    
    // 学習速度の更新
    const sessionHours = sessionData.timeSpent / 60;
    const topicsPerHour = sessionData.completed ? 1 / sessionHours : 0;
    metrics.learningVelocity = (metrics.learningVelocity * 0.9) + (topicsPerHour * 0.1);

    // 定着率の更新
    if (sessionData.comprehensionLevel > 0.7) {
      metrics.retentionRate = Math.min(1, metrics.retentionRate + 0.01);
    } else if (sessionData.comprehensionLevel < 0.5) {
      metrics.retentionRate = Math.max(0, metrics.retentionRate - 0.01);
    }

    // 最適セッション長の調整
    if (sessionData.comprehensionLevel > 0.8) {
      metrics.optimalSessionLength = Math.min(90, metrics.optimalSessionLength + 1);
    } else if (sessionData.comprehensionLevel < 0.6) {
      metrics.optimalSessionLength = Math.max(15, metrics.optimalSessionLength - 1);
    }
  }

  private hasAchievement(achievements: any[], achievementId: string): boolean {
    return achievements.some(achievement => achievement.id === achievementId);
  }
}

export const profileService = new ProfileService();