import React from 'react';
import { UserProgress } from '../types';
import { SUBJECTS_DATA } from '../constants';
import MotivationBanner from './MotivationBanner';

interface LearningDashboardProps {
  userProgress: UserProgress;
  onSubjectSelect: (subjectId: string) => void;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({ 
  userProgress, 
  onSubjectSelect 
}) => {
  const { learningStats, subjectProgresses, achievements } = userProgress;

  // 時間を分:秒形式に変換
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  // 習熟度に応じた色を取得
  const getMasteryColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };


  return (
    <div className="space-y-6">
      {/* モチベーションバナー */}
      <MotivationBanner learningStats={learningStats} />
      
      {/* 学習統計サマリー */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">学習統計</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-sky-50 rounded-lg">
            <div className="text-2xl font-bold text-sky-600">{learningStats.currentStreak}</div>
            <div className="text-sm text-slate-600">連続学習日数</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{learningStats.totalSessions}</div>
            <div className="text-sm text-slate-600">総セッション数</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(learningStats.totalStudyTime)}
            </div>
            <div className="text-sm text-slate-600">総学習時間</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {Math.round(learningStats.overallCorrectRate * 100)}%
            </div>
            <div className="text-sm text-slate-600">平均正解率</div>
          </div>
        </div>
      </div>

      {/* 教科別進捗 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">教科別進捗</h2>
        <div className="space-y-4">
          {SUBJECTS_DATA.map(subject => {
            const progress = subjectProgresses.find(sp => sp.subjectId === subject.id);
            const masteryScore = progress?.overallMasteryScore || 0;
            const sessions = progress?.totalSessions || 0;
            const studyTime = progress?.totalStudyTime || 0;
            
            return (
              <div 
                key={subject.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onSubjectSelect(subject.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">{subject.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                      <span>セッション: {sessions}回</span>
                      <span>学習時間: {formatTime(studyTime)}</span>
                      {progress && (
                        <span>最終学習: {new Date(progress.lastStudiedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(masteryScore)}`}>
                    習熟度 {masteryScore}%
                  </div>
                </div>
                
                {/* 進捗バー */}
                <div className="mt-3">
                  <div className="bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${masteryScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近の実績 */}
      {achievements.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-sky-700 mb-4">実績</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(-4).map(achievement => (
              <div 
                key={achievement.id}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{achievement.title}</h4>
                  <p className="text-sm text-slate-600">{achievement.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 学習習慣チャート（簡易版） */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">最近の学習時間</h2>
        <div className="flex items-end space-x-2 h-32">
          {learningStats.dailyStudyTime.slice(-7).map((day, _index) => {
            const maxTime = Math.max(...learningStats.dailyStudyTime.map(d => d.studyTime), 1);
            const height = (day.studyTime / maxTime) * 100;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-sky-500 rounded-t w-full min-h-[4px] transition-all duration-300"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-slate-600 mt-2">
                  {new Date(day.date).toLocaleDateString('ja-JP', { weekday: 'short' })}
                </div>
                <div className="text-xs text-slate-500">
                  {Math.round(day.studyTime / 60)}分
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 今日の目標 */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-3">今日の学習目標</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sky-100">目標時間: {userProgress.preferences.studyTimeGoal}分</p>
            <p className="text-sky-100">
              今日の学習: {Math.round((learningStats.dailyStudyTime.find(d => 
                d.date === new Date().toISOString().split('T')[0]
              )?.studyTime || 0) / 60)}分
            </p>
          </div>
          <div className="text-4xl">🎯</div>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;