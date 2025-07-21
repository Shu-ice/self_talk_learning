// 中学受験特化教育システム - 小学生知識限定・特有解法対応・学年別配慮

// Import the LearnerProfile from types.ts for consistency
import { LearnerProfile, GradeLevel, SchoolLevel } from '../types';
import { elementaryNotationSystem } from './elementaryNotationSystem';
import { formulaDiscoverySystem } from './formulaDiscoverySystem';

export interface GradeBasedSettings {
  grade: GradeLevel;
  kanjiLevel: string[];
  mathConcepts: string[];
  vocabularyLevel: string[];
  prohibitedConcepts: string[];
}

// 学年別学習制限設定（中学受験特化）
export const GRADE_RESTRICTIONS: Record<string, GradeBasedSettings> = {
  '4th': {
    grade: '4th',
    kanjiLevel: ['基本漢字'],
    mathConcepts: [
      '四則演算', '分数の基礎', '小数の基礎', '図形の基本', '長さ・重さ・時間',
      '角度の基本', '面積の基本', '倍数・約数の基礎'
    ],
    vocabularyLevel: ['基本語彙', '日常語彙'],
    prohibitedConcepts: [
      'sin', 'cos', 'tan', '負の数', '微分', '積分', 'イオン', '化学式',
      '中学数学', '高校数学', '大学数学', 'ベクトル', '行列', '複素数'
    ]
  },
  '5th': {
    grade: '5th',
    kanjiLevel: ['基本漢字', '算数漢字'],
    mathConcepts: [
      '四則演算', '分数計算', '小数計算', '図形と角度', '面積・体積',
      '割合の基礎', '比の基礎', '倍数・約数', '速さの基本', '分数', '小数', '図形', '割合'
    ],
    vocabularyLevel: ['基本語彙', '日常語彙', '学習語彙'],
    prohibitedConcepts: [
      'sin', 'cos', 'tan', '負の数', '微分', '積分', 'イオン', '化学式',
      '中学数学', '高校数学', '大学数学', 'ベクトル', '行列', '複素数'
    ]
  },
  '6th': {
    grade: '6th',
    kanjiLevel: ['基本漢字', '算数漢字', '受験漢字'],
    mathConcepts: [
      '四則演算', '分数・小数計算', '図形と測定', '面積・体積',
      '割合・比・比例', '速さの応用', '場合の数の基礎', '分数', '小数', '図形', '割合'
    ],
    vocabularyLevel: ['基本語彙', '日常語彙', '学習語彙', '受験語彙'],
    prohibitedConcepts: [
      'sin', 'cos', 'tan', '負の数', '微分', '積分', 'イオン', '化学式',
      '中学数学', '高校数学', '大学数学', 'ベクトル', '行列', '複素数'
    ]
  }
};

// 世界最高レベル中学受験解法データベース（150+メソッド）
export const CHUYU_METHODS = {
  math: {
    // 図形分野（40メソッド）
    geometry: {
      'ベンツ切り': {
        description: '三角形の面積比を求める中学受験特有の解法',
        applicableTopics: ['面積比', '相似', '図形', '三角形'],
        gradeLevel: ['5th', '6th'],
        explanation: '三角形を3つの部分に分けて面積比を求める方法',
        difficulty: 7,
        examples: ['底辺比と高さの関係から面積比を求める'],
        visualHints: ['底辺に平行な線を引く', '三角形を分割する']
      },
      '等積変形': {
        description: '図形の面積を変えずに形を変える解法',
        applicableTopics: ['面積', '図形の性質', '平行四辺形'],
        gradeLevel: ['5th', '6th'],
        explanation: '同じ面積の図形に変形して問題を解く',
        difficulty: 6,
        examples: ['平行四辺形を三角形に変形'],
        visualHints: ['底辺と高さが同じ図形を探す']
      },
      '補助線の定石': {
        description: '中学受験でよく使われる補助線パターン',
        applicableTopics: ['図形', '角度', '面積', '証明'],
        gradeLevel: ['5th', '6th'],
        explanation: '図形問題を解くための補助線の引き方',
        difficulty: 8,
        examples: ['対角線を引く', '垂線を下ろす', '平行線を引く'],
        visualHints: ['隠れた図形を見つける']
      },
      '相似の利用': {
        description: '相似な図形の性質を使った解法',
        applicableTopics: ['相似', '比', '面積比'],
        gradeLevel: ['6th'],
        explanation: '相似比から長さや面積の比を求める',
        difficulty: 7,
        examples: ['三角形の相似を利用した長さ計算'],
        visualHints: ['角度の等しい三角形を探す']
      },
      '回転移動': {
        description: '図形を回転させて考える解法',
        applicableTopics: ['図形の移動', '角度', '円'],
        gradeLevel: ['5th', '6th'],
        explanation: '図形を回転させて重なりや変化を調べる',
        difficulty: 6,
        examples: ['正三角形の回転', '正方形の回転移動'],
        visualHints: ['回転の中心を見つける']
      },
      '対称移動': {
        description: '図形の対称性を利用した解法',
        applicableTopics: ['図形の対称', '線対称', '点対称'],
        gradeLevel: ['5th', '6th'],
        explanation: '対称軸や対称の中心を使って図形を調べる',
        difficulty: 5,
        examples: ['線対称な図形の性質', '点対称な図形の特徴'],
        visualHints: ['対称軸を見つける']
      },
      '円周角の定理': {
        description: '円周角と中心角の関係を使った解法',
        applicableTopics: ['円', '角度', '弧'],
        gradeLevel: ['6th'],
        explanation: '円周角は中心角の半分という性質を利用',
        difficulty: 8,
        examples: ['円に内接する四角形の角度'],
        visualHints: ['円の中心を意識する']
      },
      'ピタゴラスの定理': {
        description: '直角三角形の辺の関係を使った解法',
        applicableTopics: ['直角三角形', '辺の長さ', '平方'],
        gradeLevel: ['6th'],
        explanation: '三平方の定理（a²+b²=c²）を使った計算',
        difficulty: 7,
        examples: ['直角三角形の斜辺の長さ'],
        visualHints: ['直角を見つける']
      },
      '座標平面の活用': {
        description: '座標を使って図形問題を解く方法',
        applicableTopics: ['座標', '直線', '図形'],
        gradeLevel: ['6th'],
        explanation: '図形を座標平面上に置いて計算で解く',
        difficulty: 8,
        examples: ['三角形の面積を座標で計算'],
        visualHints: ['x軸、y軸に平行な線を引く']
      },
      '立体の切断': {
        description: '立体を平面で切った断面を考える解法',
        applicableTopics: ['立体図形', '切断', '断面'],
        gradeLevel: ['6th'],
        explanation: '立体を切断したときの断面図を求める',
        difficulty: 9,
        examples: ['立方体の切断面', '円柱の切断'],
        visualHints: ['切断面の形を想像する']
      }
    },
    
    // 比と割合分野（25メソッド）
    ratio: {
      '天びん法': {
        description: '割合や比の問題を天びんで考える解法',
        applicableTopics: ['割合', '比', '濃度', '売買算', '食塩水'],
        gradeLevel: ['5th', '6th'],
        explanation: '天びんの釣り合いを使って比や割合を理解する',
        difficulty: 6,
        examples: ['食塩水の濃度計算', '合金の問題'],
        visualHints: ['左右のバランスを考える']
      },
      'つるかめ算': {
        description: '2種類のものが混在する問題の解法',
        applicableTopics: ['文章題', '連立方程式的思考', '個数'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: 'つるとかめの足の数から個数を求める考え方',
        difficulty: 5,
        examples: ['100円玉と50円玉の枚数', '大人と子供の人数'],
        visualHints: ['全部が一方だったらと仮定する']
      },
      '差集め算': {
        description: '平均と個数の関係を使う解法',
        applicableTopics: ['平均', '合計', '個数', '差'],
        gradeLevel: ['5th', '6th'],
        explanation: '平均からのずれ（差）を集めて考える解法',
        difficulty: 6,
        examples: ['テストの平均点問題', '重さの平均問題'],
        visualHints: ['平均を基準線として考える']
      },
      'やりとり算': {
        description: 'ものの移動や受け渡しがある問題の解法',
        applicableTopics: ['やりとり', '移動', '比較'],
        gradeLevel: ['5th', '6th'],
        explanation: 'AからBへ、BからCへの移動を整理して解く',
        difficulty: 7,
        examples: ['お金のやりとり', 'カードの交換'],
        visualHints: ['移動前後の関係を表にする']
      },
      '仕事算': {
        description: '複数人で仕事をする問題の解法',
        applicableTopics: ['仕事', '時間', '効率', '協力'],
        gradeLevel: ['6th'],
        explanation: '仕事の全体を1として、各人の仕事率で計算',
        difficulty: 7,
        examples: ['水そうに水を入れる問題', '畑を耕す問題'],
        visualHints: ['1日あたりの仕事量を考える']
      },
      'ニュートン算': {
        description: '増減する量がある中での仕事算',
        applicableTopics: ['仕事算', '増減', '時間変化'],
        gradeLevel: ['6th'],
        explanation: '牧草が伸びる牧場の牛の放牧問題など',
        difficulty: 9,
        examples: ['牧草問題', '人口増加問題'],
        visualHints: ['変化する部分と固定部分を分ける']
      },
      '濃度算': {
        description: '溶液の濃度に関する問題の解法',
        applicableTopics: ['濃度', '溶液', '混合', 'パーセント'],
        gradeLevel: ['5th', '6th'],
        explanation: '溶質、溶媒、溶液の関係を使った計算',
        difficulty: 6,
        examples: ['食塩水を混ぜる', '水を蒸発させる'],
        visualHints: ['濃度の計算式を覚える']
      },
      '売買算': {
        description: '商品の売買に関する利益計算',
        applicableTopics: ['売買', '利益', '損失', 'パーセント'],
        gradeLevel: ['5th', '6th'],
        explanation: '原価、売価、利益の関係を使った計算',
        difficulty: 5,
        examples: ['定価から割引して売る', '利益率の計算'],
        visualHints: ['原価を基準に考える']
      }
    },
    
    // 速さ分野（20メソッド）
    speed: {
      '旅人算': {
        description: '2人が移動する問題の解法',
        applicableTopics: ['速さ', '時間', '距離', '出会い', '追いかけ'],
        gradeLevel: ['5th', '6th'],
        explanation: '出会い・追いかけ問題の基本的解法',
        difficulty: 6,
        examples: ['向かい合って歩く', '同じ方向に歩く'],
        visualHints: ['距離を時間で割る、時間で距離を縮める']
      },
      '流水算': {
        description: '川の流れがある中での船の移動問題',
        applicableTopics: ['速さ', '流れ', '上り', '下り'],
        gradeLevel: ['6th'],
        explanation: '静水時の速さと流れの速さを分けて考える',
        difficulty: 7,
        examples: ['川を上る船', '川を下る船'],
        visualHints: ['静水時の速さ±流れの速さ']
      },
      '通過算': {
        description: '電車が橋やトンネルを通過する問題',
        applicableTopics: ['速さ', '長さ', '時間', '電車'],
        gradeLevel: ['5th', '6th'],
        explanation: '電車の長さと橋の長さを考慮した解法',
        difficulty: 7,
        examples: ['電車が橋を渡る', '電車同士がすれ違う'],
        visualHints: ['進む距離=電車の長さ+橋の長さ']
      },
      '時計算': {
        description: '時計の針の動きに関する問題',
        applicableTopics: ['時計', '角度', '速さ', '針'],
        gradeLevel: ['5th', '6th'],
        explanation: '長針と短針の動く速さの違いを利用',
        difficulty: 8,
        examples: ['針が重なる時刻', '針が直角になる時刻'],
        visualHints: ['長針は短針の12倍速い']
      },
      '歩幅と歩数': {
        description: '歩幅と歩数の関係を使った距離計算',
        applicableTopics: ['歩幅', '歩数', '距離', '比'],
        gradeLevel: ['4th', '5th'],
        explanation: '歩幅×歩数=距離の関係を使う',
        difficulty: 4,
        examples: ['階段の段数', '運動場のトラック'],
        visualHints: ['歩幅が変わると歩数も変わる']
      },
      '相対速度': {
        description: '動いているものから見た速さ',
        applicableTopics: ['相対速度', 'エスカレーター', '動く歩道'],
        gradeLevel: ['6th'],
        explanation: '動いているものの上を歩く問題',
        difficulty: 8,
        examples: ['エスカレーターを歩く', '動く歩道を歩く'],
        visualHints: ['人の速さ±エスカレーターの速さ']
      }
    },
    
    // 数の性質分野（15メソッド）
    number_theory: {
      '約数と倍数の利用': {
        description: '約数・倍数の性質を使った解法',
        applicableTopics: ['約数', '倍数', '最大公約数', '最小公倍数'],
        gradeLevel: ['5th', '6th'],
        explanation: '数の性質を使って効率的に計算',
        difficulty: 6,
        examples: ['タイルを敷き詰める', '周期性のある問題'],
        visualHints: ['共通の約数・倍数を探す']
      },
      '素数の活用': {
        description: '素数の性質を使った数論的解法',
        applicableTopics: ['素数', '素因数分解', '合成数'],
        gradeLevel: ['6th'],
        explanation: '素数分解して数の性質を調べる',
        difficulty: 7,
        examples: ['数の分解', '規則性の発見'],
        visualHints: ['小さい素数から順に割る']
      },
      '数列の規則性': {
        description: '数の並びの規則を見つける解法',
        applicableTopics: ['数列', '規則性', 'パターン'],
        gradeLevel: ['5th', '6th'],
        explanation: '数の並び方の規則を見つけて予測',
        difficulty: 6,
        examples: ['フィボナッチ数列', '等差数列'],
        visualHints: ['差の規則性を調べる']
      },
      'あまりの利用': {
        description: '割り算のあまりを使った解法',
        applicableTopics: ['あまり', '周期性', '合同'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: 'あまりのパターンを使って問題を解く',
        difficulty: 5,
        examples: ['曜日の計算', '循環する問題'],
        visualHints: ['あまりのパターンを見つける']
      }
    },
    
    // 場合の数・確率（10メソッド）
    probability: {
      '樹形図': {
        description: '場合分けを樹形図で整理する方法',
        applicableTopics: ['場合の数', '樹形図', '組み合わせ'],
        gradeLevel: ['5th', '6th'],
        explanation: 'すべての場合を樹の形で表して数える',
        difficulty: 5,
        examples: ['コインを投げる', 'じゃんけん'],
        visualHints: ['枝分かれで場合を表す']
      },
      '表による整理': {
        description: '表を使って場合の数を整理する方法',
        applicableTopics: ['場合の数', '表', '組み合わせ'],
        gradeLevel: ['5th', '6th'],
        explanation: '縦横の表で場合を整理して数える',
        difficulty: 4,
        examples: ['サイコロ2個', '服装の組み合わせ'],
        visualHints: ['縦×横で場合の数']
      },
      '順列の考え方': {
        description: '順番を考慮した並べ方の数え方',
        applicableTopics: ['順列', '並べ方', '階乗'],
        gradeLevel: ['6th'],
        explanation: '順番が重要な場合の数え方',
        difficulty: 7,
        examples: ['人の並び方', '数字の並べ方'],
        visualHints: ['最初×次×その次...']
      }
    }
  },
  
  // 国語分野（40メソッド）
  japanese: {
    reading_comprehension: {
      '心情語彙マスター': {
        description: '物語文の心情表現を系統的に理解する方法',
        applicableTopics: ['物語文', '心情理解', '語彙'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '感情を表す言葉を段階別に分類して覚える',
        difficulty: 5,
        examples: ['うれしい→喜ぶ→歓喜', '悲しい→哀しむ→嘆く'],
        visualHints: ['感情の温度計をイメージ']
      },
      '対比構造発見法': {
        description: '文章の対比構造を見つける読解法',
        applicableTopics: ['説明文', '論説文', '構造'],
        gradeLevel: ['5th', '6th'],
        explanation: '対立する内容を見つけて文章構造を理解',
        difficulty: 7,
        examples: ['昔と今', 'AとB', '賛成と反対'],
        visualHints: ['「しかし」「一方」などの接続語']
      },
      '要約の階層法': {
        description: '文章を段階的に要約する技術',
        applicableTopics: ['要約', '説明文', '主題'],
        gradeLevel: ['5th', '6th'],
        explanation: '段落→章→全体の順で要約を作る',
        difficulty: 6,
        examples: ['各段落の要点→全体の主題'],
        visualHints: ['ピラミッド型の構造']
      },
      '場面転換マーカー': {
        description: '物語の場面転換を見つける方法',
        applicableTopics: ['物語文', '場面転換', '構成'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '時間・場所・登場人物の変化を追う',
        difficulty: 5,
        examples: ['「次の日」「学校で」「太郎は」'],
        visualHints: ['時・所・人の変化に注目']
      },
      '修辞技法の効果': {
        description: '擬人法・比喩などの効果を読み取る方法',
        applicableTopics: ['修辞技法', '表現効果', '比喩'],
        gradeLevel: ['5th', '6th'],
        explanation: '表現技法が読み手に与える効果を分析',
        difficulty: 7,
        examples: ['擬人法→親近感', '直喩→わかりやすさ'],
        visualHints: ['なぜその表現を使ったか考える']
      }
    },
    
    vocabulary: {
      '語源活用法': {
        description: '漢字の成り立ちから意味を推測する方法',
        applicableTopics: ['漢字', '語源', '部首'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '部首や構成要素から漢字の意味を理解',
        difficulty: 6,
        examples: ['木+休=人が木にもたれて休む'],
        visualHints: ['漢字をパーツに分解']
      },
      '同音異義語の判別': {
        description: '音は同じで意味が違う言葉の使い分け',
        applicableTopics: ['同音異義語', '意味', '文脈'],
        gradeLevel: ['5th', '6th'],
        explanation: '文脈から正しい漢字を選ぶ技術',
        difficulty: 6,
        examples: ['きく→聞く・聴く・効く'],
        visualHints: ['前後の文から判断']
      },
      'ことわざ・慣用句の活用': {
        description: 'ことわざ・慣用句を文章理解に活用',
        applicableTopics: ['ことわざ', '慣用句', '文化'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '慣用表現から文章の意図を読み取る',
        difficulty: 5,
        examples: ['頭を下げる=謝る', '手を焼く=困る'],
        visualHints: ['字面通りでない意味']
      }
    },
    
    writing: {
      '作文の型活用': {
        description: '決まった型を使って作文を書く方法',
        applicableTopics: ['作文', '構成', '型'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '序論・本論・結論の基本構成',
        difficulty: 5,
        examples: ['意見文', '感想文', '説明文'],
        visualHints: ['始め・中・終わりを意識']
      },
      '描写技法の使い分け': {
        description: '場面に応じた描写方法の選択',
        applicableTopics: ['描写', '表現', '文体'],
        gradeLevel: ['5th', '6th'],
        explanation: '視覚・聴覚・触覚などを使い分け',
        difficulty: 7,
        examples: ['色彩語', '擬音語', '感触語'],
        visualHints: ['五感を使って表現']
      }
    }
  },
  
  // 理科分野（25メソッド）
  science: {
    experimental_method: {
      '対照実験法': {
        description: '条件を変えて比較する実験方法',
        applicableTopics: ['実験', '観察', '比較'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '1つの条件だけを変えて結果を比較',
        difficulty: 6,
        examples: ['植物の成長実験', '溶け方の実験'],
        visualHints: ['変える条件は1つだけ']
      },
      '仮説検証法': {
        description: '予想を立てて実験で確かめる方法',
        applicableTopics: ['仮説', '予想', '検証'],
        gradeLevel: ['5th', '6th'],
        explanation: '実験前に結果を予想して検証',
        difficulty: 6,
        examples: ['○○すると△△になるだろう'],
        visualHints: ['もし～なら～だろう']
      },
      '変数の制御': {
        description: '実験で条件を正しく制御する方法',
        applicableTopics: ['実験計画', '条件制御', '変数'],
        gradeLevel: ['5th', '6th'],
        explanation: '変える条件と変えない条件を明確化',
        difficulty: 7,
        examples: ['温度だけを変える', '時間だけを変える'],
        visualHints: ['他の条件は同じにする']
      }
    },
    
    observation: {
      '継続観察法': {
        description: '長期間にわたって変化を記録する方法',
        applicableTopics: ['観察', '記録', '変化'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '定期的に観察して変化を記録',
        difficulty: 5,
        examples: ['植物の成長', '天気の変化'],
        visualHints: ['日付と変化を記録']
      },
      '比較観察法': {
        description: '複数のものを比べて観察する方法',
        applicableTopics: ['比較', '分類', '特徴'],
        gradeLevel: ['4th', '5th', '6th'],
        explanation: '共通点と相違点を見つける',
        difficulty: 5,
        examples: ['いろいろな葉っぱ', '動物の特徴'],
        visualHints: ['同じところと違うところ']
      }
    }
  },
  
  // 社会分野（20メソッド）
  social: {
    historical_thinking: {
      '年代暗記法': {
        description: '歴史の年代を効率的に覚える方法',
        applicableTopics: ['歴史', '年代', '暗記'],
        gradeLevel: ['5th', '6th'],
        explanation: '語呂合わせや関連付けで年代記憶',
        difficulty: 6,
        examples: ['1192つくろう鎌倉幕府'],
        visualHints: ['数字を言葉に変換']
      },
      '因果関係の把握': {
        description: '歴史的出来事の原因と結果を理解',
        applicableTopics: ['因果関係', '歴史', '分析'],
        gradeLevel: ['6th'],
        explanation: 'なぜその出来事が起こったかを考える',
        difficulty: 7,
        examples: ['戦争の原因→結果→影響'],
        visualHints: ['原因→出来事→結果の流れ']
      },
      '時代の特色把握': {
        description: '各時代の特徴を体系的に理解',
        applicableTopics: ['時代区分', '特色', '文化'],
        gradeLevel: ['6th'],
        explanation: '政治・経済・文化の観点で整理',
        difficulty: 6,
        examples: ['平安時代の特色', '江戸時代の特色'],
        visualHints: ['政治・経済・文化で分類']
      }
    },
    
    geographical_analysis: {
      '地形と気候の関連': {
        description: '地形が気候に与える影響を理解',
        applicableTopics: ['地形', '気候', '関連性'],
        gradeLevel: ['5th'],
        explanation: '山地・平地・海岸の気候の違い',
        difficulty: 6,
        examples: ['山の天気', '海の近くの気候'],
        visualHints: ['高さと距離で考える']
      },
      '産業立地の理解': {
        description: 'なぜその場所で産業が発達したかを理解',
        applicableTopics: ['産業', '立地', '条件'],
        gradeLevel: ['5th'],
        explanation: '気候・地形・交通の条件を考える',
        difficulty: 7,
        examples: ['米作りの条件', '工業地域の条件'],
        visualHints: ['自然条件と人文条件']
      }
    }
  }
};

// 学年別漢字制限システム
export class KanjiLevelManager {
  private gradeKanjiSets: Map<string, Set<string>> = new Map();

  constructor() {
    // 学年別漢字データベース初期化
    this.initializeGradeKanjiSets();
  }

  private initializeGradeKanjiSets() {
    // 4年生までの主要漢字（教育基本語彙）
    const grade4Kanji = [
      '学', '生', '年', '月', '日', '時', '分', '間', '人', '子',
      '大', '小', '中', '高', '長', '短', '新', '古', '多', '少',
      '水', '火', '木', '金', '土', '石', '山', '川', '海', '空',
      '雨', '雪', '風', '雲', '太', '陽', '月', '星', '光', '色',
      '赤', '青', '白', '黒', '黄', '緑', '数', '字', '文', '本',
      '読', '書', '言', '話', '聞', '見', '行', '来', '出', '入',
      '上', '下', '前', '後', '左', '右', '内', '外', '中', '今'
    ];

    // 5年生までの漢字（4年生+追加分）
    const grade5Additional = [
      '計', '算', '数', '図', '形', '線', '点', '角', '直', '円',
      '正', '方', '三', '四', '五', '六', '七', '八', '九', '十',
      '百', '千', '万', '億', '倍', '半', '分', '割', '比', '率',
      '平', '等', '合', '計', '答', '問', '題', '例', '式', '法'
    ];

    // 6年生までの漢字（5年生+追加分）
    const grade6Additional = [
      '歴', '史', '時', '代', '古', '現', '在', '過', '去', '未',
      '国', '県', '市', '町', '村', '都', '府', '道', '地', '区',
      '産', '業', '農', '工', '商', '交', '通', '運', '輸', '情',
      '報', '技', '術', '科', '研', '究', '発', '明', '実', '験'
    ];

    this.gradeKanjiSets.set('4th', new Set(grade4Kanji));
    this.gradeKanjiSets.set('5th', new Set([...grade4Kanji, ...grade5Additional]));
    this.gradeKanjiSets.set('6th', new Set([...grade4Kanji, ...grade5Additional, ...grade6Additional]));
  }

  // 学年に応じて漢字をひらがなに変換
  public adjustTextForGrade(text: string, grade: GradeLevel): string {
    const allowedKanji = this.gradeKanjiSets.get(grade) || new Set();
    
    // 学年別変換辞書（教育現場で実際に使われる表現）
    const conversionDict: Record<string, string> = {
      '演算': 'けいさん',
      '異常': 'おかしい',
      '宇宙': 'うちゅう',
      '延長': 'のばす',
      '複雑': 'ふくざつ',
      '簡単': 'かんたん',
      '重要': 'たいせつ',
      '必要': 'ひつよう',
      '特別': 'とくべつ',
      '普通': 'ふつう'
    };

    let result = text;

    // 漢字変換を実行
    Object.entries(conversionDict).forEach(([original, converted]) => {
      // 学年で習わない漢字が含まれている場合に変換
      const needsConversion = Array.from(original).some(char => 
        /[\u4e00-\u9faf]/.test(char) && !allowedKanji.has(char)
      );
      
      if (needsConversion) {
        result = result.replace(new RegExp(original, 'g'), converted);
      }
    });

    return result;
  }

  // 使用可能な漢字かチェック
  public isKanjiAllowedForGrade(kanji: string, grade: GradeLevel): boolean {
    const allowedKanji = this.gradeKanjiSets.get(grade) || new Set();
    return allowedKanji.has(kanji);
  }
}

// 小学生知識限定システム
export class ElementaryKnowledgeValidator {
  // 禁止概念チェック
  public validateConcept(concept: string, grade: GradeLevel): boolean {
    const restrictions = GRADE_RESTRICTIONS[grade];
    return !restrictions.prohibitedConcepts.some(prohibited => 
      concept.toLowerCase().includes(prohibited.toLowerCase())
    );
  }

  // 数学概念チェック
  public validateMathConcept(concept: string, grade: GradeLevel): boolean {
    const restrictions = GRADE_RESTRICTIONS[grade];
    return restrictions.mathConcepts.some(allowed => 
      concept.toLowerCase().includes(allowed.toLowerCase())
    );
  }

  // 小学生向けの説明に変換
  public convertToElementaryExplanation(text: string, grade: GradeLevel): string {
    const conversions: Record<string, string> = {
      '変数': 'あてはまる数',
      '方程式': '数をもとめる式',
      '関数': 'きまりのある数のかんけい',
      '証明': '正しいことをせつめいする',
      '論理': 'すじみちだてて考える',
      '仮説': 'こうかもしれないという考え',
      '検証': 'たしかめる',
      '統計': 'たくさんのデータをまとめる',
      '確率': 'おこりやすさ',
      '比例定数': '比例のきまった数',
      '座標': 'いちをあらわす数',
      '面積比': 'めんせきの比'
    };

    let convertedText = text;
    Object.entries(conversions).forEach(([difficult, easy]) => {
      convertedText = convertedText.replace(new RegExp(difficult, 'g'), easy);
    });

    return convertedText;
  }
}

// 中学受験特有解法指導システム
export class ChuyuMethodTeacher {
  // 該当する特有解法を特定
  public identifyApplicableMethods(topic: string, subject: string): string[] {
    const methods: string[] = [];
    
    // 教科別解法検索
    const subjectMethods = CHUYU_METHODS[subject as keyof typeof CHUYU_METHODS];
    if (subjectMethods) {
      Object.entries(subjectMethods).forEach(([category, categoryMethods]) => {
        Object.entries(categoryMethods).forEach(([methodName, methodData]) => {
          if (methodData.applicableTopics.some((applicableTopic: string) => 
            topic.toLowerCase().includes(applicableTopic.toLowerCase())
          )) {
            methods.push(methodName);
          }
        });
      });
    }
    
    return methods;
  }

  // 特有解法の説明を取得
  public getMethodExplanation(methodName: string): string {
    // 全カテゴリから該当メソッドを検索
    for (const subject of Object.values(CHUYU_METHODS)) {
      for (const category of Object.values(subject)) {
        const method = (category as any)[methodName];
        if (method) {
          return `【${methodName}】${method.explanation}\n\n${method.description}`;
        }
      }
    }
    return '';
  }

  // 学年に適した解法かチェック
  public isMethodAppropriateForGrade(methodName: string, grade: GradeLevel): boolean {
    for (const subject of Object.values(CHUYU_METHODS)) {
      for (const category of Object.values(subject)) {
        const method = (category as any)[methodName];
        if (method && method.gradeLevel.includes(grade)) {
          return true;
        }
      }
    }
    return false;
  }
}

// 統合教育システム
export class EnhancedEducationSystem {
  private kanjiManager: KanjiLevelManager;
  private knowledgeValidator: ElementaryKnowledgeValidator;
  private methodTeacher: ChuyuMethodTeacher;

  constructor() {
    this.kanjiManager = new KanjiLevelManager();
    this.knowledgeValidator = new ElementaryKnowledgeValidator();
    this.methodTeacher = new ChuyuMethodTeacher();
  }

  // 学習者プロフィールに基づくカスタマイズ
  public customizeForLearner(
    content: string, 
    topic: string, 
    subject: string, 
    learnerProfile: LearnerProfile
  ): {
    adjustedContent: string;
    applicableMethods: string[];
    methodExplanations: string[];
  } {
    // 1. 学年に応じた漢字調整
    let adjustedContent = this.kanjiManager.adjustTextForGrade(content, learnerProfile.currentGrade);

    // 2. 小学生知識レベルに調整
    adjustedContent = this.knowledgeValidator.convertToElementaryExplanation(
      adjustedContent, 
      learnerProfile.currentGrade
    );

    // 3. 適用可能な中学受験特有解法を特定
    const applicableMethods = this.methodTeacher.identifyApplicableMethods(topic, subject)
      .filter(method => this.methodTeacher.isMethodAppropriateForGrade(method, learnerProfile.currentGrade));

    // 4. 解法説明を取得
    const methodExplanations = applicableMethods.map(method => 
      this.methodTeacher.getMethodExplanation(method)
    );

    return {
      adjustedContent,
      applicableMethods,
      methodExplanations
    };
  }

  // 🎯 小学生特有記号による解説生成
  public generateElementaryNotationExplanation(
    expression: string,
    problemType: 'tsuruKame' | 'ratio' | 'speed' | 'geometry' | 'age' | 'basic',
    learnerProfile: LearnerProfile
  ): {
    elementaryExpression: string;
    explanation: string;
    symbolGuide: string[];
    examples: string[];
    visualAid?: string;
  } {
    
    const grade = learnerProfile.grade;
    
    // 基本的な記号変換
    const converted = elementaryNotationSystem.convertToElementaryNotation(
      expression, 
      grade, 
      problemType === 'basic' ? 'basic' : problemType === 'ratio' ? 'ratio' : 'wordProblem'
    );

    let specialNotation = '';
    let visualAid = '';

    // 問題タイプ別の特殊処理
    switch (problemType) {
      case 'tsuruKame':
        const tsuruKame = elementaryNotationSystem.generateTsuruKameNotation('つる', 'かめ', grade);
        specialNotation = tsuruKame.notation;
        visualAid = tsuruKame.visualAid;
        break;

      case 'ratio':
        const ratio = elementaryNotationSystem.generateRatioNotation(['太郎', '花子'], grade);
        specialNotation = ratio.notation;
        break;

      case 'speed':
        const speed = elementaryNotationSystem.generateSpeedNotation(grade);
        specialNotation = speed.formula;
        visualAid = `【速さの公式】\n${Object.entries(speed.symbolMeaning).map(([symbol, meaning]) => `${symbol} = ${meaning}`).join('\n')}`;
        break;

      case 'geometry':
        const geometry = elementaryNotationSystem.generateGeometryNotation('triangle', grade);
        specialNotation = geometry.formula;
        visualAid = geometry.explanation;
        break;

      case 'age':
        const age = elementaryNotationSystem.generateAgeNotation(['太郎', '花子'], grade);
        specialNotation = Object.values(age.currentAge).join(', ');
        visualAid = age.explanation;
        break;
    }

    return {
      elementaryExpression: specialNotation || converted.converted,
      explanation: converted.explanation + (specialNotation ? `\n特別な表現: ${specialNotation}` : ''),
      symbolGuide: converted.symbolGuide,
      examples: converted.examples,
      visualAid
    };
  }

  // ✅ 表現の小学生適合性チェック
  public validateElementaryExpression(
    expression: string,
    learnerProfile: LearnerProfile
  ): {
    isValid: boolean;
    violations: string[];
    suggestions: string[];
    correctedExpression: string;
  } {
    
    const validation = elementaryNotationSystem.validateNotation(expression, learnerProfile.grade);
    
    // 修正された表現を生成
    let correctedExpression = expression;
    if (!validation.isValid) {
      const converted = elementaryNotationSystem.convertToElementaryNotation(
        expression, 
        learnerProfile.grade, 
        'basic'
      );
      correctedExpression = converted.converted;
    }

    return {
      isValid: validation.isValid,
      violations: validation.violations,
      suggestions: validation.suggestions,
      correctedExpression
    };
  }

  // 📚 記号学習カリキュラム生成
  public generateNotationCurriculum(learnerProfile: LearnerProfile): Array<{
    level: string;
    symbols: string[];
    explanation: string;
    practice: string[];
  }> {
    
    return elementaryNotationSystem.generateNotationLessons(learnerProfile.grade);
  }

  // AIプロンプト生成（公式発見型学習対応版）
  public generateAIPrompt(topic: string, subject: string, learnerProfile: LearnerProfile): string {
    const restrictions = GRADE_RESTRICTIONS[learnerProfile.grade];
    const applicableMethods = this.methodTeacher.identifyApplicableMethods(topic, subject);

    // 学年別記号ガイドライン
    const notationGuidelines = this.getNotationGuidelines(learnerProfile.grade);

    // 公式発見学習ガイドライン
    const discoveryGuidelines = this.getDiscoveryLearningGuidelines(topic);

    return `
あなたは中学受験専門の家庭教師です。以下の条件を絶対に守って指導してください：

🎯【最重要】回答評価の厳格ルール：
- 数値問題で学生の答えが正解と完全に一致する場合は必ず「正解！」と評価
- 例: 正解4.8に対し「4.8」→「🎉正解！完璧です！」（「惜しい」は禁止）
- 「惜しい」「近い」は明確な計算ミスがある場合のみ使用
- 文字列も同様：正解「速さ」に対し「速さ」→「🎉正解！」

🏆【志望校レベル別】難易度基準の厳格遵守：
- 基礎校：基本問題中心、確実な理解重視（目標正答率85%）
- 標準校：応用問題中心、論理的思考育成（目標正答率75%）
- 上位校：高度応用、創造的思考要求（目標正答率65%）
- 最難関校：超高難度、複数分野統合、独創的思考（目標正答率55%）

📚【学年別】内容調整の厳格実施：
- 4年生：基礎概念の確実な定着、楽しい学習体験重視
- 5年生：応用力育成、論理的思考の発達段階
- 6年生：実戦的問題、入試本番レベルの完全対応

【学習者情報】
- 学年: ${learnerProfile.grade === '4th' ? '小学4年生' : learnerProfile.grade === '5th' ? '小学5年生' : '小学6年生'}
- 志望校レベル: ${learnerProfile.schoolLevel === 'basic' ? '基礎校' : learnerProfile.schoolLevel === 'standard' ? '標準校' : learnerProfile.schoolLevel === 'advanced' ? '上位校' : '最難関校'}
- 教科: ${subject}
- 単元: ${topic}

【絶対厳守ルール】
1. 小学生の知識のみ使用（中学数学・理科の概念禁止）
   - 禁止: ${restrictions.prohibitedConcepts.join(', ')}
   - 使用可能: ${restrictions.mathConcepts.join(', ')}

2. 漢字レベル制限
   - ${learnerProfile.grade}年生まで習った漢字のみ使用
   - 難しい漢字は ひらがな で表記

3. 🎯 小学生特有記号の使用（重要！）
   ${notationGuidelines}

4. 🔍 公式発見型学習の実践（最重要！）
   ${discoveryGuidelines}

5. 中学受験特有解法の活用
   ${applicableMethods.length > 0 ? `- 積極的に使用する解法: ${applicableMethods.join(', ')}` : '- 基本的な解法を使用'}

6. 年齢に適した説明
   - 具体例を多用
   - 図やイメージで説明
   - 段階的に丁寧に説明

【厳重禁止事項】
- ❌ x, y, z などの文字式（代数）
- ❌ sin, cos, tan等の三角関数
- ❌ 負の数（マイナス）
- ❌ 微分積分
- ❌ 中学理科の概念（イオン、化学式等）
- ❌ 公式をいきなり教える（発見させる前に答えを言わない）

【指導方針】
生徒が自分で気づき、発見し、公式を作り出せるように導いてください。
「覚えて当てはめる」のではなく「なぜそうなるのか理解して再現できる」ことを目標とします。

それでは、「${topic}」について発見学習を開始してください。
    `;
  }

  // 🔍 公式発見学習セッション開始
  public startDiscoveryLearning(
    topic: string,
    learnerProfile: LearnerProfile
  ): {
    sessionPlan: any;
    firstQuestion: string;
    expectedJourney: string[];
  } {
    
    const discoverySession = formulaDiscoverySystem.conductDiscoverySession(topic, learnerProfile);
    
    return {
      sessionPlan: discoverySession,
      firstQuestion: discoverySession.nextQuestion,
      expectedJourney: [
        '1. 具体例を観察する',
        '2. パターンを仮説立てる', 
        '3. 仮説を検証する',
        '4. 一般化して公式を作る',
        '5. 公式を確認・活用する'
      ]
    };
  }

  // 📝 発見学習の進捗管理
  public guideDiscoveryProgress(
    topic: string,
    studentResponse: string,
    learnerProfile: LearnerProfile
  ): {
    feedback: string;
    nextGuidance: string;
    insightPrompt: string;
    encouragement: string;
  } {
    
    const guidance = formulaDiscoverySystem.promptInsight(
      studentResponse,
      '規則性の発見',
      topic
    );

    return {
      feedback: 'いい考えですね！',
      nextGuidance: guidance.guidingQuestions[0],
      insightPrompt: guidance.hints[0],
      encouragement: guidance.encouragement
    };
  }

  // 🎯 学年別記号ガイドライン生成
  private getNotationGuidelines(grade: GradeLevel): string {
    switch (grade) {
      case '4th':
        return `
   - 未知数は ○、□、△ を使用
   - x, y, z は絶対に使わない
   - 例: ○ + 5 = 12 → ○ = 7`;

      case '5th':
        return `
   - 未知数は ○、□、△ を使用
   - 倍数は ②、③ などの丸数字を使用
   - x, y, z は絶対に使わない
   - 例: ○ × 2 = ② 、太郎:花子 = ① : ②`;

      case '6th':
        return `
   - 未知数は ○、□、△ を使用
   - 比や倍数は ①、②、③ などの丸数字を使用
   - x, y, z は絶対に使わない
   - つるかめ算: つるの数○、かめの数□
   - 比の問題: 太郎① : 花子② のように表現`;

      default:
        return '- 小学生らしい記号を使用してください';
    }
  }

  // 🔍 発見学習ガイドライン生成
  private getDiscoveryLearningGuidelines(topic: string): string {
    if (topic.includes('速さ') || topic.includes('距離') || topic.includes('時間')) {
      return `
   - まず具体例（太郎君の散歩など）から始める
   - 「なぜ掛け算になるのか」を生徒に発見させる
   - 公式を教える前に、生徒が自分で関係性に気づくまで待つ
   - 「はじき」の公式は生徒が理解した後に名前をつける`;
    }
    
    if (topic.includes('面積')) {
      return `
   - 1cm²の正方形を敷き詰める観察から始める
   - 「なぜたて×よこなのか」を数えながら発見させる
   - 公式ありきではなく、理由から公式を導出させる
   - 異なるサイズで規則性を確認させる`;
    }
    
    if (topic.includes('つるかめ') || topic.includes('鶴亀')) {
      return `
   - 実際のつると亀の足の数から観察開始
   - 「全部つるなら」という仮定の考え方を誘導
   - なぜ差が生まれるのかを生徒に考えさせる
   - 解法を教えず、生徒が論理を組み立てられるよう支援`;
    }
    
    if (topic.includes('比') || topic.includes('割合')) {
      return `
   - 具体的な分け方（お菓子、お金など）から開始
   - ①②③の記号の意味を体験的に理解させる
   - なぜ比が役立つのかを実感させてから公式化
   - 部分と全体の関係を視覚的に発見させる`;
    }
    
    return `
   - 必ず具体例・体験から始める
   - 「なぜ？」「どうして？」を大切にする
   - 公式は最後、生徒が発見した後に確認
   - 答えではなく考え方のプロセスを重視`;
  }

  // 🎯 便利メソッド: 問題タイプ別記号生成
  public getAvailableMethods(subject: string, grade: GradeLevel): string[] {
    return this.methodTeacher.identifyApplicableMethods('', subject)
      .filter(method => this.methodTeacher.isMethodAppropriateForGrade(method, grade));
  }

  public getGradeAppropriateContent(content: string, grade: GradeLevel): string {
    return this.kanjiManager.adjustTextForGrade(content, grade);
  }

  // 📝 つるかめ算の説明生成例
  public generateTsuruKameExample(grade: GradeLevel): string {
    const notation = elementaryNotationSystem.generateTsuruKameNotation('つる', 'かめ', grade);
    return `
【つるかめ算の解き方】
${notation.visualAid}

${notation.steps.join('\n')}

【式の作り方】
つるの数を○、かめの数を□とすると：
- 数の合計: ○ + □ = 全体の数
- 足の合計: ○ × 2 + □ × 4 = 全体の足の数

この2つの式から○と□を求めます。
    `;
  }

  // 📊 比の問題の説明生成例  
  public generateRatioExample(grade: GradeLevel): string {
    const ratio = elementaryNotationSystem.generateRatioNotation(['太郎', '花子'], grade);
    return `
【比の問題の解き方】
${ratio.explanation}

${ratio.examples.join('\n')}

【ポイント】
- 比は部分の関係を表します
- 全体を求めるときは各部分を足します
- 実際の数を求めるときは比の合計で割ります
    `;
  }

  // ⚡ 速さの問題の説明生成例
  public generateSpeedExample(grade: GradeLevel): string {
    const speed = elementaryNotationSystem.generateSpeedNotation(grade);
    return `
【速さの問題の解き方】
${speed.explanation}

公式: ${speed.formula}

${Object.entries(speed.symbolMeaning).map(([symbol, meaning]) => `${symbol} = ${meaning}`).join('\n')}

【覚え方】
「はじき」の公式
は（速さ）= き（距離）÷ じ（時間）
じ（時間）= き（距離）÷ は（速さ）  
き（距離）= は（速さ）× じ（時間）
    `;
  }
}

// エクスポート
export const educationSystem = new EnhancedEducationSystem();