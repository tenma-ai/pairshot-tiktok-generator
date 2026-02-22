import { SlideData } from './types';
import React from 'react';

type AssetMap = Record<string, string>;

function AssetImage({ id, assetMap, width, height, style }: {
  id: string;
  assetMap: AssetMap;
  width: number;
  height: number;
  style?: React.CSSProperties;
}) {
  if (!assetMap[id]) return null;
  return (
    <img
      src={assetMap[id]}
      width={width}
      height={height}
      style={{ objectFit: 'cover', ...style }}
    />
  );
}

export function renderHookSlide(slide: SlideData, assetMap: AssetMap) {
  const { colorScheme, headline, body, assetIds } = slide;
  const hasCharacter = assetIds.includes('character') && assetMap['character'];
  const hasScreenshot = assetIds.some(id => ['card1', 'card2', 'card3', 'calendar', 'story', 'question', 'store', 'camera'].includes(id));
  const screenshotId = assetIds.find(id => ['card1', 'card2', 'card3', 'calendar', 'story', 'question', 'store', 'camera'].includes(id));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 1080,
      height: 1920,
      background: colorScheme.background,
      padding: 60,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
      }}>
        <div style={{
          display: 'flex',
          fontSize: 72,
          fontWeight: 700,
          color: colorScheme.text,
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: 900,
        }}>
          {headline}
        </div>
        <div style={{
          display: 'flex',
          fontSize: 36,
          color: colorScheme.text,
          opacity: 0.85,
          textAlign: 'center',
          lineHeight: 1.6,
          maxWidth: 850,
        }}>
          {body}
        </div>
      </div>

      {hasScreenshot && screenshotId && (
        <div style={{
          display: 'flex',
          position: 'absolute',
          bottom: 100,
          right: -40,
          transform: 'rotate(-5deg)',
        }}>
          <AssetImage id={screenshotId} assetMap={assetMap} width={350} height={700}
            style={{ borderRadius: 30, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
        </div>
      )}

      {hasCharacter && (
        <div style={{
          display: 'flex',
          position: 'absolute',
          bottom: 60,
          left: 60,
        }}>
          <AssetImage id="character" assetMap={assetMap} width={200} height={200}
            style={{ borderRadius: 100 }} />
        </div>
      )}

      <div style={{
        display: 'flex',
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          fontSize: 24,
          color: colorScheme.text,
          opacity: 0.5,
        }}>
          → スワイプ
        </div>
      </div>
    </div>
  );
}

export function renderContentSlide(slide: SlideData, assetMap: AssetMap) {
  const { colorScheme, headline, body, assetIds } = slide;
  const screenshotId = assetIds.find(id => ['card1', 'card2', 'card3', 'calendar', 'story', 'question', 'store', 'camera'].includes(id));
  const gameId = assetIds.find(id => ['othello', 'tictactoe', 'memory', 'hitblow', 'blockblast'].includes(id));
  const displayId = screenshotId || gameId;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 1080,
      height: 1920,
      background: colorScheme.background,
      padding: 60,
    }}>
      <div style={{
        display: 'flex',
        fontSize: 48,
        fontWeight: 700,
        color: colorScheme.text,
        lineHeight: 1.4,
        marginBottom: 40,
        maxWidth: 960,
      }}>
        {headline}
      </div>

      <div style={{
        display: 'flex',
        width: 960,
        height: 4,
        background: colorScheme.accent,
        marginBottom: 40,
        borderRadius: 2,
      }} />

      <div style={{
        display: 'flex',
        fontSize: 32,
        color: colorScheme.text,
        opacity: 0.9,
        lineHeight: 1.8,
        maxWidth: 960,
        flex: 1,
      }}>
        {body}
      </div>

      {displayId && assetMap[displayId] && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 40,
        }}>
          <AssetImage id={displayId} assetMap={assetMap} width={400} height={750}
            style={{ borderRadius: 24, boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }} />
        </div>
      )}
    </div>
  );
}

export function renderAppShowcaseSlide(slide: SlideData, assetMap: AssetMap) {
  const { colorScheme, headline, body, assetIds } = slide;
  const screenshotId = assetIds.find(id => ['card1', 'card2', 'card3', 'calendar', 'story', 'question', 'store', 'camera'].includes(id));
  const hasLogo = assetIds.includes('logo') && assetMap['logo'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 1080,
      height: 1920,
      background: colorScheme.background,
      padding: 60,
      alignItems: 'center',
    }}>
      {hasLogo && (
        <div style={{ display: 'flex', marginBottom: 30 }}>
          <AssetImage id="logo" assetMap={assetMap} width={80} height={80}
            style={{ borderRadius: 20 }} />
        </div>
      )}

      <div style={{
        display: 'flex',
        fontSize: 40,
        fontWeight: 700,
        color: colorScheme.text,
        textAlign: 'center',
        lineHeight: 1.4,
        marginBottom: 30,
        maxWidth: 900,
      }}>
        {headline}
      </div>

      {screenshotId && assetMap[screenshotId] && (
        <div style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <AssetImage id={screenshotId} assetMap={assetMap} width={500} height={950}
            style={{ borderRadius: 30, boxShadow: '0 24px 72px rgba(0,0,0,0.25)' }} />
        </div>
      )}

      <div style={{
        display: 'flex',
        fontSize: 28,
        color: colorScheme.text,
        opacity: 0.85,
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: 850,
        marginTop: 30,
      }}>
        {body}
      </div>
    </div>
  );
}

export function renderCtaSlide(slide: SlideData, assetMap: AssetMap) {
  const { colorScheme, headline, body } = slide;
  const hasWordmark = assetMap['wordmark'];
  const hasLogo = assetMap['logo'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 1080,
      height: 1920,
      background: colorScheme.background,
      padding: 60,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 50,
    }}>
      {hasLogo && (
        <AssetImage id="logo" assetMap={assetMap} width={160} height={160}
          style={{ borderRadius: 40 }} />
      )}

      {hasWordmark && (
        <AssetImage id="wordmark" assetMap={assetMap} width={500} height={100}
          style={{ objectFit: 'contain' }} />
      )}

      <div style={{
        display: 'flex',
        fontSize: 48,
        fontWeight: 700,
        color: colorScheme.text,
        textAlign: 'center',
        lineHeight: 1.4,
        maxWidth: 900,
      }}>
        {headline}
      </div>

      <div style={{
        display: 'flex',
        fontSize: 32,
        color: colorScheme.text,
        opacity: 0.85,
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: 850,
      }}>
        {body}
      </div>

      <div style={{
        display: 'flex',
        background: colorScheme.accent,
        borderRadius: 100,
        padding: '24px 80px',
        marginTop: 20,
      }}>
        <div style={{
          display: 'flex',
          fontSize: 36,
          fontWeight: 700,
          color: colorScheme.background,
        }}>
          プロフからDL →
        </div>
      </div>
    </div>
  );
}

export function getSlideTemplate(slide: SlideData, assetMap: AssetMap) {
  switch (slide.layoutType) {
    case 'hook':
      return renderHookSlide(slide, assetMap);
    case 'content':
      return renderContentSlide(slide, assetMap);
    case 'app_showcase':
      return renderAppShowcaseSlide(slide, assetMap);
    case 'cta':
      return renderCtaSlide(slide, assetMap);
    default:
      return renderContentSlide(slide, assetMap);
  }
}
