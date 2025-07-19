import React, { useState } from 'react';
import { LearnerProfile, GradeLevel, SchoolLevel, TargetSchool } from '../types';
import { StepProgress } from './LoadingSpinner';

interface ProfileSetupProps {
  onProfileComplete: (profile: LearnerProfile) => void;
  onClose: () => void;
  existingProfile?: LearnerProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileComplete, onClose, existingProfile }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // 基本情報
  const [name, setName] = useState(existingProfile?.name || '');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(existingProfile?.currentGrade || '5th');
  const [targetGrade, setTargetGrade] = useState<GradeLevel>(existingProfile?.targetGrade || '6th');
  const [examDate, setExamDate] = useState(
    existingProfile?.examDate ? existingProfile.examDate.toISOString().split('T')[0] : ''
  );

  // 志望校情報
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>(existingProfile?.schoolLevel || 'standard');
  const [targetSchools, setTargetSchools] = useState<TargetSchool[]>(existingProfile?.targetSchools || []);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolLevel, setNewSchoolLevel] = useState<SchoolLevel>('standard');

  // 学習時間
  const [weekdayHours, setWeekdayHours] = useState(existingProfile?.availableStudyHours.weekday || 2);
  const [weekendHours, setWeekendHours] = useState(existingProfile?.availableStudyHours.weekend || 4);

  // 学習特性
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | 'mixed'>(existingProfile?.learningPreferences.learningStyle || 'mixed');
  const [sessionLength, setSessionLength] = useState<'short' | 'medium' | 'long'>(existingProfile?.learningPreferences.sessionLength || 'medium');
  const [preferredDifficulty, setPreferredDifficulty] = useState<'gradual' | 'challenging' | 'mixed'>(existingProfile?.learningPreferences.preferredDifficulty || 'gradual');
  const [motivationType, setMotivationType] = useState<'achievement' | 'progress' | 'competition' | 'exploration'>(existingProfile?.learningPreferences.motivationType || 'progress');

  // 教科別レベル
  const [subjectLevels, setSubjectLevels] = useState(existingProfile?.subjectLevels || {
    math: { currentLevel: 5, targetLevel: 8, strengths: [], weaknesses: [] },
    japanese: { currentLevel: 5, targetLevel: 8, strengths: [], weaknesses: [] },
    science: { currentLevel: 5, targetLevel: 8, strengths: [], weaknesses: [] },
    social: { currentLevel: 5, targetLevel: 8, strengths: [], weaknesses: [] }
  });

  const addTargetSchool = () => {
    if (newSchoolName.trim()) {
      const newSchool: TargetSchool = {
        id: `school_${Date.now()}`,
        name: newSchoolName,
        level: newSchoolLevel,
        location: '',
        examDate: new Date(examDate),
        requiredSubjects: ['math', 'japanese', 'science', 'social'],
        examStyle: {
          hasInterview: true,
          hasEssay: false,
          hasGroupDiscussion: false,
          specialRequirements: []
        },
        pastExamTrends: {
          frequentTopics: {},
          difficultyTrend: 'stable',
          uniqueFeatures: []
        },
        priority: targetSchools.length === 0 ? 'first_choice' : 'second_choice'
      };
      setTargetSchools([...targetSchools, newSchool]);
      setNewSchoolName('');
    }
  };

  const removeTargetSchool = (id: string) => {
    setTargetSchools(targetSchools.filter(school => school.id !== id));
  };

  const updateSubjectLevel = (subject: string, field: 'currentLevel' | 'targetLevel', value: number) => {
    setSubjectLevels(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('プロフィール設定完了ボタンが押されました');
    const profile: LearnerProfile = {
      id: existingProfile?.id || `profile_${Date.now()}`,
      name,
      currentGrade,
      targetGrade,
      targetSchools,
      schoolLevel,
      studyStartDate: existingProfile?.studyStartDate || new Date(),
      examDate: examDate ? new Date(examDate) : undefined,
      availableStudyHours: {
        weekday: weekdayHours,
        weekend: weekendHours
      },
      subjectLevels,
      learningPreferences: {
        preferredDifficulty,
        learningStyle: learningStyle as any,
        sessionLength: sessionLength as any,
        motivationType: motivationType as any
      },
      schedule: {
        schoolSchedule: {
          monday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          tuesday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          wednesday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          thursday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          friday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          saturday: { schoolHours: [], extracurriculars: [], availableForStudy: [] },
          sunday: { schoolHours: [], extracurriculars: [], availableForStudy: [] }
        },
        studyTimeSlots: [],
        busyPeriods: []
      },
      createdAt: existingProfile?.createdAt || new Date(),
      updatedAt: new Date()
    };

    console.log('作成されたプロフィール:', profile);
    onProfileComplete(profile);
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">基本情報を教えてください</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田太郎"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">現在の学年</label>
                <select
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value as GradeLevel)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="4th">小学4年生</option>
                  <option value="5th">小学5年生</option>
                  <option value="6th">小学6年生</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">受験学年</label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value as GradeLevel)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="6th">小学6年生（中学受験）</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">受験予定日</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">志望校について教えてください</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">志望校のレベル</label>
              <select
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value as SchoolLevel)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="basic">基本レベル（偏差値40-50）</option>
                <option value="standard">標準レベル（偏差値50-60）</option>
                <option value="advanced">上位レベル（偏差値60-70）</option>
                <option value="elite">最難関レベル（偏差値70+）</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">志望校を追加</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  placeholder="学校名を入力"
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newSchoolLevel}
                  onChange={(e) => setNewSchoolLevel(e.target.value as SchoolLevel)}
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basic">基本</option>
                  <option value="standard">標準</option>
                  <option value="advanced">上位</option>
                  <option value="elite">最難関</option>
                </select>
                <button
                  onClick={addTargetSchool}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  追加
                </button>
              </div>
            </div>

            {targetSchools.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-3">登録済み志望校</h4>
                <div className="space-y-2">
                  {targetSchools.map((school, index) => (
                    <div key={school.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <span className="font-medium">{school.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({school.level === 'basic' ? '基本' : school.level === 'standard' ? '標準' : school.level === 'advanced' ? '上位' : '最難関'})
                        </span>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {index === 0 ? '第一志望' : index === 1 ? '第二志望' : '併願校'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeTargetSchool(school.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">学習時間について教えてください</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">平日の学習時間（1日あたり）</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0.5"
                    max="6"
                    step="0.5"
                    value={weekdayHours}
                    onChange={(e) => setWeekdayHours(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">
                    <span className="text-lg font-semibold text-blue-600">{weekdayHours}時間</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">休日の学習時間（1日あたり）</label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={weekendHours}
                    onChange={(e) => setWeekendHours(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">
                    <span className="text-lg font-semibold text-blue-600">{weekendHours}時間</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">学習時間の目安</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 週間合計: 約{(weekdayHours * 5 + weekendHours * 2).toFixed(1)}時間</li>
                <li>• 月間合計: 約{((weekdayHours * 5 + weekendHours * 2) * 4).toFixed(0)}時間</li>
                <li>• 無理のない範囲で設定しましょう</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">学習の特性について教えてください</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">学習スタイル</label>
                <div className="space-y-2">
                  {[
                    { value: 'visual', label: '視覚的学習', desc: '図表や画像で理解したい' },
                    { value: 'auditory', label: '聴覚的学習', desc: '音声や説明で理解したい' },
                    { value: 'kinesthetic', label: '体験的学習', desc: '手を動かして理解したい' },
                    { value: 'mixed', label: 'バランス型', desc: '色々な方法を組み合わせたい' }
                  ].map(style => (
                    <label key={style.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="learningStyle"
                        value={style.value}
                        checked={learningStyle === style.value}
                        onChange={(e) => setLearningStyle(e.target.value as 'visual' | 'auditory' | 'kinesthetic' | 'mixed')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-sm text-gray-500">{style.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">セッション時間</label>
                <div className="space-y-2">
                  {[
                    { value: 'short', label: '短時間集中', desc: '20分程度で集中して学習' },
                    { value: 'medium', label: 'バランス型', desc: '40分程度でじっくり学習' },
                    { value: 'long', label: '長時間継続', desc: '60分以上でしっかり学習' }
                  ].map(length => (
                    <label key={length.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sessionLength"
                        value={length.value}
                        checked={sessionLength === length.value}
                        onChange={(e) => setSessionLength(e.target.value as 'short' | 'medium' | 'long')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{length.label}</div>
                        <div className="text-sm text-gray-500">{length.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">難易度の進め方</label>
                <div className="space-y-2">
                  {[
                    { value: 'gradual', label: '段階的', desc: '基礎から着実に積み上げる' },
                    { value: 'challenging', label: 'チャレンジ型', desc: '難しい問題にも積極的に挑戦' },
                    { value: 'mixed', label: 'バランス型', desc: '状況に応じて調整' }
                  ].map(diff => (
                    <label key={diff.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredDifficulty"
                        value={diff.value}
                        checked={preferredDifficulty === diff.value}
                        onChange={(e) => setPreferredDifficulty(e.target.value as 'gradual' | 'challenging' | 'mixed')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{diff.label}</div>
                        <div className="text-sm text-gray-500">{diff.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">モチベーションタイプ</label>
                <div className="space-y-2">
                  {[
                    { value: 'achievement', label: '達成重視', desc: '目標達成でやる気が出る' },
                    { value: 'progress', label: '成長重視', desc: '少しずつの進歩を実感したい' },
                    { value: 'competition', label: '競争重視', desc: '他者との比較でやる気が出る' },
                    { value: 'exploration', label: '探究重視', desc: '新しい発見や理解を楽しみたい' }
                  ].map(motivation => (
                    <label key={motivation.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="motivationType"
                        value={motivation.value}
                        checked={motivationType === motivation.value}
                        onChange={(e) => setMotivationType(e.target.value as 'achievement' | 'progress' | 'competition' | 'exploration')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{motivation.label}</div>
                        <div className="text-sm text-gray-500">{motivation.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">教科別の現在レベルと目標を設定してください</h3>
            
            <div className="space-y-6">
              {Object.entries(subjectLevels).map(([subject, levels]) => {
                const subjectNames = {
                  math: '算数',
                  japanese: '国語',
                  science: '理科',
                  social: '社会'
                };
                
                return (
                  <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-4">{subjectNames[subject as keyof typeof subjectNames]}</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">現在のレベル</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={levels.currentLevel}
                            onChange={(e) => updateSubjectLevel(subject, 'currentLevel', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-8 text-center font-semibold">{levels.currentLevel}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {levels.currentLevel <= 3 ? '基礎レベル' : 
                           levels.currentLevel <= 6 ? '標準レベル' : 
                           levels.currentLevel <= 8 ? '応用レベル' : '発展レベル'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">目標レベル</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min={levels.currentLevel}
                            max="10"
                            value={levels.targetLevel}
                            onChange={(e) => updateSubjectLevel(subject, 'targetLevel', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-8 text-center font-semibold">{levels.targetLevel}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {levels.targetLevel <= 3 ? '基礎レベル' : 
                           levels.targetLevel <= 6 ? '標準レベル' : 
                           levels.targetLevel <= 8 ? '応用レベル' : '発展レベル'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">設定完了</h4>
              <p className="text-sm text-green-700">
                これらの情報を基に、あなた専用の学習計画を作成します。
                学習を進めながら、AIが自動的に調整していきます。
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return name.trim() !== '';
      case 2:
        return true; // 志望校は任意
      case 3:
        return weekdayHours > 0 && weekendHours > 0;
      case 4:
        return true; // 初期値が設定されているので常にtrue
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">学習者プロフィール設定</h2>
              <p className="text-blue-100 mt-1">あなたに最適な学習体験をカスタマイズします</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* 進捗バー */}
          <div className="mt-4">
            <StepProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={['基本情報', '志望校', '学習時間', '学習特性', '教科レベル']}
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* フッター */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === totalSteps ? '完了' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;