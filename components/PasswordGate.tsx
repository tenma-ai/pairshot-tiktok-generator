'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function PasswordGate({
  onAuth,
  onClose,
}: {
  onAuth: (password: string) => void;
  onClose?: () => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('パスワードを入力してください');
      return;
    }
    onAuth(password);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-lg"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <Lock size={20} className="text-white/60" />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            生成にはパスワードが必要です
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          placeholder="パスワード"
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 mb-4"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--border-hover)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          autoFocus
        />

        {error && (
          <p className="text-red-400 text-xs mb-3">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-lg text-sm font-bold transition-all duration-200 hover:opacity-90"
          style={{ background: '#ffffff', color: '#000000' }}
        >
          生成を開始
        </button>
      </form>
    </div>
  );
}
