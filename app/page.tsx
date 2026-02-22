'use client';

import { useState, useCallback } from 'react';
import { ThemeId, SlideData, GenerateResponse } from '@/lib/types';
import { DEFAULT_SELECTED } from '@/lib/assets';
import PasswordGate from '@/components/PasswordGate';
import ThemeSelector from '@/components/ThemeSelector';
import CustomScriptInput from '@/components/CustomScriptInput';
import AssetSelector from '@/components/AssetSelector';
import GenerateButton from '@/components/GenerateButton';
import SlideCarousel from '@/components/SlideCarousel';
import ScriptEditor from '@/components/ScriptEditor';
import MetadataDisplay from '@/components/MetadataDisplay';
import DownloadActions from '@/components/DownloadActions';

export default function Home() {
  const [password, setPassword] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeId>('couple_tips');
  const [customScript, setCustomScript] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>(DEFAULT_SELECTED);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const [slides, setSlides] = useState<SlideData[]>([]);
  const [images, setImages] = useState<Array<{ slideNumber: number; base64: string }>>([]);
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAuth = useCallback((pw: string) => {
    setPassword(pw);
  }, []);

  const generate = async () => {
    if (!password) return;
    setLoading(true);
    setError('');
    setImages([]);

    try {
      setProgress('Step 1/3: スクリプト生成中...');
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          theme,
          customScript: theme === 'custom' ? customScript : undefined,
          selectedAssets,
        }),
      });

      if (genRes.status === 401) {
        setError('パスワードが正しくありません');
        localStorage.removeItem('pairshot_pw');
        setPassword(null);
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
          password,
          slides: data.slides,
          selectedAssets,
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
          selectedAssets,
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

  if (!password) {
    return <PasswordGate onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h1 className="text-sm font-bold">PairShot TikTok Generator</h1>
        <button
          onClick={() => {
            localStorage.removeItem('pairshot_pw');
            setPassword(null);
          }}
          className="text-xs px-3 py-1 rounded-lg transition-all duration-200"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          退出
        </button>
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

          <AssetSelector selected={selectedAssets} onChange={setSelectedAssets} />

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
