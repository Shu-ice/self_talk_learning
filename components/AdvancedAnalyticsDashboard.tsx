import React, { useState, useEffect, useMemo } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';

interface AdvancedAnalyticsDashboardProps {
  userId: string;
  className?: string;
}

interface LearningAnalytics {
  performanceTrends: PerformanceTrend[];
  subjectMastery: SubjectMastery[];
  timeAnalysis: TimeAnalysis;
  difficultyProgression: DifficultyProgression;
  learningEfficiency: LearningEfficiency;
  retentionAnalysis: RetentionAnalysis;
  predictiveInsights: PredictiveInsight[];
  compareData: ComparisonData;
}

interface PerformanceTrend {
  date: string;
  accuracy: number;
  speed: number;
  confidence: number;
  difficulty: number;
  subject: string;
}

interface SubjectMastery {
  subject: string;
  overallMastery: number;
  topicBreakdown: TopicMastery[];
  strengthAreas: string[];
  improvementAreas: string[];
  nextRecommendations: string[];
}

interface TopicMastery {
  topic: string;
  mastery: number;
  lastStudied: Date;
  studyTime: number;
  problemsSolved: number;
  averageAccuracy: number;
}

interface TimeAnalysis {
  optimalStudyTimes: string[];
  dailyPattern: HourlyPerformance[];
  weeklyPattern: DailyPerformance[];
  sessionLengthOptimal: number;
  productivityScore: number;
  focusQualityTrend: FocusData[];
}

interface HourlyPerformance {
  hour: number;
  accuracy: number;
  speed: number;
  focus: number;
  sessionCount: number;
}

interface DailyPerformance {
  day: string;
  totalTime: number;
  accuracy: number;
  motivation: number;
  effectiveness: number;
}

interface DifficultyProgression {
  currentComfortLevel: number;
  progressionRate: number;
  difficultyHistory: DifficultyPoint[];
  optimalChallengeZone: [number, number];
  strugglingTopics: string[];
  masteredTopics: string[];
}

interface DifficultyPoint {
  date: string;
  difficulty: number;
  success: boolean;
  confidence: number;
}

interface LearningEfficiency {
  overallEfficiency: number;
  timeToMastery: { [topic: string]: number };
  errorPatterns: ErrorPattern[];
  improvementRate: number;
  learningVelocity: number;
  conceptualVsProceduralBalance: number;
}

interface ErrorPattern {
  type: string;
  frequency: number;
  subjects: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
  remediation: string;
}

interface RetentionAnalysis {
  forgettingCurve: RetentionPoint[];
  retentionBySubject: { [subject: string]: number };
  reviewEffectiveness: number;
  optimalReviewIntervals: { [topic: string]: number };
  memoryStrength: MemoryStrength[];
}

interface RetentionPoint {
  daysSinceStudy: number;
  retentionRate: number;
  topic: string;
}

interface MemoryStrength {
  topic: string;
  strength: number;
  stability: number;
  retrievability: number;
}

interface PredictiveInsight {
  type: 'warning' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

interface ComparisonData {
  peerComparison: PeerComparisonData;
  personalBest: PersonalBestData;
  goalProgress: GoalProgressData;
}

interface PeerComparisonData {
  percentile: number;
  averageAccuracy: number;
  averageSpeed: number;
  averageStudyTime: number;
  subjectRankings: { [subject: string]: number };
}

interface FocusData {
  date: string;
  focus: number;
  distractions: number;
  deepWork: number;
}

const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'mastery' | 'efficiency' | 'predictions'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userId, selectedTimeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // 実際の実装では、バックエンドAPIから分析データを取得
      const mockAnalytics = await generateMockAnalytics(userId, selectedTimeRange);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('分析データの読み込みに失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // パフォーマンス概要
  const renderPerformanceOverview = () => {
    if (!analytics) return null;

    const latestTrend = analytics.performanceTrends[analytics.performanceTrends.length - 1];
    const avgAccuracy = analytics.performanceTrends.reduce((sum, t) => sum + t.accuracy, 0) / analytics.performanceTrends.length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{Math.round(avgAccuracy)}%</div>
              <div className="text-sm opacity-90">平均正答率</div>
            </div>
            <div className="text-4xl opacity-80">🎯</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            今期の目標: 85%以上
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{analytics.learningEfficiency.overallEfficiency}%</div>
              <div className="text-sm opacity-90">学習効率</div>
            </div>
            <div className="text-4xl opacity-80">⚡</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            前月比: +{analytics.learningEfficiency.improvementRate}%
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{analytics.timeAnalysis.productivityScore}</div>
              <div className="text-sm opacity-90">集中スコア</div>
            </div>
            <div className="text-4xl opacity-80">🧠</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            最適時間: {analytics.timeAnalysis.optimalStudyTimes.join(', ')}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{Math.round(analytics.retentionAnalysis.reviewEffectiveness * 100)}%</div>
              <div className="text-sm opacity-90">記憶定着率</div>
            </div>
            <div className="text-4xl opacity-80">🧮</div>
          </div>
          <div className="mt-4 text-xs opacity-75">
            復習効果は良好です
          </div>
        </div>
      </div>
    );
  };

  // 教科別習熟度
  const renderSubjectMastery = () => {
    if (!analytics) return null;

    return (
      <KidsCard title="📚 教科別習熟度分析" icon="📊" color="blue">
        <div className="space-y-6">
          {analytics.subjectMastery.map((subject) => (
            <div key={subject.subject} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{subject.subject}</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-blue-600">{subject.overallMastery}%</div>
                  <div className="text-sm text-gray-500">習熟度</div>
                </div>
              </div>

              {/* 習熟度プログレスバー */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${subject.overallMastery}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 得意分野 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">💪 得意分野</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {subject.strengthAreas.map((area, index) => (
                      <li key={index}>• {area}</li>
                    ))}
                  </ul>
                </div>

                {/* 改善分野 */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">📈 改善分野</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {subject.improvementAreas.map((area, index) => (
                      <li key={index}>• {area}</li>
                    ))}
                  </ul>
                </div>

                {/* 推奨学習 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">🎯 次の学習</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {subject.nextRecommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 単元別詳細 */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">単元別習熟度</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subject.topicBreakdown.map((topic) => (
                    <div key={topic.topic} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-800">{topic.topic}</h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          topic.mastery >= 80 ? 'bg-green-100 text-green-800' :
                          topic.mastery >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.mastery}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            topic.mastery >= 80 ? 'bg-green-500' :
                            topic.mastery >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${topic.mastery}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        正答率: {topic.averageAccuracy}% | 学習時間: {Math.round(topic.studyTime / 60)}分
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </KidsCard>
    );
  };

  // 学習時間分析
  const renderTimeAnalysis = () => {
    if (!analytics) return null;

    return (
      <KidsCard title="⏰ 学習時間パターン分析" icon="📈" color="green">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 時間別パフォーマンス */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">時間別パフォーマンス</h3>
            <div className="space-y-3">
              {analytics.timeAnalysis.dailyPattern.map((hour) => (
                <div key={hour.hour} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-600">
                    {hour.hour}:00
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${hour.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{hour.accuracy}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🎯 最適学習時間:</strong> {analytics.timeAnalysis.optimalStudyTimes.join(', ')}
              </p>
            </div>
          </div>

          {/* 週間パターン */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">週間学習パターン</h3>
            <div className="space-y-3">
              {analytics.timeAnalysis.weeklyPattern.map((day) => (
                <div key={day.day} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(day.totalTime / 120) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16">{day.totalTime}分</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>📊 推奨セッション時間:</strong> {analytics.timeAnalysis.sessionLengthOptimal}分
              </p>
            </div>
          </div>
        </div>
      </KidsCard>
    );
  };

  // AI予測インサイト
  const renderPredictiveInsights = () => {
    if (!analytics) return null;

    return (
      <KidsCard title="🔮 AI学習予測" icon="🤖" color="purple">
        <div className="space-y-4">
          {analytics.predictiveInsights.map((insight, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-4 ${
                insight.type === 'warning' ? 'border-red-500 bg-red-50' :
                insight.type === 'opportunity' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {insight.type === 'warning' ? '⚠️' :
                       insight.type === 'opportunity' ? '🚀' : '💡'}
                    </span>
                    <h4 className={`font-semibold ${
                      insight.type === 'warning' ? 'text-red-800' :
                      insight.type === 'opportunity' ? 'text-green-800' :
                      'text-blue-800'
                    }`}>
                      {insight.title}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.priority === 'high' ? '高' :
                       insight.priority === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${
                    insight.type === 'warning' ? 'text-red-700' :
                    insight.type === 'opportunity' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {insight.description}
                  </p>
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-gray-800">推奨アクション:</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {insight.actionItems.map((action, actionIndex) => (
                        <li key={actionIndex}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{insight.confidence}%</div>
                  <div className="text-xs text-gray-500">確信度</div>
                  <div className="text-xs text-gray-500 mt-1">{insight.timeframe}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </KidsCard>
    );
  };

  // モックデータ生成（実際の実装では削除）
  const generateMockAnalytics = async (userId: string, timeRange: string): Promise<LearningAnalytics> => {
    // プレースホルダーデータ
    return {
      performanceTrends: [
        { date: '2024-01-01', accuracy: 75, speed: 85, confidence: 70, difficulty: 5, subject: '算数' },
        { date: '2024-01-02', accuracy: 78, speed: 87, confidence: 75, difficulty: 5, subject: '算数' },
        { date: '2024-01-03', accuracy: 82, speed: 89, confidence: 80, difficulty: 6, subject: '算数' }
      ],
      subjectMastery: [
        {
          subject: '算数',
          overallMastery: 75,
          topicBreakdown: [
            { topic: '四則演算', mastery: 90, lastStudied: new Date(), studyTime: 3600, problemsSolved: 50, averageAccuracy: 95 },
            { topic: '分数', mastery: 65, lastStudied: new Date(), studyTime: 2400, problemsSolved: 30, averageAccuracy: 70 },
            { topic: '図形', mastery: 70, lastStudied: new Date(), studyTime: 1800, problemsSolved: 25, averageAccuracy: 75 }
          ],
          strengthAreas: ['計算速度', '基本的な四則演算'],
          improvementAreas: ['分数の概念理解', '図形の性質'],
          nextRecommendations: ['分数の約分・通分の練習', '図形の面積計算']
        }
      ],
      timeAnalysis: {
        optimalStudyTimes: ['9:00-10:00', '15:00-16:00'],
        dailyPattern: [
          { hour: 9, accuracy: 85, speed: 90, focus: 95, sessionCount: 12 },
          { hour: 15, accuracy: 80, speed: 85, focus: 90, sessionCount: 15 },
          { hour: 19, accuracy: 75, speed: 80, focus: 70, sessionCount: 8 }
        ],
        weeklyPattern: [
          { day: '月', totalTime: 60, accuracy: 80, motivation: 85, effectiveness: 82 },
          { day: '火', totalTime: 75, accuracy: 85, motivation: 88, effectiveness: 86 },
          { day: '水', totalTime: 45, accuracy: 78, motivation: 75, effectiveness: 78 }
        ],
        sessionLengthOptimal: 25,
        productivityScore: 82,
        focusQualityTrend: [
          { date: '2024-01-01', focus: 80, distractions: 3, deepWork: 70 },
          { date: '2024-01-02', focus: 85, distractions: 2, deepWork: 75 }
        ]
      },
      difficultyProgression: {
        currentComfortLevel: 6,
        progressionRate: 1.2,
        difficultyHistory: [
          { date: '2024-01-01', difficulty: 5, success: true, confidence: 80 },
          { date: '2024-01-02', difficulty: 6, success: true, confidence: 75 }
        ],
        optimalChallengeZone: [5, 7],
        strugglingTopics: ['分数の計算', '図形の面積'],
        masteredTopics: ['基本四則演算', '小数の計算']
      },
      learningEfficiency: {
        overallEfficiency: 78,
        timeToMastery: { '四則演算': 20, '分数': 35 },
        errorPatterns: [
          { type: '計算ミス', frequency: 15, subjects: ['算数'], trend: 'decreasing', remediation: '丁寧な見直し習慣' }
        ],
        improvementRate: 12,
        learningVelocity: 1.5,
        conceptualVsProceduralBalance: 0.7
      },
      retentionAnalysis: {
        forgettingCurve: [
          { daysSinceStudy: 1, retentionRate: 85, topic: '四則演算' },
          { daysSinceStudy: 7, retentionRate: 70, topic: '四則演算' }
        ],
        retentionBySubject: { '算数': 75, '国語': 80 },
        reviewEffectiveness: 0.85,
        optimalReviewIntervals: { '四則演算': 3, '分数': 2 },
        memoryStrength: [
          { topic: '四則演算', strength: 8, stability: 7, retrievability: 9 }
        ]
      },
      predictiveInsights: [
        {
          type: 'opportunity',
          title: '算数の学習効率向上のチャンス',
          description: '現在の学習ペースなら、2週間以内に分数の習熟度を80%まで上げることができます',
          confidence: 85,
          actionItems: ['毎日15分の分数練習', '概念理解に重点を置く'],
          timeframe: '2週間以内',
          priority: 'high'
        },
        {
          type: 'warning',
          title: '図形分野の理解度低下の可能性',
          description: '図形分野の復習が不足しており、記憶定着率が低下しています',
          confidence: 78,
          actionItems: ['週2回の図形復習', '実物を使った学習'],
          timeframe: '1週間以内',
          priority: 'medium'
        }
      ],
      compareData: {
        peerComparison: {
          percentile: 75,
          averageAccuracy: 82,
          averageSpeed: 85,
          averageStudyTime: 45,
          subjectRankings: { '算数': 15, '国語': 25 }
        },
        personalBest: {},
        goalProgress: {}
      }
    };
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">高度な学習分析を実行中...</p>
          <p className="text-sm text-gray-500 mt-2">AI がデータを処理しています</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📊 高度学習分析</h2>
          <p className="text-gray-600">AI による詳細な学習パフォーマンス分析</p>
        </div>
        
        {/* 期間選択 */}
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-lg p-1 shadow-md border border-gray-200">
            <div className="flex space-x-1">
              {(['week', 'month', 'quarter'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    selectedTimeRange === range
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {range === 'week' ? '週間' : range === 'month' ? '月間' : '四半期'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ビュー選択タブ */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: '📈 概要', icon: '📊' },
              { key: 'performance', label: '🎯 パフォーマンス', icon: '📈' },
              { key: 'mastery', label: '📚 習熟度', icon: '🎓' },
              { key: 'efficiency', label: '⚡ 効率性', icon: '🔧' },
              { key: 'predictions', label: '🔮 AI予測', icon: '🤖' }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setSelectedView(view.key as any)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedView === view.key
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {renderPerformanceOverview()}
          {renderPredictiveInsights()}
        </div>
      )}
      
      {selectedView === 'mastery' && renderSubjectMastery()}
      {selectedView === 'performance' && renderTimeAnalysis()}
      {selectedView === 'predictions' && renderPredictiveInsights()}
    </div>
  );
};

export default AdvancedAnalyticsDashboard;