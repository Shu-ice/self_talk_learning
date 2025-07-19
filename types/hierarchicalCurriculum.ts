// 3階層カリキュラム構造の型定義
// 大項目 → 中項目 → 小項目

export interface SmallCategory {
  id: string;
  name: string;
  description: string;
  difficulty: number; // 1-10
  estimatedHours: number;
  keywords: string[];
  prerequisites: string[]; // 前提となる小項目のID
}

export interface MediumCategory {
  id: string;
  name: string;
  description: string;
  smallCategories: SmallCategory[];
}

export interface LargeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  mediumCategories: MediumCategory[];
}

export interface HierarchicalSubject {
  id: string;
  name: string;
  description: string;
  largeCategories: LargeCategory[];
}

// 算数の3階層構造データ
export const MATH_HIERARCHICAL: HierarchicalSubject = {
  id: 'math',
  name: '算数',
  description: '中学受験算数の全分野を体系的に学習',
  largeCategories: [
    {
      id: 'numbers',
      name: '数',
      description: '数の概念、四則演算、分数・小数・整数の性質',
      icon: '🔢',
      mediumCategories: [
        {
          id: 'basic_operations',
          name: '四則演算',
          description: '足し算、引き算、掛け算、割り算の基礎',
          smallCategories: [
            {
              id: 'addition_subtraction',
              name: '足し算・引き算',
              description: '基本的な足し算と引き算',
              difficulty: 1,
              estimatedHours: 2,
              keywords: ['足し算', '引き算', '筆算'],
              prerequisites: []
            },
            {
              id: 'multiplication_division',
              name: '掛け算・割り算',
              description: '基本的な掛け算と割り算',
              difficulty: 2,
              estimatedHours: 3,
              keywords: ['掛け算', '割り算', '九九'],
              prerequisites: ['addition_subtraction']
            },
            {
              id: 'mixed_calculations',
              name: '四則混合計算',
              description: '四則演算を組み合わせた計算',
              difficulty: 3,
              estimatedHours: 2,
              keywords: ['計算の順序', '括弧', '四則混合'],
              prerequisites: ['multiplication_division']
            }
          ]
        },
        {
          id: 'decimal_fractions',
          name: '小数・分数',
          description: '小数と分数の計算と性質',
          smallCategories: [
            {
              id: 'decimal_basics',
              name: '小数の基礎',
              description: '小数の概念と基本的な計算',
              difficulty: 2,
              estimatedHours: 3,
              keywords: ['小数点', '小数の大小', '小数の計算'],
              prerequisites: ['addition_subtraction']
            },
            {
              id: 'fraction_basics',
              name: '分数の基礎',
              description: '分数の概念と基本的な計算',
              difficulty: 3,
              estimatedHours: 4,
              keywords: ['分子', '分母', '約分', '通分'],
              prerequisites: ['multiplication_division']
            },
            {
              id: 'decimal_fraction_conversion',
              name: '小数と分数の変換',
              description: '小数と分数の相互変換',
              difficulty: 4,
              estimatedHours: 2,
              keywords: ['変換', '循環小数', '有限小数'],
              prerequisites: ['decimal_basics', 'fraction_basics']
            }
          ]
        },
        {
          id: 'number_properties',
          name: '数の性質',
          description: '倍数、約数、素数などの数の性質',
          smallCategories: [
            {
              id: 'multiples_divisors',
              name: '倍数と約数',
              description: '倍数と約数の概念と求め方',
              difficulty: 4,
              estimatedHours: 3,
              keywords: ['倍数', '約数', '公倍数', '公約数'],
              prerequisites: ['multiplication_division']
            },
            {
              id: 'prime_numbers',
              name: '素数と合成数',
              description: '素数と合成数の概念',
              difficulty: 5,
              estimatedHours: 2,
              keywords: ['素数', '合成数', '素因数分解'],
              prerequisites: ['multiples_divisors']
            }
          ]
        }
      ]
    },
    {
      id: 'plane_geometry',
      name: '平面図形',
      description: '平面上の図形の性質と計算',
      icon: '⬜',
      mediumCategories: [
        {
          id: 'basic_shapes',
          name: '基本図形',
          description: '三角形、四角形、円などの基本図形',
          smallCategories: [
            {
              id: 'triangles',
              name: '三角形',
              description: '三角形の性質と面積の求め方',
              difficulty: 3,
              estimatedHours: 3,
              keywords: ['三角形', '底辺', '高さ', '面積'],
              prerequisites: ['multiplication_division']
            },
            {
              id: 'quadrilaterals',
              name: '四角形',
              description: '正方形、長方形、平行四辺形などの四角形',
              difficulty: 3,
              estimatedHours: 3,
              keywords: ['正方形', '長方形', '平行四辺形', '台形'],
              prerequisites: ['triangles']
            },
            {
              id: 'circles',
              name: '円',
              description: '円の性質と円周、面積の計算',
              difficulty: 4,
              estimatedHours: 3,
              keywords: ['円', '円周', '半径', '直径', '円周率'],
              prerequisites: ['multiplication_division']
            }
          ]
        },
        {
          id: 'complex_shapes',
          name: '複合図形',
          description: '複数の図形を組み合わせた図形',
          smallCategories: [
            {
              id: 'composite_areas',
              name: '複合図形の面積',
              description: '複数の図形を組み合わせた面積の計算',
              difficulty: 5,
              estimatedHours: 4,
              keywords: ['複合図形', '面積の計算', '組み合わせ'],
              prerequisites: ['triangles', 'quadrilaterals', 'circles']
            },
            {
              id: 'similar_figures',
              name: '相似な図形',
              description: '相似な図形の性質と計算',
              difficulty: 6,
              estimatedHours: 3,
              keywords: ['相似', '相似比', '面積比'],
              prerequisites: ['composite_areas']
            }
          ]
        }
      ]
    },
    {
      id: 'solid_geometry',
      name: '立体図形',
      description: '立体図形の性質と体積・表面積の計算',
      icon: '🧊',
      mediumCategories: [
        {
          id: 'basic_solids',
          name: '基本立体',
          description: '直方体、立方体、円柱などの基本立体',
          smallCategories: [
            {
              id: 'rectangular_prisms',
              name: '直方体・立方体',
              description: '直方体と立方体の体積と表面積',
              difficulty: 4,
              estimatedHours: 3,
              keywords: ['直方体', '立方体', '体積', '表面積'],
              prerequisites: ['quadrilaterals']
            },
            {
              id: 'cylinders',
              name: '円柱',
              description: '円柱の体積と表面積',
              difficulty: 5,
              estimatedHours: 3,
              keywords: ['円柱', '底面積', '側面積'],
              prerequisites: ['circles']
            }
          ]
        },
        {
          id: 'complex_solids',
          name: '複合立体',
          description: '複数の立体を組み合わせた図形',
          smallCategories: [
            {
              id: 'composite_volumes',
              name: '複合立体の体積',
              description: '複数の立体を組み合わせた体積の計算',
              difficulty: 6,
              estimatedHours: 4,
              keywords: ['複合立体', '体積の計算'],
              prerequisites: ['rectangular_prisms', 'cylinders']
            }
          ]
        }
      ]
    },
    {
      id: 'speed',
      name: '速さ',
      description: '速さ・時間・距離の関係と応用問題',
      icon: '🏃',
      mediumCategories: [
        {
          id: 'basic_speed',
          name: '速さの基本',
          description: '速さの概念と基本的な計算',
          smallCategories: [
            {
              id: 'speed_formula',
              name: '速さの公式',
              description: '速さ＝距離÷時間の基本公式',
              difficulty: 4,
              estimatedHours: 3,
              keywords: ['速さ', '距離', '時間', '公式'],
              prerequisites: ['decimal_fraction_conversion']
            },
            {
              id: 'unit_conversion',
              name: '単位の変換',
              description: '時速、分速、秒速の変換',
              difficulty: 5,
              estimatedHours: 2,
              keywords: ['時速', '分速', '秒速', '単位変換'],
              prerequisites: ['speed_formula']
            }
          ]
        },
        {
          id: 'advanced_speed',
          name: '速さの応用',
          description: '往復、出会い、追いかけなどの応用問題',
          smallCategories: [
            {
              id: 'round_trip',
              name: '往復の問題',
              description: '往復の平均速度などの問題',
              difficulty: 6,
              estimatedHours: 3,
              keywords: ['往復', '平均速度'],
              prerequisites: ['unit_conversion']
            },
            {
              id: 'meeting_chasing',
              name: '出会いと追いかけ',
              description: '2つの物体の運動問題',
              difficulty: 7,
              estimatedHours: 4,
              keywords: ['出会い', '追いかけ', '相対速度'],
              prerequisites: ['round_trip']
            }
          ]
        }
      ]
    },
    {
      id: 'combinations',
      name: '場合の数',
      description: '順列・組み合わせ・確率の基礎',
      icon: '🎲',
      mediumCategories: [
        {
          id: 'counting_principles',
          name: '数え上げの原理',
          description: '場合の数の基本的な数え方',
          smallCategories: [
            {
              id: 'basic_counting',
              name: '基本的な場合の数',
              description: '樹形図や表を使った数え上げ',
              difficulty: 4,
              estimatedHours: 3,
              keywords: ['場合の数', '樹形図', '表'],
              prerequisites: ['multiplication_division']
            },
            {
              id: 'permutations',
              name: '順列',
              description: '順序を考える並べ方の問題',
              difficulty: 6,
              estimatedHours: 3,
              keywords: ['順列', '階乗', '並べ方'],
              prerequisites: ['basic_counting']
            },
            {
              id: 'combinations',
              name: '組み合わせ',
              description: '順序を考えない選び方の問題',
              difficulty: 7,
              estimatedHours: 3,
              keywords: ['組み合わせ', '選び方'],
              prerequisites: ['permutations']
            }
          ]
        }
      ]
    },
    {
      id: 'ratios_proportions',
      name: '比と割合',
      description: '比、割合、百分率の計算と応用',
      icon: '⚖️',
      mediumCategories: [
        {
          id: 'basic_ratios',
          name: '比の基本',
          description: '比の概念と基本的な計算',
          smallCategories: [
            {
              id: 'ratio_concepts',
              name: '比の概念',
              description: '比の意味と表し方',
              difficulty: 4,
              estimatedHours: 2,
              keywords: ['比', '比の値', '連比'],
              prerequisites: ['fraction_basics']
            },
            {
              id: 'proportion_calculations',
              name: '比例の計算',
              description: '比例式と比例配分',
              difficulty: 5,
              estimatedHours: 3,
              keywords: ['比例', '比例配分', '比例式'],
              prerequisites: ['ratio_concepts']
            }
          ]
        },
        {
          id: 'percentages',
          name: '割合と百分率',
          description: '割合、百分率、歩合の計算',
          smallCategories: [
            {
              id: 'percentage_basics',
              name: '百分率の基本',
              description: '百分率の概念と基本計算',
              difficulty: 5,
              estimatedHours: 3,
              keywords: ['百分率', 'パーセント', '歩合'],
              prerequisites: ['decimal_fraction_conversion']
            },
            {
              id: 'percentage_applications',
              name: '割合の応用',
              description: '売買損益、食塩水などの応用問題',
              difficulty: 6,
              estimatedHours: 4,
              keywords: ['売買損益', '食塩水', '濃度'],
              prerequisites: ['percentage_basics', 'proportion_calculations']
            }
          ]
        }
      ]
    },
    {
      id: 'special_calculations',
      name: '文章題（特殊算）',
      description: '中学受験特有の文章題解法',
      icon: '📝',
      mediumCategories: [
        {
          id: 'age_problems',
          name: '年齢算',
          description: '年齢の関係を扱う問題',
          smallCategories: [
            {
              id: 'basic_age_problems',
              name: '基本的な年齢算',
              description: '現在と過去・未来の年齢関係',
              difficulty: 5,
              estimatedHours: 3,
              keywords: ['年齢算', '年齢差', '年齢の和'],
              prerequisites: ['mixed_calculations']
            }
          ]
        },
        {
          id: 'work_problems',
          name: '仕事算',
          description: '仕事の効率と時間の関係',
          smallCategories: [
            {
              id: 'basic_work_problems',
              name: '基本的な仕事算',
              description: '仕事の全体量と効率の概念',
              difficulty: 6,
              estimatedHours: 4,
              keywords: ['仕事算', '効率', '仕事量'],
              prerequisites: ['proportion_calculations']
            }
          ]
        },
        {
          id: 'travel_problems',
          name: '旅人算',
          description: '移動する物体の問題',
          smallCategories: [
            {
              id: 'basic_travel_problems',
              name: '基本的な旅人算',
              description: '出会いと追い越しの基本',
              difficulty: 6,
              estimatedHours: 4,
              keywords: ['旅人算', '出会い', '追い越し'],
              prerequisites: ['meeting_chasing']
            }
          ]
        },
        {
          id: 'water_tank_problems',
          name: '水槽算',
          description: '水の流入・流出の問題',
          smallCategories: [
            {
              id: 'basic_water_tank',
              name: '基本的な水槽算',
              description: '給水と排水の基本概念',
              difficulty: 7,
              estimatedHours: 4,
              keywords: ['水槽算', '給水', '排水'],
              prerequisites: ['basic_work_problems']
            }
          ]
        }
      ]
    },
    {
      id: 'others',
      name: 'その他',
      description: 'その他の重要な算数の分野',
      icon: '📚',
      mediumCategories: [
        {
          id: 'logical_thinking',
          name: '論理・推理',
          description: '論理的思考力を問う問題',
          smallCategories: [
            {
              id: 'logic_puzzles',
              name: '論理パズル',
              description: '条件を整理して解く問題',
              difficulty: 6,
              estimatedHours: 3,
              keywords: ['論理', '推理', '条件整理'],
              prerequisites: ['basic_counting']
            }
          ]
        },
        {
          id: 'number_sequences',
          name: '数列・規則性',
          description: '数の並びの規則を見つける問題',
          smallCategories: [
            {
              id: 'arithmetic_sequences',
              name: '等差数列',
              description: '一定の差で増減する数列',
              difficulty: 5,
              estimatedHours: 3,
              keywords: ['等差数列', '公差', '規則性'],
              prerequisites: ['mixed_calculations']
            }
          ]
        }
      ]
    }
  ]
};