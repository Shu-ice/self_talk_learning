import React, { useState } from 'react';
import { validateApiKey } from '../services/geminiService';
import { KidsButton, KidsCard } from './ui/KidsUIComponents';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
  onClose: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, onClose }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleRefresh = () => {
    const { isValid } = validateApiKey();
    if (isValid) {
      onApiKeySet();
    } else {
      alert('APIキーが正しく設定されていません。.envファイルを確認してください。');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🔑 APIキーの設定が必要です</h2>
              <p className="text-blue-100 mt-1">Google Gemini APIを利用するための設定を行います</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <KidsCard title="APIキーとは？" icon="🤔" color="blue">
            <p className="text-sm text-gray-600">
              AIコーチ「みらい」と会話するために、Google Gemini APIという技術を使用しています。
              これを利用するには、Googleから発行されるAPIキーという特別なコードが必要です。
            </p>
          </KidsCard>

          <KidsCard title="料金について" icon="💰" color="green">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>✅ 基本的に無料で利用できます！</strong></p>
              <p>• 月15回まで: 完全無料</p>
              <p>• それ以降: 非常に安価（1回あたり数円程度）</p>
              <p>• 料金の詳細は<a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>でご確認ください</p>
            </div>
          </KidsCard>

          <div className="text-center">
            <KidsButton
              onClick={() => setShowInstructions(!showInstructions)}
              variant="primary"
              size="large"
              icon="📋"
              animation={true}
            >
              {showInstructions ? '手順を隠す' : '設定手順を見る'}
            </KidsButton>
          </div>

          {showInstructions && (
            <KidsCard title="設定手順" icon="📝" color="purple">
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">ステップ1: APIキーを取得</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Google AI Studio
                      </a>
                      にアクセス
                    </li>
                    <li>Googleアカウントでログイン</li>
                    <li>「Create API key」をクリック</li>
                    <li>生成されたAPIキーをコピー</li>
                  </ol>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">ステップ2: 環境ファイルに設定</h4>
                  <ol className="list-decimal list-inside space-y-2 text-green-700">
                    <li>プロジェクトフォルダ内に「.env」ファイルを作成</li>
                    <li>以下の内容を記述：</li>
                  </ol>
                  <div className="mt-2 bg-gray-800 text-green-400 p-3 rounded font-mono text-xs">
                    VITE_GEMINI_API_KEY=取得したAPIキーを貼り付け
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    ※ your_gemini_api_key_here の部分を実際のAPIキーに置き換えてください
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">ステップ3: アプリを再起動</h4>
                  <ol className="list-decimal list-inside space-y-2 text-amber-700">
                    <li>開発サーバーを停止（Ctrl+C）</li>
                    <li>「npm run dev」で再起動</li>
                    <li>下の「設定完了」ボタンを押して確認</li>
                  </ol>
                </div>
              </div>
            </KidsCard>
          )}

          <div className="flex gap-4 justify-center">
            <KidsButton
              onClick={handleRefresh}
              variant="success"
              size="large"
              icon="🔄"
              animation={true}
            >
              設定完了・確認
            </KidsButton>
            
            <KidsButton
              onClick={onClose}
              variant="secondary"
              size="large"
              icon="⏭️"
            >
              後で設定する
            </KidsButton>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">❓ 困ったときは</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• .envファイルはプロジェクトのルートフォルダ（package.jsonと同じ場所）に作成</li>
              <li>• APIキーの前後にスペースや引用符がないかチェック</li>
              <li>• ブラウザのコンソール（F12）でエラーメッセージを確認</li>
              <li>• 設定後は必ずサーバーを再起動してください</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;