export const ASSET_FILES = {
  branding: [
    { id: 'wordmark', path: '/assets/branding/pairshot文字.png', label: 'ワードマーク' },
    { id: 'logo', path: '/assets/branding/ロゴ.png', label: 'アプリアイコン' },
    { id: 'character', path: '/assets/branding/公式キャラ.png', label: '公式キャラ' },
  ],
  screenshots: [
    { id: 'card1', path: '/assets/screenshots/カード1.PNG', label: 'カード①' },
    { id: 'card2', path: '/assets/screenshots/カード2.PNG', label: 'カード②' },
    { id: 'card3', path: '/assets/screenshots/カード3.PNG', label: 'カード③' },
    { id: 'calendar', path: '/assets/screenshots/カレンダー.PNG', label: 'カレンダー' },
    { id: 'story', path: '/assets/screenshots/ストーリー.PNG', label: 'ストーリー' },
    { id: 'question', path: '/assets/screenshots/一日の質問.PNG', label: '一日の質問' },
    { id: 'store', path: '/assets/screenshots/ストア.PNG', label: 'ストア' },
    { id: 'camera', path: '/assets/screenshots/撮り方テンプレート.PNG', label: '撮影テンプレ' },
  ],
  games: [
    { id: 'othello', path: '/assets/games/オセロ.PNG', label: 'オセロ' },
    { id: 'tictactoe', path: '/assets/games/三目並べ.PNG', label: '三目並べ' },
    { id: 'memory', path: '/assets/games/神経衰弱.PNG', label: '神経衰弱' },
    { id: 'hitblow', path: '/assets/games/ヒットアンドブロー.PNG', label: 'H&B' },
    { id: 'blockblast', path: '/assets/games/ブロックブラスト.PNG', label: 'ブロック' },
  ],
} as const;

export const DEFAULT_SELECTED = ['logo', 'wordmark', 'card1'];

export function getAllAssets() {
  return [
    ...ASSET_FILES.branding,
    ...ASSET_FILES.screenshots,
    ...ASSET_FILES.games,
  ];
}
