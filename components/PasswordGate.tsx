'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const STORAGE_KEY = 'pairshot_pw';

export default function PasswordGate({
  onAuth,
}: {
  onAuth: (password: string) => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      onAuth(saved);
    }
    setChecking(false);
  }, [onAuth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('パスワードを入力してください');
      return;
    }
    localStorage.setItem(STORAGE_KEY, password);
    onAuth(password);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
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
          <h1 className="text-lg font-bold">PairShot TikTok Generator</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            パスワードを入力してください
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
          ログイン
        </button>
      </form>
    </div>
  );
}
