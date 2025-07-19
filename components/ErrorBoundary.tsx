import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-red-600 mb-2">🚨 エラーが発生しました</h1>
              <p className="text-gray-600">アプリケーションの実行中にエラーが発生しました。以下の詳細をご確認ください。</p>
            </div>

            <div className="space-y-4">
              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">エラーメッセージ:</h3>
                <p className="text-red-700 font-mono text-sm">
                  {this.state.error?.message || '不明なエラー'}
                </p>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">スタックトレース:</h3>
                <pre className="text-xs overflow-auto max-h-64 text-gray-700">
                  {this.state.error?.stack || 'スタック情報なし'}
                </pre>
              </div>

              {this.state.errorInfo && (
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">コンポーネントスタック:</h3>
                  <pre className="text-xs overflow-auto max-h-64 text-blue-700">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 text-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 ページを再読み込み
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ データをクリアして再読み込み
              </button>
            </div>

            <div className="mt-4 text-center">
              <details className="text-left">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  🔧 開発者向け情報
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                  <p><strong>UserAgent:</strong> {navigator.userAgent}</p>
                  <p><strong>URL:</strong> {window.location.href}</p>
                  <p><strong>時刻:</strong> {new Date().toISOString()}</p>
                  <p><strong>LocalStorage Keys:</strong> {Object.keys(localStorage).join(', ') || 'なし'}</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;