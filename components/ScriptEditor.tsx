'use client';

import { SlideData } from '@/lib/types';

export default function ScriptEditor({
  slides,
  onChange,
  onRegenerate,
}: {
  slides: SlideData[];
  onChange: (slides: SlideData[]) => void;
  onRegenerate: () => void;
}) {
  if (!slides.length) return null;

  const updateSlide = (index: number, field: keyof SlideData, value: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">📝 スクリプト編集</h3>
        <button
          onClick={onRegenerate}
          className="px-3 py-1 rounded-lg text-xs transition-all duration-200"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          このスライドだけ再生成
        </button>
      </div>

      <div className="space-y-3">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="p-3 rounded-lg"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                {slide.layoutType}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                スライド {slide.slideNumber}
              </span>
            </div>

            <input
              value={slide.headline}
              onChange={(e) => updateSlide(i, 'headline', e.target.value)}
              placeholder="見出し"
              className="w-full px-3 py-2 rounded-lg text-sm font-bold outline-none mb-2 transition-all duration-200"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-hover)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />

            <textarea
              value={slide.body}
              onChange={(e) => updateSlide(i, 'body', e.target.value)}
              placeholder="本文"
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-all duration-200"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-hover)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
