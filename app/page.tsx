'use client';

import { useState, useEffect } from 'react';
import { ThemeId, SlideData, GenerateResponse, PairshotLevel } from '@/lib/types';
import PasswordGate from '@/components/PasswordGate';
import ThemeSelector from '@/components/ThemeSelector';
import CustomScriptInput from '@/components/CustomScriptInput';
import PairshotLevelSelector from '@/components/PairshotLevelSelector';
import GenerateButton from '@/components/GenerateButton';
import SlideCarousel from '@/components/SlideCarousel';
import ScriptEditor from '@/components/ScriptEditor';
import MetadataDisplay from '@/components/MetadataDisplay';
import DownloadActions from '@/components/DownloadActions';

export default function Home() {
  const [password, setPassword] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [theme, setTheme] = useState<ThemeId>('couple_tips');
  const [customScript, setCustomScript] = useState('');
  const [pairshotLevels, setPairshotLevels] = useState<PairshotLevel[]>([1, 1, 2, 4, 5]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const [slides, setSlides] = useState<SlideData[]>([]);
  const [images, setImages] = useState<Array<{ slideNumber: number; base64: string }>>([]);
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load saved password on mount
  useEffect(() => {
    const saved = localStorage.getItem('pairshot_pw');
    if (saved) setPassword(saved);
  }, []);

  const handleAuth = (pw: string) => {
    setPassword(pw);
    localStorage.setItem('pairshot_pw', pw);
    setShowPasswordModal(false);
    // Auto-trigger generation after password entry
    doGenerate(pw);
  };

  const doGenerate = async (pw: string) => {
    setLoading(true);
    setError('');
    setImages([]);

    try {
      setProgress('Step 1/3: スクリプト生成中...');
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: pw,
          theme,
          customScript: theme === 'custom' ? customScript : undefined,
          pairshotLevels,
        }),
      });

      if (genRes.status === 401) {
        setError('パスワードが正しくありません');
        localStorage.removeItem('pairshot_pw');
        setPassword(null);
        setShowPasswordModal(true);
        return;
      }

      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error || 'スクリプト生成に失敗');
      }

      const data: GenerateResponse = await genRes.json();
      setSlides(data.slides);
      setTitle(data.title);
      setHashtags(data.hashtags);
      setDescription(data.description);

      setProgress('Step 2/3: 画像生成中...');
      const renderRes = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: pw,
          slides: data.slides,
        }),
      });

      if (!renderRes.ok) {
        const err = await renderRes.json();
        throw new Error(err.error || '画像生成に失敗');
      }

      const renderData = await renderRes.json();
      setImages(renderData.images);
      setCurrentSlide(0);
      setProgress('Step 3/3: 完了!');
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(''), 2000);
    }
  };

  const generate = async () => {
    if (!password) {
      setShowPasswordModal(true);
      return;
    }
    doGenerate(password);
  };

  const regenerateImages = async () => {
    if (!password || !slides.length) return;
    setLoading(true);
    setError('');

    try {
      setProgress('画像を再生成中...');
      const renderRes = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          slides,
        }),
      });

      if (!renderRes.ok) {
        const err = await renderRes.json();
        throw new Error(err.error || '画像生成に失敗');
      }

      const renderData = await renderRes.json();
      setImages(renderData.images);
      setCurrentSlide(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {showPasswordModal && (
        <PasswordGate onAuth={handleAuth} onClose={() => setShowPasswordModal(false)} />
      )}

      <header
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h1 className="text-sm font-bold">PairShot TikTok Generator</h1>
        {password && (
          <button
            onClick={() => {
              localStorage.removeItem('pairshot_pw');
              setPassword(null);
            }}
            className="text-xs px-3 py-1 rounded-lg transition-all duration-200"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            認証クリア
          </button>
        )}
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="w-full lg:w-[400px] xl:w-[440px] p-4 space-y-4 overflow-y-auto"
          style={{ borderRight: '1px solid var(--border)' }}>
          <ThemeSelector selected={theme} onChange={setTheme} />

          <CustomScriptInput
            value={customScript}
            onChange={setCustomScript}
            visible={theme === 'custom'}
          />

          <PairshotLevelSelector levels={pairshotLevels} onChange={setPairshotLevels} />

          <GenerateButton
            onClick={generate}
            loading={loading}
            progress={progress}
            disabled={!theme}
          />

          {error && (
            <div className="p-3 rounded-lg text-xs text-red-400"
              style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)' }}>
              {error}
            </div>
          )}

          <ScriptEditor
            slides={slides}
            onChange={setSlides}
            onRegenerate={regenerateImages}
          />

          <MetadataDisplay
            title={title}
            hashtags={hashtags}
            description={description}
            onTitleChange={setTitle}
            onHashtagsChange={setHashtags}
            onDescriptionChange={setDescription}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-4 flex flex-col items-center justify-start gap-4 min-h-[60vh]">
          <SlideCarousel images={images} />
          <DownloadActions images={images} currentSlide={currentSlide} />
        </div>
      </div>
    </div>
  );
}
