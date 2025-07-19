import React, { useState, useRef, useEffect } from 'react';
import { HoverScaleCard, SuccessAnimatedButton, AnimatedProgress } from './MicroInteractions';

/**
 * 🎨 強化版キッズUIコンポーネント
 * 最高のユーザー体験を提供する洗練されたコンポーネント群
 */

// 強化版学習開始ボタン
export const EnhancedStudyStartButton: React.FC<{
  subjectName: string;
  topicName: string;
  estimatedTime?: number;
  difficulty?: number;
  onStart: () => Promise<void> | void;
  disabled?: boolean;
  motivationMessage?: string;
}> = ({ 
  subjectName, 
  topicName, 
  estimatedTime, 
  difficulty = 5,
  onStart, 
  disabled = false,
  motivationMessage 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    
    // プログレス演出
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await onStart();
    setIsStarting(false);
    setProgress(0);
  };

  const getDifficultyColor = () => {
    if (difficulty <= 3) return 'from-green-400 to-green-600';
    if (difficulty <= 6) return 'from-blue-400 to-blue-600';
    if (difficulty <= 8) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getDifficultyEmoji = () => {
    if (difficulty <= 3) return '🌱';
    if (difficulty <= 6) return '⚡';
    if (difficulty <= 8) return '🔥';
    return '💎';
  };

  return (
    <div className="relative">
      <HoverScaleCard
        className={`
          bg-gradient-to-r ${getDifficultyColor()} 
          text-white rounded-3xl p-8 shadow-2xl
          border-4 border-white overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        hoverScale={disabled ? 1 : 1.02}
        onClick={disabled ? undefined : handleStart}
      >
        {/* 背景アニメーション */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
        
        {/* キラキラエフェクト */}
        {isHovered && !disabled && (
          <>
            <div className="absolute top-4 right-4 text-white/50 animate-ping">✨</div>
            <div className="absolute bottom-4 left-4 text-white/50 animate-ping delay-150">⭐</div>
            <div className="absolute top-1/2 left-1/2 text-white/30 animate-ping delay-300">💫</div>
          </>
        )}

        <div className="relative z-10">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{getDifficultyEmoji()}</span>
              <div>
                <h3 className="text-2xl font-bold">今すぐ学習開始！</h3>
                <p className="text-sm opacity-90">準備はいいですか？</p>
              </div>
            </div>
            
            {difficulty && (
              <div className="bg-white/20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">難易度: {difficulty}/10</span>
              </div>
            )}
          </div>

          {/* 学習内容 */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📚</span>
              <span className="font-semibold">{subjectName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <span>{topicName}</span>
            </div>
            {estimatedTime && (
              <div className="flex items-center space-x-2">
                <span className="text-lg">⏱️</span>
                <span>予想時間: 約{estimatedTime}分</span>
              </div>
            )}
          </div>

          {/* モチベーションメッセージ */}
          {motivationMessage && (
            <div className="bg-white/20 rounded-xl p-3 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg">💪</span>
                <span className="text-sm">{motivationMessage}</span>
              </div>
            </div>
          )}

          {/* プログレスバー（開始中のみ） */}
          {isStarting && (
            <div className="mb-4">
              <AnimatedProgress 
                progress={progress} 
                color="blue" 
                label="学習準備中..."
              />
            </div>
          )}

          {/* アクションボタン */}
          <SuccessAnimatedButton
            onClick={() => {}} // 親のonClickで処理
            className={`
              w-full py-4 text-xl font-bold rounded-2xl 
              bg-white text-gray-800 hover:bg-gray-100
              shadow-lg transform transition-all duration-200
              ${disabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
            successMessage="開始!"
          >
            {isStarting ? '準備中...' : '学習をスタート！ 🚀'}
          </SuccessAnimatedButton>

          {/* 学習のコツ */}
          <div className="mt-4 text-xs opacity-75 text-center">
            💡 集中して取り組むことで、より効果的な学習ができます
          </div>
        </div>
      </HoverScaleCard>
    </div>
  );
};

// インタラクティブな教科選択カード
export const InteractiveSubjectCard: React.FC<{
  subject: {
    id: string;
    name: string;
    emoji: string;
    description: string;
    topicsCount: number;
    progress?: number;
    difficulty?: number;
  };
  isSelected: boolean;
  onClick: () => void;
  onHover?: (hovering: boolean) => void;
}> = ({ subject, isSelected, onClick, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    // 波紋エフェクト
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // 波紋削除
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
    
    onClick();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-3xl p-6 cursor-pointer
        transition-all duration-300 transform
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-105 shadow-2xl ring-4 ring-yellow-400' 
          : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl'
        }
        ${isHovered ? 'scale-105' : 'scale-100'}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 波紋エフェクト */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
        />
      ))}

      {/* 選択インジケーター */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          選択中！
        </div>
      )}

      {/* 進捗リング */}
      {subject.progress && subject.progress > 0 && (
        <div className="absolute top-4 left-4">
          <svg className="w-8 h-8 transform -rotate-90">
            <circle
              cx="16" cy="16" r="12"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-300"
            />
            <circle
              cx="16" cy="16" r="12"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 12}`}
              strokeDashoffset={`${2 * Math.PI * 12 * (1 - subject.progress / 100)}`}
              className="text-green-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {subject.progress}%
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="text-center">
        {/* 絵文字とホバーアニメーション */}
        <div className={`
          text-6xl mb-4 transition-transform duration-300
          ${isHovered ? 'animate-bounce scale-110' : 'scale-100'}
        `}>
          {subject.emoji}
        </div>

        {/* 教科名 */}
        <h3 className={`
          text-2xl font-bold mb-2 transition-colors duration-300
          ${isSelected ? 'text-white' : 'text-gray-800'}
        `}>
          {subject.name}
        </h3>

        {/* 説明 */}
        <p className={`
          text-sm mb-4 transition-colors duration-300
          ${isSelected ? 'text-white/90' : 'text-gray-600'}
        `}>
          {subject.description}
        </p>

        {/* 統計情報 */}
        <div className="space-y-2">
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${isSelected 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-100 text-gray-700'
            }
          `}>
            {subject.topicsCount}個の単元
          </div>

          {subject.difficulty && (
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-colors duration-300
                    ${i < subject.difficulty 
                      ? (isSelected ? 'bg-white' : 'bg-orange-400')
                      : (isSelected ? 'bg-white/30' : 'bg-gray-300')
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>

        {/* ホバー時の追加情報 */}
        {isHovered && !isSelected && (
          <div className="mt-4 text-xs text-blue-600 animate-fade-in">
            クリックして選択 ✨
          </div>
        )}
      </div>

      {/* 背景装飾 */}
      <div className={`
        absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300
        ${isSelected ? 'from-white to-transparent' : 'from-blue-500 to-purple-500'}
        ${isHovered ? 'opacity-20' : 'opacity-10'}
      `} />
    </div>
  );
};

// 3D効果付きプログレスリング
export const Progress3DRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3B82F6',
  label,
  showPercentage = true,
  animated = true 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      const timer = setInterval(() => {
        setDisplayProgress(prev => {
          if (prev < progress) {
            return Math.min(prev + 2, progress);
          }
          return progress;
        });
      }, 16);
      
      return () => clearInterval(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="relative flex items-center justify-center">
      {/* 3D影効果 */}
      <div 
        className="absolute bg-gray-300 rounded-full blur-md opacity-30"
        style={{
          width: size + 10,
          height: size + 10,
          transform: 'translate(3px, 3px)'
        }}
      />
      
      {/* メインSVG */}
      <svg 
        width={size} 
        height={size} 
        className="relative transform rotate-[-90deg]"
      >
        {/* 背景円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* プログレス円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (displayProgress / 100) * circumference}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
          }}
        />
        
        {/* 光る効果 */}
        {displayProgress > 0 && (
          <circle
            cx={size / 2 + Math.cos((displayProgress / 100) * 2 * Math.PI) * radius}
            cy={size / 2 + Math.sin((displayProgress / 100) * 2 * Math.PI) * radius}
            r={strokeWidth / 2}
            fill="white"
            className="animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
            }}
          />
        )}
      </svg>
      
      {/* 中央のコンテンツ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold" style={{ color }}>
            {Math.round(displayProgress)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-600 text-center mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

// ホログラフィック効果カード
export const HolographicCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className = '', intensity = 0.3 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  const calculateTransform = () => {
    const { x, y } = mousePosition;
    const rotateX = (y - 0.5) * intensity * 30;
    const rotateY = (x - 0.5) * intensity * -30;
    
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const calculateGradient = () => {
    const { x, y } = mousePosition;
    return `radial-gradient(circle at ${x * 100}% ${y * 100}%, 
      rgba(255, 255, 255, 0.8) 0%, 
      rgba(255, 255, 255, 0.2) 25%, 
      transparent 50%)`;
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-300 ${className}`}
      style={{
        transform: isHovered ? calculateTransform() : 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* ホログラフィック光沢 */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{
            background: calculateGradient(),
            mixBlendMode: 'overlay'
          }}
        />
      )}
    </div>
  );
};

// パルス効果付きアイコンボタン
export const PulseIconButton: React.FC<{
  icon: string;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  size?: 'small' | 'medium' | 'large';
  pulse?: boolean;
  tooltip?: string;
  disabled?: boolean;
}> = ({ 
  icon, 
  onClick, 
  color = 'blue', 
  size = 'medium',
  pulse = false,
  tooltip,
  disabled = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white'
  };

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-2xl'
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <div className="relative">
      {/* ツールチップ */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-800" />
        </div>
      )}
      
      <button
        onClick={disabled ? undefined : onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => {
          setShowTooltip(false);
          setIsPressed(false);
        }}
        disabled={disabled}
        className={`
          relative rounded-full shadow-lg transition-all duration-200
          ${sizeClasses[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : colorClasses[color]}
          ${pulse ? 'animate-pulse' : ''}
          ${isPressed ? 'scale-90' : 'scale-100'}
          transform hover:scale-110 active:scale-95
        `}
      >
        {/* 背景パルス効果 */}
        {pulse && !disabled && (
          <div className={`
            absolute inset-0 rounded-full animate-ping opacity-75
            ${colorClasses[color].split(' ')[0]}
          `} />
        )}
        
        {/* アイコン */}
        <span className="relative z-10">{icon}</span>
        
        {/* クリック波紋 */}
        {isPressed && (
          <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping" />
        )}
      </button>
    </div>
  );
};

export {
  EnhancedStudyStartButton,
  InteractiveSubjectCard,
  Progress3DRing,
  HolographicCard,
  PulseIconButton
};