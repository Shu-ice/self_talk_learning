import { Subject, Topic, SubUnit, GradeLevel } from '../types';

// 算数のサブユニット詳細定義
const mathSubUnits: { [key: string]: SubUnit[] } = {
  'math_basic_arithmetic': [
    {
      id: 'arithmetic_addition_subtraction',
      name: '整数の加法・減法',
      description: '3桁以上の整数の加減計算',
      prerequisites: [],
      estimatedStudyTime: 20,
      difficultyRange: [1, 2],
      keywordTags: ['加法', '減法', '繰り上がり', '繰り下がり']
    },
    {
      id: 'arithmetic_multiplication',
      name: '整数の乗法',
      description: '2桁×2桁、3桁×1桁の計算',
      prerequisites: ['arithmetic_addition_subtraction'],
      estimatedStudyTime: 25,
      difficultyRange: [2, 3],
      keywordTags: ['乗法', '九九', '筆算']
    },
    {
      id: 'arithmetic_division',
      name: '整数の除法',
      description: '割り切れる除法、余りのある除法',
      prerequisites: ['arithmetic_multiplication'],
      estimatedStudyTime: 30,
      difficultyRange: [2, 4],
      keywordTags: ['除法', '割り算', '余り', '商']
    }
  ],
  'math_fractions': [
    {
      id: 'fraction_basics',
      name: '分数の基本概念',
      description: '分数の意味、同値分数、約分・通分',
      prerequisites: ['arithmetic_division'],
      estimatedStudyTime: 35,
      difficultyRange: [2, 3],
      keywordTags: ['分数', '約分', '通分', '分子', '分母']
    },
    {
      id: 'fraction_operations',
      name: '分数の四則演算',
      description: '分数の加減乗除',
      prerequisites: ['fraction_basics'],
      estimatedStudyTime: 40,
      difficultyRange: [3, 4],
      keywordTags: ['分数', '加法', '減法', '乗法', '除法']
    },
    {
      id: 'mixed_numbers',
      name: '帯分数と仮分数',
      description: '帯分数と仮分数の変換と計算',
      prerequisites: ['fraction_operations'],
      estimatedStudyTime: 25,
      difficultyRange: [3, 4],
      keywordTags: ['帯分数', '仮分数', '変換']
    }
  ],
  'math_decimals': [
    {
      id: 'decimal_basics',
      name: '小数の基本概念',
      description: '小数の意味、位取り、大小比較',
      prerequisites: ['fraction_basics'],
      estimatedStudyTime: 30,
      difficultyRange: [2, 3],
      keywordTags: ['小数', '位取り', '小数点']
    },
    {
      id: 'decimal_operations',
      name: '小数の四則演算',
      description: '小数の加減乗除',
      prerequisites: ['decimal_basics'],
      estimatedStudyTime: 35,
      difficultyRange: [3, 4],
      keywordTags: ['小数', '加法', '減法', '乗法', '除法']
    }
  ],
  'math_ratios_proportions': [
    {
      id: 'ratio_basics',
      name: '比の基本概念',
      description: '比の意味、比の値、等しい比',
      prerequisites: ['fraction_operations', 'decimal_operations'],
      estimatedStudyTime: 30,
      difficultyRange: [3, 4],
      keywordTags: ['比', '比の値', '等しい比']
    },
    {
      id: 'proportion_problems',
      name: '比例と反比例',
      description: '比例・反比例の関係と問題解決',
      prerequisites: ['ratio_basics'],
      estimatedStudyTime: 40,
      difficultyRange: [4, 5],
      keywordTags: ['比例', '反比例', '比例定数']
    },
    {
      id: 'percentage',
      name: '割合・百分率',
      description: '割合、百分率、歩合の概念と計算',
      prerequisites: ['ratio_basics'],
      estimatedStudyTime: 35,
      difficultyRange: [3, 5],
      keywordTags: ['割合', '百分率', '歩合', 'パーセント']
    }
  ],
  'math_geometry': [
    {
      id: 'basic_shapes',
      name: '基本図形',
      description: '三角形、四角形、円の性質',
      prerequisites: [],
      estimatedStudyTime: 25,
      difficultyRange: [1, 3],
      keywordTags: ['三角形', '四角形', '円', '角度']
    },
    {
      id: 'area_perimeter',
      name: '面積と周囲',
      description: '図形の面積と周囲の計算',
      prerequisites: ['basic_shapes', 'decimal_operations'],
      estimatedStudyTime: 40,
      difficultyRange: [3, 4],
      keywordTags: ['面積', '周囲', '公式']
    },
    {
      id: 'volume',
      name: '体積',
      description: '立体図形の体積計算',
      prerequisites: ['area_perimeter'],
      estimatedStudyTime: 35,
      difficultyRange: [4, 5],
      keywordTags: ['体積', '立体', '直方体', '円柱']
    }
  ]
};

// 詳細カリキュラムデータ
export const DETAILED_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: '算数',
    description: '中学受験に必要な算数の全分野を体系的に学習',
    examWeight: {
      basic: 0.8,
      standard: 0.8,
      advanced: 0.9,
      elite: 1.0
    },
    topics: [
      {
        id: 'math_basic_arithmetic',
        name: '基本計算',
        description: '整数の四則演算の習得',
        gradeLevel: ['4th'],
        difficulty: 3,
        estimatedHours: 2,
        examFrequency: {
          basic: 0.9,
          standard: 0.9,
          advanced: 0.8,
          elite: 0.7
        },
        subUnits: mathSubUnits['math_basic_arithmetic'],
        learningObjectives: [
          '正確で速い計算力を身につける',
          '計算の工夫ができるようになる',
          '暗算能力を向上させる'
        ],
        assessmentCriteria: [
          '計算の正確性（90%以上）',
          '計算速度（目標時間内）',
          '計算過程の説明ができる'
        ]
      },
      {
        id: 'math_fractions',
        name: '分数',
        description: '分数の概念と四則演算',
        gradeLevel: ['4th'],
        difficulty: 4,
        estimatedHours: 3,
        examFrequency: {
          basic: 0.8,
          standard: 0.9,
          advanced: 0.9,
          elite: 0.8
        },
        subUnits: mathSubUnits['math_fractions'],
        learningObjectives: [
          '分数の意味を理解する',
          '分数の四則演算ができる',
          '約分・通分が正確にできる'
        ],
        assessmentCriteria: [
          '概念理解（説明できる）',
          '計算の正確性（85%以上）',
          '文章題への応用'
        ]
      },
      {
        id: 'math_decimals',
        name: '小数',
        description: '小数の概念と四則演算',
        gradeLevel: ['4th'],
        difficulty: 4,
        estimatedHours: 3,
        examFrequency: {
          basic: 0.7,
          standard: 0.8,
          advanced: 0.8,
          elite: 0.7
        },
        subUnits: mathSubUnits['math_decimals'],
        learningObjectives: [
          '小数の意味を理解する',
          '小数の四則演算ができる',
          '分数と小数の関係を理解する'
        ],
        assessmentCriteria: [
          '位取りの理解',
          '計算の正確性（85%以上）',
          '実生活での応用'
        ]
      },
      {
        id: 'math_ratios_proportions',
        name: '比と割合',
        description: '比例・反比例、割合の問題解決',
        gradeLevel: ['6th'],
        difficulty: 6,
        estimatedHours: 4,
        examFrequency: {
          basic: 0.6,
          standard: 0.8,
          advanced: 0.9,
          elite: 1.0
        },
        subUnits: mathSubUnits['math_ratios_proportions'],
        learningObjectives: [
          '比の概念を理解する',
          '比例・反比例を使える',
          '割合の問題を解ける'
        ],
        assessmentCriteria: [
          '概念の正確な理解',
          '文章題の解法',
          'グラフの読み取り'
        ]
      },
      {
        id: 'math_geometry',
        name: '図形',
        description: '平面・立体図形の性質と計算',
        gradeLevel: ['5th'],
        difficulty: 5,
        estimatedHours: 4,
        examFrequency: {
          basic: 0.7,
          standard: 0.8,
          advanced: 0.9,
          elite: 0.9
        },
        subUnits: mathSubUnits['math_geometry'],
        learningObjectives: [
          '図形の性質を理解する',
          '面積・体積を計算できる',
          '図形の作図ができる'
        ],
        assessmentCriteria: [
          '性質の理解',
          '計算の正確性',
          '空間認識能力'
        ]
      }
    ],
    gradeMapping: {
      '4th': ['math_basic_arithmetic', 'math_fractions', 'math_decimals'],
      '5th': ['math_geometry'],
      '6th': ['math_ratios_proportions']
    }
  },
  {
    id: 'japanese',
    name: '国語',
    description: '読解力・表現力・語彙力を総合的に向上',
    examWeight: {
      basic: 0.9,
      standard: 0.9,
      advanced: 0.9,
      elite: 1.0
    },
    topics: [
      {
        id: 'jp_reading_comprehension',
        name: '読解総合',
        description: '文章読解の基礎技能',
        gradeLevel: ['4th', '5th', '6th'],
        difficulty: 5,
        estimatedHours: 3,
        examFrequency: {
          basic: 0.9,
          standard: 0.9,
          advanced: 1.0,
          elite: 1.0
        },
        subUnits: [
          {
            id: 'main_idea',
            name: '要旨把握',
            description: '文章の中心的な内容を理解する',
            prerequisites: [],
            estimatedStudyTime: 30,
            difficultyRange: [2, 4],
            keywordTags: ['要旨', '主題', '中心文']
          },
          {
            id: 'detail_comprehension',
            name: '詳細理解',
            description: '文章の細部を正確に読み取る',
            prerequisites: ['main_idea'],
            estimatedStudyTime: 35,
            difficultyRange: [3, 4],
            keywordTags: ['詳細', '根拠', '理由']
          }
        ],
        learningObjectives: [
          '文章の構造を理解する',
          '筆者の意図を読み取る',
          '論理的思考力を身につける'
        ],
        assessmentCriteria: [
          '要旨の正確な把握',
          '根拠を示した解答',
          '論理的な説明'
        ]
      }
    ],
    gradeMapping: {
      '4th': ['jp_reading_comprehension'],
      '5th': ['jp_reading_comprehension'],
      '6th': ['jp_reading_comprehension']
    }
  }
];

// 学年フィルタリング関数
export const getTopicsByGrade = (subjectId: string, grade: GradeLevel): Topic[] => {
  const subject = DETAILED_SUBJECTS.find(s => s.id === subjectId);
  if (!subject) return [];
  
  const gradeTopicIds = subject.gradeMapping[grade];
  return subject.topics.filter(topic => gradeTopicIds.includes(topic.id));
};

// サブユニット検索関数
export const findSubUnitsByKeyword = (keyword: string): SubUnit[] => {
  const results: SubUnit[] = [];
  
  DETAILED_SUBJECTS.forEach(subject => {
    subject.topics.forEach(topic => {
      topic.subUnits.forEach(subUnit => {
        if (
          subUnit.name.includes(keyword) ||
          subUnit.description.includes(keyword) ||
          subUnit.keywordTags.some(tag => tag.includes(keyword))
        ) {
          results.push(subUnit);
        }
      });
    });
  });
  
  return results;
};

// 前提条件チェック関数
export const checkPrerequisites = (subUnitId: string, completedSubUnits: string[]): boolean => {
  let targetSubUnit: SubUnit | null = null;
  
  // 対象のサブユニットを見つける
  for (const subject of DETAILED_SUBJECTS) {
    for (const topic of subject.topics) {
      const found = topic.subUnits.find(su => su.id === subUnitId);
      if (found) {
        targetSubUnit = found;
        break;
      }
    }
    if (targetSubUnit) break;
  }
  
  if (!targetSubUnit) return false;
  
  // 前提条件をすべて満たしているかチェック
  return targetSubUnit.prerequisites.every(prereq => completedSubUnits.includes(prereq));
};