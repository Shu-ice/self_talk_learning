import React, { useState, useEffect } from 'react';
import { LearningStats, Achievement } from '../types';

interface MotivationBannerProps {
  learningStats?: LearningStats;
  newAchievements?: Achievement[];
  onClose?: () => void;
}

const MotivationBanner: React.FC<MotivationBannerProps> = ({ 
  learningStats, 
  newAchievements = [],
  onClose 
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState('');

  useEffect(() => {
    // 新しい実績があれば祝福表示
    if (newAchievements.length > 0) {
      setShowCelebration(true);
    }

    // モチベーションメッセージの生成
    generateMotivationMessage();
  }, [newAchievements, learningStats]);

  const generateMotivationMessage = () => {
    const { 
      currentStreak = 0, 
      totalSessions = 0, 
      overallCorrectRate = 0 
    } = learningStats || {};
    
    if (currentStreak >= 7) {
      setMotivationMessage(`🔥 素晴らしい！${currentStreak}日連続学習を達成！この調子で頑張ろう！`);
    } else if (currentStreak >= 3) {
      setMotivationMessage(`⭐ ${currentStreak}日連続学習中！毎日の積み重ねが力になります！`);
    } else if (totalSessions >= 10) {
      setMotivationMessage(`📚 ${totalSessions}回の学習を完了！継続する力が身についています！`);
    } else if (overallCorrectRate >= 0.8) {
      setMotivationMessage(`🎯 正解率${Math.round(overallCorrectRate * 100)}%！理解が深まっています！`);
    } else {
      setMotivationMessage('💪 今日も学習を頑張りましょう！小さな一歩が大きな成長につながります！');
    }
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '💎';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '🔥';
    return '📚';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500';
    if (streak >= 14) return 'from-purple-400 to-pink-500';
    if (streak >= 7) return 'from-blue-400 to-indigo-500';
    if (streak >= 3) return 'from-orange-400 to-red-500';
    return 'from-green-400 to-blue-500';
  };

  return (
    <div className="space-y-4">
      {/* 新実績お祝い */}
      {showCelebration && newAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-lg animate-pulse">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold mb-2">新しい実績を解除しました！</h3>
            <div className="space-y-2">
              {newAchievements.map(achievement => (
                <div key={achievement.id} className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">{achievement.icon || '🏆'}</span>
                  <span className="font-semibold">{achievement.title || achievement.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowCelebration(false);
                onClose?.();
              }}
              className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              続ける
            </button>
          </div>
        </div>
      )}

      {/* ストリーク表示 */}
      {(learningStats?.currentStreak || 0) > 0 && (
        <div className={`bg-gradient-to-r ${getStreakColor(learningStats?.currentStreak || 0)} rounded-xl p-4 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{getStreakIcon(learningStats?.currentStreak || 0)}</div>
              <div>
                <div className="text-xl font-bold">{learningStats?.currentStreak || 0}日連続学習中！</div>
                <div className="text-sm opacity-90">
                  最長記録: {(learningStats as any)?.longestStreak || 0}日
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{learningStats?.currentStreak || 0}</div>
              <div className="text-xs opacity-75">STREAK</div>
            </div>
          </div>
        </div>
      )}

      {/* モチベーションメッセージ */}
      <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-sky-500">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🌟</div>
          <p className="text-slate-700 font-medium">{motivationMessage}</p>
        </div>
      </div>

      {/* 今日の目標達成状況 */}
      <TodayGoalProgress learningStats={learningStats} />
    </div>
  );
};

interface TodayGoalProgressProps {
  learningStats?: LearningStats;
}

const TodayGoalProgress: React.FC<TodayGoalProgressProps> = ({ learningStats }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayStudyTime = learningStats?.dailyStudyTime?.find(d => d.date === today)?.studyTime || 0;
  const goalTime = 20 * 60; // 20分を秒に変換
  const progressPercentage = Math.min((todayStudyTime / goalTime) * 100, 100);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-800">今日の学習目標</h4>
        <span className="text-sm text-slate-600">
          {formatTime(todayStudyTime)} / {formatTime(goalTime)}
        </span>
      </div>
      
      <div className="bg-slate-200 rounded-full h-3 mb-2">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${
            progressPercentage >= 100 ? 'bg-green-500' : 'bg-sky-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="text-center text-sm">
        {progressPercentage >= 100 ? (
          <span className="text-green-600 font-medium">🎉 目標達成！素晴らしいです！</span>
        ) : (
          <span className="text-slate-600">
            あと{formatTime(Math.max(0, goalTime - todayStudyTime))}で目標達成！
          </span>
        )}
      </div>
    </div>
  );
};

export default MotivationBanner;