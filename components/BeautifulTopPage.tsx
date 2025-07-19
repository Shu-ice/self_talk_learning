import React, { useState, useEffect } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  HoverScaleCard,
  AnimatedProgress,
  ParticleBackground,
  FloatingActionButton
} from './ui/MicroInteractions';
import HierarchicalSubjectNavigator from './HierarchicalSubjectNavigator';
import type { LearningUnit } from './HierarchicalSubjectNavigator';

/**
 * 🏠 Beautiful Top Page
 * 美しく整理されたトップページ
 * 教科選択→詳細階層への自然な流れ
 */

interface BeautifulTopPageProps {
  userId: string;
  userName?: string;
}

interface QuickStats {
  totalStudyTime: number;
  completedLessons: number;
  currentStreak: number;
  nextMilestone: string;
}

interface RecentActivity {
  activityId: string;
  type: 'lesson_completed' | 'test_passed' | 'milestone_reached';
  subject: string;
  title: string;
  timestamp: Date;
  score?: number;
}

const BeautifulTopPage: React.FC<BeautifulTopPageProps> = ({
  userId,
  userName = 'あなた'
}) => {
  const [showNavigator, setShowNavigator] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalStudyTime: 450, // minutes
    completedLessons: 23,
    currentStreak: 5,
    nextMilestone: '100問達成'
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      activityId: '1',
      type: 'lesson_completed',
      subject: '算数',
      title: '速さの基本',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
      score: 95
    },
    {
      activityId: '2',
      type: 'test_passed',
      subject: '国語',
      title: '物語文読解テスト',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1日前
      score: 88
    },
    {
      activityId: '3',
      type: 'milestone_reached',
      subject: '理科',
      title: '物理分野10問達成',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2日前
    }
  ]);

  const subjects = [
    {
      id: 'math',
      name: '算数',
      icon: '🔢',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: '数の世界を探検しよう',
      progress: 65,
      nextLesson: '流水算の基本',
      totalLessons: 120,
      completedLessons: 78
    },
    {
      id: 'japanese',
      name: '国語',
      icon: '📝',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: '言葉の力を身につけよう',
      progress: 58,
      nextLesson: '登場人物の心情',
      totalLessons: 95,
      completedLessons: 55
    },
    {
      id: 'science',
      name: '理科',
      icon: '🔬',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: '自然の不思議を発見しよう',
      progress: 42,
      nextLesson: '力の合成',
      totalLessons: 80,
      completedLessons: 34
    },
    {
      id: 'social',
      name: '社会',
      icon: '🌍',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: '世界と歴史を学ぼう',
      progress: 51,
      nextLesson: '縄文時代の特徴',
      totalLessons: 75,
      completedLessons: 38
    }
  ];

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setShowNavigator(true);
  };

  const handleUnitSelect = (unit: LearningUnit) => {
    console.log('学習単元選択:', unit);
    // 実際の学習画面に遷移
    // router.push(`/learning/${unit.unitId}`);
    alert(`「${unit.unitName}」の学習を開始します！`);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed': return '✅';
      case 'test_passed': return '🎯';
      case 'milestone_reached': return '🏆';
      default: return '📚';
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays}日前`;
    } else if (diffHours > 0) {
      return `${diffHours}時間前`;
    } else {
      return '今';
    }
  };

  if (showNavigator) {
    return (
      <div className="navigator-container">
        <div className="navigator-header">
          <KidsButton
            onClick={() => setShowNavigator(false)}
            className="back-to-home-btn"
          >
            ← ホームに戻る
          </KidsButton>
        </div>
        <HierarchicalSubjectNavigator
          userId={userId}
          onUnitSelect={handleUnitSelect}
        />
      </div>
    );
  }

  return (
    <div className="beautiful-top-page">
      <ParticleBackground />
      
      {/* ヘッダー */}
      <header className="top-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">
              おかえりなさい、{userName}さん！
            </h1>
            <p className="welcome-subtitle">
              今日も一緒に学習を頑張りましょう ✨
            </p>
          </div>
          <div className="header-actions">
            <FloatingActionButton
              onClick={() => alert('設定画面')}
              className="settings-btn"
            >
              ⚙️
            </FloatingActionButton>
          </div>
        </div>
      </header>

      {/* 学習統計 */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{quickStats.completedLessons}</div>
              <div className="stat-label">完了した授業</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(quickStats.totalStudyTime)}</div>
              <div className="stat-label">総学習時間</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{quickStats.currentStreak}日</div>
              <div className="stat-label">連続学習</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{quickStats.nextMilestone}</div>
              <div className="stat-label">次の目標</div>
            </div>
          </div>
        </div>
      </section>

      {/* 教科選択 */}
      <section className="subjects-section">
        <div className="section-header">
          <h2>📖 学習する教科を選んでください</h2>
          <p>どの教科から始めますか？</p>
        </div>
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <HoverScaleCard
              key={subject.id}
              className="subject-card"
              onClick={() => handleSubjectClick(subject.id)}
            >
              <div className="subject-background" style={{ background: subject.color }}>
                <div className="subject-icon">{subject.icon}</div>
              </div>
              <div className="subject-content">
                <h3 className="subject-name">{subject.name}</h3>
                <p className="subject-description">{subject.description}</p>
                
                <div className="subject-progress">
                  <div className="progress-header">
                    <span className="progress-label">学習進捗</span>
                    <span className="progress-percentage">{subject.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${subject.progress}%`,
                        background: subject.color 
                      }}
                    />
                  </div>
                </div>
                
                <div className="subject-stats">
                  <div className="stat-row">
                    <span className="stat-label">完了:</span>
                    <span className="stat-value">{subject.completedLessons}/{subject.totalLessons}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">次回:</span>
                    <span className="stat-value">{subject.nextLesson}</span>
                  </div>
                </div>
              </div>
            </HoverScaleCard>
          ))}
        </div>
      </section>

      {/* 最近の活動 */}
      <section className="recent-section">
        <div className="section-header">
          <h2>📈 最近の学習活動</h2>
          <p>頑張っている成果を見てみましょう</p>
        </div>
        <div className="activities-container">
          {recentActivities.map((activity) => (
            <div key={activity.activityId} className="activity-card">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-subject">{activity.subject}</span>
                  <span className="activity-time">{getTimeAgo(activity.timestamp)}</span>
                </div>
                <div className="activity-title">{activity.title}</div>
                {activity.score && (
                  <div className="activity-score">{activity.score}点</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 今日の目標 */}
      <section className="goals-section">
        <div className="goal-card">
          <div className="goal-header">
            <h3>🎯 今日の目標</h3>
            <div className="goal-progress">2/3 完了</div>
          </div>
          <div className="goal-list">
            <div className="goal-item completed">
              <div className="goal-check">✅</div>
              <div className="goal-text">算数の問題を5問解く</div>
            </div>
            <div className="goal-item completed">
              <div className="goal-check">✅</div>
              <div className="goal-text">国語の文章を1つ読む</div>
            </div>
            <div className="goal-item">
              <div className="goal-check">⭕</div>
              <div className="goal-text">理科の実験動画を見る</div>
            </div>
          </div>
        </div>
      </section>

      {/* クイックアクション */}
      <section className="quick-actions">
        <div className="action-grid">
          <KidsButton
            onClick={() => setShowNavigator(true)}
            className="action-btn primary"
          >
            📚 学習を始める
          </KidsButton>
          <KidsButton
            onClick={() => alert('テスト画面')}
            className="action-btn secondary"
          >
            📝 テストを受ける
          </KidsButton>
          <KidsButton
            onClick={() => alert('復習画面')}
            className="action-btn secondary"
          >
            🔄 復習する
          </KidsButton>
          <KidsButton
            onClick={() => alert('進捗確認')}
            className="action-btn secondary"
          >
            📊 進捗を確認
          </KidsButton>
        </div>
      </section>

      <style jsx>{`
        .beautiful-top-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          position: relative;
        }

        .navigator-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .navigator-header {
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .back-to-home-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-to-home-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-2px);
        }

        /* ヘッダー */
        .top-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .welcome-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .settings-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        /* 統計セクション */
        .stats-section {
          margin-bottom: 2rem;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* 教科セクション */
        .subjects-section {
          margin-bottom: 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          color: white;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .section-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin: 0;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .subject-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .subject-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .subject-background {
          height: 120px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subject-icon {
          font-size: 3rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .subject-content {
          padding: 1.5rem;
        }

        .subject-name {
          color: #1f2937;
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .subject-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }

        .subject-progress {
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .progress-label {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .progress-percentage {
          color: #1f2937;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .progress-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .subject-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-row .stat-label {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .stat-row .stat-value {
          color: #1f2937;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* 最近の活動 */
        .recent-section {
          margin-bottom: 2rem;
        }

        .activities-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .activity-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .activity-icon {
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .activity-subject {
          color: #3b82f6;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .activity-time {
          color: #6b7280;
          font-size: 0.8rem;
        }

        .activity-title {
          color: #1f2937;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .activity-score {
          color: #10b981;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* 今日の目標 */
        .goals-section {
          margin-bottom: 2rem;
        }

        .goal-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .goal-header h3 {
          color: #1f2937;
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
        }

        .goal-progress {
          color: #10b981;
          font-size: 1rem;
          font-weight: 600;
        }

        .goal-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .goal-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          background: #f9fafb;
          transition: all 0.3s ease;
        }

        .goal-item.completed {
          background: #ecfdf5;
          border: 1px solid #d1fae5;
        }

        .goal-check {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .goal-text {
          color: #1f2937;
          font-size: 1rem;
          font-weight: 500;
        }

        .goal-item.completed .goal-text {
          color: #10b981;
        }

        /* クイックアクション */
        .quick-actions {
          margin-bottom: 2rem;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          padding: 1rem 1.5rem;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.95);
          color: #1f2937;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        /* レスポンシブ */
        @media (max-width: 768px) {
          .beautiful-top-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .welcome-title {
            font-size: 1.5rem;
          }

          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .subjects-grid {
            grid-template-columns: 1fr;
          }

          .action-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .top-header {
            padding: 1.5rem;
          }

          .welcome-title {
            font-size: 1.3rem;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .subject-background {
            height: 100px;
          }

          .subject-icon {
            font-size: 2.5rem;
          }

          .goal-card {
            padding: 1.5rem;
          }

          .goal-header {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BeautifulTopPage;