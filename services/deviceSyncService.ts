// Device Synchronization Service
// マルチデバイス間でのデータ同期を管理

import { LearnerProfile, UserProgress } from '../types';

// 同期可能なデータタイプ
export type SyncDataType = 'profile' | 'progress' | 'sessions' | 'achievements';

// 同期ステータス
export interface SyncStatus {
  lastSyncAt: string;
  deviceId: string;
  syncVersion: number;
  conflicts: SyncConflict[];
  pendingChanges: PendingChange[];
}

// 同期コンフリクト
export interface SyncConflict {
  id: string;
  dataType: SyncDataType;
  field: string;
  localValue: any;
  remoteValue: any;
  timestamp: string;
  resolution?: 'local' | 'remote' | 'merge';
}

// 保留中の変更
export interface PendingChange {
  id: string;
  dataType: SyncDataType;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  synced: boolean;
}

// デバイス情報
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'tablet' | 'mobile';
  platform: string;
  lastActiveAt: string;
  capabilities: {
    hasCamera: boolean;
    hasMicrophone: boolean;
    supportsTouchInput: boolean;
    supportsHandwriting: boolean;
  };
}

class DeviceSyncService {
  private deviceId: string;
  private syncInterval: number = 30000; // 30秒
  private isOnline: boolean = navigator.onLine;
  private syncTimer: number | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.deviceId = this.generateOrGetDeviceId();
    this.setupNetworkListeners();
    this.setupVisibilityChangeListener();
    this.startAutoSync();
  }

  // デバイスIDの生成または取得
  private generateOrGetDeviceId(): string {
    let deviceId = localStorage.getItem('ai-learning-device-id');
    
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ai-learning-device-id', deviceId);
    }
    
    return deviceId;
  }

  // ネットワーク状態の監視
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('[Sync] Network back online, starting sync');
      this.isOnline = true;
      this.performFullSync();
      this.emit('network-status-changed', { online: true });
    });

    window.addEventListener('offline', () => {
      console.log('[Sync] Network offline, enabling offline mode');
      this.isOnline = false;
      this.emit('network-status-changed', { online: false });
    });
  }

  // ページの可視性変更の監視
  private setupVisibilityChangeListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        console.log('[Sync] Page became visible, checking for updates');
        this.performFullSync();
      }
    });
  }

  // 自動同期の開始
  private startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = window.setInterval(() => {
      if (this.isOnline) {
        this.performIncrementalSync();
      }
    }, this.syncInterval);
  }

  // 完全同期の実行
  public async performFullSync(): Promise<void> {
    try {
      console.log('[Sync] Starting full sync');
      this.emit('sync-started', { type: 'full' });

      // 各データタイプを順次同期
      await this.syncProfile();
      await this.syncProgress();
      await this.syncSessions();
      await this.syncAchievements();

      // 同期ステータスを更新
      await this.updateSyncStatus();

      console.log('[Sync] Full sync completed');
      this.emit('sync-completed', { type: 'full', success: true });

    } catch (error) {
      console.error('[Sync] Full sync failed:', error);
      this.emit('sync-failed', { type: 'full', error: error.message });
    }
  }

  // 増分同期の実行
  public async performIncrementalSync(): Promise<void> {
    try {
      const pendingChanges = await this.getPendingChanges();
      
      if (pendingChanges.length === 0) {
        return; // 変更がない場合は何もしない
      }

      console.log(`[Sync] Starting incremental sync (${pendingChanges.length} changes)`);
      this.emit('sync-started', { type: 'incremental', changeCount: pendingChanges.length });

      // 保留中の変更を同期
      for (const change of pendingChanges) {
        await this.syncPendingChange(change);
      }

      console.log('[Sync] Incremental sync completed');
      this.emit('sync-completed', { type: 'incremental', success: true });

    } catch (error) {
      console.error('[Sync] Incremental sync failed:', error);
      this.emit('sync-failed', { type: 'incremental', error: error.message });
    }
  }

  // プロフィール同期
  private async syncProfile(): Promise<void> {
    const localProfile = this.getLocalData<LearnerProfile>('learnerProfile');
    
    if (!localProfile) return;

    try {
      // リモートからプロフィールデータを取得
      const remoteProfile = await this.fetchRemoteData<LearnerProfile>('profile');
      
      if (remoteProfile) {
        // コンフリクトチェック
        const conflicts = this.detectConflicts(localProfile, remoteProfile, 'profile');
        
        if (conflicts.length > 0) {
          // コンフリクトがある場合は解決処理
          const resolvedProfile = await this.resolveConflicts(conflicts, localProfile, remoteProfile);
          this.saveLocalData('learnerProfile', resolvedProfile);
          await this.pushToRemote('profile', resolvedProfile);
        } else if (localProfile.updatedAt > remoteProfile.updatedAt) {
          // ローカルが新しい場合はリモートを更新
          await this.pushToRemote('profile', localProfile);
        } else if (remoteProfile.updatedAt > localProfile.updatedAt) {
          // リモートが新しい場合はローカルを更新
          this.saveLocalData('learnerProfile', remoteProfile);
        }
      } else {
        // リモートにデータがない場合は新規作成
        await this.pushToRemote('profile', localProfile);
      }
    } catch (error) {
      console.error('[Sync] Profile sync failed:', error);
      throw error;
    }
  }

  // 学習進捗同期
  private async syncProgress(): Promise<void> {
    const localProgress = this.getLocalData<UserProgress>('userProgress');
    
    if (!localProgress) return;

    try {
      const remoteProgress = await this.fetchRemoteData<UserProgress>('progress');
      
      if (remoteProgress) {
        // 進捗データのマージ処理
        const mergedProgress = this.mergeProgress(localProgress, remoteProgress);
        
        this.saveLocalData('userProgress', mergedProgress);
        await this.pushToRemote('progress', mergedProgress);
      } else {
        await this.pushToRemote('progress', localProgress);
      }
    } catch (error) {
      console.error('[Sync] Progress sync failed:', error);
      throw error;
    }
  }

  // セッション録画同期
  private async syncSessions(): Promise<void> {
    const localSessions = this.getLocalData('sessionRecordings') || [];
    
    try {
      // 新しいセッションのみをアップロード
      const unsyncedSessions = localSessions.filter((session: any) => !session.synced);
      
      for (const session of unsyncedSessions) {
        await this.pushToRemote('sessions', session);
        session.synced = true;
      }
      
      if (unsyncedSessions.length > 0) {
        this.saveLocalData('sessionRecordings', localSessions);
      }
    } catch (error) {
      console.error('[Sync] Sessions sync failed:', error);
      throw error;
    }
  }

  // 実績同期
  private async syncAchievements(): Promise<void> {
    const localAchievements = this.getLocalData('achievements') || [];
    
    try {
      const remoteAchievements = await this.fetchRemoteData('achievements') || [];
      
      // 実績をマージ（重複排除）
      const mergedAchievements = this.mergeAchievements(localAchievements, remoteAchievements);
      
      this.saveLocalData('achievements', mergedAchievements);
      await this.pushToRemote('achievements', mergedAchievements);
    } catch (error) {
      console.error('[Sync] Achievements sync failed:', error);
      throw error;
    }
  }

  // ローカルデータの取得
  private getLocalData<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`ai-learning-${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`[Sync] Failed to get local data for ${key}:`, error);
      return null;
    }
  }

  // ローカルデータの保存
  private saveLocalData(key: string, data: any): void {
    try {
      localStorage.setItem(`ai-learning-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`[Sync] Failed to save local data for ${key}:`, error);
    }
  }

  // リモートデータの取得
  private async fetchRemoteData<T>(dataType: string): Promise<T | null> {
    if (!this.isOnline) {
      throw new Error('Offline mode');
    }

    try {
      const response = await fetch(`/api/sync/${dataType}/${this.deviceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return null; // データが存在しない
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`[Sync] Failed to fetch remote ${dataType}:`, error);
      throw error;
    }
  }

  // リモートへのデータ送信
  private async pushToRemote(dataType: string, data: any): Promise<void> {
    if (!this.isOnline) {
      // オフライン時は保留中の変更として記録
      await this.addPendingChange(dataType, 'update', data);
      return;
    }

    try {
      const response = await fetch(`/api/sync/${dataType}/${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          deviceId: this.deviceId,
          syncedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`[Sync] Successfully pushed ${dataType} to remote`);
    } catch (error) {
      console.error(`[Sync] Failed to push ${dataType} to remote:`, error);
      // 失敗時は保留中の変更として記録
      await this.addPendingChange(dataType, 'update', data);
      throw error;
    }
  }

  // コンフリクト検出
  private detectConflicts(local: any, remote: any, dataType: string): SyncConflict[] {
    const conflicts: SyncConflict[] = [];
    
    // 簡略化されたコンフリクト検出（実際にはより詳細な比較が必要）
    if (local.updatedAt && remote.updatedAt) {
      const localTime = new Date(local.updatedAt).getTime();
      const remoteTime = new Date(remote.updatedAt).getTime();
      
      // 同時期の更新でデータが異なる場合
      if (Math.abs(localTime - remoteTime) < 60000) { // 1分以内
        const localStr = JSON.stringify(local);
        const remoteStr = JSON.stringify(remote);
        
        if (localStr !== remoteStr) {
          conflicts.push({
            id: `${dataType}_${Date.now()}`,
            dataType: dataType as SyncDataType,
            field: 'full_object',
            localValue: local,
            remoteValue: remote,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return conflicts;
  }

  // コンフリクト解決
  private async resolveConflicts(conflicts: SyncConflict[], local: any, remote: any): Promise<any> {
    // 簡単な解決策：最新のタイムスタンプを優先
    const localTime = new Date(local.updatedAt || 0).getTime();
    const remoteTime = new Date(remote.updatedAt || 0).getTime();
    
    if (localTime >= remoteTime) {
      return local;
    } else {
      return remote;
    }
  }

  // 進捗データのマージ
  private mergeProgress(local: UserProgress, remote: UserProgress): UserProgress {
    const merged = { ...local };
    
    // 学習統計のマージ
    if (remote.learningStats) {
      merged.learningStats = {
        currentStreak: Math.max(local.learningStats?.currentStreak || 0, remote.learningStats.currentStreak || 0),
        totalSessions: (local.learningStats?.totalSessions || 0) + (remote.learningStats?.totalSessions || 0),
        totalStudyTime: (local.learningStats?.totalStudyTime || 0) + (remote.learningStats?.totalStudyTime || 0),
        overallCorrectRate: Math.max(local.learningStats?.overallCorrectRate || 0, remote.learningStats?.overallCorrectRate || 0),
        dailyStudyTime: this.mergeDailyStudyTime(
          local.learningStats?.dailyStudyTime || [],
          remote.learningStats?.dailyStudyTime || []
        )
      };
    }
    
    // 教科別進捗のマージ
    if (remote.subjectProgresses) {
      merged.subjectProgresses = this.mergeSubjectProgresses(
        local.subjectProgresses || [],
        remote.subjectProgresses
      );
    }
    
    return merged;
  }

  // 日別学習時間のマージ
  private mergeDailyStudyTime(local: any[], remote: any[]): any[] {
    const dateMap = new Map();
    
    // ローカルデータを追加
    local.forEach(item => {
      dateMap.set(item.date, item);
    });
    
    // リモートデータをマージ
    remote.forEach(item => {
      const existing = dateMap.get(item.date);
      if (existing) {
        existing.studyTime = Math.max(existing.studyTime, item.studyTime);
      } else {
        dateMap.set(item.date, item);
      }
    });
    
    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  // 教科別進捗のマージ
  private mergeSubjectProgresses(local: any[], remote: any[]): any[] {
    const subjectMap = new Map();
    
    // ローカルデータを追加
    local.forEach(item => {
      subjectMap.set(item.subjectId, item);
    });
    
    // リモートデータをマージ
    remote.forEach(item => {
      const existing = subjectMap.get(item.subjectId);
      if (existing) {
        // より良いスコアを保持
        existing.overallMasteryScore = Math.max(existing.overallMasteryScore, item.overallMasteryScore);
        existing.totalSessions += item.totalSessions;
        existing.totalStudyTime += item.totalStudyTime;
        // より新しい学習日を保持
        if (new Date(item.lastStudiedAt) > new Date(existing.lastStudiedAt)) {
          existing.lastStudiedAt = item.lastStudiedAt;
        }
      } else {
        subjectMap.set(item.subjectId, item);
      }
    });
    
    return Array.from(subjectMap.values());
  }

  // 実績のマージ
  private mergeAchievements(local: any[], remote: any[]): any[] {
    const achievementMap = new Map();
    
    // 重複を除去してマージ
    [...local, ...remote].forEach(achievement => {
      if (!achievementMap.has(achievement.id)) {
        achievementMap.set(achievement.id, achievement);
      }
    });
    
    return Array.from(achievementMap.values()).sort((a, b) => 
      new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
    );
  }

  // 保留中の変更を追加
  private async addPendingChange(dataType: SyncDataType, operation: 'create' | 'update' | 'delete', data: any): Promise<void> {
    const pendingChanges = await this.getPendingChanges();
    
    const change: PendingChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dataType,
      operation,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    pendingChanges.push(change);
    this.saveLocalData('pendingChanges', pendingChanges);
  }

  // 保留中の変更を取得
  private async getPendingChanges(): Promise<PendingChange[]> {
    return this.getLocalData<PendingChange[]>('pendingChanges') || [];
  }

  // 保留中の変更を同期
  private async syncPendingChange(change: PendingChange): Promise<void> {
    try {
      await this.pushToRemote(change.dataType, change.data);
      
      // 同期成功時は保留リストから削除
      const pendingChanges = await this.getPendingChanges();
      const updatedChanges = pendingChanges.filter(c => c.id !== change.id);
      this.saveLocalData('pendingChanges', updatedChanges);
      
    } catch (error) {
      console.error('[Sync] Failed to sync pending change:', error);
      throw error;
    }
  }

  // 同期ステータスの更新
  private async updateSyncStatus(): Promise<void> {
    const status: SyncStatus = {
      lastSyncAt: new Date().toISOString(),
      deviceId: this.deviceId,
      syncVersion: 1,
      conflicts: [],
      pendingChanges: await this.getPendingChanges()
    };
    
    this.saveLocalData('syncStatus', status);
  }

  // デバイス情報の取得
  public getDeviceInfo(): DeviceInfo {
    const deviceInfo: DeviceInfo = {
      id: this.deviceId,
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      platform: navigator.platform,
      lastActiveAt: new Date().toISOString(),
      capabilities: {
        hasCamera: this.hasCamera(),
        hasMicrophone: this.hasMicrophone(),
        supportsTouchInput: this.supportsTouchInput(),
        supportsHandwriting: this.supportsHandwriting()
      }
    };
    
    return deviceInfo;
  }

  // デバイス名の取得
  private getDeviceName(): string {
    const userAgent = navigator.userAgent;
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'Mobile Device';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'Tablet Device';
    } else {
      return 'Desktop Device';
    }
  }

  // デバイスタイプの判定
  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const userAgent = navigator.userAgent;
    
    if (/iPhone|Android.*Mobile/.test(userAgent)) {
      return 'mobile';
    } else if (/iPad|Tablet|Android(?!.*Mobile)/.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // カメラの有無を確認
  private hasCamera(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // マイクの有無を確認
  private hasMicrophone(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // タッチ入力のサポート確認
  private supportsTouchInput(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // 手書き入力のサポート確認
  private supportsHandwriting(): boolean {
    return this.supportsTouchInput() || !!(window as any).PointerEvent;
  }

  // イベントリスナーの登録
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  // イベントの発火
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // 手動同期の実行
  public async forcSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('オフライン中は同期できません');
    }
    
    await this.performFullSync();
  }

  // 同期の停止
  public stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // 同期の再開
  public resumeSync(): void {
    this.startAutoSync();
  }

  // 同期間隔の設定
  public setSyncInterval(interval: number): void {
    this.syncInterval = interval;
    if (this.syncTimer) {
      this.stopSync();
      this.startAutoSync();
    }
  }

  // オンライン状態の確認
  public isDeviceOnline(): boolean {
    return this.isOnline;
  }

  // 同期ステータスの取得
  public getSyncStatus(): SyncStatus | null {
    return this.getLocalData<SyncStatus>('syncStatus');
  }
}

// シングルトンインスタンス
export const deviceSyncService = new DeviceSyncService();