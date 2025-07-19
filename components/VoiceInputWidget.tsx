import React, { useState, useEffect, useRef } from 'react';
import { 
  speechRecognitionService, 
  isVoiceInputSupported, 
  SpeechResult, 
  VoiceAnalysis 
} from '../services/speechRecognitionService';

interface VoiceInputWidgetProps {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onVoiceAnalysis?: (analysis: VoiceAnalysis) => void;
  placeholder?: string;
  disabled?: boolean;
  autoSend?: boolean; // 音声入力完了時に自動送信
  showRealTimeAnalysis?: boolean;
}

const VoiceInputWidget: React.FC<VoiceInputWidgetProps> = ({
  onTranscriptChange,
  onVoiceAnalysis,
  placeholder = "マイクボタンを押して話してください",
  disabled = false,
  autoSend = false,
  showRealTimeAnalysis = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(0);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<{
    needsEncouragement: boolean;
    suggestedPrompt: string;
    confidenceLevel: 'low' | 'medium' | 'high';
  } | null>(null);
  const [sessionAnalysis, setSessionAnalysis] = useState<VoiceAnalysis | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsSupported(isVoiceInputSupported());
    return () => {
      stopVolumeAnalysis();
    };
  }, []);

  // 音量解析の開始
  const startVolumeAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setVolume(average);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (error) {
      console.error('マイクアクセスエラー:', error);
    }
  };

  // 音量解析の停止
  const stopVolumeAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setVolume(0);
  };

  // 音声認識開始
  const startListening = async () => {
    if (!isSupported || disabled) return;

    const success = speechRecognitionService.startListening(
      (result: SpeechResult) => {
        setTranscript(result.transcript);
        onTranscriptChange(result.transcript, result.isFinal);
        
        // リアルタイム分析
        if (showRealTimeAnalysis && result.transcript.length > 10) {
          const analysis = speechRecognitionService.analyzeRealTime(result.transcript);
          setRealTimeAnalysis(analysis);
        }
        
        // 自動送信（最終結果かつ有効な長さの場合）
        if (autoSend && result.isFinal && result.transcript.trim().length > 5) {
          stopListening();
        }
      },
      (analysis: VoiceAnalysis) => {
        setSessionAnalysis(analysis);
        if (onVoiceAnalysis) {
          onVoiceAnalysis(analysis);
        }
      }
    );

    if (success) {
      setIsListening(true);
      await startVolumeAnalysis();
    }
  };

  // 音声認識停止
  const stopListening = () => {
    speechRecognitionService.stopListening();
    setIsListening(false);
    stopVolumeAnalysis();
  };

  // トグル機能
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // 音量レベルに基づく視覚的フィードバック
  const getVolumeVisualization = () => {
    const intensity = Math.min(volume / 50, 1);
    return {
      scale: 1 + intensity * 0.3,
      opacity: 0.7 + intensity * 0.3
    };
  };

  // 信頼度に基づく色
  const getConfidenceColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  // 感情に基づくアイコン
  const getEmotionIcon = (emotion: VoiceAnalysis['emotion']) => {
    switch (emotion) {
      case 'confident': return '😊';
      case 'uncertain': return '🤔';
      case 'confused': return '😵';
      case 'excited': return '🤩';
      case 'frustrated': return '😤';
      default: return '😐';
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg border">
        <p className="text-gray-600 text-center">
          このブラウザは音声入力をサポートしていません
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* メイン音声入力ボタン */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={toggleListening}
          disabled={disabled}
          className={`
            relative w-16 h-16 rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
              : 'bg-blue-500 hover:bg-blue-600 shadow-md'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          style={isListening ? getVolumeVisualization() : {}}
          title={isListening ? '音声入力を停止' : '音声入力を開始'}
        >
          <span className="text-white text-2xl">
            {isListening ? '🔴' : '🎤'}
          </span>
          
          {/* 音声レベル表示 */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse opacity-50"></div>
          )}
        </button>
        
        {/* 状態表示 */}
        <div className="mt-2 text-center">
          <p className={`text-sm font-medium ${isListening ? 'text-red-600' : 'text-gray-600'}`}>
            {isListening ? '聞いています...' : '音声入力'}
          </p>
          
          {isListening && (
            <div className="flex items-center justify-center mt-1 space-x-1">
              <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-6 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
      </div>

      {/* 認識されたテキスト表示 */}
      {transcript && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">認識されたテキスト:</h4>
          <p className="text-blue-700">{transcript}</p>
        </div>
      )}

      {/* リアルタイム分析表示 */}
      {showRealTimeAnalysis && realTimeAnalysis && (
        <div className={`p-3 border rounded-lg ${getConfidenceColor(realTimeAnalysis.confidenceLevel)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">リアルタイム分析</span>
            <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-50">
              信頼度: {realTimeAnalysis.confidenceLevel}
            </span>
          </div>
          <p className="text-sm">{realTimeAnalysis.suggestedPrompt}</p>
        </div>
      )}

      {/* セッション分析結果 */}
      {sessionAnalysis && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-3">音声セッション分析</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">感情状態:</span>
              <span className="ml-2">
                {getEmotionIcon(sessionAnalysis.emotion)} {sessionAnalysis.emotion}
              </span>
            </div>
            
            <div>
              <span className="font-medium">話すペース:</span>
              <span className="ml-2">{sessionAnalysis.speakingPace}</span>
            </div>
            
            <div>
              <span className="font-medium">理解度:</span>
              <span className="ml-2">{Math.round(sessionAnalysis.comprehensionLevel * 100)}%</span>
            </div>
            
            <div>
              <span className="font-medium">迷い:</span>
              <span className="ml-2">{sessionAnalysis.hesitationCount}回</span>
            </div>
          </div>

          {sessionAnalysis.keyPhrasesDetected.length > 0 && (
            <div className="mt-3">
              <span className="text-sm font-medium">検出されたキーワード:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {sessionAnalysis.keyPhrasesDetected.map((phrase, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ヘルプテキスト */}
      <div className="text-xs text-gray-500 text-center">
        <p>💡 考えを声に出すことで、理解を深めることができます</p>
        <p>マイクボタンを押して話してみてください</p>
      </div>
    </div>
  );
};

export default VoiceInputWidget;