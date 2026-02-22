'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SlideCarousel({
  images,
}: {
  images: Array<{ slideNumber: number; base64: string }>;
}) {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--text-tertiary)' }}>
        <p className="text-sm">スライドがここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 mb-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center"
            style={{
              background: current === i ? '#ffffff' : 'var(--bg-tertiary)',
              color: current === i ? '#000000' : 'var(--text-secondary)',
              border: current === i ? 'none' : '1px solid var(--border)',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="relative flex items-center gap-4">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="p-2 rounded-full transition-all duration-200"
          style={{
            background: 'var(--bg-tertiary)',
            opacity: current === 0 ? 0.3 : 1,
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="rounded-lg overflow-hidden shadow-2xl" style={{ border: '1px solid var(--border)' }}>
          <img
            src={`data:image/jpeg;base64,${images[current].base64}`}
            alt={`スライド ${current + 1}`}
            className="w-auto"
            style={{ height: 480, aspectRatio: '4/5' }}
          />
        </div>

        <button
          onClick={() => setCurrent(Math.min(images.length - 1, current + 1))}
          disabled={current === images.length - 1}
          className="p-2 rounded-full transition-all duration-200"
          style={{
            background: 'var(--bg-tertiary)',
            opacity: current === images.length - 1 ? 0.3 : 1,
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
