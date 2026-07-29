import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Check, Trash2, QrCode } from 'lucide-react';
import { getTranslation } from '../../i18n/translations';
import type { Language } from '../../types';

interface QrisCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQrisUrl?: string;
  onSaveQrisUrl: (qrisUrl: string) => void;
  language: Language;
}

export const QrisCropperModal: React.FC<QrisCropperModalProps> = ({
  isOpen,
  onClose,
  currentQrisUrl,
  onSaveQrisUrl,
  language,
}) => {
  const t = getTranslation(language);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && currentQrisUrl) {
      if (currentQrisUrl.startsWith('data:image/') || currentQrisUrl.startsWith('http')) {
        setImageSrc(currentQrisUrl);
      }
    }
  }, [isOpen, currentQrisUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCropAndSave = () => {
    if (!imageSrc || !canvasRef.current) {
      if (!imageSrc) {
        onSaveQrisUrl('');
        onClose();
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;

      ctx.clearRect(0, 0, 400, 400);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);

      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw image centered with position offset
      const drawWidth = 300;
      const drawHeight = (img.height / img.width) * drawWidth;

      ctx.drawImage(
        img,
        -drawWidth / 2 + position.x / zoom,
        -drawHeight / 2 + position.y / zoom,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/png');
      onSaveQrisUrl(croppedDataUrl);
      onClose();
    };
    img.src = imageSrc;
  };

  const handleClearQris = () => {
    setImageSrc(null);
    onSaveQrisUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-600" />
            Upload & Potong Barcode QRIS (Opsional)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer space-y-3 bg-slate-50/50 dark:bg-slate-800/30 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Pilih / Upload Gambar Barcode QRIS
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Format PNG, JPG, JPEG (Opsional - Tampilan Otomatis Bingkai)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cropping Viewport Container (1:1 Ratio Frame) */}
              <div className="relative w-64 h-64 mx-auto border-2 border-indigo-500 rounded-2xl overflow-hidden shadow-inner bg-slate-900 select-none cursor-move flex items-center justify-center">
                {/* Overlay Barcode Guide Frame */}
                <div className="absolute inset-0 border-2 border-dashed border-white/60 pointer-events-none z-10 rounded-xl m-3 flex flex-col justify-between p-2">
                  <span className="text-[9px] font-bold text-white/80 uppercase bg-black/40 px-1.5 py-0.5 rounded-md self-start">
                    Bingkai Barcode QRIS
                  </span>
                </div>

                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="QRIS Preview"
                    className="max-w-none transition-transform duration-75 pointer-events-none"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                      maxHeight: '100%',
                    }}
                  />
                </div>
              </div>

              {/* Crop Control Toolbar */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-24 accent-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100"
                  >
                    Ganti
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hidden Canvas for High Quality Cropping */}
          <canvas ref={canvasRef} className="hidden" />

          <p className="text-[10px] text-slate-400 text-center italic">
            * QRIS bersifat opsional. Geser dan atur zoom agar posisi barcode pas di tengah bingkai.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handleClearQris}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus / Kosongkan QRIS
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleCropAndSave}
              className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Check className="w-4 h-4" />
              Simpan QRIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
