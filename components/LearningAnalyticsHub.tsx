import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton,
  AnimatedProgress,
  HoverScaleCard,
  FloatingActionButton,
  ParticleBackground,
  SmileyRating,
  AchievementToast
} from './ui/MicroInteractions';

/**
 * 📊 Learning Analytics Hub
 * データドリブン学習最適化のための包括的分析・インサイトシステム
 * 機械学習・統計分析・可視化を統合した次世代学習分析プラットフォーム
 */

interface LearningAnalyticsHubProps {
  userId: string;
  className?: string;
}

interface AnalyticsProfile {
  learnerId: string;
  dataCollection: DataCollectionProfile;
  analyticsHistory: AnalyticsSnapshot[];
  insights: LearningInsight[];
  predictions: LearningPrediction[];
  recommendations: AnalyticsRecommendation[];
  experiments: ExperimentParticipation[];
  performance: PerformanceAnalytics;
  engagement: EngagementAnalytics;
  learning: LearningAnalytics;
  behavioral: BehavioralAnalytics;
  cognitive: CognitiveAnalytics;
  social: SocialAnalytics;
  temporal: TemporalAnalytics;
  comparative: ComparativeAnalytics;
}

interface DataCollectionProfile {
  consentStatus: ConsentStatus;
  dataTypes: DataTypeCollection[];
  privacy: PrivacyConfiguration;
  retention: DataRetentionPolicy;
  quality: DataQualityMetrics;
}

interface ConsentStatus {
  learnerConsent: boolean;
  parentalConsent: boolean;
  consentDate: Date;
  consentScope: ConsentScope[];
  withdrawalRights: WithdrawalRight[];
}

interface ConsentScope {
  dataType: string;
  purpose: string;
  duration: number;
  thirdPartySharing: boolean;
  automation: boolean;
}

interface WithdrawalRight {
  rightType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  description: string;
  process: string;
  timeframe: number;
}

interface DataTypeCollection {
  category: 'learning' | 'behavioral' | 'physiological' | 'environmental' | 'social';
  types: DataType[];
  frequency: CollectionFrequency;
  storage: StorageConfiguration;
}

interface DataType {
  type: string;
  description: string;
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
  purpose: string[];
  retention: number;
  encryption: boolean;
}

interface CollectionFrequency {
  interval: 'real_time' | 'session' | 'daily' | 'weekly' | 'on_event';
  batchSize: number;
  compression: boolean;
}

interface StorageConfiguration {
  location: 'local' | 'cloud' | 'hybrid';
  encryption: 'aes256' | 'chacha20' | 'rsa';
  backup: BackupConfiguration;
  access: AccessConfiguration;
}

interface BackupConfiguration {
  frequency: string;
  retention: number;
  encryption: boolean;
  geographical: string[];
}

interface AccessConfiguration {
  authentication: string[];
  authorization: string[];
  auditing: boolean;
  monitoring: boolean;
}

interface PrivacyConfiguration {
  anonymization: AnonymizationMethod;
  differentialPrivacy: DifferentialPrivacyConfig;
  dataMinimization: boolean;
  purposeLimitation: boolean;
}

interface AnonymizationMethod {
  technique: 'k_anonymity' | 'l_diversity' | 't_closeness' | 'differential_privacy';
  parameters: any;
  effectiveness: number;
  reversibility: boolean;
}

interface DifferentialPrivacyConfig {
  epsilon: number;
  delta: number;
  mechanism: 'laplace' | 'gaussian' | 'exponential';
  sensitivity: number;
}

interface DataRetentionPolicy {
  defaultRetention: number;
  categorySpecific: { [category: string]: number };
  deletionSchedule: DeletionSchedule[];
  archival: ArchivalPolicy;
}

interface DeletionSchedule {
  dataType: string;
  schedule: string;
  conditions: string[];
  notification: boolean;
}

interface ArchivalPolicy {
  enabled: boolean;
  criteria: string[];
  storage: string;
  access: string[];
}

interface DataQualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
  uniqueness: number;
  overall: number;
  issues: DataQualityIssue[];
}

interface DataQualityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  resolution: string;
  status: 'open' | 'in_progress' | 'resolved';
}

interface AnalyticsSnapshot {
  snapshotId: string;
  timestamp: Date;
  timeframe: TimeframePeriod;
  metrics: MetricSnapshot[];
  insights: InsightSnapshot[];
  changes: ChangeDetection[];
  trends: TrendAnalysis[];
  anomalies: AnomalyDetection[];
}

interface TimeframePeriod {
  start: Date;
  end: Date;
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month';
  timezone: string;
}

interface MetricSnapshot {
  metricId: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  context: MetricContext;
}

interface MetricContext {
  factors: ContextFactor[];
  segment: string;
  conditions: string[];
  comparisons: MetricComparison[];
}

interface ContextFactor {
  factor: string;
  value: any;
  influence: number;
  significance: number;
}

interface MetricComparison {
  baseline: string;
  difference: number;
  significance: number;
  interpretation: string;
}

interface InsightSnapshot {
  insightId: string;
  category: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  evidence: Evidence[];
}

interface Evidence {
  type: 'statistical' | 'observational' | 'experimental' | 'qualitative';
  source: string;
  strength: number;
  description: string;
}

interface ChangeDetection {
  changeType: 'trend' | 'shift' | 'outlier' | 'pattern';
  metric: string;
  magnitude: number;
  significance: number;
  timestamp: Date;
  causality: CausalityAnalysis;
}

interface CausalityAnalysis {
  likelyCauses: CausalFactor[];
  confidence: number;
  mechanism: string;
  intervention: string[];
}

interface CausalFactor {
  factor: string;
  probability: number;
  timelag: number;
  strength: number;
}

interface TrendAnalysis {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'cyclical' | 'stable';
  strength: number;
  duration: number;
  forecast: ForecastPoint[];
  seasonality: SeasonalityPattern;
}

interface ForecastPoint {
  timestamp: Date;
  predicted: number;
  confidence: ConfidenceInterval;
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
}

interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;
}

interface SeasonalityPattern {
  detected: boolean;
  period: number;
  strength: number;
  components: SeasonalComponent[];
}

interface SeasonalComponent {
  frequency: string;
  amplitude: number;
  phase: number;
  significance: number;
}

interface AnomalyDetection {
  anomalyId: string;
  type: 'point' | 'contextual' | 'collective';
  metric: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  explanation: AnomalyExplanation;
  response: AnomalyResponse;
}

interface AnomalyExplanation {
  method: string;
  features: FeatureContribution[];
  context: string[];
  similar: SimilarAnomaly[];
}

interface FeatureContribution {
  feature: string;
  contribution: number;
  direction: 'positive' | 'negative';
  importance: number;
}

interface SimilarAnomaly {
  timestamp: Date;
  similarity: number;
  outcome: string;
  resolution: string;
}

interface AnomalyResponse {
  automated: AutomatedResponse[];
  manual: ManualResponse[];
  escalation: EscalationProcedure;
}

interface AutomatedResponse {
  action: string;
  triggered: boolean;
  effectiveness: number;
  timestamp: Date;
}

interface ManualResponse {
  action: string;
  required: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  deadline: Date;
}

interface EscalationProcedure {
  levels: EscalationLevel[];
  currentLevel: number;
  escalated: boolean;
  escalationTime: Date;
}

interface EscalationLevel {
  level: number;
  threshold: number;
  stakeholders: string[];
  actions: string[];
  timeframe: number;
}

interface LearningInsight {
  insightId: string;
  category: InsightCategory;
  title: string;
  description: string;
  confidence: number;
  impact: ImpactAssessment;
  evidence: EvidenceBase;
  recommendations: InsightRecommendation[];
  validation: InsightValidation;
  lifecycle: InsightLifecycle;
}

interface InsightCategory {
  primary: 'performance' | 'engagement' | 'learning' | 'behavioral' | 'cognitive' | 'social';
  secondary: string[];
  domain: string;
  scope: 'individual' | 'group' | 'population';
}

interface ImpactAssessment {
  magnitude: 'small' | 'medium' | 'large';
  direction: 'positive' | 'negative' | 'mixed';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  affected_areas: string[];
  quantified_impact: QuantifiedImpact;
}

interface QuantifiedImpact {
  metric: string;
  baseline: number;
  projected: number;
  confidence: number;
  assumptions: string[];
}

interface EvidenceBase {
  sources: EvidenceSource[];
  methodology: ResearchMethodology;
  quality: EvidenceQuality;
  limitations: string[];
}

interface EvidenceSource {
  type: 'observational' | 'experimental' | 'meta_analysis' | 'expert_opinion';
  source: string;
  weight: number;
  reliability: number;
  recency: number;
}

interface ResearchMethodology {
  approach: string;
  sampleSize: number;
  duration: number;
  controls: string[];
  biases: BiasAssessment[];
}

interface BiasAssessment {
  bias: string;
  probability: number;
  mitigation: string[];
  residual_risk: number;
}

interface EvidenceQuality {
  internal_validity: number;
  external_validity: number;
  construct_validity: number;
  statistical_power: number;
  overall: number;
}

interface InsightRecommendation {
  recommendationId: string;
  action: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  success_metrics: string[];
  risks: string[];
  dependencies: string[];
}

interface InsightValidation {
  validated: boolean;
  validation_method: string[];
  validation_results: ValidationResult[];
  external_validation: boolean;
  peer_review: boolean;
}

interface ValidationResult {
  method: string;
  result: 'confirmed' | 'partial' | 'refuted';
  confidence: number;
  details: string;
}

interface InsightLifecycle {
  status: 'generated' | 'validated' | 'implemented' | 'monitored' | 'retired';
  created: Date;
  last_updated: Date;
  expiry: Date;
  revision_history: InsightRevision[];
}

interface InsightRevision {
  version: number;
  changes: string[];
  reason: string;
  timestamp: Date;
  author: string;
}

interface LearningPrediction {
  predictionId: string;
  type: PredictionType;
  target: PredictionTarget;
  timeframe: PredictionTimeframe;
  model: PredictionModel;
  results: PredictionResults;
  uncertainty: UncertaintyAnalysis;
  explanation: PredictionExplanation;
  monitoring: PredictionMonitoring;
}

interface PredictionType {
  category: 'performance' | 'engagement' | 'behavior' | 'outcome' | 'risk';
  approach: 'classification' | 'regression' | 'time_series' | 'causal' | 'reinforcement';
  granularity: 'individual' | 'cohort' | 'segment' | 'population';
}

interface PredictionTarget {
  metric: string;
  definition: string;
  unit: string;
  range: [number, number];
  interpretation: string;
}

interface PredictionTimeframe {
  horizon: number;
  unit: 'days' | 'weeks' | 'months' | 'sessions';
  granularity: 'daily' | 'weekly' | 'monthly';
  update_frequency: string;
}

interface PredictionModel {
  algorithm: string;
  version: string;
  features: ModelFeature[];
  hyperparameters: any;
  training: TrainingMetadata;
  validation: ValidationMetadata;
  performance: ModelPerformance;
}

interface ModelFeature {
  name: string;
  type: 'numerical' | 'categorical' | 'text' | 'image' | 'sequence';
  importance: number;
  transformation: string[];
  missing_strategy: string;
}

interface TrainingMetadata {
  data_period: TimeframePeriod;
  sample_size: number;
  training_split: number;
  validation_split: number;
  test_split: number;
  cross_validation: CrossValidationConfig;
}

interface CrossValidationConfig {
  method: string;
  folds: number;
  stratified: boolean;
  shuffle: boolean;
  random_state: number;
}

interface ValidationMetadata {
  holdout_performance: ModelPerformance;
  cross_validation_performance: ModelPerformance;
  temporal_validation: TemporalValidation;
  robustness_checks: RobustnessCheck[];
}

interface TemporalValidation {
  walk_forward: boolean;
  periods: number;
  performance_stability: number;
  drift_detection: boolean;
}

interface RobustnessCheck {
  type: string;
  description: string;
  result: 'pass' | 'fail' | 'warning';
  impact: number;
}

interface ModelPerformance {
  metrics: { [metric: string]: number };
  confusion_matrix?: number[][];
  feature_importance: FeatureImportance[];
  calibration: CalibrationMetrics;
  fairness: FairnessMetrics;
}

interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  stability: number;
}

interface CalibrationMetrics {
  calibrated: boolean;
  brier_score: number;
  reliability: number;
  resolution: number;
}

interface FairnessMetrics {
  demographic_parity: number;
  equalized_odds: number;
  calibration_equity: number;
  individual_fairness: number;
}

interface PredictionResults {
  predictions: PredictionPoint[];
  summary: PredictionSummary;
  distributions: PredictionDistribution[];
  scenarios: ScenarioAnalysis[];
}

interface PredictionPoint {
  timestamp: Date;
  predicted_value: number;
  confidence: ConfidenceInterval;
  probability?: number;
  risk_score?: number;
}

interface PredictionSummary {
  mean_prediction: number;
  median_prediction: number;
  std_prediction: number;
  min_prediction: number;
  max_prediction: number;
  confidence_level: number;
}

interface PredictionDistribution {
  timestamp: Date;
  distribution: DistributionParameters;
  percentiles: { [percentile: string]: number };
}

interface DistributionParameters {
  type: 'normal' | 'beta' | 'gamma' | 'lognormal' | 'poisson';
  parameters: any;
  support: [number, number];
}

interface ScenarioAnalysis {
  scenario: string;
  probability: number;
  prediction: number;
  conditions: string[];
  implications: string[];
}

interface UncertaintyAnalysis {
  sources: UncertaintySource[];
  quantification: UncertaintyQuantification;
  sensitivity: SensitivityAnalysis[];
  robustness: RobustnessAnalysis;
}

interface UncertaintySource {
  source: 'aleatory' | 'epistemic' | 'model' | 'data' | 'parameter';
  description: string;
  magnitude: number;
  reducible: boolean;
}

interface UncertaintyQuantification {
  method: 'monte_carlo' | 'bootstrap' | 'bayesian' | 'ensemble';
  iterations: number;
  convergence: boolean;
  intervals: ConfidenceInterval[];
}

interface SensitivityAnalysis {
  parameter: string;
  method: string;
  sensitivity_index: number;
  threshold: number;
  impact: string;
}

interface RobustnessAnalysis {
  perturbations: PerturbationTest[];
  stability_score: number;
  break_points: BreakPoint[];
  recommendations: string[];
}

interface PerturbationTest {
  type: string;
  magnitude: number;
  impact: number;
  recovery: boolean;
}

interface BreakPoint {
  parameter: string;
  threshold: number;
  failure_mode: string;
  mitigation: string[];
}

interface PredictionExplanation {
  global_explanation: GlobalExplanation;
  local_explanations: LocalExplanation[];
  counterfactuals: CounterfactualExplanation[];
  feature_attribution: FeatureAttribution[];
}

interface GlobalExplanation {
  model_behavior: string;
  key_patterns: string[];
  feature_relationships: FeatureRelationship[];
  decision_boundaries: DecisionBoundary[];
}

interface FeatureRelationship {
  features: string[];
  relationship: string;
  strength: number;
  direction: string;
}

interface DecisionBoundary {
  features: string[];
  boundary: string;
  importance: number;
  interpretability: number;
}

interface LocalExplanation {
  instance_id: string;
  prediction: number;
  explanations: InstanceExplanation[];
  similar_instances: SimilarInstance[];
}

interface InstanceExplanation {
  feature: string;
  value: any;
  contribution: number;
  importance: number;
  direction: 'positive' | 'negative';
}

interface SimilarInstance {
  instance_id: string;
  similarity: number;
  prediction: number;
  key_differences: string[];
}

interface CounterfactualExplanation {
  original_prediction: number;
  counterfactual_prediction: number;
  changes_required: FeatureChange[];
  feasibility: number;
  actionability: number;
}

interface FeatureChange {
  feature: string;
  original_value: any;
  required_value: any;
  effort: 'low' | 'medium' | 'high';
  achievability: number;
}

interface FeatureAttribution {
  method: 'shap' | 'lime' | 'integrated_gradients' | 'permutation';
  attributions: Attribution[];
  baseline: any;
  consistency: number;
}

interface Attribution {
  feature: string;
  attribution: number;
  confidence: number;
  stability: number;
}

interface PredictionMonitoring {
  drift_detection: DriftDetection;
  performance_monitoring: PerformanceMonitoring;
  feedback_loop: FeedbackLoop;
  retraining_schedule: RetrainingSchedule;
}

interface DriftDetection {
  data_drift: DriftMetric[];
  concept_drift: DriftMetric[];
  prediction_drift: DriftMetric[];
  alerts: DriftAlert[];
}

interface DriftMetric {
  metric: string;
  current_value: number;
  baseline_value: number;
  threshold: number;
  status: 'stable' | 'warning' | 'critical';
}

interface DriftAlert {
  alert_id: string;
  type: string;
  severity: string;
  timestamp: Date;
  description: string;
  action_required: string[];
}

interface PerformanceMonitoring {
  live_metrics: LiveMetric[];
  degradation_detection: DegradationDetection;
  comparison: PerformanceComparison;
}

interface LiveMetric {
  metric: string;
  current: number;
  expected: number;
  variance: number;
  trend: string;
}

interface DegradationDetection {
  detected: boolean;
  severity: string;
  metrics_affected: string[];
  probable_causes: string[];
}

interface PerformanceComparison {
  baseline_model: string;
  current_performance: number;
  baseline_performance: number;
  improvement: number;
  significance: number;
}

interface FeedbackLoop {
  feedback_sources: FeedbackSource[];
  integration_method: string;
  update_frequency: string;
  validation_process: string;
}

interface FeedbackSource {
  source: string;
  type: 'explicit' | 'implicit' | 'behavioral';
  reliability: number;
  lag: number;
  weight: number;
}

interface RetrainingSchedule {
  frequency: string;
  triggers: RetrainingTrigger[];
  data_requirements: DataRequirement[];
  validation_criteria: ValidationCriterion[];
}

interface RetrainingTrigger {
  trigger: string;
  threshold: number;
  automatic: boolean;
  approval_required: boolean;
}

interface DataRequirement {
  type: string;
  minimum_size: number;
  quality_threshold: number;
  recency: number;
}

interface ValidationCriterion {
  metric: string;
  threshold: number;
  comparison: 'absolute' | 'relative';
  mandatory: boolean;
}

interface AnalyticsRecommendation {
  recommendationId: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  content: RecommendationContent;
  targeting: RecommendationTargeting;
  implementation: RecommendationImplementation;
  evaluation: RecommendationEvaluation;
  lifecycle: RecommendationLifecycle;
}

interface RecommendationCategory {
  primary: 'learning' | 'engagement' | 'performance' | 'behavior' | 'system';
  secondary: string[];
  intervention_type: 'preventive' | 'corrective' | 'enhancement' | 'optimization';
}

interface RecommendationPriority {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  overall_priority: number;
}

interface RecommendationContent {
  title: string;
  description: string;
  rationale: string;
  expected_outcomes: ExpectedOutcome[];
  implementation_steps: ImplementationStep[];
  alternatives: AlternativeRecommendation[];
}

interface ExpectedOutcome {
  outcome: string;
  probability: number;
  timeframe: string;
  measurable: boolean;
  metric: string;
}

interface ImplementationStep {
  step: number;
  action: string;
  resources: string[];
  duration: number;
  dependencies: string[];
  success_criteria: string[];
}

interface AlternativeRecommendation {
  alternative: string;
  pros: string[];
  cons: string[];
  suitability: number;
  effort: string;
}

interface RecommendationTargeting {
  target_audience: string[];
  exclusions: string[];
  personalization: PersonalizationRule[];
  segmentation: SegmentationRule[];
}

interface PersonalizationRule {
  condition: string;
  adaptation: string;
  strength: number;
}

interface SegmentationRule {
  segment: string;
  applicability: number;
  modifications: string[];
}

interface RecommendationImplementation {
  delivery_method: string[];
  timing: TimingConfiguration;
  frequency: FrequencyConfiguration;
  channels: ChannelConfiguration[];
  automation: AutomationConfiguration;
}

interface TimingConfiguration {
  optimal_time: string;
  time_windows: TimeWindow[];
  avoid_times: string[];
  adaptive: boolean;
}

interface TimeWindow {
  start: string;
  end: string;
  effectiveness: number;
  context: string[];
}

interface FrequencyConfiguration {
  initial: string;
  maintenance: string;
  adaptation_rules: AdaptationRule[];
  saturation_prevention: boolean;
}

interface AdaptationRule {
  condition: string;
  frequency_change: string;
  duration: string;
}

interface ChannelConfiguration {
  channel: string;
  priority: number;
  effectiveness: number;
  personalization: boolean;
  fallback: string[];
}

interface RecommendationEvaluation {
  success_metrics: EvaluationMetric[];
  measurement_plan: MeasurementPlan;
  feedback_collection: FeedbackCollection;
  continuous_monitoring: ContinuousMonitoring;
}

interface EvaluationMetric {
  metric: string;
  target_value: number;
  measurement_method: string;
  frequency: string;
  threshold: number;
}

interface MeasurementPlan {
  baseline_measurement: boolean;
  control_group: boolean;
  measurement_periods: MeasurementPeriod[];
  data_collection: DataCollectionMethod[];
}

interface MeasurementPeriod {
  period: string;
  metrics: string[];
  granularity: string;
  reporting: boolean;
}

interface DataCollectionMethod {
  method: string;
  automated: boolean;
  quality_assurance: string[];
  privacy_compliant: boolean;
}

interface FeedbackCollection {
  explicit_feedback: ExplicitFeedback[];
  implicit_feedback: ImplicitFeedback[];
  qualitative_feedback: QualitativeFeedback[];
}

interface ExplicitFeedback {
  method: string;
  frequency: string;
  questions: FeedbackQuestion[];
  incentives: string[];
}

interface FeedbackQuestion {
  question: string;
  type: string;
  scale: string;
  required: boolean;
}

interface ImplicitFeedback {
  signal: string;
  interpretation: string;
  weight: number;
  lag: number;
}

interface QualitativeFeedback {
  method: string;
  frequency: string;
  analysis: string;
  insights_extraction: string[];
}

interface ContinuousMonitoring {
  real_time_metrics: string[];
  alerting: AlertingConfiguration;
  automated_responses: AutomatedResponse[];
  escalation: EscalationConfiguration;
}

interface AlertingConfiguration {
  conditions: AlertCondition[];
  recipients: string[];
  channels: string[];
  frequency_limits: FrequencyLimit[];
}

interface AlertCondition {
  condition: string;
  threshold: number;
  severity: string;
  action: string;
}

interface FrequencyLimit {
  alert_type: string;
  max_frequency: string;
  suppression_rules: string[];
}

interface EscalationConfiguration {
  triggers: EscalationTrigger[];
  levels: EscalationLevel[];
  timeouts: number[];
}

interface EscalationTrigger {
  condition: string;
  threshold: number;
  timeframe: number;
}

interface RecommendationLifecycle {
  status: 'draft' | 'active' | 'implemented' | 'retired' | 'superseded';
  created: Date;
  activated?: Date;
  implemented?: Date;
  retired?: Date;
  effectiveness: EffectivenessTracking;
  iterations: RecommendationIteration[];
}

interface EffectivenessTracking {
  initial_effectiveness: number;
  current_effectiveness: number;
  trend: string;
  factors: EffectivenessFactor[];
}

interface EffectivenessFactor {
  factor: string;
  impact: number;
  confidence: number;
  actionable: boolean;
}

interface RecommendationIteration {
  version: number;
  changes: string[];
  reason: string;
  effectiveness_change: number;
  timestamp: Date;
}

interface ExperimentParticipation {
  experimentId: string;
  participation: ParticipationDetails;
  assignment: ExperimentAssignment;
  exposure: ExposureTracking;
  outcomes: ExperimentOutcomes;
  experience: ParticipantExperience;
}

interface ParticipationDetails {
  enrolled: boolean;
  consent_date: Date;
  eligibility: EligibilityAssessment;
  randomization: RandomizationDetails;
  compliance: ComplianceTracking;
}

interface EligibilityAssessment {
  eligible: boolean;
  criteria_met: { [criterion: string]: boolean };
  exclusions: string[];
  special_considerations: string[];
}

interface RandomizationDetails {
  method: string;
  timestamp: Date;
  seed: string;
  stratification: { [variable: string]: any };
  balancing: BalancingCheck[];
}

interface BalancingCheck {
  variable: string;
  balanced: boolean;
  imbalance_magnitude: number;
  action_taken: string;
}

interface ComplianceTracking {
  overall_compliance: number;
  compliance_metrics: ComplianceMetric[];
  violations: ComplianceViolation[];
  adherence_pattern: AdherencePattern;
}

interface ComplianceMetric {
  metric: string;
  expected: number;
  actual: number;
  compliance_rate: number;
}

interface ComplianceViolation {
  violation: string;
  timestamp: Date;
  severity: string;
  impact: string;
  corrective_action: string;
}

interface AdherencePattern {
  pattern: string;
  consistency: number;
  predictors: string[];
  interventions: string[];
}

interface ExperimentAssignment {
  variant: string;
  assignment_date: Date;
  exposure_start: Date;
  exposure_end?: Date;
  dosage: DosageTracking;
  contamination: ContaminationAssessment;
}

interface DosageTracking {
  intended_dosage: number;
  actual_dosage: number;
  dosage_compliance: number;
  factors_affecting: string[];
}

interface ContaminationAssessment {
  contaminated: boolean;
  contamination_source: string[];
  contamination_level: number;
  impact_assessment: string;
}

interface ExposureTracking {
  exposure_metrics: ExposureMetric[];
  quality_metrics: ExposureQuality[];
  temporal_pattern: TemporalExposure;
  context_factors: ExposureContext[];
}

interface ExposureMetric {
  metric: string;
  value: number;
  unit: string;
  quality: number;
}

interface ExposureQuality {
  dimension: string;
  score: number;
  issues: string[];
  improvement_opportunities: string[];
}

interface TemporalExposure {
  duration: number;
  frequency: number;
  intensity: number;
  timing_pattern: string;
}

interface ExposureContext {
  context: string;
  influence: number;
  measurement: string;
  stability: number;
}

interface ExperimentOutcomes {
  primary_outcomes: OutcomeMeasurement[];
  secondary_outcomes: OutcomeMeasurement[];
  safety_outcomes: OutcomeMeasurement[];
  unexpected_outcomes: UnexpectedOutcome[];
}

interface OutcomeMeasurement {
  outcome: string;
  baseline: number;
  post_intervention: number;
  change: number;
  significance: number;
  clinical_significance: boolean;
}

interface UnexpectedOutcome {
  outcome: string;
  description: string;
  severity: string;
  relationship: string;
  action_taken: string;
}

interface ParticipantExperience {
  satisfaction: SatisfactionMetrics;
  usability: UsabilityMetrics;
  engagement: ParticipantEngagement;
  feedback: ParticipantFeedback[];
}

interface SatisfactionMetrics {
  overall: number;
  dimensions: { [dimension: string]: number };
  net_promoter_score: number;
  retention_intention: number;
}

interface UsabilityMetrics {
  ease_of_use: number;
  learnability: number;
  efficiency: number;
  error_rate: number;
  satisfaction: number;
}

interface ParticipantEngagement {
  engagement_level: number;
  engagement_pattern: string;
  dropout_risk: number;
  motivation_factors: string[];
}

interface ParticipantFeedback {
  feedback_id: string;
  type: 'survey' | 'interview' | 'focus_group' | 'observation';
  timestamp: Date;
  content: string;
  sentiment: string;
  themes: string[];
}

interface PerformanceAnalytics {
  academic: AcademicPerformance;
  skill: SkillPerformance;
  cognitive: CognitivePerformance;
  metacognitive: MetacognitivePerformance;
  efficiency: EfficiencyMetrics;
  consistency: ConsistencyMetrics;
  growth: GrowthMetrics;
  comparative: ComparativePerformance;
}

interface AcademicPerformance {
  subjects: SubjectPerformance[];
  overall_grade: number;
  grade_trend: GradeTrend;
  achievement_gaps: AchievementGap[];
  mastery_levels: MasteryLevel[];
}

interface SubjectPerformance {
  subject: string;
  current_score: number;
  historical_scores: HistoricalScore[];
  skill_breakdown: SkillBreakdown[];
  difficulty_analysis: DifficultyAnalysis;
  improvement_areas: ImprovementArea[];
}

interface HistoricalScore {
  date: Date;
  score: number;
  context: string;
  factors: string[];
}

interface SkillBreakdown {
  skill: string;
  proficiency: number;
  confidence: number;
  last_assessed: Date;
  progression: SkillProgression;
}

interface SkillProgression {
  trajectory: 'improving' | 'stable' | 'declining';
  rate: number;
  milestones: SkillMilestone[];
  next_target: string;
}

interface SkillMilestone {
  milestone: string;
  achieved: boolean;
  date_achieved?: Date;
  difficulty: number;
}

interface DifficultyAnalysis {
  preferred_difficulty: number;
  challenge_tolerance: number;
  frustration_threshold: number;
  optimal_zone: [number, number];
}

interface ImprovementArea {
  area: string;
  priority: number;
  effort_required: string;
  expected_timeframe: string;
  strategies: string[];
}

interface GradeTrend {
  direction: 'improving' | 'stable' | 'declining';
  magnitude: number;
  consistency: number;
  factors: TrendFactor[];
}

interface TrendFactor {
  factor: string;
  contribution: number;
  controllable: boolean;
  interventions: string[];
}

interface AchievementGap {
  dimension: string;
  gap_size: number;
  benchmark: string;
  closing_rate: number;
  intervention_effectiveness: number;
}

interface MasteryLevel {
  topic: string;
  mastery_score: number;
  evidence: MasteryEvidence[];
  retention_strength: number;
  transfer_ability: number;
}

interface MasteryEvidence {
  evidence_type: string;
  strength: number;
  recency: number;
  context: string;
}

const LearningAnalyticsHub: React.FC<LearningAnalyticsHubProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'insights' | 'predictions' | 'experiments'>('overview');
  const [analyticsProfile, setAnalyticsProfile] = useState<AnalyticsProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showInsight, setShowInsight] = useState<LearningInsight | null>(null);

  useEffect(() => {
    initializeAnalyticsHub();
  }, [userId]);

  const initializeAnalyticsHub = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadAnalyticsProfile(),
        loadInsights(),
        loadPredictions(),
        loadExperiments()
      ]);
    } catch (error) {
      console.error('分析ハブ初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalyticsProfile = async () => {
    // Mock data - 実際の実装ではAPIから取得
    const profile: AnalyticsProfile = {
      learnerId: userId,
      dataCollection: {
        consentStatus: {
          learnerConsent: true,
          parentalConsent: true,
          consentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          consentScope: [
            {
              dataType: 'learning_behavior',
              purpose: 'learning_optimization',
              duration: 365,
              thirdPartySharing: false,
              automation: true
            }
          ],
          withdrawalRights: []
        },
        dataTypes: [],
        privacy: {
          anonymization: {
            technique: 'k_anonymity',
            parameters: { k: 5 },
            effectiveness: 0.95,
            reversibility: false
          },
          differentialPrivacy: {
            epsilon: 1.0,
            delta: 0.00001,
            mechanism: 'laplace',
            sensitivity: 1.0
          },
          dataMinimization: true,
          purposeLimitation: true
        },
        retention: {
          defaultRetention: 365,
          categorySpecific: { 'learning': 730, 'behavioral': 365 },
          deletionSchedule: [],
          archival: {
            enabled: true,
            criteria: ['long_term_research'],
            storage: 'encrypted_archive',
            access: ['researcher', 'data_scientist']
          }
        },
        quality: {
          completeness: 0.92,
          accuracy: 0.88,
          consistency: 0.95,
          timeliness: 0.90,
          validity: 0.93,
          uniqueness: 0.97,
          overall: 0.93,
          issues: []
        }
      },
      analyticsHistory: [],
      insights: [
        {
          insightId: 'insight_1',
          category: {
            primary: 'performance',
            secondary: ['academic', 'mathematics'],
            domain: 'arithmetic',
            scope: 'individual'
          },
          title: '午後の学習効率向上機会',
          description: '午後14-16時の学習セッションで算数の正答率が20%低下。集中力の自然な低下と推測されます。',
          confidence: 0.85,
          impact: {
            magnitude: 'medium',
            direction: 'positive',
            timeframe: 'short_term',
            affected_areas: ['mathematics_performance', 'study_efficiency'],
            quantified_impact: {
              metric: 'accuracy_rate',
              baseline: 0.75,
              projected: 0.85,
              confidence: 0.8,
              assumptions: ['intervention_compliance', 'consistent_schedule']
            }
          },
          evidence: {
            sources: [
              {
                type: 'observational',
                source: 'learning_sessions_data',
                weight: 0.9,
                reliability: 0.85,
                recency: 0.95
              }
            ],
            methodology: {
              approach: 'time_series_analysis',
              sampleSize: 150,
              duration: 30,
              controls: ['day_of_week', 'session_length'],
              biases: []
            },
            quality: {
              internal_validity: 0.8,
              external_validity: 0.7,
              construct_validity: 0.85,
              statistical_power: 0.75,
              overall: 0.78
            },
            limitations: ['small_sample_size', 'short_observation_period']
          },
          recommendations: [
            {
              recommendationId: 'rec_1',
              action: '午後の学習セッションに軽いエクササイズまたはマインドフルネス活動を追加',
              rationale: '集中力回復と認知機能向上のため',
              priority: 'medium',
              effort: 'low',
              timeline: '1-2週間',
              success_metrics: ['accuracy_improvement', 'engagement_score'],
              risks: ['時間増加', '習慣化の困難'],
              dependencies: ['保護者協力', 'スケジュール調整']
            }
          ],
          validation: {
            validated: false,
            validation_method: ['A_B_test', 'cross_validation'],
            validation_results: [],
            external_validation: false,
            peer_review: false
          },
          lifecycle: {
            status: 'generated',
            created: new Date(),
            last_updated: new Date(),
            expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            revision_history: []
          }
        }
      ],
      predictions: [
        {
          predictionId: 'pred_1',
          type: {
            category: 'performance',
            approach: 'time_series',
            granularity: 'individual'
          },
          target: {
            metric: 'weekly_mathematics_score',
            definition: '週間算数テストの平均スコア',
            unit: 'percentage',
            range: [0, 100],
            interpretation: 'Higher is better'
          },
          timeframe: {
            horizon: 4,
            unit: 'weeks',
            granularity: 'weekly',
            update_frequency: 'daily'
          },
          model: {
            algorithm: 'LSTM',
            version: '1.2.0',
            features: [
              {
                name: 'previous_scores',
                type: 'sequence',
                importance: 0.4,
                transformation: ['normalization'],
                missing_strategy: 'interpolation'
              },
              {
                name: 'study_time',
                type: 'numerical',
                importance: 0.25,
                transformation: ['log_transform'],
                missing_strategy: 'median_fill'
              },
              {
                name: 'engagement_level',
                type: 'numerical',
                importance: 0.2,
                transformation: ['standardization'],
                missing_strategy: 'forward_fill'
              }
            ],
            hyperparameters: {
              hidden_layers: 2,
              neurons_per_layer: 50,
              dropout_rate: 0.2,
              learning_rate: 0.001
            },
            training: {
              data_period: {
                start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
                end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                granularity: 'day',
                timezone: 'Asia/Tokyo'
              },
              sample_size: 1500,
              training_split: 0.7,
              validation_split: 0.15,
              test_split: 0.15,
              cross_validation: {
                method: 'time_series_split',
                folds: 5,
                stratified: false,
                shuffle: false,
                random_state: 42
              }
            },
            validation: {
              holdout_performance: {
                metrics: { 'mae': 3.2, 'rmse': 4.1, 'mape': 0.08 },
                feature_importance: [],
                calibration: {
                  calibrated: true,
                  brier_score: 0.15,
                  reliability: 0.92,
                  resolution: 0.18
                },
                fairness: {
                  demographic_parity: 0.95,
                  equalized_odds: 0.93,
                  calibration_equity: 0.91,
                  individual_fairness: 0.89
                }
              },
              cross_validation_performance: {
                metrics: { 'mae': 3.5, 'rmse': 4.3, 'mape': 0.09 },
                feature_importance: [],
                calibration: {
                  calibrated: true,
                  brier_score: 0.16,
                  reliability: 0.90,
                  resolution: 0.17
                },
                fairness: {
                  demographic_parity: 0.94,
                  equalized_odds: 0.92,
                  calibration_equity: 0.90,
                  individual_fairness: 0.88
                }
              },
              temporal_validation: {
                walk_forward: true,
                periods: 8,
                performance_stability: 0.87,
                drift_detection: true
              },
              robustness_checks: []
            },
            performance: {
              metrics: { 'mae': 3.2, 'rmse': 4.1, 'mape': 0.08, 'r2': 0.82 },
              feature_importance: [
                { feature: 'previous_scores', importance: 0.4, rank: 1, stability: 0.9 },
                { feature: 'study_time', importance: 0.25, rank: 2, stability: 0.85 },
                { feature: 'engagement_level', importance: 0.2, rank: 3, stability: 0.8 }
              ],
              calibration: {
                calibrated: true,
                brier_score: 0.15,
                reliability: 0.92,
                resolution: 0.18
              },
              fairness: {
                demographic_parity: 0.95,
                equalized_odds: 0.93,
                calibration_equity: 0.91,
                individual_fairness: 0.89
              }
            }
          },
          results: {
            predictions: [
              {
                timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                predicted_value: 82.5,
                confidence: { lower: 78.2, upper: 86.8, level: 0.95 }
              },
              {
                timestamp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                predicted_value: 84.1,
                confidence: { lower: 79.5, upper: 88.7, level: 0.95 }
              },
              {
                timestamp: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                predicted_value: 85.3,
                confidence: { lower: 80.1, upper: 90.5, level: 0.95 }
              },
              {
                timestamp: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
                predicted_value: 86.0,
                confidence: { lower: 80.8, upper: 91.2, level: 0.95 }
              }
            ],
            summary: {
              mean_prediction: 84.5,
              median_prediction: 84.7,
              std_prediction: 1.5,
              min_prediction: 82.5,
              max_prediction: 86.0,
              confidence_level: 0.95
            },
            distributions: [],
            scenarios: [
              {
                scenario: 'continued_engagement',
                probability: 0.7,
                prediction: 86.5,
                conditions: ['maintain_study_schedule', 'high_engagement'],
                implications: ['steady_improvement', 'goal_achievement']
              },
              {
                scenario: 'decreased_motivation',
                probability: 0.2,
                prediction: 79.2,
                conditions: ['irregular_study', 'low_engagement'],
                implications: ['performance_decline', 'intervention_needed']
              },
              {
                scenario: 'exceptional_progress',
                probability: 0.1,
                prediction: 90.1,
                conditions: ['increased_effort', 'optimal_conditions'],
                implications: ['accelerated_learning', 'advanced_content']
              }
            ]
          },
          uncertainty: {
            sources: [
              { source: 'model', description: 'Model prediction uncertainty', magnitude: 0.6, reducible: true },
              { source: 'data', description: 'Data quality uncertainty', magnitude: 0.3, reducible: true },
              { source: 'aleatory', description: 'Natural variability', magnitude: 0.4, reducible: false }
            ],
            quantification: {
              method: 'monte_carlo',
              iterations: 1000,
              convergence: true,
              intervals: [{ lower: 78.2, upper: 91.2, level: 0.95 }]
            },
            sensitivity: [],
            robustness: {
              perturbations: [],
              stability_score: 0.85,
              break_points: [],
              recommendations: ['增加数据量', '改进特征工程']
            }
          },
          explanation: {
            global_explanation: {
              model_behavior: 'The model primarily relies on historical performance trends, weighted by recent study patterns and engagement levels.',
              key_patterns: ['Performance tends to improve with consistent study habits', 'Engagement level strongly correlates with score improvements'],
              feature_relationships: [],
              decision_boundaries: []
            },
            local_explanations: [],
            counterfactuals: [],
            feature_attribution: []
          },
          monitoring: {
            drift_detection: {
              data_drift: [],
              concept_drift: [],
              prediction_drift: [],
              alerts: []
            },
            performance_monitoring: {
              live_metrics: [],
              degradation_detection: {
                detected: false,
                severity: 'none',
                metrics_affected: [],
                probable_causes: []
              },
              comparison: {
                baseline_model: 'previous_version',
                current_performance: 0.82,
                baseline_performance: 0.79,
                improvement: 0.03,
                significance: 0.95
              }
            },
            feedback_loop: {
              feedback_sources: [],
              integration_method: 'weighted_average',
              update_frequency: 'weekly',
              validation_process: 'cross_validation'
            },
            retraining_schedule: {
              frequency: 'monthly',
              triggers: [],
              data_requirements: [],
              validation_criteria: []
            }
          }
        }
      ],
      recommendations: [],
      experiments: [],
      performance: {} as PerformanceAnalytics,
      engagement: {} as EngagementAnalytics,
      learning: {} as LearningAnalytics,
      behavioral: {} as BehavioralAnalytics,
      cognitive: {} as CognitiveAnalytics,
      social: {} as SocialAnalytics,
      temporal: {} as TemporalAnalytics,
      comparative: {} as ComparativeAnalytics
    };

    setAnalyticsProfile(profile);
  };

  const loadInsights = async () => {
    // インサイト読み込み
  };

  const loadPredictions = async () => {
    // 予測読み込み
  };

  const loadExperiments = async () => {
    // 実験データ読み込み
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">学習分析データ読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!analyticsProfile) {
    return <div>データを読み込めませんでした</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <ParticleBackground particleCount={25} color="#3B82F6" speed={0.3} />
      
      {/* インサイト表示 */}
      {showInsight && (
        <AchievementToast
          achievement={{
            title: showInsight.title,
            description: showInsight.description,
            icon: '💡',
            rarity: 'epic'
          }}
          onClose={() => setShowInsight(null)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📊 学習分析ハブ
            </h1>
            <p className="text-lg text-gray-600">
              データドリブンな学習最適化インサイト
            </p>
          </div>

          {/* データ品質・プライバシー表示 */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <KidsCard title="🔒 プライバシー保護" icon="🛡️" color="green">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {analyticsProfile.dataCollection.consentStatus.learnerConsent && 
                     analyticsProfile.dataCollection.consentStatus.parentalConsent ? '✅' : '⚠️'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {analyticsProfile.dataCollection.privacy.anonymization.technique} 適用済
                  </div>
                </div>
              </KidsCard>

              <KidsCard title="📈 データ品質" icon="📊" color="blue">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {Math.round(analyticsProfile.dataCollection.quality.overall * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">総合品質スコア</div>
                </div>
              </KidsCard>

              <KidsCard title="🔬 実験参加" icon="🧪" color="purple">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {analyticsProfile.experiments.length}
                  </div>
                  <div className="text-sm text-gray-600">参加中の実験数</div>
                </div>
              </KidsCard>

              <KidsCard title="💡 インサイト" icon="🎯" color="yellow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {analyticsProfile.insights.length}
                  </div>
                  <div className="text-sm text-gray-600">生成されたインサイト</div>
                </div>
              </KidsCard>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
              <div className="flex space-x-2">
                {[
                  { key: 'overview', label: '📊 概要', icon: '📊' },
                  { key: 'performance', label: '📈 パフォーマンス', icon: '📈' },
                  { key: 'insights', label: '💡 インサイト', icon: '💡' },
                  { key: 'predictions', label: '🔮 予測', icon: '🔮' },
                  { key: 'experiments', label: '🧪 実験', icon: '🧪' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedTab === tab.key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 期間選択 */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                {[
                  { key: 'week', label: '1週間' },
                  { key: 'month', label: '1ヶ月' },
                  { key: 'quarter', label: '3ヶ月' },
                  { key: 'year', label: '1年間' }
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() => setDateRange(period.key as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      dateRange === period.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* データ品質詳細 */}
              <KidsCard title="📊 データ品質分析" icon="🔍" color="blue">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(analyticsProfile.dataCollection.quality)
                    .filter(([key]) => key !== 'overall' && key !== 'issues')
                    .map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            {key === 'completeness' ? '完全性' :
                             key === 'accuracy' ? '正確性' :
                             key === 'consistency' ? '一貫性' :
                             key === 'timeliness' ? '適時性' :
                             key === 'validity' ? '有効性' :
                             key === 'uniqueness' ? '一意性' : key}
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
              </KidsCard>

              {/* 最新インサイト */}
              <KidsCard title="💡 最新のインサイト" icon="🎯" color="yellow">
                <div className="space-y-4">
                  {analyticsProfile.insights.slice(0, 3).map((insight) => (
                    <HoverScaleCard
                      key={insight.insightId}
                      onClick={() => setShowInsight(insight)}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer bg-white hover:bg-yellow-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            insight.impact.magnitude === 'large' ? 'bg-red-100 text-red-800' :
                            insight.impact.magnitude === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {insight.impact.magnitude === 'large' ? '高インパクト' :
                             insight.impact.magnitude === 'medium' ? '中インパクト' : '低インパクト'}
                          </span>
                          <span className="text-xs text-gray-500">
                            信頼度: {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          分野: {insight.category.primary}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          クリックで詳細
                        </span>
                      </div>
                    </HoverScaleCard>
                  ))}
                </div>
              </KidsCard>
            </div>
          )}

          {/* 予測タブ */}
          {selectedTab === 'predictions' && (
            <div className="space-y-6">
              {analyticsProfile.predictions.map((prediction) => (
                <KidsCard key={prediction.predictionId} title="🔮 学習パフォーマンス予測" icon="📈" color="purple">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 予測グラフ */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">
                        {prediction.target.metric} - 今後{prediction.timeframe.horizon}{prediction.timeframe.unit}の予測
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📈</div>
                          <div className="text-lg font-bold text-purple-600 mb-2">
                            平均予測スコア: {prediction.results.summary.mean_prediction.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">
                            信頼区間: {prediction.results.predictions[0]?.confidence.lower.toFixed(1)}% - 
                            {prediction.results.predictions[0]?.confidence.upper.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 予測詳細 */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">週別予測</h4>
                        <div className="space-y-2">
                          {prediction.results.predictions.map((pred, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <span className="text-sm font-medium">
                                {index + 1}週間後
                              </span>
                              <div className="text-right">
                                <div className="font-bold text-purple-600">
                                  {pred.predicted_value.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-600">
                                  ±{((pred.confidence.upper - pred.confidence.lower) / 2).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">シナリオ分析</h4>
                        <div className="space-y-2">
                          {prediction.results.scenarios.map((scenario) => (
                            <div key={scenario.scenario} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  {scenario.scenario === 'continued_engagement' ? '継続的学習' :
                                   scenario.scenario === 'decreased_motivation' ? 'モチベーション低下' :
                                   '飛躍的成長'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  確率: {Math.round(scenario.probability * 100)}%
                                </span>
                              </div>
                              <div className="text-lg font-bold text-gray-800">
                                {scenario.prediction.toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* モデル性能 */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">予測モデル性能</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(prediction.model.performance.metrics).map(([metric, value]) => (
                        <div key={metric} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-800">
                            {typeof value === 'number' ? value.toFixed(3) : value}
                          </div>
                          <div className="text-xs text-gray-600">
                            {metric.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </KidsCard>
              ))}
            </div>
          )}

          {/* インサイトタブ */}
          {selectedTab === 'insights' && (
            <div className="space-y-6">
              {analyticsProfile.insights.map((insight) => (
                <KidsCard key={insight.insightId} title={insight.title} icon="💡" color="yellow">
                  <div className="space-y-4">
                    {/* インサイト概要 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <p className="text-gray-700 mb-4">{insight.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600">信頼度: </span>
                            <span className="font-medium">{Math.round(insight.confidence * 100)}%</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">インパクト: </span>
                            <span className={`font-medium ${
                              insight.impact.magnitude === 'large' ? 'text-red-600' :
                              insight.impact.magnitude === 'medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {insight.impact.magnitude === 'large' ? '大' :
                               insight.impact.magnitude === 'medium' ? '中' : '小'}
                            </span>
                          </div>
                        </div>

                        {/* 定量的インパクト */}
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-800 mb-2">予想される効果</h4>
                          <div className="text-sm text-yellow-700">
                            <div>現在値: {(insight.impact.quantified_impact.baseline * 100).toFixed(1)}%</div>
                            <div>予測値: {(insight.impact.quantified_impact.projected * 100).toFixed(1)}%</div>
                            <div>改善: +{((insight.impact.quantified_impact.projected - insight.impact.quantified_impact.baseline) * 100).toFixed(1)}ポイント</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">カテゴリ</h4>
                        <div className="space-y-2 mb-4">
                          <div className="text-sm">
                            <span className="text-gray-600">主分野: </span>
                            <span className="font-medium">{insight.category.primary}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">範囲: </span>
                            <span className="font-medium">{insight.category.scope}</span>
                          </div>
                        </div>

                        <h4 className="font-medium text-gray-800 mb-3">エビデンス品質</h4>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>内的妥当性</span>
                              <span>{Math.round(insight.evidence.quality.internal_validity * 100)}%</span>
                            </div>
                            <AnimatedProgress 
                              progress={insight.evidence.quality.internal_validity * 100}
                              color="yellow"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>外的妥当性</span>
                              <span>{Math.round(insight.evidence.quality.external_validity * 100)}%</span>
                            </div>
                            <AnimatedProgress 
                              progress={insight.evidence.quality.external_validity * 100}
                              color="yellow"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 推奨アクション */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">推奨アクション</h4>
                      <div className="space-y-3">
                        {insight.recommendations.map((rec) => (
                          <div key={rec.recommendationId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-800">{rec.action}</h5>
                              <div className="flex space-x-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {rec.priority === 'high' ? '高優先度' :
                                   rec.priority === 'medium' ? '中優先度' : '低優先度'}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {rec.effort} 労力
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.rationale}</p>
                            <div className="text-xs text-gray-500">
                              実装期間: {rec.timeline}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </KidsCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="📊"
        onClick={() => {
          // データエクスポート
          console.log('データエクスポート');
        }}
        tooltip="データエクスポート"
        color="blue"
        position="bottom-right"
      />
    </div>
  );
};

export default LearningAnalyticsHub;