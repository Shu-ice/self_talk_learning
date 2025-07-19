import React, { useState, useEffect } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { gamificationEngine } from '../services/gamificationEngine';

interface GamificationDashboardProps {
  userId: string;
  className?: string;
}

interface UserGameStats {
  level: number;
  currentXP: number;
  totalXP: number;
  nextLevelXP: number;
  currentStreak: number;
  longestStreak: number;
  totalCoins: number;
  badges: Badge[];
  currentTitle: string;
  activeQuests: Quest[];
  completedQuests: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewards: QuestReward[];
  timeLimit?: Date;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestReward {
  type: 'xp' | 'coins' | 'item' | 'badge';
  amount?: number;
  name: string;
  icon: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [gameStats, setGameStats] = useState<UserGameStats | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showQuests, setShowQuests] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Badge | null>(null);

  useEffect(() => {
    loadGameStats();
  }, [userId]);

  const loadGameStats = async () => {
    try {
      const stats = await gamificationEngine.getGamificationStats(userId);
      const levelInfo = gamificationEngine.calculatePlayerLevel(stats.economy.totalXPEarned);
      
      const userStats: UserGameStats = {
        level: levelInfo.currentLevel,
        currentXP: levelInfo.currentXP,
        totalXP: levelInfo.totalXP,
        nextLevelXP: levelInfo.requiredXPForNext,
        currentStreak: stats.streaks.current,
        longestStreak: stats.streaks.longest,
        totalCoins: stats.economy.currentCoins,
        badges: stats.collection.badges,
        currentTitle: stats.collection.titles[0] || '新人学習者',
        activeQuests: stats.quests.active,
        completedQuests: stats.quests.completed
      };
      
      setGameStats(userStats);
    } catch (error) {
      console.error('ゲーム統計の読み込みに失敗:', error);
    }
  };

  // XPプログレスバー
  const renderXPProgress = () => {
    if (!gameStats) return null;
    
    const progressPercentage = (gameStats.currentXP / gameStats.nextLevelXP) * 100;
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
              {gameStats.level}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">レベル {gameStats.level}</h3>
              <p className="text-sm text-gray-600">{gameStats.currentTitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{gameStats.totalCoins}</div>
            <div className="text-xs text-gray-500">コイン</div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span>XP: {gameStats.currentXP}</span>
            <span>次のレベルまで: {gameStats.nextLevelXP - gameStats.currentXP}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // ストリーク表示
  const renderStreakInfo = () => {
    if (!gameStats) return null;
    
    return (
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-3xl">🔥</span>
              <div>
                <div className="text-2xl font-bold">{gameStats.currentStreak}日</div>
                <div className="text-sm opacity-90">連続学習</div>
              </div>
            </div>
            <div className="text-xs opacity-75">
              最長記録: {gameStats.longestStreak}日
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {getStreakMessage(gameStats.currentStreak)}
            </div>
            <div className="text-xs opacity-75">
              次のマイルストーンまで{getNextMilestone(gameStats.currentStreak) - gameStats.currentStreak}日
            </div>
          </div>
        </div>
      </div>
    );
  };

  // クエスト表示
  const renderQuests = () => {
    if (!gameStats || !showQuests) return null;
    
    return (
      <KidsCard title="🎯 アクティブクエスト" icon="📝" color="blue">
        <div className="space-y-4">
          {gameStats.activeQuests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎮</div>
              <p>新しいクエストを取得中...</p>
            </div>
          ) : (
            gameStats.activeQuests.map((quest) => (
              <div key={quest.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{quest.title}</h4>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    quest.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quest.difficulty === 'easy' ? '簡単' : 
                     quest.difficulty === 'medium' ? '普通' : '難しい'}
                  </div>
                </div>
                
                {/* プログレスバー */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>進捗: {quest.progress}/{quest.target}</span>
                    <span>{Math.round((quest.progress / quest.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* 報酬 */}
                <div className="flex items-center space-x-4 text-sm">
                  {quest.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <span>{reward.icon}</span>
                      <span className="text-gray-600">
                        {reward.amount ? `${reward.amount} ${reward.name}` : reward.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* 期限 */}
                {quest.timeLimit && (
                  <div className="mt-2 text-xs text-gray-500">
                    期限: {new Date(quest.timeLimit).toLocaleString('ja-JP')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </KidsCard>
    );
  };

  // バッジ・実績表示
  const renderAchievements = () => {
    if (!gameStats || !showAchievements) return null;
    
    return (
      <KidsCard title="🏆 獲得バッジ" icon="🎖️" color="yellow">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gameStats.badges.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏅</div>
              <p>頑張って最初のバッジを獲得しよう！</p>
            </div>
          ) : (
            gameStats.badges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-white border-2 rounded-xl p-4 text-center transition-all hover:scale-105 ${
                  badge.rarity === 'legendary' ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 to-yellow-100' :
                  badge.rarity === 'epic' ? 'border-purple-400 bg-gradient-to-b from-purple-50 to-purple-100' :
                  badge.rarity === 'rare' ? 'border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100' :
                  badge.rarity === 'uncommon' ? 'border-green-400 bg-gradient-to-b from-green-50 to-green-100' :
                  'border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-600">{badge.description}</p>
                {badge.earnedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(badge.earnedAt).toLocaleDateString('ja-JP')}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </KidsCard>
    );
  };

  // 統計表示
  const renderStats = () => {
    if (!gameStats) return null;
    
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-2xl font-bold text-blue-600">{gameStats.completedQuests}</div>
          <div className="text-xs text-gray-500">完了クエスト</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-yellow-600">{gameStats.badges.length}</div>
          <div className="text-xs text-gray-500">獲得バッジ</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-2xl font-bold text-orange-600">{gameStats.currentStreak}</div>
          <div className="text-xs text-gray-500">連続日数</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-2xl font-bold text-green-600">{gameStats.totalCoins}</div>
          <div className="text-xs text-gray-500">コイン</div>
        </div>
      </div>
    );
  };

  // 最近の実績通知
  const renderRecentAchievement = () => {
    if (!recentAchievement) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-lg animate-bounce z-50">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{recentAchievement.icon}</div>
          <div>
            <h4 className="font-bold">新しいバッジ獲得！</h4>
            <p className="text-sm">{recentAchievement.name}</p>
          </div>
          <button
            onClick={() => setRecentAchievement(null)}
            className="text-white hover:text-yellow-200"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return '伝説の継続者！';
    if (streak >= 14) return '習慣マスター！';
    if (streak >= 7) return '一週間達成！';
    if (streak >= 3) return '良い調子！';
    return '頑張ろう！';
  };

  const getNextMilestone = (streak: number): number => {
    if (streak < 3) return 3;
    if (streak < 7) return 7;
    if (streak < 14) return 14;
    if (streak < 30) return 30;
    return Math.ceil(streak / 30) * 30;
  };

  if (!gameStats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">ゲームデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 最近の実績通知 */}
      {renderRecentAchievement()}
      
      {/* メインダッシュボード */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderXPProgress()}
        {renderStreakInfo()}
      </div>
      
      {/* 統計 */}
      {renderStats()}
      
      {/* ナビゲーションタブ */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowQuests(true);
                setShowAchievements(false);
                setShowLeaderboard(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showQuests
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 クエスト
            </button>
            <button
              onClick={() => {
                setShowQuests(false);
                setShowAchievements(true);
                setShowLeaderboard(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showAchievements
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏆 実績
            </button>
            <button
              onClick={() => {
                setShowQuests(false);
                setShowAchievements(false);
                setShowLeaderboard(true);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showLeaderboard
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🥇 ランキング
            </button>
          </div>
        </div>
      </div>
      
      {/* コンテンツエリア */}
      {renderQuests()}
      {renderAchievements()}
      
      {/* リーダーボード */}
      {showLeaderboard && (
        <KidsCard title="🥇 学習ランキング" icon="🏆" color="green">
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🚧</div>
            <p>リーダーボード機能は準備中です</p>
          </div>
        </KidsCard>
      )}
    </div>
  );
};

export default GamificationDashboard;