// デモ用データ生成ユーティリティ
// 保護者ダッシュボードのテスト用にサンプルデータを提供

import { LearnerProfile, UserProgress, Achievement } from '../types';
import { LearningReport, FamilyLearningGoal, ParentAnalytics } from '../types/parentDashboard';

export class DemoDataGenerator {
  // デモ用学習者プロフィールを生成
  static generateLearnerProfile(): LearnerProfile {
    return {
      id: 'demo_learner_001',
      name: '田中太郎',
      currentGrade: '5th',
      targetGrade: '6th',
      targetSchools: [
        {
          id: 'school_001',
          name: '桜が丘中学校',
          level: 'advanced',
          location: '東京都',
          examDate: new Date('2025-02-01'),
          requiredSubjects: ['math', 'japanese', 'science', 'social'],
          examStyle: {
            hasInterview: true,
            hasEssay: false,
            hasGroupDiscussion: false,
            specialRequirements: []
          },
          pastExamTrends: {
            frequentTopics: {
              math: ['図形問題', '比と割合', '速度算'],
              japanese: ['文学的文章', '説明文', '漢字・語句']
            },
            difficultyTrend: 'stable',
            uniqueFeatures: ['思考力問題', '複合問題']
          },
          priority: 'first_choice'
        }
      ],
      schoolLevel: 'advanced',
      studyStartDate: new Date('2024-04-01'),
      examDate: new Date('2025-02-01'),
      availableStudyHours: {
        weekday: 2.5,
        weekend: 5
      },
      subjectLevels: {
        math: {
          currentLevel: 6,
          targetLevel: 8,
          strengths: ['計算問題', '基本図形'],
          weaknesses: ['文章題', '複合図形']
        },
        japanese: {
          currentLevel: 5,
          targetLevel: 7,
          strengths: ['漢字', '語句'],
          weaknesses: ['読解問題', '記述問題']
        },
        science: {
          currentLevel: 6,
          targetLevel: 8,
          strengths: ['物理・化学', '実験問題'],
          weaknesses: ['生物', '地学']
        },
        social: {
          currentLevel: 5,
          targetLevel: 7,
          strengths: ['歴史', '地理'],
          weaknesses: ['公民', '時事問題']
        }
      },
      learningPreferences: {
        preferredDifficulty: 'gradual',
        learningStyle: 'visual',
        sessionLength: 'medium',
        motivationType: 'progress'
      },
      schedule: {
        schoolSchedule: {
          monday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          tuesday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          wednesday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          thursday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          friday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          saturday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          sunday: { schoolHours: [], extracurriculars: [], availableForStudy: [] }
        },
        studyTimeSlots: [],
        busyPeriods: []
      },
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date()
    };
  }

  // デモ用ユーザー進捗を生成
  static generateUserProgress(): UserProgress {
    return {
      userId: 'demo_learner_001',
      learnerProfile: this.generateLearnerProfile(),
      
      subjectProgress: {
        math: {
          completedTopics: ['basic_arithmetic', 'fractions', 'decimals'],
          currentTopic: 'ratios_proportions',
          masteryLevel: 0.75,
          timeSpent: 1800, // 30時間（分単位）
          lastStudied: new Date(),
          streakDays: 12,
          achievements: []
        },
        japanese: {
          completedTopics: ['hiragana_katakana', 'basic_kanji'],
          currentTopic: 'reading_comprehension',
          masteryLevel: 0.65,
          timeSpent: 1440, // 24時間
          lastStudied: new Date(),
          streakDays: 10,
          achievements: []
        },
        science: {
          completedTopics: ['basic_physics', 'chemistry_basics'],
          currentTopic: 'biology_intro',
          masteryLevel: 0.70,
          timeSpent: 1200, // 20時間
          lastStudied: new Date(),
          streakDays: 8,
          achievements: []
        },
        social: {
          completedTopics: ['japan_history_ancient'],
          currentTopic: 'japan_history_medieval',
          masteryLevel: 0.60,
          timeSpent: 900, // 15時間
          lastStudied: new Date(),
          streakDays: 6,
          achievements: []
        }
      },
      
      overallStats: {
        totalStudyTime: 5340, // 89時間
        totalSessions: 67,
        averageSessionLength: 80,
        consistencyScore: 0.85,
        motivationLevel: 0.78,
        lastActiveDate: new Date()
      },
      
      adaptiveMetrics: {
        learningVelocity: 1.2,
        retentionRate: 0.82,
        difficultyPreference: 6,
        optimalSessionLength: 75,
        bestStudyTimes: ['09:00', '15:00', '19:00']
      },
      
      // Dashboard互換性のための追加フィールド
      learningStats: {
        currentStreak: 12,
        totalSessions: 67,
        totalStudyTime: 5340,
        overallCorrectRate: 0.78,
        dailyStudyTime: this.generateDailyStudyTime()
      },
      
      subjectProgresses: [
        {
          subjectId: 'math',
          overallMasteryScore: 75,
          totalSessions: 20,
          totalStudyTime: 1800,
          lastStudiedAt: new Date().toISOString()
        },
        {
          subjectId: 'japanese',
          overallMasteryScore: 65,
          totalSessions: 18,
          totalStudyTime: 1440,
          lastStudiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          subjectId: 'science',
          overallMasteryScore: 70,
          totalSessions: 15,
          totalStudyTime: 1200,
          lastStudiedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        },
        {
          subjectId: 'social',
          overallMasteryScore: 60,
          totalSessions: 14,
          totalStudyTime: 900,
          lastStudiedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        }
      ],
      
      achievements: this.generateAchievements(),
      
      preferences: {
        studyTimeGoal: 120 // 2時間/日
      }
    };
  }

  // 日別学習時間データを生成
  static generateDailyStudyTime() {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const studyTime = Math.floor(Math.random() * 180 + 60); // 60-240分
      data.push({
        date: date.toISOString().split('T')[0],
        studyTime
      });
    }
    return data;
  }

  // 実績データを生成
  static generateAchievements(): Achievement[] {
    return [
      {
        id: 'achieve_001',
        name: '連続学習10日達成',
        description: '10日間連続で学習セッションを完了しました',
        type: 'streak',
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        value: 10,
        rarity: 'common'
      },
      {
        id: 'achieve_002',
        name: '算数マスター',
        description: '算数の基礎単元を全て習得しました',
        type: 'mastery',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        value: 100,
        rarity: 'uncommon'
      },
      {
        id: 'achieve_003',
        name: 'スピードソルバー',
        description: '制限時間内で問題を正確に解きました',
        type: 'speed',
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        value: 95,
        rarity: 'rare'
      }
    ];
  }

  // デモ学習レポートを生成
  static generateLearningReport(): LearningReport {
    return {
      id: 'report_demo_001',
      learnerId: 'demo_learner_001',
      reportType: 'week',
      periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      generatedAt: new Date(),
      
      summary: {
        totalStudyTime: 840, // 14時間（分単位）
        sessionsCompleted: 12,
        averageSessionLength: 70,
        topicsCompleted: 3,
        overallProgress: 0.78,
        motivationLevel: 0.82
      },
      
      subjectBreakdown: {
        math: {
          timeSpent: 300,
          progress: 0.80,
          strengths: ['基本計算', '図形の基礎'],
          improvements: ['文章題の理解', '複雑な計算'],
          nextGoals: ['比と割合の習得', '速度算の理解']
        },
        japanese: {
          timeSpent: 240,
          progress: 0.70,
          strengths: ['漢字の読み書き', '語彙力'],
          improvements: ['読解スピード', '記述の論理性'],
          nextGoals: ['長文読解の向上', '作文技術の習得']
        },
        science: {
          timeSpent: 180,
          progress: 0.75,
          strengths: ['実験の理解', '基本概念'],
          improvements: ['計算問題', '応用問題'],
          nextGoals: ['化学分野の強化', '生物分野の学習']
        },
        social: {
          timeSpent: 120,
          progress: 0.65,
          strengths: ['歴史の流れ', '地理の基礎'],
          improvements: ['年代の暗記', '地図の読み取り'],
          nextGoals: ['公民分野の導入', '時事問題への対応']
        }
      },
      
      learningInsights: {
        bestStudyTimes: ['09:00-10:30', '15:30-17:00'],
        preferredLearningStyle: 'visual',
        attentionSpanTrend: 'improving',
        difficultyComfortZone: 6,
        collaborationNeeds: ['難問解説', 'モチベーション維持']
      },
      
      parentRecommendations: [
        {
          id: 'rec_001',
          category: 'study_environment',
          priority: 'high',
          title: '学習環境の整備',
          description: '集中力向上のため、学習スペースの見直しをお勧めします',
          actionItems: [
            '机周りの整理整頓',
            '適切な照明の確保',
            '雑音の軽減',
            '必要な参考書の準備'
          ],
          expectedOutcome: '集中力の20%向上と学習効率の改善',
          timeframe: '1-2週間',
          resources: {
            articles: ['効果的な学習環境づくり'],
            videos: ['集中力を高める部屋作り'],
            tools: ['学習環境チェックリスト']
          }
        },
        {
          id: 'rec_002',
          category: 'motivation',
          priority: 'medium',
          title: '適切な褒め方の実践',
          description: 'お子様のやる気を維持するための声かけを工夫しましょう',
          actionItems: [
            '過程を重視した褒め方',
            '具体的な成長ポイントの指摘',
            '小さな成功の積み重ね',
            '適切なタイミングでの声かけ'
          ],
          expectedOutcome: '学習意欲の継続的な維持',
          timeframe: '継続的',
          resources: {
            articles: ['子どものやる気を引き出す褒め方'],
            videos: ['効果的なコミュニケーション術'],
            tools: ['褒め方実践ガイド']
          }
        }
      ],
      
      concernAreas: [
        {
          id: 'concern_001',
          type: 'academic',
          severity: 'medium',
          title: '国語の読解スピード',
          description: '文章を読む速度が他教科と比較して遅い傾向があります',
          indicators: [
            '長文問題の未完了',
            '読解時間の延長',
            '内容理解の遅れ'
          ],
          suggestedActions: [
            '毎日の音読練習',
            '短文から段階的に延ばす',
            '要約練習の実施'
          ],
          monitoringPlan: '週1回の読解スピードチェック',
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ],
      
      celebrations: this.generateAchievements()
    };
  }

  // ファミリー学習目標のデモデータ
  static generateFamilyGoals(): FamilyLearningGoal[] {
    return [
      {
        id: 'goal_001',
        learnerId: 'demo_learner_001',
        title: '算数の図形問題マスター',
        description: '図形問題を得意分野にして、応用問題も解けるようになる',
        category: 'academic',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: 'collaborative',
        
        milestones: [
          {
            id: 'milestone_001',
            description: '基本図形の面積・周囲計算の習得',
            targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            completed: true,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'milestone_002',
            description: '複合図形の問題に挑戦',
            targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            completed: false
          },
          {
            id: 'milestone_003',
            description: '過去問の図形問題で80%以上の正解率',
            targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            completed: false
          }
        ],
        
        parentRole: '復習のサポートと励まし、問題集の準備',
        childRole: '毎日30分の図形問題練習、疑問点の積極的な質問',
        checkInFrequency: 'weekly',
        
        progress: {
          currentPhase: 1,
          overallCompletion: 0.33,
          lastUpdated: new Date(),
          notes: '基本図形は順調に理解できています。次は複合図形に挑戦します。'
        },
        
        rewards: {
          milestoneRewards: ['好きなお菓子', '図書カード500円', '特別なお出かけ'],
          finalReward: '図形定規セットと数学パズルゲーム',
          agreed: true,
          agreedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    ];
  }

  // すべてのデモデータを初期化
  static initializeDemoData(): void {
    // 学習者プロフィール
    const profile = this.generateLearnerProfile();
    localStorage.setItem('ai-learning-learnerProfile', JSON.stringify(profile));
    localStorage.setItem(`learnerProfile_${profile.id}`, JSON.stringify(profile));
    
    // ユーザー進捗
    const progress = this.generateUserProgress();
    localStorage.setItem('ai-learning-userProgress', JSON.stringify(progress));
    localStorage.setItem(`userProgress_${profile.id}`, JSON.stringify(progress));
    
    // 学習レポート
    const reports = [this.generateLearningReport()];
    localStorage.setItem('learningReports', JSON.stringify(reports));
    
    // ファミリー目標
    const goals = this.generateFamilyGoals();
    localStorage.setItem('familyGoals', JSON.stringify(goals));
    
    console.log('🎯 デモデータが初期化されました');
  }

  // デモデータをクリア
  static clearDemoData(): void {
    const keys = [
      'ai-learning-learnerProfile',
      'ai-learning-userProgress',
      'learningReports',
      'familyGoals',
      'familyInteractions'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ デモデータがクリアされました');
  }
}

// 開発環境でのみデモデータを自動初期化
if (import.meta.env.DEV) {
  // アプリケーション起動時にデモデータがない場合は初期化
  if (!localStorage.getItem('ai-learning-learnerProfile')) {
    DemoDataGenerator.initializeDemoData();
  }
}