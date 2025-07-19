
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
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
     <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.903l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.903ZM2.25 7.903v8.516c0 .333.164.644.43.839l8.622 5.031v-9l-9-5.25Z" />
  </svg>
);


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, currentTopicName }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] md:h-[calc(100vh-260px)] bg-white shadow-xl rounded-xl overflow-hidden">
      <header className="p-4 bg-sky-600 text-white text-lg font-semibold shadow-md">
        AIコーチと学習中{currentTopicName ? `：${currentTopicName}` : ''}
      </header>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`mx-2 p-1 rounded-full ${msg.sender === 'ai' ? 'bg-emerald-100' : 'bg-sky-100'}`}>
                {msg.sender === 'ai' ? <AiIcon /> : <UserIcon />}
              </div>
              <div
                className={`px-4 py-3 rounded-xl shadow ${
                  msg.sender === 'user'
                    ? 'bg-sky-500 text-white rounded-br-none'
                    : 'bg-emerald-500 text-white rounded-bl-none'
                } ${msg.sender === 'system' ? 'bg-slate-200 text-slate-700 italic text-sm text-center w-full' : ''}`}
              >
                <p className="whitespace-pre-wrap text-sm md:text-base">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-sky-200 text-right' : 'text-emerald-200 text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "AIが返信中です..." : "解答を入力してください..."}
            disabled={isLoading}
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out disabled:bg-slate-100"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "送信"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
