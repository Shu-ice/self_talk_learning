import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { SuccessAnimatedButton, HoverScaleCard } from './ui/MicroInteractions';

/**
 * 📱 PWA管理コンポーネント
 * Service Worker登録、アップデート、インストール促進
 */

interface PWAManagerProps {
  className?: string;
}

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface ServiceWorkerStatus {
  isRegistered: boolean;
  isControlling: boolean;
  hasUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
  installing: boolean;
}

interface PWACapabilities {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  supportsNotifications: boolean;
  supportsBackgroundSync: boolean;
  supportsOffline: boolean;
  supportsPush: boolean;
}

const PWAManager: React.FC<PWAManagerProps> = ({ className = '' }) => {
  const [swStatus, setSWStatus] = useState<ServiceWorkerStatus>({
    isRegistered: false,
    isControlling: false,
    hasUpdate: false,
    registration: null,
    updateAvailable: false,
    installing: false
  });
  
  const [pwaCapabilities, setPWACapabilities] = useState<PWACapabilities>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    supportsNotifications: false,
    supportsBackgroundSync: false,
    supportsOffline: false,
    supportsPush: false
  });

  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // 初期化
  useEffect(() => {
    initializePWA();
  }, []);

  const initializePWA = async () => {
    await Promise.all([
      registerServiceWorker(),
      checkPWACapabilities(),
      setupInstallPrompt(),
      checkNotificationPermission()
    ]);
  };

  // Service Worker登録
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service Worker登録成功:', registration);

        setSWStatus(prev => ({
          ...prev,
          isRegistered: true,
          registration
        }));

        // アップデート確認
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            setSWStatus(prev => ({ ...prev, installing: true }));
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setSWStatus(prev => ({ 
                  ...prev, 
                  hasUpdate: true,
                  updateAvailable: true,
                  installing: false 
                }));
              }
            });
          }
        });

        // コントロール状態確認
        if (navigator.serviceWorker.controller) {
          setSWStatus(prev => ({ ...prev, isControlling: true }));
        }

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setSWStatus(prev => ({ ...prev, isControlling: true }));
        });

        // メッセージ監視
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      } catch (error) {
        console.error('[PWA] Service Worker登録失敗:', error);
      }
    }
  };

  // PWA機能チェック
  const checkPWACapabilities = async () => {
    const capabilities: PWACapabilities = {
      isInstallable: false,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      supportsNotifications: 'Notification' in window,
      supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      supportsOffline: 'serviceWorker' in navigator,
      supportsPush: 'serviceWorker' in navigator && 'PushManager' in window
    };

    setPWACapabilities(capabilities);

    // インストール可能性をチェック
    if (!capabilities.isInstalled) {
      // ブラウザの種類に応じてインストール促進の表示を調整
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (!isIOS && isMobile && !capabilities.isInstalled) {
        setShowInstallBanner(true);
      }
    }
  };

  // インストールプロンプト設定
  const setupInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      setPWACapabilities(prev => ({ ...prev, isInstallable: true }));
      setShowInstallBanner(true);
    });

    window.addEventListener('appinstalled', () => {
      setInstallPrompt(null);
      setPWACapabilities(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      setShowInstallBanner(false);
    });
  };

  // 通知許可状態確認
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  // Service Workerメッセージハンドラー
  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, data } = event.data;

    switch (type) {
      case 'cache-updated':
        console.log('[PWA] キャッシュが更新されました');
        break;
      case 'sync-completed':
        console.log('[PWA] バックグラウンド同期完了');
        break;
      case 'push-received':
        console.log('[PWA] プッシュ通知受信:', data);
        break;
    }
  }, []);

  // PWAインストール
  const installPWA = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] ユーザーがインストールを承認');
        setShowInstallBanner(false);
      } else {
        console.log('[PWA] ユーザーがインストールを拒否');
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('[PWA] インストールエラー:', error);
    }
  };

  // Service Workerアップデート
  const updateServiceWorker = async () => {
    if (!swStatus.registration) return;

    try {
      setSWStatus(prev => ({ ...prev, installing: true }));
      
      if (swStatus.registration.waiting) {
        // 新しいService Workerを即座にアクティベート
        swStatus.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('[PWA] アップデートエラー:', error);
      setSWStatus(prev => ({ ...prev, installing: false }));
    }
  };

  // 通知許可要求
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        await setupPushNotifications();
      }
    } catch (error) {
      console.error('[PWA] 通知許可エラー:', error);
    }
  };

  // プッシュ通知設定
  const setupPushNotifications = async () => {
    if (!swStatus.registration || !pwaCapabilities.supportsPush) return;

    try {
      const subscription = await swStatus.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // サーバーに購読情報を送信
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      console.log('[PWA] プッシュ通知設定完了');
    } catch (error) {
      console.error('[PWA] プッシュ通知設定エラー:', error);
    }
  };

  // キャッシュクリア
  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        if (swStatus.registration) {
          await swStatus.registration.update();
        }
        
        console.log('[PWA] キャッシュクリア完了');
        window.location.reload();
      } catch (error) {
        console.error('[PWA] キャッシュクリアエラー:', error);
      }
    }
  };

  // オフライン機能テスト
  const testOfflineFeatures = async () => {
    try {
      // オフライン機能の動作確認
      const testRequests = [
        fetch('/api/test/offline', { method: 'GET' }),
        fetch('/api/test/cache', { method: 'GET' })
      ];

      const results = await Promise.allSettled(testRequests);
      console.log('[PWA] オフライン機能テスト結果:', results);
    } catch (error) {
      console.error('[PWA] オフライン機能テストエラー:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* PWAインストールバナー */}
      {showInstallBanner && pwaCapabilities.isInstallable && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📱</div>
              <div>
                <h3 className="text-xl font-bold">アプリをインストール</h3>
                <p className="text-sm opacity-90">
                  ホーム画面に追加してより便利に学習できます
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <SuccessAnimatedButton
                onClick={installPWA}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                successMessage="インストール中..."
              >
                インストール
              </SuccessAnimatedButton>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* アップデート通知 */}
      {swStatus.updateAvailable && (
        <div className="bg-green-50 border-green-200 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-medium text-green-800">アップデートが利用可能</h4>
                <p className="text-sm text-green-700">新しい機能と改善が含まれています</p>
              </div>
            </div>
            <KidsButton
              variant="primary"
              size="small"
              onClick={updateServiceWorker}
              disabled={swStatus.installing}
            >
              {swStatus.installing ? '更新中...' : '今すぐ更新'}
            </KidsButton>
          </div>
        </div>
      )}

      {/* PWA状態ダッシュボード */}
      <KidsCard title="📱 PWA機能状態" icon="⚙️" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Worker状態 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Service Worker</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">登録状態</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  swStatus.isRegistered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {swStatus.isRegistered ? '✅ 登録済み' : '❌ 未登録'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">コントロール状態</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  swStatus.isControlling ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {swStatus.isControlling ? '✅ アクティブ' : '⏳ 待機中'}
                </span>
              </div>
            </div>
          </div>

          {/* PWA機能 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">PWA機能</h3>
            <div className="space-y-2">
              {[
                { key: 'isInstalled', label: 'インストール済み' },
                { key: 'supportsOffline', label: 'オフライン対応' },
                { key: 'supportsNotifications', label: '通知対応' },
                { key: 'supportsBackgroundSync', label: '背景同期' },
                { key: 'supportsPush', label: 'プッシュ通知' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    pwaCapabilities[key as keyof PWACapabilities] 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pwaCapabilities[key as keyof PWACapabilities] ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </KidsCard>

      {/* PWA管理操作 */}
      <KidsCard title="🔧 PWA管理" icon="⚙️" color="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 通知設定 */}
          <HoverScaleCard className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🔔</div>
              <h4 className="font-medium text-gray-800 mb-2">通知設定</h4>
              <p className="text-sm text-gray-600 mb-4">
                学習リマインダーと進捗通知
              </p>
              <KidsButton
                variant={notificationPermission === 'granted' ? 'success' : 'primary'}
                size="small"
                onClick={requestNotificationPermission}
                disabled={notificationPermission === 'granted'}
                className="w-full"
              >
                {notificationPermission === 'granted' ? '✅ 許可済み' : 
                 notificationPermission === 'denied' ? '❌ 拒否済み' : '通知を有効化'}
              </KidsButton>
            </div>
          </HoverScaleCard>

          {/* キャッシュ管理 */}
          <HoverScaleCard className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🗂️</div>
              <h4 className="font-medium text-gray-800 mb-2">キャッシュ管理</h4>
              <p className="text-sm text-gray-600 mb-4">
                ストレージをクリアして最新データを取得
              </p>
              <KidsButton
                variant="warning"
                size="small"
                onClick={clearCache}
                className="w-full"
              >
                キャッシュクリア
              </KidsButton>
            </div>
          </HoverScaleCard>

          {/* オフライン機能テスト */}
          <HoverScaleCard className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🧪</div>
              <h4 className="font-medium text-gray-800 mb-2">機能テスト</h4>
              <p className="text-sm text-gray-600 mb-4">
                オフライン機能の動作確認
              </p>
              <KidsButton
                variant="secondary"
                size="small"
                onClick={testOfflineFeatures}
                className="w-full"
              >
                テスト実行
              </KidsButton>
            </div>
          </HoverScaleCard>
        </div>
      </KidsCard>

      {/* iOS インストール手順 */}
      {/iPad|iPhone|iPod/.test(navigator.userAgent) && !pwaCapabilities.isInstalled && (
        <KidsCard title="📱 iOS でのインストール" icon="🍎" color="gray">
          <div className="space-y-4">
            <p className="text-gray-700">
              iOSでアプリのように使用するには、以下の手順でホーム画面に追加してください：
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm">Safariの共有ボタン（□↑）をタップ</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm">「ホーム画面に追加」を選択</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm">「追加」をタップして完了</span>
              </div>
            </div>
          </div>
        </KidsCard>
      )}
    </div>
  );
};

export default PWAManager;