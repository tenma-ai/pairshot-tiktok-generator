'use client';

import { PairshotLevel } from '@/lib/types';

const LEVEL_LABELS: Record<PairshotLevel, { label: string; desc: string }> = {
  1: { label: '1', desc: 'PairShot要素なし（純粋コンテンツ）' },
  2: { label: '2', desc: 'テキストでさらっと触れる程度' },
  3: { label: '3', desc: 'スクリーンショット1枚程度' },
  4: { label: '4', desc: 'アプリ紹介メイン' },
  5: { label: '5', desc: '全素材フル活用（CTA向き）' },
};

export default function PairshotLevelSelector({
  levels,
  onChange,
}: {
  levels: PairshotLevel[];
  onChange: (levels: PairshotLevel[]) => void;
}) {
  const updateLevel = (index: number, level: PairshotLevel) => {
    const next = [...levels];
    next[index] = level;
    onChange(next);
  };

  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-bold mb-1">PairShot関連付けレベル</h3>
      <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
        広告感を抑えるため、スライドごとにPairShot要素の強さを調整
      </p>

      <div className="space-y-2">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 shrink-0" style={{ color: 'var(--text-secondary)' }}>
              {i + 1}枚目
            </span>
            <div className="flex gap-1 flex-1">
              {([1, 2, 3, 4, 5] as PairshotLevel[]).map((l) => (
                <button
                  key={l}
                  onClick={() => updateLevel(i, l)}
                  className="flex-1 py-1.5 rounded text-xs font-bold transition-all duration-200"
                  style={{
                    background: level === l ? '#ffffff' : 'transparent',
                    color: level === l ? '#000000' : 'var(--text-tertiary)',
                    border: level === l ? '1px solid #ffffff' : '1px solid var(--border)',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs space-y-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {Object.entries(LEVEL_LABELS).map(([k, v]) => (
          <div key={k}>{v.label}: {v.desc}</div>
        ))}
      </div>
    </div>
  );
}
