import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Upload, Lock } from 'lucide-react';
import { getTranslation } from '../../i18n/translations';
import type { Language } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PricingModal } from '../SaaS/PricingModal';

interface SignatureCanvasProps {
  value?: string; // Data URL or Image URL
  onChange: (dataUrl: string) => void;
  language: Language;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  value,
  onChange,
  language,
}) => {
  const { plan } = useAuth();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const t = getTranslation(language);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 140;

    // Setup line styles
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    if (value && mode === 'draw') {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = value;
    }
  }, [mode, value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    onChange('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t.digitalSignature}
        </span>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2.5 py-1 rounded-md transition ${
              mode === 'draw'
                ? 'bg-white dark:bg-slate-700 font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.drawSignature}
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md transition ${
              mode === 'upload'
                ? 'bg-white dark:bg-slate-700 font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {plan === 'free' ? (
        <div
          onClick={() => setIsPricingModalOpen(true)}
          className="border-2 border-dashed border-amber-300 dark:border-amber-700/60 rounded-xl p-6 text-center bg-amber-50/40 dark:bg-amber-950/20 cursor-pointer hover:bg-amber-100/50 transition relative overflow-hidden group"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                <span>Tanda Tangan Digital Canvas (Fitur PRO)</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Text "Hormat Kami / Authorized Signature" & Nama tetap muncul di faktur gratis. Upgrade ke PRO untuk menggambar / upload file TTD digital.
              </p>
            </div>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 group-hover:scale-105 transition">
              Upgrade ke PRO untuk Mengaktifkan &rarr;
            </span>
          </div>
        </div>
      ) : mode === 'draw' ? (
        <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-32 cursor-crosshair touch-none"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/50 px-2 py-1 rounded-md border border-rose-200 dark:border-rose-900"
            >
              <Eraser className="w-3.5 h-3.5" />
              {t.clearSignature}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-900/50">
          {value ? (
            <div className="space-y-2">
              <img src={value} alt="Signature" className="max-h-24 mx-auto object-contain" />
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:underline"
              >
                {t.clearSignature}
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center space-y-1">
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Pilih file PNG/JPG Tanda Tangan
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        language={language}
        lockedFeatureName="Tanda Tangan Digital Canvas"
      />
    </div>
  );
};
