import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';

interface SmartSchedulingDashboardProps {
  userId: string;
  className?: string;
}

interface ScheduleData {
  todaySchedule: StudySession[];
  weeklyPlan: WeeklyPlan;
  personalizedReminders: SmartReminder[];
  optimalTimes: OptimalTimeSlot[];
  schedulingInsights: SchedulingInsight[];
  adaptiveAdjustments: AdaptiveAdjustment[];
}

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  duration: number;
  difficulty: number;
  type: 'learning' | 'review' | 'practice' | 'assessment';
  status: 'upcoming' | 'active' | 'completed' | 'skipped';
  adaptiveScore: number;
  personalizedTips: string[];
  energyRequirement: number;
  focusLevel: number;
}

interface WeeklyPlan {
  totalStudyTime: number;
  subjectDistribution: { [subject: string]: number };
  dailyGoals: DailyGoal[];
  flexibilityBuffer: number;
  weeklyChallenge: WeeklyChallenge;
}

interface DailyGoal {
  date: string;
  studyTime: number;
  sessions: number;
  focusAreas: string[];
  energyProfile: EnergyLevel[];
  achieved: boolean;
}

interface EnergyLevel {
  hour: string;
  level: number;
  optimal: boolean;
}

interface SmartReminder {
  id: string;
  type: 'study_start' | 'break_time' | 'review_due' | 'motivation_boost';
  time: string;
  message: string;
  personalizedContent: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  customEmoji: string;
}

interface OptimalTimeSlot {
  startTime: string;
  endTime: string;
  score: number;
  reason: string;
  subjectRecommendation: string;
  cognitiveLoad: number;
}

interface SchedulingInsight {
  type: 'pattern' | 'optimization' | 'warning' | 'achievement';
  title: string;
  description: string;
  actionItems: string[];
  impact: 'low' | 'medium' | 'high';
  confidence: number;
}

interface AdaptiveAdjustment {
  sessionId: string;
  originalTime: string;
  adjustedTime: string;
  reason: string;
  confidence: number;
  userApproved: boolean;
}

const SmartSchedulingDashboard: React.FC<SmartSchedulingDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [selectedView, setSelectedView] = useState<'today' | 'week' | 'insights' | 'settings'>('today');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeReminders, setActiveReminders] = useState<SmartReminder[]>([]);

  // リアルタイム時刻更新
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // スケジュールデータ読み込み
  useEffect(() => {
    loadScheduleData();
  }, [userId]);

  const loadScheduleData = async () => {
    setIsLoading(true);
    try {
      // 実際の実装では SmartScheduler から取得
      const mockData = await generateMockScheduleData(userId);
      setScheduleData(mockData);
      
      // アクティブリマインダーの設定
      const activeReminders = mockData.personalizedReminders.filter(
        reminder => isReminderActive(reminder, currentTime)
      );
      setActiveReminders(activeReminders);
    } catch (error) {
      console.error('スケジュールデータの読み込みに失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 今日のスケジュール表示
  const renderTodaySchedule = () => {
    if (!scheduleData) return null;

    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

    return (
      <div className="space-y-6">
        {/* 現在時刻とリアルタイム状態 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">📅 今日の学習スケジュール</h2>
              <p className="text-lg opacity-90">現在時刻: {currentTimeStr}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{scheduleData.todaySchedule.length}</div>
              <div className="text-sm opacity-90">セッション予定</div>
            </div>
          </div>
          
          {/* 今日の進捗 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>今日の進捗</span>
              <span>{getTodayProgress()}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${getTodayProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* アクティブリマインダー */}
        {activeReminders.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🔔</span>
              <h3 className="font-semibold text-yellow-800">スマートリマインダー</h3>
            </div>
            <div className="space-y-2">
              {activeReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{reminder.customEmoji}</span>
                    <div>
                      <p className="font-medium text-gray-800">{reminder.message}</p>
                      <p className="text-sm text-gray-600">{reminder.personalizedContent}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      開始
                    </button>
                    <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">
                      スヌーズ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* セッション一覧 */}
        <KidsCard title="📚 今日の学習セッション" icon="⏰" color="green">
          <div className="space-y-4">
            {scheduleData.todaySchedule.map((session, index) => (
              <div
                key={session.id}
                className={`border rounded-lg p-4 transition-all ${
                  session.status === 'active' ? 'border-green-500 bg-green-50 shadow-lg' :
                  session.status === 'completed' ? 'border-gray-300 bg-gray-50' :
                  session.status === 'upcoming' ? 'border-blue-300 bg-blue-50' :
                  'border-red-300 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">
                        {getSubjectEmoji(session.subject)}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{session.topic}</h4>
                        <p className="text-sm text-gray-600">
                          {session.startTime} - {session.endTime} ({session.duration}分)
                        </p>
                      </div>
                    </div>

                    {/* セッション詳細 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">難易度:</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < session.difficulty ? 'bg-orange-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">集中度:</span>
                        <div className="font-medium text-purple-600">{session.focusLevel}/10</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">タイプ:</span>
                        <div className={`inline-block px-2 py-1 rounded text-xs ${
                          session.type === 'learning' ? 'bg-blue-100 text-blue-800' :
                          session.type === 'review' ? 'bg-green-100 text-green-800' :
                          session.type === 'practice' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {getTypeLabel(session.type)}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">最適度:</span>
                        <div className="font-medium text-green-600">{session.adaptiveScore}%</div>
                      </div>
                    </div>

                    {/* パーソナライズドティップス */}
                    {session.personalizedTips.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">💡 学習のコツ</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {session.personalizedTips.map((tip, tipIndex) => (
                            <li key={tipIndex}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {session.status === 'upcoming' && (
                      <>
                        <KidsButton
                          variant="primary"
                          size="small"
                          onClick={() => startSession(session.id)}
                          disabled={!isSessionStartable(session, currentTimeStr)}
                        >
                          開始
                        </KidsButton>
                        <KidsButton
                          variant="secondary"
                          size="small"
                          onClick={() => rescheduleSession(session.id)}
                        >
                          変更
                        </KidsButton>
                      </>
                    )}
                    
                    {session.status === 'active' && (
                      <>
                        <KidsButton
                          variant="success"
                          size="small"
                          onClick={() => completeSession(session.id)}
                        >
                          完了
                        </KidsButton>
                        <KidsButton
                          variant="warning"
                          size="small"
                          onClick={() => pauseSession(session.id)}
                        >
                          休憩
                        </KidsButton>
                      </>
                    )}
                    
                    {session.status === 'completed' && (
                      <div className="text-green-600 text-sm font-medium">✅ 完了</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </KidsCard>

        {/* 最適学習時間 */}
        <KidsCard title="⚡ 今日の最適学習時間" icon="🎯" color="purple">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleData.optimalTimes.slice(0, 6).map((timeSlot, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  timeSlot.score > 80 ? 'border-green-500 bg-green-50' :
                  timeSlot.score > 60 ? 'border-yellow-500 bg-yellow-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-800">
                    {timeSlot.startTime} - {timeSlot.endTime}
                  </div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    timeSlot.score > 80 ? 'bg-green-100 text-green-800' :
                    timeSlot.score > 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {timeSlot.score}%
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{timeSlot.reason}</p>
                
                <div className="text-xs text-gray-500">
                  推奨: {timeSlot.subjectRecommendation}
                </div>
                
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">認知負荷: {timeSlot.cognitiveLoad}/10</div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        timeSlot.cognitiveLoad <= 3 ? 'bg-green-500' :
                        timeSlot.cognitiveLoad <= 6 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(timeSlot.cognitiveLoad / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </KidsCard>
      </div>
    );
  };

  // 週間プラン表示
  const renderWeeklyPlan = () => {
    if (!scheduleData) return null;

    return (
      <div className="space-y-6">
        <KidsCard title="📅 週間学習プラン" icon="📊" color="blue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 週間サマリー */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">週間目標</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>総学習時間</span>
                    <span>{getCurrentWeeklyProgress()} / {scheduleData.weeklyPlan.totalStudyTime}分</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (getCurrentWeeklyProgress() / scheduleData.weeklyPlan.totalStudyTime) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">教科別配分</h4>
                  <div className="space-y-2">
                    {Object.entries(scheduleData.weeklyPlan.subjectDistribution).map(([subject, minutes]) => (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{subject}</span>
                        <span className="text-sm font-medium">{minutes}分</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 週間チャレンジ */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🏆 今週のチャレンジ</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">{scheduleData.weeklyPlan.weeklyChallenge.title}</h4>
                  <p className="text-sm opacity-90">{scheduleData.weeklyPlan.weeklyChallenge.description}</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>進捗</span>
                    <span>{scheduleData.weeklyPlan.weeklyChallenge.progress}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${scheduleData.weeklyPlan.weeklyChallenge.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm opacity-90">
                  報酬: {scheduleData.weeklyPlan.weeklyChallenge.reward}
                </div>
              </div>
            </div>
          </div>

          {/* 日別目標 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">日別学習目標</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {scheduleData.weeklyPlan.dailyGoals.map((day, index) => (
                <div
                  key={day.date}
                  className={`border rounded-lg p-3 text-center ${
                    day.achieved ? 'border-green-500 bg-green-50' :
                    isToday(day.date) ? 'border-blue-500 bg-blue-50' :
                    'border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800 mb-2">
                    {formatDayName(day.date)}
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">
                    {day.studyTime}分 / {day.sessions}セッション
                  </div>
                  
                  <div className="space-y-1">
                    {day.focusAreas.slice(0, 2).map((area, areaIndex) => (
                      <div key={areaIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {area}
                      </div>
                    ))}
                  </div>

                  {day.achieved && (
                    <div className="mt-2 text-green-600">✅</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </KidsCard>
      </div>
    );
  };

  // スケジューリングインサイト表示
  const renderInsights = () => {
    if (!scheduleData) return null;

    return (
      <div className="space-y-6">
        <KidsCard title="🧠 スケジューリング・インサイト" icon="💡" color="yellow">
          <div className="space-y-4">
            {scheduleData.schedulingInsights.map((insight, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-4 ${
                  insight.type === 'achievement' ? 'border-green-500 bg-green-50' :
                  insight.type === 'optimization' ? 'border-blue-500 bg-blue-50' :
                  insight.type === 'warning' ? 'border-red-500 bg-red-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {insight.type === 'achievement' ? '🏆' :
                         insight.type === 'optimization' ? '🚀' :
                         insight.type === 'warning' ? '⚠️' : '💡'}
                      </span>
                      <h4 className={`font-semibold ${
                        insight.type === 'achievement' ? 'text-green-800' :
                        insight.type === 'optimization' ? 'text-blue-800' :
                        insight.type === 'warning' ? 'text-red-800' :
                        'text-yellow-800'
                      }`}>
                        {insight.title}
                      </h4>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      insight.type === 'achievement' ? 'text-green-700' :
                      insight.type === 'optimization' ? 'text-blue-700' :
                      insight.type === 'warning' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {insight.description}
                    </p>

                    {insight.actionItems.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-800 mb-1">推奨アクション:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {insight.actionItems.map((action, actionIndex) => (
                            <li key={actionIndex}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      insight.impact === 'high' ? 'text-red-600' :
                      insight.impact === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {insight.impact === 'high' ? '高' :
                       insight.impact === 'medium' ? '中' : '低'}影響
                    </div>
                    <div className="text-xs text-gray-500">
                      確信度: {insight.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </KidsCard>

        {/* 適応調整 */}
        {scheduleData.adaptiveAdjustments.length > 0 && (
          <KidsCard title="🔄 スマート調整提案" icon="⚙️" color="purple">
            <div className="space-y-3">
              {scheduleData.adaptiveAdjustments.map((adjustment, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        セッション時間調整提案
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {adjustment.originalTime} → {adjustment.adjustedTime}
                      </p>
                      <p className="text-sm text-blue-700">{adjustment.reason}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">
                        確信度: {adjustment.confidence}%
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveAdjustment(adjustment.sessionId)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          承認
                        </button>
                        <button
                          onClick={() => rejectAdjustment(adjustment.sessionId)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                          却下
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KidsCard>
        )}
      </div>
    );
  };

  // ヘルパー関数
  const getTodayProgress = (): number => {
    if (!scheduleData) return 0;
    const completed = scheduleData.todaySchedule.filter(s => s.status === 'completed').length;
    return Math.round((completed / scheduleData.todaySchedule.length) * 100);
  };

  const getCurrentWeeklyProgress = (): number => {
    // モックデータ
    return 180; // 分
  };

  const isReminderActive = (reminder: SmartReminder, currentTime: Date): boolean => {
    // リマインダーがアクティブかチェック
    return Math.random() > 0.7; // デモ用
  };

  const getSubjectEmoji = (subject: string): string => {
    const emojiMap: { [key: string]: string } = {
      '算数': '🧮',
      '国語': '📖',
      '理科': '🔬',
      '社会': '🌏'
    };
    return emojiMap[subject] || '📚';
  };

  const getTypeLabel = (type: string): string => {
    const labelMap: { [key: string]: string } = {
      'learning': '新規学習',
      'review': '復習',
      'practice': '練習',
      'assessment': '確認テスト'
    };
    return labelMap[type] || type;
  };

  const isSessionStartable = (session: StudySession, currentTime: string): boolean => {
    // セッション開始可能かチェック
    return currentTime >= session.startTime && currentTime <= session.endTime;
  };

  const isToday = (dateStr: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const formatDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getDate()}日(${days[date.getDay()]})`;
  };

  // アクション関数
  const startSession = (sessionId: string) => {
    console.log('セッション開始:', sessionId);
    // 実装: セッション開始処理
  };

  const completeSession = (sessionId: string) => {
    console.log('セッション完了:', sessionId);
    // 実装: セッション完了処理
  };

  const rescheduleSession = (sessionId: string) => {
    console.log('セッション変更:', sessionId);
    // 実装: セッション変更ダイアログ表示
  };

  const pauseSession = (sessionId: string) => {
    console.log('セッション休憩:', sessionId);
    // 実装: セッション休憩処理
  };

  const approveAdjustment = (sessionId: string) => {
    console.log('調整承認:', sessionId);
    // 実装: 調整承認処理
  };

  const rejectAdjustment = (sessionId: string) => {
    console.log('調整却下:', sessionId);
    // 実装: 調整却下処理
  };

  // モックデータ生成
  const generateMockScheduleData = async (userId: string): Promise<ScheduleData> => {
    return {
      todaySchedule: [
        {
          id: 'session1',
          subject: '算数',
          topic: '分数の計算',
          startTime: '09:00',
          endTime: '09:30',
          duration: 30,
          difficulty: 6,
          type: 'learning',
          status: 'upcoming',
          adaptiveScore: 85,
          personalizedTips: ['朝の時間帯は集中力が高いです', '視覚的な教材を活用しましょう'],
          energyRequirement: 7,
          focusLevel: 8
        },
        {
          id: 'session2',
          subject: '国語',
          topic: '漢字の読み書き',
          startTime: '15:00',
          endTime: '15:25',
          duration: 25,
          difficulty: 4,
          type: 'review',
          status: 'upcoming',
          adaptiveScore: 92,
          personalizedTips: ['復習は短時間で効果的です', '反復練習が重要です'],
          energyRequirement: 5,
          focusLevel: 6
        }
      ],
      weeklyPlan: {
        totalStudyTime: 300,
        subjectDistribution: {
          '算数': 120,
          '国語': 90,
          '理科': 60,
          '社会': 30
        },
        dailyGoals: [],
        flexibilityBuffer: 20,
        weeklyChallenge: {
          title: '毎日学習チャレンジ',
          description: '7日間連続で学習目標を達成しよう',
          progress: 57,
          reward: '特別バッジ + 100XP'
        }
      },
      personalizedReminders: [
        {
          id: 'reminder1',
          type: 'study_start',
          time: '08:45',
          message: '算数の学習時間です！',
          personalizedContent: '今日は分数の計算を頑張りましょう。昨日より上手にできるはずです！',
          priority: 'high',
          actionable: true,
          customEmoji: '🧮'
        }
      ],
      optimalTimes: [
        {
          startTime: '09:00',
          endTime: '10:00',
          score: 95,
          reason: '朝の集中力ピーク時間です',
          subjectRecommendation: '算数（新規学習）',
          cognitiveLoad: 3
        },
        {
          startTime: '15:00',
          endTime: '16:00',
          score: 88,
          reason: '午後の安定した集中時間です',
          subjectRecommendation: '国語（復習）',
          cognitiveLoad: 4
        }
      ],
      schedulingInsights: [
        {
          type: 'optimization',
          title: '学習効率向上のチャンス',
          description: '朝の時間帯の活用度が高く、継続すれば更なる効果が期待できます',
          actionItems: ['朝学習の時間を10分延長', '難しい内容を朝に配置'],
          impact: 'high',
          confidence: 92
        }
      ],
      adaptiveAdjustments: [
        {
          sessionId: 'session2',
          originalTime: '16:00',
          adjustedTime: '15:00',
          reason: 'エネルギーレベルが最適な時間帯に調整しました',
          confidence: 88,
          userApproved: false
        }
      ]
    };
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">スマートスケジュールを生成中...</p>
          <p className="text-sm text-gray-500 mt-2">個人最適化されたプランを作成しています</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ナビゲーションタブ */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
          <div className="flex space-x-2">
            {[
              { key: 'today', label: '📅 今日', icon: '📅' },
              { key: 'week', label: '📊 週間', icon: '📊' },
              { key: 'insights', label: '💡 インサイト', icon: '🧠' },
              { key: 'settings', label: '⚙️ 設定', icon: '⚙️' }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setSelectedView(view.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedView === view.key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      {selectedView === 'today' && renderTodaySchedule()}
      {selectedView === 'week' && renderWeeklyPlan()}
      {selectedView === 'insights' && renderInsights()}
      {selectedView === 'settings' && (
        <KidsCard title="⚙️ スケジュール設定" icon="🔧" color="gray">
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🚧</div>
            <p>設定画面は準備中です</p>
          </div>
        </KidsCard>
      )}
    </div>
  );
};

// 型定義の追加
interface WeeklyChallenge {
  title: string;
  description: string;
  progress: number;
  reward: string;
}

export default SmartSchedulingDashboard;