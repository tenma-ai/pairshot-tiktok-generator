'use client';

import { ASSET_FILES } from '@/lib/assets';
import { useState } from 'react';

type CategoryKey = keyof typeof ASSET_FILES;

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  branding: 'ブランド',
  screenshots: 'スクリーンショット',
  games: 'ゲーム',
};

export default function AssetSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('branding');

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const categories: CategoryKey[] = ['branding', 'screenshots', 'games'];

  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        🖼️ 素材を選ぶ
      </h3>

      <div className="flex gap-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
            style={{
              background: activeCategory === cat ? 'var(--bg-tertiary)' : 'transparent',
              border: activeCategory === cat ? '1px solid var(--border-hover)' : '1px solid var(--border)',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ASSET_FILES[activeCategory].map((asset) => (
          <button
            key={asset.id}
            onClick={() => toggle(asset.id)}
            className="relative rounded-lg overflow-hidden transition-all duration-200 aspect-[3/4]"
            style={{
              border: selected.includes(asset.id) ? '2px solid #ffffff' : '1px solid var(--border)',
              opacity: selected.includes(asset.id) ? 1 : 0.6,
            }}
          >
            <img
              src={asset.path}
              alt={asset.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs font-bold"
              style={{ background: 'rgba(0,0,0,0.7)' }}>
              {asset.label}
            </div>
            {selected.includes(asset.id) && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
        デフォルト: ロゴ, pairshot文字, カード1
      </p>
    </div>
  );
}
