import { NextRequest, NextResponse } from 'next/server';
import { generateSlideScript } from '@/lib/anthropic';

const PASSWORD = 'pairshot2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, theme, customScript, selectedAssets } = body;

    if (password !== PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!theme) {
      return NextResponse.json({ error: 'テーマを選択してください' }, { status: 400 });
    }

    const result = await generateSlideScript(theme, customScript, selectedAssets);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    const message = error instanceof Error ? error.message : '生成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
