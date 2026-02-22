import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, getThemePrompt } from './prompts';
import { GenerateResponse, PairshotLevel } from './types';

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _client;
}

const LEVEL_INSTRUCTIONS: Record<PairshotLevel, string> = {
  1: 'PairShotに一切触れない。アプリ名、ロゴ、スクリーンショットは使わない。純粋な有益コンテンツのみ。assetIdsは空配列。',
  2: 'PairShotにテキストでさらっと触れる程度（「こういうアプリもあるらしい」程度）。ロゴやスクリーンショットは使わない。assetIdsは空配列。',
  3: 'PairShotのスクリーンショットを1枚程度使ってさりげなく紹介。広告感を出さない。',
  4: 'PairShotのアプリ紹介がメイン。スクリーンショットや機能説明を積極的に。',
  5: 'PairShot全面推し。ロゴ、ワードマーク、ストアアイコン、スクリーンショットをフル活用。CTAスライド向き。',
};

export async function generateSlideScript(
  theme: string,
  customScript?: string,
  pairshotLevels?: PairshotLevel[]
): Promise<GenerateResponse> {
  const themePrompt = getThemePrompt(theme, customScript);
  const levels = pairshotLevels || [1, 1, 2, 4, 5];

  const levelContext = `
## 各スライドのPairShot関連付けレベル（必ず厳守）
${levels.map((l, i) => `- ${i + 1}枚目: レベル${l} → ${LEVEL_INSTRUCTIONS[l]}`).join('\n')}

各スライドのpairshotLevelフィールドに上記のレベル値を設定すること。
レベル1-2のスライドではassetIdsを空配列[]にすること。`;

  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${themePrompt}\n${levelContext}`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => {
      if (block.type === 'text') return block.text;
      return '';
    })
    .join('');

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AIからの応答をパースできませんでした');
  }

  const parsed = JSON.parse(jsonMatch[0]) as GenerateResponse;

  if (!parsed.slides || parsed.slides.length !== 5) {
    throw new Error('5枚のスライドが生成されませんでした');
  }

  // Ensure pairshotLevel is set on each slide
  parsed.slides.forEach((slide, i) => {
    slide.pairshotLevel = levels[i];
  });

  return parsed;
}
