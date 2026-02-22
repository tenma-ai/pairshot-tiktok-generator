import { NextRequest, NextResponse } from 'next/server';
import { renderSlides } from '@/lib/slide-renderer';
import { SlideData } from '@/lib/types';

const PASSWORD = 'pairshot2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, slides, selectedAssets } = body as {
      password: string;
      slides: SlideData[];
      selectedAssets: string[];
    };

    if (password !== PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json({ error: 'スライドデータが必要です' }, { status: 400 });
    }

    const images = await renderSlides(slides, selectedAssets || []);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Render error:', error);
    const message = error instanceof Error ? error.message : '画像生成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
