import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Language } from '../../types';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { loginWithGoogle, isLoading } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  useEffect(() => {
    if (!isOpen) return;

    // Load Google Identity Services Script dynamically if not present
    const loadGoogleScript = () => {
      if (document.getElementById('google-jssdk')) {
        renderGoogleButton();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => renderGoogleButton();
      document.body.appendChild(script);
    };

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              const ok = await loginWithGoogle({ credential: response.credential });
              if (ok) onClose();
            }
          },
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
          shape: 'pill',
        });
      }
    };

    loadGoogleScript();
  }, [isOpen, clientId, loginWithGoogle, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              📄
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-none">
                Tagih Dong
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Multi-User Account Login</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-11 min-h-11 inline-flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            aria-label="Tutup dialog login"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Info */}
        <div className="text-center space-y-2 py-2">
          <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Masuk dengan Google
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Simpan & kelola faktur, katalog produk/jasa, dan klien bisnis Anda dengan aman di database terisolasi.
          </p>
        </div>

        {/* Google Rendered Button */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div ref={googleButtonRef} className="min-h-[44px] flex items-center justify-center" />

          {isLoading && (
            <p className="text-xs text-slate-500 dark:text-slate-400" role="status">
              Memverifikasi akun Google…
            </p>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Keamanan Terjamin & Terenkripsi JWT</span>
        </div>
      </div>
    </div>
  );
};
