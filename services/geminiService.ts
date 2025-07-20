
import { GoogleGenerativeAI, ChatSession, GenerateContentResult } from "@google/generative-ai";
import { AI_SYSTEM_PROMPT, generateEnhancedAIPrompt } from '../constants';
import { LearnerProfile } from '../services/enhancedEducationSystem';

// APIキーを環境変数から取得
const API_KEY = process.env.GEMINI_API_KEY || 
                process.env.VITE_GEMINI_API_KEY;

// APIキーの検証とエラーハンドリング
export const validateApiKey = (): { isValid: boolean; message: string } => {
  console.log('🔍 API_KEY check:', { 
    exists: !!API_KEY, 
    length: API_KEY?.length,
    first10: API_KEY?.substring(0, 10),
    processEnv: !!process.env.VITE_GEMINI_API_KEY,
    processGemini: !!process.env.GEMINI_API_KEY
  });
  
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here' || API_KEY.trim() === '') {
    return {
      isValid: false,
      message: 'APIキーが設定されていません。.envファイルでVITE_GEMINI_API_KEYを正しく設定してください。'
    };
  }
  
  // APIキーの形式をチェック（GoogleのAPIキーは通常AIzaで始まる）
  if (!API_KEY.startsWith('AIza') || API_KEY.length < 30) {
    return {
      isValid: false,
      message: 'APIキーの形式が正しくありません。有効なGoogle Gemini APIキーを設定してください。'
    };
  }
  
  return { isValid: true, message: 'APIキーが設定されています。' };
};

const { isValid: isApiKeyValid, message: apiKeyMessage } = validateApiKey();

if (!isApiKeyValid) {
  console.error(`🔑 ${apiKeyMessage}`);
}

let genAI: GoogleGenerativeAI | null = null;

try {
  if (isApiKeyValid && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log('✅ GoogleGenerativeAI初期化成功');
  } else {
    console.error('❌ GoogleGenerativeAI初期化スキップ - APIキー未設定');
  }
} catch (error) {
  console.error('❌ GoogleGenerativeAI初期化エラー:', error);
}

const model = 'gemini-1.5-flash';

// 基本チャットセッション（後方互換性用）
export const startChatSession = async (): Promise<ChatSession> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }
  
  try {
    const generativeModel = genAI.getGenerativeModel({ 
      model: model,
      systemInstruction: AI_SYSTEM_PROMPT
    });
    
    const chat = generativeModel.startChat({
      history: []
    });
    
    console.log('✅ チャットセッション開始成功');
    return chat;
  } catch (error) {
    console.error('❌ チャットセッション開始エラー:', error);
    throw new Error(`チャットセッションの開始に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
};

// 中学受験特化型チャットセッション
export const startEnhancedChatSession = async (
  topic: string, 
  subject: string, 
  learnerProfile?: LearnerProfile
): Promise<ChatSession> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }
  
  try {
    const enhancedPrompt = generateEnhancedAIPrompt(topic, subject, learnerProfile);
    
    const generativeModel = genAI.getGenerativeModel({ 
      model: model,
      systemInstruction: enhancedPrompt
    });
    
    const chat = generativeModel.startChat({
      history: []
    });
    
    console.log('✅ 中学受験特化チャットセッション開始成功', { topic, subject, grade: learnerProfile?.currentGrade });
    return chat;
  } catch (error) {
    console.error('❌ 中学受験特化チャットセッション開始エラー:', error);
    throw new Error(`中学受験特化チャットセッションの開始に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
};

export const sendMessageToChat = async (chat: ChatSession, messageText: string, retries: number = 3): Promise<string> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await chat.sendMessage(messageText);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.trim() === '') {
        console.error("Gemini API response is empty:", response);
        if (attempt < retries) {
          console.log(`空レスポンスのため${attempt + 1}回目を試行します...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return "AIからの応答が空でした。もう一度お試しください。";
      }
      
      console.log('✅ メッセージ送信成功');
      return text;
    } catch (error) {
      console.error(`❌ Gemini APIエラー (試行 ${attempt}/${retries}):`, error);
      
      if (error instanceof Error) {
        // APIキー関連のエラー（再試行しない）
        if (error.message.includes('API_KEY') || error.message.includes('authentication') || error.message.includes('403')) {
          throw new Error('APIキーが正しく設定されていません。設定画面でAPIキーを確認してください。');
        }
        
        // レート制限エラー（再試行しない）
        if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('429')) {
          throw new Error('API使用制限に達しました。しばらく時間をおいてからお試しください。');
        }
        
        // ネットワークエラー（再試行する）
        if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('timeout')) {
          if (attempt < retries) {
            console.log(`ネットワークエラーのため${attempt + 1}回目を試行します...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw new Error('ネットワーク接続に問題があります。インターネット接続を確認してください。');
        }
        
        // その他のエラー（最後の試行の場合のみスロー）
        if (attempt === retries) {
          throw new Error(`API通信エラー: ${error.message}`);
        }
      }
      
      // 一般的な再試行
      if (attempt < retries) {
        console.log(`エラーのため${attempt + 1}回目を試行します...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        throw new Error('AI応答の取得に失敗しました。しばらく時間をおいてからお試しください。');
      }
    }
  }
  
  throw new Error('最大試行回数に達しました。');
};

// 画像解析用の関数
export const analyzeImageWithGemini = async (imageDataUrl: string): Promise<string> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Base64データからMIMEタイプと純粋なBase64データを分離
    const [mimeInfo, base64Data] = imageDataUrl.split(',');
    const mimeType = mimeInfo.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

    const result = await model.generateContent([
      {
        text: "この画像を詳しく分析して、学習に関連する問題や内容があれば解説してください。"
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('画像解析エラー:', error);
    throw new Error(`画像解析に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
};
