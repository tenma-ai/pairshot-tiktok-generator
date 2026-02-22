import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PairShot TikTok Generator',
  description: 'PairShotのTikTokスライドショーコンテンツを生成',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
