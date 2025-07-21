// 📚 学年認識型難易度制御システム
// Grade-Aware Difficulty Controller - 学年×志望校レベルの最適な組み合わせ制御

import { eliteDifficultyController } from './eliteDifficultyController';

export interface GradeLevel {
  grade: '4th' | '5th' | '6th';
  name: string;
  maxCognitiveLoad: number;
  typicalStudyHours: number;
  developmentalStage: string;
}

export interface SchoolLevelRequirements {
  level: 'basic' | 'standard' | 'advanced' | 'elite';
  name: string;
  requiredSkills: string[];
  typicalDifficulty: number;
  targetAccuracy: number;
}

export interface GradeSchoolMatrix {
  grade: '4th' | '5th' | '6th';
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite';
  adjustedDifficulty: number;
  appropriateTopics: string[];
  restrictedTopics: string[];
  learningObjectives: string[];
  timeAllocation: number; // 分
}

export class GradeAwareDifficultyController {
  
  // 📚 学年別特性定義
  private readonly GRADE_CHARACTERISTICS: Record<string, GradeLevel> = {
    '4th': {
      grade: '4th',
      name: '小学4年生',
      maxCognitiveLoad: 6,
      typicalStudyHours: 1.5,
      developmentalStage: '具体的操作期・基礎概念形成'
    },
    '5th': {
      grade: '5th', 
      name: '小学5年生',
      maxCognitiveLoad: 7,
      typicalStudyHours: 2.5,
      developmentalStage: '抽象思考開始・応用力発達'
    },
    '6th': {
      grade: '6th',
      name: '小学6年生',
      maxCognitiveLoad: 8,
      typicalStudyHours: 3.5,
      developmentalStage: '論理的思考・統合的理解'
    }
  };
  
  // 🏫 学校レベル別要求事項
  private readonly SCHOOL_LEVEL_REQUIREMENTS: Record<string, SchoolLevelRequirements> = {
    'basic': {
      level: 'basic',
      name: '基礎校',
      requiredSkills: ['基本計算', '読解力', '基礎図形'],
      typicalDifficulty: 3,
      targetAccuracy: 0.85
    },
    'standard': {
      level: 'standard',
      name: '標準校',
      requiredSkills: ['応用計算', '論理思考', '文章問題', '複合図形'],
      typicalDifficulty: 5,
      targetAccuracy: 0.75
    },
    'advanced': {
      level: 'advanced',
      name: '上位校',
      requiredSkills: ['高度応用', '創造的思考', '複雑推論', '分野統合'],
      typicalDifficulty: 7,
      targetAccuracy: 0.65
    },
    'elite': {
      level: 'elite',
      name: '最難関校',
      requiredSkills: ['独創的思考', '超高度推論', '複数分野統合', '時間制約下判断'],
      typicalDifficulty: 9,
      targetAccuracy: 0.55
    }
  };
  
  // 📊 学年×志望校レベル適正マトリックス
  private readonly GRADE_SCHOOL_MATRIX: GradeSchoolMatrix[] = [
    // 4年生の各レベル
    {
      grade: '4th',
      schoolLevel: 'basic',
      adjustedDifficulty: 2,
      appropriateTopics: ['基本計算', '図形の基礎', '文章題の基本', '時間・長さ'],
      restrictedTopics: ['割合', '比', '速さ', '複雑図形'],
      learningObjectives: ['四則演算の完全習得', '基本図形の理解'],
      timeAllocation: 15
    },
    {
      grade: '4th',
      schoolLevel: 'standard',
      adjustedDifficulty: 3,
      appropriateTopics: ['計算の工夫', '図形の性質', '簡単な文章題', '数の性質基礎'],
      restrictedTopics: ['複雑な割合', '高度な比', '立体図形'],
      learningObjectives: ['計算力の向上', '図形感覚の育成'],
      timeAllocation: 20
    },
    {
      grade: '4th',
      schoolLevel: 'advanced',
      adjustedDifficulty: 4,
      appropriateTopics: ['発展計算', '図形の応用', '論理パズル', '数の規則性'],
      restrictedTopics: ['高度な速さ', '複雑な場合の数'],
      learningObjectives: ['論理的思考の基礎', '応用力の育成'],
      timeAllocation: 25
    },
    {
      grade: '4th',
      schoolLevel: 'elite',
      adjustedDifficulty: 5,
      appropriateTopics: ['高度な計算技法', '図形の発見的学習', '創造的問題解決'],
      restrictedTopics: ['最難関レベルの複合問題'],
      learningObjectives: ['創造的思考の芽生え', '高度な計算力'],
      timeAllocation: 30
    },
    
    // 5年生の各レベル
    {
      grade: '5th',
      schoolLevel: 'basic',
      adjustedDifficulty: 3,
      appropriateTopics: ['分数・小数', '基本的な割合', '図形の面積', '基本的な速さ'],
      restrictedTopics: ['複雑な比', '高度な図形', '場合の数'],
      learningObjectives: ['分数・小数の完全理解', '割合の基本習得'],
      timeAllocation: 20
    },
    {
      grade: '5th',
      schoolLevel: 'standard',
      adjustedDifficulty: 5,
      appropriateTopics: ['割合の応用', '比の基本', '図形の応用', '速さの基本'],
      restrictedTopics: ['最高レベルの図形', '複雑な場合の数'],
      learningObjectives: ['応用力の確実な習得', '論理的思考の発達'],
      timeAllocation: 25
    },
    {
      grade: '5th',
      schoolLevel: 'advanced',
      adjustedDifficulty: 6,
      appropriateTopics: ['比と割合の統合', '図形の発展', '速さの応用', '数の性質'],
      restrictedTopics: ['最難関レベルの統合問題'],
      learningObjectives: ['統合的思考力', '高度な応用力'],
      timeAllocation: 30
    },
    {
      grade: '5th',
      schoolLevel: 'elite',
      adjustedDifficulty: 7,
      appropriateTopics: ['高度な比・割合', '複雑図形', '速さの発展', '論理的推論'],
      restrictedTopics: ['6年生レベルの最難関問題'],
      learningObjectives: ['論理的推論力', '創造的問題解決'],
      timeAllocation: 35
    },
    
    // 6年生の各レベル
    {
      grade: '6th',
      schoolLevel: 'basic',
      adjustedDifficulty: 4,
      appropriateTopics: ['総合的な計算', '図形の総まとめ', '文章題の応用'],
      restrictedTopics: ['最高難度の問題'],
      learningObjectives: ['基礎力の完成', '入試基本問題への対応'],
      timeAllocation: 25
    },
    {
      grade: '6th',
      schoolLevel: 'standard',
      adjustedDifficulty: 6,
      appropriateTopics: ['入試標準問題', '複合的な文章題', '図形の応用'],
      restrictedTopics: ['最難関レベルの問題'],
      learningObjectives: ['標準入試問題の完全習得'],
      timeAllocation: 30
    },
    {
      grade: '6th',
      schoolLevel: 'advanced',
      adjustedDifficulty: 8,
      appropriateTopics: ['入試上位問題', '複雑な図形', '高度な文章題', '場合の数'],
      restrictedTopics: ['最難関校の特殊問題'],
      learningObjectives: ['上位校入試への完全対応'],
      timeAllocation: 35
    },
    {
      grade: '6th',
      schoolLevel: 'elite',
      adjustedDifficulty: 10,
      appropriateTopics: ['最難関入試問題', '創造的解法', '複数分野統合', '時間制約問題'],
      restrictedTopics: [],
      learningObjectives: ['最難関校完全合格', '創造的思考力の完成'],
      timeAllocation: 45
    }
  ];
  
  // 🎯 学年×志望校レベルの適正チェック
  public isGradeSchoolCombinationAppropriate(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'
  ): {
    isAppropriate: boolean;
    reasoning: string;
    recommendations: string[];
    adjustedExpectations: string;
  } {
    
    console.log(`🔍 学年×志望校適正チェック: ${grade} × ${schoolLevel}`);
    
    const matrix = this.getGradeSchoolMatrix(grade, schoolLevel);
    const gradeChar = this.GRADE_CHARACTERISTICS[grade];
    const schoolReq = this.SCHOOL_LEVEL_REQUIREMENTS[schoolLevel];
    
    let isAppropriate = true;
    const recommendations: string[] = [];
    let reasoning = '';
    let adjustedExpectations = '';
    
    // 4年生の特別チェック
    if (grade === '4th') {
      if (schoolLevel === 'elite') {
        isAppropriate = false;
        reasoning = '4年生で最難関志望は発達段階的に早すぎる可能性があります';
        recommendations.push('基礎力重視の学習から始める');
        recommendations.push('5年生から本格的な最難関対策を検討');
        adjustedExpectations = '基礎力完成と学習習慣確立を最優先';
      } else if (schoolLevel === 'advanced') {
        reasoning = '4年生の上位校志望は可能ですが、無理のない範囲で';
        recommendations.push('基礎をしっかり固めながら段階的に');
        adjustedExpectations = '基礎8割、応用2割の配分で学習';
      } else {
        reasoning = '4年生にとって適切なレベル設定です';
        adjustedExpectations = '楽しく学習しながら基礎力を確実に';
      }
    }
    
    // 5年生の特別チェック
    else if (grade === '5th') {
      if (schoolLevel === 'elite') {
        reasoning = '5年生での最難関志望は適切ですが、段階的なアプローチが重要';
        recommendations.push('基礎力確認後に応用問題へ');
        recommendations.push('無理をせず着実に積み上げる');
        adjustedExpectations = '基礎6割、応用4割の配分で段階的に';
      } else {
        reasoning = '5年生にとって適切なレベル設定です';
        adjustedExpectations = '本格的な受験勉強の開始に最適';
      }
    }
    
    // 6年生の特別チェック
    else if (grade === '6th') {
      reasoning = '6年生はどのレベルでも本格的な受験対策が可能';
      if (schoolLevel === 'elite') {
        recommendations.push('時間効率を重視した学習');
        recommendations.push('弱点分野の集中的克服');
        adjustedExpectations = '実戦レベルの問題で最終仕上げ';
      } else {
        adjustedExpectations = '志望校レベルに特化した効率的学習';
      }
    }
    
    return {
      isAppropriate,
      reasoning,
      recommendations,
      adjustedExpectations
    };
  }
  
  // 📊 学年×志望校マトリックス取得
  public getGradeSchoolMatrix(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'
  ): GradeSchoolMatrix {
    
    const matrix = this.GRADE_SCHOOL_MATRIX.find(
      m => m.grade === grade && m.schoolLevel === schoolLevel
    );
    
    if (!matrix) {
      throw new Error(`マトリックス定義が見つかりません: ${grade} × ${schoolLevel}`);
    }
    
    console.log(`📊 マトリックス取得: ${grade} × ${schoolLevel}`, {
      難易度: matrix.adjustedDifficulty,
      時間配分: matrix.timeAllocation + '分',
      トピック数: matrix.appropriateTopics.length
    });
    
    return matrix;
  }
  
  // 🎯 適正難易度計算（学年考慮）
  public calculateGradeAwareDifficulty(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    currentPerformance: number,
    recentAccuracy: number
  ): {
    targetDifficulty: number;
    reasoning: string;
    adjustments: string[];
    timeRecommendation: number;
  } {
    
    const matrix = this.getGradeSchoolMatrix(grade, schoolLevel);
    const gradeChar = this.GRADE_CHARACTERISTICS[grade];
    
    let targetDifficulty = matrix.adjustedDifficulty;
    const adjustments: string[] = [];
    
    // パフォーマンスベースの微調整
    if (recentAccuracy > 0.8) {
      targetDifficulty += 0.5;
      adjustments.push('高正答率につき難易度を微上昇');
    } else if (recentAccuracy < 0.6) {
      targetDifficulty -= 0.5;
      adjustments.push('正答率低下につき難易度を微下降');
    }
    
    // 学年別認知負荷制限
    const maxAllowedDifficulty = gradeChar.maxCognitiveLoad;
    if (targetDifficulty > maxAllowedDifficulty) {
      targetDifficulty = maxAllowedDifficulty;
      adjustments.push(`${grade}の認知負荷限界により難易度制限`);
    }
    
    // 最低難易度の保証
    const minDifficulty = this.getMinimumDifficulty(schoolLevel);
    if (targetDifficulty < minDifficulty) {
      targetDifficulty = minDifficulty;
      adjustments.push(`${schoolLevel}レベルの最低基準を適用`);
    }
    
    const reasoning = `${grade}・${schoolLevel}の組み合わせで最適化された難易度`;
    
    return {
      targetDifficulty: Math.round(targetDifficulty * 10) / 10,
      reasoning,
      adjustments,
      timeRecommendation: matrix.timeAllocation
    };
  }
  
  // 📚 適切なトピック選択
  public getAppropriateTopics(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    subject: string
  ): {
    recommendedTopics: string[];
    restrictedTopics: string[];
    learningObjectives: string[];
    priorityOrder: string[];
  } {
    
    const matrix = this.getGradeSchoolMatrix(grade, schoolLevel);
    
    // 教科別の調整
    let adjustedTopics = [...matrix.appropriateTopics];
    let priorityOrder: string[] = [];
    
    if (subject === 'math') {
      priorityOrder = this.getMathTopicPriority(grade, schoolLevel);
    } else if (subject === 'japanese') {
      priorityOrder = this.getJapaneseTopicPriority(grade, schoolLevel);
    }
    
    return {
      recommendedTopics: adjustedTopics,
      restrictedTopics: matrix.restrictedTopics,
      learningObjectives: matrix.learningObjectives,
      priorityOrder
    };
  }
  
  // 🧮 数学トピック優先順位
  private getMathTopicPriority(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'
  ): string[] {
    
    const priorities: Record<string, Record<string, string[]>> = {
      '4th': {
        'basic': ['四則演算', '基本図形', '長さ・重さ', '時間'],
        'standard': ['計算の工夫', '図形の性質', '数の性質'],
        'advanced': ['発展計算', '図形応用', '論理パズル'],
        'elite': ['高度計算技法', '図形発見学習', '創造的問題']
      },
      '5th': {
        'basic': ['分数・小数', '割合基本', '面積', '速さ基本'],
        'standard': ['割合応用', '比の基本', '図形応用', '速さ応用'],
        'advanced': ['比と割合統合', '図形発展', '数の性質'],
        'elite': ['高度な比・割合', '複雑図形', '論理推論']
      },
      '6th': {
        'basic': ['総合計算', '図形総まとめ', '文章題応用'],
        'standard': ['入試標準問題', '複合文章題', '図形応用'],
        'advanced': ['入試上位問題', '複雑図形', '場合の数'],
        'elite': ['最難関問題', '創造的解法', '分野統合']
      }
    };
    
    return priorities[grade]?.[schoolLevel] || [];
  }
  
  // 📖 国語トピック優先順位
  private getJapaneseTopicPriority(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'
  ): string[] {
    
    const priorities: Record<string, Record<string, string[]>> = {
      '4th': {
        'basic': ['基本的な読解', '漢字・語句', '文の仕組み'],
        'standard': ['物語文読解', '説明文基本', '語彙拡充'],
        'advanced': ['読解応用', '表現技法', '文章構成'],
        'elite': ['高度な読解', '論理的思考', '創造的表現']
      },
      '5th': {
        'basic': ['物語文理解', '説明文読解', '漢字・語句'],
        'standard': ['読解技術', '要約・記述', '文法理解'],
        'advanced': ['論理的読解', '批判的思考', '表現力'],
        'elite': ['高度な論理', '創造的読解', '総合的理解']
      },
      '6th': {
        'basic': ['入試基本読解', '記述基本', '知識総合'],
        'standard': ['入試標準読解', '記述応用', '総合問題'],
        'advanced': ['入試上位読解', '高度記述', '複合問題'],
        'elite': ['最難関読解', '創造的記述', '統合的思考']
      }
    };
    
    return priorities[grade]?.[schoolLevel] || [];
  }
  
  // 📊 学習進度分析
  public analyzeGradeAwareLearningProgress(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    recentPerformance: {
      accuracy: number;
      averageTime: number;
      topicsCompleted: string[];
      strugglingAreas: string[];
    }
  ): {
    currentLevel: string;
    nextSteps: string[];
    adjustmentRecommendations: string[];
    timelineGuidance: string;
  } {
    
    const matrix = this.getGradeSchoolMatrix(grade, schoolLevel);
    const gradeChar = this.GRADE_CHARACTERISTICS[grade];
    
    let currentLevel = '';
    const nextSteps: string[] = [];
    const adjustmentRecommendations: string[] = [];
    let timelineGuidance = '';
    
    // 現在レベルの判定
    if (recentPerformance.accuracy >= 0.8) {
      currentLevel = `${grade}・${schoolLevel}レベルを十分習得`;
      nextSteps.push('より高度な問題へのチャレンジ');
      if (schoolLevel !== 'elite') {
        nextSteps.push('上位レベルへのステップアップ検討');
      }
    } else if (recentPerformance.accuracy >= 0.6) {
      currentLevel = `${grade}・${schoolLevel}レベルを概ね習得`;
      nextSteps.push('弱点分野の重点的学習');
      nextSteps.push('理解度の確実な定着');
    } else {
      currentLevel = `${grade}・${schoolLevel}レベルの習得途中`;
      nextSteps.push('基礎の再確認');
      nextSteps.push('段階的な理解の積み上げ');
      adjustmentRecommendations.push('難易度を一時的に下げる');
    }
    
    // 学年別タイムライン指導
    if (grade === '4th') {
      timelineGuidance = '基礎力重視で無理のないペース。楽しく学習する習慣づくりが最優先';
    } else if (grade === '5th') {
      timelineGuidance = '本格的受験勉強の開始。基礎と応用のバランスを重視';
    } else {
      timelineGuidance = '入試本番まで限られた時間。効率的で実戦的な学習が必要';
    }
    
    return {
      currentLevel,
      nextSteps,
      adjustmentRecommendations,
      timelineGuidance
    };
  }
  
  // ヘルパーメソッド
  private getMinimumDifficulty(schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'): number {
    const minimums: Record<string, number> = {
      'basic': 2,
      'standard': 4,
      'advanced': 6,
      'elite': 8
    };
    return minimums[schoolLevel];
  }
  
  // 🎯 統合的な推奨システム
  public getIntegratedRecommendations(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    currentPerformance: number,
    subject: string
  ): {
    difficulty: number;
    topics: string[];
    timeAllocation: number;
    learningFocus: string[];
    parentGuidance: string;
    childMotivation: string;
  } {
    
    const difficultyCalc = this.calculateGradeAwareDifficulty(
      grade, schoolLevel, currentPerformance, currentPerformance
    );
    
    const topicSelection = this.getAppropriateTopics(grade, schoolLevel, subject);
    
    const matrix = this.getGradeSchoolMatrix(grade, schoolLevel);
    
    // 学習フォーカスの決定
    const learningFocus: string[] = [];
    if (grade === '4th') {
      learningFocus.push('基礎力の確実な定着', '学習習慣の確立', '楽しく学ぶ姿勢');
    } else if (grade === '5th') {
      learningFocus.push('応用力の育成', '論理的思考の発達', '効率的学習法の習得');
    } else {
      learningFocus.push('実戦力の養成', '時間管理の習得', '精神的な強さの育成');
    }
    
    // 保護者向けガイダンス
    let parentGuidance = '';
    if (schoolLevel === 'elite') {
      parentGuidance = '高い目標設定ですが、お子様の成長段階に合わせた無理のない学習が重要です。';
    } else {
      parentGuidance = `${schoolLevel}レベルに適した段階的な学習で、確実な成長をサポートしてください。`;
    }
    
    // 子ども向けモチベーション
    const motivationMessages: Record<string, string> = {
      'basic': '基礎をしっかり固めて、着実に力をつけていこう！',
      'standard': '応用問題にもチャレンジして、考える力を伸ばそう！',
      'advanced': '難しい問題も楽しみながら、君の可能性を広げよう！',
      'elite': '最高レベルの問題に挑戦して、君だけの解法を見つけよう！'
    };
    
    return {
      difficulty: difficultyCalc.targetDifficulty,
      topics: topicSelection.priorityOrder,
      timeAllocation: matrix.timeAllocation,
      learningFocus,
      parentGuidance,
      childMotivation: motivationMessages[schoolLevel]
    };
  }
}

// シングルトンインスタンス
export const gradeAwareDifficultyController = new GradeAwareDifficultyController();

// 便利な使用関数
export const getGradeAwareDifficulty = (
  grade: '4th' | '5th' | '6th',
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
  performance: number
): number => {
  const result = gradeAwareDifficultyController.calculateGradeAwareDifficulty(
    grade, schoolLevel, performance, performance
  );
  return result.targetDifficulty;
};

export const checkGradeSchoolFit = (
  grade: '4th' | '5th' | '6th',
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite'
) => {
  return gradeAwareDifficultyController.isGradeSchoolCombinationAppropriate(grade, schoolLevel);
};

export const getRecommendedTopics = (
  grade: '4th' | '5th' | '6th',
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
  subject: string
) => {
  return gradeAwareDifficultyController.getAppropriateTopics(grade, schoolLevel, subject);
};