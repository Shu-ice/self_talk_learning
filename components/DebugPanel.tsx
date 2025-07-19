import React, { useState, useEffect } from 'react';

interface DebugPanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

interface DebugInfo {
  timestamp: string;
  userAgent: string;
  url: string;
  localStorage: { [key: string]: string };
  sessionStorage: { [key: string]: string };
  errors: any[];
  apiKeyStatus: string;
  buildTime: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible = false, onToggle }) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [consoleErrors, setConsoleErrors] = useState<any[]>([]);

  useEffect(() => {
    // コンソールエラーをキャプチャ
    const originalConsoleError = console.error;
    console.error = (...args) => {
      setConsoleErrors(prev => [...prev, { timestamp: new Date().toISOString(), args }]);
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      updateDebugInfo();
    }
  }, [isVisible]);

  const updateDebugInfo = () => {
    const localStorageData: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        localStorageData[key] = localStorage.getItem(key)?.substring(0, 100) + '...' || '';
      }
    }

    const sessionStorageData: { [key: string]: string } = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        sessionStorageData[key] = sessionStorage.getItem(key)?.substring(0, 100) + '...' || '';
      }
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKeyStatus = apiKey ? (apiKey === 'your_gemini_api_key_here' ? '未設定' : '設定済み') : '未設定';

    setDebugInfo({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: localStorageData,
      sessionStorage: sessionStorageData,
      errors: consoleErrors,
      apiKeyStatus,
      buildTime: document.querySelector('meta[name="build-time"]')?.getAttribute('content') || '不明'
    });
  };

  const clearStorages = () => {
    localStorage.clear();
    sessionStorage.clear();
    setConsoleErrors([]);
    alert('ストレージとエラーログをクリアしました');
    updateDebugInfo();
  };

  const exportDebugInfo = () => {
    const data = JSON.stringify(debugInfo, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-info-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full text-xs z-50 opacity-50 hover:opacity-100"
        title="デバッグパネルを開く"
      >
        🐛
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm max-h-96 overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">🐛 デバッグパネル</h3>
          <button onClick={onToggle} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        {debugInfo && (
          <div className="space-y-3 text-xs">
            <div>
              <strong>APIキー:</strong> 
              <span className={debugInfo.apiKeyStatus === '設定済み' ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.apiKeyStatus}
              </span>
            </div>
            
            <div>
              <strong>エラー数:</strong> 
              <span className={debugInfo.errors.length > 0 ? 'text-red-600' : 'text-green-600'}>
                {debugInfo.errors.length}
              </span>
            </div>
            
            <div>
              <strong>localStorage:</strong> {Object.keys(debugInfo.localStorage).length}件
            </div>
            
            <div>
              <strong>URL:</strong>
              <div className="text-blue-600 break-all">{debugInfo.url}</div>
            </div>
            
            {debugInfo.errors.length > 0 && (
              <div>
                <strong>最新エラー:</strong>
                <div className="text-red-600 break-all max-h-20 overflow-y-auto">
                  {debugInfo.errors[debugInfo.errors.length - 1]?.args.join(' ')}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 pt-2 border-t">
              <button
                onClick={updateDebugInfo}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                更新
              </button>
              <button
                onClick={clearStorages}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                クリア
              </button>
              <button
                onClick={exportDebugInfo}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                エクスポート
              </button>
            </div>
            
            <div className="text-gray-500">
              更新: {debugInfo.timestamp.split('T')[1].split('.')[0]}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DebugPanel;