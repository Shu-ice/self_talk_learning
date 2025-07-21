import React, { useState, useEffect } from 'react';
import { RecordedSession, sessionRecorderService } from '../services/sessionRecorderService';
import SessionPlayback from './SessionPlayback';
import { DETAILED_SUBJECTS } from '../data/detailedCurriculum';

interface SessionRecordingsProps {
  onClose: () => void;
}

const SessionRecordings: React.FC<SessionRecordingsProps> = ({ onClose }) => {
  const [recordings, setRecordings] = useState<RecordedSession[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<RecordedSession | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'progress'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // ローカルストレージから録画データを読み込み
    sessionRecorderService.loadFromLocalStorage();
    loadRecordings();
  }, []);

  const loadRecordings = () => {
    const allRecordings = sessionRecorderService.getAllRecordings();
    setRecordings(allRecordings);
  };

  // フィルタリングとソート
  const getFilteredAndSortedRecordings = (): RecordedSession[] => {
    let filtered = recordings;

    // 教科フィルター
    if (filterSubject !== 'all') {
      filtered = filtered.filter(recording => recording.subjectId === filterSubject);
    }

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(recording => {
        const subject = DETAILED_SUBJECTS.find(s => s.id === recording.subjectId);
        const topic = subject?.topics.find(t => t.id === recording.topicId);
        return (
          subject?.name.includes(searchTerm) ||
          topic?.name.includes(searchTerm) ||
          recording.summary?.strengths?.some(s => s.includes(searchTerm)) ||
          recording.summary?.challenges?.some(c => c.includes(searchTerm))
        );
      });
    }

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = a.startTime instanceof Date ? a.startTime : new Date(a.startTime);
          const dateB = b.startTime instanceof Date ? b.startTime : new Date(b.startTime);
          return dateB.getTime() - dateA.getTime();
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'progress':
          return (b.summary?.comprehensionProgression?.end || 0) - (a.summary?.comprehensionProgression?.end || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // 録画の削除
  const handleDeleteRecording = (id: string) => {
    if (window.confirm('この録画を削除しますか？')) {
      sessionRecorderService.deleteRecording(id);
      sessionRecorderService.saveToLocalStorage();
      loadRecordings();
    }
  };

  // 期間のフォーマット
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '不明';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}分${secs}秒`;
  };

  // 進捗の色
  const getProgressColor = (progress: number): string => {
    if (progress >= 0.8) return 'text-green-600 bg-green-100';
    if (progress >= 0.6) return 'text-blue-600 bg-blue-100';
    if (progress >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // エンゲージメントの平均計算
  const getAverageEngagement = (recording: RecordedSession): number => {
    const levels = recording.summary?.engagementLevels;
    if (!levels) return 0;
    return (levels.high || 0) * 1 + (levels.medium || 0) * 0.6 + (levels.low || 0) * 0.2;
  };

  const filteredRecordings = getFilteredAndSortedRecordings();

  if (selectedRecording) {
    return (
      <SessionPlayback
        recording={selectedRecording}
        onClose={() => setSelectedRecording(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">学習セッション録画</h2>
              <p className="text-indigo-100 mt-1">過去の学習を振り返って理解を深めよう</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* フィルター・検索バー */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">教科:</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">すべて</option>
                {DETAILED_SUBJECTS.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">並び順:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'duration' | 'progress')}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="date">日付順</option>
                <option value="duration">時間順</option>
                <option value="progress">進捗順</option>
              </select>
            </div>

            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="録画を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded px-3 py-1 text-sm"
              />
            </div>

            <div className="text-sm text-gray-600">
              {filteredRecordings.length}件の録画
            </div>
          </div>
        </div>

        {/* 録画リスト */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRecordings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">録画がありません</h3>
              <p className="text-gray-600">学習セッションを始めると、録画が作成されます。</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecordings.map(recording => {
                const subject = DETAILED_SUBJECTS.find(s => s.id === recording.subjectId);
                const topic = subject?.topics.find(t => t.id === recording.topicId);
                const avgEngagement = getAverageEngagement(recording);

                return (
                  <div
                    key={recording.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedRecording(recording)}
                  >
                    {/* カードヘッダー */}
                    <div className="p-4 border-b">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-1">
                            {subject?.name} - {topic?.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {(() => {
                              const date = recording.startTime instanceof Date ? recording.startTime : new Date(recording.startTime);
                              return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                            })()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecording(recording.id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="削除"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* セッション統計 */}
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500">時間</div>
                          <div className="font-medium">{formatDuration(recording.duration)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">メッセージ</div>
                          <div className="font-medium">{recording.summary?.totalMessages || 0}件</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">問題解決</div>
                          <div className="font-medium">
                            {recording.summary?.problemsSolved || 0}/{recording.summary?.totalProblems || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">エンゲージメント</div>
                          <div className={`text-xs px-2 py-1 rounded font-medium ${
                            avgEngagement >= 0.7 ? 'bg-green-100 text-green-800' :
                            avgEngagement >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(avgEngagement * 100)}%
                          </div>
                        </div>
                      </div>

                      {/* 理解度の進捗 */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>理解度の変化</span>
                          <span>
                            {Math.round((recording.summary?.comprehensionProgression?.start || 0) * 100)}% → {Math.round((recording.summary?.comprehensionProgression?.end || 0) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              (recording.summary?.comprehensionProgression?.end || 0) > (recording.summary?.comprehensionProgression?.start || 0)
                                ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${(recording.summary?.comprehensionProgression?.end || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 強みと課題 */}
                      <div>
                        {(recording.summary?.strengths?.length || 0) > 0 && (
                          <div className="mb-2">
                            <div className="text-xs text-gray-500 mb-1">強み</div>
                            <div className="flex flex-wrap gap-1">
                              {recording.summary?.strengths?.slice(0, 2).map((strength, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded"
                                >
                                  {strength}
                                </span>
                              )) || []}
                              {(recording.summary?.strengths?.length || 0) > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{(recording.summary?.strengths?.length || 0) - 2}個
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {(recording.summary?.challenges?.length || 0) > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">課題</div>
                            <div className="flex flex-wrap gap-1">
                              {recording.summary?.challenges?.slice(0, 2).map((challenge, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded"
                                >
                                  {challenge}
                                </span>
                              )) || []}
                              {(recording.summary?.challenges?.length || 0) > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{(recording.summary?.challenges?.length || 0) - 2}個
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 重要な瞬間の数 */}
                    {(recording.keyMoments?.length || 0) > 0 && (
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">重要な瞬間</span>
                          <div className="flex items-center space-x-1">
                            {(recording.keyMoments?.filter(m => m.type === 'breakthrough')?.length || 0) > 0 && (
                              <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{recording.keyMoments?.filter(m => m.type === 'breakthrough')?.length || 0}</span>
                              </span>
                            )}
                            {(recording.keyMoments?.filter(m => m.type === 'struggle')?.length || 0) > 0 && (
                              <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>{recording.keyMoments?.filter(m => m.type === 'struggle')?.length || 0}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionRecordings;