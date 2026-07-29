import React, { useState, useRef } from 'react';
import { X, Upload, Check, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../i18n/translations';
import type { Language } from '../../types';

interface UserProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const UserProfileSettingsModal: React.FC<UserProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = getTranslation(language);
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [picture, setPicture] = useState(user?.picture || '');
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ name, picture });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            Pengaturan Profil Akun User
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Avatar Picture Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              {picture ? (
                <img
                  src={picture}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500/20 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center border-4 border-indigo-500/20 shadow-md">
                  {name.charAt(0)}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition"
                title="Upload Foto Avatar Baru"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Upload Foto / Avatar Baru
            </button>
          </div>

          {/* User Email (Readonly) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Email Akun (Google ID)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* User Name Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Budi Santoso"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              required
            />
          </div>

          {/* Image URL Optional Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              atau URL Foto Profil / Avatar
            </label>
            <input
              type="text"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              placeholder="https://lh3.googleusercontent.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Tersimpan!
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
