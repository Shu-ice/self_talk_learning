import React, { useState, useEffect, useRef } from 'react';

/**
 * 🎨 最先端マイクロインタラクション・コンポーネント集
 * 学習体験を劇的に向上させる細かな操作感・反応性の実装
 */

// アニメーション用ホック
export const useSpringAnimation = (trigger: boolean, duration: number = 300) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);
  
  return isAnimating;
};

// 成功アニメーション付きボタン
export const SuccessAnimatedButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  successMessage?: string;
}> = ({ children, onClick, className = '', successMessage = '完了!' }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = async () => {
    setIsClicked(true);
    
    // クリック波紋効果
    setTimeout(() => setIsClicked(false), 200);
    
    // 実際の処理実行
    await onClick();
    
    // 成功アニメーション
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative overflow-hidden transition-all duration-300 transform
        ${isClicked ? 'scale-95' : 'scale-100'}
        ${isSuccess ? 'bg-green-500 text-white' : ''}
        ${className}
      `}
      disabled={isSuccess}
    >
      {/* 波紋効果 */}
      {isClicked && (
        <div className="absolute inset-0 bg-white opacity-30 animate-ping rounded-full" />
      )}
      
      {/* コンテンツ */}
      <span className={`transition-opacity duration-300 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {/* 成功メッセージ */}
      {isSuccess && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-bounce">✅ {successMessage}</span>
        </span>
      )}
    </button>
  );
};

// プログレス付きローディング
export const AnimatedProgress: React.FC<{
  progress: number;
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  animated?: boolean;
}> = ({ 
  progress, 
  label, 
  color = 'blue', 
  showPercentage = true,
  animated = true 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  
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

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(displayProgress)}%</span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${colorClasses[color]}`}
          style={{ width: `${displayProgress}%` }}
        >
          {/* シマー効果 */}
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
          
          {/* 光る効果 */}
          {displayProgress > 0 && (
            <div className="absolute right-0 top-0 w-4 h-full bg-white opacity-60 blur-sm animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

// ホバー時拡大カード
export const HoverScaleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  clickScale?: number;
  onClick?: () => void;
}> = ({ 
  children, 
  className = '', 
  hoverScale = 1.05, 
  clickScale = 0.98,
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    onClick?.();
  };

  return (
    <div
      className={`
        transition-all duration-300 cursor-pointer
        ${className}
      `}
      style={{
        transform: `scale(${isClicked ? clickScale : isHovered ? hoverScale : 1})`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

// フローティングアクションボタン
export const FloatingActionButton: React.FC<{
  icon: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'blue' | 'green' | 'purple' | 'red';
  tooltip?: string;
  pulse?: boolean;
}> = ({ 
  icon, 
  onClick, 
  position = 'bottom-right',
  color = 'blue',
  tooltip,
  pulse = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    red: 'bg-red-500 hover:bg-red-600'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* ツールチップ */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
      
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-14 h-14 rounded-full text-white shadow-lg text-xl
          transition-all duration-300 transform hover:scale-110 active:scale-95
          ${colorClasses[color]}
          ${pulse ? 'animate-pulse' : ''}
        `}
      >
        {icon}
        
        {/* 波紋効果 */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
      </button>
    </div>
  );
};

// 満足度スマイリーレーティング
export const SmileyRating: React.FC<{
  value: number;
  onChange: (value: number) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}> = ({ value, onChange, size = 'medium', disabled = false }) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const smileys = ['😢', '😞', '😐', '😊', '😍'];
  const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-purple-500'];
  
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div className="flex space-x-2 justify-center">
      {smileys.map((smiley, index) => {
        const rating = index + 1;
        const isActive = rating <= (hoverValue || value);
        
        return (
          <button
            key={index}
            className={`
              transition-all duration-200 transform
              ${sizeClasses[size]}
              ${isActive ? colors[index] + ' scale-110' : 'text-gray-300 scale-100'}
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-125'}
            `}
            onClick={() => !disabled && onChange(rating)}
            onMouseEnter={() => !disabled && setHoverValue(rating)}
            onMouseLeave={() => !disabled && setHoverValue(0)}
            disabled={disabled}
          >
            {smiley}
          </button>
        );
      })}
    </div>
  );
};

// パーティクル効果背景
export const ParticleBackground: React.FC<{
  particleCount?: number;
  color?: string;
  speed?: number;
}> = ({ particleCount = 20, color = '#3B82F6', speed = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // パーティクル初期化
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        // 移動
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 境界で跳ね返り
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // 描画
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// 成果発表アニメーション
export const AchievementToast: React.FC<{
  achievement: {
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClose: () => void;
  duration?: number;
}> = ({ achievement, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 入場アニメーション
    setTimeout(() => setIsVisible(true), 100);
    
    // 自動閉じる
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  };

  const rarityEffects = {
    common: '',
    rare: 'animate-pulse',
    epic: 'animate-bounce',
    legendary: 'animate-ping'
  };

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 max-w-sm
        transform transition-all duration-500
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        bg-gradient-to-r ${rarityColors[achievement.rarity]} 
        text-white rounded-xl p-6 shadow-2xl
        ${rarityEffects[achievement.rarity]}
      `}>
        {/* 背景エフェクト */}
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-30 rounded-xl animate-pulse" />
        )}
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-4xl">{achievement.icon}</span>
            <div>
              <h3 className="font-bold text-lg">🎉 新しい実績!</h3>
              <p className="text-sm opacity-90">{achievement.title}</p>
            </div>
            <button 
              onClick={() => {
                setIsExiting(true);
                setTimeout(onClose, 300);
              }}
              className="text-white hover:text-gray-200 ml-auto"
            >
              ✕
            </button>
          </div>
          
          <p className="text-sm opacity-90">{achievement.description}</p>
          
          {/* レアリティ表示 */}
          <div className="mt-3 text-xs opacity-75">
            {achievement.rarity === 'legendary' && '✨ 伝説の実績 ✨'}
            {achievement.rarity === 'epic' && '💜 エピック実績'}
            {achievement.rarity === 'rare' && '💎 レア実績'}
            {achievement.rarity === 'common' && '🥉 通常実績'}
          </div>
        </div>
      </div>
    </div>
  );
};

// インタラクティブな難易度調整スライダー
export const DifficultySlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}> = ({ value, onChange, min = 1, max = 10, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !disabled) {
      updateValue(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const getDifficultyColor = (level: number): string => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    if (level <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDifficultyLabel = (level: number): string => {
    if (level <= 3) return '簡単';
    if (level <= 6) return '普通';
    if (level <= 8) return '難しい';
    return '超難しい';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">難易度</span>
        <span className={`text-sm font-semibold px-2 py-1 rounded text-white ${getDifficultyColor(value)}`}>
          {value} - {getDifficultyLabel(value)}
        </span>
      </div>
      
      <div
        ref={sliderRef}
        className="relative h-6 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* バックグラウンドグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-400 rounded-full opacity-50" />
        
        {/* 進捗バー */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-200 ${getDifficultyColor(value)}`}
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        
        {/* スライダーハンドル */}
        <div
          className={`
            absolute top-1/2 transform -translate-y-1/2 w-8 h-8 
            bg-white border-4 ${getDifficultyColor(value).replace('bg-', 'border-')} 
            rounded-full shadow-lg cursor-grab
            ${isDragging ? 'scale-110 cursor-grabbing' : 'scale-100'}
            transition-transform duration-200
          `}
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 1rem)` }}
        >
          {/* ハンドル内の難易度表示 */}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {value}
          </div>
        </div>
        
        {/* 目盛り */}
        <div className="absolute inset-x-0 top-full mt-2 flex justify-between text-xs text-gray-500">
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <span key={i}>{min + i}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 学習完了時の花火エフェクト
export const FireworksEffect: React.FC<{
  trigger: boolean;
  duration?: number;
}> = ({ trigger, duration = 3000 }) => {
  const [particles, setParticles] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger) {
      // 花火パーティクル生成
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2000
      }));
      
      setParticles(newParticles);
      
      // 自動クリア
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (particles.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

export default {
  SuccessAnimatedButton,
  AnimatedProgress,
  HoverScaleCard,
  FloatingActionButton,
  SmileyRating,
  ParticleBackground,
  AchievementToast,
  DifficultySlider,
  FireworksEffect,
  useSpringAnimation
};