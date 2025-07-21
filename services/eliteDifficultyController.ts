// 🏆 最難関レベル専用難易度制御システム
// Elite Level Difficulty Controller - 最難関校レベルに適切な超高難度問題のみを出題

export interface DifficultyLevel {
  level: number; // 1-10 (10が最高難度)
  name: string;
  description: string;
  targetAccuracy: number; // 目標正答率
  cognitiveLoadMin: number; // 最低認知負荷
  requiredSkills: string[];
}

export interface EliteProblemCriteria {
  minDifficulty: number;
  maxDifficulty: number;
  requiredConcepts: string[];
  prohibitedConcepts: string[];
  cognitiveComplexity: number;
  multiStepRequired: boolean;
  originalThinkingRequired: boolean;
}

export interface SchoolLevelDifficultyMapping {
  basic: DifficultyLevel;
  standard: DifficultyLevel;
  advanced: DifficultyLevel;
  elite: DifficultyLevel;
}

export class EliteDifficultyController {
  
  // 🎯 学校レベル別難易度定義（厳格化）
  private readonly SCHOOL_LEVEL_DIFFICULTY: SchoolLevelDifficultyMapping = {
    basic: {
      level: 3,
      name: '基礎校',
      description: '基本的な計算と概念理解',
      targetAccuracy: 0.8,
      cognitiveLoadMin: 2,
      requiredSkills: ['基本計算', '文章読解', '基礎図形']
    },
    standard: {
      level: 5,
      name: '標準校', 
      description: '応用問題と複合的思考',
      targetAccuracy: 0.7,
      cognitiveLoadMin: 4,
      requiredSkills: ['応用計算', '論理思考', '複合図形']
    },
    advanced: {
      level: 7,
      name: '上位校',
      description: '高度な応用と創造的思考',
      targetAccuracy: 0.6,
      cognitiveLoadMin: 6,
      requiredSkills: ['高度応用', '創造的思考', '複雑推論']
    },
    elite: {
      level: 9,
      name: '最難関校',
      description: '極めて高度な思考力と独創性',
      targetAccuracy: 0.5, // 最難関は50%正答率を目標
      cognitiveLoadMin: 8,
      requiredSkills: ['独創的思考', '超高度推論', '複数分野統合', '時間制約下での判断']
    }
  };
  
  // 🏆 最難関レベル専用問題基準
  private readonly ELITE_PROBLEM_CRITERIA: EliteProblemCriteria = {
    minDifficulty: 8, // 最低でも難易度8以上
    maxDifficulty: 10,
    requiredConcepts: [
      '複数分野の統合',
      '逆算思考',
      '場合分け',
      '数学的洞察',
      '創造的解法'
    ],
    prohibitedConcepts: [
      '単純暗算',
      '基本図形',
      '一段階思考',
      'パターン暗記'
    ],
    cognitiveComplexity: 8,
    multiStepRequired: true,
    originalThinkingRequired: true
  };
  
  // 🎯 難易度適切性判定（最重要機能）
  public isDifficultyAppropriate(
    difficulty: number,
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    problemContent?: string
  ): boolean {
    
    const levelRequirement = this.SCHOOL_LEVEL_DIFFICULTY[schoolLevel];
    
    console.log(`🔍 難易度適切性判定:`, {
      difficulty,
      schoolLevel,
      requiredLevel: levelRequirement.level,
      minDifficulty: schoolLevel === 'elite' ? this.ELITE_PROBLEM_CRITERIA.minDifficulty : levelRequirement.level - 1
    });
    
    // 各レベル別の厳格な基準
    switch (schoolLevel) {
      case 'basic':
        return difficulty >= 2 && difficulty <= 4;
        
      case 'standard':
        return difficulty >= 4 && difficulty <= 6;
        
      case 'advanced':
        return difficulty >= 6 && difficulty <= 8;
        
      case 'elite':
        // 最難関は特に厳格
        const isEliteAppropriate = this.validateEliteProblem(difficulty, problemContent);
        console.log(`🏆 最難関レベル判定結果:`, isEliteAppropriate);
        return isEliteAppropriate;
        
      default:
        return false;
    }
  }
  
  // 🏆 最難関問題の厳格検証
  private validateEliteProblem(difficulty: number, problemContent?: string): boolean {
    
    // 基本難易度チェック
    if (difficulty < this.ELITE_PROBLEM_CRITERIA.minDifficulty) {
      console.log(`❌ 最難関問題却下: 難易度不足 (${difficulty} < ${this.ELITE_PROBLEM_CRITERIA.minDifficulty})`);
      return false;
    }
    
    if (!problemContent) {
      return difficulty >= this.ELITE_PROBLEM_CRITERIA.minDifficulty;
    }
    
    // 内容ベースの高度検証
    const complexity = this.analyzeProblemComplexity(problemContent);
    
    if (complexity.cognitiveComplexity < 7) {
      console.log(`❌ 最難関問題却下: 認知的複雑さ不足 (${complexity.cognitiveComplexity} < 7)`);
      return false;
    }
    
    if (!complexity.hasMultipleSteps) {
      console.log(`❌ 最難関問題却下: 多段階思考不足`);
      return false;
    }
    
    if (complexity.hasProhibitedSimplicity) {
      console.log(`❌ 最難関問題却下: 単純すぎる要素を含む`);
      return false;
    }
    
    console.log(`✅ 最難関問題承認: 全基準を満たす`);
    return true;
  }
  
  // 🧠 問題複雑度分析
  private analyzeProblemComplexity(problemContent: string): {
    cognitiveComplexity: number;
    hasMultipleSteps: boolean;
    hasProhibitedSimplicity: boolean;
    requiredSkills: string[];
  } {
    
    let complexity = 5; // 基準値
    let hasMultipleSteps = false;
    let hasProhibitedSimplicity = false;
    const requiredSkills: string[] = [];
    
    // 高度概念の検出
    const advancedPatterns = [
      '場合の数', '確率', '比の応用', '割合の複合',
      '図形の移動', '立体図形', '相似', '比例',
      '速さの応用', 'つるかめ算の発展', '植木算の応用',
      '周期算', '日暦算', '時計算', '流水算', '通過算'
    ];
    
    advancedPatterns.forEach(pattern => {
      if (problemContent.includes(pattern)) {
        complexity += 1;
        requiredSkills.push(pattern);
      }
    });
    
    // 多段階思考の検出
    const multiStepIndicators = [
      'まず', '次に', 'その後', '最後に',
      '求めて', 'から', '利用して', '応用して',
      '段階', 'ステップ', '手順'
    ];
    
    hasMultipleSteps = multiStepIndicators.some(indicator => 
      problemContent.includes(indicator)
    );
    
    if (hasMultipleSteps) {
      complexity += 2;
    }
    
    // 単純すぎる要素の検出（最難関には不適切）
    const simplicityIndicators = [
      '一桁', '足し算', '引き算', '九九',
      '基本', '簡単', '初歩', '単純'
    ];
    
    hasProhibitedSimplicity = simplicityIndicators.some(indicator =>
      problemContent.includes(indicator)
    );
    
    // 複数分野統合の検出
    const mathTopics = ['算数', '図形', '数の性質', '文章題'];
    const detectedTopics = mathTopics.filter(topic => 
      problemContent.includes(topic)
    );
    
    if (detectedTopics.length >= 2) {
      complexity += 3;
      requiredSkills.push('分野統合思考');
    }
    
    return {
      cognitiveComplexity: Math.min(10, complexity),
      hasMultipleSteps,
      hasProhibitedSimplicity,
      requiredSkills
    };
  }
  
  // 🎯 最適難易度計算
  public calculateOptimalDifficulty(
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    currentPerformance: number,
    recentAccuracy: number
  ): number {
    
    const baseDifficulty = this.SCHOOL_LEVEL_DIFFICULTY[schoolLevel].level;
    const targetAccuracy = this.SCHOOL_LEVEL_DIFFICULTY[schoolLevel].targetAccuracy;
    
    // パフォーマンスベースの調整
    let adjustment = 0;
    
    if (recentAccuracy > targetAccuracy + 0.2) {
      // 正答率が高すぎる場合は難易度を上げる
      adjustment = +2;
    } else if (recentAccuracy > targetAccuracy + 0.1) {
      adjustment = +1;
    } else if (recentAccuracy < targetAccuracy - 0.2) {
      // 正答率が低すぎる場合は難易度を下げる（ただし最低基準は維持）
      adjustment = -1;
    }
    
    const adjustedDifficulty = baseDifficulty + adjustment;
    
    // 最難関レベルの特別処理
    if (schoolLevel === 'elite') {
      // 最難関は絶対に7未満にならない
      return Math.max(8, Math.min(10, adjustedDifficulty));
    }
    
    return Math.max(1, Math.min(10, adjustedDifficulty));
  }
  
  // 🏆 最難関専用キーワードフィルタリング
  public getEliteOnlyKeywords(allKeywords: string[]): string[] {
    
    const eliteSpecificKeywords = [
      '発展', '応用', '複合', '高度', '難問', 
      '入試レベル', '最難関', '思考力', '洞察力',
      '複数解法', '場合分け', '逆算', '推論',
      '創造的', '独創的', '統合的'
    ];
    
    // 基本・標準レベルのキーワードを除外
    const basicKeywords = [
      '基本', '基礎', '初歩', '簡単', '入門',
      '暗算', '九九', '基本図形', '単純計算'
    ];
    
    return allKeywords.filter(keyword => {
      // 基本キーワードが含まれていたら除外
      const hasBasicContent = basicKeywords.some(basic => 
        keyword.includes(basic)
      );
      
      if (hasBasicContent) {
        console.log(`🚫 基本レベルキーワード除外: ${keyword}`);
        return false;
      }
      
      // 最難関キーワードを優先
      const hasEliteContent = eliteSpecificKeywords.some(elite =>
        keyword.includes(elite)
      );
      
      if (hasEliteContent) {
        console.log(`✅ 最難関キーワード採用: ${keyword}`);
        return true;
      }
      
      // その他のキーワードは中程度として扱う（最難関では慎重に）
      return keyword.length > 3; // 短すぎるキーワードは除外
    });
  }
  
  // 📊 難易度統計分析
  public analyzeDifficultyDistribution(
    problems: Array<{ difficulty: number; schoolLevel: string }>
  ): {
    distribution: Record<string, number>;
    recommendations: string[];
    isAppropriate: boolean;
  } {
    
    const distribution: Record<string, number> = {
      'too_easy': 0,
      'appropriate': 0,
      'too_hard': 0
    };
    
    const recommendations: string[] = [];
    
    problems.forEach(problem => {
      const appropriate = this.isDifficultyAppropriate(
        problem.difficulty,
        problem.schoolLevel as any
      );
      
      if (appropriate) {
        distribution.appropriate++;
      } else if (problem.difficulty < this.SCHOOL_LEVEL_DIFFICULTY[problem.schoolLevel as keyof SchoolLevelDifficultyMapping].level) {
        distribution.too_easy++;
      } else {
        distribution.too_hard++;
      }
    });
    
    // 分析結果に基づく推奨事項
    if (distribution.too_easy > problems.length * 0.3) {
      recommendations.push('簡単すぎる問題が多すぎます。難易度を上げてください。');
    }
    
    if (distribution.too_hard > problems.length * 0.2) {
      recommendations.push('難しすぎる問題があります。段階的な難易度調整を検討してください。');
    }
    
    if (distribution.appropriate < problems.length * 0.6) {
      recommendations.push('適切な難易度の問題を増やしてください。');
    }
    
    const isAppropriate = distribution.appropriate >= problems.length * 0.7;
    
    return {
      distribution,
      recommendations,
      isAppropriate
    };
  }
  
  // 🎯 リアルタイム難易度調整
  public adjustDifficultyRealTime(
    currentDifficulty: number,
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    performanceMetrics: {
      responseTime: number;
      accuracy: number;
      confidence: number;
      frustrationLevel: number;
    }
  ): number {
    
    let newDifficulty = currentDifficulty;
    
    // 応答時間ベースの調整
    if (performanceMetrics.responseTime < 30000) { // 30秒未満
      newDifficulty += 0.5; // 早すぎる場合は難易度を上げる
    } else if (performanceMetrics.responseTime > 300000) { // 5分以上
      newDifficulty -= 0.5; // 遅すぎる場合は下げる
    }
    
    // 正答率ベースの調整
    if (performanceMetrics.accuracy > 0.8) {
      newDifficulty += 1;
    } else if (performanceMetrics.accuracy < 0.3) {
      newDifficulty -= 1;
    }
    
    // 挫折感ベースの調整
    if (performanceMetrics.frustrationLevel > 0.7) {
      newDifficulty -= 0.5;
    }
    
    // 学校レベル制約の適用
    return this.constrainDifficultyBySchoolLevel(newDifficulty, schoolLevel);
  }
  
  // 🛡️ 学校レベル別難易度制約
  private constrainDifficultyBySchoolLevel(
    difficulty: number,
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'
  ): number {
    
    const levelConfig = this.SCHOOL_LEVEL_DIFFICULTY[schoolLevel];
    
    switch (schoolLevel) {
      case 'basic':
        return Math.max(2, Math.min(4, difficulty));
      case 'standard':
        return Math.max(4, Math.min(6, difficulty));
      case 'advanced':
        return Math.max(6, Math.min(8, difficulty));
      case 'elite':
        // 最難関は絶対に8未満にしない
        return Math.max(8, Math.min(10, difficulty));
      default:
        return Math.max(1, Math.min(10, difficulty));
    }
  }
  
  // 📈 難易度進歩トラッキング
  public trackDifficultyProgression(
    userId: string,
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    currentDifficulty: number,
    performance: number
  ): {
    shouldIncrease: boolean;
    recommendedDifficulty: number;
    reasoning: string;
  } {
    
    const targetAccuracy = this.SCHOOL_LEVEL_DIFFICULTY[schoolLevel].targetAccuracy;
    
    if (performance > targetAccuracy + 0.15) {
      return {
        shouldIncrease: true,
        recommendedDifficulty: this.constrainDifficultyBySchoolLevel(currentDifficulty + 1, schoolLevel),
        reasoning: `正答率${(performance * 100).toFixed(1)}%は目標を大幅に上回っているため難易度を上げます`
      };
    }
    
    if (performance < targetAccuracy - 0.15) {
      return {
        shouldIncrease: false,
        recommendedDifficulty: this.constrainDifficultyBySchoolLevel(currentDifficulty - 0.5, schoolLevel),
        reasoning: `正答率${(performance * 100).toFixed(1)}%は目標を下回っているため難易度を調整します`
      };
    }
    
    return {
      shouldIncrease: false,
      recommendedDifficulty: currentDifficulty,
      reasoning: `現在の難易度が適切です（正答率: ${(performance * 100).toFixed(1)}%）`
    };
  }
}

// シングルトンインスタンス
export const eliteDifficultyController = new EliteDifficultyController();

// 便利な使用関数
export const isEliteAppropriate = (difficulty: number, content?: string): boolean => {
  return eliteDifficultyController.isDifficultyAppropriate(difficulty, 'elite', content);
};

export const getEliteOnlyKeywords = (keywords: string[]): string[] => {
  return eliteDifficultyController.getEliteOnlyKeywords(keywords);
};

export const calculateEliteDifficulty = (performance: number, accuracy: number): number => {
  return eliteDifficultyController.calculateOptimalDifficulty('elite', performance, accuracy);
};