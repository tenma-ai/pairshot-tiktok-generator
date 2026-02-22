import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, getThemePrompt } from './prompts';
import { GenerateResponse } from './types';

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _client;
}

export async function generateSlideScript(
  theme: string,
  customScript?: string
): Promise<GenerateResponse> {
  const themePrompt = getThemePrompt(theme, customScript);

  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: themePrompt,
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

  return parsed;
}
