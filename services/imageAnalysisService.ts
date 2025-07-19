import { GoogleGenAI } from '@google/genai';
import { ImageAnalysisResult, MessageAttachment } from '../types';
import { DETAILED_SUBJECTS, findSubUnitsByKeyword } from '../data/detailedCurriculum';

// 画像解析用のプロンプトテンプレート
const ANALYSIS_PROMPTS = {
  problemDetection: `
この画像は学習問題です。以下の点を分析してください：

1. **教科の特定**: 算数、国語、理科、社会のいずれか
2. **単元の推定**: 画像の内容から推定される具体的な学習単元
3. **問題の種類**: 計算問題、読解問題、選択問題、記述問題、図表問題など
4. **難易度レベル**: 1(基礎)から5(応用)までの5段階
5. **キーワード抽出**: 重要な数学的概念、語句、専門用語など
6. **解法アプローチ**: この問題を解くために必要な思考プロセス

回答は以下のJSON形式で返してください：
{
  "subject": "教科名",
  "topic": "推定単元",
  "subUnits": ["関連サブユニット1", "関連サブユニット2"],
  "problemType": "問題の種類",
  "difficultyLevel": 数値,
  "extractedText": "画像から読み取れるテキスト",
  "keyElements": ["キーワード1", "キーワード2"],
  "suggestedApproach": "推奨解法アプローチ",
  "confidence": 0.0から1.0の信頼度
}
`,

  detailedAnalysis: `
この問題について、さらに詳細な分析を行ってください：

1. **問題文の構造分析**: 
   - 与えられた条件は何か
   - 求められているものは何か
   - 制約条件はあるか

2. **必要な知識・技能**:
   - この問題を解くために必要な基礎知識
   - 必要な計算技能や思考技能
   - 前提となる学習内容

3. **段階的解法**:
   - ステップ1: 何から始めるべきか
   - ステップ2: 次に何をするか
   - ステップ3: 最終的な答えの導出

4. **類似問題の特徴**:
   - この問題と似た問題のパターン
   - 練習すべき類似問題の特徴
   - 応用可能な他の問題形式

JSON形式で詳細な分析結果を返してください。
`,

  errorAnalysis: `
学習者がこの問題でよく間違える点を分析してください：

1. **よくある間違い**: 
   - 計算ミス
   - 概念の誤解
   - 読み取りミス
   - 手順の間違い

2. **つまずきやすいポイント**:
   - 理解が困難な概念
   - 注意すべき点
   - 見落としやすい条件

3. **対策と指導ポイント**:
   - 間違いを防ぐための注意点
   - 理解を深めるための補足説明
   - 類似問題での練習ポイント

JSON形式で分析結果を返してください。
`
};

// APIキー取得（環境変数またはローカルストレージから）
const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
};

// 画像をGemini Vision APIで解析
export const analyzeImageWithGemini = async (
  imageDataUrl: string,
  analysisType: 'basic' | 'detailed' | 'error' = 'basic'
): Promise<ImageAnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini APIキーが設定されていません');
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Base64データからMIMEタイプと純粋なBase64データを分離
    const [mimeInfo, base64Data] = imageDataUrl.split(',');
    const mimeType = mimeInfo.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

    // 解析タイプに応じたプロンプト選択
    const prompt = analysisType === 'detailed' 
      ? ANALYSIS_PROMPTS.detailedAnalysis
      : analysisType === 'error'
      ? ANALYSIS_PROMPTS.errorAnalysis
      : ANALYSIS_PROMPTS.problemDetection;

    // Gemini Vision APIに送信
    const result = await model.generateContent([
      {
        text: prompt
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // JSONレスポンスをパース
    const analysisData = parseAnalysisResponse(text);
    
    // サブユニットの詳細マッチング
    const matchedSubUnits = findBestMatchingSubUnits(
      analysisData.keyElements,
      analysisData.subject
    );

    return {
      detectedSubject: analysisData.subject || '未特定',
      detectedTopic: analysisData.topic || '未特定',
      detectedSubUnits: matchedSubUnits,
      difficultyLevel: analysisData.difficultyLevel || 3,
      problemType: mapProblemType(analysisData.problemType),
      extractedText: analysisData.extractedText || '',
      keyElements: analysisData.keyElements || [],
      suggestedApproach: analysisData.suggestedApproach || '',
      confidence: analysisData.confidence || 0.7
    };

  } catch (error) {
    console.error('画像解析エラー:', error);
    
    // フォールバック: 基本的な分析結果を返す
    return {
      detectedSubject: '不明',
      detectedTopic: '解析できませんでした',
      detectedSubUnits: [],
      difficultyLevel: 3,
      problemType: 'mixed',
      extractedText: '',
      keyElements: [],
      suggestedApproach: '画像の解析に失敗しました。別の画像を試すか、手動で教科・単元を選択してください。',
      confidence: 0.1
    };
  }
};

// JSONレスポンスの解析
const parseAnalysisResponse = (responseText: string): any => {
  try {
    // JSONブロックを抽出（```json で囲まれている場合）
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                     responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    // JSON形式でない場合の簡易パース
    return parseNonJsonResponse(responseText);
    
  } catch (error) {
    console.error('レスポンス解析エラー:', error);
    return {};
  }
};

// 非JSON形式のレスポンスを解析
const parseNonJsonResponse = (text: string): any => {
  const result: any = {};
  
  // 教科の推定
  if (text.includes('算数') || text.includes('数学') || text.includes('計算')) {
    result.subject = '算数';
  } else if (text.includes('国語') || text.includes('読解') || text.includes('文章')) {
    result.subject = '国語';
  } else if (text.includes('理科') || text.includes('実験') || text.includes('観察')) {
    result.subject = '理科';
  } else if (text.includes('社会') || text.includes('地理') || text.includes('歴史')) {
    result.subject = '社会';
  }
  
  // キーワード抽出
  const keywords = [];
  const commonKeywords = ['分数', '小数', '割合', '比', '面積', '体積', '速さ', '時間'];
  for (const keyword of commonKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  result.keyElements = keywords;
  
  return result;
};

// 問題タイプのマッピング
const mapProblemType = (typeString: string): ImageAnalysisResult['problemType'] => {
  if (!typeString) return 'mixed';
  
  const lowerType = typeString.toLowerCase();
  if (lowerType.includes('計算') || lowerType.includes('calculation')) return 'calculation';
  if (lowerType.includes('選択') || lowerType.includes('multiple')) return 'multiple_choice';
  if (lowerType.includes('説明') || lowerType.includes('explanation')) return 'explanation';
  if (lowerType.includes('図') || lowerType.includes('diagram')) return 'diagram';
  
  return 'mixed';
};

// 最適なサブユニットをマッチング
const findBestMatchingSubUnits = (keyElements: string[], subject: string): string[] => {
  if (!keyElements || keyElements.length === 0) return [];
  
  const targetSubject = DETAILED_SUBJECTS.find(s => s.name === subject || s.id === subject);
  if (!targetSubject) return [];
  
  const matchedSubUnits: string[] = [];
  
  // 各キーワードに対してサブユニットを検索
  for (const keyword of keyElements) {
    const foundSubUnits = findSubUnitsByKeyword(keyword);
    
    // 対象教科のサブユニットのみを追加
    for (const subUnit of foundSubUnits) {
      const belongsToSubject = targetSubject.topics.some(topic => 
        topic.subUnits.some(su => su.id === subUnit.id)
      );
      
      if (belongsToSubject && !matchedSubUnits.includes(subUnit.name)) {
        matchedSubUnits.push(subUnit.name);
      }
    }
  }
  
  return matchedSubUnits.slice(0, 3); // 最大3個まで
};

// 複数の画像を一括解析
export const analyzeMultipleImages = async (
  attachments: MessageAttachment[]
): Promise<MessageAttachment[]> => {
  const results: MessageAttachment[] = [];
  
  for (const attachment of attachments) {
    if (attachment.type === 'image') {
      try {
        const analysisResult = await analyzeImageWithGemini(attachment.dataUrl);
        results.push({
          ...attachment,
          analysisResult
        });
      } catch (error) {
        console.error(`画像 ${attachment.fileName} の解析エラー:`, error);
        results.push(attachment); // 解析失敗時はそのまま追加
      }
    } else {
      results.push(attachment); // 画像以外はそのまま追加
    }
  }
  
  return results;
};

// 解析結果に基づく学習提案
export const generateLearningRecommendations = (
  analysisResult: ImageAnalysisResult
): {
  recommendedTopic: string;
  studyPlan: string[];
  practiceAreas: string[];
  nextSteps: string[];
} => {
  const { detectedSubject, detectedTopic, detectedSubUnits, difficultyLevel } = analysisResult;
  
  return {
    recommendedTopic: detectedTopic,
    studyPlan: [
      `${detectedSubject}の${detectedTopic}を重点的に学習`,
      `難易度レベル${difficultyLevel}の問題から始める`,
      '基礎概念の確認から応用まで段階的に進む'
    ],
    practiceAreas: detectedSubUnits.length > 0 
      ? detectedSubUnits.map(unit => `${unit}の理解と練習`)
      : ['基本概念の復習', '類似問題での練習', '応用問題への挑戦'],
    nextSteps: [
      '解析された問題の解法を理解する',
      '類似問題で練習を重ねる',
      '理解度を確認するテストを受ける',
      '間違いやすいポイントを復習する'
    ]
  };
};