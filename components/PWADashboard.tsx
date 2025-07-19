import React, { useState, useEffect } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { ParticleBackground, FloatingActionButton } from './ui/MicroInteractions';
import PWAManager from './PWAManager';
import OfflineLearningManager from './OfflineLearningManager';

/**
 * 📱 PWAメインダッシュボード
 * オフライン学習・PWA管理の統合インターフェース
 */

interface PWADashboardProps {
  userId: string;
  className?: string;
}

interface PWAStats {
  totalOfflineContent: number;
  storageUsed: number;
  storageAvailable: number;
  lastSyncTime: Date | null;
  pendingSessions: number;
  offlineCapable: boolean;
}

const PWADashboard: React.FC<PWADashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'offline' | 'settings'>('overview');
  const [pwaStats, setPWAStats] = useState<PWAStats>({
    totalOfflineContent: 0,
    storageUsed: 0,
    storageAvailable: 0,
    lastSyncTime: null,
    pendingSessions: 0,
    offlineCapable: false
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPromptShown, setInstallPromptShown] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadPWAStats();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPWAStats = async () => {
    try {
      // ストレージ使用量確認
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setPWAStats(prev => ({
          ...prev,
          storageUsed: estimate.usage || 0,
          storageAvailable: estimate.quota || 0
        }));
      }

      // PWA機能確認
      const offlineCapable = 'serviceWorker' in navigator;
      setPWAStats(prev => ({
        ...prev,
        offlineCapable
      }));

      // その他の統計データを取得
      // 実際の実装ではIndexedDBから取得
      setPWAStats(prev => ({
        ...prev,
        totalOfflineContent: 5,
        pendingSessions: 2,
        lastSyncTime: new Date()
      }));

    } catch (error) {
      console.error('PWA統計データの読み込みエラー:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* PWA機能概要 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{pwaStats.totalOfflineContent}</div>
              <div className="text-sm opacity-90">オフライン教材</div>
            </div>
            <div className="text-4xl opacity-80">📚</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            いつでもどこでも学習可能
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{formatFileSize(pwaStats.storageUsed)}</div>
              <div className="text-sm opacity-90">使用ストレージ</div>
            </div>
            <div className="text-4xl opacity-80">💾</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            / {formatFileSize(pwaStats.storageAvailable)}
          </div>
        </div>

        <div className={`bg-gradient-to-r text-white rounded-xl p-6 ${
          isOnline ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{isOnline ? 'オンライン' : 'オフライン'}</div>
              <div className="text-sm opacity-90">接続状態</div>
            </div>
            <div className="text-4xl opacity-80">{isOnline ? '🌐' : '📡'}</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            {isOnline ? '同期可能' : 'オフライン学習'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{pwaStats.pendingSessions}</div>
              <div className="text-sm opacity-90">同期待ち</div>
            </div>
            <div className="text-4xl opacity-80">⏳</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            {pwaStats.lastSyncTime ? 
              `最終同期: ${pwaStats.lastSyncTime.toLocaleTimeString()}` : 
              '未同期'}
          </div>
        </div>
      </div>

      {/* PWA機能説明 */}
      <KidsCard title="📱 PWA（Progressive Web App）について" icon="ℹ️" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🌟 主な機能</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">📱</div>
                <div>
                  <h4 className="font-medium">アプリのような体験</h4>
                  <p className="text-sm text-gray-600">ホーム画面から直接起動可能</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">📡</div>
                <div>
                  <h4 className="font-medium">オフライン学習</h4>
                  <p className="text-sm text-gray-600">インターネット接続なしでも学習継続</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">🔔</div>
                <div>
                  <h4 className="font-medium">プッシュ通知</h4>
                  <p className="text-sm text-gray-600">学習リマインダーとモチベーション通知</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">🔄</div>
                <div>
                  <h4 className="font-medium">バックグラウンド同期</h4>
                  <p className="text-sm text-gray-600">自動で学習データを同期</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 学習メリット</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-blue-800">いつでもどこでも</h4>
                <p className="text-sm text-blue-700">
                  通勤・通学中、旅行先でもオフライン学習が可能
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-medium text-green-800">継続的な学習</h4>
                <p className="text-sm text-green-700">
                  通知機能で学習習慣をサポート
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <h4 className="font-medium text-purple-800">シームレス体験</h4>
                <p className="text-sm text-purple-700">
                  ネイティブアプリのような快適な操作性
                </p>
              </div>
            </div>
          </div>
        </div>
      </KidsCard>

      {/* クイックアクション */}
      <KidsCard title="🚀 クイックアクション" icon="⚡" color="green">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KidsButton
            variant="primary"
            onClick={() => setSelectedTab('offline')}
            className="w-full"
          >
            📚 オフライン教材管理
          </KidsButton>
          <KidsButton
            variant="secondary"
            onClick={() => setSelectedTab('settings')}
            className="w-full"
          >
            ⚙️ PWA設定
          </KidsButton>
          <KidsButton
            variant="success"
            onClick={() => {
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                  type: 'start-sync',
                  data: { userId }
                });
              }
            }}
            disabled={!isOnline}
            className="w-full"
          >
            🔄 今すぐ同期
          </KidsButton>
          <KidsButton
            variant="warning"
            onClick={() => {
              // テスト通知送信
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('AI学習コーチ', {
                  body: 'PWA機能のテスト通知です！',
                  icon: '/icon-192.png',
                  badge: '/badge-72.png'
                });
              }
            }}
            className="w-full"
          >
            🔔 通知テスト
          </KidsButton>
        </div>
      </KidsCard>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <ParticleBackground particleCount={20} color="#3B82F6" speed={0.3} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📱 PWA学習プラットフォーム
            </h1>
            <p className="text-lg text-gray-600">
              どこでも、いつでも、オフラインでも学習できる次世代学習環境
            </p>
          </div>

          {/* ナビゲーションタブ */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {[
                  { key: 'overview', label: '📊 概要', icon: '📊' },
                  { key: 'offline', label: '📱 オフライン学習', icon: '📱' },
                  { key: 'settings', label: '⚙️ PWA設定', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedTab === tab.key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="space-y-6">
            {selectedTab === 'overview' && renderOverview()}
            {selectedTab === 'offline' && <OfflineLearningManager userId={userId} />}
            {selectedTab === 'settings' && <PWAManager />}
          </div>
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="🏠"
        onClick={() => {
          // ホーム画面に戻る
          window.location.href = '/';
        }}
        tooltip="ホームに戻る"
        color="blue"
        position="bottom-right"
      />
    </div>
  );
};

export default PWADashboard;