// Service Worker for AIセルフトークラーニング
const CACHE_NAME = 'ai-learning-coach-v1';
const DATA_CACHE_NAME = 'ai-learning-data-v1';

// キャッシュするリソース
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 動的にバンドルされるアセットは Runtime Caching で処理
];

// データ同期のための定数
const SYNC_TAGS = {
  PROFILE_SYNC: 'profile-sync',
  PROGRESS_SYNC: 'progress-sync',
  SESSION_SYNC: 'session-sync'
};

// インストール時の処理
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API リクエストの処理
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // 静的リソースの処理
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
  }
});

// API リクエストの処理 (Cache First + Network Fallback)
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // ネットワークリクエストを試行
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 成功した場合はデータキャッシュに保存
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } else {
      throw new Error('Network response not ok');
    }
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', url.pathname);
    
    // ネットワーク失敗時はキャッシュを確認
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // オフライン用のフォールバック応答
    return new Response(
      JSON.stringify({
        error: 'オフラインです。インターネット接続を確認してください。',
        offline: true,
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// 静的リソースの処理 (Cache First)
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    
    // オフライン時のフォールバック
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    return new Response('オフラインです', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// バックグラウンド同期の処理
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.PROFILE_SYNC:
      event.waitUntil(syncProfile());
      break;
    case SYNC_TAGS.PROGRESS_SYNC:
      event.waitUntil(syncProgress());
      break;
    case SYNC_TAGS.SESSION_SYNC:
      event.waitUntil(syncSessions());
      break;
  }
});

// プロフィール同期
async function syncProfile() {
  try {
    console.log('[SW] Syncing profile data');
    
    // IndexedDBからプロフィールデータを取得
    const profileData = await getStoredData('learnerProfile');
    
    if (profileData && profileData.needsSync) {
      // サーバーに送信
      const response = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        // 同期完了フラグを更新
        await updateSyncStatus('learnerProfile', false);
        console.log('[SW] Profile sync completed');
        
        // クライアントに通知
        await notifyClients('profile-synced', { success: true });
      }
    }
  } catch (error) {
    console.error('[SW] Profile sync failed:', error);
    await notifyClients('profile-sync-failed', { error: error.message });
  }
}

// 学習進捗同期
async function syncProgress() {
  try {
    console.log('[SW] Syncing progress data');
    
    const progressData = await getStoredData('userProgress');
    
    if (progressData && progressData.needsSync) {
      const response = await fetch('/api/progress/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      });
      
      if (response.ok) {
        await updateSyncStatus('userProgress', false);
        console.log('[SW] Progress sync completed');
        await notifyClients('progress-synced', { success: true });
      }
    }
  } catch (error) {
    console.error('[SW] Progress sync failed:', error);
    await notifyClients('progress-sync-failed', { error: error.message });
  }
}

// セッション録画同期
async function syncSessions() {
  try {
    console.log('[SW] Syncing session recordings');
    
    const sessionData = await getStoredData('sessionRecordings');
    
    if (sessionData && sessionData.needsSync) {
      const response = await fetch('/api/sessions/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        await updateSyncStatus('sessionRecordings', false);
        console.log('[SW] Sessions sync completed');
        await notifyClients('sessions-synced', { success: true });
      }
    }
  } catch (error) {
    console.error('[SW] Sessions sync failed:', error);
    await notifyClients('sessions-sync-failed', { error: error.message });
  }
}

// ストレージからデータ取得（IndexedDB用のヘルパー）
async function getStoredData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ai-learning-coach-db', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get('current');
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
      
      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// 同期ステータス更新
async function updateSyncStatus(storeName, needsSync) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ai-learning-coach-db', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const getRequest = store.get('current');
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.needsSync = needsSync;
          data.lastSyncAt = new Date().toISOString();
          
          const putRequest = store.put(data, 'current');
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
    };
  });
}

// クライアントに通知
async function notifyClients(type, data) {
  const clients = await self.clients.matchAll();
  
  clients.forEach(client => {
    client.postMessage({
      type,
      data,
      timestamp: new Date().toISOString()
    });
  });
}

// プッシュ通知の処理
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');
  
  const options = {
    body: event.data ? event.data.text() : '新しい学習プランが利用可能です！',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '学習を始める',
        icon: '/action-explore.png'
      },
      {
        action: 'close',
        title: '後で',
        icon: '/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AIセルフトークラーニング', options)
  );
});

// 通知クリックの処理
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});