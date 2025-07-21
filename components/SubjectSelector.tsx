
import React from 'react';
import { Subject, Topic } from '../types';
import { SUBJECTS_DATA } from '../constants';
import { KidsButton, KidsCard, StudyStartButton } from './ui/KidsUIComponents';
import HierarchicalSubjectSelector from './HierarchicalSubjectSelector';
import ImprovedHierarchicalSelector from './ImprovedHierarchicalSelector';
import HierarchicalDropdownSelector from './HierarchicalDropdownSelector';
import EnhancedHierarchicalDropdown from './EnhancedHierarchicalDropdown';
import MiddleSchoolExamDropdown from './MiddleSchoolExamDropdown';
import EliteSchoolExamDropdown from './EliteSchoolExamDropdown';
import FavoriteTopics from './FavoriteTopics';
import ProgressVisualization from './ProgressVisualization';

interface SubjectSelectorProps {
  onStartLearning: (subject: Subject, topic: Topic) => void;
  disabled: boolean;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onStartLearning, disabled }) => {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>(SUBJECTS_DATA[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = React.useState<string>(SUBJECTS_DATA[0]?.topics[0]?.id || '');
  const [showHierarchical, setShowHierarchical] = React.useState<boolean>(false);
  const [showDropdownMode, setShowDropdownMode] = React.useState<boolean>(true);
  const [showEliteMode, setShowEliteMode] = React.useState<boolean>(false);
  const [showFavorites, setShowFavorites] = React.useState<boolean>(true);
  const [showProgress, setShowProgress] = React.useState<boolean>(false);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubjectId = event.target.value;
    setSelectedSubjectId(newSubjectId);
    const subject = SUBJECTS_DATA.find(s => s.id === newSubjectId);
    if (subject && subject.topics.length > 0) {
      setSelectedTopicId(subject.topics[0].id);
    } else {
      setSelectedTopicId('');
    }
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopicId(event.target.value);
  };

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    console.log('学習開始ボタンが押されました', { selectedSubjectId, selectedTopicId });
    const subject = SUBJECTS_DATA.find(s => s.id === selectedSubjectId);
    const topic = subject?.topics.find(t => t.id === selectedTopicId);
    console.log('見つけた教科:', subject, 'トピック:', topic);
    if (subject && topic) {
      console.log('onStartLearning を呼び出します');
      onStartLearning(subject, topic);
    } else {
      console.error('教科またはトピックが見つかりません');
    }
  };

  const currentSubject = SUBJECTS_DATA.find(s => s.id === selectedSubjectId);

  // 選択されたトピックの予想学習時間を計算
  const selectedTopic = currentSubject?.topics.find(t => t.id === selectedTopicId);
  const estimatedTime = selectedTopic ? 30 : undefined; // 基本30分に設定

  // お気に入りトピック選択ハンドラー
  const handleFavoriteTopicSelect = (topicId: string) => {
    // トピックIDから該当する教科とトピックを探す
    for (const subject of SUBJECTS_DATA) {
      const topic = subject.topics.find(t => t.id === topicId);
      if (topic) {
        setSelectedSubjectId(subject.id);
        setSelectedTopicId(topic.id);
        handleSubmit(); // 直接学習開始
        return;
      }
    }
  };

  // サンプル進捗データ（実際のアプリでは実際のデータを使用）
  const sampleProgressData = [
    {
      subject: '算数',
      totalTopics: 120,
      completedTopics: 45,
      currentStreak: 7,
      totalStudyTime: 1260,
      averageScore: 78
    },
    {
      subject: '国語',
      totalTopics: 80,
      completedTopics: 23,
      currentStreak: 3,
      totalStudyTime: 680,
      averageScore: 72
    },
    {
      subject: '理科',
      totalTopics: 90,
      completedTopics: 34,
      currentStreak: 5,
      totalStudyTime: 920,
      averageScore: 81
    },
    {
      subject: '社会',
      totalTopics: 75,
      completedTopics: 18,
      currentStreak: 2,
      totalStudyTime: 540,
      averageScore: 69
    }
  ];

  // 算数が選択されて階層表示モードの場合
  if (selectedSubjectId === 'math' && showHierarchical) {
    return <ImprovedHierarchicalSelector onStartLearning={onStartLearning} disabled={disabled} />;
  }

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-sky-500 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
          <h2 className="text-3xl font-bold">🚀 今日は何を勉強する？</h2>
        </div>
        <p className="text-lg text-slate-600">教科を選んで、楽しく学習を始めよう！</p>
      </div>

      {/* タブナビゲーション */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowFavorites(true);
                setShowProgress(false);
                setShowDropdownMode(true);
                setShowEliteMode(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showFavorites && !showProgress && showDropdownMode && !showEliteMode
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎓 標準受験
            </button>
            <button
              onClick={() => {
                setShowFavorites(true);
                setShowProgress(false);
                setShowDropdownMode(true);
                setShowEliteMode(true);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showFavorites && !showProgress && showDropdownMode && showEliteMode
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👑 最難関対応
            </button>
            <button
              onClick={() => {
                setShowFavorites(true);
                setShowProgress(false);
                setShowDropdownMode(false);
                setShowEliteMode(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showFavorites && !showProgress && !showDropdownMode && !showEliteMode
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 カード選択
            </button>
            <button
              onClick={() => {
                setShowFavorites(false);
                setShowProgress(true);
                setShowEliteMode(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showProgress
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 学習進捗
            </button>
          </div>
        </div>
      </div>

      {/* 進捗表示モード */}
      {showProgress && (
        <ProgressVisualization 
          progressData={sampleProgressData}
          className="mb-6"
        />
      )}

      {/* 標準中学受験対応ドロップダウン選択モード */}
      {showFavorites && !showProgress && showDropdownMode && !showEliteMode && (
        <MiddleSchoolExamDropdown
          onStartLearning={onStartLearning}
          disabled={disabled}
          className="mb-6"
        />
      )}

      {/* 最難関中学受験対応 - 修正版コンポーネント */}
      {showFavorites && !showProgress && showDropdownMode && showEliteMode && (
        <EliteSchoolExamDropdown
          onStartLearning={onStartLearning}
          disabled={disabled}
          className="mb-6"
        />
      )}

      {/* お気に入り・最近の学習 */}
      {showFavorites && !showProgress && !showDropdownMode && !showEliteMode && (
        <FavoriteTopics 
          onTopicSelect={handleFavoriteTopicSelect}
          className="mb-6"
        />
      )}

      {/* 教科選択カード（カード選択モードのみ表示） */}
      {showFavorites && !showProgress && !showDropdownMode && !showEliteMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBJECTS_DATA.map(subject => {
          const isSelected = selectedSubjectId === subject.id;
          const subjectData = {
            'math': { emoji: '🧮', color: 'from-blue-400 to-blue-600', description: '数字と図形の世界へ' },
            'japanese': { emoji: '📖', color: 'from-red-400 to-red-600', description: '言葉の力を身につけよう' },
            'social': { emoji: '🌏', color: 'from-green-400 to-green-600', description: '世界と歴史を学ぼう' },
            'science': { emoji: '🔬', color: 'from-purple-400 to-purple-600', description: '科学の不思議を発見' }
          };
          const data = subjectData[subject.id as keyof typeof subjectData] || { emoji: '📖', color: 'from-gray-400 to-gray-600', description: '新しい知識を学ぼう' };
          
          return (
            <div
              key={subject.id}
              onClick={() => {
                setSelectedSubjectId(subject.id);
                if (subject.topics.length > 0) {
                  setSelectedTopicId(subject.topics[0].id);
                }
              }}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                isSelected ? 'scale-105' : ''
              }`}
            >
              <div className={`relative bg-gradient-to-br ${data.color} rounded-2xl p-6 shadow-lg group-hover:shadow-xl ${
                isSelected ? 'ring-4 ring-yellow-400 shadow-2xl' : ''
              }`}>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    選択中
                  </div>
                )}
                
                <div className="text-center text-white">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">{data.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-sm opacity-90 mb-3">{data.description}</p>
                  <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {subject.topics.length}個の単元
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* 算数の場合は階層選択モード切り替えボタンを表示（カード選択モードのみ） */}
      {showFavorites && !showProgress && !showDropdownMode && !showEliteMode && selectedSubjectId === 'math' && (
        <div className="text-center">
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              {showHierarchical ? '通常モード' : '体系的学習モード（おすすめ！）'}
            </h3>
            <p className="text-yellow-700 mb-4">
              {showHierarchical 
                ? '従来の単元選択に戻って学習することもできます' 
                : '大単元→中単元→小単元の順で体系的に学習内容を選べます'}
            </p>
            <KidsButton
              onClick={() => setShowHierarchical(!showHierarchical)}
              variant={showHierarchical ? "secondary" : "fun"}
              size="large"
              icon={showHierarchical ? "📝" : "🗂️"}
              animation={true}
            >
              {showHierarchical ? '通常の単元選択に戻る' : '体系的に選ぶ（おすすめ！）'}
            </KidsButton>
          </div>
        </div>
      )}

      {/* 単元選択（カード選択モードのみ） */}
      {showFavorites && !showProgress && !showDropdownMode && !showEliteMode && currentSubject && (
        <KidsCard title="単元を選ぼう" icon="📝" color="green" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentSubject.topics.map(topic => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <KidsButton
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="medium"
                  disabled={disabled}
                  className={`text-left justify-start ${
                    isSelected ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  {topic.name}
                </KidsButton>
              );
            })}
          </div>
        </KidsCard>
      )}

      {/* 学習開始ボタン（カード選択モードのみ） */}
      {showFavorites && !showProgress && !showDropdownMode && !showEliteMode && selectedSubjectId && selectedTopicId && currentSubject && selectedTopic && (
        <StudyStartButton
          subjectName={currentSubject.name}
          topicName={selectedTopic.name}
          estimatedTime={estimatedTime}
          disabled={disabled}
          onStart={handleSubmit}
        />
      )}
    </div>
  );
};

export default SubjectSelector;
