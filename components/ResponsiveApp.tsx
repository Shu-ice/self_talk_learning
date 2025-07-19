import React, { useState, useEffect } from 'react';
import { deviceDetector, responsiveUIAdapter, DeviceType } from '../utils/responsiveUtils';
import { deviceSyncService } from '../services/deviceSyncService';

// レスポンシブナビゲーションコンポーネント
interface ResponsiveNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isSessionActive: boolean;
  deviceType: DeviceType;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({ 
  currentView, 
  onViewChange, 
  isSessionActive,
  deviceType 
}) => {
  const navConfig = responsiveUIAdapter.adaptNavigation();
  
  const navigationItems = [
    { id: 'learn', label: '学習', icon: '📚', disabled: isSessionActive },
    { id: 'dashboard', label: '進捗', icon: '📊', disabled: isSessionActive },
    { id: 'recordings', label: '録画', icon: '📹', disabled: isSessionActive },
    { id: 'profile', label: '設定', icon: '⚙️', disabled: isSessionActive }
  ];

  const NavButton = ({ item }: { item: any }) => (
    <button
      onClick={() => onViewChange(item.id)}
      disabled={item.disabled}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-colors
        ${currentView === item.id 
          ? 'bg-sky-600 text-white' 
          : 'bg-white text-sky-600 hover:bg-sky-50'
        }
        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ 
        minHeight: deviceType === 'mobile' ? '60px' : '48px',
        fontSize: navConfig.iconSize 
      }}
    >
      <span className="text-xl">{item.icon}</span>
      {navConfig.showLabels && (
        <span className="text-xs mt-1">{item.label}</span>
      )}
    </button>
  );

  if (navConfig.layout === 'bottom-tabs') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          {navigationItems.map(item => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  if (navConfig.layout === 'side-drawer') {
    return (
      <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-slate-200 z-40 flex flex-col py-4">
        <div className="space-y-4">
          {navigationItems.map(item => (
            <div key={item.id} className="px-2">
              <NavButton item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // top-bar layout
  return (
    <div className="flex justify-center space-x-4 mb-4">
      {navigationItems.map(item => (
        <NavButton key={item.id} item={item} />
      ))}
    </div>
  );
};

// デバイス同期ステータス表示
const SyncStatusIndicator: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(deviceSyncService.isDeviceOnline());

  useEffect(() => {
    // 同期ステータスの監視
    deviceSyncService.on('sync-started', (data: any) => {
      setSyncStatus({ status: 'syncing', type: data.type });
    });

    deviceSyncService.on('sync-completed', (data: any) => {
      setSyncStatus({ status: 'completed', type: data.type });
      setTimeout(() => setSyncStatus(null), 3000);
    });

    deviceSyncService.on('sync-failed', (data: any) => {
      setSyncStatus({ status: 'failed', error: data.error });
    });

    deviceSyncService.on('network-status-changed', (data: any) => {
      setIsOnline(data.online);
    });

    return () => {
      // クリーンアップは必要に応じて実装
    };
  }, []);

  if (!syncStatus && isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        px-3 py-2 rounded-lg text-sm font-medium shadow-lg
        ${!isOnline ? 'bg-orange-500 text-white' :
          syncStatus?.status === 'syncing' ? 'bg-blue-500 text-white' :
          syncStatus?.status === 'completed' ? 'bg-green-500 text-white' :
          syncStatus?.status === 'failed' ? 'bg-red-500 text-white' :
          'bg-gray-500 text-white'
        }
      `}>
        {!isOnline ? (
          <div className="flex items-center space-x-2">
            <span>🔌</span>
            <span>オフライン</span>
          </div>
        ) : syncStatus?.status === 'syncing' ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full\"></div>
            <span>同期中...</span>
          </div>
        ) : syncStatus?.status === 'completed' ? (
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span>同期完了</span>
          </div>
        ) : syncStatus?.status === 'failed' ? (
          <div className="flex items-center space-x-2">
            <span>❌</span>
            <span>同期失敗</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// PWAインストールプロンプト
const PWAInstallPrompt: React.FC = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallPrompt || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">アプリをインストール</h3>
          <p className="text-xs text-sky-100 mt-1">
            オフラインでも学習できるようになります
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleInstall}
            className="bg-white text-sky-600 px-3 py-1 rounded text-sm font-medium hover:bg-sky-50"
          >
            インストール
          </button>
          <button
            onClick={handleDismiss}
            className="text-sky-100 hover:text-white px-2 py-1 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// デバイス最適化コンテナ
interface ResponsiveContainerProps {
  children: React.ReactNode;
  deviceType: DeviceType;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, deviceType }) => {
  const navConfig = responsiveUIAdapter.adaptNavigation();
  
  const getContainerClasses = () => {
    const baseClasses = "min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100";
    
    switch (deviceType) {
      case 'mobile':
        return `${baseClasses} pb-20`; // bottom navigationのためのpadding
      case 'tablet':
        return navConfig.layout === 'side-drawer' 
          ? `${baseClasses} pl-20` 
          : `${baseClasses} pb-20`;
      case 'desktop':
      default:
        return baseClasses;
    }
  };

  const getContentClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return "px-4 py-4";
      case 'tablet':
        return "px-6 py-6";
      case 'desktop':
      default:
        return "px-8 py-8";
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className={`max-w-7xl mx-auto ${getContentClasses()}`}>
        {children}
      </div>
    </div>
  );
};

// メインのレスポンシブアプリラッパー
interface ResponsiveAppWrapperProps {
  children: (deviceInfo: any) => React.ReactNode;
}

const ResponsiveAppWrapper: React.FC<ResponsiveAppWrapperProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState(deviceDetector.getDeviceInfo());
  const [currentView, setCurrentView] = useState('learn');
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    // デバイス情報の変更を監視
    deviceDetector.on('device-changed', (newDeviceInfo: any) => {
      setDeviceInfo(newDeviceInfo);
    });

    deviceDetector.on('orientation-changed', (orientation: any) => {
      setDeviceInfo(prev => ({ ...prev, orientation }));
    });

    // Service Workerの登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      // クリーンアップ
    };
  }, []);

  useEffect(() => {
    // デバイスタイプに応じて高度な機能の表示を調整
    const shouldShowAdvanced = deviceInfo.type === 'desktop' || 
      (deviceInfo.type === 'tablet' && deviceInfo.orientation === 'landscape');
    
    // この状態をApp.tsxに伝える必要がある場合は、propsやcontextを使用
  }, [deviceInfo]);

  return (
    <ResponsiveContainer deviceType={deviceInfo.type}>
      {/* 同期ステータス表示 */}
      <SyncStatusIndicator />
      
      {/* PWAインストールプロンプト */}
      <PWAInstallPrompt />
      
      {/* ナビゲーション */}
      <ResponsiveNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        isSessionActive={isSessionActive}
        deviceType={deviceInfo.type}
      />
      
      {/* メインコンテンツ */}
      {children({ deviceInfo, currentView, setCurrentView, setIsSessionActive })}
    </ResponsiveContainer>
  );
};

export default ResponsiveAppWrapper;