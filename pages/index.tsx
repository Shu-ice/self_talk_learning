import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BeautifulTopPage from '../components/BeautifulTopPage';
import '../styles/hierarchical-navigator.css';

/**
 * 🏠 Home Page - トップページ
 * 美しいトップページ + 階層構造の教科・単元ナビゲーション
 */

interface HomePageProps {
  // 必要に応じて props を定義
}

const HomePage: React.FC<HomePageProps> = () => {
  const [userId] = useState<string>('demo_user_001'); // 実際の実装では認証から取得
  const [userName] = useState<string>('太郎'); // 実際の実装では認証から取得

  useEffect(() => {
    // ページ読み込み時の初期化処理
    console.log('📚 中学受験AI学習システム - 美しいトップページ読み込み');
  }, []);

  return (
    <>
      <Head>
        <title>中学受験AI学習システム - ホーム</title>
        <meta name="description" content="中学受験のための包括的AI学習システム。算数・国語・理科・社会の全教科を体系的に学習できます。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta property="og:title" content="中学受験AI学習システム" />
        <meta property="og:description" content="AI技術を活用した次世代の中学受験対策システム" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-domain.com/" />
        <meta property="twitter:title" content="中学受験AI学習システム" />
        <meta property="twitter:description" content="AI技術を活用した次世代の中学受験対策システム" />
        <meta property="twitter:image" content="/twitter-image.jpg" />
        
        {/* PWA関連 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="中学受験AI学習" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        
        {/* 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "中学受験AI学習システム",
              "description": "AI技術を活用した包括的な中学受験対策システム",
              "url": "https://your-domain.com",
              "logo": "https://your-domain.com/logo.png",
              "sameAs": [
                "https://twitter.com/your-account",
                "https://www.facebook.com/your-page"
              ],
              "educationalCredentialAwarded": "中学受験対策",
              "educationalLevel": "小学6年生",
              "teaches": [
                {
                  "@type": "Course",
                  "name": "算数",
                  "description": "中学受験算数の全範囲をカバー"
                },
                {
                  "@type": "Course", 
                  "name": "国語",
                  "description": "読解力・表現力・語彙力の総合的な向上"
                },
                {
                  "@type": "Course",
                  "name": "理科", 
                  "description": "自然現象の理解と科学的思考力の育成"
                },
                {
                  "@type": "Course",
                  "name": "社会",
                  "description": "歴史・地理・公民の総合的な学習"
                }
              ]
            })
          }}
        />
      </Head>

      <BeautifulTopPage
        userId={userId}
        userName={userName}
      />
    </>
  );
};

export default HomePage;