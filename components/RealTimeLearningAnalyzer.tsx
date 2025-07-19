import React, { useState, useEffect } from 'react';
import { RealTimeLearningAnalysis } from '../services/realTimeLearningAnalyzer';

interface RealTimeLearningAnalyzerProps {
  analysis: RealTimeLearningAnalysis | null;
  isSessionActive: boolean;
  onActionTaken?: (action: string) => void;
}

const RealTimeLearningAnalyzer: React.FC<RealTimeLearningAnalyzerProps> = ({
  analysis,
  isSessionActive,
  onActionTaken
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [lastRecommendation, setLastRecommendation] = useState<string | null>(null);

  useEffect(() => {
    if (analysis?.immediateRecommendations.customMessage && 
        analysis.immediateRecommendations.customMessage !== lastRecommendation) {
      setLastRecommendation(analysis.immediateRecommendations.customMessage);
      if (onActionTaken) {
        onActionTaken('recommendation_shown');
      }
    }
  }, [analysis, lastRecommendation, onActionTaken]);

  if (!analysis || !isSessionActive) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <span className="text-sm text-gray-500">学習分析待機中...</span>
        </div>
      </div>
    );
  }

  const getEngagementIcon = (level: string) => {
    switch (level) {
      case 'high': return '🔥';
      case 'medium': return '📚';
      case 'low': return '😴';
      default: return '📊';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'confident': return '😊';
      case 'engaged': return '🤔';
      case 'frustrated': return '😤';
      case 'confused': return '😵';
      case 'bored': return '😑';
      default: return '😐';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 0.7) return 'bg-green-500';
    if (progress >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleTakeBreak = () => {
    if (onActionTaken) onActionTaken('break_taken');
  };

  const handleRequestHelp = () => {
    if (onActionTaken) onActionTaken('help_requested');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              🧠
            </div>
            <div>
              <h3 className="font-semibold">リアルタイム学習分析</h3>
              <p className="text-sm opacity-90">AIが学習状況を分析中</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            title={showDetails ? '詳細を隠す' : '詳細を表示'}
          >
            {showDetails ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
      </div>

      {/* メイン分析表示 */}
      <div className="p-4 space-y-4">
        {/* 即座推奨アクション */}
        {analysis.immediateRecommendations.customMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                💡
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 mb-1">AIからの提案</h4>
                <p className="text-blue-700 text-sm">{analysis.immediateRecommendations.customMessage}</p>
                
                {/* アクションボタン */}
                <div className="flex space-x-2 mt-3">
                  {analysis.immediateRecommendations.shouldTakeBreak && (
                    <button
                      onClick={handleTakeBreak}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      休憩する
                    </button>
                  )}
                  {analysis.immediateRecommendations.shouldOfferHint && (
                    <button
                      onClick={handleRequestHelp}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      ヒントをもらう
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* クイック状況表示 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">
              {getEngagementIcon(analysis.behaviorAnalysis.engagementLevel)}
            </div>
            <div className="text-xs text-gray-600">集中度</div>
            <div className="font-medium text-sm">{analysis.behaviorAnalysis.engagementLevel}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">
              {getMoodIcon(analysis.emotionalAnalysis.currentMood)}
            </div>
            <div className="text-xs text-gray-600">気分</div>
            <div className="font-medium text-sm">{analysis.emotionalAnalysis.currentMood}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-xs text-gray-600">理解度</div>
            <div className="font-medium text-sm">
              {Math.round(analysis.comprehensionAnalysis.conceptualUnderstanding * 100)}%
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-xs text-gray-600">応答時間</div>
            <div className="font-medium text-sm">
              {Math.round(analysis.behaviorAnalysis.responseTime)}秒
            </div>
          </div>
        </div>

        {/* セッション進捗 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">セッション進捗</span>
            <span className="text-sm text-gray-500">
              {Math.round(analysis.progressIndicators.currentSessionProgress * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.progressIndicators.currentSessionProgress)}`}
              style={{ width: `${analysis.progressIndicators.currentSessionProgress * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 詳細分析（展開可能） */}
        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            {/* 学習行動分析 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">学習行動分析</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">メッセージ頻度:</span>
                  <span className="ml-2 font-medium">
                    {analysis.behaviorAnalysis.messageFrequency.toFixed(1)}/分
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">平均文章長:</span>
                  <span className="ml-2 font-medium">
                    {Math.round(analysis.behaviorAnalysis.averageMessageLength)}文字
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">質問比率:</span>
                  <span className="ml-2 font-medium">
                    {Math.round(analysis.behaviorAnalysis.questionToAnswerRatio * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 理解度分析 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">理解度分析</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">概念的理解</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${analysis.comprehensionAnalysis.conceptualUnderstanding * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(analysis.comprehensionAnalysis.conceptualUnderstanding * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">手続き的流暢性</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${analysis.comprehensionAnalysis.proceduralFluency * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(analysis.comprehensionAnalysis.proceduralFluency * 100)}%
                    </span>
                  </div>
                </div>

                {/* 知識ギャップ */}
                {analysis.comprehensionAnalysis.knowledgeGaps.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">苦手分野:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.comprehensionAnalysis.knowledgeGaps.map((gap, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 強み分野 */}
                {analysis.comprehensionAnalysis.strengthAreas.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">得意分野:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.comprehensionAnalysis.strengthAreas.map((strength, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 学習パターン分析 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">学習パターン</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">学習スタイル:</span>
                  <span className="ml-2 font-medium">{analysis.learningPatternAnalysis.learningStyle}</span>
                </div>
                <div>
                  <span className="text-gray-600">希望難易度:</span>
                  <span className="ml-2 font-medium">{analysis.learningPatternAnalysis.preferredComplexity}</span>
                </div>
                <div>
                  <span className="text-gray-600">集中持続時間:</span>
                  <span className="ml-2 font-medium">
                    {Math.round(analysis.learningPatternAnalysis.attentionSpan)}分
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">最適セッション:</span>
                  <span className="ml-2 font-medium">
                    {Math.round(analysis.learningPatternAnalysis.optimalSessionLength)}分
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeLearningAnalyzer;