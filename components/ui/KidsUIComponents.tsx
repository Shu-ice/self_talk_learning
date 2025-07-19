// 小学生向け専用UIコンポーネント
// 認知特性を考慮した使いやすく楽しいインターフェース

import React, { useState, useEffect } from 'react';

// 小学生向けボタンコンポーネント
interface KidsButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'fun';
  size?: 'small' | 'medium' | 'large' | 'xl';
  disabled?: boolean;
  icon?: string;
  sound?: boolean;
  animation?: boolean;
  className?: string;
}

export const KidsButton: React.FC<KidsButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'large',
  disabled = false,
  icon,
  sound = true,
  animation = true,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsPressed(true);
    setShowRipple(true);
    
    // 音声フィードバック（ブラウザ対応時）
    if (sound && 'speechSynthesis' in window) {
      // 短いポジティブな音の代わりに音声で代用
      const utterance = new SpeechSynthesisUtterance('ピッ');
      utterance.volume = 0.1;
      utterance.rate = 2;
      speechSynthesis.speak(utterance);
    }
    
    onClick();
    
    setTimeout(() => {
      setIsPressed(false);
      setShowRipple(false);
    }, 150);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'px-4 py-2 text-sm min-h-[40px] min-w-[80px]';
      case 'medium': return 'px-6 py-3 text-base min-h-[48px] min-w-[120px]';
      case 'large': return 'px-8 py-4 text-lg min-h-[56px] min-w-[160px]';
      case 'xl': return 'px-10 py-6 text-xl min-h-[64px] min-w-[200px]';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white shadow-lg';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 shadow-md';
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-lg';
      case 'warning':
        return 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white shadow-lg';
      case 'fun':
        return 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg';
    }
  };

  const animationClasses = animation ? 
    `transform transition-all duration-150 ${isPressed ? 'scale-95' : 'scale-100'} hover:scale-105 active:scale-95` : 
    '';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl font-bold
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${animationClasses}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-4 focus:ring-blue-300
        select-none touch-manipulation
        ${className}
      `}
    >
      {/* リップルエフェクト */}
      {showRipple && (
        <span className="absolute inset-0 bg-white opacity-30 rounded-2xl animate-ping"></span>
      )}
      
      {/* コンテンツ */}
      <span className="relative flex items-center justify-center space-x-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <span>{children}</span>
      </span>
    </button>
  );
};

// 小学生向けカードコンポーネント
interface KidsCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const KidsCard: React.FC<KidsCardProps> = ({
  children,
  title,
  icon,
  color = 'blue',
  clickable = false,
  onClick,
  className = ''
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200';
      case 'green': return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200';
      case 'purple': return 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200';
      case 'orange': return 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200';
      case 'pink': return 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200';
    }
  };

  return (
    <div
      className={`
        rounded-3xl border-2 p-6 shadow-lg
        ${getColorClasses()}
        ${clickable ? 'cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-200' : ''}
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
    >
      {title && (
        <div className="flex items-center space-x-3 mb-4">
          {icon && <span className="text-3xl">{icon}</span>}
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

// 進捗バー（小学生向け）
interface KidsProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const KidsProgressBar: React.FC<KidsProgressBarProps> = ({
  progress,
  label,
  color = 'blue',
  showPercentage = true,
  animated = true,
  size = 'medium'
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'h-2';
      case 'medium': return 'h-4';
      case 'large': return 'h-6';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-600">{Math.round(displayProgress)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${getSizeClasses()}`}>
        <div
          className={`${getColorClasses()} ${getSizeClasses()} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${Math.min(displayProgress, 100)}%` }}
        >
          {/* 輝きエフェクト */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// 成功・エラーメッセージ（小学生向け）
interface KidsMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  icon?: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const KidsMessage: React.FC<KidsMessageProps> = ({
  type,
  message,
  icon,
  onClose,
  autoHide = true,
  duration = 3000
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onClose]);

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'info':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'success': return '🎉';
      case 'error': return '😅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
    }
  };

  if (!visible) return null;

  return (
    <div className={`
      fixed top-4 right-4 max-w-sm p-4 rounded-2xl border-2 shadow-lg z-50
      transform transition-all duration-300 ease-out
      ${getTypeClasses()}
    `}>
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon || getDefaultIcon()}</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// 学習セッション開始ボタン
interface StudyStartButtonProps {
  subjectName: string;
  topicName: string;
  onStart: () => void;
  disabled?: boolean;
  estimatedTime?: number;
}

export const StudyStartButton: React.FC<StudyStartButtonProps> = ({
  subjectName,
  topicName,
  onStart,
  disabled = false,
  estimatedTime
}) => {
  return (
    <KidsCard color="blue" className="text-center">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-blue-800">{subjectName}</h3>
          <p className="text-lg text-blue-600">{topicName}</p>
          {estimatedTime && (
            <p className="text-sm text-gray-600">
              ⏱️ 約{estimatedTime}分で完了
            </p>
          )}
        </div>
        
        <KidsButton
          variant="primary"
          size="xl"
          icon="🚀"
          onClick={onStart}
          disabled={disabled}
          animation={true}
        >
          学習を始める！
        </KidsButton>
      </div>
    </KidsCard>
  );
};

// 褒め言葉表示コンポーネント
interface KidsPraiseProps {
  achievement: string;
  points?: number;
  onContinue: () => void;
}

export const KidsPraise: React.FC<KidsPraiseProps> = ({
  achievement,
  points,
  onContinue
}) => {
  const praises = [
    '素晴らしい！',
    'よくできました！',
    'すごいね！',
    'パーフェクト！',
    'その調子！'
  ];
  
  const randomPraise = praises[Math.floor(Math.random() * praises.length)];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <KidsCard color="green" className="text-center max-w-md mx-4">
        <div className="space-y-6">
          <div className="text-6xl animate-bounce">🎉</div>
          
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">
              {randomPraise}
            </h2>
            <p className="text-lg text-green-700">{achievement}</p>
            {points && (
              <div className="mt-3">
                <span className="inline-block bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full font-bold">
                  +{points} ポイント獲得！
                </span>
              </div>
            )}
          </div>
          
          <KidsButton
            variant="success"
            size="large"
            icon="👍"
            onClick={onContinue}
          >
            続ける
          </KidsButton>
        </div>
      </KidsCard>
    </div>
  );
};

// 休憩提案コンポーネント
interface KidsBreakSuggestionProps {
  studyTime: number; // 分
  onTakeBreak: () => void;
  onContinue: () => void;
}

export const KidsBreakSuggestion: React.FC<KidsBreakSuggestionProps> = ({
  studyTime,
  onTakeBreak,
  onContinue
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <KidsCard color="orange" className="text-center max-w-md mx-4">
        <div className="space-y-6">
          <div className="text-6xl">😊</div>
          
          <div>
            <h2 className="text-2xl font-bold text-orange-800 mb-2">
              お疲れ様！
            </h2>
            <p className="text-lg text-orange-700">
              {studyTime}分間よく頑張りました！<br />
              少し休憩しませんか？
            </p>
          </div>
          
          <div className="flex space-x-4">
            <KidsButton
              variant="warning"
              size="medium"
              icon="☕"
              onClick={onTakeBreak}
            >
              休憩する
            </KidsButton>
            
            <KidsButton
              variant="secondary"
              size="medium"
              icon="💪"
              onClick={onContinue}
            >
              続ける
            </KidsButton>
          </div>
        </div>
      </KidsCard>
    </div>
  );
};