import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { SlideData } from './types';
import { getAllAssets } from './assets';
import { getSlideTemplate } from './slide-templates';

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;

  const [regular, bold] = await Promise.all([
    fetch('https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEk757Y0rw_qMHVdbR2L8Y9QTJ1LwkRg8TSk.0.woff2').then(r => r.arrayBuffer()),
    fetch('https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEk757Y0rw_qMHVdbR2L8Y9QTJ1LwkRg8TSk.0.woff2').then(r => r.arrayBuffer()),
  ]);

  fontCache = { regular, bold };
  return fontCache;
}

function loadAssetAsBase64(assetPath: string): string {
  const fullPath = path.join(process.cwd(), 'public', assetPath);
  if (!fs.existsSync(fullPath)) return '';
  const buffer = fs.readFileSync(fullPath);
  const ext = assetPath.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,${buffer.toString('base64')}`;
}

function buildAssetMap(selectedIds: string[]): Record<string, string> {
  const allAssets = getAllAssets();
  const map: Record<string, string> = {};
  for (const id of selectedIds) {
    const asset = allAssets.find(a => a.id === id);
    if (asset) {
      map[id] = loadAssetAsBase64(asset.path);
    }
  }
  return map;
}

export async function renderSlides(
  slides: SlideData[],
  selectedAssets: string[]
): Promise<Array<{ slideNumber: number; base64: string }>> {
  const fonts = await loadFonts();
  const assetMap = buildAssetMap(selectedAssets);

  const results = await Promise.all(
    slides.map(async (slide) => {
      const element = getSlideTemplate(slide, assetMap);

      const svg = await satori(element as React.ReactNode, {
        width: 1080,
        height: 1920,
        fonts: [
          {
            name: 'Noto Sans JP',
            data: fonts.regular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Noto Sans JP',
            data: fonts.bold,
            weight: 700,
            style: 'normal',
          },
        ],
      });

      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1080 },
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();
      const base64 = Buffer.from(pngBuffer).toString('base64');

      return {
        slideNumber: slide.slideNumber,
        base64,
      };
    })
  );

  return results;
}
