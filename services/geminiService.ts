
import { GoogleGenerativeAI, ChatSession, GenerateContentResult } from "@google/generative-ai";
import { AI_SYSTEM_PROMPT, generateEnhancedAIPrompt } from '../constants';
import { RealTimeLearningAnalysis } from './realTimeLearningAnalyzer';
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

// 動的難易度調整システム
const adjustDifficultyBasedOnPerformance = (learnerProfile: any, recentPerformance: any) => {
  const performanceScore = recentPerformance?.averageScore || 0.5;
  const responseTime = recentPerformance?.averageResponseTime || 30;
  
  let adjustmentLevel = 0;
  
  // パフォーマンスベース調整
  if (performanceScore > 0.8 && responseTime < 20) {
    adjustmentLevel = 1; // 難易度アップ
  } else if (performanceScore < 0.4 || responseTime > 60) {
    adjustmentLevel = -1; // 難易度ダウン
  }
  
  return {
    level: Math.max(1, Math.min(10, (learnerProfile?.currentLevel || 5) + adjustmentLevel)),
    reason: adjustmentLevel > 0 ? '好調なパフォーマンスのため難易度を上げました' :
            adjustmentLevel < 0 ? '理解促進のため難易度を下げました' :
            '現在のレベルを維持します'
  };
};

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

// 超高精度中学受験特化型チャットセッション
export const startEnhancedChatSession = async (
  topic: string, 
  subject: string, 
  learnerProfile?: LearnerProfile,
  recentPerformance?: any
): Promise<ChatSession> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }
  
  try {
    // 動的難易度調整
    const difficultyAdjustment = adjustDifficultyBasedOnPerformance(learnerProfile, recentPerformance);
    
    // 学習者状態の超精密分析
    const learnerState = analyzeLearnerState(learnerProfile, recentPerformance);
    
    // コンテキスト深化システム適用
    const deepContextPrompt = await generateDeepContextPrompt(topic, subject, learnerProfile, learnerState, difficultyAdjustment);
    
    const generativeModel = genAI.getGenerativeModel({ 
      model: model,
      systemInstruction: deepContextPrompt,
      generationConfig: {
        temperature: 0.3, // より安定した回答
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048, // より詳細な回答を可能に
      }
    });
    
    const chat = generativeModel.startChat({
      history: []
    });
    
    console.log('✅ 超高精度中学受験特化チャットセッション開始成功', { 
      topic, 
      subject, 
      grade: learnerProfile?.currentGrade,
      difficultyLevel: difficultyAdjustment.level,
      learnerState: learnerState.status
    });
    return chat;
  } catch (error) {
    console.error('❌ 超高精度中学受験特化チャットセッション開始エラー:', error);
    throw new Error(`超高精度中学受験特化チャットセッションの開始に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
};

// 学習者状態の超精密分析エンジン
const analyzeLearnerState = (learnerProfile: any, recentPerformance: any) => {
  const currentTime = new Date().getHours();
  const performance = recentPerformance || {};
  
  // 集中度分析
  const concentrationLevel = 
    (performance.averageResponseTime < 25 ? 0.8 : 0.5) +
    (performance.averageScore > 0.7 ? 0.2 : -0.1) +
    (currentTime >= 9 && currentTime <= 11 || currentTime >= 15 && currentTime <= 17 ? 0.1 : -0.1);
  
  // 理解度分析
  const comprehensionLevel = 
    Math.min(1, (performance.averageScore || 0.5) + 
             (performance.consistencyScore || 0.5) * 0.3);
  
  // 学習モチベーション分析
  const motivationLevel = 
    Math.min(1, (performance.engagementScore || 0.5) +
             (performance.streakDays || 0) * 0.05 +
             (performance.recentProgress || 0) * 0.3);
  
  // 総合状態判定
  const overallScore = (concentrationLevel + comprehensionLevel + motivationLevel) / 3;
  
  let status = 'optimal';
  if (overallScore < 0.4) status = 'struggling';
  else if (overallScore < 0.6) status = 'developing';
  else if (overallScore > 0.8) status = 'excelling';
  
  return {
    status,
    concentrationLevel,
    comprehensionLevel,
    motivationLevel,
    overallScore,
    recommendations: generateStateBasedRecommendations(status, concentrationLevel, comprehensionLevel, motivationLevel)
  };
};

// 状態ベース推奨システム
const generateStateBasedRecommendations = (status: string, concentration: number, comprehension: number, motivation: number) => {
  const recommendations = [];
  
  if (concentration < 0.5) {
    recommendations.push('短時間集中型の学習アプローチを採用');
    recommendations.push('休憩タイミングを積極的に提案');
  }
  
  if (comprehension < 0.5) {
    recommendations.push('基礎概念の丁寧な復習を重視');
    recommendations.push('具体例を多用した説明を提供');
  }
  
  if (motivation < 0.5) {
    recommendations.push('達成感を感じられる小目標を設定');
    recommendations.push('激励とポジティブフィードバックを増加');
  }
  
  if (status === 'excelling') {
    recommendations.push('発展的な内容にチャレンジ');
    recommendations.push('応用問題と思考力強化を重視');
  }
  
  return recommendations;
};

// 深化コンテキストプロンプト生成
const generateDeepContextPrompt = async (
  topic: string, 
  subject: string, 
  learnerProfile: any, 
  learnerState: any, 
  difficultyAdjustment: any
): Promise<string> => {
  const basePrompt = generateEnhancedAIPrompt(topic, subject, learnerProfile);
  
  const deepEnhancements = `

【超高精度指導システム】

■ 学習者状態分析結果:
- 総合状態: ${learnerState.status}
- 集中度レベル: ${Math.round(learnerState.concentrationLevel * 100)}%
- 理解度レベル: ${Math.round(learnerState.comprehensionLevel * 100)}%
- モチベーション: ${Math.round(learnerState.motivationLevel * 100)}%
- 推奨アプローチ: ${learnerState.recommendations.join('、')}

■ 動的難易度調整:
- 現在レベル: ${difficultyAdjustment.level}/10
- 調整理由: ${difficultyAdjustment.reason}

■ 回答品質基準:
1. 【必須】段階的な説明構造（理解→練習→応用）
2. 【必須】具体例と抽象概念の両方を含める
3. 【必須】理解確認のための質問を含める
4. 【推奨】関連知識との繋がりを明示
5. 【推奨】記憶に残る学習ポイントを強調

■ 特別指示:
- 学習者の${learnerState.status}状態に最適化された指導を行う
- 回答は必ず200文字以上、構造化された形式で提供
- 理解度確認と励ましのメッセージを含める
- 次のステップや発展学習の方向性を示唆する`;
  
  return basePrompt + deepEnhancements;
};

// 多段階検証・自己修正機能付きメッセージ送信
export const sendMessageToChat = async (chat: ChatSession, messageText: string, retries: number = 3): Promise<string> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }
  
  // コンテキスト強化されたメッセージに変換
  const enhancedMessage = await enhanceMessageContext(messageText);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await chat.sendMessage(enhancedMessage);
      const response = await result.response;
      let text = response.text();
      
      if (!text || text.trim() === '') {
        console.error("Gemini API response is empty:", response);
        if (attempt < retries) {
          console.log(`空レスポンスのため${attempt + 1}回目を試行します...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return "AIからの応答が空でした。もう一度お試しください。";
      }
      
      // 多段階検証・品質チェック
      const validationResult = await validateAndImproveResponse(text, messageText);
      if (validationResult.needsImprovement && attempt < retries) {
        console.log(`回答品質改善のため再生成します (${validationResult.reason})`);
        // 改善指示を含めて再送信
        const improvementPrompt = `前回の回答: "${text}"

改善点: ${validationResult.reason}

元の質問: ${messageText}

より正確で分かりやすい回答を提供してください。`;
        const improvedResult = await chat.sendMessage(improvementPrompt);
        const improvedResponse = await improvedResult.response;
        text = improvedResponse.text();
      }
      
      // 最終的な回答の後処理
      const finalText = await postProcessResponse(text, messageText);
      
      console.log('✅ メッセージ送信成功 (品質検証済み)');
      return finalText;
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

// コンテキスト理解深化システム
const enhanceMessageContext = async (messageText: string): Promise<string> => {
  // 学習コンテキストの分析
  const contextAnalysis = analyzeMessageContext(messageText);
  
  let enhancedMessage = messageText;
  
  // 質問意図の明確化
  if (contextAnalysis.isQuestion && !contextAnalysis.isSpecific) {
    enhancedMessage = `【質問の詳細化】
${messageText}

※ 具体的で段階的な説明を求めています。理解レベルに応じた解説をお願いします。`;
  }
  
  // 計算問題の場合は解法プロセス強化
  if (contextAnalysis.isMathProblem) {
    enhancedMessage = `【数学問題解法】
${messageText}

※ 以下の構造で回答してください：
1. 問題理解の確認
2. 解法の選択と理由
3. 段階的な計算過程
4. 答えの確認と別解法
5. 類似問題への応用`;
  }
  
  // 理科実験・現象の場合は原理説明強化
  if (contextAnalysis.isScienceTopic) {
    enhancedMessage = `【理科学習】
${messageText}

※ 以下の観点で詳しく説明してください：
1. 現象・実験の観察ポイント
2. 科学的原理・法則
3. 日常生活での例
4. 実験や観察での注意点
5. 関連する発展内容`;
  }
  
  // 国語読解の場合は思考プロセス強化
  if (contextAnalysis.isLanguageArts) {
    enhancedMessage = `【国語読解】
${messageText}

※ 以下の手順で解説してください：
1. 文章の要点整理
2. 設問の意図分析
3. 根拠となる箇所の特定
4. 解答の組み立て方
5. 表現技法や語彙の解説`;
  }
  
  // 社会科の場合は関連性・因果関係強化
  if (contextAnalysis.isSocialStudies) {
    enhancedMessage = `【社会科学習】
${messageText}

※ 以下の観点で説明してください：
1. 基本的な事実・概念
2. 時代背景・地理的条件
3. 原因と結果の関係
4. 現代への影響・つながり
5. 関連する他の出来事・地域`;
  }
  
  return enhancedMessage;
};

// メッセージコンテキスト分析
const analyzeMessageContext = (messageText: string) => {
  const isQuestion = /[？?]|教えて|説明|解説|どう|なぜ|何|いつ|どこ|だれ|どれ|どの/.test(messageText);
  const isSpecific = messageText.length > 20 && /具体的|詳しく|例|方法|手順/.test(messageText);
  const isMathProblem = /計算|解け|求め|式|答え|\d+|＋|－|×|÷|＝/.test(messageText);
  const isScienceTopic = /実験|観察|現象|原理|法則|化学|物理|生物|地学/.test(messageText);
  const isLanguageArts = /読解|文章|物語|詩|作者|主人公|表現|修辞/.test(messageText);
  const isSocialStudies = /歴史|地理|政治|経済|文化|社会|時代|戦争|革命/.test(messageText);
  
  return {
    isQuestion,
    isSpecific,
    isMathProblem,
    isScienceTopic,
    isLanguageArts,
    isSocialStudies
  };
};

// 回答品質検証・改善システム
const validateAndImproveResponse = async (response: string, originalQuestion: string) => {
  const issues = [];
  
  // 基本的な品質チェック
  if (response.length < 50) {
    issues.push('回答が短すぎて詳細な説明が不足している');
  }
  
  if (!response.includes('\n') && response.length > 200) {
    issues.push('構造化された説明が必要（段落分けや箇条書き）');
  }
  
  // 数学問題の場合の特別チェック
  if (/計算|解け|求め/.test(originalQuestion)) {
    if (!/\d/.test(response)) {
      issues.push('数値的な答えが含まれていない');
    }
    if (!/(解法|手順|過程)/.test(response)) {
      issues.push('解法の説明が不足している');
    }
  }
  
  // 理科問題の場合の特別チェック
  if (/実験|現象|原理/.test(originalQuestion)) {
    if (!/(原因|理由|仕組み)/.test(response)) {
      issues.push('科学的な理由・原理の説明が不足している');
    }
  }
  
  // 理解度チェック
  if (originalQuestion.includes('わからない') || originalQuestion.includes('理解できない')) {
    if (!/(例|具体的|簡単)/.test(response)) {
      issues.push('理解困難な学習者に対する配慮が不足している');
    }
  }
  
  return {
    needsImprovement: issues.length > 0,
    reason: issues.join('、'),
    qualityScore: Math.max(0, 100 - issues.length * 20)
  };
};

// 回答後処理・最適化システム
const postProcessResponse = async (response: string, originalQuestion: string): Promise<string> => {
  let processedResponse = response;
  
  // 構造化改善
  if (processedResponse.length > 300 && !processedResponse.includes('\n\n')) {
    // 自然な段落分けを追加
    processedResponse = processedResponse
      .replace(/(。)([あ-ん一-龯])/g, '$1\n\n$2')
      .replace(/([：:])([^\n])/g, '$1\n$2');
  }
  
  // 重要ポイントの強調
  processedResponse = processedResponse
    .replace(/(重要|ポイント|注意)([^\n]*)/g, '**$1$2**')
    .replace(/(答え|結論)[：:]?\s*([^\n。]+)/g, '**【答え】$2**');
  
  // 学習者への配慮メッセージ追加
  if (originalQuestion.includes('わからない')) {
    processedResponse += '\n\n💡 **学習のヒント**: まだ分からないことがあれば、遠慮なく質問してくださいね！一緒に理解を深めていきましょう。';
  }
  
  // 発展学習の提案
  if (/計算|解け|求め/.test(originalQuestion)) {
    processedResponse += '\n\n🚀 **発展学習**: 類似問題にも挑戦してみませんか？解法パターンを身につけることで、より確実に問題を解けるようになります。';
  }
  
  return processedResponse;
};

// 超高精度画像解析システム
export const analyzeImageWithGemini = async (imageDataUrl: string, context?: string): Promise<string> => {
  if (!genAI) {
    throw new Error(`APIキーエラー: ${apiKeyMessage}`);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2, // より正確な分析
        topP: 0.9,
        maxOutputTokens: 1024
      }
    });

    // Base64データからMIMEタイプと純粋なBase64データを分離
    const [mimeInfo, base64Data] = imageDataUrl.split(',');
    const mimeType = mimeInfo.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

    // 超高精度分析プロンプト
    const analysisPrompt = `【画像の超詳細分析】

以下の観点で画像を分析してください：

1. 【問題識別】
   - 数学問題、理科実験、国語文章、社会資料などの識別
   - 問題の種類と難易度レベル

2. 【内容解析】
   - 文字情報の正確な読み取り
   - 図表・グラフ・写真の詳細分析
   - 重要なポイントの特定

3. 【教育的解説】
   - 学習内容の段階的説明
   - 解答方法と思考プロセス
   - 関連する基礎概念

4. 【学習支援】
   - つまずきやすいポイント
   - 理解を深めるヒント
   - 類似問題への応用

${context ? `\n【追加コンテキスト】\n${context}\n` : ''}

構造化された分かりやすい解説を提供してください。`;

    const result = await model.generateContent([
      {
        text: analysisPrompt
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    let analysisResult = response.text();
    
    // 結果の後処理・品質向上
    analysisResult = await postProcessImageAnalysis(analysisResult);
    
    return analysisResult;
  } catch (error) {
    console.error('画像解析エラー:', error);
    throw new Error(`画像解析に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
};

// 画像解析結果の後処理システム
const postProcessImageAnalysis = async (analysis: string): Promise<string> => {
  let processedAnalysis = analysis;
  
  // 構造化改善
  if (!processedAnalysis.includes('【') && !processedAnalysis.includes('##')) {
    processedAnalysis = processedAnalysis
      .replace(/(問題|内容|解答|ヒント)[：:]?/g, '\n\n**【$1】**\n')
      .replace(/(\d+\.\s)/g, '\n$1');
  }
  
  // 重要情報の強調
  processedAnalysis = processedAnalysis
    .replace(/(答え|結論|重要)[：:]?\s*([^\n。]+)/g, '🎯 **$1**: $2')
    .replace(/(注意|ポイント|コツ)[：:]?\s*([^\n。]+)/g, '💡 **$1**: $2');
  
  // 学習支援メッセージ追加
  processedAnalysis += '\n\n📚 **学習のコツ**: 画像の内容について質問があれば、いつでも聞いてくださいね！一緒に理解を深めていきましょう。';
  
  return processedAnalysis;
};

// 自動品質評価システム
export const evaluateResponseQuality = async (response: string, originalQuestion: string): Promise<{
  score: number;
  feedback: string[];
  suggestions: string[];
}> => {
  const metrics = {
    length: response.length,
    structure: (response.match(/\n/g) || []).length > 2,
    examples: /例|具体的|つまり|たとえば/.test(response),
    encouragement: /頑張|一緒|応援|できる|大丈夫/.test(response),
    clarity: response.split('。').filter(s => s.length > 10).length
  };
  
  let score = 60; // ベーススコア
  const feedback = [];
  const suggestions = [];
  
  // 長さ評価
  if (metrics.length > 200) score += 10;
  else if (metrics.length < 100) {
    score -= 20;
    feedback.push('回答が短すぎます');
    suggestions.push('より詳しい説明を追加してください');
  }
  
  // 構造評価
  if (metrics.structure) score += 15;
  else {
    feedback.push('構造化された説明が不足');
    suggestions.push('段落分けや箇条書きで整理してください');
  }
  
  // 具体例評価
  if (metrics.examples) score += 15;
  else {
    feedback.push('具体例が不足');
    suggestions.push('理解しやすい例を追加してください');
  }
  
  // 励まし評価
  if (metrics.encouragement) score += 10;
  else {
    suggestions.push('学習者への励ましを含めてください');
  }
  
  return {
    score: Math.min(100, Math.max(0, score)),
    feedback,
    suggestions
  };
};
