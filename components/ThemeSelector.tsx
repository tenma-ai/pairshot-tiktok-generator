'use client';

import { THEMES, ThemeId } from '@/lib/types';

export default function ThemeSelector({
  selected,
  onChange,
}: {
  selected: ThemeId;
  onChange: (theme: ThemeId) => void;
}) {
  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        🎨 テーマを選ぶ
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className="p-3 rounded-lg text-left transition-all duration-200"
            style={{
              background: selected === theme.id ? 'var(--bg-tertiary)' : 'transparent',
              border: selected === theme.id ? '1px solid var(--border-hover)' : '1px solid var(--border)',
            }}
          >
            <div className="text-sm font-bold mb-1">{theme.name}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {theme.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
