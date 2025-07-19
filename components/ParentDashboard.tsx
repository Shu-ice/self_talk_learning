import React, { useState, useEffect } from 'react';
import { LearningReport, ParentRecommendation, ConcernArea, FamilyLearningGoal, ParentAnalytics } from '../types/parentDashboard';
import { parentDashboardService } from '../services/parentDashboardService';
import { LearnerProfile, UserProgress } from '../types';

interface ParentDashboardProps {
  learnerId: string;
  onClose: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ learnerId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'goals' | 'analytics' | 'settings'>('overview');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [learningReport, setLearningReport] = useState<LearningReport | null>(null);
  const [recommendations, setRecommendations] = useState<ParentRecommendation[]>([]);
  const [concernAreas, setConcernAreas] = useState<ConcernArea[]>([]);
  const [familyGoals, setFamilyGoals] = useState<FamilyLearningGoal[]>([]);
  const [analytics, setAnalytics] = useState<ParentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [learnerId, timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 学習レポートの生成
      const report = await parentDashboardService.generateLearningReport(learnerId, timeRange);
      setLearningReport(report);
      setRecommendations(report.parentRecommendations);
      setConcernAreas(report.concernAreas);

      // 分析データの取得
      const analyticsData = parentDashboardService.generateParentAnalytics(learnerId);
      setAnalytics(analyticsData);

      // ファミリー目標の取得（実際の実装では保存されたデータから取得）
      const goals = JSON.parse(localStorage.getItem('familyGoals') || '[]')
        .filter((goal: FamilyLearningGoal) => goal.learnerId === learnerId);
      setFamilyGoals(goals);

    } catch (error) {
      console.error('ダッシュボードデータの読み込みに失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton = ({ tab, label, active }: { tab: string; label: string; active: boolean }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-sky-600 text-white' 
          : 'bg-white text-sky-600 hover:bg-sky-50'
      }`}
    >
      {label}
    </button>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* 学習サマリー */}
      {learningReport && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">📊 学習サマリー ({timeRange === 'week' ? '今週' : timeRange === 'month' ? '今月' : '今日'})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-sky-50 rounded-lg">
              <div className="text-2xl font-bold text-sky-600">{Math.round(learningReport.summary.totalStudyTime / 60)}時間</div>
              <div className="text-sm text-slate-600">総学習時間</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{learningReport.summary.sessionsCompleted}</div>
              <div className="text-sm text-slate-600">完了セッション</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{learningReport.summary.topicsCompleted}</div>
              <div className="text-sm text-slate-600">習得トピック</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{Math.round(learningReport.summary.motivationLevel * 100)}%</div>
              <div className="text-sm text-slate-600">やる気レベル</div>
            </div>
          </div>
        </div>
      )}

      {/* 重要な推奨事項 */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">💡 重要な推奨事項</h3>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map(rec => (
              <div key={rec.id} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{rec.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {rec.priority === 'high' ? '緊急' : rec.priority === 'medium' ? '重要' : '通常'}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-500">期間: {rec.timeframe}</p>
                  <div className="mt-2">
                    {rec.actionItems.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-sm text-slate-700">• {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 懸念事項 */}
      {concernAreas.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">⚠️ 注意が必要な分野</h3>
          <div className="space-y-3">
            {concernAreas.map(concern => (
              <div key={concern.id} className={`p-4 rounded-lg ${
                concern.severity === 'high' ? 'bg-red-50 border border-red-200' :
                concern.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">{concern.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    concern.severity === 'high' ? 'bg-red-200 text-red-800' :
                    concern.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {concern.severity === 'high' ? '高' : concern.severity === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2">{concern.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      {learningReport && (
        <>
          {/* 教科別詳細分析 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📚 教科別詳細分析</h3>
            <div className="space-y-4">
              {Object.entries(learningReport.subjectBreakdown).map(([subjectId, data]) => (
                <div key={subjectId} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-800">
                      {subjectId === 'math' ? '算数' : 
                       subjectId === 'japanese' ? '国語' :
                       subjectId === 'science' ? '理科' : '社会'}
                    </h4>
                    <div className="text-sm text-slate-600">
                      学習時間: {Math.round(data.timeSpent / 60)}時間
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2">💪 得意分野</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {data.strengths.map((strength: string, index: number) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-orange-700 mb-2">📈 改善点</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {data.improvements.map((improvement: string, index: number) => (
                          <li key={index}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-blue-700 mb-2">🎯 次の目標</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {data.nextGoals.map((goal: string, index: number) => (
                          <li key={index}>• {goal}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 学習洞察 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">🔍 学習パターン分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-700 mb-3">最適な学習時間</h4>
                <div className="space-y-2">
                  {learningReport.learningInsights.bestStudyTimes.map((time, index) => (
                    <div key={index} className="bg-sky-50 rounded px-3 py-2 text-sm">
                      {time}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-700 mb-3">学習スタイル</h4>
                <div className="bg-green-50 rounded px-3 py-2 text-sm">
                  {learningReport.learningInsights.preferredLearningStyle === 'visual' ? '視覚重視型' :
                   learningReport.learningInsights.preferredLearningStyle === 'auditory' ? '聴覚重視型' :
                   learningReport.learningInsights.preferredLearningStyle === 'kinesthetic' ? '体験重視型' : 'バランス型'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const GoalsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">🎯 ファミリー学習目標</h3>
          <button 
            onClick={() => {/* 新しい目標作成モーダルを開く */}}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            新しい目標を作成
          </button>
        </div>
        
        {familyGoals.length > 0 ? (
          <div className="space-y-4">
            {familyGoals.map(goal => (
              <div key={goal.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                    <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                      <span>期限: {goal.targetDate.toLocaleDateString()}</span>
                      <span>カテゴリ: {goal.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-700">
                      進捗: {Math.round(goal.progress.overallCompletion * 100)}%
                    </div>
                    <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-sky-500 h-2 rounded-full" 
                        style={{ width: `${goal.progress.overallCompletion * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-slate-700">保護者の役割</h5>
                    <p className="text-sm text-slate-600">{goal.parentRole}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-700">お子様の役割</h5>
                    <p className="text-sm text-slate-600">{goal.childRole}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">マイルストーン</h5>
                  <div className="space-y-2">
                    {goal.milestones.slice(0, 3).map(milestone => (
                      <div key={milestone.id} className={`flex items-center space-x-2 text-sm ${
                        milestone.completed ? 'text-green-600' : 'text-slate-600'
                      }`}>
                        <span>{milestone.completed ? '✅' : '⭕'}</span>
                        <span>{milestone.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>まだファミリー学習目標が設定されていません。</p>
            <p className="text-sm mt-2">お子様と一緒に目標を設定してみましょう！</p>
          </div>
        )}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      {analytics && (
        <>
          {/* 学習効率メトリクス */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📈 学習効率分析</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(analytics.efficiencyMetrics.focusTimeRatio * 100)}%
                </div>
                <div className="text-sm text-slate-600">集中時間率</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(analytics.efficiencyMetrics.comprehensionRate * 100)}%
                </div>
                <div className="text-sm text-slate-600">理解率</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analytics.efficiencyMetrics.retentionRate * 100)}%
                </div>
                <div className="text-sm text-slate-600">定着率</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.round(analytics.efficiencyMetrics.applicationSuccess * 100)}%
                </div>
                <div className="text-sm text-slate-600">応用成功率</div>
              </div>
            </div>
          </div>

          {/* 成長傾向 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📊 成長傾向</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(analytics.growthTrends).map(([key, trend]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <span className="font-medium text-slate-700">
                    {key === 'academicProgress' ? '学習進捗' :
                     key === 'confidenceLevel' ? '自信レベル' :
                     key === 'independenceLevel' ? '自立度' : 'やる気'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trend === 'increasing' || trend === 'accelerating' ? 'bg-green-100 text-green-800' :
                    trend === 'stable' || trend === 'steady' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {trend === 'increasing' || trend === 'accelerating' ? '上昇中' :
                     trend === 'stable' || trend === 'steady' ? '安定' :
                     trend === 'plateau' ? '横ばい' : '要注意'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 受験準備度 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">🎓 受験準備度予測</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">現在の準備度</span>
                <span className="text-2xl font-bold text-sky-600">
                  {analytics.projections.examReadiness.currentLevel}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-sky-500 h-3 rounded-full" 
                  style={{ width: `${analytics.projections.examReadiness.currentLevel}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="font-medium text-slate-700">予測準備度</span>
                <span className="text-lg font-semibold text-green-600">
                  {analytics.projections.examReadiness.projectedLevel}%
                </span>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-slate-700 mb-2">重要な要素</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics.projections.examReadiness.keyFactors.map((factor, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">学習データを分析中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">保護者向けダッシュボード</h2>
              <p className="text-sky-100 mt-1">お子様の学習状況を詳しく確認できます</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* 期間選択 */}
          <div className="mt-4 flex space-x-2">
            {(['today', 'week', 'month'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-white text-sky-600' 
                    : 'bg-sky-700 text-white hover:bg-sky-600'
                }`}
              >
                {range === 'today' ? '今日' : range === 'week' ? '今週' : '今月'}
              </button>
            ))}
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton tab="overview" label="概要" active={activeTab === 'overview'} />
            <TabButton tab="reports" label="詳細レポート" active={activeTab === 'reports'} />
            <TabButton tab="goals" label="目標管理" active={activeTab === 'goals'} />
            <TabButton tab="analytics" label="分析" active={activeTab === 'analytics'} />
            <TabButton tab="settings" label="設定" active={activeTab === 'settings'} />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'goals' && <GoalsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && (
            <div className="text-center py-8 text-slate-500">
              <p>設定機能は準備中です</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;