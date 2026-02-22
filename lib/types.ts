export interface ColorScheme {
  background: string;
  text: string;
  accent: string;
}

export type PairshotLevel = 1 | 2 | 3 | 4 | 5;

export interface SlideData {
  slideNumber: number;
  headline: string;
  body: string;
  visualDirection: string;
  layoutType: 'hook' | 'content' | 'app_showcase' | 'cta';
  colorScheme: ColorScheme;
  assetIds: string[];
  pairshotLevel: PairshotLevel;
}

export interface GenerateResponse {
  slides: SlideData[];
  title: string;
  hashtags: string[];
  description: string;
}

export interface RenderResponse {
  images: Array<{ slideNumber: number; base64: string }>;
}

export type ThemeId =
  | 'couple_tips' | 'date_spot' | 'couple_psychology' | 'couple_common'
  | 'app_showcase' | 'photo_template' | 'korean_trend' | 'custom';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'couple_tips', name: '長続きのコツ', description: '恋人を長続きさせるTips' },
  { id: 'date_spot', name: 'デートスポット', description: 'おすすめスポット紹介' },
  { id: 'couple_psychology', name: '心理テスト', description: 'カップル心理テスト・診断' },
  { id: 'couple_common', name: 'あるある', description: '共感系あるある' },
  { id: 'app_showcase', name: 'アプリ紹介', description: 'PairShotを魅力的に紹介' },
  { id: 'photo_template', name: '写真テンプレ', description: 'カード写真の魅力訴求' },
  { id: 'korean_trend', name: '韓国トレンド', description: '韓国カップル文化' },
  { id: 'custom', name: 'カスタム', description: '自由入力' },
];
