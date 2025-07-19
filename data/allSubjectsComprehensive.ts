// 中学受験対応 全教科統合カリキュラム
// 算数72単元 + 国語62単元 + 理科68単元 + 社会75単元 = 合計277単元

import { ExtendedSubject } from './comprehensiveCurriculum';
import { COMPREHENSIVE_MATH } from './comprehensiveCurriculum';
import { COMPREHENSIVE_JAPANESE } from './japaneseComprehensiveCurriculum';
import { COMPREHENSIVE_SCIENCE } from './scienceComprehensiveCurriculum';
import { COMPREHENSIVE_SOCIAL_STUDIES } from './socialStudiesComprehensiveCurriculum';

// 全教科統合データ
export const ALL_COMPREHENSIVE_SUBJECTS: ExtendedSubject[] = [
  COMPREHENSIVE_MATH,
  COMPREHENSIVE_JAPANESE,
  COMPREHENSIVE_SCIENCE,
  COMPREHENSIVE_SOCIAL_STUDIES
];

// カリキュラム統計
export const CURRICULUM_STATS = {
  totalSubjects: 4,
  totalTopics: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => sum + subject.topics.length, 0),
  totalHours: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => sum + subject.totalHours, 0),
  
  bySubject: {
    math: {
      topics: COMPREHENSIVE_MATH.topics.length,
      hours: COMPREHENSIVE_MATH.totalHours,
      gradeDistribution: COMPREHENSIVE_MATH.gradeDistribution
    },
    japanese: {
      topics: COMPREHENSIVE_JAPANESE.topics.length,
      hours: COMPREHENSIVE_JAPANESE.totalHours,
      gradeDistribution: COMPREHENSIVE_JAPANESE.gradeDistribution
    },
    science: {
      topics: COMPREHENSIVE_SCIENCE.topics.length,
      hours: COMPREHENSIVE_SCIENCE.totalHours,
      gradeDistribution: COMPREHENSIVE_SCIENCE.gradeDistribution
    },
    socialStudies: {
      topics: COMPREHENSIVE_SOCIAL_STUDIES.topics.length,
      hours: COMPREHENSIVE_SOCIAL_STUDIES.totalHours,
      gradeDistribution: COMPREHENSIVE_SOCIAL_STUDIES.gradeDistribution
    }
  },
  
  byGrade: {
    '4th': ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => sum + subject.gradeDistribution['4th'], 0),
    '5th': ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => sum + subject.gradeDistribution['5th'], 0),
    '6th': ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => sum + subject.gradeDistribution['6th'], 0)
  },
  
  byDifficulty: {
    basic: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.difficulty <= 3).length, 0),
    intermediate: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.difficulty >= 4 && t.difficulty <= 6).length, 0),
    advanced: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.difficulty >= 7 && t.difficulty <= 8).length, 0),
    expert: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.difficulty >= 9).length, 0)
  },
  
  byImportance: {
    essential: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.importance === 'essential').length, 0),
    important: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.importance === 'important').length, 0),
    useful: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.importance === 'useful').length, 0)
  },
  
  byExamFrequency: {
    veryHigh: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.examFrequency === 'very_high').length, 0),
    high: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.examFrequency === 'high').length, 0),
    medium: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.examFrequency === 'medium').length, 0),
    low: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.examFrequency === 'low').length, 0)
  },
  
  bySchoolType: {
    basic: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.schoolTypes.includes('basic')).length, 0),
    standard: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.schoolTypes.includes('standard')).length, 0),
    advanced: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.schoolTypes.includes('advanced')).length, 0),
    top: ALL_COMPREHENSIVE_SUBJECTS.reduce((sum, subject) => 
      sum + subject.topics.filter(t => t.schoolTypes.includes('top')).length, 0)
  }
};

// 学習計画生成用のユーティリティ関数
export class CurriculumAnalyzer {
  // 特定の学年・難易度・学校レベルに応じたトピック抽出
  static getTopicsForProfile(
    grade: '4th' | '5th' | '6th',
    schoolLevel: 'basic' | 'standard' | 'advanced' | 'top',
    maxDifficulty?: number
  ) {
    return ALL_COMPREHENSIVE_SUBJECTS.flatMap(subject =>
      subject.topics.filter(topic =>
        topic.grade.includes(grade) &&
        topic.schoolTypes.includes(schoolLevel) &&
        (!maxDifficulty || topic.difficulty <= maxDifficulty)
      ).map(topic => ({
        ...topic,
        subjectId: subject.id,
        subjectName: subject.name
      }))
    );
  }
  
  // 前提条件チェーン解析
  static getPrerequisiteChain(topicId: string): string[] {
    const allTopics = ALL_COMPREHENSIVE_SUBJECTS.flatMap(s => s.topics);
    const topic = allTopics.find(t => t.id === topicId);
    
    if (!topic || topic.prerequisites.length === 0) {
      return [];
    }
    
    const chain: string[] = [];
    const visited = new Set<string>();
    
    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const t = allTopics.find(t => t.id === id);
      if (t) {
        t.prerequisites.forEach(prereq => {
          traverse(prereq);
          if (!chain.includes(prereq)) {
            chain.push(prereq);
          }
        });
      }
    };
    
    topic.prerequisites.forEach(prereq => traverse(prereq));
    return chain;
  }
  
  // 学習時間見積もり
  static estimateStudyTime(
    topicIds: string[],
    studentLevel: 'slow' | 'average' | 'fast' = 'average'
  ): number {
    const multipliers = {
      slow: 1.5,
      average: 1.0,
      fast: 0.7
    };
    
    const allTopics = ALL_COMPREHENSIVE_SUBJECTS.flatMap(s => s.topics);
    const totalHours = topicIds.reduce((sum, id) => {
      const topic = allTopics.find(t => t.id === id);
      return sum + (topic?.estimatedHours || 0);
    }, 0);
    
    return Math.ceil(totalHours * multipliers[studentLevel]);
  }
  
  // 難易度分布分析
  static getDifficultyDistribution(topicIds: string[]) {
    const allTopics = ALL_COMPREHENSIVE_SUBJECTS.flatMap(s => s.topics);
    const selectedTopics = topicIds.map(id => allTopics.find(t => t.id === id)).filter(Boolean);
    
    const distribution: { [key: number]: number } = {};
    selectedTopics.forEach(topic => {
      if (topic) {
        distribution[topic.difficulty] = (distribution[topic.difficulty] || 0) + 1;
      }
    });
    
    return distribution;
  }
  
  // おすすめ学習順序生成
  static generateStudyOrder(
    topicIds: string[],
    prioritizePrerequisites: boolean = true
  ): string[] {
    const allTopics = ALL_COMPREHENSIVE_SUBJECTS.flatMap(s => s.topics);
    const selectedTopics = topicIds.map(id => allTopics.find(t => t.id === id)).filter(Boolean);
    
    if (!prioritizePrerequisites) {
      // 難易度順でソート
      return selectedTopics
        .sort((a, b) => a!.difficulty - b!.difficulty)
        .map(t => t!.id);
    }
    
    // 前提条件を考慮したトポロジカルソート
    const ordered: string[] = [];
    const remaining = new Set(topicIds);
    const inProgress = new Set<string>();
    
    const canStudy = (topicId: string): boolean => {
      const topic = allTopics.find(t => t.id === topicId);
      if (!topic) return false;
      
      return topic.prerequisites.every(prereq => 
        ordered.includes(prereq) || !remaining.has(prereq)
      );
    };
    
    while (remaining.size > 0) {
      const ready = Array.from(remaining).filter(id => 
        canStudy(id) && !inProgress.has(id)
      );
      
      if (ready.length === 0) {
        // 循環依存がある場合、難易度が最も低いものを選択
        const fallback = Array.from(remaining).reduce((min, id) => {
          const topic = allTopics.find(t => t.id === id);
          const minTopic = allTopics.find(t => t.id === min);
          return (topic && minTopic && topic.difficulty < minTopic.difficulty) ? id : min;
        });
        ready.push(fallback);
      }
      
      // 難易度順で次に学習するトピックを決定
      const next = ready.sort((a, b) => {
        const topicA = allTopics.find(t => t.id === a);
        const topicB = allTopics.find(t => t.id === b);
        return (topicA?.difficulty || 0) - (topicB?.difficulty || 0);
      })[0];
      
      ordered.push(next);
      remaining.delete(next);
    }
    
    return ordered;
  }
  
  // 弱点分析用のトピック関連度計算
  static getRelatedTopics(topicId: string, maxDistance: number = 2): string[] {
    const allTopics = ALL_COMPREHENSIVE_SUBJECTS.flatMap(s => s.topics);
    const topic = allTopics.find(t => t.id === topicId);
    
    if (!topic) return [];
    
    const related = new Set<string>();
    const visited = new Set<string>();
    
    const traverse = (id: string, distance: number) => {
      if (distance > maxDistance || visited.has(id)) return;
      visited.add(id);
      
      const t = allTopics.find(t => t.id === id);
      if (!t) return;
      
      // 前提条件と依存関係から関連トピックを探す
      t.prerequisites.forEach(prereq => {
        related.add(prereq);
        traverse(prereq, distance + 1);
      });
      
      // このトピックを前提とするトピックも探す
      allTopics
        .filter(other => other.prerequisites.includes(id))
        .forEach(other => {
          related.add(other.id);
          traverse(other.id, distance + 1);
        });
      
      // 同じキーワードを含むトピックも関連として追加
      if (distance < maxDistance) {
        allTopics
          .filter(other => 
            other.keywords.some(keyword => 
              t.keywords.includes(keyword) || t.relatedConcepts.includes(keyword)
            )
          )
          .forEach(other => {
            related.add(other.id);
          });
      }
    };
    
    traverse(topicId, 0);
    related.delete(topicId); // 自分自身は除外
    
    return Array.from(related);
  }
}

// 中学受験レベル別推奨カリキュラム
export const EXAM_LEVEL_CURRICULA = {
  // 基礎レベル（偏差値40-50）
  basic: {
    description: '基礎固めを重視した安定的な学習',
    topics: CurriculumAnalyzer.getTopicsForProfile('6th', 'basic', 6)
      .filter(t => t.importance === 'essential')
      .map(t => t.id),
    estimatedHours: 180,
    targetSchools: ['地域の私立中学校', '公立中高一貫校'],
    characteristics: ['基礎の徹底理解', '確実な得点源確保', '苦手分野の克服']
  },
  
  // 標準レベル（偏差値50-60）
  standard: {
    description: '基礎から応用まで幅広くカバー',
    topics: CurriculumAnalyzer.getTopicsForProfile('6th', 'standard', 7)
      .filter(t => ['essential', 'important'].includes(t.importance))
      .map(t => t.id),
    estimatedHours: 250,
    targetSchools: ['中堅私立中学校', '公立中高一貫校', '地域上位校'],
    characteristics: ['基礎力＋応用力', 'バランスの取れた学習', '得意分野の伸長']
  },
  
  // 上位レベル（偏差値60-65）
  advanced: {
    description: '応用力重視の発展的学習',
    topics: CurriculumAnalyzer.getTopicsForProfile('6th', 'advanced', 8)
      .map(t => t.id),
    estimatedHours: 320,
    targetSchools: ['上位私立中学校', '国立大学附属中学校', '難関校'],
    characteristics: ['高度な思考力', '複合問題への対応', '創意工夫する力']
  },
  
  // 最難関レベル（偏差値65+）
  top: {
    description: '最高水準の学力到達を目指す',
    topics: CurriculumAnalyzer.getTopicsForProfile('6th', 'top')
      .map(t => t.id),
    estimatedHours: 400,
    targetSchools: ['最難関私立中学校', '国立大学附属中学校', '超難関校'],
    characteristics: ['最高レベルの思考力', '独創的解法', '学問的探究心']
  }
};

// カリキュラム概要表示用
export const CURRICULUM_OVERVIEW = `
🎓 中学受験対応 完全カリキュラム 🎓

📊 総合統計
• 全4教科、総計${CURRICULUM_STATS.totalTopics}単元
• 総学習時間: 約${CURRICULUM_STATS.totalHours}時間
• 4年生: ${CURRICULUM_STATS.byGrade['4th']}単元
• 5年生: ${CURRICULUM_STATS.byGrade['5th']}単元  
• 6年生: ${CURRICULUM_STATS.byGrade['6th']}単元

📚 教科別構成
• 算数: ${CURRICULUM_STATS.bySubject.math.topics}単元 (${CURRICULUM_STATS.bySubject.math.hours}時間)
• 国語: ${CURRICULUM_STATS.bySubject.japanese.topics}単元 (${CURRICULUM_STATS.bySubject.japanese.hours}時間)
• 理科: ${CURRICULUM_STATS.bySubject.science.topics}単元 (${CURRICULUM_STATS.bySubject.science.hours}時間)
• 社会: ${CURRICULUM_STATS.bySubject.socialStudies.topics}単元 (${CURRICULUM_STATS.bySubject.socialStudies.hours}時間)

📈 難易度分布
• 基礎レベル(1-3): ${CURRICULUM_STATS.byDifficulty.basic}単元
• 中級レベル(4-6): ${CURRICULUM_STATS.byDifficulty.intermediate}単元
• 上級レベル(7-8): ${CURRICULUM_STATS.byDifficulty.advanced}単元
• 最上級レベル(9-10): ${CURRICULUM_STATS.byDifficulty.expert}単元

🎯 重要度分布
• 必須(essential): ${CURRICULUM_STATS.byImportance.essential}単元
• 重要(important): ${CURRICULUM_STATS.byImportance.important}単元
• 有用(useful): ${CURRICULUM_STATS.byImportance.useful}単元

🏫 学校レベル対応
• 基礎校対応: ${CURRICULUM_STATS.bySchoolType.basic}単元
• 標準校対応: ${CURRICULUM_STATS.bySchoolType.standard}単元
• 上位校対応: ${CURRICULUM_STATS.bySchoolType.advanced}単元
• 最難関校対応: ${CURRICULUM_STATS.bySchoolType.top}単元

この包括的カリキュラムにより、どのレベルの中学受験にも対応可能です！
`;

console.log(CURRICULUM_OVERVIEW);