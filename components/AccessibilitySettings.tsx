import React, { useState, useEffect, useCallback } from 'react';
import { KidsCard, KidsButton } from './ui/KidsUIComponents';
import { 
  SuccessAnimatedButton,
  AnimatedProgress,
  HoverScaleCard,
  SmileyRating
} from './ui/MicroInteractions';

/**
 * ⚙️ Accessibility Settings
 * 詳細なアクセシビリティ設定・カスタマイゼーション
 * リアルタイム変更・プレビュー機能付き設定インターフェース
 */

interface AccessibilitySettingsProps {
  userId: string;
  currentSettings: any;
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
}

interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: SettingItem[];
}

interface SettingItem {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'slider' | 'select' | 'color' | 'font' | 'number' | 'text' | 'multi-select';
  value: any;
  options?: SettingOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  preview?: boolean;
  impact?: 'low' | 'medium' | 'high';
  dependencies?: string[];
  conflictsWith?: string[];
}

interface SettingOption {
  value: any;
  label: string;
  description?: string;
  preview?: any;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  userId,
  currentSettings,
  onSettingsChange,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('visual');
  const [settings, setSettings] = useState<{ [key: string]: any }>(currentSettings);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);

  const categories: SettingsCategory[] = [
    {
      id: 'visual',
      name: '視覚設定',
      description: '表示・色・フォントの設定',
      icon: '👁️',
      settings: [
        {
          id: 'high_contrast',
          name: '高コントラスト',
          description: '文字と背景のコントラストを強化',
          type: 'toggle',
          value: settings.high_contrast || false,
          preview: true,
          impact: 'high'
        },
        {
          id: 'dark_mode',
          name: 'ダークモード',
          description: '暗い配色で目の負担を軽減',
          type: 'toggle',
          value: settings.dark_mode || false,
          preview: true,
          impact: 'medium'
        },
        {
          id: 'color_blindness_filter',
          name: '色覚サポート',
          description: '色覚に配慮した表示',
          type: 'select',
          value: settings.color_blindness_filter || 'none',
          options: [
            { value: 'none', label: 'なし' },
            { value: 'deuteranopia', label: '緑色弱' },
            { value: 'protanopia', label: '赤色弱' },
            { value: 'tritanopia', label: '青色弱' },
            { value: 'achromatopsia', label: '全色盲' }
          ],
          preview: true,
          impact: 'high'
        },
        {
          id: 'font_size',
          name: 'フォントサイズ',
          description: '文字の大きさを調整',
          type: 'slider',
          value: settings.font_size || 16,
          min: 12,
          max: 32,
          step: 1,
          unit: 'px',
          preview: true,
          impact: 'medium'
        },
        {
          id: 'font_family',
          name: 'フォント',
          description: '読みやすいフォントを選択',
          type: 'select',
          value: settings.font_family || 'default',
          options: [
            { value: 'default', label: 'デフォルト' },
            { value: 'dyslexia_friendly', label: 'ディスレクシア対応' },
            { value: 'sans_serif', label: 'サンセリフ' },
            { value: 'serif', label: 'セリフ' },
            { value: 'monospace', label: '等幅' }
          ],
          preview: true,
          impact: 'medium'
        },
        {
          id: 'line_height',
          name: '行間',
          description: '行と行の間隔を調整',
          type: 'slider',
          value: settings.line_height || 1.5,
          min: 1.0,
          max: 2.5,
          step: 0.1,
          preview: true,
          impact: 'low'
        },
        {
          id: 'letter_spacing',
          name: '文字間隔',
          description: '文字同士の間隔を調整',
          type: 'slider',
          value: settings.letter_spacing || 0,
          min: -0.1,
          max: 0.3,
          step: 0.01,
          unit: 'em',
          preview: true,
          impact: 'low'
        },
        {
          id: 'cursor_size',
          name: 'カーソルサイズ',
          description: 'マウスカーソルの大きさ',
          type: 'select',
          value: settings.cursor_size || 'medium',
          options: [
            { value: 'small', label: '小' },
            { value: 'medium', label: '中' },
            { value: 'large', label: '大' },
            { value: 'extra_large', label: '特大' }
          ],
          preview: true,
          impact: 'low'
        },
        {
          id: 'focus_indicator',
          name: 'フォーカス表示',
          description: 'フォーカスの見た目を強化',
          type: 'toggle',
          value: settings.focus_indicator || true,
          preview: true,
          impact: 'medium'
        },
        {
          id: 'reduced_motion',
          name: 'アニメーション軽減',
          description: '動きを抑えて見やすく',
          type: 'toggle',
          value: settings.reduced_motion || false,
          preview: true,
          impact: 'medium'
        }
      ]
    },
    {
      id: 'audio',
      name: '音声設定',
      description: '音声・サウンドの設定',
      icon: '🔊',
      settings: [
        {
          id: 'text_to_speech',
          name: '音声読み上げ',
          description: 'テキストを音声で読み上げ',
          type: 'toggle',
          value: settings.text_to_speech || false,
          impact: 'high'
        },
        {
          id: 'speech_rate',
          name: '読み上げ速度',
          description: '音声の速度を調整',
          type: 'slider',
          value: settings.speech_rate || 1.0,
          min: 0.5,
          max: 2.0,
          step: 0.1,
          dependencies: ['text_to_speech'],
          impact: 'medium'
        },
        {
          id: 'speech_pitch',
          name: '音声の高さ',
          description: '音声の高さを調整',
          type: 'slider',
          value: settings.speech_pitch || 1.0,
          min: 0.5,
          max: 2.0,
          step: 0.1,
          dependencies: ['text_to_speech'],
          impact: 'low'
        },
        {
          id: 'speech_volume',
          name: '音声の音量',
          description: '音声の音量を調整',
          type: 'slider',
          value: settings.speech_volume || 1.0,
          min: 0.0,
          max: 1.0,
          step: 0.1,
          dependencies: ['text_to_speech'],
          impact: 'medium'
        },
        {
          id: 'sound_effects',
          name: '効果音',
          description: '操作時の効果音を有効化',
          type: 'toggle',
          value: settings.sound_effects || true,
          impact: 'low'
        },
        {
          id: 'background_sounds',
          name: '背景音',
          description: '集中力向上のための背景音',
          type: 'select',
          value: settings.background_sounds || 'none',
          options: [
            { value: 'none', label: 'なし' },
            { value: 'white_noise', label: 'ホワイトノイズ' },
            { value: 'nature', label: '自然音' },
            { value: 'rain', label: '雨音' },
            { value: 'ocean', label: '海の音' }
          ],
          impact: 'low'
        },
        {
          id: 'captions',
          name: '字幕',
          description: '動画に字幕を表示',
          type: 'toggle',
          value: settings.captions || false,
          impact: 'high'
        },
        {
          id: 'caption_size',
          name: '字幕サイズ',
          description: '字幕の文字サイズ',
          type: 'select',
          value: settings.caption_size || 'medium',
          options: [
            { value: 'small', label: '小' },
            { value: 'medium', label: '中' },
            { value: 'large', label: '大' }
          ],
          dependencies: ['captions'],
          impact: 'medium'
        },
        {
          id: 'audio_descriptions',
          name: '音声解説',
          description: '画像や動画の音声解説',
          type: 'toggle',
          value: settings.audio_descriptions || false,
          impact: 'high'
        }
      ]
    },
    {
      id: 'motor',
      name: '操作設定',
      description: 'キーボード・マウスの設定',
      icon: '⌨️',
      settings: [
        {
          id: 'keyboard_navigation',
          name: 'キーボード操作',
          description: 'キーボードでの操作を有効化',
          type: 'toggle',
          value: settings.keyboard_navigation || true,
          impact: 'high'
        },
        {
          id: 'sticky_keys',
          name: 'スティッキーキー',
          description: '修飾キーの連続入力を不要に',
          type: 'toggle',
          value: settings.sticky_keys || false,
          impact: 'medium'
        },
        {
          id: 'slow_keys',
          name: 'スローキー',
          description: 'キーの長押しで入力',
          type: 'toggle',
          value: settings.slow_keys || false,
          impact: 'medium'
        },
        {
          id: 'bounce_keys',
          name: 'バウンスキー',
          description: '連続入力を制限',
          type: 'toggle',
          value: settings.bounce_keys || false,
          impact: 'medium'
        },
        {
          id: 'mouse_keys',
          name: 'マウスキー',
          description: 'テンキーでマウス操作',
          type: 'toggle',
          value: settings.mouse_keys || false,
          impact: 'medium'
        },
        {
          id: 'click_assist',
          name: 'クリック補助',
          description: 'クリック操作を補助',
          type: 'toggle',
          value: settings.click_assist || false,
          impact: 'medium'
        },
        {
          id: 'drag_assist',
          name: 'ドラッグ補助',
          description: 'ドラッグ操作を補助',
          type: 'toggle',
          value: settings.drag_assist || false,
          impact: 'medium'
        },
        {
          id: 'hover_time',
          name: 'ホバー時間',
          description: 'マウスホバーの反応時間',
          type: 'slider',
          value: settings.hover_time || 500,
          min: 0,
          max: 2000,
          step: 100,
          unit: 'ms',
          impact: 'low'
        },
        {
          id: 'double_click_time',
          name: 'ダブルクリック時間',
          description: 'ダブルクリックの間隔',
          type: 'slider',
          value: settings.double_click_time || 500,
          min: 200,
          max: 1000,
          step: 50,
          unit: 'ms',
          impact: 'low'
        },
        {
          id: 'target_size',
          name: 'ターゲットサイズ',
          description: 'ボタンやリンクの大きさ',
          type: 'select',
          value: settings.target_size || 'medium',
          options: [
            { value: 'small', label: '小（24px）' },
            { value: 'medium', label: '中（44px）' },
            { value: 'large', label: '大（64px）' }
          ],
          preview: true,
          impact: 'medium'
        }
      ]
    },
    {
      id: 'cognitive',
      name: '認知サポート',
      description: '理解・記憶を支援する設定',
      icon: '🧠',
      settings: [
        {
          id: 'simple_language',
          name: '簡単な言葉',
          description: 'わかりやすい言葉で説明',
          type: 'toggle',
          value: settings.simple_language || false,
          impact: 'high'
        },
        {
          id: 'reading_guide',
          name: '読書ガイド',
          description: '読んでいる行をハイライト',
          type: 'toggle',
          value: settings.reading_guide || false,
          preview: true,
          impact: 'medium'
        },
        {
          id: 'focus_mode',
          name: 'フォーカスモード',
          description: '注意をそらす要素を隠す',
          type: 'toggle',
          value: settings.focus_mode || false,
          preview: true,
          impact: 'medium'
        },
        {
          id: 'progress_indicators',
          name: '進捗表示',
          description: '学習の進捗を常に表示',
          type: 'toggle',
          value: settings.progress_indicators || true,
          impact: 'low'
        },
        {
          id: 'memory_aids',
          name: '記憶補助',
          description: '重要な情報を強調表示',
          type: 'toggle',
          value: settings.memory_aids || false,
          impact: 'medium'
        },
        {
          id: 'step_by_step',
          name: 'ステップバイステップ',
          description: '手順を一つずつ表示',
          type: 'toggle',
          value: settings.step_by_step || false,
          impact: 'medium'
        },
        {
          id: 'time_limits',
          name: '時間制限',
          description: '時間制限を延長または削除',
          type: 'select',
          value: settings.time_limits || 'normal',
          options: [
            { value: 'normal', label: '通常' },
            { value: 'extended', label: '延長' },
            { value: 'none', label: '制限なし' }
          ],
          impact: 'medium'
        },
        {
          id: 'confirmation_dialogs',
          name: '確認ダイアログ',
          description: '重要な操作で確認を求める',
          type: 'toggle',
          value: settings.confirmation_dialogs || false,
          impact: 'low'
        },
        {
          id: 'error_prevention',
          name: 'エラー防止',
          description: '入力エラーを事前に防止',
          type: 'toggle',
          value: settings.error_prevention || true,
          impact: 'medium'
        },
        {
          id: 'context_help',
          name: 'コンテキストヘルプ',
          description: '状況に応じたヘルプを表示',
          type: 'toggle',
          value: settings.context_help || false,
          impact: 'low'
        }
      ]
    },
    {
      id: 'learning',
      name: '学習設定',
      description: '学習体験をカスタマイズ',
      icon: '📚',
      settings: [
        {
          id: 'learning_style',
          name: '学習スタイル',
          description: '好みの学習方法を選択',
          type: 'select',
          value: settings.learning_style || 'mixed',
          options: [
            { value: 'visual', label: '視覚的' },
            { value: 'auditory', label: '聴覚的' },
            { value: 'kinesthetic', label: '体感的' },
            { value: 'reading', label: '読書的' },
            { value: 'mixed', label: '混合' }
          ],
          impact: 'high'
        },
        {
          id: 'difficulty_adaptation',
          name: '難易度調整',
          description: '自動的に難易度を調整',
          type: 'toggle',
          value: settings.difficulty_adaptation || true,
          impact: 'high'
        },
        {
          id: 'pacing',
          name: '学習ペース',
          description: '学習の進行速度',
          type: 'select',
          value: settings.pacing || 'adaptive',
          options: [
            { value: 'slow', label: 'ゆっくり' },
            { value: 'normal', label: '普通' },
            { value: 'fast', label: '速い' },
            { value: 'adaptive', label: '適応的' }
          ],
          impact: 'medium'
        },
        {
          id: 'repetition_support',
          name: '反復学習',
          description: '重要な内容を繰り返し学習',
          type: 'toggle',
          value: settings.repetition_support || true,
          impact: 'medium'
        },
        {
          id: 'visual_supports',
          name: '視覚的サポート',
          description: '図表やイラストを多用',
          type: 'toggle',
          value: settings.visual_supports || true,
          impact: 'medium'
        },
        {
          id: 'interactive_elements',
          name: 'インタラクティブ要素',
          description: '体験型の学習要素を増加',
          type: 'toggle',
          value: settings.interactive_elements || true,
          impact: 'medium'
        },
        {
          id: 'gamification',
          name: 'ゲーミフィケーション',
          description: 'ゲーム要素で学習を楽しく',
          type: 'toggle',
          value: settings.gamification || true,
          impact: 'low'
        },
        {
          id: 'break_reminders',
          name: '休憩リマインダー',
          description: '定期的な休憩を促す',
          type: 'toggle',
          value: settings.break_reminders || true,
          impact: 'low'
        },
        {
          id: 'motivation_support',
          name: 'モチベーション支援',
          description: '励ましや達成感を提供',
          type: 'toggle',
          value: settings.motivation_support || true,
          impact: 'medium'
        },
        {
          id: 'personalized_content',
          name: '個人化コンテンツ',
          description: '興味に基づいた内容を提供',
          type: 'toggle',
          value: settings.personalized_content || true,
          impact: 'high'
        }
      ]
    },
    {
      id: 'interface',
      name: 'インターフェース',
      description: '画面構成・レイアウト設定',
      icon: '🖥️',
      settings: [
        {
          id: 'layout',
          name: 'レイアウト',
          description: '画面の配置を選択',
          type: 'select',
          value: settings.layout || 'standard',
          options: [
            { value: 'standard', label: '標準' },
            { value: 'simplified', label: '簡潔' },
            { value: 'grid', label: 'グリッド' },
            { value: 'list', label: 'リスト' }
          ],
          preview: true,
          impact: 'medium'
        },
        {
          id: 'density',
          name: '情報密度',
          description: '画面の情報量を調整',
          type: 'select',
          value: settings.density || 'comfortable',
          options: [
            { value: 'compact', label: 'コンパクト' },
            { value: 'comfortable', label: '快適' },
            { value: 'spacious', label: 'ゆったり' }
          ],
          preview: true,
          impact: 'medium'
        },
        {
          id: 'navigation_style',
          name: 'ナビゲーション',
          description: 'メニューの表示方法',
          type: 'select',
          value: settings.navigation_style || 'sidebar',
          options: [
            { value: 'sidebar', label: 'サイドバー' },
            { value: 'top', label: 'トップメニュー' },
            { value: 'bottom', label: 'ボトムメニュー' },
            { value: 'hidden', label: '隠しメニュー' }
          ],
          preview: true,
          impact: 'medium'
        },
        {
          id: 'breadcrumbs',
          name: 'パンくずリスト',
          description: '現在位置を表示',
          type: 'toggle',
          value: settings.breadcrumbs || true,
          impact: 'low'
        },
        {
          id: 'skip_links',
          name: 'スキップリンク',
          description: 'メインコンテンツへのショートカット',
          type: 'toggle',
          value: settings.skip_links || true,
          impact: 'medium'
        },
        {
          id: 'search_enhancement',
          name: '検索機能強化',
          description: '高度な検索機能を提供',
          type: 'toggle',
          value: settings.search_enhancement || false,
          impact: 'low'
        },
        {
          id: 'quick_actions',
          name: 'クイックアクション',
          description: 'よく使う機能へのショートカット',
          type: 'toggle',
          value: settings.quick_actions || true,
          impact: 'low'
        },
        {
          id: 'status_indicators',
          name: 'ステータス表示',
          description: 'システムの状態を表示',
          type: 'toggle',
          value: settings.status_indicators || true,
          impact: 'low'
        },
        {
          id: 'toolbar_customization',
          name: 'ツールバーカスタマイズ',
          description: 'ツールバーの内容を変更',
          type: 'toggle',
          value: settings.toolbar_customization || false,
          impact: 'low'
        },
        {
          id: 'theme',
          name: 'テーマ',
          description: '全体的な見た目を選択',
          type: 'select',
          value: settings.theme || 'default',
          options: [
            { value: 'default', label: 'デフォルト' },
            { value: 'colorful', label: 'カラフル' },
            { value: 'minimal', label: 'ミニマル' },
            { value: 'child_friendly', label: '子供向け' }
          ],
          preview: true,
          impact: 'medium'
        }
      ]
    }
  ];

  useEffect(() => {
    const hasAnyChanges = Object.keys(settings).some(key => 
      settings[key] !== currentSettings[key]
    );
    setHasChanges(hasAnyChanges);
  }, [settings, currentSettings]);

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));

    // リアルタイムプレビュー
    if (previewMode) {
      applySettingPreview(settingId, value);
    }
  };

  const applySettingPreview = (settingId: string, value: any) => {
    const root = document.documentElement;
    
    switch (settingId) {
      case 'high_contrast':
        root.classList.toggle('high-contrast', value);
        break;
      case 'dark_mode':
        root.classList.toggle('dark-mode', value);
        break;
      case 'font_size':
        root.style.setProperty('--font-size-base', `${value}px`);
        break;
      case 'reduced_motion':
        root.classList.toggle('reduced-motion', value);
        break;
      // 他の設定も同様に実装
    }
  };

  const handleSaveSettings = () => {
    onSettingsChange(settings);
    setHasChanges(false);
    // 成功メッセージを表示
    showSuccessMessage('設定が保存されました');
  };

  const handleResetSettings = () => {
    setSettings(getDefaultSettings());
    setHasChanges(true);
    setResetDialogOpen(false);
  };

  const handleTestSettings = () => {
    setTestMode(true);
    // テスト用の一時的な設定を適用
    applyTestSettings();
    
    // 30秒後にテストモードを自動終了
    setTimeout(() => {
      setTestMode(false);
      applySettings(settings);
    }, 30000);
  };

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-settings-${userId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setHasChanges(true);
          setImportDialogOpen(false);
          showSuccessMessage('設定をインポートしました');
        } catch (error) {
          showErrorMessage('設定ファイルの読み込みに失敗しました');
        }
      };
      reader.readAsText(file);
    }
  };

  const isSettingEnabled = (setting: SettingItem): boolean => {
    if (!setting.dependencies) return true;
    
    return setting.dependencies.every(dep => settings[dep] === true);
  };

  const hasConflicts = (setting: SettingItem): boolean => {
    if (!setting.conflictsWith) return false;
    
    return setting.conflictsWith.some(conflict => settings[conflict] === true);
  };

  const getActiveCategory = () => {
    return categories.find(cat => cat.id === activeCategory);
  };

  const showSuccessMessage = (message: string) => {
    // 成功メッセージの表示実装
    console.log('Success:', message);
  };

  const showErrorMessage = (message: string) => {
    // エラーメッセージの表示実装
    console.error('Error:', message);
  };

  const applyTestSettings = () => {
    // テスト用設定の適用実装
  };

  const applySettings = (settingsToApply: any) => {
    // 設定の適用実装
  };

  const getDefaultSettings = () => {
    // デフォルト設定の取得実装
    return {};
  };

  return (
    <div className="accessibility-settings" role="dialog" aria-labelledby="settings-title">
      <div className="settings-header">
        <h1 id="settings-title">⚙️ アクセシビリティ設定</h1>
        <div className="settings-actions">
          <KidsButton 
            onClick={() => setPreviewMode(!previewMode)}
            variant={previewMode ? 'primary' : 'secondary'}
            aria-pressed={previewMode}
          >
            {previewMode ? 'プレビュー中' : 'プレビュー'}
          </KidsButton>
          <KidsButton onClick={handleTestSettings} disabled={testMode}>
            {testMode ? 'テスト中...' : '30秒テスト'}
          </KidsButton>
          <KidsButton onClick={onClose} variant="secondary">
            閉じる
          </KidsButton>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav" role="navigation" aria-label="設定カテゴリ">
            {categories.map(category => (
              <button
                key={category.id}
                className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                aria-current={activeCategory === category.id ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">{category.icon}</span>
                <span className="nav-text">{category.name}</span>
              </button>
            ))}
          </nav>

          <div className="settings-actions-sidebar">
            <KidsButton 
              onClick={() => setResetDialogOpen(true)}
              variant="secondary"
              className="action-button"
            >
              リセット
            </KidsButton>
            <KidsButton 
              onClick={() => setImportDialogOpen(true)}
              variant="secondary"
              className="action-button"
            >
              インポート
            </KidsButton>
            <KidsButton 
              onClick={() => setExportDialogOpen(true)}
              variant="secondary"
              className="action-button"
            >
              エクスポート
            </KidsButton>
          </div>
        </div>

        <div className="settings-main">
          {getActiveCategory() && (
            <div className="category-content">
              <div className="category-header">
                <h2>{getActiveCategory()?.name}</h2>
                <p>{getActiveCategory()?.description}</p>
              </div>

              <div className="settings-grid">
                {getActiveCategory()?.settings.map(setting => (
                  <SettingControl
                    key={setting.id}
                    setting={setting}
                    value={settings[setting.id]}
                    onChange={(value) => handleSettingChange(setting.id, value)}
                    disabled={!isSettingEnabled(setting)}
                    hasConflict={hasConflicts(setting)}
                    preview={previewMode && setting.preview}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <div className="settings-status">
          {hasChanges && (
            <span className="changes-indicator">
              未保存の変更があります
            </span>
          )}
          {testMode && (
            <span className="test-mode-indicator">
              テストモード（残り時間: {/* カウントダウン */}）
            </span>
          )}
        </div>
        <div className="settings-buttons">
          <KidsButton 
            onClick={handleResetSettings}
            variant="secondary"
            disabled={!hasChanges}
          >
            変更を破棄
          </KidsButton>
          <KidsButton 
            onClick={handleSaveSettings}
            variant="primary"
            disabled={!hasChanges}
          >
            保存
          </KidsButton>
        </div>
      </div>

      {/* 確認ダイアログ */}
      {resetDialogOpen && (
        <ConfirmationDialog
          title="設定をリセット"
          message="すべての設定をデフォルトに戻しますか？"
          onConfirm={handleResetSettings}
          onCancel={() => setResetDialogOpen(false)}
        />
      )}

      {importDialogOpen && (
        <ImportDialog
          onImport={handleImportSettings}
          onCancel={() => setImportDialogOpen(false)}
        />
      )}

      {exportDialogOpen && (
        <ExportDialog
          onExport={handleExportSettings}
          onCancel={() => setExportDialogOpen(false)}
        />
      )}
    </div>
  );
};

// 設定コントロールコンポーネント
interface SettingControlProps {
  setting: SettingItem;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  hasConflict?: boolean;
  preview?: boolean;
}

const SettingControl: React.FC<SettingControlProps> = ({
  setting,
  value,
  onChange,
  disabled = false,
  hasConflict = false,
  preview = false
}) => {
  const renderControl = () => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="toggle-control">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              aria-describedby={`${setting.id}-description`}
            />
            <span className="toggle-slider" aria-hidden="true"></span>
          </label>
        );

      case 'slider':
        return (
          <div className="slider-control">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              disabled={disabled}
              aria-describedby={`${setting.id}-description`}
            />
            <div className="slider-value">
              {value}{setting.unit}
            </div>
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            aria-describedby={`${setting.id}-description`}
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            aria-describedby={`${setting.id}-description`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            min={setting.min}
            max={setting.max}
            step={setting.step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            aria-describedby={`${setting.id}-description`}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            aria-describedby={`${setting.id}-description`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <HoverScaleCard className={`setting-control ${disabled ? 'disabled' : ''} ${hasConflict ? 'conflict' : ''}`}>
      <div className="setting-header">
        <h3 className="setting-name">{setting.name}</h3>
        {setting.impact && (
          <span className={`setting-impact impact-${setting.impact}`}>
            {setting.impact === 'high' ? '高' : setting.impact === 'medium' ? '中' : '低'}
          </span>
        )}
      </div>
      
      <p id={`${setting.id}-description`} className="setting-description">
        {setting.description}
      </p>
      
      <div className="setting-control-wrapper">
        {renderControl()}
      </div>
      
      {preview && (
        <div className="setting-preview">
          <span className="preview-indicator">プレビュー適用中</span>
        </div>
      )}
      
      {hasConflict && (
        <div className="setting-conflict">
          <span className="conflict-indicator">他の設定と競合しています</span>
        </div>
      )}
      
      {disabled && setting.dependencies && (
        <div className="setting-dependency">
          <span className="dependency-indicator">
            「{setting.dependencies.join('、')}」を有効にしてください
          </span>
        </div>
      )}
    </HoverScaleCard>
  );
};

// 確認ダイアログコンポーネント
interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="dialog-overlay" role="dialog" aria-labelledby="dialog-title">
      <div className="dialog-content">
        <h2 id="dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <KidsButton onClick={onCancel} variant="secondary">
            キャンセル
          </KidsButton>
          <KidsButton onClick={onConfirm} variant="primary">
            実行
          </KidsButton>
        </div>
      </div>
    </div>
  );
};

// インポートダイアログコンポーネント
interface ImportDialogProps {
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ onImport, onCancel }) => {
  return (
    <div className="dialog-overlay" role="dialog" aria-labelledby="import-title">
      <div className="dialog-content">
        <h2 id="import-title">設定をインポート</h2>
        <p>以前エクスポートした設定ファイルを選択してください。</p>
        <input
          type="file"
          accept=".json"
          onChange={onImport}
          aria-label="設定ファイルを選択"
        />
        <div className="dialog-actions">
          <KidsButton onClick={onCancel} variant="secondary">
            キャンセル
          </KidsButton>
        </div>
      </div>
    </div>
  );
};

// エクスポートダイアログコンポーネント
interface ExportDialogProps {
  onExport: () => void;
  onCancel: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ onExport, onCancel }) => {
  return (
    <div className="dialog-overlay" role="dialog" aria-labelledby="export-title">
      <div className="dialog-content">
        <h2 id="export-title">設定をエクスポート</h2>
        <p>現在の設定をファイルに保存します。</p>
        <div className="dialog-actions">
          <KidsButton onClick={onCancel} variant="secondary">
            キャンセル
          </KidsButton>
          <KidsButton onClick={onExport} variant="primary">
            エクスポート
          </KidsButton>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
export type { SettingsCategory, SettingItem, SettingOption };