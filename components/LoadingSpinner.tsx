import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  showProgress?: boolean;
  progress?: number; // 0-100
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = '読み込み中...',
  showProgress = false,
  progress = 0,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = {
    small: 'space-y-2',
    medium: 'space-y-3',
    large: 'space-y-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      {/* スピナー */}
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* メッセージ */}
      {message && (
        <div className="text-center">
          <p className={`text-gray-600 ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'}`}>
            {message}
          </p>
        </div>
      )}

      {/* プログレスバー */}
      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
};

// AIメッセージ生成専用のローディングコンポーネント
export const AIThinkingLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm">AIが考えています...</span>
    </div>
  );
};

// プロフィール設定用のプログレスステップ
export const StepProgress: React.FC<{
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}> = ({ currentStep, totalSteps, stepLabels = [], className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-8 mx-2 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {stepLabels.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500">
          {stepLabels.map((label, index) => (
            <span key={index} className={index + 1 === currentStep ? 'text-blue-600 font-medium' : ''}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// 学習セッション用の詳細ローディング
export const LearningSessionLoader: React.FC<{
  message?: string;
  stage?: 'initializing' | 'connecting' | 'analyzing' | 'ready';
  className?: string;
}> = ({ 
  message = '学習セッションを準備中...',
  stage = 'initializing',
  className = ''
}) => {
  const stageMessages = {
    initializing: 'AIコーチを起動中...',
    connecting: 'Gemini APIに接続中...',
    analyzing: 'あなたのレベルを分析中...',
    ready: '準備完了！'
  };

  const progress = {
    initializing: 25,
    connecting: 50,
    analyzing: 75,
    ready: 100
  };

  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="animate-bounce mb-4">
        <span className="text-4xl">🤖</span>
      </div>
      <LoadingSpinner 
        size="medium" 
        message={message || stageMessages[stage]}
        showProgress={true}
        progress={progress[stage]}
      />
      <div className="mt-4 text-sm text-gray-500">
        {stage === 'ready' ? '学習を開始します！' : 'しばらくお待ちください...'}
      </div>
    </div>
  );
};

// ネットワークエラー用のローディング
export const NetworkErrorLoader: React.FC<{
  onRetry?: () => void;
  className?: string;
}> = ({ onRetry, className = '' }) => {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="text-4xl mb-4">📡</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        接続エラーが発生しました
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        インターネット接続またはAPIの設定を確認してください
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔄 再試行
        </button>
      )}
    </div>
  );
};

export default LoadingSpinner;