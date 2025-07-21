// 📚 全レベル対応総合問題データベース
// Comprehensive Problem Database - 基礎校〜最難関校×学年別の完全対応

import { eliteProblemDatabase, EliteProblem } from './eliteProblemDatabase';

export interface ComprehensiveProblem {
  id: string;
  title: string;
  difficulty: number; // 1-10
  subject: 'math' | 'japanese' | 'science' | 'social';
  topic: string;
  subtopic: string;
  content: string;
  gradeLevel: '4th' | '5th' | '6th';
  schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite';
  expectedTime: number; // 分
  requiredSkills: string[];
  cognitiveLoad: number;
  solution: string;
  explanation: string;
  alternativeMethods: string[];
  commonMistakes: string[];
  learningObjectives: string[];
}

export class ComprehensiveProblemDatabase {
  
  // 📚 基礎校レベル問題
  private readonly BASIC_PROBLEMS: ComprehensiveProblem[] = [
    // 4年生基礎校
    {
      id: 'basic_4th_math_001',
      title: '四則演算の基本',
      difficulty: 2,
      subject: 'math',
      topic: '計算',
      subtopic: '四則演算',
      content: '次の計算をしなさい。\n125 + 67 - 38 + 46 = ',
      gradeLevel: '4th',
      schoolLevel: 'basic',
      expectedTime: 10,
      requiredSkills: ['四則演算', '筆算'],
      cognitiveLoad: 3,
      solution: '200',
      explanation: '左から順番に計算していく',
      alternativeMethods: ['暗算', '筆算'],
      commonMistakes: ['計算順序の間違い', '繰り上がりのミス'],
      learningObjectives: ['四則演算の完全習得']
    },
    {
      id: 'basic_4th_math_002',
      title: '長方形の面積',
      difficulty: 2,
      subject: 'math',
      topic: '図形',
      subtopic: '面積',
      content: 'たて6cm、よこ9cmの長方形の面積を求めなさい。',
      gradeLevel: '4th',
      schoolLevel: 'basic',
      expectedTime: 8,
      requiredSkills: ['面積の公式', '基本計算'],
      cognitiveLoad: 2,
      solution: '54平方cm',
      explanation: '長方形の面積 = たて × よこ',
      alternativeMethods: ['公式利用'],
      commonMistakes: ['たて・よこの取り違え'],
      learningObjectives: ['面積の概念理解']
    },
    
    // 5年生基礎校
    {
      id: 'basic_5th_math_001',
      title: '分数の基本計算',
      difficulty: 3,
      subject: 'math',
      topic: '分数',
      subtopic: '分数計算',
      content: '次の計算をしなさい。\n2/5 + 1/5 = ',
      gradeLevel: '5th',
      schoolLevel: 'basic',
      expectedTime: 12,
      requiredSkills: ['分数の意味', '同分母の加法'],
      cognitiveLoad: 3,
      solution: '3/5',
      explanation: '分母が同じ分数は分子同士を足す',
      alternativeMethods: ['図を使った理解'],
      commonMistakes: ['分母も足してしまう'],
      learningObjectives: ['分数計算の基礎習得']
    },
    
    // 6年生基礎校
    {
      id: 'basic_6th_math_001',
      title: '割合の基本',
      difficulty: 4,
      subject: 'math',
      topic: '割合',
      subtopic: '百分率',
      content: '40人のクラスで、男子が24人います。男子の割合を百分率で表しなさい。',
      gradeLevel: '6th',
      schoolLevel: 'basic',
      expectedTime: 15,
      requiredSkills: ['割合の意味', '百分率変換'],
      cognitiveLoad: 4,
      solution: '60%',
      explanation: '24 ÷ 40 = 0.6 = 60%',
      alternativeMethods: ['比での計算'],
      commonMistakes: ['割る数と割られる数の混同'],
      learningObjectives: ['割合の基本理解']
    }
  ];
  
  // 📊 標準校レベル問題
  private readonly STANDARD_PROBLEMS: ComprehensiveProblem[] = [
    // 4年生標準校
    {
      id: 'standard_4th_math_001',
      title: '計算の工夫',
      difficulty: 3,
      subject: 'math',
      topic: '計算',
      subtopic: '計算の工夫',
      content: '次の計算を工夫して求めなさい。\n25 × 16 = ',
      gradeLevel: '4th',
      schoolLevel: 'standard',
      expectedTime: 12,
      requiredSkills: ['計算の工夫', '分配法則'],
      cognitiveLoad: 4,
      solution: '400',
      explanation: '25 × 16 = 25 × 4 × 4 = 100 × 4 = 400',
      alternativeMethods: ['25 × 16 = 25 × (20 - 4)'],
      commonMistakes: ['工夫せずに普通に計算'],
      learningObjectives: ['効率的な計算方法の習得']
    },
    
    // 5年生標準校
    {
      id: 'standard_5th_math_001',
      title: '割合の応用',
      difficulty: 5,
      subject: 'math',
      topic: '割合',
      subtopic: '割合の応用',
      content: '定価1200円の商品を20%引きで売りました。売値はいくらですか。',
      gradeLevel: '5th',
      schoolLevel: 'standard',
      expectedTime: 15,
      requiredSkills: ['割合の計算', '百分率の応用'],
      cognitiveLoad: 5,
      solution: '960円',
      explanation: '1200 × (1 - 0.2) = 1200 × 0.8 = 960',
      alternativeMethods: ['1200 × 0.2 = 240、1200 - 240 = 960'],
      commonMistakes: ['20%を直接引いてしまう'],
      learningObjectives: ['割合の実用的応用']
    },
    
    // 6年生標準校
    {
      id: 'standard_6th_math_001',
      title: '速さの基本',
      difficulty: 6,
      subject: 'math',
      topic: '速さ',
      subtopic: '速さ・時間・距離',
      content: '時速60kmで走る車が、240kmの道のりを走るのに何時間かかりますか。',
      gradeLevel: '6th',
      schoolLevel: 'standard',
      expectedTime: 18,
      requiredSkills: ['速さの公式', '時間の計算'],
      cognitiveLoad: 5,
      solution: '4時間',
      explanation: '時間 = 距離 ÷ 速さ = 240 ÷ 60 = 4',
      alternativeMethods: ['距離 = 速さ × 時間から逆算'],
      commonMistakes: ['公式の混同'],
      learningObjectives: ['速さ公式の確実な理解']
    }
  ];
  
  // 🎯 上位校レベル問題
  private readonly ADVANCED_PROBLEMS: ComprehensiveProblem[] = [
    // 4年生上位校
    {
      id: 'advanced_4th_math_001',
      title: '図形の性質発見',
      difficulty: 4,
      subject: 'math',
      topic: '図形',
      subtopic: '図形の性質',
      content: '正方形の4つの頂点から、それぞれ対角に向かって同じ長さの線分を引きました。できた図形にはどんな性質がありますか。',
      gradeLevel: '4th',
      schoolLevel: 'advanced',
      expectedTime: 20,
      requiredSkills: ['図形の観察', '性質の発見', '論理的思考'],
      cognitiveLoad: 6,
      solution: '小さな正方形ができる',
      explanation: '対称性と角度の関係から新しい正方形が形成される',
      alternativeMethods: ['実際に作図して確認'],
      commonMistakes: ['表面的な観察で終わってしまう'],
      learningObjectives: ['図形の性質を論理的に発見する力']
    },
    
    // 5年生上位校
    {
      id: 'advanced_5th_math_001',
      title: '比と割合の統合',
      difficulty: 6,
      subject: 'math',
      topic: '比と割合',
      subtopic: '比と割合の関係',
      content: 'A、B、Cの3人で840円を3:4:5の比で分けます。それぞれいくらもらえますか。また、Aがもらう金額は全体の何%ですか。',
      gradeLevel: '5th',
      schoolLevel: 'advanced',
      expectedTime: 25,
      requiredSkills: ['比の計算', '比例配分', '百分率変換'],
      cognitiveLoad: 7,
      solution: 'A:210円、B:280円、C:350円、Aは25%',
      explanation: '比の合計12で割り、それぞれに対応する比をかける',
      alternativeMethods: ['1あたり量から計算'],
      commonMistakes: ['比の合計を間違える'],
      learningObjectives: ['比と割合の統合的理解']
    },
    
    // 6年生上位校
    {
      id: 'advanced_6th_math_001',
      title: '場合の数の基本',
      difficulty: 8,
      subject: 'math',
      topic: '場合の数',
      subtopic: '順列・組み合わせ',
      content: 'A、B、C、D、Eの5人が一列に並びます。AとBが隣り合う並び方は何通りありますか。',
      gradeLevel: '6th',
      schoolLevel: 'advanced',
      expectedTime: 30,
      requiredSkills: ['場合の数', '順列', '条件付き計算'],
      cognitiveLoad: 8,
      solution: '48通り',
      explanation: 'AとBをひとまとまりと考えて4個の並び方4!×AとBの入れ替え2通り',
      alternativeMethods: ['全体から隣り合わない場合を引く'],
      commonMistakes: ['条件を正しく処理できない'],
      learningObjectives: ['論理的な場合分けの習得']
    }
  ];
  
  // 国語問題の基本例
  private readonly JAPANESE_PROBLEMS: ComprehensiveProblem[] = [
    {
      id: 'standard_5th_jp_001',
      title: '物語文の心情理解',
      difficulty: 5,
      subject: 'japanese',
      topic: '読解',
      subtopic: '心情理解',
      content: '次の文章を読んで、主人公の気持ちの変化を説明しなさい。\n（物語文が続く...）',
      gradeLevel: '5th',
      schoolLevel: 'standard',
      expectedTime: 25,
      requiredSkills: ['読解力', '心情理解', '文章表現'],
      cognitiveLoad: 6,
      solution: '最初は不安だったが、徐々に希望を持つようになった',
      explanation: '状況の変化と登場人物の言動から心情を読み取る',
      alternativeMethods: ['キーワードから心情を推測'],
      commonMistakes: ['表面的な読み取り'],
      learningObjectives: ['登場人物の心情を深く理解する']
    }
  ];
  
  // 🎯 レベル別問題取得
  public getProblemsForLevel(
    gradeLevel: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    subject?: 'math' | 'japanese' | 'science' | 'social',
    maxProblems: number = 10
  ): ComprehensiveProblem[] {
    
    let allProblems: ComprehensiveProblem[] = [];
    
    // 基礎レベル問題
    if (schoolLevel === 'basic') {
      allProblems = this.BASIC_PROBLEMS.filter(p => 
        p.gradeLevel === gradeLevel && p.schoolLevel === schoolLevel
      );
    }
    // 標準レベル問題
    else if (schoolLevel === 'standard') {
      allProblems = [
        ...this.STANDARD_PROBLEMS.filter(p => 
          p.gradeLevel === gradeLevel && p.schoolLevel === schoolLevel
        ),
        ...this.JAPANESE_PROBLEMS.filter(p => 
          p.gradeLevel === gradeLevel && p.schoolLevel === schoolLevel
        )
      ];
    }
    // 上位レベル問題
    else if (schoolLevel === 'advanced') {
      allProblems = this.ADVANCED_PROBLEMS.filter(p => 
        p.gradeLevel === gradeLevel && p.schoolLevel === schoolLevel
      );
    }
    // 最難関レベル問題（既存のエリートデータベースを利用）
    else if (schoolLevel === 'elite') {
      const eliteProblems = eliteProblemDatabase.getEliteProblems(subject, 8, maxProblems);
      // EliteProblemをComprehensiveProblemに変換
      return eliteProblems.map(p => this.convertEliteToComprehensive(p, gradeLevel));
    }
    
    // 教科フィルター
    if (subject) {
      allProblems = allProblems.filter(p => p.subject === subject);
    }
    
    // 難易度順ソート
    allProblems.sort((a, b) => a.difficulty - b.difficulty);
    
    console.log(`📚 問題選択: ${gradeLevel} × ${schoolLevel} × ${subject || '全教科'} = ${allProblems.length}問`);
    
    return allProblems.slice(0, maxProblems);
  }
  
  // 🎲 ランダム問題選択
  public getRandomProblem(
    gradeLevel: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    subject?: 'math' | 'japanese' | 'science' | 'social',
    excludeIds: string[] = []
  ): ComprehensiveProblem | null {
    
    const availableProblems = this.getProblemsForLevel(gradeLevel, schoolLevel, subject, 100)
      .filter(p => !excludeIds.includes(p.id));
    
    if (availableProblems.length === 0) {
      console.warn(`⚠️ 利用可能な問題がありません: ${gradeLevel} × ${schoolLevel} × ${subject}`);
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableProblems.length);
    const selectedProblem = availableProblems[randomIndex];
    
    console.log(`🎯 問題選択: ${selectedProblem.title} (難易度${selectedProblem.difficulty})`);
    
    return selectedProblem;
  }
  
  // 📊 データベース統計
  public getDatabaseStats(): {
    totalProblems: number;
    byGrade: Record<string, number>;
    bySchool: Record<string, number>;
    bySubject: Record<string, number>;
    averageDifficulty: Record<string, number>;
  } {
    
    const allProblems = [
      ...this.BASIC_PROBLEMS,
      ...this.STANDARD_PROBLEMS,
      ...this.ADVANCED_PROBLEMS,
      ...this.JAPANESE_PROBLEMS
    ];
    
    const byGrade: Record<string, number> = {};
    const bySchool: Record<string, number> = {};
    const bySubject: Record<string, number> = {};
    const difficultyBySchool: Record<string, number[]> = {};
    
    allProblems.forEach(problem => {
      byGrade[problem.gradeLevel] = (byGrade[problem.gradeLevel] || 0) + 1;
      bySchool[problem.schoolLevel] = (bySchool[problem.schoolLevel] || 0) + 1;
      bySubject[problem.subject] = (bySubject[problem.subject] || 0) + 1;
      
      if (!difficultyBySchool[problem.schoolLevel]) {
        difficultyBySchool[problem.schoolLevel] = [];
      }
      difficultyBySchool[problem.schoolLevel].push(problem.difficulty);
    });
    
    const averageDifficulty: Record<string, number> = {};
    Object.entries(difficultyBySchool).forEach(([level, difficulties]) => {
      const avg = difficulties.reduce((sum, d) => sum + d, 0) / difficulties.length;
      averageDifficulty[level] = Math.round(avg * 10) / 10;
    });
    
    return {
      totalProblems: allProblems.length,
      byGrade,
      bySchool,
      bySubject,
      averageDifficulty
    };
  }
  
  // 🔄 適応型問題選択
  public getAdaptiveProblem(
    gradeLevel: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    userPerformance: {
      recentAccuracy: number;
      averageTime: number;
      preferredSubject?: string;
      weakAreas: string[];
      strongAreas: string[];
    }
  ): ComprehensiveProblem | null {
    
    // パフォーマンスに基づく学校レベル調整
    let adjustedSchoolLevel = schoolLevel;
    
    if (userPerformance.recentAccuracy > 0.85) {
      // 正答率が高い場合は一段階上のレベルを検討
      if (schoolLevel === 'basic') adjustedSchoolLevel = 'standard';
      else if (schoolLevel === 'standard') adjustedSchoolLevel = 'advanced';
      // eliteは最高レベルなので変更なし
    } else if (userPerformance.recentAccuracy < 0.6) {
      // 正答率が低い場合は基本レベルに戻る
      if (schoolLevel !== 'basic') {
        console.log('⚠️ 正答率低下により基本レベルの問題を選択');
        adjustedSchoolLevel = 'basic';
      }
    }
    
    // 弱点分野を優先
    let targetSubject = userPerformance.preferredSubject as any;
    if (userPerformance.weakAreas.length > 0) {
      const weakSubjects = userPerformance.weakAreas.filter(area => 
        ['math', 'japanese', 'science', 'social'].includes(area)
      );
      if (weakSubjects.length > 0) {
        targetSubject = weakSubjects[0] as any;
        console.log(`💪 弱点克服: ${targetSubject}の問題を選択`);
      }
    }
    
    return this.getRandomProblem(gradeLevel, adjustedSchoolLevel, targetSubject);
  }
  
  // ヘルパーメソッド: EliteProblemをComprehensiveProblemに変換
  private convertEliteToComprehensive(
    eliteProblem: EliteProblem, 
    gradeLevel: '4th' | '5th' | '6th'
  ): ComprehensiveProblem {
    return {
      id: eliteProblem.id,
      title: eliteProblem.title,
      difficulty: eliteProblem.difficulty,
      subject: eliteProblem.subject,
      topic: eliteProblem.topic,
      subtopic: eliteProblem.subtopic,
      content: eliteProblem.content,
      gradeLevel: gradeLevel,
      schoolLevel: 'elite',
      expectedTime: eliteProblem.expectedTime,
      requiredSkills: eliteProblem.requiredSkills,
      cognitiveLoad: eliteProblem.cognitiveLoad,
      solution: eliteProblem.solution,
      explanation: eliteProblem.explanation,
      alternativeMethods: eliteProblem.alternativeMethods,
      commonMistakes: eliteProblem.commonMistakes,
      learningObjectives: ['最難関校レベルの思考力育成']
    };
  }
  
  // 🎯 学習進度に応じた問題推奨
  public recommendNextProblems(
    gradeLevel: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'elite',
    completedProblems: string[],
    performanceData: { [problemId: string]: { correct: boolean; time: number } }
  ): {
    recommendedProblems: ComprehensiveProblem[];
    reasoning: string;
    focusAreas: string[];
  } {
    
    // 完了した問題の分析
    const completedCorrect = completedProblems.filter(id => 
      performanceData[id]?.correct
    ).length;
    
    const accuracy = completedCorrect / completedProblems.length;
    
    let reasoning = '';
    let focusAreas: string[] = [];
    
    if (accuracy > 0.8) {
      reasoning = '高い正答率を維持しています。より挑戦的な問題をお勧めします。';
      focusAreas = ['応用問題', 'より高いレベル'];
    } else if (accuracy > 0.6) {
      reasoning = '基本的な理解はできています。弱点を重点的に学習しましょう。';
      focusAreas = ['弱点補強', '反復練習'];
    } else {
      reasoning = '基礎をしっかり固めることが重要です。';
      focusAreas = ['基礎問題', '丁寧な理解'];
    }
    
    const recommendedProblems = this.getProblemsForLevel(
      gradeLevel, schoolLevel, undefined, 5
    ).filter(p => !completedProblems.includes(p.id));
    
    return {
      recommendedProblems,
      reasoning,
      focusAreas
    };
  }
}

// シングルトンインスタンス
export const comprehensiveProblemDatabase = new ComprehensiveProblemDatabase();

// 便利な使用関数
export const getProblemForStudent = (
  grade: '4th' | '5th' | '6th',
  school: 'basic' | 'standard' | 'advanced' | 'elite',
  subject?: string
): ComprehensiveProblem | null => {
  return comprehensiveProblemDatabase.getRandomProblem(grade, school, subject as any);
};

export const getDatabaseOverview = () => {
  return comprehensiveProblemDatabase.getDatabaseStats();
};

export const getAdaptiveRecommendation = (
  grade: '4th' | '5th' | '6th',
  school: 'basic' | 'standard' | 'advanced' | 'elite',
  performance: any
) => {
  return comprehensiveProblemDatabase.getAdaptiveProblem(grade, school, performance);
};