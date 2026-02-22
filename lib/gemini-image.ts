import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { SlideData } from './types';
import { getAllAssets } from './assets';
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

export async function generateSlideImage(
  slide: SlideData,
  selectedAssets: string[]
): Promise<string> {
  const prompt = buildSlideImagePrompt(slide);

  const parts: Array<{ inlineData: { mimeType: string; data: string } } | { text: string }> = [];

  // Load reference images from assetIds
  const assetIdsToLoad = slide.assetIds.filter(id => selectedAssets.includes(id));
  const refLabels: string[] = [];

  for (const id of assetIdsToLoad) {
    const img = loadAssetBase64(id);
    if (img) {
      parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      const asset = getAllAssets().find(a => a.id === id);
      refLabels.push(`${asset?.label || id}`);
    }
  }

  // Build text prompt with reference context
  let textPrompt = '';
  if (refLabels.length > 0) {
    textPrompt += `上記の画像はPairShotアプリの素材です（${refLabels.join('、')}）。これらをリファレンスとして使って以下のスライドを生成してください:\n\n`;
  }
  textPrompt += prompt;

  parts.push({ text: textPrompt });

  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash-preview-05-20',
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
  slides: SlideData[],
  selectedAssets: string[]
): Promise<Array<{ slideNumber: number; base64: string }>> {
  // Try all 5 in parallel first
  try {
    const results = await Promise.all(
      slides.map(async (slide) => {
        let lastError: Error | null = null;
        // 1 retry on failure
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const base64 = await generateSlideImage(slide, selectedAssets);
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
        const base64 = await generateSlideImage(slide, selectedAssets);
        return { slideNumber: slide.slideNumber, base64 };
      })
    );

    const results2 = await Promise.all(
      batch2.map(async (slide) => {
        const base64 = await generateSlideImage(slide, selectedAssets);
        return { slideNumber: slide.slideNumber, base64 };
      })
    );

    return [...results1, ...results2];
  }
}
