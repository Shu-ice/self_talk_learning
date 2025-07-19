// Responsive Design Utilities for Multi-Device Support
// デバイス別の最適な学習体験を提供するためのユーティリティ

// デバイス種別の判定
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

// レスポンシブブレークポイント
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
} as const;

// デバイス検出クラス
export class DeviceDetector {
  private static instance: DeviceDetector;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): DeviceDetector {
    if (!DeviceDetector.instance) {
      DeviceDetector.instance = new DeviceDetector();
    }
    return DeviceDetector.instance;
  }

  // イベントリスナーの設定
  private setupEventListeners(): void {
    // 画面サイズ変更の監視
    window.addEventListener('resize', () => {
      this.emit('device-changed', this.getDeviceInfo());
    });

    // 向きの変更監視
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.emit('orientation-changed', this.getOrientation());
      }, 100);
    });

    // タッチイベントの監視
    if (this.supportsTouchInput()) {
      document.addEventListener('touchstart', () => {
        this.emit('touch-detected', true);
      }, { once: true });
    }
  }

  // デバイス種別の取得
  public getDeviceType(): DeviceType {
    const width = window.innerWidth;
    
    if (width < BREAKPOINTS.mobile) {
      return 'mobile';
    } else if (width < BREAKPOINTS.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // 画面の向きを取得
  public getOrientation(): Orientation {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // デバイス情報の取得
  public getDeviceInfo() {
    return {
      type: this.getDeviceType(),
      orientation: this.getOrientation(),
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      hasTouch: this.supportsTouchInput(),
      hasMouse: this.supportsMouseInput(),
      hasKeyboard: this.supportsKeyboard(),
      userAgent: navigator.userAgent
    };
  }

  // タッチ入力のサポート確認
  public supportsTouchInput(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // マウス入力のサポート確認
  public supportsMouseInput(): boolean {
    return window.matchMedia('(pointer: fine)').matches;
  }

  // キーボードのサポート確認
  public supportsKeyboard(): boolean {
    return !this.isMobileDevice() || window.matchMedia('(pointer: fine)').matches;
  }

  // モバイルデバイスかどうかの判定
  public isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // タブレットかどうかの判定
  public isTablet(): boolean {
    return /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent) && this.supportsTouchInput();
  }

  // デスクトップかどうかの判定
  public isDesktop(): boolean {
    return !this.isMobileDevice() && !this.isTablet();
  }

  // イベントリスナーの登録
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // イベントの発火
  private emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

// UI適応化クラス
export class ResponsiveUIAdapter {
  private deviceDetector: DeviceDetector;

  constructor() {
    this.deviceDetector = DeviceDetector.getInstance();
  }

  // チャットUIの適応化
  public adaptChatInterface(): {
    messageMaxWidth: string;
    inputHeight: string;
    containerPadding: string;
    showAdvancedFeatures: boolean;
    attachmentButtonSize: string;
  } {
    const deviceType = this.deviceDetector.getDeviceType();
    const orientation = this.deviceDetector.getOrientation();
    
    switch (deviceType) {
      case 'mobile':
        return {
          messageMaxWidth: '100%',
          inputHeight: orientation === 'landscape' ? '60px' : '80px',
          containerPadding: '8px',
          showAdvancedFeatures: false,
          attachmentButtonSize: '40px'
        };
        
      case 'tablet':
        return {
          messageMaxWidth: '90%',
          inputHeight: '70px',
          containerPadding: '16px',
          showAdvancedFeatures: orientation === 'landscape',
          attachmentButtonSize: '48px'
        };
        
      case 'desktop':
      default:
        return {
          messageMaxWidth: '80%',
          inputHeight: '60px',
          containerPadding: '24px',
          showAdvancedFeatures: true,
          attachmentButtonSize: '44px'
        };
    }
  }

  // 手書きキャンバスの適応化
  public adaptHandwritingCanvas(): {
    width: number;
    height: number;
    strokeWidth: number;
    toolbarPosition: 'top' | 'bottom' | 'side';
  } {
    const deviceType = this.deviceDetector.getDeviceType();
    const { width, height } = this.deviceDetector.getDeviceInfo();
    
    switch (deviceType) {
      case 'mobile':
        return {
          width: Math.min(width - 32, 360),
          height: Math.min(height * 0.4, 240),
          strokeWidth: 3,
          toolbarPosition: 'bottom'
        };
        
      case 'tablet':
        return {
          width: Math.min(width * 0.8, 600),
          height: Math.min(height * 0.5, 400),
          strokeWidth: 2.5,
          toolbarPosition: 'top'
        };
        
      case 'desktop':
      default:
        return {
          width: 400,
          height: 300,
          strokeWidth: 2,
          toolbarPosition: 'side'
        };
    }
  }

  // ダッシュボードレイアウトの適応化
  public adaptDashboardLayout(): {
    columns: number;
    cardSpacing: string;
    showDetailedStats: boolean;
    chartHeight: number;
  } {
    const deviceType = this.deviceDetector.getDeviceType();
    const orientation = this.deviceDetector.getOrientation();
    
    switch (deviceType) {
      case 'mobile':
        return {
          columns: 1,
          cardSpacing: '12px',
          showDetailedStats: false,
          chartHeight: 150
        };
        
      case 'tablet':
        return {
          columns: orientation === 'landscape' ? 3 : 2,
          cardSpacing: '16px',
          showDetailedStats: orientation === 'landscape',
          chartHeight: 200
        };
        
      case 'desktop':
      default:
        return {
          columns: 4,
          cardSpacing: '24px',
          showDetailedStats: true,
          chartHeight: 250
        };
    }
  }

  // 音声入力UIの適応化
  public adaptVoiceInput(): {
    buttonSize: string;
    showVisualFeedback: boolean;
    microphonePosition: 'floating' | 'inline';
    showTranscriptPreview: boolean;
  } {
    const deviceType = this.deviceDetector.getDeviceType();
    
    switch (deviceType) {
      case 'mobile':
        return {
          buttonSize: '56px',
          showVisualFeedback: true,
          microphonePosition: 'floating',
          showTranscriptPreview: false
        };
        
      case 'tablet':
        return {
          buttonSize: '52px',
          showVisualFeedback: true,
          microphonePosition: 'inline',
          showTranscriptPreview: true
        };
        
      case 'desktop':
      default:
        return {
          buttonSize: '48px',
          showVisualFeedback: false,
          microphonePosition: 'inline',
          showTranscriptPreview: true
        };
    }
  }

  // ファイルアップロードUIの適応化
  public adaptFileUpload(): {
    dragDropArea: boolean;
    thumbnailSize: number;
    maxFiles: number;
    compressionQuality: number;
  } {
    const deviceType = this.deviceDetector.getDeviceType();
    
    switch (deviceType) {
      case 'mobile':
        return {
          dragDropArea: false,
          thumbnailSize: 60,
          maxFiles: 2,
          compressionQuality: 0.7
        };
        
      case 'tablet':
        return {
          dragDropArea: true,
          thumbnailSize: 80,
          maxFiles: 3,
          compressionQuality: 0.8
        };
        
      case 'desktop':
      default:
        return {
          dragDropArea: true,
          thumbnailSize: 100,
          maxFiles: 5,
          compressionQuality: 0.9
        };
    }
  }

  // ナビゲーションの適応化
  public adaptNavigation(): {
    layout: 'bottom-tabs' | 'side-drawer' | 'top-bar';
    showLabels: boolean;
    iconSize: string;
    collapsible: boolean;
  } {
    const deviceType = this.deviceDetector.getDeviceType();
    const orientation = this.deviceDetector.getOrientation();
    
    switch (deviceType) {
      case 'mobile':
        return {
          layout: 'bottom-tabs',
          showLabels: orientation === 'portrait',
          iconSize: '24px',
          collapsible: false
        };
        
      case 'tablet':
        return {
          layout: orientation === 'landscape' ? 'side-drawer' : 'bottom-tabs',
          showLabels: true,
          iconSize: '28px',
          collapsible: orientation === 'landscape'
        };
        
      case 'desktop':
      default:
        return {
          layout: 'top-bar',
          showLabels: true,
          iconSize: '20px',
          collapsible: true
        };
    }
  }
}

// タッチジェスチャー処理クラス
export class TouchGestureHandler {
  private element: HTMLElement;
  private listeners: Map<string, Function[]> = new Map();
  private touchState: {
    startX: number;
    startY: number;
    startTime: number;
    isSwipe: boolean;
    isPinch: boolean;
  } = {
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwipe: false,
    isPinch: false
  };

  constructor(element: HTMLElement) {
    this.element = element;
    this.setupGestureListeners();
  }

  // ジェスチャーリスナーの設定
  private setupGestureListeners(): void {
    // タッチ開始
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    
    // タッチ移動
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    
    // タッチ終了
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    
    // タッチキャンセル
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  // タッチ開始処理
  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.touchState = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        isSwipe: false,
        isPinch: false
      };
    } else if (event.touches.length === 2) {
      this.touchState.isPinch = true;
      this.emit('pinch-start', { touches: event.touches });
    }
  }

  // タッチ移動処理
  private handleTouchMove(event: TouchEvent): void {
    if (this.touchState.isPinch && event.touches.length === 2) {
      this.emit('pinch-move', { touches: event.touches });
      event.preventDefault();
      return;
    }

    if (event.touches.length === 1 && !this.touchState.isSwipe) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.touchState.startX;
      const deltaY = touch.clientY - this.touchState.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 10) { // スワイプの閾値
        this.touchState.isSwipe = true;
        this.emit('swipe-start', { deltaX, deltaY });
      }
    }

    if (this.touchState.isSwipe) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.touchState.startX;
      const deltaY = touch.clientY - this.touchState.startY;
      this.emit('swipe-move', { deltaX, deltaY });
    }
  }

  // タッチ終了処理
  private handleTouchEnd(event: TouchEvent): void {
    if (this.touchState.isPinch) {
      this.emit('pinch-end', {});
      this.touchState.isPinch = false;
      return;
    }

    if (this.touchState.isSwipe) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - this.touchState.startX;
      const deltaY = touch.clientY - this.touchState.startY;
      const duration = Date.now() - this.touchState.startTime;
      
      // スワイプ方向の判定
      const direction = this.getSwipeDirection(deltaX, deltaY);
      
      this.emit('swipe-end', { 
        direction, 
        deltaX, 
        deltaY, 
        duration,
        velocity: Math.sqrt(deltaX * deltaX + deltaY * deltaY) / duration
      });
    } else {
      // タップの判定
      const duration = Date.now() - this.touchState.startTime;
      if (duration < 300) { // タップの閾値
        this.emit('tap', { 
          x: this.touchState.startX, 
          y: this.touchState.startY 
        });
      }
    }

    this.touchState.isSwipe = false;
  }

  // タッチキャンセル処理
  private handleTouchCancel(event: TouchEvent): void {
    this.touchState.isSwipe = false;
    this.touchState.isPinch = false;
  }

  // スワイプ方向の取得
  private getSwipeDirection(deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  // イベントリスナーの登録
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // イベントの発火
  private emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // ジェスチャー処理の破棄
  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.listeners.clear();
  }
}

// キーボードショートカット処理クラス
export class KeyboardShortcutHandler {
  private shortcuts: Map<string, Function> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.setupKeyboardListener();
  }

  // キーボードリスナーの設定
  private setupKeyboardListener(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // キーダウン処理
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = this.getKeyString(event);
    const handler = this.shortcuts.get(key);
    
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  }

  // キー文字列の取得
  private getKeyString(event: KeyboardEvent): string {
    const parts = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }

  // ショートカットの登録
  public register(keys: string, handler: Function): void {
    this.shortcuts.set(keys.toLowerCase(), handler);
  }

  // ショートカットの削除
  public unregister(keys: string): void {
    this.shortcuts.delete(keys.toLowerCase());
  }

  // ショートカット機能の有効/無効切り替え
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // デフォルトショートカットの設定
  public setupDefaultShortcuts(): void {
    // 学習開始
    this.register('ctrl+enter', () => {
      console.log('Quick start learning session');
    });

    // 音声入力切り替え
    this.register('ctrl+shift+v', () => {
      console.log('Toggle voice input');
    });

    // ダッシュボード表示
    this.register('ctrl+d', () => {
      console.log('Show dashboard');
    });

    // ヘルプ表示
    this.register('f1', () => {
      console.log('Show help');
    });
  }
}

// シングルトンインスタンス
export const deviceDetector = DeviceDetector.getInstance();
export const responsiveUIAdapter = new ResponsiveUIAdapter();
export const keyboardShortcutHandler = new KeyboardShortcutHandler();