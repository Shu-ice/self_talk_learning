import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { HoverScaleCard, FloatingActionButton, ParticleBackground } from './ui/MicroInteractions';

/**
 * 📱 オフライン学習マネージャー
 * PWA対応・完全オフライン学習機能
 */

interface OfflineLearningManagerProps {
  userId: string;
  className?: string;
}

interface OfflineContent {
  id: string;
  subject: string;
  topic: string;
  content: LearningContent;
  downloadedAt: Date;
  lastAccessed: Date;
  difficulty: number;
  estimatedTime: number;
  size: number; // bytes
  type: 'lesson' | 'practice' | 'review' | 'assessment';
  status: 'downloaded' | 'outdated' | 'syncing' | 'error';
}

interface LearningContent {
  title: string;
  description: string;
  instructions: string[];
  problems: Problem[];
  explanations: Explanation[];
  multimedia: MediaFile[];
  adaptiveHints: AdaptiveHint[];
}

interface Problem {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text_input' | 'matching' | 'drag_drop';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: number;
  hints: string[];
}

interface Explanation {
  concept: string;
  content: string;
  examples: string[];
  visualAids: string[];
}

interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'audio' | 'interactive';
  url: string;
  localPath?: string;
  size: number;
  cached: boolean;
}

interface AdaptiveHint {
  trigger: 'wrong_answer' | 'time_spent' | 'user_request';
  condition: string;
  hint: string;
  difficulty: number;
}

interface OfflineSession {
  id: string;
  userId: string;
  contentId: string;
  startTime: Date;
  endTime?: Date;
  progress: number;
  answers: UserAnswer[];
  performance: SessionPerformance;
  needsSync: boolean;
}

interface UserAnswer {
  problemId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
}

interface SessionPerformance {
  accuracy: number;
  speed: number;
  engagement: number;
  difficulty: number;
  learningVelocity: number;
}

interface NetworkStatus {
  isOnline: boolean;
  speed: 'slow' | 'fast' | 'unknown';
  syncInProgress: boolean;
  lastSyncTime?: Date;
}

const OfflineLearningManager: React.FC<OfflineLearningManagerProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    speed: 'unknown',
    syncInProgress: false
  });
  const [storageUsage, setStorageUsage] = useState<{used: number; available: number}>({
    used: 0,
    available: 0
  });
  const [selectedContent, setSelectedContent] = useState<OfflineContent | null>(null);
  const [currentSession, setCurrentSession] = useState<OfflineSession | null>(null);
  const [isDownloading, setIsDownloading] = useState<Set<string>>(new Set());
  const [syncQueue, setSyncQueue] = useState<string[]>([]);

  // ネットワーク状態監視
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
      startAutoSync();
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker メッセージ監視
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  // 初期化
  useEffect(() => {
    initializeOfflineManager();
  }, [userId]);

  const initializeOfflineManager = async () => {
    await Promise.all([
      loadOfflineContent(),
      checkStorageUsage(),
      loadPendingSessions()
    ]);
  };

  // Service Worker メッセージハンドラー
  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, data } = event.data;

    switch (type) {
      case 'sync-completed':
        setNetworkStatus(prev => ({ 
          ...prev, 
          syncInProgress: false,
          lastSyncTime: new Date()
        }));
        loadOfflineContent(); // 同期後にコンテンツ再読み込み
        break;

      case 'sync-failed':
        setNetworkStatus(prev => ({ ...prev, syncInProgress: false }));
        console.error('同期に失敗しました:', data.error);
        break;

      case 'download-progress':
        // ダウンロード進捗の更新
        break;
    }
  }, []);

  // オフラインコンテンツ読み込み
  const loadOfflineContent = async () => {
    try {
      const content = await getStoredContent();
      setOfflineContent(content);
    } catch (error) {
      console.error('オフラインコンテンツの読み込みに失敗:', error);
    }
  };

  // ストレージ使用量確認
  const checkStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setStorageUsage({
          used: estimate.usage || 0,
          available: estimate.quota || 0
        });
      } catch (error) {
        console.error('ストレージ使用量の取得に失敗:', error);
      }
    }
  };

  // コンテンツダウンロード
  const downloadContent = async (contentId: string) => {
    setIsDownloading(prev => new Set(prev).add(contentId));

    try {
      // コンテンツをダウンロードしてIndexedDBに保存
      const response = await fetch(`/api/content/${contentId}/offline`);
      if (!response.ok) throw new Error('ダウンロードに失敗しました');

      const contentData = await response.json();
      await saveContentToStorage(contentData);
      
      // メディアファイルの並列ダウンロード
      await downloadMediaFiles(contentData.multimedia);

      await loadOfflineContent();
      await checkStorageUsage();
    } catch (error) {
      console.error('コンテンツダウンロードエラー:', error);
    } finally {
      setIsDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
    }
  };

  // メディアファイルダウンロード
  const downloadMediaFiles = async (mediaFiles: MediaFile[]) => {
    const downloadPromises = mediaFiles.map(async (file) => {
      try {
        const response = await fetch(file.url);
        if (response.ok) {
          const blob = await response.blob();
          await saveMediaToCache(file.id, blob);
          file.cached = true;
          file.localPath = `cache://${file.id}`;
        }
      } catch (error) {
        console.error(`メディアファイル ${file.id} のダウンロードに失敗:`, error);
      }
    });

    await Promise.allSettled(downloadPromises);
  };

  // 自動同期開始
  const startAutoSync = async () => {
    if (networkStatus.syncInProgress) return;

    setNetworkStatus(prev => ({ ...prev, syncInProgress: true }));

    try {
      // Service Worker に同期を要求
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'start-sync',
          data: { userId }
        });
      }
    } catch (error) {
      console.error('自動同期の開始に失敗:', error);
      setNetworkStatus(prev => ({ ...prev, syncInProgress: false }));
    }
  };

  // オフライン学習セッション開始
  const startOfflineSession = async (content: OfflineContent) => {
    const session: OfflineSession = {
      id: `offline_${Date.now()}`,
      userId,
      contentId: content.id,
      startTime: new Date(),
      progress: 0,
      answers: [],
      performance: {
        accuracy: 0,
        speed: 0,
        engagement: 0,
        difficulty: content.difficulty,
        learningVelocity: 0
      },
      needsSync: true
    };

    setCurrentSession(session);
    setSelectedContent(content);
    await saveSessionToStorage(session);
  };

  // セッション完了
  const completeSession = async () => {
    if (!currentSession) return;

    const completedSession = {
      ...currentSession,
      endTime: new Date(),
      progress: 100
    };

    await saveSessionToStorage(completedSession);
    setSyncQueue(prev => [...prev, completedSession.id]);

    // オンラインなら即座に同期試行
    if (networkStatus.isOnline) {
      startAutoSync();
    }

    setCurrentSession(null);
    setSelectedContent(null);
  };

  // コンテンツ削除
  const deleteContent = async (contentId: string) => {
    try {
      await removeContentFromStorage(contentId);
      await loadOfflineContent();
      await checkStorageUsage();
    } catch (error) {
      console.error('コンテンツ削除エラー:', error);
    }
  };

  // ストレージヘルパー関数
  const getStoredContent = async (): Promise<OfflineContent[]> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ai-learning-offline-db', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['content'], 'readonly');
        const store = transaction.objectStore('content');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result || []);
        };

        getAllRequest.onerror = () => {
          reject(getAllRequest.error);
        };
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const saveContentToStorage = async (content: OfflineContent): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ai-learning-offline-db', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['content'], 'readwrite');
        const store = transaction.objectStore('content');
        const putRequest = store.put(content);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
    });
  };

  const saveSessionToStorage = async (session: OfflineSession): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ai-learning-offline-db', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const putRequest = store.put(session);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
    });
  };

  const saveMediaToCache = async (mediaId: string, blob: Blob): Promise<void> => {
    if ('caches' in window) {
      const cache = await caches.open('ai-learning-media-cache');
      const response = new Response(blob);
      await cache.put(`/media/${mediaId}`, response);
    }
  };

  const removeContentFromStorage = async (contentId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ai-learning-offline-db', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['content'], 'readwrite');
        const store = transaction.objectStore('content');
        const deleteRequest = store.delete(contentId);

        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  };

  const loadPendingSessions = async () => {
    // 同期待ちセッションの読み込み実装
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // オフライン学習画面
  if (currentSession && selectedContent) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
        <ParticleBackground particleCount={15} color="#3B82F6" speed={0.5} />
        
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* オフライン学習ヘッダー */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                    📱
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">オフライン学習</h1>
                    <p className="text-gray-600">{selectedContent.subject} - {selectedContent.topic}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {!networkStatus.isOnline && (
                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      📡 オフライン
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    進捗: {Math.round(currentSession.progress)}%
                  </div>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentSession.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 学習コンテンツ表示エリア */}
            <KidsCard title="📚 学習内容" icon="🎯" color="blue">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🚧</div>
                <p className="text-gray-600">学習コンテンツ表示エリア</p>
                <p className="text-sm text-gray-500 mt-2">実際のアプリでは、問題・解説・インタラクティブ要素を表示</p>
                
                <div className="mt-6 space-x-4">
                  <KidsButton
                    variant="primary"
                    onClick={completeSession}
                  >
                    セッション完了
                  </KidsButton>
                  <KidsButton
                    variant="secondary"
                    onClick={() => {
                      setCurrentSession(null);
                      setSelectedContent(null);
                    }}
                  >
                    一時停止
                  </KidsButton>
                </div>
              </div>
            </KidsCard>
          </div>
        </div>
      </div>
    );
  }

  // メインダッシュボード
  return (
    <div className={`space-y-6 ${className}`}>
      {/* ネットワーク状態とストレージ情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${
          networkStatus.isOnline ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
        } border`}>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {networkStatus.isOnline ? '🌐' : '📡'}
            </span>
            <div>
              <div className="font-medium">
                {networkStatus.isOnline ? 'オンライン' : 'オフライン'}
              </div>
              <div className="text-sm text-gray-600">
                {networkStatus.syncInProgress ? '同期中...' : 
                 networkStatus.lastSyncTime ? `最終同期: ${networkStatus.lastSyncTime.toLocaleTimeString()}` : 
                 '同期待機中'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 border-blue-200 border">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💾</span>
            <div>
              <div className="font-medium">ストレージ使用量</div>
              <div className="text-sm text-gray-600">
                {formatFileSize(storageUsage.used)} / {formatFileSize(storageUsage.available)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-50 border-purple-200 border">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📥</span>
            <div>
              <div className="font-medium">オフライン教材</div>
              <div className="text-sm text-gray-600">
                {offlineContent.length}個の教材が利用可能
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 同期待ちセッション */}
      {syncQueue.length > 0 && (
        <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⏳</span>
            <div>
              <div className="font-medium">同期待ちデータ</div>
              <div className="text-sm text-gray-600">
                {syncQueue.length}個の学習セッションが同期を待機中
              </div>
            </div>
          </div>
          {networkStatus.isOnline && (
            <KidsButton
              variant="primary"
              size="small"
              onClick={startAutoSync}
              disabled={networkStatus.syncInProgress}
              className="mt-2"
            >
              今すぐ同期
            </KidsButton>
          )}
        </div>
      )}

      {/* オフラインコンテンツ一覧 */}
      <KidsCard title="📱 オフライン学習教材" icon="📚" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offlineContent.map((content) => (
            <HoverScaleCard
              key={content.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{content.topic}</h3>
                  <p className="text-sm text-gray-600">{content.subject}</p>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  content.status === 'downloaded' ? 'bg-green-100 text-green-800' :
                  content.status === 'outdated' ? 'bg-yellow-100 text-yellow-800' :
                  content.status === 'syncing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {content.status === 'downloaded' ? '✅ ダウンロード済み' :
                   content.status === 'outdated' ? '🔄 更新可能' :
                   content.status === 'syncing' ? '🔄 同期中' :
                   '❌ エラー'}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>⏱️ 推定時間: {content.estimatedTime}分</div>
                <div>📊 難易度: {content.difficulty}/10</div>
                <div>💾 サイズ: {formatFileSize(content.size)}</div>
                <div>📅 最終アクセス: {content.lastAccessed.toLocaleDateString()}</div>
              </div>

              <div className="flex space-x-2">
                <KidsButton
                  variant="primary"
                  size="small"
                  onClick={() => startOfflineSession(content)}
                  disabled={content.status !== 'downloaded'}
                  className="flex-1"
                >
                  学習開始
                </KidsButton>
                <KidsButton
                  variant="danger"
                  size="small"
                  onClick={() => deleteContent(content.id)}
                >
                  削除
                </KidsButton>
              </div>
            </HoverScaleCard>
          ))}
        </div>

        {offlineContent.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📥</div>
            <p className="text-gray-600">オフライン教材がありません</p>
            <p className="text-sm text-gray-500 mt-2">
              オンライン時に教材をダウンロードしてオフライン学習を有効にしてください
            </p>
          </div>
        )}
      </KidsCard>

      {/* フローティングアクションボタン */}
      {networkStatus.isOnline && (
        <FloatingActionButton
          icon="📥"
          onClick={() => {
            // 新しい教材ダウンロード画面へ
            console.log('教材ダウンロード画面を開く');
          }}
          tooltip="新しい教材をダウンロード"
          color="blue"
        />
      )}
    </div>
  );
};

export default OfflineLearningManager;