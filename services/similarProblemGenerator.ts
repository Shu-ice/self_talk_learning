import { GoogleGenAI } from '@google/genai';
import { ImageAnalysisResult, Topic, SubUnit } from '../types';
import { DetailedProblemAnalysis } from './problemAnalysisEngine';

// 類題生成のオプション
export interface SimilarProblemOptions {
  difficultyAdjustment: 'easier' | 'same' | 'harder';
  variationType: 'numbers_only' | 'context_change' | 'method_variation' | 'comprehensive';
  numberOfProblems: number;
  includeHints: boolean;
  includeStepByStep: boolean;
  targetSkills: string[]; // 特に練習したいスキル
}

// 生成された類題
export interface GeneratedProblem {
  id: string;
  problemText: string;
  problemType: 'multiple_choice' | 'calculation' | 'explanation' | 'diagram' | 'mixed';
  difficultyLevel: number;
  estimatedTime: number; // 分
  hints: string[];
  stepByStepSolution: string[];
  correctAnswer: string;
  keyLearningPoints: string[];
  skillsTargeted: string[];
}

// 類題生成結果
export interface SimilarProblemSet {
  originalProblemSummary: string;
  generatedProblems: GeneratedProblem[];
  learningProgression: {
    currentLevel: number;
    nextLevel: number;
    progressionPath: string[];
  };
  practiceRecommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

// APIキー取得
const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || 
         process.env.VITE_GEMINI_API_KEY || 
         localStorage.getItem('GEMINI_API_KEY') || '';
};

// 類題生成のメイン関数
export const generateSimilarProblems = async (
  problemAnalysis: DetailedProblemAnalysis,
  options: SimilarProblemOptions
): Promise<SimilarProblemSet> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini APIキーが設定されていません');
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // プロンプトの構築
    const prompt = buildProblemGenerationPrompt(problemAnalysis, options);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // レスポンスをパースして構造化
    const problemSet = parseProblemGenerationResponse(text, problemAnalysis, options);

    return problemSet;

  } catch (error) {
    console.error('類題生成エラー:', error);
    
    // フォールバック: 基本的な類題セットを返す
    return generateFallbackProblemSet(problemAnalysis, options);
  }
};

// プロンプト構築
const buildProblemGenerationPrompt = (
  analysis: DetailedProblemAnalysis,
  options: SimilarProblemOptions
): string => {
  const { originalAnalysis, confirmedTopic, relevantSubUnits } = analysis;
  
  let prompt = `
あなたは中学受験指導の専門家です。以下の問題分析結果を基に、学習効果を最大化する類題を${options.numberOfProblems}問生成してください。

## 元の問題情報
- 教科: ${originalAnalysis.detectedSubject}
- 単元: ${originalAnalysis.detectedTopic}
- 問題タイプ: ${originalAnalysis.problemType}
- 難易度レベル: ${originalAnalysis.difficultyLevel}
- 抽出テキスト: ${originalAnalysis.extractedText}
- キーワード: ${originalAnalysis.keyElements.join('、')}

## 学習目標
`;

  if (confirmedTopic) {
    prompt += `
- 単元の学習目標: ${confirmedTopic.learningObjectives.join('、')}
- 評価基準: ${confirmedTopic.assessmentCriteria.join('、')}
`;
  }

  if (relevantSubUnits.length > 0) {
    prompt += `
- 関連サブユニット: ${relevantSubUnits.map(su => `${su.name}(${su.description})`).join('、')}
`;
  }

  prompt += `
## 生成条件
- 難易度調整: ${options.difficultyAdjustment}
- 変化の種類: ${options.variationType}
- 対象スキル: ${options.targetSkills.join('、')}
- ヒント付与: ${options.includeHints ? 'あり' : 'なし'}
- 段階的解法: ${options.includeStepByStep ? 'あり' : 'なし'}

## 生成要件

### 1. 難易度調整指針
${getDifficultyGuidance(options.difficultyAdjustment)}

### 2. 変化の種類に応じた方針
${getVariationGuidance(options.variationType)}

### 3. 出力形式
以下のJSON形式で各問題を生成してください：

\`\`\`json
{
  "problems": [
    {
      "id": "problem_1",
      "problemText": "問題文（具体的で明確に）",
      "problemType": "問題タイプ",
      "difficultyLevel": 数値,
      "estimatedTime": 推定解答時間（分）,
      "hints": ["ヒント1", "ヒント2"],
      "stepByStepSolution": ["手順1", "手順2", "手順3"],
      "correctAnswer": "正答",
      "keyLearningPoints": ["学習ポイント1", "学習ポイント2"],
      "skillsTargeted": ["対象スキル1", "対象スキル2"]
    }
  ],
  "learningProgression": {
    "currentLevel": 現在のレベル,
    "nextLevel": 次のレベル,
    "progressionPath": ["ステップ1", "ステップ2"]
  },
  "practiceRecommendations": {
    "immediate": ["即座に実践すべきこと"],
    "shortTerm": ["短期目標"],
    "longTerm": ["長期目標"]
  }
}
\`\`\`

## 重要な注意点
1. 元の問題の本質的な学習目標を保持する
2. 中学受験レベルに適した問題にする
3. 段階的な習熟を促す構成にする
4. 実際に解けるよう具体的で明確な問題文にする
5. 各問題で異なる角度から同じ概念を扱う
6. 計算問題の場合は実際に計算可能な数値を使用する
`;

  return prompt;
};

// 難易度調整のガイダンス
const getDifficultyGuidance = (adjustment: string): string => {
  switch (adjustment) {
    case 'easier':
      return `- 数値を簡単にする
- 手順を減らす
- より直接的な問題にする
- 計算の複雑さを下げる`;
    
    case 'harder':
      return `- より複雑な数値や条件を使用
- 複数のステップを要する問題にする
- 応用的な思考を必要とする
- 複合的な概念を組み合わせる`;
    
    default: // 'same'
      return `- 元の問題と同等の難易度を維持
- 同じレベルの思考プロセスを要求
- 類似の計算複雑度を保持`;
  }
};

// 変化タイプのガイダンス
const getVariationGuidance = (variationType: string): string => {
  switch (variationType) {
    case 'numbers_only':
      return `- 問題の構造は同じで数値のみを変更
- 解法パターンは完全に同一
- 異なる答えになるよう数値を調整`;
    
    case 'context_change':
      return `- 同じ数学的概念を異なる場面で適用
- 日常生活の様々な場面を設定
- 本質的な構造は保持`;
    
    case 'method_variation':
      return `- 複数の解法が可能な問題を作成
- 異なるアプローチで解ける問題
- 思考の柔軟性を養う設計`;
    
    default: // 'comprehensive'
      return `- 上記すべての要素を組み合わせ
- 多角的な理解を促進
- 段階的な難易度上昇を含む`;
  }
};

// レスポンスの解析
const parseProblemGenerationResponse = (
  responseText: string,
  analysis: DetailedProblemAnalysis,
  options: SimilarProblemOptions
): SimilarProblemSet => {
  try {
    // JSONブロックを抽出
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                     responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      
      return {
        originalProblemSummary: generateProblemSummary(analysis),
        generatedProblems: data.problems || [],
        learningProgression: data.learningProgression || getDefaultProgression(analysis),
        practiceRecommendations: data.practiceRecommendations || getDefaultRecommendations()
      };
    }
    
    // JSON形式でない場合のフォールバック
    return generateFallbackProblemSet(analysis, options);
    
  } catch (error) {
    console.error('レスポンス解析エラー:', error);
    return generateFallbackProblemSet(analysis, options);
  }
};

// 問題概要の生成
const generateProblemSummary = (analysis: DetailedProblemAnalysis): string => {
  const { originalAnalysis, confirmedTopic } = analysis;
  
  return `${originalAnalysis.detectedSubject}の${confirmedTopic?.name || originalAnalysis.detectedTopic}に関する問題（難易度レベル${originalAnalysis.difficultyLevel}）`;
};

// デフォルトの学習進行
const getDefaultProgression = (analysis: DetailedProblemAnalysis) => {
  const currentLevel = analysis.originalAnalysis.difficultyLevel;
  
  return {
    currentLevel,
    nextLevel: Math.min(5, currentLevel + 1),
    progressionPath: [
      '基本概念の理解',
      '解法パターンの習得',
      '応用力の向上',
      '習熟度の定着'
    ]
  };
};

// デフォルトの練習推奨
const getDefaultRecommendations = () => {
  return {
    immediate: [
      '生成された類題を順番に解く',
      '間違えた問題は解法を確認',
      '時間を測って解答練習'
    ],
    shortTerm: [
      '類似問題のパターンを覚える',
      '計算スピードを向上させる',
      '応用問題にチャレンジ'
    ],
    longTerm: [
      '単元全体の習熟',
      '他の単元との関連付け',
      '実際の入試問題での実践'
    ]
  };
};

// フォールバック用の問題セット生成
const generateFallbackProblemSet = (
  analysis: DetailedProblemAnalysis,
  options: SimilarProblemOptions
): SimilarProblemSet => {
  const fallbackProblems: GeneratedProblem[] = [];
  
  for (let i = 0; i < options.numberOfProblems; i++) {
    fallbackProblems.push({
      id: `fallback_problem_${i + 1}`,
      problemText: `${analysis.confirmedTopic?.name || '該当単元'}の類似問題 ${i + 1}`,
      problemType: analysis.originalAnalysis.problemType,
      difficultyLevel: analysis.originalAnalysis.difficultyLevel,
      estimatedTime: 10,
      hints: ['基本的な概念を思い出してみましょう'],
      stepByStepSolution: ['問題を読む', '解法を考える', '計算する', '答えを確認する'],
      correctAnswer: '解答例',
      keyLearningPoints: ['基本概念の理解'],
      skillsTargeted: options.targetSkills
    });
  }
  
  return {
    originalProblemSummary: generateProblemSummary(analysis),
    generatedProblems: fallbackProblems,
    learningProgression: getDefaultProgression(analysis),
    practiceRecommendations: getDefaultRecommendations()
  };
};

// 特定のスキルに焦点を当てた類題生成
export const generateSkillSpecificProblems = async (
  skill: string,
  currentLevel: number,
  targetLevel: number,
  numberOfProblems: number = 3
): Promise<GeneratedProblem[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini APIキーが設定されていません');
  }

  const prompt = `
${skill}のスキル向上に特化した練習問題を${numberOfProblems}問生成してください。

現在のレベル: ${currentLevel}
目標レベル: ${targetLevel}

レベル${currentLevel}からレベル${targetLevel}への段階的な習熟を促す問題セットを作成し、
以下のJSON形式で出力してください：

\`\`\`json
{
  "problems": [
    {
      "id": "skill_problem_1",
      "problemText": "問題文",
      "difficultyLevel": レベル,
      "skillsTargeted": ["${skill}"],
      "hints": ["ヒント"],
      "stepByStepSolution": ["解法手順"],
      "correctAnswer": "正答"
    }
  ]
}
\`\`\`
`;

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                     text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      return data.problems || [];
    }

    return [];

  } catch (error) {
    console.error('スキル特化問題生成エラー:', error);
    return [];
  }
};

// 理解度確認テストの生成
export const generateComprehensionTest = async (
  topic: Topic,
  userLevel: number
): Promise<{
  questions: GeneratedProblem[];
  evaluationCriteria: string[];
  passingScore: number;
}> => {
  const comprehensionQuestions: GeneratedProblem[] = [];
  
  // 各サブユニットから1問ずつ理解度確認問題を生成
  for (let i = 0; i < Math.min(topic.subUnits.length, 5); i++) {
    const subUnit = topic.subUnits[i];
    
    const question: GeneratedProblem = {
      id: `comprehension_${subUnit.id}`,
      problemText: `${subUnit.name}の理解度を確認する問題`,
      problemType: 'explanation',
      difficultyLevel: Math.min(userLevel, subUnit.difficultyRange[1]),
      estimatedTime: 5,
      hints: ['基本概念から考えてみましょう'],
      stepByStepSolution: ['概念を思い出す', '具体例を考える', '説明をまとめる'],
      correctAnswer: '理解の証明',
      keyLearningPoints: [subUnit.name],
      skillsTargeted: subUnit.keywordTags
    };
    
    comprehensionQuestions.push(question);
  }
  
  return {
    questions: comprehensionQuestions,
    evaluationCriteria: topic.assessmentCriteria,
    passingScore: 70 // 70%以上で合格
  };
};