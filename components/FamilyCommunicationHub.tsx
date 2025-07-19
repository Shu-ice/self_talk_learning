import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton, 
  HoverScaleCard, 
  FloatingActionButton,
  SmileyRating,
  AchievementToast
} from './ui/MicroInteractions';

/**
 * 💬 家族コミュニケーションハブ
 * 保護者と子どもの双方向コミュニケーション・サポート機能
 */

interface FamilyCommunicationHubProps {
  userId: string;
  userType: 'parent' | 'child';
  familyId: string;
  className?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'child';
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
  currentActivity?: string;
}

interface ConversationMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'celebration' | 'encouragement' | 'question' | 'ai_suggestion';
  timestamp: Date;
  readAt?: Date;
  reactions: MessageReaction[];
  metadata: MessageMetadata;
  aiGenerated: boolean;
  repliedToId?: string;
}

interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

interface MessageMetadata {
  relatedToSession?: string;
  relatedToAchievement?: string;
  emotionalTone: 'positive' | 'neutral' | 'concerned' | 'celebratory' | 'encouraging';
  priority: 'low' | 'normal' | 'high';
  suggestedActions?: string[];
  contextData?: any;
}

interface SmartSuggestion {
  id: string;
  type: 'response' | 'encouragement' | 'question' | 'celebration' | 'support';
  trigger: string;
  content: string;
  contextRelevance: number;
  personalizedFor: string;
  validUntil: Date;
}

interface CommunicationInsight {
  type: 'frequency' | 'tone' | 'response_time' | 'engagement';
  title: string;
  description: string;
  value: number;
  trend: 'improving' | 'stable' | 'declining';
  suggestions: string[];
}

interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  transcript?: string;
  emotionalAnalysis?: {
    mood: string;
    confidence: number;
    energy: number;
  };
}

const FamilyCommunicationHub: React.FC<FamilyCommunicationHubProps> = ({ 
  userId, 
  userType, 
  familyId, 
  className = '' 
}) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [communicationInsights, setCommunicationInsights] = useState<CommunicationInsight[]>([]);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'insights' | 'celebrations'>('chat');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    initializeCommunicationHub();
    setupRealtimeConnection();
  }, [familyId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeCommunicationHub = async () => {
    await Promise.all([
      loadFamilyMembers(),
      loadCommunicationInsights(),
      generateSmartSuggestions()
    ]);
  };

  const setupRealtimeConnection = () => {
    // WebSocket接続でリアルタイム通信
    const ws = new WebSocket(`wss://api.example.com/family-communication/${familyId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeEvent(data);
    };

    return () => ws.close();
  };

  const loadFamilyMembers = async () => {
    // Mock data
    const mockMembers: FamilyMember[] = [
      {
        id: 'parent1',
        name: 'お母さん',
        type: 'parent',
        avatar: '👩',
        isOnline: true,
        lastSeen: new Date(),
        currentActivity: '家事中'
      },
      {
        id: 'child1',
        name: '太郎',
        type: 'child',
        avatar: '👦',
        isOnline: true,
        lastSeen: new Date(),
        currentActivity: '算数学習中'
      },
      {
        id: 'child2',
        name: '花子',
        type: 'child',
        avatar: '👧',
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    setFamilyMembers(mockMembers);
    
    // 最初の会話相手を選択
    if (mockMembers.length > 1) {
      const otherMember = mockMembers.find(member => member.id !== userId);
      if (otherMember) {
        setSelectedConversation(otherMember.id);
        await loadConversation(otherMember.id);
      }
    }
  };

  const loadConversation = async (partnerId: string) => {
    // Mock conversation data
    const mockMessages: ConversationMessage[] = [
      {
        id: 'msg1',
        senderId: 'child1',
        receiverId: 'parent1',
        content: '算数の宿題終わったよ！',
        type: 'text',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        reactions: [
          { userId: 'parent1', emoji: '👏', timestamp: new Date(Date.now() - 55 * 60 * 1000) }
        ],
        metadata: {
          emotionalTone: 'positive',
          priority: 'normal',
          relatedToSession: 'session123'
        },
        aiGenerated: false
      },
      {
        id: 'msg2',
        senderId: 'parent1',
        receiverId: 'child1',
        content: 'すごいね！よく頑張ったね。今日は難しい問題もあったでしょう？',
        type: 'encouragement',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        reactions: [
          { userId: 'child1', emoji: '😊', timestamp: new Date(Date.now() - 50 * 60 * 1000) }
        ],
        metadata: {
          emotionalTone: 'encouraging',
          priority: 'normal'
        },
        aiGenerated: false
      },
      {
        id: 'msg3',
        senderId: 'child1',
        receiverId: 'parent1',
        content: 'うん、分数のところが難しかった！でも最後は分かったよ',
        type: 'text',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        reactions: [],
        metadata: {
          emotionalTone: 'positive',
          priority: 'normal'
        },
        aiGenerated: false
      }
    ];

    setMessages(mockMessages);
  };

  const loadCommunicationInsights = async () => {
    const mockInsights: CommunicationInsight[] = [
      {
        type: 'frequency',
        title: 'コミュニケーション頻度',
        description: '今週は昨週より30%多くやり取りしています',
        value: 24,
        trend: 'improving',
        suggestions: ['継続的な声かけを心がけましょう']
      },
      {
        type: 'response_time',
        title: '応答時間',
        description: '平均応答時間が短縮されています',
        value: 5,
        trend: 'improving',
        suggestions: ['素早い応答で子どもの学習意欲を維持']
      }
    ];

    setCommunicationInsights(mockInsights);
  };

  const generateSmartSuggestions = async () => {
    const mockSuggestions: SmartSuggestion[] = [
      {
        id: 'sugg1',
        type: 'encouragement',
        trigger: 'session_completed',
        content: '今日もお疲れさま！継続することが一番大切だよ',
        contextRelevance: 0.9,
        personalizedFor: 'child1',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 'sugg2',
        type: 'question',
        trigger: 'low_performance',
        content: '今日の学習で難しかったところはある？一緒に考えてみようか',
        contextRelevance: 0.8,
        personalizedFor: 'child1',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ];

    setSmartSuggestions(mockSuggestions);
  };

  const handleRealtimeEvent = useCallback((data: any) => {
    switch (data.type) {
      case 'message_received':
        addNewMessage(data.message);
        break;
      case 'typing_start':
        setTypingUsers(prev => new Set(prev).add(data.userId));
        break;
      case 'typing_stop':
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
        break;
      case 'member_status_changed':
        updateMemberStatus(data.userId, data.status);
        break;
    }
  }, []);

  const addNewMessage = (message: ConversationMessage) => {
    setMessages(prev => [...prev, message]);
    
    // 読み上げ（子どもユーザーの場合）
    if (userType === 'child' && message.senderId !== userId) {
      speakMessage(message.content);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ConversationMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      receiverId: selectedConversation,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date(),
      reactions: [],
      metadata: {
        emotionalTone: 'neutral',
        priority: 'normal'
      },
      aiGenerated: false
    };

    // 楽観的UI更新
    addNewMessage(message);
    setNewMessage('');

    // サーバーに送信
    try {
      await sendMessageToServer(message);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      // エラー処理：メッセージを削除または再試行
    }
  };

  const sendSuggestedMessage = async (suggestion: SmartSuggestion) => {
    const message: ConversationMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      receiverId: selectedConversation!,
      content: suggestion.content,
      type: suggestion.type as any,
      timestamp: new Date(),
      reactions: [],
      metadata: {
        emotionalTone: 'encouraging',
        priority: 'normal'
      },
      aiGenerated: true
    };

    addNewMessage(message);
    await sendMessageToServer(message);
    
    // 使用済み提案を削除
    setSmartSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const addReaction = async (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              reactions: [
                ...msg.reactions.filter(r => r.userId !== userId),
                { userId, emoji, timestamp: new Date() }
              ]
            }
          : msg
      )
    );

    // サーバーに反映
    try {
      await sendReactionToServer(messageId, emoji);
    } catch (error) {
      console.error('リアクション送信エラー:', error);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('音声録音エラー:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    // 音声ファイルをサーバーにアップロード
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('sender', userId);
    formData.append('receiver', selectedConversation!);

    try {
      const response = await fetch('/api/voice-message', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      const voiceMessage: ConversationMessage = {
        id: result.messageId,
        senderId: userId,
        receiverId: selectedConversation!,
        content: result.transcript || '[音声メッセージ]',
        type: 'voice',
        timestamp: new Date(),
        reactions: [],
        metadata: {
          emotionalTone: 'neutral',
          priority: 'normal',
          contextData: {
            audioUrl: result.audioUrl,
            duration: result.duration,
            transcript: result.transcript
          }
        },
        aiGenerated: false
      };

      addNewMessage(voiceMessage);
    } catch (error) {
      console.error('音声メッセージ送信エラー:', error);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessageToServer = async (message: ConversationMessage) => {
    // API送信実装
    console.log('メッセージ送信:', message);
  };

  const sendReactionToServer = async (messageId: string, emoji: string) => {
    // API送信実装
    console.log('リアクション送信:', messageId, emoji);
  };

  const updateMemberStatus = (userId: string, status: any) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === userId 
          ? { ...member, isOnline: status.isOnline, lastSeen: new Date(status.lastSeen) }
          : member
      )
    );
  };

  const selectedMember = familyMembers.find(member => member.id === selectedConversation);

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      {/* ヘッダー */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">💬 家族コミュニケーション</h1>
          
          {/* タブ選択 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'chat', label: '💬 チャット', icon: '💬' },
              { key: 'insights', label: '📊 分析', icon: '📊' },
              { key: 'celebrations', label: '🎉 お祝い', icon: '🎉' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  selectedTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTab === 'chat' && (
        <div className="flex-1 flex">
          {/* 家族メンバー一覧 */}
          <div className="w-80 bg-white border-r border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">家族メンバー</h2>
            <div className="space-y-3">
              {familyMembers
                .filter(member => member.id !== userId)
                .map((member) => (
                  <HoverScaleCard
                    key={member.id}
                    onClick={() => {
                      setSelectedConversation(member.id);
                      loadConversation(member.id);
                    }}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedConversation === member.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } border`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{member.name}</h3>
                        <p className="text-sm text-gray-600">
                          {member.isOnline 
                            ? member.currentActivity || 'オンライン'
                            : `最終: ${member.lastSeen.toLocaleTimeString()}`
                          }
                        </p>
                      </div>
                    </div>
                  </HoverScaleCard>
                ))}
            </div>

            {/* スマート提案 */}
            {smartSuggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">💡 提案メッセージ</h3>
                <div className="space-y-2">
                  {smartSuggestions.slice(0, 3).map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => sendSuggestedMessage(suggestion)}
                      className="w-full text-left p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      <div className="text-sm text-yellow-800">{suggestion.content}</div>
                      <div className="text-xs text-yellow-600 mt-1">
                        AI提案 • {Math.round(suggestion.contextRelevance * 100)}% 関連性
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* チャット画面 */}
          <div className="flex-1 flex flex-col">
            {selectedMember ? (
              <>
                {/* チャットヘッダー */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{selectedMember.avatar}</div>
                    <div>
                      <h2 className="font-semibold text-gray-800">{selectedMember.name}</h2>
                      <p className="text-sm text-gray-600">
                        {typingUsers.has(selectedMember.id) 
                          ? '入力中...' 
                          : selectedMember.isOnline 
                            ? selectedMember.currentActivity || 'オンライン'
                            : `最終: ${selectedMember.lastSeen.toLocaleTimeString()}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* メッセージ一覧 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === userId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === userId
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        {message.type === 'voice' && (
                          <div className="flex items-center space-x-2 mb-2">
                            <button className="text-lg">🎵</button>
                            <span className="text-sm">音声メッセージ</span>
                          </div>
                        )}
                        
                        <p className="text-sm">{message.content}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          
                          {message.aiGenerated && (
                            <span className="text-xs bg-green-200 text-green-800 px-1 rounded">
                              AI
                            </span>
                          )}
                        </div>

                        {/* リアクション */}
                        {message.reactions.length > 0 && (
                          <div className="flex space-x-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <span key={index} className="text-sm">
                                {reaction.emoji}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* リアクション追加ボタン */}
                        {message.senderId !== userId && (
                          <div className="mt-2">
                            <button
                              onClick={() => setShowEmojiPicker(
                                showEmojiPicker === message.id ? null : message.id
                              )}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              😊 リアクション
                            </button>
                            
                            {showEmojiPicker === message.id && (
                              <div className="flex space-x-2 mt-2">
                                {['👏', '😊', '❤️', '🎉', '👍'].map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      addReaction(message.id, emoji);
                                      setShowEmojiPicker(null);
                                    }}
                                    className="text-lg hover:scale-110 transition-transform"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* メッセージ入力 */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        ref={messageInputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder={`${selectedMember.name}にメッセージを送る...`}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        className={`p-3 rounded-lg transition-all ${
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        🎤
                      </button>
                      
                      <KidsButton
                        variant="primary"
                        size="small"
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                      >
                        送信
                      </KidsButton>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    会話を始めましょう
                  </h3>
                  <p className="text-gray-600">
                    左側から話したい家族メンバーを選んでください
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'insights' && (
        <div className="flex-1 p-6">
          <KidsCard title="📊 コミュニケーション分析" icon="📈" color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communicationInsights.map((insight, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-purple-600">{insight.value}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      insight.trend === 'improving' ? 'bg-green-100 text-green-800' :
                      insight.trend === 'stable' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {insight.trend === 'improving' ? '📈 改善中' :
                       insight.trend === 'stable' ? '➡️ 安定' : '📉 要注意'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-1">提案</h4>
                    <ul className="text-sm text-gray-600">
                      {insight.suggestions.map((suggestion, i) => (
                        <li key={i}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </KidsCard>
        </div>
      )}

      {selectedTab === 'celebrations' && (
        <div className="flex-1 p-6">
          <KidsCard title="🎉 家族のお祝い" icon="🏆" color="yellow">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                お祝い機能準備中
              </h3>
              <p className="text-gray-600">
                家族の達成を一緒に祝う機能を準備中です
              </p>
            </div>
          </KidsCard>
        </div>
      )}
    </div>
  );
};

export default FamilyCommunicationHub;