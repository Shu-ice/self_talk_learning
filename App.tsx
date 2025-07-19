
import React, { useState, useEffect, useCallback } from 'react';
// import ResponsiveAppWrapper from './components/ResponsiveApp'; // 未使用のためコメントアウト
import { ChatSession } from "@google/generative-ai";
import SubjectSelector from './components/SubjectSelector';
// import ChatInterface from './components/ChatInterface'; // 使用されていないためコメントアウト
import LearningDashboard from './components/LearningDashboard';
import Alert from './components/Alert';
import RealTimeLearningAnalyzer from './components/RealTimeLearningAnalyzer';
import EnhancedChatInterface from './components/EnhancedChatInterface';
import VoiceInputWidget from './components/VoiceInputWidget';
import HandwritingCanvas from './components/HandwritingCanvas';
import SessionRecordings from './components/SessionRecordings';
import ProfileSetup from './components/ProfileSetup';
import ParentDashboard from './components/ParentDashboard';
import ApiKeySetup from './components/ApiKeySetup';
import DebugPanel from './components/DebugPanel';
import { Subject, Topic, ChatMessage, UserProgress, LearningSession, MessageAttachment, LearnerProfile } from './types';
import { startChatSession, sendMessageToChat, validateApiKey } from './services/geminiService';
import { 
  loadUserProgress, 
  createInitialUserProgress, 
  startLearningSession, 
  endLearningSession,
  updateSessionStats,
  updateProgressAfterSession 
} from './services/progressService';
import { applyAdaptiveLearning } from './services/adaptiveLearning';
import { analyzeWeaknesses } from './services/weaknessAnalysis';
import { realTimeLearningAnalyzer, RealTimeLearningAnalysis } from './services/realTimeLearningAnalyzer';
import { VoiceAnalysis } from './services/speechRecognitionService';
import { sessionRecorderService } from './services/sessionRecorderService';
import { profileService } from './services/profileService';
import { DemoDataGenerator } from './utils/demoData';
import { KidsButton } from './components/ui/KidsUIComponents';

const App: React.FC = () => {
  // デバッグ用の初期化ログ
  console.log('🚀 App component initializing...');
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY ? `設定済み (${process.env.VITE_GEMINI_API_KEY.substring(0, 10)}...)` : '未設定',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `設定済み (${process.env.GEMINI_API_KEY.substring(0, 10)}...)` : '未設定'
  });

  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentLearningSession, setCurrentLearningSession] = useState<LearningSession | null>(null);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<RealTimeLearningAnalysis | null>(null);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState<boolean>(false);
  const [showRecordings, setShowRecordings] = useState<boolean>(false);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(false);
  const [showParentDashboard, setShowParentDashboard] = useState<boolean>(false);
  const [showApiKeySetup, setShowApiKeySetup] = useState<boolean>(false);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

  const initializeChat = useCallback(async (subject: Subject, topic: Topic) => {
    setIsLoading(true);
    setError('');
    setMessages([]);
    setCurrentTopic(topic);
    setShowDashboard(false);

    try {
      // プロフィールベースのアダプティブ学習システムで難易度調整
      let adaptiveLearning;
      if (learnerProfile && userProgress) {
        // プロフィール情報を基にした詳細なアダプティブ学習
        const subjectProgress = userProgress.subjectProgress[subject.id];
        const subjectLevel = learnerProfile.subjectLevels[subject.id];
        
        adaptiveLearning = {
          level: subjectLevel ? Math.round(subjectLevel.currentLevel) : 5,
          promptModifier: generateAdaptivePrompt(learnerProfile, subjectLevel, subjectProgress),
          adjustment: {
            reason: `${learnerProfile.name}さんの学習レベル（${subjectLevel?.currentLevel}/10）に最適化`
          }
        };
      } else {
        // 従来のアダプティブ学習
        adaptiveLearning = applyAdaptiveLearning(subject.id, topic.id);
      }
      
      // 学習セッション開始
      const learningSession = startLearningSession(subject.id, topic.id);
      learningSession.difficultyLevel = adaptiveLearning.level;
      setCurrentLearningSession(learningSession);

      // リアルタイム学習分析セッション開始
      const sessionId = `session_${Date.now()}_${Math.random()}`;
      setCurrentSessionId(sessionId);
      realTimeLearningAnalyzer.startSession(sessionId, (analysis: RealTimeLearningAnalysis) => {
        setRealTimeAnalysis(analysis);
        // 学習分析を録画に記録
        sessionRecorderService.recordLearningAnalysis(analysis, sessionId);
      });

      // セッション録画開始
      sessionRecorderService.startRecording(sessionId, subject.id, topic.id);

      const session = await startChatSession();
      setChatSession(session);

      // 弱点分析の結果を取得
      const weaknessAnalysis = analyzeWeaknesses(subject.id, topic.id);
      const currentTopicWeakness = weaknessAnalysis.find(w => w.topicId === topic.id);

      // AIプロンプトに難易度調整と弱点分析を追加
      let enhancedPrompt = `「${subject.name}」の「${topic.name}」について学習を始めたいです。最初の問題を出してください。

${adaptiveLearning.promptModifier}`;

      if (currentTopicWeakness && currentTopicWeakness.focusAreas.length > 0) {
        enhancedPrompt += `

特に以下の分野を重点的に扱ってください: ${currentTopicWeakness.focusAreas.join('、')}`;
      }

      if (adaptiveLearning.adjustment) {
        enhancedPrompt += `

レベル調整: ${adaptiveLearning.adjustment.reason}`;
      }

      const initialUserMessage = enhancedPrompt;
      
      // Add a system message indicating the start of the session for UI
      const systemMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'system',
        text: `AIコーチとの「${subject.name} - ${topic.name}」の学習セッションを開始します。AIが最初の問題を作成中です...`,
        timestamp: new Date(),
      };
      setMessages([systemMessage]);

      const aiResponseText = await sendMessageToChat(session, initialUserMessage);
      
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((_prev: ChatMessage[]) => [systemMessage, aiMessage]); // Keep system message, add AI's first question
      setIsSessionActive(true);

    } catch (err) {
      console.error("Chat initialization failed:", err);
      setError(err instanceof Error ? err.message : "チャットの開始に失敗しました。ページをリフレッシュして再度お試しください。");
      setIsSessionActive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleStartLearning = (subject: Subject, topic: Topic) => {
    console.log('handleStartLearning が呼ばれました', { subject, topic });
    initializeChat(subject, topic);
  };

  const handleSendMessage = async (text: string, attachments?: MessageAttachment[]) => {
    if (!chatSession || isLoading || !currentLearningSession) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: new Date(),
      attachments,
    };
    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    // リアルタイム学習分析とセッション録画にメッセージを記録
    if (currentSessionId) {
      realTimeLearningAnalyzer.recordMessage(currentSessionId, userMessage);
      sessionRecorderService.recordMessage(userMessage, currentSessionId);
    }

    // 学習セッション統計更新
    const updatedSession = updateSessionStats(currentLearningSession);
    setCurrentLearningSession(updatedSession);

    try {
      const aiResponseText = await sendMessageToChat(chatSession, text);
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prev: ChatMessage[]) => [...prev, aiMessage]);

      // AIメッセージもリアルタイム分析とセッション録画に記録
      if (currentSessionId) {
        realTimeLearningAnalyzer.recordMessage(currentSessionId, aiMessage);
        sessionRecorderService.recordMessage(aiMessage, currentSessionId);
      }
    } catch (err) {
      console.error("Sending message failed:", err);
      const errorMessage = err instanceof Error ? err.message : "メッセージの送信中にエラーが発生しました。";
      setError(errorMessage);
      const errorResponseMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'system',
        text: `エラー: ${errorMessage} AIへの接続に問題がある可能性があります。少し待ってから再試行してください。`,
        timestamp: new Date(),
      };
      setMessages((prev: ChatMessage[]) => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // プロフィールとユーザー進捗データの初期化
  useEffect(() => {
    try {
      console.log('📊 Initializing profile and progress data...');
      
      // プロフィール読み込み
      const profile = profileService.loadProfile();
      console.log('Profile loaded:', profile ? 'Found' : 'Not found');
      setLearnerProfile(profile);

      if (profile) {
        // プロフィールがある場合は進捗データを読み込み
        try {
          let progress = profileService.loadProgress();
          if (!progress) {
            console.log('Creating initial progress for existing profile...');
            progress = profileService.createInitialProgress(profile);
          }
          setUserProgress(progress);
          console.log('Progress data set for existing profile');
        } catch (progressError) {
          console.error('Error loading/creating progress for existing profile:', progressError);
          // フォールバック: 基本の進捗データを作成
          const fallbackProgress = createInitialUserProgress();
          setUserProgress(fallbackProgress);
        }
      } else {
        // プロフィールがない場合は従来の進捗データ読み込み
        try {
          let progress = loadUserProgress();
          if (!progress) {
            console.log('Creating initial user progress...');
            progress = createInitialUserProgress();
          }
          setUserProgress(progress);
          console.log('Progress data set for new user');
          
          // 初回ユーザーにはプロフィール設定を促す
          setShowProfileSetup(true);
        } catch (progressError) {
          console.error('Error loading/creating progress for new user:', progressError);
          setError('初期化エラーが発生しました。ページを再読み込みしてください。');
        }
      }
    } catch (error) {
      console.error('Critical error during initialization:', error);
      setError('アプリケーションの初期化に失敗しました。');
    }
  }, []);

  // Effect to ensure API_KEY check message appears if needed
  useEffect(() => {
    const { isValid, message } = validateApiKey();
    if (!isValid) {
      setError(`🔑 ${message}`);
      // より明確なAPIキー設定ダイアログを表示
      if (!showProfileSetup) {
        setShowApiKeySetup(true);
      }
    }
  }, [showProfileSetup]);

  // 学習セッション終了処理
  const handleEndSession = () => {
    if (currentLearningSession) {
      const endedSession = endLearningSession(currentLearningSession);
      updateProgressAfterSession(endedSession);
      
      // 進捗データを再読み込み
      const updatedProgress = loadUserProgress();
      if (updatedProgress) {
        setUserProgress(updatedProgress);
      }
    }

    // リアルタイム学習分析セッション終了
    if (currentSessionId) {
      realTimeLearningAnalyzer.endSession(currentSessionId);
      
      // セッション録画停止・保存
      const completedRecording = sessionRecorderService.stopRecording();
      if (completedRecording) {
        sessionRecorderService.saveToLocalStorage();
        console.log('学習セッションが録画されました:', completedRecording.id);
      }

      // プロフィールベースの進捗更新
      if (learnerProfile && currentLearningSession && currentTopic) {
        const sessionData = {
          timeSpent: currentLearningSession.duration || 0,
          comprehensionLevel: realTimeAnalysis?.comprehensionAnalysis.conceptualUnderstanding || 0.5,
          topicId: currentTopic.id,
          completed: currentLearningSession.completionStatus === 'completed'
        };

        const updatedProgress = profileService.updateLearningProgress(currentLearningSession.subjectId, sessionData);
        if (updatedProgress) {
          setUserProgress(updatedProgress);
          
          // アチーブメント確認
          const newAchievements = profileService.checkAndAwardAchievements(updatedProgress);
          if (newAchievements.length > 0) {
            console.log('新しいアチーブメント:', newAchievements);
            // TODO: アチーブメント通知UIの実装
          }
        }
      }
      
      setCurrentSessionId(null);
      setRealTimeAnalysis(null);
    }

    setIsSessionActive(false);
    setChatSession(null);
    setMessages([]);
    setCurrentTopic(null);
    setCurrentLearningSession(null);
    setShowDashboard(true);
  };

  const handleSubjectSelect = (_subjectId: string) => {
    // ダッシュボードから教科選択時の処理
    setShowDashboard(false);
  };

  // 音声分析の結果を記録
  const handleVoiceAnalysis = (analysis: VoiceAnalysis) => {
    if (currentSessionId) {
      realTimeLearningAnalyzer.recordVoiceAnalysis(currentSessionId, analysis);
      sessionRecorderService.recordVoiceAnalysis(analysis, currentSessionId);
    }
  };

  // リアルタイム分析からのアクション処理
  const handleAnalyzerAction = (action: string) => {
    switch (action) {
      case 'break_taken':
        // 休憩メッセージをチャットに追加
        const breakMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'system',
          text: '休憩中です。リフレッシュして戻ってきてくださいね！',
          timestamp: new Date(),
        };
        setMessages((prev: ChatMessage[]) => [...prev, breakMessage]);
        break;
      case 'help_requested':
        // ヒント要請メッセージ
        const helpMessage = '今の問題について、もう少し詳しくヒントをもらえますか？';
        handleSendMessage(helpMessage);
        break;
    }
  };

  // プロフィール設定完了ハンドラー
  const handleProfileComplete = (profile: LearnerProfile) => {
    console.log('handleProfileComplete が呼ばれました', profile);
    profileService.saveProfile(profile);
    setLearnerProfile(profile);

    // 新しいプロフィールに基づいて進捗データを作成
    const progress = profileService.createInitialProgress(profile);
    setUserProgress(progress);

    setShowProfileSetup(false);
    console.log('プロフィール設定完了。アダプティブ学習を開始します。');
  };

  // アダプティブプロンプト生成
  const generateAdaptivePrompt = (profile: LearnerProfile, subjectLevel: any, subjectProgress: any): string => {
    let prompt = `学習者プロフィール：
- 名前: ${profile.name}
- 学年: ${profile.currentGrade === '4th' ? '小学4年生' : profile.currentGrade === '5th' ? '小学5年生' : '小学6年生'}
- 志望校レベル: ${profile.schoolLevel === 'basic' ? '基本' : profile.schoolLevel === 'standard' ? '標準' : profile.schoolLevel === 'advanced' ? '上位' : '最難関'}`;

    if (profile.targetSchools.length > 0) {
      prompt += `\n- 第一志望校: ${profile.targetSchools[0].name}`;
    }

    if (subjectLevel) {
      prompt += `\n- 現在のレベル: ${subjectLevel.currentLevel}/10
- 目標レベル: ${subjectLevel.targetLevel}/10`;
      
      if (subjectLevel.strengths.length > 0) {
        prompt += `\n- 得意分野: ${subjectLevel.strengths.join('、')}`;
      }
      
      if (subjectLevel.weaknesses.length > 0) {
        prompt += `\n- 苦手分野: ${subjectLevel.weaknesses.join('、')}`;
      }
    }

    // 学習特性
    prompt += `\n\n学習特性：
- 学習スタイル: ${profile.learningPreferences.learningStyle === 'visual' ? '視覚重視' : 
                profile.learningPreferences.learningStyle === 'auditory' ? '聴覚重視' : 
                profile.learningPreferences.learningStyle === 'kinesthetic' ? '体験重視' : 'バランス型'}
- 難易度進め方: ${profile.learningPreferences.preferredDifficulty === 'gradual' ? '段階的' : 
                profile.learningPreferences.preferredDifficulty === 'challenging' ? 'チャレンジ型' : 'バランス型'}
- セッション時間: ${profile.learningPreferences.sessionLength === 'short' ? '短時間集中' : 
                 profile.learningPreferences.sessionLength === 'medium' ? 'バランス型' : '長時間継続'}`;

    if (subjectProgress) {
      prompt += `\n\n学習進捗：
- 理解度: ${Math.round(subjectProgress.masteryLevel * 100)}%
- 完了トピック数: ${subjectProgress.completedTopics.length}個`;
      
      if (subjectProgress.streakDays > 0) {
        prompt += `\n- 連続学習: ${subjectProgress.streakDays}日`;
      }
    }

    prompt += `\n\n上記の情報を踏まえて、${profile.name}さんに最適な学習体験を提供してください。`;

    return prompt;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-sky-700 sm:text-5xl">
            AIセルフトークラーニング
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            中学受験準備コース - AIコーチ「みらい」と一緒に対話しながら理解を深めよう！
          </p>
          
          {/* ナビゲーションボタン */}
          {!isSessionActive && userProgress && (
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => { setShowDashboard(false); setShowRecordings(false); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showDashboard && !showRecordings
                    ? 'bg-sky-600 text-white' 
                    : 'bg-white text-sky-600 hover:bg-sky-50'
                }`}
              >
                学習を始める
              </button>
              <button
                onClick={() => { setShowDashboard(true); setShowRecordings(false); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showDashboard 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-white text-sky-600 hover:bg-sky-50'
                }`}
              >
                学習進捗
              </button>
              <button
                onClick={() => { setShowRecordings(true); setShowDashboard(false); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showRecordings 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                📹 録画を見る
              </button>
              <button
                onClick={() => setShowProfileSetup(true)}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-green-600 hover:bg-green-50"
              >
                ⚙️ プロフィール設定
              </button>
              {learnerProfile && (
                <button
                  onClick={() => setShowParentDashboard(true)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-orange-600 hover:bg-orange-50"
                >
                  👨‍👩‍👧‍👦 保護者ダッシュボード
                </button>
              )}
              {/* 開発用デモデータボタン */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={() => {
                    DemoDataGenerator.initializeDemoData();
                    window.location.reload();
                  }}
                  className="px-3 py-1 rounded text-xs bg-gray-500 text-white hover:bg-gray-600"
                >
                  🛠️ デモデータ初期化
                </button>
              )}
            </div>
          )}
        </header>
        
        {error && <Alert message={error} type="error" onClose={() => setError('')} />}

        {/* APIキー設定 */}
        {showApiKeySetup && (
          <ApiKeySetup
            onApiKeySet={() => {
              setShowApiKeySetup(false);
              setError('');
              window.location.reload(); // APIキー設定後はページを再読み込み
            }}
            onClose={() => setShowApiKeySetup(false)}
          />
        )}

        {/* プロフィール設定 */}
        {showProfileSetup && (
          <ProfileSetup
            onProfileComplete={handleProfileComplete}
            onClose={() => setShowProfileSetup(false)}
            existingProfile={learnerProfile || undefined}
          />
        )}

        {/* 保護者向けダッシュボード */}
        {showParentDashboard && learnerProfile && (
          <ParentDashboard
            learnerId={learnerProfile.id}
            onClose={() => setShowParentDashboard(false)}
          />
        )}

        {/* 学習進捗ダッシュボード */}
        {showDashboard && userProgress && !isSessionActive && (
          <LearningDashboard 
            userProgress={userProgress} 
            onSubjectSelect={handleSubjectSelect}
          />
        )}

        {/* セッション録画表示 */}
        {showRecordings && !isSessionActive && (
          <SessionRecordings onClose={() => setShowRecordings(false)} />
        )}

        {/* 教科選択 */}
        {!showDashboard && !showRecordings && !isSessionActive && (
          <SubjectSelector onStartLearning={handleStartLearning} disabled={isLoading} />
        )}

        {/* 学習セッション終了ボタンと高度な機能切り替え */}
        {isSessionActive && (
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={handleEndSession}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              学習を終了する
            </button>
            
            <KidsButton
              onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
              variant={showAdvancedFeatures ? 'fun' : 'secondary'}
              size="medium"
              icon={showAdvancedFeatures ? '🙈' : '🎆'}
              sound={true}
              animation={true}
            >
              {showAdvancedFeatures ? 'シンプルモード' : '高度な機能'}
            </KidsButton>
          </div>
        )}

        {/* メインチャットエリア */}
        {isSessionActive && (
          <div className={`grid gap-6 ${showAdvancedFeatures ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            {/* チャットインターフェース */}
            <div className={showAdvancedFeatures ? 'lg:col-span-2' : 'lg:col-span-1'}>
              <EnhancedChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                currentTopicName={currentTopic?.name}
              />
            </div>

            {/* 高度な機能パネル */}
            {showAdvancedFeatures && (
              <div className="space-y-6">
                {/* リアルタイム学習分析 */}
                <RealTimeLearningAnalyzer
                  analysis={realTimeAnalysis}
                  isSessionActive={isSessionActive}
                  onActionTaken={handleAnalyzerAction}
                />

                {/* 音声入力ウィジェット */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🎤</span>
                    音声入力
                  </h3>
                  <VoiceInputWidget
                    onTranscriptChange={(transcript, isFinal) => {
                      if (isFinal && transcript.trim()) {
                        handleSendMessage(transcript);
                      }
                    }}
                    onVoiceAnalysis={handleVoiceAnalysis}
                    autoSend={true}
                    showRealTimeAnalysis={true}
                  />
                </div>

                {/* 手書きキャンバス */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">✏️</span>
                    手書きメモ
                  </h3>
                  <HandwritingCanvas
                    width={300}
                    height={200}
                    showToolbar={true}
                    onCanvasChange={(imageData) => {
                      // 手書きデータをリアルタイム分析に記録
                      if (currentSessionId) {
                        realTimeLearningAnalyzer.recordEvent({
                          type: 'handwriting_created',
                          timestamp: new Date(),
                          data: { imageData },
                          sessionId: currentSessionId
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
         <footer className="mt-12 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} AIセルフトークラーニング. Gemini APIを利用しています。</p>
            <p className="mt-1">最適な学習体験のため、最新のブラウザをご利用ください。</p>
        </footer>
      </div>

      {/* Debug Panel - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel 
          isVisible={showDebugPanel} 
          onToggle={() => setShowDebugPanel(!showDebugPanel)} 
        />
      )}
    </div>
  );
};

export default App;
