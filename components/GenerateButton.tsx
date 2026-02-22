'use client';

import { Loader2, Sparkles } from 'lucide-react';

export default function GenerateButton({
  onClick,
  loading,
  progress,
  disabled,
}: {
  onClick: () => void;
  loading: boolean;
  progress: string;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
      style={{
        background: disabled ? 'var(--bg-tertiary)' : '#ffffff',
        color: disabled ? 'var(--text-tertiary)' : '#000000',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>{progress || '生成中...'}</span>
        </>
      ) : (
        <>
          <Sparkles size={18} />
          <span>✨ 生成する</span>
        </>
      )}
    </button>
  );
}
