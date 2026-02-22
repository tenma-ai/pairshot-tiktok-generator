import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { SlideData, PairshotLevel } from './types';
import { getAllAssets, ASSET_FILES } from './assets';
import { buildSlideImagePrompt } from './prompts';

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return _ai;
}

function loadAssetBase64(assetId: string): { data: string; mimeType: string } | null {
  const allAssets = getAllAssets();
  const asset = allAssets.find(a => a.id === assetId);
  if (!asset) return null;

  const fullPath = path.join(process.cwd(), 'public', asset.path);
  if (!fs.existsSync(fullPath)) return null;

  const buffer = fs.readFileSync(fullPath);
  const mimeType = asset.path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  return { data: buffer.toString('base64'), mimeType };
}

function getAssetsForLevel(level: PairshotLevel): Array<{ id: string; path: string; label: string }> {
  switch (level) {
    case 1:
    case 2:
      // No PairShot assets - pure content
      return [];
    case 3:
      // Only screenshots (1-2 for context)
      return [...ASSET_FILES.screenshots];
    case 4:
      // Screenshots + logo/character
      return [
        ...ASSET_FILES.screenshots,
        ...ASSET_FILES.branding.filter(a => ['logo', 'character'].includes(a.id)),
        ...ASSET_FILES.games,
      ];
    case 5:
      // Everything
      return getAllAssets();
    default:
      return [];
  }
}

export async function generateSlideImage(
  slide: SlideData
): Promise<string> {
  const prompt = buildSlideImagePrompt(slide);
  const level = slide.pairshotLevel || 3;

  const parts: Array<{ inlineData: { mimeType: string; data: string } } | { text: string }> = [];

  const assetsToLoad = getAssetsForLevel(level);
  const refLabels: string[] = [];

  for (const asset of assetsToLoad) {
    const img = loadAssetBase64(asset.id);
    if (img) {
      parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      refLabels.push(asset.label);
    }
  }

  let textPrompt = '';
  if (refLabels.length > 0) {
    textPrompt += `上記の${refLabels.length}枚の画像はPairShotアプリの素材です（${refLabels.join('、')}）。このスライドに最適な素材を選んで使ってください。

【重要ルール】
- 素材画像をそのまま貼り付けて使うこと。素材の下にIDやラベル名（"appstore"、"logo"、"playstore"等）を絶対に書かないこと。
- 素材はあくまで画像として配置するだけ。キャプションやラベルは不要。

`;
  }
  textPrompt += prompt;

  parts.push({ text: textPrompt });

  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: {
      responseModalities: ['image', 'text'],
    },
  });

  // Extract image from response
  if (response.candidates && response.candidates[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data!;
      }
    }
  }

  throw new Error(`Gemini returned no image for slide ${slide.slideNumber}`);
}

export async function generateAllSlideImages(
  slides: SlideData[]
): Promise<Array<{ slideNumber: number; base64: string }>> {
  // Try all 5 in parallel first
  try {
    const results = await Promise.all(
      slides.map(async (slide) => {
        let lastError: Error | null = null;
        // 1 retry on failure
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const base64 = await generateSlideImage(slide);
            return { slideNumber: slide.slideNumber, base64 };
          } catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e));
            if (attempt === 0) {
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        }
        throw lastError;
      })
    );
    return results;
  } catch {
    // Fallback: 3 + 2 batch
    const batch1 = slides.slice(0, 3);
    const batch2 = slides.slice(3);

    const results1 = await Promise.all(
      batch1.map(async (slide) => {
        const base64 = await generateSlideImage(slide);
        return { slideNumber: slide.slideNumber, base64 };
      })
    );

    const results2 = await Promise.all(
      batch2.map(async (slide) => {
        const base64 = await generateSlideImage(slide);
        return { slideNumber: slide.slideNumber, base64 };
      })
    );

    return [...results1, ...results2];
  }
}
