import React, { useState, useEffect } from 'react';
import { KidsButton, KidsCard } from './ui/KidsUIComponents';

interface FavoriteTopic {
  id: string;
  name: string;
  subject: string;
  difficulty: number;
  estimatedHours: number;
  lastStudied?: Date;
}

interface FavoriteTopicsProps {
  onTopicSelect: (topicId: string) => void;
  className?: string;
}

const FavoriteTopics: React.FC<FavoriteTopicsProps> = ({ onTopicSelect, className = '' }) => {
  const [favorites, setFavorites] = useState<FavoriteTopic[]>([]);
  const [recentTopics, setRecentTopics] = useState<FavoriteTopic[]>([]);

  useEffect(() => {
    // ローカルストレージからお気に入りと最近の学習を読み込み
    const storedFavorites = localStorage.getItem('favorite_topics');
    const storedRecent = localStorage.getItem('recent_studied_topics');
    
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    if (storedRecent) {
      const recentData = JSON.parse(storedRecent).map((topic: any) => ({
        ...topic,
        lastStudied: new Date(topic.lastStudied)
      }));
      setRecentTopics(recentData);
    }
  }, []);

  const addToFavorites = (topic: FavoriteTopic) => {
    const newFavorites = [...favorites, topic];
    setFavorites(newFavorites);
    localStorage.setItem('favorite_topics', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (topicId: string) => {
    const newFavorites = favorites.filter(topic => topic.id !== topicId);
    setFavorites(newFavorites);
    localStorage.setItem('favorite_topics', JSON.stringify(newFavorites));
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-blue-500';
    if (difficulty <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 3) return '基礎';
    if (difficulty <= 6) return '標準';
    if (difficulty <= 8) return '応用';
    return '発展';
  };

  const formatLastStudied = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  const renderTopicCard = (topic: FavoriteTopic, isFavorite: boolean = false) => {
    const difficultyColor = getDifficultyColor(topic.difficulty);
    
    return (
      <div
        key={topic.id}
        onClick={() => onTopicSelect(topic.id)}
        className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-md group"
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-800 group-hover:text-blue-600 flex-1">
            {topic.name}
          </h4>
          {isFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromFavorites(topic.id);
              }}
              className="text-yellow-500 hover:text-yellow-600 ml-2"
            >
              ⭐
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-white text-xs ${difficultyColor}`}>
              {getDifficultyLabel(topic.difficulty)}
            </span>
            <span className="text-xs text-gray-500">
              {topic.estimatedHours}時間
            </span>
          </div>
          
          {topic.lastStudied && (
            <span className="text-xs text-gray-400">
              {formatLastStudied(topic.lastStudied)}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (favorites.length === 0 && recentTopics.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* お気に入り */}
      {favorites.length > 0 && (
        <KidsCard title="⭐ お気に入りの単元" icon="💖" color="yellow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map(topic => renderTopicCard(topic, true))}
          </div>
        </KidsCard>
      )}

      {/* 最近の学習 */}
      {recentTopics.length > 0 && (
        <KidsCard title="📚 最近学習した単元" icon="🕒" color="blue">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTopics.slice(0, 6).map(topic => renderTopicCard(topic))}
          </div>
        </KidsCard>
      )}
    </div>
  );
};

export default FavoriteTopics;