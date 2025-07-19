import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton, 
  AnimatedProgress, 
  HoverScaleCard,
  FloatingActionButton,
  ParticleBackground,
  AchievementToast
} from './ui/MicroInteractions';

/**
 * 👨‍👩‍👧‍👦 保護者リアルタイムダッシュボード
 * 子どもの学習状況をリアルタイムで把握・サポート
 */

interface ParentRealtimeDashboardProps {
  parentId: string;
  className?: string;
}

interface ChildConnection {
  childId: string;
  childName: string;
  age: number;
  grade: string;
  connectionType: 'primary' | 'secondary' | 'guardian';
  isOnline: boolean;
  currentActivity: CurrentActivity | null;
  lastActiveAt: Date;
  todayProgress: DailyProgress;
  weeklyStats: WeeklyStats;
  urgentAlerts: Alert[];
}

interface CurrentActivity {
  sessionId: string;
  subject: string;
  topic: string;
  startTime: Date;
  progress: number;
  difficulty: number;
  currentPerformance: {
    accuracy: number;
    speed: number;
    engagement: number;
  };
  estimatedEndTime: Date;
}

interface DailyProgress {
  targetTime: number;
  completedTime: number;
  sessionsPlanned: number;
  sessionsCompleted: number;
  achievements: Achievement[];
  struggles: Struggle[];
}

interface WeeklyStats {
  totalTime: number;
  averageAccuracy: number;
  subjectProgress: { [subject: string]: number };
  consistencyScore: number;
  motivationTrend: 'up' | 'stable' | 'down';
}

interface Achievement {
  id: string;
  type: 'streak' | 'mastery' | 'improvement' | 'milestone';
  title: string;
  description: string;
  earnedAt: Date;
  celebrationLevel: 'small' | 'medium' | 'big';
  shared: boolean;
}

interface Struggle {
  area: string;
  description: string;
  severity: 'minor' | 'moderate' | 'significant';
  duration: number; // days
  supportSuggestion: string;
}

interface Alert {
  id: string;
  type: 'progress' | 'motivation' | 'difficulty' | 'schedule' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionRequired: boolean;
  suggestedActions: string[];
  timestamp: Date;
}

interface FamilyMessage {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  content: string;
  type: 'text' | 'voice' | 'celebration' | 'question' | 'encouragement';
  timestamp: Date;
  read: boolean;
  aiSuggested: boolean;
}

interface ParentAction {
  type: 'send_encouragement' | 'adjust_difficulty' | 'schedule_break' | 'send_celebration' | 'request_call';
  target: string;
  data: any;
}

const ParentRealtimeDashboard: React.FC<ParentRealtimeDashboardProps> = ({ 
  parentId, 
  className = '' 
}) => {
  const [connectedChildren, setConnectedChildren] = useState<ChildConnection[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [familyMessages, setFamilyMessages] = useState<FamilyMessage[]>([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState<boolean>(true);
  const [showAchievementToast, setShowAchievementToast] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    initializeDashboard();
    setupRealtimeConnection();
  }, [parentId]);

  const initializeDashboard = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadConnectedChildren(),
        loadFamilyMessages(),
        loadRecentAlerts()
      ]);
    } catch (error) {
      console.error('ダッシュボード初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeConnection = () => {
    // WebSocket or SSE connection for real-time updates
    const ws = new WebSocket(`wss://api.example.com/parent-realtime/${parentId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      handleRealtimeUpdate(update);
    };

    return () => ws.close();
  };

  const handleRealtimeUpdate = useCallback((update: any) => {
    switch (update.type) {
      case 'session_start':
        updateChildActivity(update.childId, update.data);
        break;
      case 'progress_update':
        updateChildProgress(update.childId, update.data);
        break;
      case 'achievement_earned':
        handleNewAchievement(update.childId, update.data);
        break;
      case 'struggle_detected':
        handleStruggleAlert(update.childId, update.data);
        break;
      case 'message_received':
        addFamilyMessage(update.data);
        break;
    }
  }, []);

  const loadConnectedChildren = async () => {
    // Mock data - 実際の実装ではAPIから取得
    const mockChildren: ChildConnection[] = [
      {
        childId: 'child1',
        childName: '太郎',
        age: 10,
        grade: '小学4年生',
        connectionType: 'primary',
        isOnline: true,
        currentActivity: {
          sessionId: 'session123',
          subject: '算数',
          topic: '分数の計算',
          startTime: new Date(Date.now() - 15 * 60 * 1000),
          progress: 65,
          difficulty: 6,
          currentPerformance: {
            accuracy: 78,
            speed: 85,
            engagement: 92
          },
          estimatedEndTime: new Date(Date.now() + 10 * 60 * 1000)
        },
        lastActiveAt: new Date(),
        todayProgress: {
          targetTime: 60,
          completedTime: 45,
          sessionsPlanned: 3,
          sessionsCompleted: 2,
          achievements: [
            {
              id: 'ach1',
              type: 'streak',
              title: '3日連続学習',
              description: '3日間連続で学習目標を達成しました',
              earnedAt: new Date(),
              celebrationLevel: 'medium',
              shared: false
            }
          ],
          struggles: []
        },
        weeklyStats: {
          totalTime: 280,
          averageAccuracy: 82,
          subjectProgress: { '算数': 75, '国語': 88, '理科': 70 },
          consistencyScore: 85,
          motivationTrend: 'up'
        },
        urgentAlerts: []
      },
      {
        childId: 'child2',
        childName: '花子',
        age: 8,
        grade: '小学2年生',
        connectionType: 'primary',
        isOnline: false,
        currentActivity: null,
        lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        todayProgress: {
          targetTime: 30,
          completedTime: 30,
          sessionsPlanned: 2,
          sessionsCompleted: 2,
          achievements: [],
          struggles: [
            {
              area: 'ひらがな',
              description: '「ゃ」「ゅ」「ょ」の使い分けに苦戦',
              severity: 'moderate',
              duration: 2,
              supportSuggestion: '一緒に読書をして実例を見せてあげましょう'
            }
          ]
        },
        weeklyStats: {
          totalTime: 180,
          averageAccuracy: 75,
          subjectProgress: { '国語': 65, '算数': 80 },
          consistencyScore: 92,
          motivationTrend: 'stable'
        },
        urgentAlerts: []
      }
    ];

    setConnectedChildren(mockChildren);
    if (mockChildren.length > 0 && !selectedChild) {
      setSelectedChild(mockChildren[0].childId);
    }
  };

  const loadFamilyMessages = async () => {
    const mockMessages: FamilyMessage[] = [
      {
        id: 'msg1',
        fromId: 'child1',
        fromName: '太郎',
        toId: parentId,
        content: '算数の分数、やっと分かったよ！',
        type: 'text',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        aiSuggested: false
      },
      {
        id: 'msg2',
        fromId: parentId,
        fromName: 'お母さん',
        toId: 'child1',
        content: 'すごいね！頑張ったね！',
        type: 'encouragement',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: true,
        aiSuggested: false
      }
    ];

    setFamilyMessages(mockMessages);
  };

  const loadRecentAlerts = async () => {
    // アラート読み込み実装
  };

  const updateChildActivity = (childId: string, activityData: any) => {
    setConnectedChildren(prev => 
      prev.map(child => 
        child.childId === childId 
          ? { ...child, currentActivity: activityData, isOnline: true }
          : child
      )
    );
  };

  const updateChildProgress = (childId: string, progressData: any) => {
    setConnectedChildren(prev => 
      prev.map(child => 
        child.childId === childId 
          ? { 
              ...child, 
              todayProgress: { ...child.todayProgress, ...progressData },
              lastActiveAt: new Date()
            }
          : child
      )
    );
  };

  const handleNewAchievement = (childId: string, achievement: Achievement) => {
    // 達成通知表示
    setShowAchievementToast(achievement);
    
    // 子どものデータ更新
    setConnectedChildren(prev => 
      prev.map(child => 
        child.childId === childId 
          ? { 
              ...child, 
              todayProgress: { 
                ...child.todayProgress, 
                achievements: [...child.todayProgress.achievements, achievement]
              }
            }
          : child
      )
    );
  };

  const handleStruggleAlert = (childId: string, struggle: Struggle) => {
    // 苦戦アラート処理
    setConnectedChildren(prev => 
      prev.map(child => 
        child.childId === childId 
          ? { 
              ...child, 
              todayProgress: { 
                ...child.todayProgress, 
                struggles: [...child.todayProgress.struggles, struggle]
              }
            }
          : child
      )
    );
  };

  const addFamilyMessage = (message: FamilyMessage) => {
    setFamilyMessages(prev => [message, ...prev]);
  };

  const sendParentAction = async (action: ParentAction) => {
    try {
      // APIに送信
      console.log('保護者アクション送信:', action);
      
      // 楽観的UI更新
      if (action.type === 'send_encouragement') {
        const newMessage: FamilyMessage = {
          id: `msg_${Date.now()}`,
          fromId: parentId,
          fromName: 'お母さん',
          toId: action.target,
          content: action.data.message,
          type: 'encouragement',
          timestamp: new Date(),
          read: false,
          aiSuggested: action.data.aiSuggested || false
        };
        addFamilyMessage(newMessage);
      }
    } catch (error) {
      console.error('アクション送信エラー:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessageText.trim() || !selectedChild) return;

    await sendParentAction({
      type: 'send_encouragement',
      target: selectedChild,
      data: { message: newMessageText }
    });

    setNewMessageText('');
  };

  const selectedChildData = connectedChildren.find(child => child.childId === selectedChild);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">保護者ダッシュボード読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <ParticleBackground particleCount={15} color="#3B82F6" speed={0.3} />
      
      {/* 達成通知トースト */}
      {showAchievementToast && (
        <AchievementToast
          achievement={{
            title: showAchievementToast.title,
            description: showAchievementToast.description,
            icon: '🎉',
            rarity: showAchievementToast.celebrationLevel === 'big' ? 'legendary' : 
                   showAchievementToast.celebrationLevel === 'medium' ? 'epic' : 'rare'
          }}
          onClose={() => setShowAchievementToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              👨‍👩‍👧‍👦 家族学習ダッシュボード
            </h1>
            <p className="text-lg text-gray-600">
              お子さまの学習をリアルタイムでサポート
            </p>
          </div>

          {/* 子ども選択タブ */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {connectedChildren.map((child) => (
                  <button
                    key={child.childId}
                    onClick={() => setSelectedChild(child.childId)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                      selectedChild === child.childId
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{child.childName}</span>
                      <span className="text-sm opacity-75">({child.grade})</span>
                      {child.isOnline && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedChildData && (
            <div className="space-y-6">
              {/* リアルタイム状況 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 現在の活動状況 */}
                <div className="lg:col-span-2">
                  <KidsCard title="🔴 現在の学習状況" icon="📊" color="green">
                    {selectedChildData.currentActivity ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-green-800">
                                学習中: {selectedChildData.currentActivity.subject}
                              </h3>
                              <p className="text-green-700">
                                {selectedChildData.currentActivity.topic}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-800">
                                {selectedChildData.currentActivity.progress}%
                              </div>
                              <div className="text-sm text-green-600">完了</div>
                            </div>
                          </div>

                          <AnimatedProgress 
                            progress={selectedChildData.currentActivity.progress}
                            color="green"
                            label="学習進捗"
                            showPercentage={false}
                          />

                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-800">
                                {selectedChildData.currentActivity.currentPerformance.accuracy}%
                              </div>
                              <div className="text-sm text-green-600">正答率</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-800">
                                {selectedChildData.currentActivity.currentPerformance.engagement}%
                              </div>
                              <div className="text-sm text-green-600">集中度</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-800">
                                {selectedChildData.currentActivity.difficulty}/10
                              </div>
                              <div className="text-sm text-green-600">難易度</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <SuccessAnimatedButton
                            onClick={() => sendParentAction({
                              type: 'send_encouragement',
                              target: selectedChild!,
                              data: { message: '頑張ってるね！' }
                            })}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            successMessage="送信完了！"
                          >
                            📢 応援メッセージ
                          </SuccessAnimatedButton>
                          <KidsButton
                            variant="secondary"
                            size="small"
                            onClick={() => sendParentAction({
                              type: 'schedule_break',
                              target: selectedChild!,
                              data: { duration: 10 }
                            })}
                          >
                            ⏰ 休憩提案
                          </KidsButton>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">😴</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          現在オフライン
                        </h3>
                        <p className="text-gray-600">
                          最終活動: {selectedChildData.lastActiveAt.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </KidsCard>
                </div>

                {/* 今日の進捗 */}
                <div>
                  <KidsCard title="📅 今日の進捗" icon="📈" color="blue">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>学習時間</span>
                          <span>{selectedChildData.todayProgress.completedTime}/{selectedChildData.todayProgress.targetTime}分</span>
                        </div>
                        <AnimatedProgress 
                          progress={(selectedChildData.todayProgress.completedTime / selectedChildData.todayProgress.targetTime) * 100}
                          color="blue"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>セッション</span>
                          <span>{selectedChildData.todayProgress.sessionsCompleted}/{selectedChildData.todayProgress.sessionsPlanned}回</span>
                        </div>
                        <AnimatedProgress 
                          progress={(selectedChildData.todayProgress.sessionsCompleted / selectedChildData.todayProgress.sessionsPlanned) * 100}
                          color="purple"
                        />
                      </div>

                      {selectedChildData.todayProgress.achievements.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <h4 className="font-medium text-yellow-800 mb-2">🏆 今日の達成</h4>
                          {selectedChildData.todayProgress.achievements.map((achievement) => (
                            <div key={achievement.id} className="text-sm text-yellow-700">
                              • {achievement.title}
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedChildData.todayProgress.struggles.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-3">
                          <h4 className="font-medium text-red-800 mb-2">📝 気になる点</h4>
                          {selectedChildData.todayProgress.struggles.map((struggle, index) => (
                            <div key={index} className="text-sm text-red-700 mb-2">
                              <div className="font-medium">{struggle.area}</div>
                              <div className="text-xs">{struggle.supportSuggestion}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </KidsCard>
                </div>
              </div>

              {/* 週間統計とコミュニケーション */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 週間統計 */}
                <KidsCard title="📊 週間パフォーマンス" icon="📈" color="purple">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.floor(selectedChildData.weeklyStats.totalTime / 60)}h{selectedChildData.weeklyStats.totalTime % 60}m
                        </div>
                        <div className="text-sm text-gray-600">総学習時間</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedChildData.weeklyStats.averageAccuracy}%
                        </div>
                        <div className="text-sm text-gray-600">平均正答率</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">教科別進捗</h4>
                      {Object.entries(selectedChildData.weeklyStats.subjectProgress).map(([subject, progress]) => (
                        <div key={subject} className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">{subject}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">継続スコア</span>
                      <span className="text-lg font-bold text-purple-600">
                        {selectedChildData.weeklyStats.consistencyScore}%
                      </span>
                    </div>
                  </div>
                </KidsCard>

                {/* 家族コミュニケーション */}
                <KidsCard title="💬 家族メッセージ" icon="👨‍👩‍👧‍👦" color="green">
                  <div className="space-y-4">
                    <div className="h-48 overflow-y-auto space-y-3">
                      {familyMessages
                        .filter(msg => 
                          msg.fromId === selectedChild || msg.toId === selectedChild ||
                          msg.fromId === parentId || msg.toId === parentId
                        )
                        .slice(0, 5)
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.fromId === parentId 
                                ? 'bg-blue-100 ml-4' 
                                : 'bg-gray-100 mr-4'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">
                                {message.fromName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.type === 'celebration' && (
                              <div className="text-lg mt-1">🎉</div>
                            )}
                          </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                      <textarea
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder={`${selectedChildData.childName}にメッセージを送る...`}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <KidsButton
                          variant="primary"
                          size="small"
                          onClick={sendMessage}
                          disabled={!newMessageText.trim()}
                          className="flex-1"
                        >
                          送信
                        </KidsButton>
                        <KidsButton
                          variant="secondary"
                          size="small"
                          onClick={() => setNewMessageText('頑張ってるね！すごいよ！')}
                        >
                          👏
                        </KidsButton>
                        <KidsButton
                          variant="secondary"
                          size="small"
                          onClick={() => setNewMessageText('お疲れさま！休憩しようね')}
                        >
                          😌
                        </KidsButton>
                      </div>
                    </div>
                  </div>
                </KidsCard>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="📧"
        onClick={() => {
          // 週間レポート生成
          console.log('週間レポート生成');
        }}
        tooltip="週間レポート生成"
        color="purple"
        position="bottom-right"
      />
    </div>
  );
};

export default ParentRealtimeDashboard;