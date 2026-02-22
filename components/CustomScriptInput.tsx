'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function CustomScriptInput({
  value,
  onChange,
  visible,
}: {
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!visible) return null;

  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-sm font-bold"
      >
        <span>✏️ カスタムスクリプト</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="mt-3">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            5枚分のスクリプトを自由に入力（空だとAIが自動生成します）
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="例: カップルが長続きするための秘訣を、Z世代向けにカジュアルに..."
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-none"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--border-hover)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
      )}
    </div>
  );
}
