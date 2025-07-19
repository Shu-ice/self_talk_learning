import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import AdaptiveLearningEngine from '../services/adaptiveLearningEngine';

interface AdaptiveLearningDashboardProps {
  userId: string;
  currentSubject?: string;
  currentTopic?: string;
}

interface RealTimeMetrics {
  cognitiveLoad: number;
  attentionLevel: number;
  fatigueLevel: number;
  flowState: boolean;
  masteryProgress: number;
  recommendedAction: string;
}

interface LearningRecommendation {
  type: 'continue' | 'break' | 'easier' | 'harder' | 'review';
  reason: string;
  action: string;
  estimatedTime?: number;
}

const AdaptiveLearningDashboard: React.FC<AdaptiveLearningDashboardProps> = ({
  userId,
  currentSubject,
  currentTopic
}) => {
  const [engine] = useState(new AdaptiveLearningEngine());
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  // リアルタイム学習分析
  const updateLearningMetrics = useCallback(async () => {
    if (!userId) return;

    try {
      setIsAnalyzing(true);
      
      // AI エンジンから現在の状態を取得
      const cognitiveState = await engine.assessCognitiveState(userId);
      const personalizedRecs = await engine.generatePersonalizedRecommendations(userId);
      
      // メトリクス更新
      const newMetrics: RealTimeMetrics = {
        cognitiveLoad: cognitiveState.workingMemoryLoad,
        attentionLevel: cognitiveState.attentionLevel,
        fatigueLevel: cognitiveState.fatigueLevel,
        flowState: cognitiveState.flowState,
        masteryProgress: await calculateMasteryProgress(userId, currentSubject, currentTopic),
        recommendedAction: determineRecommendedAction(cognitiveState)
      };

      setMetrics(newMetrics);
      
      // 推奨アクション生成
      const newRecommendations = await generateActionRecommendations(
        cognitiveState, 
        newMetrics, 
        personalizedRecs
      );
      setRecommendations(newRecommendations);

    } catch (error) {
      console.error('学習メトリクス更新エラー:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId, currentSubject, currentTopic, engine]);

  // 定期的なメトリクス更新
  useEffect(() => {
    updateLearningMetrics();
    const interval = setInterval(updateLearningMetrics, 30000); // 30秒ごと
    return () => clearInterval(interval);
  }, [updateLearningMetrics]);

  // 認知負荷のビジュアル表示
  const renderCognitiveLoadIndicator = (load: number) => {
    const getColor = (level: number) => {
      if (level <= 3) return 'bg-green-500';
      if (level <= 6) return 'bg-yellow-500';
      if (level <= 8) return 'bg-orange-500';
      return 'bg-red-500';
    };

    const getLabel = (level: number) => {
      if (level <= 3) return '余裕';
      if (level <= 6) return '適切';
      if (level <= 8) return '高負荷';
      return '過負荷';
    };

    return (
      <div className="flex items-center space-x-3">
        <div className="w-24 bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getColor(load)}`}
            style={{ width: `${(load / 10) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getColor(load).replace('bg-', 'text-')}`}>
          {getLabel(load)} ({load}/10)
        </span>
      </div>
    );
  };

  // フロー状態インジケーター
  const renderFlowStateIndicator = (isFlowState: boolean) => (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
      isFlowState ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
    }`}>
      <span className="text-lg">{isFlowState ? '🌟' : '😐'}</span>
      <span className="font-medium">
        {isFlowState ? 'フロー状態' : '通常状態'}
      </span>
    </div>
  );

  // 注意レベル円形チャート
  const renderAttentionChart = (level: number) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (level / 10) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`${level > 7 ? 'text-green-500' : level > 4 ? 'text-yellow-500' : 'text-red-500'}`}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{level}/10</span>
        </div>
      </div>
    );
  };

  // 推奨アクション表示
  const renderRecommendations = () => (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-l-4 ${
            rec.type === 'continue' ? 'border-green-500 bg-green-50' :
            rec.type === 'break' ? 'border-orange-500 bg-orange-50' :
            rec.type === 'easier' ? 'border-blue-500 bg-blue-50' :
            rec.type === 'harder' ? 'border-purple-500 bg-purple-50' :
            'border-yellow-500 bg-yellow-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-1">
                {getRecommendationTitle(rec.type)}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
              <p className="text-sm font-medium text-gray-800">{rec.action}</p>
              {rec.estimatedTime && (
                <p className="text-xs text-gray-500 mt-1">
                  推定時間: {rec.estimatedTime}分
                </p>
              )}
            </div>
            <span className="text-2xl">
              {getRecommendationIcon(rec.type)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const calculateMasteryProgress = async (
    userId: string, 
    subject?: string, 
    topic?: string
  ): Promise<number> => {
    // 実際の実装では、学習履歴から習熟度を計算
    return Math.random() * 100; // プレースホルダー
  };

  const determineRecommendedAction = (cognitiveState: any): string => {
    if (cognitiveState.fatigueLevel > 7) return '休憩';
    if (cognitiveState.flowState) return '継続学習';
    if (cognitiveState.frustrationType !== 'none') return '難易度調整';
    return '通常学習';
  };

  const generateActionRecommendations = async (
    cognitiveState: any,
    metrics: RealTimeMetrics,
    personalizedRecs: any
  ): Promise<LearningRecommendation[]> => {
    const recs: LearningRecommendation[] = [];

    // 疲労レベルチェック
    if (metrics.fatigueLevel > 7) {
      recs.push({
        type: 'break',
        reason: '疲労レベルが高くなっています',
        action: '10-15分の休憩を取りましょう',
        estimatedTime: 15
      });
    }

    // フロー状態チェック
    if (metrics.flowState) {
      recs.push({
        type: 'continue',
        reason: '集中状態が良好です',
        action: 'このまま学習を続けましょう'
      });
    }

    // 認知負荷チェック
    if (metrics.cognitiveLoad > 8) {
      recs.push({
        type: 'easier',
        reason: '認知負荷が高すぎます',
        action: 'より簡単な問題から始めましょう'
      });
    } else if (metrics.cognitiveLoad < 4 && metrics.attentionLevel > 7) {
      recs.push({
        type: 'harder',
        reason: '余裕があります',
        action: 'より挑戦的な問題に取り組みましょう'
      });
    }

    return recs;
  };

  const getRecommendationTitle = (type: string): string => {
    switch (type) {
      case 'continue': return '🚀 学習継続';
      case 'break': return '☕ 休憩推奨';
      case 'easier': return '📉 難易度調整';
      case 'harder': return '📈 レベルアップ';
      case 'review': return '📚 復習推奨';
      default: return '💡 推奨アクション';
    }
  };

  const getRecommendationIcon = (type: string): string => {
    switch (type) {
      case 'continue': return '✨';
      case 'break': return '😴';
      case 'easier': return '🎯';
      case 'harder': return '🔥';
      case 'review': return '🔄';
      default: return '💡';
    }
  };

  if (!metrics) {
    return (
      <KidsCard title="🧠 学習分析中..." icon="⚡" color="blue">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">AI が学習状態を分析しています...</span>
        </div>
      </KidsCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* リアルタイム学習状態 */}
      <KidsCard title="🧠 リアルタイム学習分析" icon="📊" color="purple">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 認知負荷 */}
          <div className="text-center">
            <h4 className="font-medium text-gray-800 mb-3">認知負荷</h4>
            {renderCognitiveLoadIndicator(metrics.cognitiveLoad)}
            <p className="text-xs text-gray-500 mt-2">
              最適: 4-7レベル
            </p>
          </div>

          {/* 注意レベル */}
          <div className="text-center">
            <h4 className="font-medium text-gray-800 mb-3">集中度</h4>
            {renderAttentionChart(metrics.attentionLevel)}
            <p className="text-xs text-gray-500 mt-2">
              現在の集中レベル
            </p>
          </div>

          {/* フロー状態 */}
          <div className="text-center">
            <h4 className="font-medium text-gray-800 mb-3">学習状態</h4>
            <div className="flex justify-center mb-2">
              {renderFlowStateIndicator(metrics.flowState)}
            </div>
            <p className="text-xs text-gray-500">
              最適な学習状態の判定
            </p>
          </div>
        </div>

        {/* 詳細メトリクス表示切り替え */}
        <div className="mt-6 text-center">
          <KidsButton
            onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
            variant="secondary"
            size="small"
            icon={showDetailedMetrics ? "📊" : "🔍"}
          >
            {showDetailedMetrics ? '詳細を隠す' : '詳細分析を見る'}
          </KidsButton>
        </div>

        {/* 詳細メトリクス */}
        {showDetailedMetrics && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">疲労レベル:</span>
                <span className="ml-2 font-medium">{metrics.fatigueLevel}/10</span>
              </div>
              <div>
                <span className="text-gray-600">習熟進捗:</span>
                <span className="ml-2 font-medium">{Math.round(metrics.masteryProgress)}%</span>
              </div>
              <div>
                <span className="text-gray-600">推奨アクション:</span>
                <span className="ml-2 font-medium">{metrics.recommendedAction}</span>
              </div>
              <div>
                <span className="text-gray-600">分析状態:</span>
                <span className="ml-2 font-medium">
                  {isAnalyzing ? '更新中' : '最新'}
                </span>
              </div>
            </div>
          </div>
        )}
      </KidsCard>

      {/* AI推奨アクション */}
      {recommendations.length > 0 && (
        <KidsCard title="🤖 AI学習コーチからの提案" icon="💡" color="green">
          {renderRecommendations()}
        </KidsCard>
      )}

      {/* 学習最適化ヒント */}
      <KidsCard title="✨ 学習効果最大化のコツ" icon="🎯" color="yellow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">🧠 認知科学のヒント</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 25分集中 + 5分休憩が最適</li>
              <li>• 間違いを恐れず挑戦しよう</li>
              <li>• 理解したら他の問題に応用してみよう</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">🎯 モチベーション維持</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 小さな成功を積み重ねよう</li>
              <li>• 進歩を可視化して達成感を味わおう</li>
              <li>• 難しい時は基礎に戻ろう</li>
            </ul>
          </div>
        </div>
      </KidsCard>
    </div>
  );
};

export default AdaptiveLearningDashboard;