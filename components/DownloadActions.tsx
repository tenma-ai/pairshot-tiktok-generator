'use client';

import { Download, Archive } from 'lucide-react';

export default function DownloadActions({
  images,
  currentSlide,
}: {
  images: Array<{ slideNumber: number; base64: string }>;
  currentSlide: number;
}) {
  if (!images.length) return null;

  const downloadSingle = (index: number) => {
    const image = images[index];
    if (!image) return;
    const timestamp = Date.now();
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = `pairshot_slide_${image.slideNumber}_${timestamp}.png`;
    link.click();
  };

  const downloadZip = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const timestamp = Date.now();

    images.forEach((image) => {
      const binary = atob(image.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      zip.file(`pairshot_slide_${image.slideNumber}_${timestamp}.png`, bytes);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pairshot_slides_${timestamp}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => downloadSingle(currentSlide)}
        className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        <Download size={14} />
        スライド{currentSlide + 1}をPNG
      </button>
      <button
        onClick={downloadZip}
        className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        <Archive size={14} />
        ZIP一括
      </button>
    </div>
  );
}
