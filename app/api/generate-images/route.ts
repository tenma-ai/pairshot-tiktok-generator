import { NextRequest, NextResponse } from 'next/server';
import { generateAllSlideImages } from '@/lib/gemini-image';
import { sanitizeImages } from '@/lib/image-sanitizer';
import { SlideData } from '@/lib/types';

const PASSWORD = 'pairshot2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, slides } = body as {
      password: string;
      slides: SlideData[];
    };

    if (password !== PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'スライドデータが必要です' }, { status: 400 });
    }

    // Generate images with Gemini
    const rawImages = await generateAllSlideImages(slides);

    // Sanitize: strip all AI metadata, add noise, re-encode as JPEG
    const images = await sanitizeImages(rawImages);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Generate images error:', error);
    const message = error instanceof Error ? error.message : '画像生成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
