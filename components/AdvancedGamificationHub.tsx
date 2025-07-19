import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton,
  AnimatedProgress,
  HoverScaleCard,
  FloatingActionButton,
  ParticleBackground,
  SmileyRating,
  AchievementToast,
  FireworksEffect
} from './ui/MicroInteractions';

/**
 * 🎮 Advanced Gamification Hub
 * エンゲージメント最大化のための包括的ゲーミフィケーション・システム
 * 自己決定理論・フロー理論・行動経済学を統合した次世代学習体験
 */

interface AdvancedGamificationHubProps {
  userId: string;
  className?: string;
}

interface GamificationProfile {
  playerId: string;
  playerName: string;
  avatar: PlayerAvatar;
  level: number;
  totalXP: number;
  xpToNextLevel: number;
  playerType: PlayerType;
  motivationProfile: MotivationProfile;
  gamificationPreferences: GamificationPreferences;
  progressJourney: ProgressJourney;
  socialConnections: SocialConnection[];
  achievements: Achievement[];
  badges: Badge[];
  streaks: Streak[];
  challenges: Challenge[];
  rewards: Reward[];
  leaderboardPositions: LeaderboardPosition[];
}

interface PlayerAvatar {
  baseAvatar: string;
  customizations: AvatarCustomization[];
  unlockableItems: UnlockableItem[];
  currentOutfit: AvatarOutfit;
  emotionalState: EmotionalState;
}

interface AvatarCustomization {
  category: 'outfit' | 'accessory' | 'background' | 'pose' | 'expression';
  itemId: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  isUnlocked: boolean;
  isEquipped: boolean;
}

interface UnlockableItem {
  itemId: string;
  name: string;
  description: string;
  category: string;
  unlockCondition: UnlockCondition;
  visualPreview: string;
  rarity: string;
  value: number;
}

interface UnlockCondition {
  type: 'xp' | 'achievement' | 'streak' | 'challenge' | 'social' | 'time';
  requirement: any;
  progress: number;
  completed: boolean;
}

interface AvatarOutfit {
  outfit: string;
  accessories: string[];
  background: string;
  pose: string;
  expression: string;
}

interface EmotionalState {
  primary: 'happy' | 'excited' | 'focused' | 'proud' | 'curious' | 'determined';
  intensity: number;
  duration: number;
  triggers: string[];
}

interface PlayerType {
  primary: 'achiever' | 'explorer' | 'socializer' | 'competitor' | 'creator';
  secondary: string[];
  adaptability: number;
  preferences: PlayerPreferences;
}

interface PlayerPreferences {
  competitionLevel: number;
  collaborationLevel: number;
  explorationLevel: number;
  achievementOrientation: number;
  creativityExpression: number;
  socialInteraction: number;
}

interface MotivationProfile {
  intrinsicMotivation: IntrinsicMotivationFactors;
  extrinsicMotivation: ExtrinsicMotivationFactors;
  motivationalTrends: MotivationalTrend[];
  engagementDrivers: EngagementDriver[];
  demotivationTriggers: DemotivationTrigger[];
}

interface IntrinsicMotivationFactors {
  autonomy: number;
  mastery: number;
  purpose: number;
  curiosity: number;
  creativity: number;
  socialConnection: number;
}

interface ExtrinsicMotivationFactors {
  points: number;
  badges: number;
  leaderboards: number;
  rewards: number;
  recognition: number;
  competition: number;
}

interface MotivationalTrend {
  factor: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  timeframe: string;
  change_rate: number;
}

interface EngagementDriver {
  driver: string;
  effectiveness: number;
  context: string[];
  sustainability: number;
}

interface DemotivationTrigger {
  trigger: string;
  impact: number;
  frequency: number;
  mitigation_strategies: string[];
}

interface GamificationPreferences {
  preferredMechanics: GameMechanic[];
  difficulty_preference: number;
  feedback_frequency: 'immediate' | 'periodic' | 'milestone';
  social_visibility: 'public' | 'friends' | 'private';
  challenge_types: string[];
  reward_preferences: string[];
}

interface GameMechanic {
  mechanic: string;
  preference: number;
  effectiveness: number;
  context_suitability: string[];
}

interface ProgressJourney {
  currentQuest: Quest | null;
  completedQuests: Quest[];
  journeyMilestones: JourneyMilestone[];
  pathProgress: PathProgress;
  storyProgression: StoryProgression;
  characterDevelopment: CharacterDevelopment;
}

interface Quest {
  questId: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'weekly' | 'special' | 'social';
  difficulty: number;
  estimatedTime: number;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  prerequisites: string[];
  timeLimit?: Date;
  progress: number;
  status: 'available' | 'active' | 'completed' | 'failed' | 'locked';
  narrative: QuestNarrative;
}

interface QuestObjective {
  objectiveId: string;
  description: string;
  type: 'learn' | 'practice' | 'achieve' | 'explore' | 'create' | 'help';
  target: any;
  progress: number;
  completed: boolean;
  optional: boolean;
}

interface QuestReward {
  type: 'xp' | 'item' | 'badge' | 'access' | 'customization' | 'social';
  value: any;
  rarity: string;
  immediate: boolean;
}

interface QuestNarrative {
  introduction: string;
  progressUpdates: { [milestone: number]: string };
  completion: string;
  characterDialogue: CharacterDialogue[];
}

interface CharacterDialogue {
  character: string;
  dialogue: string;
  emotion: string;
  timing: 'start' | 'progress' | 'completion' | 'failure';
}

interface JourneyMilestone {
  milestoneId: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedAt?: Date;
  requirements: string[];
  significance: 'minor' | 'major' | 'epic';
  celebration: CelebrationData;
}

interface CelebrationData {
  type: 'animation' | 'fireworks' | 'confetti' | 'sound' | 'story';
  intensity: number;
  duration: number;
  specialEffects: string[];
}

interface PathProgress {
  totalNodes: number;
  completedNodes: number;
  currentNode: ProgressNode;
  unlockedPaths: string[];
  discoveries: Discovery[];
}

interface ProgressNode {
  nodeId: string;
  type: 'lesson' | 'skill' | 'challenge' | 'boss' | 'treasure' | 'story';
  position: [number, number];
  unlocked: boolean;
  completed: boolean;
  difficulty: number;
  rewards: string[];
}

interface Discovery {
  discoveryId: string;
  name: string;
  description: string;
  type: 'knowledge' | 'skill' | 'secret' | 'easter_egg' | 'shortcut';
  discoveredAt: Date;
  value: number;
}

interface StoryProgression {
  currentChapter: number;
  totalChapters: number;
  chapterProgress: ChapterProgress[];
  characters: StoryCharacter[];
  plotPoints: PlotPoint[];
  playerChoices: PlayerChoice[];
}

interface ChapterProgress {
  chapterNumber: number;
  title: string;
  completed: boolean;
  scenesCompleted: number;
  totalScenes: number;
  keyEvents: string[];
}

interface StoryCharacter {
  characterId: string;
  name: string;
  role: 'mentor' | 'companion' | 'challenger' | 'guide' | 'ally';
  relationship: number;
  personality: string[];
  backstory: string;
  currentMood: string;
}

interface PlotPoint {
  plotId: string;
  description: string;
  importance: 'minor' | 'major' | 'climax';
  triggered: boolean;
  triggerConditions: string[];
  consequences: string[];
}

interface PlayerChoice {
  choiceId: string;
  situation: string;
  options: ChoiceOption[];
  selectedOption: string;
  consequences: string[];
  madeAt: Date;
}

interface ChoiceOption {
  optionId: string;
  description: string;
  alignment: 'explorer' | 'achiever' | 'helper' | 'competitor';
  consequences: string[];
}

interface CharacterDevelopment {
  abilities: CharacterAbility[];
  skills: CharacterSkill[];
  traits: CharacterTrait[];
  specialPowers: SpecialPower[];
  reputation: Reputation;
}

interface CharacterAbility {
  abilityId: string;
  name: string;
  level: number;
  maxLevel: number;
  experience: number;
  description: string;
  benefits: string[];
  upgradeRequirements: string[];
}

interface CharacterSkill {
  skillId: string;
  name: string;
  proficiency: number;
  category: string;
  practiceTime: number;
  applications: string[];
  mastery_indicators: string[];
}

interface CharacterTrait {
  traitId: string;
  name: string;
  strength: number;
  description: string;
  manifestations: string[];
  development_path: string[];
}

interface SpecialPower {
  powerId: string;
  name: string;
  description: string;
  unlocked: boolean;
  usageCount: number;
  maxUsages: number;
  cooldown: number;
  effects: string[];
}

interface Reputation {
  overall: number;
  categories: { [category: string]: number };
  titles: string[];
  recognitions: Recognition[];
}

interface Recognition {
  type: string;
  source: string;
  description: string;
  earnedAt: Date;
  visibility: string;
}

interface Achievement {
  achievementId: string;
  title: string;
  description: string;
  category: 'learning' | 'social' | 'creative' | 'persistence' | 'discovery' | 'mastery';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  points: number;
  unlockedAt: Date;
  shareStatus: 'private' | 'friends' | 'public';
  prerequisites: string[];
  series?: AchievementSeries;
}

interface AchievementSeries {
  seriesId: string;
  name: string;
  totalAchievements: number;
  completed: number;
  seriesReward: any;
}

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  design: BadgeDesign;
  earnedAt: Date;
  level: number;
  maxLevel: number;
  category: string;
  displayPriority: number;
}

interface BadgeDesign {
  shape: string;
  colors: string[];
  symbols: string[];
  animation: string;
  rarity_effects: string[];
}

interface Streak {
  streakId: string;
  type: 'daily_login' | 'study_session' | 'problem_solving' | 'achievement' | 'social';
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date;
  milestones: StreakMilestone[];
  rewardsTier: number;
  active: boolean;
}

interface StreakMilestone {
  milestone: number;
  reward: string;
  achieved: boolean;
  achievedAt?: Date;
}

interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  type: 'personal' | 'competitive' | 'collaborative' | 'community';
  difficulty: number;
  duration: number;
  participants: string[];
  progress: ChallengeProgress;
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed' | 'expired';
}

interface ChallengeProgress {
  current: number;
  target: number;
  milestones: ChallengeMilestone[];
  ranking?: number;
  teamProgress?: number;
}

interface ChallengeMilestone {
  milestone: number;
  description: string;
  reached: boolean;
  reward: string;
}

interface ChallengeReward {
  tier: number;
  description: string;
  value: any;
  type: string;
}

interface Reward {
  rewardId: string;
  name: string;
  description: string;
  type: 'virtual_item' | 'real_reward' | 'privilege' | 'access' | 'recognition';
  value: number;
  rarity: string;
  earnedAt: Date;
  redeemed: boolean;
  redeemedAt?: Date;
  expiresAt?: Date;
}

interface SocialConnection {
  connectionId: string;
  friendId: string;
  friendName: string;
  relationshipType: 'friend' | 'study_buddy' | 'competitor' | 'mentor' | 'mentee';
  connectionStrength: number;
  sharedActivities: SharedActivity[];
  collaborativeAchievements: string[];
  mutualChallenges: string[];
}

interface SharedActivity {
  activityId: string;
  type: 'study_session' | 'challenge' | 'achievement' | 'discovery';
  description: string;
  participants: string[];
  completedAt: Date;
  outcome: string;
}

interface LeaderboardPosition {
  leaderboardId: string;
  category: string;
  position: number;
  score: number;
  trend: 'rising' | 'stable' | 'falling';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

const AdvancedGamificationHub: React.FC<AdvancedGamificationHubProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [selectedTab, setSelectedTab] = useState<'profile' | 'quests' | 'achievements' | 'social' | 'story'>('profile');
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeGamificationHub();
  }, [userId]);

  const initializeGamificationHub = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadGamificationProfile(),
        loadActiveQuests(),
        checkForNewAchievements(),
        loadSocialData()
      ]);
    } catch (error) {
      console.error('ゲーミフィケーションハブ初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGamificationProfile = async () => {
    // Mock data - 実際の実装ではAPIから取得
    const profile: GamificationProfile = {
      playerId: userId,
      playerName: '勇者太郎',
      avatar: {
        baseAvatar: '🧑‍🎓',
        customizations: [
          {
            category: 'outfit',
            itemId: 'wizard_robe',
            name: '知恵の法衣',
            rarity: 'epic',
            unlockCondition: 'レベル20到達',
            isUnlocked: true,
            isEquipped: true
          },
          {
            category: 'accessory',
            itemId: 'crown_of_knowledge',
            name: '知識の王冠',
            rarity: 'legendary',
            unlockCondition: '100回連続正答',
            isUnlocked: false,
            isEquipped: false
          }
        ],
        unlockableItems: [],
        currentOutfit: {
          outfit: 'wizard_robe',
          accessories: ['magic_wand'],
          background: 'library',
          pose: 'thinking',
          expression: 'determined'
        },
        emotionalState: {
          primary: 'excited',
          intensity: 0.8,
          duration: 300,
          triggers: ['achievement_unlocked', 'level_up']
        }
      },
      level: 23,
      totalXP: 12450,
      xpToNextLevel: 550,
      playerType: {
        primary: 'achiever',
        secondary: ['explorer', 'socializer'],
        adaptability: 0.8,
        preferences: {
          competitionLevel: 0.7,
          collaborationLevel: 0.8,
          explorationLevel: 0.9,
          achievementOrientation: 0.95,
          creativityExpression: 0.6,
          socialInteraction: 0.75
        }
      },
      motivationProfile: {
        intrinsicMotivation: {
          autonomy: 0.85,
          mastery: 0.92,
          purpose: 0.78,
          curiosity: 0.88,
          creativity: 0.65,
          socialConnection: 0.75
        },
        extrinsicMotivation: {
          points: 0.7,
          badges: 0.8,
          leaderboards: 0.6,
          rewards: 0.75,
          recognition: 0.85,
          competition: 0.7
        },
        motivationalTrends: [
          {
            factor: 'mastery',
            trend: 'increasing',
            timeframe: '過去4週間',
            change_rate: 0.15
          }
        ],
        engagementDrivers: [
          {
            driver: 'progressive_challenges',
            effectiveness: 0.9,
            context: ['新概念学習', 'スキル練習'],
            sustainability: 0.85
          }
        ],
        demotivationTriggers: [
          {
            trigger: 'repetitive_tasks',
            impact: 0.6,
            frequency: 0.3,
            mitigation_strategies: ['variety_injection', 'context_switching']
          }
        ]
      },
      gamificationPreferences: {
        preferredMechanics: [
          {
            mechanic: 'progressive_challenges',
            preference: 0.9,
            effectiveness: 0.85,
            context_suitability: ['skill_building', 'mastery']
          },
          {
            mechanic: 'achievement_unlock',
            preference: 0.85,
            effectiveness: 0.8,
            context_suitability: ['milestone_completion', 'recognition']
          }
        ],
        difficulty_preference: 0.75,
        feedback_frequency: 'immediate',
        social_visibility: 'friends',
        challenge_types: ['mastery', 'exploration', 'creativity'],
        reward_preferences: ['customization', 'access', 'recognition']
      },
      progressJourney: {
        currentQuest: {
          questId: 'main_quest_5',
          title: '分数の秘密を解き明かせ！',
          description: '古代の数学遺跡で発見された分数の謎を解き、新たな計算スキルを習得しよう',
          type: 'main',
          difficulty: 6,
          estimatedTime: 120,
          objectives: [
            {
              objectiveId: 'obj1',
              description: '分数の基本概念を理解する',
              type: 'learn',
              target: { concept: 'fractions_basics' },
              progress: 100,
              completed: true,
              optional: false
            },
            {
              objectiveId: 'obj2',
              description: '分数の計算を10問連続正答',
              type: 'practice',
              target: { correct_answers: 10, consecutive: true },
              progress: 70,
              completed: false,
              optional: false
            },
            {
              objectiveId: 'obj3',
              description: '分数を使った実生活問題を解く',
              type: 'achieve',
              target: { real_world_problems: 3 },
              progress: 33,
              completed: false,
              optional: false
            }
          ],
          rewards: [
            { type: 'xp', value: 500, rarity: 'common', immediate: false },
            { type: 'badge', value: 'fraction_master', rarity: 'rare', immediate: false },
            { type: 'customization', value: 'calculator_wand', rarity: 'epic', immediate: false }
          ],
          prerequisites: ['basic_arithmetic'],
          progress: 67,
          status: 'active',
          narrative: {
            introduction: '数学者の遺跡で古代の分数パズルを発見！',
            progressUpdates: {
              25: '最初の手がかりを見つけた...',
              50: '分数の真の力が見えてきた！',
              75: 'もう少しで秘密が解明される...'
            },
            completion: '見事！分数の秘密を解き明かし、新たな力を手に入れた！',
            characterDialogue: [
              {
                character: 'wise_owl',
                dialogue: '素晴らしい進歩だね！分数の本質を理解し始めている',
                emotion: 'proud',
                timing: 'progress'
              }
            ]
          }
        },
        completedQuests: [],
        journeyMilestones: [
          {
            milestoneId: 'level_20',
            title: '学習の達人',
            description: 'レベル20に到達し、真の学習者として認められた',
            achieved: true,
            achievedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            requirements: ['reach_level_20'],
            significance: 'major',
            celebration: {
              type: 'fireworks',
              intensity: 0.8,
              duration: 5000,
              specialEffects: ['golden_sparkles', 'achievement_fanfare']
            }
          }
        ],
        pathProgress: {
          totalNodes: 150,
          completedNodes: 89,
          currentNode: {
            nodeId: 'fraction_calculations',
            type: 'skill',
            position: [12, 8],
            unlocked: true,
            completed: false,
            difficulty: 6,
            rewards: ['xp_boost', 'skill_point']
          },
          unlockedPaths: ['arithmetic_mastery', 'problem_solving', 'real_world_math'],
          discoveries: [
            {
              discoveryId: 'shortcut_1',
              name: '計算の近道',
              description: '分数計算の効率的な方法を発見',
              type: 'shortcut',
              discoveredAt: new Date(),
              value: 100
            }
          ]
        },
        storyProgression: {
          currentChapter: 3,
          totalChapters: 10,
          chapterProgress: [
            {
              chapterNumber: 1,
              title: '数の冒険の始まり',
              completed: true,
              scenesCompleted: 5,
              totalScenes: 5,
              keyEvents: ['first_calculation', 'mentor_meeting']
            },
            {
              chapterNumber: 2,
              title: '四則演算の試練',
              completed: true,
              scenesCompleted: 8,
              totalScenes: 8,
              keyEvents: ['addition_mastery', 'multiplication_challenge']
            },
            {
              chapterNumber: 3,
              title: '分数の謎',
              completed: false,
              scenesCompleted: 4,
              totalScenes: 7,
              keyEvents: ['fraction_introduction', 'ancient_puzzle']
            }
          ],
          characters: [
            {
              characterId: 'wise_owl',
              name: 'フクロウ先生',
              role: 'mentor',
              relationship: 0.85,
              personality: ['wise', 'patient', 'encouraging'],
              backstory: '古代から数学の秘密を守り続ける賢者',
              currentMood: 'proud'
            },
            {
              characterId: 'calc_cat',
              name: 'カルクル',
              role: 'companion',
              relationship: 0.92,
              personality: ['playful', 'clever', 'supportive'],
              backstory: '計算が大好きな魔法の猫',
              currentMood: 'excited'
            }
          ],
          plotPoints: [
            {
              plotId: 'ancient_secret',
              description: '古代数学者の隠された秘密',
              importance: 'major',
              triggered: false,
              triggerConditions: ['complete_chapter_5'],
              consequences: ['unlock_advanced_skills', 'new_character_introduction']
            }
          ],
          playerChoices: []
        },
        characterDevelopment: {
          abilities: [
            {
              abilityId: 'quick_calculation',
              name: '高速計算',
              level: 8,
              maxLevel: 10,
              experience: 450,
              description: '計算速度が向上し、より素早く問題を解ける',
              benefits: ['calculation_speed_boost', 'time_efficiency'],
              upgradeRequirements: ['practice_500_problems']
            }
          ],
          skills: [
            {
              skillId: 'arithmetic',
              name: '算術',
              proficiency: 0.85,
              category: 'mathematics',
              practiceTime: 2400,
              applications: ['basic_calculations', 'word_problems'],
              mastery_indicators: ['speed', 'accuracy', 'versatility']
            }
          ],
          traits: [
            {
              traitId: 'persistence',
              name: '粘り強さ',
              strength: 0.9,
              description: '困難な問題にも諦めずに取り組む',
              manifestations: ['retry_difficult_problems', 'extended_study_sessions'],
              development_path: ['challenge_completion', 'failure_recovery']
            }
          ],
          specialPowers: [
            {
              powerId: 'insight_flash',
              name: 'ひらめきフラッシュ',
              description: '難しい問題のヒントが見える特殊能力',
              unlocked: true,
              usageCount: 2,
              maxUsages: 3,
              cooldown: 0,
              effects: ['hint_revelation', 'confidence_boost']
            }
          ],
          reputation: {
            overall: 0.82,
            categories: { 'mathematics': 0.9, 'persistence': 0.85, 'collaboration': 0.7 },
            titles: ['計算の達人', '粘り強き学習者'],
            recognitions: []
          }
        }
      },
      socialConnections: [],
      achievements: [
        {
          achievementId: 'first_perfect_score',
          title: '完璧な始まり',
          description: '初めてのテストで満点を獲得',
          category: 'learning',
          rarity: 'rare',
          icon: '🌟',
          points: 100,
          unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          shareStatus: 'friends',
          prerequisites: []
        },
        {
          achievementId: 'week_streak',
          title: '一週間の継続',
          description: '7日間連続で学習を継続',
          category: 'persistence',
          rarity: 'uncommon',
          icon: '🔥',
          points: 150,
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          shareStatus: 'public',
          prerequisites: []
        }
      ],
      badges: [
        {
          badgeId: 'arithmetic_master',
          name: '算術マスター',
          description: '基本的な算術計算を習得',
          design: {
            shape: 'shield',
            colors: ['gold', 'blue'],
            symbols: ['plus', 'minus', 'multiply', 'divide'],
            animation: 'glow',
            rarity_effects: ['golden_border']
          },
          earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          level: 3,
          maxLevel: 5,
          category: 'skill',
          displayPriority: 1
        }
      ],
      streaks: [
        {
          streakId: 'daily_study',
          type: 'study_session',
          currentStreak: 12,
          longestStreak: 28,
          lastActivity: new Date(),
          milestones: [
            { milestone: 7, reward: 'ストリークバッジ', achieved: true, achievedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { milestone: 14, reward: '特別アバター', achieved: false },
            { milestone: 30, reward: 'レジェンダリーバッジ', achieved: false }
          ],
          rewardsTier: 2,
          active: true
        }
      ],
      challenges: [
        {
          challengeId: 'weekly_math',
          title: '今週の数学チャレンジ',
          description: '今週中に100問の算数問題を解こう',
          type: 'personal',
          difficulty: 5,
          duration: 7,
          participants: [userId],
          progress: {
            current: 67,
            target: 100,
            milestones: [
              { milestone: 25, description: '四分の一達成', reached: true, reward: 'XP+50' },
              { milestone: 50, description: '半分達成', reached: true, reward: 'XP+100' },
              { milestone: 75, description: '四分の三達成', reached: false, reward: 'XP+150' },
              { milestone: 100, description: '完全達成', reached: false, reward: '特別バッジ' }
            ]
          },
          rewards: [
            { tier: 1, description: 'ブロンズバッジ', value: 'bronze_badge', type: 'badge' },
            { tier: 2, description: 'シルバーバッジ', value: 'silver_badge', type: 'badge' },
            { tier: 3, description: 'ゴールドバッジ', value: 'gold_badge', type: 'badge' }
          ],
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          status: 'active'
        }
      ],
      rewards: [],
      leaderboardPositions: [
        {
          leaderboardId: 'weekly_xp',
          category: '今週のXP',
          position: 3,
          score: 1250,
          trend: 'rising',
          timeframe: 'weekly'
        }
      ]
    };

    setGamificationProfile(profile);
    if (profile.progressJourney.currentQuest) {
      setActiveQuest(profile.progressJourney.currentQuest);
    }
  };

  const loadActiveQuests = async () => {
    // クエストデータの読み込み
  };

  const checkForNewAchievements = async () => {
    // 新しいアチーブメントのチェック
  };

  const loadSocialData = async () => {
    // ソーシャルデータの読み込み
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">ゲーミフィケーションハブ読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!gamificationProfile) {
    return <div>データを読み込めませんでした</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 ${className}`}>
      <ParticleBackground particleCount={30} color="#8B5CF6" speed={0.3} />
      
      {/* レベルアップエフェクト */}
      <FireworksEffect trigger={showFireworks} />
      
      {/* アチーブメント通知 */}
      {showAchievement && (
        <AchievementToast
          achievement={{
            title: showAchievement.title,
            description: showAchievement.description,
            icon: showAchievement.icon,
            rarity: showAchievement.rarity as any
          }}
          onClose={() => setShowAchievement(null)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎮 学習アドベンチャー
            </h1>
            <p className="text-lg text-gray-600">
              {gamificationProfile.playerName}の冒険の記録
            </p>
          </div>

          {/* プレイヤーステータス */}
          <div className="mb-8">
            <KidsCard title="⭐ あなたの冒険者情報" icon="🧑‍🎓" color="purple">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* アバター */}
                <div className="text-center">
                  <div className="text-8xl mb-3">{gamificationProfile.avatar.baseAvatar}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {gamificationProfile.playerName}
                  </h3>
                  <div className="text-sm text-gray-600">
                    レベル {gamificationProfile.level} {gamificationProfile.playerType.primary === 'achiever' ? '達成者' : '探検家'}
                  </div>
                </div>

                {/* レベル・XP */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">📊 成長記録</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>レベル {gamificationProfile.level}</span>
                        <span>{gamificationProfile.totalXP} XP</span>
                      </div>
                      <AnimatedProgress 
                        progress={(gamificationProfile.totalXP % 1000) / 10}
                        color="purple"
                        label={`次のレベルまで ${gamificationProfile.xpToNextLevel} XP`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {gamificationProfile.totalXP.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">総獲得経験値</div>
                    </div>
                  </div>
                </div>

                {/* ストリーク */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">🔥 継続記録</h4>
                  <div className="space-y-2">
                    {gamificationProfile.streaks.slice(0, 2).map((streak) => (
                      <div key={streak.streakId} className="bg-orange-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-orange-800">
                            {streak.type === 'study_session' ? '学習継続' : 'ログイン継続'}
                          </span>
                          <span className="text-lg font-bold text-orange-600">
                            {streak.currentStreak}日
                          </span>
                        </div>
                        <div className="text-xs text-orange-600">
                          最長記録: {streak.longestStreak}日
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最新の成果 */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">🏆 最新の成果</h4>
                  <div className="space-y-2">
                    {gamificationProfile.achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.achievementId} className="bg-yellow-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{achievement.icon}</span>
                          <span className="text-sm font-medium text-yellow-800">
                            {achievement.title}
                          </span>
                        </div>
                        <div className="text-xs text-yellow-600">
                          {achievement.points} ポイント獲得
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </KidsCard>
          </div>

          {/* タブナビゲーション */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {[
                  { key: 'profile', label: '👤 プロフィール', icon: '👤' },
                  { key: 'quests', label: '⚔️ クエスト', icon: '⚔️' },
                  { key: 'achievements', label: '🏆 実績', icon: '🏆' },
                  { key: 'social', label: '👥 ソーシャル', icon: '👥' },
                  { key: 'story', label: '📖 ストーリー', icon: '📖' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedTab === tab.key
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          {selectedTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* アバターカスタマイゼーション */}
              <KidsCard title="🎨 アバターカスタマイズ" icon="✨" color="purple">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4">{gamificationProfile.avatar.baseAvatar}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    現在の装備
                  </h3>
                  <div className="space-y-2">
                    {gamificationProfile.avatar.customizations
                      .filter(c => c.isEquipped)
                      .map((item) => (
                        <div key={item.itemId} className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-2">
                          {item.name}
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">🔓 獲得済みアイテム</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {gamificationProfile.avatar.customizations
                      .filter(c => c.isUnlocked)
                      .map((item) => (
                        <HoverScaleCard
                          key={item.itemId}
                          className={`p-3 rounded-lg border cursor-pointer ${
                            item.isEquipped
                              ? 'bg-purple-100 border-purple-300'
                              : 'bg-gray-50 border-gray-200 hover:bg-purple-50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">
                              {item.category === 'outfit' ? '👕' :
                               item.category === 'accessory' ? '👑' : '🎨'}
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {item.name}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded mt-1 ${
                              item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                              item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                              item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.rarity === 'legendary' ? '⭐ レジェンダリー' :
                               item.rarity === 'epic' ? '💜 エピック' :
                               item.rarity === 'rare' ? '💎 レア' : '🥉 コモン'}
                            </div>
                          </div>
                        </HoverScaleCard>
                      ))}
                  </div>
                </div>
              </KidsCard>

              {/* プレイヤータイプ分析 */}
              <KidsCard title="🔍 あなたの学習スタイル" icon="🧠" color="blue">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {gamificationProfile.playerType.primary === 'achiever' ? '🎯' :
                       gamificationProfile.playerType.primary === 'explorer' ? '🔍' :
                       gamificationProfile.playerType.primary === 'socializer' ? '👥' :
                       gamificationProfile.playerType.primary === 'competitor' ? '⚔️' : '🎨'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {gamificationProfile.playerType.primary === 'achiever' ? '達成者タイプ' :
                       gamificationProfile.playerType.primary === 'explorer' ? '探検家タイプ' :
                       gamificationProfile.playerType.primary === 'socializer' ? 'ソーシャライザー' :
                       gamificationProfile.playerType.primary === 'competitor' ? '競争者タイプ' : 'クリエイタータイプ'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {gamificationProfile.playerType.primary === 'achiever' ? 
                        '目標達成と成果を重視し、着実に進歩することを好みます' :
                       '新しい発見と探索を楽しみ、学習の幅を広げることを重視します'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">📊 学習傾向</h4>
                    <div className="space-y-3">
                      {Object.entries(gamificationProfile.playerType.preferences).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>
                              {key === 'competitionLevel' ? '競争性' :
                               key === 'collaborationLevel' ? '協調性' :
                               key === 'explorationLevel' ? '探求性' :
                               key === 'achievementOrientation' ? '達成志向' :
                               key === 'creativityExpression' ? '創造性' :
                               key === 'socialInteraction' ? '社交性' : key}
                            </span>
                            <span>{Math.round(value * 100)}%</span>
                          </div>
                          <AnimatedProgress 
                            progress={value * 100}
                            color="blue"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 mb-2">💡 おすすめの学習方法</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      {gamificationProfile.playerType.primary === 'achiever' ? (
                        <>
                          <div>• 明確な目標設定と進捗追跡</div>
                          <div>• 段階的な達成と報酬システム</div>
                          <div>• 個人の成長記録の可視化</div>
                        </>
                      ) : (
                        <>
                          <div>• 新しい概念の発見と探索</div>
                          <div>• 多様な学習方法の体験</div>
                          <div>• 関連知識の幅広い学習</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </KidsCard>
            </div>
          )}

          {/* クエストタブ */}
          {selectedTab === 'quests' && activeQuest && (
            <div className="space-y-6">
              {/* メインクエスト */}
              <KidsCard title="⚔️ 現在のメインクエスト" icon="🎯" color="green">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* クエスト情報 */}
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {activeQuest.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{activeQuest.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>クエスト進捗</span>
                          <span>{activeQuest.progress}%</span>
                        </div>
                        <AnimatedProgress 
                          progress={activeQuest.progress}
                          color="green"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">難易度: </span>
                          <span className="font-medium">★{'★'.repeat(activeQuest.difficulty - 1)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">予想時間: </span>
                          <span className="font-medium">{activeQuest.estimatedTime}分</span>
                        </div>
                      </div>
                    </div>

                    {/* 目標一覧 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">🎯 クエスト目標</h4>
                      <div className="space-y-3">
                        {activeQuest.objectives.map((objective) => (
                          <div key={objective.objectiveId} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${
                                objective.completed ? 'text-green-800' : 'text-gray-800'
                              }`}>
                                {objective.completed ? '✅' : '🔲'} {objective.description}
                              </span>
                              <span className="text-xs text-gray-500">
                                {objective.progress}%
                              </span>
                            </div>
                            {!objective.completed && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${objective.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 報酬・ストーリー */}
                  <div className="space-y-4">
                    {/* 報酬 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">🎁 クエスト報酬</h4>
                      <div className="space-y-2">
                        {activeQuest.rewards.map((reward, index) => (
                          <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-yellow-800">
                              {reward.type === 'xp' ? `${reward.value} 経験値` :
                               reward.type === 'badge' ? `${reward.value} バッジ` :
                               reward.type === 'customization' ? `${reward.value} アイテム` :
                               reward.value}
                            </div>
                            <div className={`text-xs ${
                              reward.rarity === 'epic' ? 'text-purple-600' :
                              reward.rarity === 'rare' ? 'text-blue-600' :
                              'text-gray-600'
                            }`}>
                              {reward.rarity === 'epic' ? '💜 エピック' :
                               reward.rarity === 'rare' ? '💎 レア' : '🥉 コモン'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ストーリー */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">📖 物語</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm text-blue-800">
                          {activeQuest.narrative.progressUpdates[Math.floor(activeQuest.progress / 25) * 25] || 
                           activeQuest.narrative.introduction}
                        </div>
                      </div>
                    </div>

                    {/* キャラクター */}
                    {activeQuest.narrative.characterDialogue.map((dialogue, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">
                            {dialogue.character === 'wise_owl' ? '🦉' : '🐱'}
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {dialogue.character === 'wise_owl' ? 'フクロウ先生' : 'カルクル'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">"{dialogue.dialogue}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              </KidsCard>

              {/* アクティブチャレンジ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {gamificationProfile.challenges.filter(c => c.status === 'active').map((challenge) => (
                  <KidsCard key={challenge.challengeId} title="🏃‍♂️ アクティブチャレンジ" icon="⚡" color="orange">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>進捗</span>
                            <span>{challenge.progress.current}/{challenge.progress.target}</span>
                          </div>
                          <AnimatedProgress 
                            progress={(challenge.progress.current / challenge.progress.target) * 100}
                            color="orange"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">マイルストーン</h4>
                        <div className="space-y-2">
                          {challenge.progress.milestones.map((milestone, index) => (
                            <div key={index} className={`text-xs p-2 rounded ${
                              milestone.reached 
                                ? 'bg-green-100 text-green-800' 
                                : challenge.progress.current >= milestone.milestone
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-600'
                            }`}>
                              {milestone.reached ? '✅' : challenge.progress.current >= milestone.milestone ? '🎯' : '⭕'} 
                              {milestone.description} ({milestone.reward})
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        残り時間: {Math.ceil((challenge.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))}日
                      </div>
                    </div>
                  </KidsCard>
                ))}
              </div>
            </div>
          )}

          {/* 実績タブ */}
          {selectedTab === 'achievements' && (
            <div className="space-y-6">
              {/* 実績統計 */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <KidsCard title="📊 実績統計" icon="📈" color="yellow">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {gamificationProfile.achievements.length}
                    </div>
                    <div className="text-sm text-gray-600">獲得実績数</div>
                  </div>
                </KidsCard>

                <KidsCard title="🏅 バッジコレクション" icon="🏆" color="blue">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {gamificationProfile.badges.length}
                    </div>
                    <div className="text-sm text-gray-600">獲得バッジ数</div>
                  </div>
                </KidsCard>

                <KidsCard title="💎 レアリティ分布" icon="✨" color="purple">
                  <div className="text-center">
                    <div className="text-sm space-y-1">
                      {['legendary', 'epic', 'rare', 'uncommon', 'common'].map(rarity => {
                        const count = gamificationProfile.achievements.filter(a => a.rarity === rarity).length;
                        return (
                          <div key={rarity} className="flex justify-between">
                            <span>
                              {rarity === 'legendary' ? '⭐' :
                               rarity === 'epic' ? '💜' :
                               rarity === 'rare' ? '💎' :
                               rarity === 'uncommon' ? '🥈' : '🥉'}
                            </span>
                            <span>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </KidsCard>

                <KidsCard title="🎯 総ポイント" icon="💯" color="green">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {gamificationProfile.achievements.reduce((sum, a) => sum + a.points, 0)}
                    </div>
                    <div className="text-sm text-gray-600">実績ポイント</div>
                  </div>
                </KidsCard>
              </div>

              {/* 実績一覧 */}
              <KidsCard title="🏆 獲得実績一覧" icon="🎖️" color="yellow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gamificationProfile.achievements.map((achievement) => (
                    <HoverScaleCard
                      key={achievement.achievementId}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                            achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                            achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                            achievement.rarity === 'uncommon' ? 'bg-gray-100 text-gray-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {achievement.rarity === 'legendary' ? '⭐ レジェンダリー' :
                             achievement.rarity === 'epic' ? '💜 エピック' :
                             achievement.rarity === 'rare' ? '💎 レア' :
                             achievement.rarity === 'uncommon' ? '🥈 アンコモン' : '🥉 コモン'}
                          </span>
                          <span className="text-sm font-bold text-yellow-600">
                            {achievement.points}pt
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </HoverScaleCard>
                  ))}
                </div>
              </KidsCard>

              {/* バッジ一覧 */}
              <KidsCard title="🏅 獲得バッジ" icon="🎖️" color="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gamificationProfile.badges.map((badge) => (
                    <HoverScaleCard
                      key={badge.badgeId}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {badge.design.symbols[0] || '🏅'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {badge.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {badge.description}
                        </p>
                        <div className="text-xs">
                          <span className="text-gray-500">レベル </span>
                          <span className="font-bold text-blue-600">
                            {badge.level}/{badge.maxLevel}
                          </span>
                        </div>
                      </div>
                    </HoverScaleCard>
                  ))}
                </div>
              </KidsCard>
            </div>
          )}
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="🎮"
        onClick={() => {
          // クイックゲーム開始
          console.log('クイックゲーム開始');
        }}
        tooltip="クイックゲーム"
        color="purple"
        position="bottom-right"
      />
    </div>
  );
};

export default AdvancedGamificationHub;