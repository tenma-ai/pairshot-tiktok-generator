'use client';

import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

export default function MetadataDisplay({
  title,
  hashtags,
  description,
  onTitleChange,
  onHashtagsChange,
  onDescriptionChange,
}: {
  title: string;
  hashtags: string[];
  description: string;
  onTitleChange: (v: string) => void;
  onHashtagsChange: (v: string[]) => void;
  onDescriptionChange: (v: string) => void;
}) {
  const [newTag, setNewTag] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  if (!title && !hashtags.length && !description) return null;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const addHashtag = () => {
    if (!newTag.trim()) return;
    const tag = newTag.startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
    onHashtagsChange([...hashtags, tag]);
    setNewTag('');
  };

  const removeHashtag = (index: number) => {
    onHashtagsChange(hashtags.filter((_, i) => i !== index));
  };

  const fullText = `${title}\n\n${description}\n\n${hashtags.join(' ')}`;

  return (
    <div className="p-4 rounded-lg space-y-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <div>
        <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>
          タイトル <span style={{ color: 'var(--text-tertiary)' }}>{title.length}/90</span>
        </label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--border-hover)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div>
        <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>
          ハッシュタグ
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              {tag}
              <button onClick={() => removeHashtag(i)} className="opacity-50 hover:opacity-100">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
            placeholder="#タグ追加"
            className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none transition-all duration-200"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={addHashtag}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            追加
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>
          説明文 <span style={{ color: 'var(--text-tertiary)' }}>{description.length}/4000</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
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

      <button
        onClick={() => copyToClipboard(fullText, 'all')}
        className="w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        {copied === 'all' ? (
          <>
            <Check size={14} /> コピーしました
          </>
        ) : (
          <>
            <Copy size={14} /> 全体コピー
          </>
        )}
      </button>
    </div>
  );
}
