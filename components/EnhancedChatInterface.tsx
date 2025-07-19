import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAttachment } from '../types';
import FileUpload from './FileUpload';
import { analyzeMultipleImages } from '../services/imageAnalysisService';
import { KidsButton } from './ui/KidsUIComponents';
import { AIThinkingLoader } from './LoadingSpinner';

interface EnhancedChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, attachments?: MessageAttachment[]) => void;
  isLoading: boolean;
  currentTopicName?: string;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-sky-500">
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
  </svg>
);

const AiIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-emerald-500">
    <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.903l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.903ZM2.25 7.903v8.516c0 .333.164.644.43.839l8.622 5.031v-9l-9-5.25Z" />
  </svg>
);

const AttachmentPreview: React.FC<{ attachment: MessageAttachment }> = ({ attachment }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-2 p-3 bg-slate-50 rounded-lg border">
      <div className="flex items-center space-x-3">
        {attachment.type === 'image' ? (
          <div className="relative">
            <img 
              src={attachment.dataUrl} 
              alt={attachment.fileName}
              className="w-16 h-16 object-cover rounded"
            />
            {attachment.analysisResult && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
        ) : (
          <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
        )}
        
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-800">{attachment.fileName}</p>
          <p className="text-xs text-slate-500">{formatFileSize(attachment.fileSize)}</p>
          
          {attachment.analysisResult && (
            <div className="mt-1">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {attachment.analysisResult.detectedSubject} - {attachment.analysisResult.detectedTopic}
              </span>
              <span className="ml-1 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                レベル{attachment.analysisResult.difficultyLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {attachment.analysisResult && (
        <div className="mt-3 space-y-2">
          <div>
            <h4 className="text-sm font-medium text-slate-800">AI解析結果:</h4>
            <p className="text-sm text-slate-600">{attachment.analysisResult.suggestedApproach}</p>
          </div>
          
          {attachment.analysisResult.keyElements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-800">重要要素:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {attachment.analysisResult.keyElements.map((element, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded">
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  currentTopicName 
}) => {
  const [inputText, setInputText] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if ((inputText.trim() || attachments.length > 0) && !isLoading && !isAnalyzing) {
      const messageText = inputText.trim() || "添付ファイルについて解説してください。";
      
      // 画像解析がまだの場合は実行
      let processedAttachments = [...attachments];
      if (attachments.some(att => att.type === 'image' && !att.analysisResult)) {
        setIsAnalyzing(true);
        try {
          processedAttachments = await analyzeMultipleImages(attachments);
        } catch (error) {
          console.error('画像解析エラー:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
      
      onSendMessage(messageText, processedAttachments);
      setInputText('');
      setAttachments([]);
      setShowFileUpload(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (newAttachments: MessageAttachment[]) => {
    setIsAnalyzing(true);
    try {
      // 画像ファイルを自動解析
      const analyzedAttachments = await analyzeMultipleImages(newAttachments);
      setAttachments(prev => [...prev, ...analyzedAttachments]);
    } catch (error) {
      console.error('ファイル解析エラー:', error);
      setAttachments(prev => [...prev, ...newAttachments]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AiIcon />
            <div>
              <h3 className="font-semibold">AIコーチ「みらい」</h3>
              {currentTopicName && (
                <p className="text-sm opacity-90">学習中: {currentTopicName}</p>
              )}
            </div>
          </div>
          
          <KidsButton
            onClick={() => setShowFileUpload(!showFileUpload)}
            variant={showFileUpload ? 'primary' : 'secondary'}
            size="medium"
            icon="📎"
            sound={true}
          >
            写真
          </KidsButton>
        </div>
      </div>

      {/* ファイルアップロード領域 */}
      {showFileUpload && (
        <div className="p-4 border-b bg-slate-50">
          <FileUpload 
            onFileUpload={handleFileUpload}
            disabled={isAnalyzing}
          />
        </div>
      )}

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="flex-shrink-0">
                {message.sender === 'user' ? <UserIcon /> : <AiIcon />}
              </div>
              
              <div className={`p-4 rounded-3xl text-lg ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow-lg' 
                  : message.sender === 'system'
                  ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-2 border-amber-300 shadow-md'
                  : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-md'
              }`}>
                <div className="whitespace-pre-wrap">{message.text}</div>
                
                {/* 添付ファイルプレビュー */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment) => (
                      <AttachmentPreview key={attachment.id} attachment={attachment} />
                    ))}
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {(isLoading || isAnalyzing) && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <AiIcon />
              <div className="bg-slate-100 text-slate-800 p-3 rounded-xl">
                <AIThinkingLoader />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 添付ファイルプレビュー */}
      {attachments.length > 0 && (
        <div className="p-3 border-t bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-slate-700">
              📎 アップした写真 ({attachments.length}枚)
            </span>
            <KidsButton
              onClick={() => setAttachments([])}
              variant="warning"
              size="small"
              icon="🗑️"
            >
              全部削除
            </KidsButton>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative group">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.dataUrl} 
                    alt={attachment.fileName}
                    className="w-12 h-12 object-cover rounded border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded border flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                )}
                
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                
                {attachment.analysisResult && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div className="p-4 border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={attachments.length > 0 ? "写真について質問してね" : "なんでも聞いてね！"}
            className="flex-1 p-4 text-lg border-2 border-sky-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all duration-200"
            disabled={isLoading || isAnalyzing}
            style={{ fontSize: '18px' }}
          />
          
          <KidsButton
            onClick={handleSend}
            disabled={(!inputText.trim() && attachments.length === 0) || isLoading || isAnalyzing}
            variant="success"
            size="large"
            icon="📤"
            sound={true}
            animation={true}
          >
            {isAnalyzing ? '解析中...' : isLoading ? '送信中...' : '送信'}
          </KidsButton>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;