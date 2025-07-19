import { 
  LearnerProfile, 
  AdaptiveLearningPlan, 
  LearningGoal, 
  WeeklyLearningPlan,
  DailyLearningPlan,
  PlannedSession,
  SubjectStrategy,
  Milestone,
  AssessmentPlan,
  UserProgress,
  GradeLevel,
  SchoolLevel
} from '../types';
import { DETAILED_SUBJECTS } from '../data/detailedCurriculum';

class AdaptiveLearningPlannerService {
  
  // メイン学習計画生成
  public generateLearningPlan(profile: LearnerProfile, userProgress?: UserProgress): AdaptiveLearningPlan {
    const planId = `plan_${Date.now()}_${Math.random()}`;
    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30日後

    return {
      learnerId: profile.id,
      planId,
      generatedAt: now,
      validUntil,
      overallGoals: this.generateOverallGoals(profile, userProgress),
      weeklyPlan: this.generateWeeklyPlan(profile, userProgress),
      subjectStrategies: this.generateSubjectStrategies(profile, userProgress),
      progressTracking: {
        milestones: this.generateMilestones(profile, userProgress),
        assessmentSchedule: this.generateAssessmentSchedule(profile),
        adjustmentTriggers: this.generateAdjustmentTriggers(profile)
      }
    };
  }

  // 全体目標生成
  private generateOverallGoals(profile: LearnerProfile, userProgress?: UserProgress): {
    shortTerm: LearningGoal[];
    mediumTerm: LearningGoal[];
    longTerm: LearningGoal[];
  } {
    const shortTerm: LearningGoal[] = [];
    const mediumTerm: LearningGoal[] = [];
    const longTerm: LearningGoal[] = [];

    // 各教科の目標設定
    Object.entries(profile.subjectLevels).forEach(([subjectId, levels]) => {
      const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
      if (!subject) {
        console.warn(`Subject not found: ${subjectId}`);
        return;
      }

      // 短期目標（2週間）
      const currentLevel = userProgress?.subjectProgress[subjectId]?.masteryLevel || levels.currentLevel / 10;
      const nearTermTarget = Math.min(currentLevel + 0.1, levels.targetLevel / 10);
      
      shortTerm.push({
        id: `goal_short_${subjectId}_${Date.now()}`,
        description: `${subject.name}の理解度を${Math.round(nearTermTarget * 100)}%まで向上させる`,
        subjectId,
        targetLevel: nearTermTarget * 10,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        measurableOutcomes: [
          `基礎問題の正答率80%以上`,
          `学習セッション完了率90%以上`,
          `復習問題での定着率75%以上`
        ],
        priority: this.calculateGoalPriority(subjectId, profile),
        status: 'pending'
      });

      // 中期目標（2ヶ月）
      const mediumTermTarget = Math.min(currentLevel + 0.3, levels.targetLevel / 10);
      mediumTerm.push({
        id: `goal_medium_${subjectId}_${Date.now()}`,
        description: `${subject.name}で志望校レベルの基礎を固める`,
        subjectId,
        targetLevel: mediumTermTarget * 10,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        measurableOutcomes: [
          `応用問題の正答率70%以上`,
          `単元テストで80点以上`,
          `弱点分野の克服完了`
        ],
        priority: this.calculateGoalPriority(subjectId, profile),
        status: 'pending'
      });

      // 長期目標（受験まで）
      longTerm.push({
        id: `goal_long_${subjectId}_${Date.now()}`,
        description: `${subject.name}で志望校合格レベルに到達`,
        subjectId,
        targetLevel: levels.targetLevel,
        deadline: profile.examDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        measurableOutcomes: [
          `志望校過去問で合格点突破`,
          `発展問題への対応力獲得`,
          `時間内での確実な得点力`
        ],
        priority: this.calculateGoalPriority(subjectId, profile),
        status: 'pending'
      });
    });

    return { shortTerm, mediumTerm, longTerm };
  }

  // 週間学習計画生成
  private generateWeeklyPlan(profile: LearnerProfile, userProgress?: UserProgress): WeeklyLearningPlan {
    const weekStart = this.getStartOfWeek(new Date());
    const totalStudyHours = profile.availableStudyHours.weekday * 5 + profile.availableStudyHours.weekend * 2;
    
    const dailyPlans: { [day: string]: DailyLearningPlan } = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach((day, index) => {
      const date = new Date(weekStart.getTime() + index * 24 * 60 * 60 * 1000);
      const isWeekend = index >= 5;
      const dailyStudyTime = isWeekend ? profile.availableStudyHours.weekend : profile.availableStudyHours.weekday;
      
      dailyPlans[day] = this.generateDailyPlan(date, dailyStudyTime, profile, userProgress);
    });

    return {
      weekStart,
      totalStudyHours,
      dailyPlans
    };
  }

  // 日別学習計画生成
  private generateDailyPlan(date: Date, studyTime: number, profile: LearnerProfile, userProgress?: UserProgress): DailyLearningPlan {
    const sessions: PlannedSession[] = [];
    const subjects = Object.keys(profile.subjectLevels);
    
    // セッション時間の決定
    const sessionDuration = this.getSessionDuration(profile.learningPreferences.sessionLength);
    const numberOfSessions = Math.floor((studyTime * 60) / sessionDuration);
    const reviewTime = Math.min(20, studyTime * 60 * 0.2); // 20%を復習時間に
    const flexibleTime = (studyTime * 60) - (numberOfSessions * sessionDuration) - reviewTime;

    // 教科の優先度決定
    const subjectPriorities = this.calculateSubjectPriorities(profile, userProgress);
    
    // セッション生成
    for (let i = 0; i < numberOfSessions; i++) {
      const subjectId = this.selectSubjectForSession(subjectPriorities, sessions);
      const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
      
      if (subject) {
        const difficulty = this.calculateSessionDifficulty(subjectId, profile, userProgress);
        const topicId = this.selectOptimalTopic(subjectId, profile, userProgress);
        
        sessions.push({
          subjectId,
          topicId,
          duration: sessionDuration,
          difficultyLevel: difficulty,
          sessionType: this.determineSessionType(i, numberOfSessions, subjectId, userProgress),
          goals: this.generateSessionGoals(subjectId, topicId, profile),
          prerequisites: this.getTopicPrerequisites(topicId)
        });
      }
    }

    return {
      date,
      plannedStudyTime: studyTime,
      sessions,
      flexibleTime,
      reviewTime
    };
  }

  // 教科別戦略生成
  private generateSubjectStrategies(profile: LearnerProfile, userProgress?: UserProgress): { [subjectId: string]: SubjectStrategy } {
    const strategies: { [subjectId: string]: SubjectStrategy } = {};

    Object.entries(profile.subjectLevels).forEach(([subjectId, levels]) => {
      const currentProgress = userProgress?.subjectProgress[subjectId];
      const weaknesses = levels.weaknesses || [];
      const strengths = levels.strengths || [];

      strategies[subjectId] = {
        subjectId,
        currentFocus: this.determineCurrentFocus(subjectId, levels, currentProgress),
        priorityTopics: this.determinePriorityTopics(subjectId, profile, currentProgress),
        difficultyProgression: {
          currentLevel: currentProgress?.masteryLevel ? Math.round(currentProgress.masteryLevel * 10) : levels.currentLevel,
          targetLevel: levels.targetLevel,
          progressionRate: this.determineProgressionRate(profile, levels),
          adaptationFrequency: this.calculateAdaptationFrequency(profile)
        },
        practiceRatio: this.calculatePracticeRatio(subjectId, profile, currentProgress),
        reviewFrequency: this.determineReviewFrequency(subjectId, profile, currentProgress),
        specialTechniques: this.suggestSpecialTechniques(subjectId, profile, weaknesses)
      };
    });

    return strategies;
  }

  // マイルストーン生成
  private generateMilestones(profile: LearnerProfile, userProgress?: UserProgress): Milestone[] {
    const milestones: Milestone[] = [];
    const now = new Date();

    // 月次マイルストーン
    for (let month = 1; month <= 6; month++) {
      const targetDate = new Date(now.getTime() + month * 30 * 24 * 60 * 60 * 1000);
      
      milestones.push({
        id: `milestone_month_${month}`,
        description: `${month}ヶ月目の学習目標達成`,
        targetDate,
        criteria: [
          `全教科の理解度20%向上`,
          `学習継続率80%以上`,
          `弱点分野の改善確認`
        ],
        reward: month % 2 === 0 ? '特別な学習コンテンツ解放' : '学習進捗レポート',
        status: 'upcoming'
      });
    }

    // 志望校別マイルストーン
    profile.targetSchools.forEach((school, index) => {
      const examDate = school.examDate;
      const preparationStart = new Date(examDate.getTime() - 90 * 24 * 60 * 60 * 1000); // 3ヶ月前

      if (preparationStart > now) {
        milestones.push({
          id: `milestone_school_${school.id}`,
          description: `${school.name}対策開始`,
          targetDate: preparationStart,
          criteria: [
            `基礎レベル完全定着`,
            `過去問演習開始準備完了`,
            `受験戦略確立`
          ],
          status: 'upcoming'
        });
      }
    });

    return milestones.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
  }

  // アセスメント計画生成
  private generateAssessmentSchedule(profile: LearnerProfile): AssessmentPlan[] {
    const assessments: AssessmentPlan[] = [];
    const now = new Date();

    // 初回診断テスト
    assessments.push({
      id: `assessment_diagnostic_initial`,
      type: 'diagnostic',
      scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1週間後
      duration: 120,
      topics: Object.keys(profile.subjectLevels),
      purposes: ['現在の学力レベル詳細測定', '個別弱点特定', '学習計画微調整']
    });

    // 月次進捗テスト
    for (let month = 1; month <= 6; month++) {
      const testDate = new Date(now.getTime() + month * 30 * 24 * 60 * 60 * 1000);
      
      assessments.push({
        id: `assessment_progress_month_${month}`,
        type: 'progress',
        scheduledDate: testDate,
        duration: 90,
        topics: Object.keys(profile.subjectLevels),
        purposes: ['学習進捗確認', '理解度測定', '次月計画調整']
      });
    }

    // 模擬試験
    if (profile.examDate) {
      const examDate = profile.examDate;
      const mockExamDates = [
        new Date(examDate.getTime() - 120 * 24 * 60 * 60 * 1000), // 4ヶ月前
        new Date(examDate.getTime() - 60 * 24 * 60 * 60 * 1000),  // 2ヶ月前
        new Date(examDate.getTime() - 30 * 24 * 60 * 60 * 1000),  // 1ヶ月前
      ].filter(date => date > now);

      mockExamDates.forEach((date, index) => {
        assessments.push({
          id: `assessment_mock_${index + 1}`,
          type: 'mock_exam',
          scheduledDate: date,
          duration: 180,
          topics: Object.keys(profile.subjectLevels),
          purposes: ['実戦形式での実力測定', '時間配分練習', '本番対策']
        });
      });
    }

    return assessments.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  // 調整トリガー生成
  private generateAdjustmentTriggers(profile: LearnerProfile) {
    return [
      {
        condition: 'low_performance' as const,
        threshold: 0.6,
        action: 'decrease_difficulty' as const,
        description: '理解度が60%を下回った場合、難易度を下げて基礎固めを重視'
      },
      {
        condition: 'high_performance' as const,
        threshold: 0.9,
        action: 'increase_difficulty' as const,
        description: '理解度が90%を上回った場合、より高度な内容に挑戦'
      },
      {
        condition: 'motivation_drop' as const,
        threshold: 0.4,
        action: 'add_support' as const,
        description: 'モチベーション低下時は学習方法を変更し、励ましを強化'
      },
      {
        condition: 'time_shortage' as const,
        threshold: 0.7,
        action: 'modify_schedule' as const,
        description: '予定学習時間の70%未満の場合、スケジュールを現実的に調整'
      }
    ];
  }

  // ヘルパーメソッド
  private calculateGoalPriority(subjectId: string, profile: LearnerProfile): 'high' | 'medium' | 'low' {
    const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
    if (!subject) {
      console.warn(`Subject not found for priority calculation: ${subjectId}`);
      return 'medium';
    }

    const examWeight = subject.examWeight?.[profile.schoolLevel] || 0.5;
    const subjectLevel = profile.subjectLevels[subjectId];
    const levelGap = subjectLevel ? (subjectLevel.targetLevel - subjectLevel.currentLevel) : 0;

    if (examWeight > 0.8 || levelGap > 4) return 'high';
    if (examWeight > 0.6 || levelGap > 2) return 'medium';
    return 'low';
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
  }

  private getSessionDuration(sessionLength: string): number {
    switch (sessionLength) {
      case 'short': return 25; // 25分
      case 'medium': return 45; // 45分
      case 'long': return 65; // 65分
      default: return 45;
    }
  }

  private calculateSubjectPriorities(profile: LearnerProfile, userProgress?: UserProgress): { [subjectId: string]: number } {
    const priorities: { [subjectId: string]: number } = {};

    Object.entries(profile.subjectLevels).forEach(([subjectId, levels]) => {
      const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
      if (!subject) {
        console.warn(`Subject not found for priority calculation: ${subjectId}`);
        return;
      }

      let priority = 0.5; // base priority

      // 志望校での重要度
      priority += (subject.examWeight?.[profile.schoolLevel] || 0.5) * 0.3;

      // レベルギャップ
      const levelGap = levels.targetLevel - levels.currentLevel;
      priority += (levelGap / 10) * 0.2;

      // 最近の学習頻度（低いほど優先度上げる）
      const recentProgress = userProgress?.subjectProgress[subjectId];
      if (recentProgress?.lastStudied) {
        const daysSinceStudy = (Date.now() - recentProgress.lastStudied.getTime()) / (24 * 60 * 60 * 1000);
        priority += Math.min(daysSinceStudy / 7, 0.3); // 1週間で最大0.3ポイント
      }

      priorities[subjectId] = Math.min(priority, 1);
    });

    return priorities;
  }

  private selectSubjectForSession(priorities: { [subjectId: string]: number }, existingSessions: PlannedSession[]): string {
    // 既存セッションでの教科バランスを考慮
    const sessionCounts: { [subjectId: string]: number } = {};
    existingSessions.forEach(session => {
      sessionCounts[session.subjectId] = (sessionCounts[session.subjectId] || 0) + 1;
    });

    // 優先度を調整（既に多くセッションがある教科の優先度を下げる）
    const adjustedPriorities = { ...priorities };
    Object.keys(sessionCounts).forEach(subjectId => {
      const penalty = sessionCounts[subjectId] * 0.1;
      adjustedPriorities[subjectId] = Math.max(adjustedPriorities[subjectId] - penalty, 0.1);
    });

    // 最も優先度の高い教科を選択
    return Object.keys(adjustedPriorities).reduce((a, b) => 
      adjustedPriorities[a] > adjustedPriorities[b] ? a : b
    );
  }

  private calculateSessionDifficulty(subjectId: string, profile: LearnerProfile, userProgress?: UserProgress): number {
    const subjectLevel = profile.subjectLevels[subjectId];
    if (!subjectLevel) return 5;

    const currentLevel = userProgress?.subjectProgress[subjectId]?.masteryLevel 
      ? Math.round(userProgress.subjectProgress[subjectId].masteryLevel * 10)
      : subjectLevel.currentLevel;

    // 難易度設定の調整
    switch (profile.learningPreferences.preferredDifficulty) {
      case 'gradual':
        return Math.max(1, currentLevel - 1);
      case 'challenging':
        return Math.min(10, currentLevel + 2);
      case 'mixed':
      default:
        return Math.max(1, Math.min(10, currentLevel + Math.floor(Math.random() * 3 - 1)));
    }
  }

  private selectOptimalTopic(subjectId: string, profile: LearnerProfile, userProgress?: UserProgress): string {
    const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
    if (!subject || !subject.topics || subject.topics.length === 0) {
      console.warn(`Subject or topics not found: ${subjectId}`);
      return 'basic';
    }

    const completedTopics = userProgress?.subjectProgress[subjectId]?.completedTopics || [];
    const availableTopics = subject.topics.filter(topic => 
      !completedTopics.includes(topic.id) &&
      topic.gradeLevel?.includes(profile.currentGrade)
    );

    if (availableTopics.length === 0) {
      // 復習トピック選択
      return subject.topics[Math.floor(Math.random() * subject.topics.length)].id;
    }

    // 志望校レベルに応じたトピック選択
    const levelAppropriate = availableTopics.filter(topic => {
      const examFreq = topic.examFrequency?.[profile.schoolLevel] || 0;
      return examFreq > 0.3; // 出題頻度30%以上
    });

    const selectedTopics = levelAppropriate.length > 0 ? levelAppropriate : availableTopics;
    return selectedTopics[Math.floor(Math.random() * selectedTopics.length)].id;
  }

  private determineSessionType(sessionIndex: number, totalSessions: number, subjectId: string, userProgress?: UserProgress): 'learning' | 'practice' | 'review' | 'assessment' {
    // 最初と最後のセッションは学習/復習を優先
    if (sessionIndex === 0) return 'learning';
    if (sessionIndex === totalSessions - 1) return 'review';

    // 進捗に応じて調整
    const subjectProgress = userProgress?.subjectProgress[subjectId];
    if (subjectProgress?.masteryLevel && subjectProgress.masteryLevel > 0.7) {
      return Math.random() > 0.5 ? 'practice' : 'review';
    }

    return Math.random() > 0.6 ? 'learning' : 'practice';
  }

  private generateSessionGoals(subjectId: string, topicId: string, profile: LearnerProfile): string[] {
    const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    
    if (!topic) return ['基礎的な理解を深める'];

    const goals = [
      `${topic.name}の基本概念を理解する`,
      `関連する問題を正確に解けるようになる`
    ];

    // 志望校レベルに応じた目標追加
    if (profile.schoolLevel === 'advanced' || profile.schoolLevel === 'elite') {
      goals.push('応用問題への対応力を身につける');
    }

    return goals;
  }

  private getTopicPrerequisites(topicId: string): string[] {
    // 実際の実装では、データベースや設定ファイルから取得
    const commonPrerequisites: { [key: string]: string[] } = {
      'advanced_calculation': ['basic_calculation', 'multiplication_tables'],
      'fractions': ['division', 'basic_calculation'],
      'geometry': ['basic_shapes', 'measurement']
    };

    return commonPrerequisites[topicId] || [];
  }

  // その他のヘルパーメソッド（実装省略のためstub）
  private determineCurrentFocus(subjectId: string, levels: any, currentProgress: any): string[] {
    return ['基礎固め', '理解深化'];
  }

  private determinePriorityTopics(subjectId: string, profile: LearnerProfile, currentProgress: any): string[] {
    return ['重要単元1', '基礎単元2'];
  }

  private determineProgressionRate(profile: LearnerProfile, levels: any): 'slow' | 'normal' | 'fast' {
    return profile.learningPreferences.preferredDifficulty === 'gradual' ? 'slow' : 'normal';
  }

  private calculateAdaptationFrequency(profile: LearnerProfile): number {
    return profile.learningPreferences.sessionLength === 'short' ? 3 : 5;
  }

  private calculatePracticeRatio(subjectId: string, profile: LearnerProfile, currentProgress: any): number {
    return 0.6; // 60%練習, 40%学習
  }

  private determineReviewFrequency(subjectId: string, profile: LearnerProfile, currentProgress: any): 'daily' | 'every_other_day' | 'weekly' {
    return 'every_other_day';
  }

  private suggestSpecialTechniques(subjectId: string, profile: LearnerProfile, weaknesses: string[]): string[] {
    const techniques: string[] = [];
    
    if (profile.learningPreferences.learningStyle === 'visual') {
      techniques.push('図解重視学習', 'マインドマップ活用');
    }
    
    if (weaknesses.length > 2) {
      techniques.push('反復練習強化', 'ステップ細分化');
    }

    return techniques;
  }
}

export const adaptiveLearningPlanner = new AdaptiveLearningPlannerService();