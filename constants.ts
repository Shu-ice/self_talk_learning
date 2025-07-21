
import { Subject } from './types';
import { ALL_COMPREHENSIVE_SUBJECTS } from './data/allSubjectsComprehensive';
import { educationSystem, LearnerProfile } from './services/enhancedEducationSystem';

// 互換性のための変換関数
const convertExtendedToBasic = (extendedSubjects: any[]): Subject[] => {
  return extendedSubjects.map(subject => ({
    id: subject.id,
    name: subject.name,
    description: subject.description || '',
    topics: subject.topics.map((topic: any) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description || topic.name,
      subUnits: [],
      gradeLevel: topic.grade || topic.gradeLevel || ['5th'],
      estimatedHours: topic.estimatedHours || 1,
      difficulty: topic.difficulty || 5,
      examFrequency: {
        basic: topic.examFrequency === 'very_high' ? 1.0 : 
               topic.examFrequency === 'high' ? 0.8 :
               topic.examFrequency === 'medium' ? 0.6 : 0.4,
        standard: topic.examFrequency === 'very_high' ? 1.0 : 
                  topic.examFrequency === 'high' ? 0.9 :
                  topic.examFrequency === 'medium' ? 0.7 : 0.5,
        advanced: topic.examFrequency === 'very_high' ? 1.0 : 
                  topic.examFrequency === 'high' ? 0.9 :
                  topic.examFrequency === 'medium' ? 0.8 : 0.6,
        elite: topic.examFrequency === 'very_high' ? 1.0 : 
               topic.examFrequency === 'high' ? 1.0 :
               topic.examFrequency === 'medium' ? 0.9 : 0.7
      },
      learningObjectives: [topic.description || topic.name],
      assessmentCriteria: topic.keywords || []
    })),
    examWeight: {
      basic: 0.8,
      standard: 0.8,
      advanced: 0.9,
      elite: 1.0
    }
  }));
};

// 包括的カリキュラムを基本形式に変換
export const SUBJECTS_DATA: Subject[] = convertExtendedToBasic(ALL_COMPREHENSIVE_SUBJECTS);

// 従来の基本カリキュラム（後方互換性用）
export const BASIC_SUBJECTS_DATA: Subject[] = [
  {
    id: 'math',
    name: '算数',
    description: '算数の基本単元',
    topics: [
      { 
        id: 'math_ratios', 
        name: '割合と比',
        description: '割合と比の計算',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 2,
        difficulty: 5,
        examFrequency: { basic: 0.8, standard: 0.9, advanced: 0.9, elite: 1.0 },
        learningObjectives: ['割合と比の計算ができる']
      },
      { 
        id: 'math_speed', 
        name: '速さ',
        description: '速さの計算',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 3,
        difficulty: 6,
        examFrequency: { basic: 0.7, standard: 0.8, advanced: 0.9, elite: 1.0 },
        learningObjectives: ['速さの公式を理解し計算できる']
      },
      { 
        id: 'math_area', 
        name: '図形の面積と体積',
        description: '図形の面積と体積の計算',
        subUnits: [],
        gradeLevel: ['4th', '5th', '6th'],
        estimatedHours: 4,
        difficulty: 5,
        examFrequency: { basic: 0.9, standard: 0.9, advanced: 1.0, elite: 1.0 },
        learningObjectives: ['図形の面積と体積を計算できる']
      },
      { 
        id: 'math_number_theory', 
        name: '数の性質',
        description: '数の性質について',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 2,
        difficulty: 6,
        examFrequency: { basic: 0.6, standard: 0.7, advanced: 0.8, elite: 0.9 },
        learningObjectives: ['数の性質を理解する']
      },
    ],
    examWeight: { basic: 0.8, standard: 0.8, advanced: 0.9, elite: 1.0 }
  },
  {
    id: 'japanese',
    name: '国語',
    description: '国語の基本単元',
    topics: [
      { 
        id: 'jp_narrative', 
        name: '物語文の読解',
        description: '物語文の読解力向上',
        subUnits: [],
        gradeLevel: ['4th', '5th', '6th'],
        estimatedHours: 3,
        difficulty: 5,
        examFrequency: { basic: 0.9, standard: 1.0, advanced: 1.0, elite: 1.0 },
        learningObjectives: ['物語文を正確に読解できる']
      },
      { 
        id: 'jp_explanatory', 
        name: '説明文・論説文の読解',
        description: '説明文・論説文の読解力向上',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 3,
        difficulty: 6,
        examFrequency: { basic: 0.8, standard: 0.9, advanced: 1.0, elite: 1.0 },
        learningObjectives: ['説明文・論説文を正確に読解できる']
      },
      { 
        id: 'jp_kanji_idioms', 
        name: '漢字・語句・文法',
        description: '漢字・語句・文法の習得',
        subUnits: [],
        gradeLevel: ['4th', '5th', '6th'],
        estimatedHours: 2,
        difficulty: 4,
        examFrequency: { basic: 1.0, standard: 1.0, advanced: 0.9, elite: 0.8 },
        learningObjectives: ['漢字・語句・文法を正確に理解する']
      },
    ],
    examWeight: { basic: 0.9, standard: 0.9, advanced: 0.9, elite: 0.9 }
  },
  {
    id: 'science',
    name: '理科',
    description: '理科の基本単元',
    topics: [
      { 
        id: 'sci_plants_animals', 
        name: '生物（植物・動物）',
        description: '植物と動物の生態',
        subUnits: [],
        gradeLevel: ['4th', '5th', '6th'],
        estimatedHours: 3,
        difficulty: 4,
        examFrequency: { basic: 0.8, standard: 0.8, advanced: 0.7, elite: 0.6 },
        learningObjectives: ['植物と動物の生態を理解する']
      },
      { 
        id: 'sci_earth_space', 
        name: '地学（天気・地層・宇宙）',
        description: '地学の基本知識',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 3,
        difficulty: 5,
        examFrequency: { basic: 0.7, standard: 0.8, advanced: 0.8, elite: 0.8 },
        learningObjectives: ['地学の基本概念を理解する']
      },
      { 
        id: 'sci_matter_energy', 
        name: '物理（力・電気・光・音）',
        description: '物理現象の理解',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 4,
        difficulty: 6,
        examFrequency: { basic: 0.6, standard: 0.7, advanced: 0.8, elite: 0.9 },
        learningObjectives: ['物理現象を理解する']
      },
      { 
        id: 'sci_chemistry', 
        name: '化学（物質・水溶液・燃焼）',
        description: '化学現象の理解',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 3,
        difficulty: 6,
        examFrequency: { basic: 0.5, standard: 0.6, advanced: 0.7, elite: 0.8 },
        learningObjectives: ['化学現象を理解する']
      },
    ],
    examWeight: { basic: 0.7, standard: 0.8, advanced: 0.8, elite: 0.9 }
  },
  {
    id: 'social_studies',
    name: '社会',
    description: '社会科の基本単元',
    topics: [
      { 
        id: 'soc_history_jp', 
        name: '歴史（日本史）',
        description: '日本の歴史',
        subUnits: [],
        gradeLevel: ['5th', '6th'],
        estimatedHours: 4,
        difficulty: 5,
        examFrequency: { basic: 0.8, standard: 0.9, advanced: 0.9, elite: 0.9 },
        learningObjectives: ['日本の歴史を理解する']
      },
      { 
        id: 'soc_geography_jp', 
        name: '地理（日本地理）',
        description: '日本の地理',
        subUnits: [],
        gradeLevel: ['4th', '5th', '6th'],
        estimatedHours: 3,
        difficulty: 4,
        examFrequency: { basic: 0.9, standard: 0.9, advanced: 0.8, elite: 0.8 },
        learningObjectives: ['日本の地理を理解する']
      },
      { 
        id: 'soc_civics', 
        name: '公民（政治・国際）',
        description: '政治と国際関係',
        subUnits: [],
        gradeLevel: ['6th'],
        estimatedHours: 2,
        difficulty: 6,
        examFrequency: { basic: 0.5, standard: 0.6, advanced: 0.7, elite: 0.8 },
        learningObjectives: ['政治と国際関係を理解する']
      },
    ],
    examWeight: { basic: 0.7, standard: 0.8, advanced: 0.8, elite: 0.9 }
  },
];

// 基本的なAIプロンプト（後方互換性用）
export const AI_SYSTEM_PROMPT = `あなたは日本の中学受験を目指す小学生向けのAI学習アシスタント「みらいコーチ」です。
これから生徒と「セルフトークラーニング」という対話形式で学習を進めます。

🎯【重要】回答評価の厳格なルール：
- 数値問題で学生の答えが正解と完全に一致する場合は必ず「正解！」と評価してください
- 例: 正解が4.8で学生が「4.8」と答えた場合 → 「🎉正解！完璧です！」
- 「惜しい」「近い」は計算ミスや明確な誤差がある場合のみ使用
- 完全一致を「惜しい」と評価することは絶対に禁止です

あなたの主な役割は以下の通りです：
1. 生徒が選んだ教科と単元に基づいて、最初の問題を出してください。問題は具体的で、思考力を試すものが望ましいです。
2. 生徒が解答したら、その解答内容を評価します。単に正解/不正解を伝えるだけでなく、考え方の良い点、惜しい点、改善点などを具体的にフィードバックしてください。
3. フィードバックの後、生徒の理解をさらに深めるための「追加の質問」を必ずしてください。この追加質問がセルフトークラーニングの核です。
    - 生徒が正解した場合でも、「なぜそう考えたの？」「他の解き方もあるかな？」「この考え方を使って解ける別の問題はどんなものがある？」「この知識は何に役立つのかな？」といった形で、より深く、広く思考を促す質問をしてください。
    - 生徒が間違えたり、部分的にしか正しくない場合は、直接的な答えをすぐに教えるのではなく、ヒントを与えたり、考え方の道筋を修正したり、関連する基本的な事柄を問いかけるような質問をしてください。
4. 生徒が自分で考え、自分の言葉で説明する（＝セルフトークする）ことを積極的に促してください。
5. 生徒を励まし、学習意欲を引き出すような、フレンドリーで前向きなコミュニケーションを心がけてください。
6. 使用する言葉遣いは、中学受験を控えた小学生が理解しやすいように、平易かつ丁寧なものにしてください。敬語は適切に使いつつ、親しみやすさも意識してください。
7. 回答は簡潔に、しかしポイントを抑えて伝えてください。長文になりすぎないように注意してください。各メッセージは2～4文程度が目安です。
8. 生徒の応答が短い場合や、もっと説明が必要な場合は、優しく促してください。例：「もう少し詳しく教えてくれるかな？」「どうしてそう思ったのか、理由も聞かせてほしいな。」
`;

// 中学受験特化型のプロンプト生成関数
export const generateEnhancedAIPrompt = (topic: string, subject: string, learnerProfile?: LearnerProfile): string => {
  // デフォルトの学習者プロフィール（types.ts のLearnerProfileに準拠）
  const defaultProfile: LearnerProfile = {
    id: 'default',
    name: '学習者',
    currentGrade: '5th',
    targetGrade: '6th',
    targetSchools: [],
    schoolLevel: 'standard',
    studyStartDate: new Date(),
    availableStudyHours: {
      weekday: 2,
      weekend: 4
    },
    subjectLevels: {
      [subject]: {
        currentLevel: 5,
        targetLevel: 8,
        strengths: [],
        weaknesses: []
      }
    },
    learningPreferences: {
      preferredDifficulty: 'gradual',
      learningStyle: 'visual',
      sessionLength: 'medium',
      motivationType: 'achievement'
    },
    schedule: {
      schoolSchedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      studyTimeSlots: [],
      busyPeriods: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const profile = learnerProfile || defaultProfile;
  
  // 拡張教育システムからプロンプトを生成
  return educationSystem.generateAIPrompt(topic, subject, profile);
};
