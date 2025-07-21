// 🔧 回答検証統合システム
// Answer Validation Integration System - AIと数値判定の完璧な連携

import { precisionAnswerJudgment, AnswerComparisonResult } from './precisionAnswerJudgment';
import { sendMessageToChat } from './geminiService';
import { ChatSession } from '@google/generative-ai';

export interface ValidationConfig {
  useClientSideValidation: boolean;
  numericTolerance: number;
  allowFractions: boolean;
  allowPercentages: boolean;
  strictMode: boolean; // 完全一致のみ「正解」とする
}

export interface EnhancedChatResponse {
  aiResponse: string;
  validationResult: AnswerComparisonResult | null;
  finalFeedback: string;
  wasOverridden: boolean;
  debugInfo?: any;
}

export class AnswerValidationIntegration {
  
  private config: ValidationConfig = {
    useClientSideValidation: true,
    numericTolerance: 0.0001,
    allowFractions: true,
    allowPercentages: true,
    strictMode: true
  };
  
  // 🎯 設定更新
  public updateConfig(newConfig: Partial<ValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 回答検証設定更新:', this.config);
  }
  
  // 🎯 強化された回答評価（AI+数値検証の統合）
  public async validateAnswerWithAI(
    chat: ChatSession,
    studentAnswer: string,
    message: string,
    expectedAnswer?: string | number,
    problemContext?: string
  ): Promise<EnhancedChatResponse> {
    
    console.log('🔍 統合回答検証開始:', { studentAnswer, expectedAnswer, problemContext });
    
    let validationResult: AnswerComparisonResult | null = null;
    let wasOverridden = false;
    
    // ステップ1: クライアント側数値検証（正解が分かっている場合）
    if (this.config.useClientSideValidation && expectedAnswer !== undefined) {
      validationResult = precisionAnswerJudgment.judgeAnswerFlexible(
        studentAnswer,
        expectedAnswer,
        {
          allowFractions: this.config.allowFractions,
          allowPercentages: this.config.allowPercentages,
          tolerance: this.config.numericTolerance
        }
      );
      
      console.log('✅ クライアント側検証完了:', validationResult);
      
      // 厳密モード：完全一致を検出した場合はAI判定をオーバーライド
      if (this.config.strictMode && validationResult.isExactMatch) {
        console.log('🎯 完全一致検出 - AI判定をオーバーライド');
        return {
          aiResponse: '', // AIレスポンスは不要
          validationResult,
          finalFeedback: this.generatePositiveFeedback(validationResult, problemContext),
          wasOverridden: true,
          debugInfo: { reason: 'exact_match_override', config: this.config }
        };
      }
    }
    
    // ステップ2: AI評価実行
    const aiResponse = await this.getAIResponseWithRetry(chat, message);
    
    // ステップ3: AI応答の検証と修正
    const correctedResponse = this.correctAIResponse(
      aiResponse,
      validationResult,
      studentAnswer,
      expectedAnswer
    );
    
    return {
      aiResponse,
      validationResult,
      finalFeedback: correctedResponse,
      wasOverridden: correctedResponse !== aiResponse,
      debugInfo: {
        originalAI: aiResponse,
        corrected: correctedResponse,
        validationUsed: !!validationResult
      }
    };
  }
  
  // 🎯 AIレスポンス修正ロジック
  private correctAIResponse(
    aiResponse: string,
    validationResult: AnswerComparisonResult | null,
    studentAnswer: string,
    expectedAnswer?: string | number
  ): string {
    
    if (!validationResult) {
      return aiResponse; // 検証結果がない場合はAI応答をそのまま使用
    }
    
    // 致命的誤判定の検出と修正
    const isAIIncorrect = this.detectAIMisjudgment(aiResponse, validationResult);
    
    if (isAIIncorrect) {
      console.log('🚨 AI誤判定を検出 - 修正します');
      return this.generateCorrectedResponse(validationResult, aiResponse, studentAnswer);
    }
    
    return aiResponse;
  }
  
  // 🎯 AI誤判定の検出
  private detectAIMisjudgment(
    aiResponse: string,
    validationResult: AnswerComparisonResult
  ): boolean {
    
    const response = aiResponse.toLowerCase();
    
    // パターン1: 完全一致なのに「惜しい」「近い」と言っている
    if (validationResult.isExactMatch) {
      if (
        response.includes('惜し') ||
        response.includes('近い') ||
        response.includes('もう少し') ||
        response.includes('間違') ||
        response.includes('違') ||
        response.includes('ミス') ||
        response.includes('確認') ||
        response.includes('見直し') ||
        /\d.*違/.test(response) // 「4.8と違う」のようなパターン
      ) {
        console.log('🚨 誤判定パターン1: 完全一致を「惜しい」と判定');
        return true;
      }
    }
    
    // パターン2: 完全一致なのに「正解」と言っていない
    if (validationResult.isExactMatch) {
      if (
        !response.includes('正解') &&
        !response.includes('正しい') &&
        !response.includes('正確') &&
        !response.includes('完璧') &&
        !response.includes('素晴らしい') &&
        !response.includes('よくできました') &&
        !response.includes('その通り')
      ) {
        console.log('🚨 誤判定パターン2: 完全一致なのに正解扱いしていない');
        return true;
      }
    }
    
    return false;
  }
  
  // 🎯 修正レスポンス生成
  private generateCorrectedResponse(
    validationResult: AnswerComparisonResult,
    originalAI: string,
    studentAnswer: string
  ): string {
    
    if (validationResult.isExactMatch) {
      const positiveResponse = validationResult.feedback;
      
      // 元のAI応答から有用な部分（説明など）を抽出
      const explanation = this.extractExplanationFromAI(originalAI);
      
      return `${positiveResponse}${explanation ? ' ' + explanation : ''}
      
🤖 システム補正: 数値検証により完全一致を確認しました。`;
    }
    
    if (validationResult.isNearMatch) {
      return `${validationResult.feedback} ${validationResult.explanation}
      
${this.extractExplanationFromAI(originalAI)}`;
    }
    
    return originalAI; // その他の場合は元のAI応答
  }
  
  // 🎯 元のAI応答から説明部分を抽出
  private extractExplanationFromAI(aiResponse: string): string {
    // 「なぜなら」「理由は」などの説明部分を抽出
    const explanationPatterns = [
      /なぜなら[^。]*。/g,
      /理由は[^。]*。/g,
      /これは[^。]*。/g,
      /[^。]*について[^。]*。/g
    ];
    
    const explanations: string[] = [];
    
    for (const pattern of explanationPatterns) {
      const matches = aiResponse.match(pattern);
      if (matches) {
        explanations.push(...matches);
      }
    }
    
    return explanations.join(' ');
  }
  
  // 🎯 ポジティブフィードバック生成
  private generatePositiveFeedback(
    validationResult: AnswerComparisonResult,
    problemContext?: string
  ): string {
    
    const baseMessage = validationResult.feedback;
    
    const encouragements = [
      'とても正確に計算できましたね！',
      'この調子で次の問題も頑張りましょう！',
      '計算力が身についていますね！',
      '素晴らしい集中力です！',
      '正確な答えが出せています！'
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    return `${baseMessage}

${randomEncouragement}

${problemContext ? `この「${problemContext}」の問題は完璧に解けました。` : ''}

次の学習に進みましょう！何か質問はありますか？`;
  }
  
  // 🎯 AIレスポンス取得（リトライ機能付き）
  private async getAIResponseWithRetry(
    chat: ChatSession,
    message: string,
    maxRetries: number = 2
  ): Promise<string> {
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await sendMessageToChat(chat, message);
        
        if (response && response.trim().length > 0) {
          return response;
        }
        
        console.log(`🔄 AI応答が空です。再試行 ${attempt}/${maxRetries}`);
        
      } catch (error) {
        console.error(`❌ AI応答取得エラー (試行 ${attempt}/${maxRetries}):`, error);
        
        if (attempt === maxRetries) {
          throw new Error(`AI応答の取得に失敗しました: ${error}`);
        }
        
        // 少し待ってからリトライ
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error('最大試行回数に達しました');
  }
  
  // 🎯 デバッグモード切り替え
  public enableDebugMode(enabled: boolean = true): void {
    if (enabled) {
      console.log('🐛 回答検証デバッグモード有効');
    }
  }
  
  // 🎯 統計情報取得
  public getValidationStats(): {
    totalValidations: number;
    exactMatches: number;
    nearMatches: number;
    overrides: number;
  } {
    // TODO: 実装する（統計収集機能）
    return {
      totalValidations: 0,
      exactMatches: 0,
      nearMatches: 0,
      overrides: 0
    };
  }
}

// シングルトンインスタンス
export const answerValidationIntegration = new AnswerValidationIntegration();

// 使用例関数
export const validateAnswerSafely = async (
  chat: ChatSession,
  studentAnswer: string,
  message: string,
  expectedAnswer?: string | number
): Promise<string> => {
  try {
    const result = await answerValidationIntegration.validateAnswerWithAI(
      chat,
      studentAnswer,
      message,
      expectedAnswer
    );
    
    return result.finalFeedback;
    
  } catch (error) {
    console.error('❌ 回答検証エラー:', error);
    // フォールバック: 通常のAI応答
    return await sendMessageToChat(chat, message);
  }
};

// 設定更新用関数
export const configureAnswerValidation = (config: Partial<ValidationConfig>): void => {
  answerValidationIntegration.updateConfig(config);
};