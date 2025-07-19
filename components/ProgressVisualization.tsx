import React from 'react';
import { KidsCard } from './ui/KidsUIComponents';

interface ProgressData {
  subject: string;
  totalTopics: number;
  completedTopics: number;
  currentStreak: number;
  totalStudyTime: number;
  averageScore: number;
}

interface ProgressVisualizationProps {
  progressData: ProgressData[];
  className?: string;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({ 
  progressData, 
  className = '' 
}) => {
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '💫';
    return '🌟';
  };

  const formatStudyTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? mins + '分' : ''}`;
    }
    return `${mins}分`;
  };

  const renderCircularProgress = (percentage: number, color: string, size: number = 120) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={color.replace('bg-', 'text-')}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  const totalProgress = progressData.reduce((acc, data) => {
    const percentage = data.totalTopics > 0 ? (data.completedTopics / data.totalTopics) * 100 : 0;
    return acc + percentage;
  }, 0) / progressData.length;

  const totalStudyTime = progressData.reduce((acc, data) => acc + data.totalStudyTime, 0);
  const averageStreak = progressData.reduce((acc, data) => acc + data.currentStreak, 0) / progressData.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 全体進捗サマリー */}
      <KidsCard title="📊 学習進捗サマリー" icon="🎯" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 全体進捗 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {renderCircularProgress(totalProgress, getProgressColor(totalProgress))}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">全体進捗</h3>
            <p className="text-sm text-gray-600">すべての教科の進捗</p>
          </div>

          {/* 学習時間 */}
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <div className="text-center">
                <div className="text-2xl">⏰</div>
                <div className="text-sm font-bold text-purple-800">
                  {formatStudyTime(totalStudyTime)}
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">総学習時間</h3>
            <p className="text-sm text-gray-600">累計の学習時間</p>
          </div>

          {/* 連続学習 */}
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <div className="text-center">
                <div className="text-3xl">{getStreakEmoji(averageStreak)}</div>
                <div className="text-sm font-bold text-orange-800">
                  {Math.round(averageStreak)}日
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">連続学習</h3>
            <p className="text-sm text-gray-600">平均連続日数</p>
          </div>
        </div>
      </KidsCard>

      {/* 教科別進捗 */}
      <KidsCard title="📚 教科別進捗" icon="📈" color="green">
        <div className="space-y-4">
          {progressData.map((data, index) => {
            const percentage = data.totalTopics > 0 ? (data.completedTopics / data.totalTopics) * 100 : 0;
            const progressColor = getProgressColor(percentage);

            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-lg text-gray-800">{data.subject}</h4>
                  <span className="text-sm text-gray-500">
                    {data.completedTopics}/{data.totalTopics} 単元完了
                  </span>
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${progressColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* 詳細情報 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{Math.round(percentage)}%</div>
                    <div className="text-gray-500">完了率</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{data.currentStreak}日</div>
                    <div className="text-gray-500">連続学習</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{formatStudyTime(data.totalStudyTime)}</div>
                    <div className="text-gray-500">学習時間</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{Math.round(data.averageScore)}%</div>
                    <div className="text-gray-500">平均スコア</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </KidsCard>

      {/* 学習のコツ */}
      <KidsCard title="💡 学習のコツ" icon="🎓" color="yellow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🎯</span>
              <h4 className="font-medium text-blue-800">継続のコツ</h4>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 毎日少しずつでも学習を続けよう</li>
              <li>• 苦手な分野も避けずに挑戦してみよう</li>
              <li>• 達成感を大切にして自分を褒めよう</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📈</span>
              <h4 className="font-medium text-green-800">効率アップ</h4>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 間違えた問題は必ず復習しよう</li>
              <li>• 基礎をしっかり固めてから応用へ</li>
              <li>• 定期的に過去の内容を振り返ろう</li>
            </ul>
          </div>
        </div>
      </KidsCard>
    </div>
  );
};

export default ProgressVisualization;