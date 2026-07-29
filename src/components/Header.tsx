import React, { useState } from 'react';
import {
  FileCheck2,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Printer,
  Save,
  Briefcase,
  LogOut,
  LogIn,
  Settings,
  Heart,
} from 'lucide-react';
import type { AppTheme, Language, UserProfile } from '../types';
import { getTranslation } from '../i18n/translations';
import { useAuth } from '../context/AuthContext';
import { GoogleLoginModal } from './Auth/GoogleLoginModal';
import { UserProfileSettingsModal } from './Auth/UserProfileSettingsModal';
import { SupportMeModal } from './SaaS/SupportMeModal';

interface HeaderProps {
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (id: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: AppTheme;
  onThemeToggle: () => void;
  onSaveInvoice?: () => void;
  onPrintPdf?: () => void;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  profiles,
  onSelectProfile,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  onSaveInvoice,
  onPrintPdf,
  onGoToLanding,
}) => {
  const t = getTranslation(language);
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isSupportMeOpen, setIsSupportMeOpen] = useState(false);

  return (
    <>
      <header className={`no-print sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoToLanding}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {t.appName}
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  100% FREE
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Center: Multi-User Profile Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold cursor-pointer hover:border-indigo-400 transition">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate text-slate-800 dark:text-slate-200">
                {activeProfile?.name || 'Pilih Profil'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                {t.switchProfile}
              </span>
              <div className="space-y-1 my-1">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProfile(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      p.id === activeProfile?.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {p.id === activeProfile?.id && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Controls: User Account, Print, Save, Language, Theme */}
          <div className="flex items-center gap-2">
            {/* User Account / Google Login Button */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 transition"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-indigo-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-150 z-50 space-y-1">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSupportMeOpen(true)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-bold transition"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    Dukung Pengembang (Donasi) ❤️
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileSettingsOpen(true)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition"
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-500" />
                    Pengaturan Profil User
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      if (onGoToLanding) onGoToLanding();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar (Logout)
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 text-xs font-bold rounded-xl transition shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk (Google)</span>
              </button>
            )}

            {/* Support Me Button */}
            <button
              type="button"
              onClick={() => setIsSupportMeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/80 hover:border-rose-400 text-xs font-extrabold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs hover:shadow-rose-500/15"
              title="Dukung Pengembang Tagih Dong"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Support Me!</span>
            </button>

            {onSaveInvoice && (
              <button
                type="button"
                onClick={onSaveInvoice}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition btn-hallmark"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.saveInvoice}</span>
              </button>
            )}

            {onPrintPdf && (
              <button
                type="button"
                onClick={onPrintPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition btn-hallmark"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.exportPdf}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => onLanguageChange(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onThemeToggle}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />

      {/* User Profile Settings Modal */}
      <UserProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        language={language}
      />

      {/* Support Me Modal */}
      <SupportMeModal
        isOpen={isSupportMeOpen}
        onClose={() => setIsSupportMeOpen(false)}
        language={language}
      />
    </>
  );
};
