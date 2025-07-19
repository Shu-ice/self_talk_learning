import React, { useState, useEffect, useRef } from 'react';
import { RecordedSession, RecordedEvent, PlaybackOptions, KeyMoment } from '../services/sessionRecorderService';

interface SessionPlaybackProps {
  recording: RecordedSession;
  onClose: () => void;
}

const SessionPlayback: React.FC<SessionPlaybackProps> = ({ recording, onClose }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 1.5 | 2>(1);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showEmotions, setShowEmotions] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [playbackOptions, setPlaybackOptions] = useState<PlaybackOptions>({
    speed: 1,
    showAnalysis: true,
    showEmotions: true,
    showThoughts: true
  });

  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = recording.startTime.getTime();
  const endTime = recording.endTime?.getTime() || Date.now();
  const totalDuration = (endTime - startTime) / 1000; // 秒

  // 現在の時間に基づいて表示すべきイベントを取得
  const getCurrentEvents = (): RecordedEvent[] => {
    const currentTimestamp = startTime + (currentTime * 1000);
    return recording.events.filter(event => 
      event.timestamp.getTime() <= currentTimestamp
    );
  };

  // 現在の時間の最新イベント
  const getCurrentLatestEvent = (): RecordedEvent | null => {
    const events = getCurrentEvents();
    return events.length > 0 ? events[events.length - 1] : null;
  };

  // 再生/一時停止
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // 再生時間更新
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 1000);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalDuration]);

  // 時間をフォーマット
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 進捗バーの位置を計算
  const getProgressPercentage = (): number => {
    return (currentTime / totalDuration) * 100;
  };

  // 感情状態のアイコン
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'confident': return '😊';
      case 'excited': return '🤩';
      case 'confused': return '😵';
      case 'frustrated': return '😤';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  // エンゲージメントレベルの色
  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 重要な瞬間を時間軸に表示
  const renderKeyMoments = () => {
    return recording.keyMoments.map(moment => {
      const momentTime = (moment.timestamp.getTime() - startTime) / 1000;
      const position = (momentTime / totalDuration) * 100;
      
      return (
        <div
          key={moment.id}
          className="absolute top-0 transform -translate-x-1/2 cursor-pointer"
          style={{ left: `${position}%` }}
          onClick={() => setCurrentTime(momentTime)}
          title={moment.description}
        >
          <div className={`w-3 h-3 rounded-full ${
            moment.type === 'breakthrough' ? 'bg-green-500' :
            moment.type === 'struggle' ? 'bg-red-500' :
            moment.type === 'insight' ? 'bg-blue-500' :
            'bg-yellow-500'
          }`}></div>
        </div>
      );
    });
  };

  const currentEvents = getCurrentEvents();
  const latestEvent = getCurrentLatestEvent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">学習セッション復習</h2>
              <p className="text-purple-100 mt-1">
                {recording.startTime.toLocaleString()} - {formatTime(totalDuration)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* コントロールパネル */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayback}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">速度:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value) as 0.5 | 1 | 1.5 | 2)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAnalysis}
                  onChange={(e) => setShowAnalysis(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">分析表示</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showEmotions}
                  onChange={(e) => setShowEmotions(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">感情表示</span>
              </label>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="relative">
            <div className="w-full h-4 bg-gray-200 rounded-lg relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
              
              {/* 重要な瞬間のマーカー */}
              {renderKeyMoments()}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 overflow-hidden flex">
          {/* 左側: メッセージ履歴 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {currentEvents
                .filter(e => e.type === 'message')
                .map((event, index) => {
                  const message = event.data.message;
                  const isVisible = (event.timestamp.getTime() - startTime) / 1000 <= currentTime;
                  
                  return (
                    <div
                      key={event.id}
                      className={`transition-opacity duration-500 ${
                        isVisible ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl ${
                          message.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.text}</div>
                          <div className="text-xs opacity-70 mt-2">
                            {event.timestamp.toLocaleTimeString()}
                            {showEmotions && event.metadata?.emotionalState && (
                              <span className="ml-2">
                                {getEmotionIcon(event.metadata.emotionalState)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 右側: 分析情報 */}
          {showAnalysis && (
            <div className="w-80 border-l bg-gray-50 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-800 mb-4">リアルタイム分析</h3>
              
              {/* 現在の状態 */}
              {latestEvent && latestEvent.metadata && (
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">現在の学習状態</h4>
                  
                  {latestEvent.metadata.emotionalState && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">感情:</span>
                      <span className="ml-2 text-lg">
                        {getEmotionIcon(latestEvent.metadata.emotionalState)}
                        {latestEvent.metadata.emotionalState}
                      </span>
                    </div>
                  )}
                  
                  {latestEvent.metadata.comprehensionLevel !== undefined && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">理解度:</span>
                      <div className="flex items-center mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${latestEvent.metadata.comprehensionLevel * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">
                          {Math.round(latestEvent.metadata.comprehensionLevel * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {latestEvent.metadata.engagementLevel && (
                    <div>
                      <span className="text-sm text-gray-600">エンゲージメント:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        getEngagementColor(latestEvent.metadata.engagementLevel)
                      }`}>
                        {latestEvent.metadata.engagementLevel}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* セッション要約 */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-3">セッション要約</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">総メッセージ数:</span>
                    <span className="ml-2 font-medium">{recording.summary.totalMessages}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">平均応答時間:</span>
                    <span className="ml-2 font-medium">
                      {Math.round(recording.summary.averageResponseTime)}秒
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">問題解決数:</span>
                    <span className="ml-2 font-medium">
                      {recording.summary.problemsSolved}/{recording.summary.totalProblems}
                    </span>
                  </div>
                </div>
              </div>

              {/* 重要な瞬間 */}
              {recording.keyMoments.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">重要な瞬間</h4>
                  <div className="space-y-2">
                    {recording.keyMoments.map(moment => {
                      const momentTime = (moment.timestamp.getTime() - startTime) / 1000;
                      const isPassed = momentTime <= currentTime;
                      
                      return (
                        <div
                          key={moment.id}
                          className={`p-2 rounded cursor-pointer transition-opacity ${
                            isPassed ? 'bg-blue-50 opacity-100' : 'bg-gray-50 opacity-50'
                          }`}
                          onClick={() => setCurrentTime(momentTime)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTime(momentTime)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              moment.type === 'breakthrough' ? 'bg-green-100 text-green-800' :
                              moment.type === 'struggle' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {moment.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {moment.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPlayback;