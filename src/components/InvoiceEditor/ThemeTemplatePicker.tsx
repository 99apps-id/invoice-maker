import React, { useState } from 'react';
import { Check, Palette, Type, LayoutGrid, Lock } from 'lucide-react';
import { FONT_OPTIONS, PRESET_COLORS, TEMPLATES } from '../../constants/templates';
import { getTranslation } from '../../i18n/translations';
import type { FontFamily, InvoiceThemeConfig, Language, TemplateId } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PricingModal } from '../SaaS/PricingModal';

interface ThemeTemplatePickerProps {
  themeConfig: InvoiceThemeConfig;
  onChange: (updated: InvoiceThemeConfig) => void;
  language: Language;
}

const UNLOCKED_FREE_TEMPLATES: TemplateId[] = [
  'modern',
  'editorial',
  'atmospheric',
  'corporate',
  'risograph',
];

const UNLOCKED_FREE_FONTS: FontFamily[] = ['inter'];

export const ThemeTemplatePicker: React.FC<ThemeTemplatePickerProps> = ({
  themeConfig,
  onChange,
  language,
}) => {
  const t = getTranslation(language);
  const { plan } = useAuth();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [lockedFeatureName, setLockedFeatureName] = useState<string | undefined>();

  const handleTemplateSelect = (id: TemplateId) => {
    const isLocked = plan === 'free' && !UNLOCKED_FREE_TEMPLATES.includes(id);
    if (isLocked) {
      const selectedTpl = TEMPLATES.find((t) => t.id === id);
      setLockedFeatureName(`Tema ${selectedTpl?.id || id}`);
      setIsPricingModalOpen(true);
      return;
    }

    const selectedTpl = TEMPLATES.find((tpl) => tpl.id === id);
    onChange({
      ...themeConfig,
      templateId: id,
      primaryColor: selectedTpl?.defaultColor || themeConfig.primaryColor,
      fontFamily: selectedTpl?.defaultFont || themeConfig.fontFamily,
    });
  };

  const handleFontSelect = (fontId: FontFamily) => {
    const isLocked = plan === 'free' && !UNLOCKED_FREE_FONTS.includes(fontId);
    if (isLocked) {
      setLockedFeatureName(`Font Tipografi Eksklusif (${fontId})`);
      setIsPricingModalOpen(true);
      return;
    }
    onChange({ ...themeConfig, fontFamily: fontId });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Template Cards */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-indigo-500" />
              {t.chooseTemplate}
            </span>
            {plan === 'free' && (
              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Free: 5 Tema Terbuka (19 Tema PRO)
              </span>
            )}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map((tpl) => {
              const isSelected = themeConfig.templateId === tpl.id;
              const isLocked = plan === 'free' && !UNLOCKED_FREE_TEMPLATES.includes(tpl.id);
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleTemplateSelect(tpl.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                      : isLocked
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        {t[tpl.nameKey as keyof typeof t] || tpl.id}
                        {isLocked && (
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            PRO
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tpl.description[language]}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-2xs"
                        style={{ backgroundColor: tpl.defaultColor }}
                      />
                      <span className="text-[11px] font-mono text-slate-400 capitalize">
                        {tpl.defaultFont}
                      </span>
                    </div>
                    {isLocked && (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        Unlock PRO &rarr;
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Color Accent Picker */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-500" />
            {t.accentColor}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((color) => {
              const isSelected = themeConfig.primaryColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  title={color.name}
                  onClick={() => onChange({ ...themeConfig, primaryColor: color.hex })}
                  className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center relative ${
                    isSelected ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                </button>
              );
            })}

            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <input
                type="color"
                value={themeConfig.primaryColor}
                onChange={(e) => onChange({ ...themeConfig, primaryColor: e.target.value })}
                className="w-8 h-8 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                title="Custom Hex Color"
              />
              <span className="text-xs font-mono text-slate-500">{themeConfig.primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Typography & Density Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Font Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-500" />
              {t.typography}
            </label>
            <select
              value={themeConfig.fontFamily}
              onChange={(e) => handleFontSelect(e.target.value as FontFamily)}
              className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {FONT_OPTIONS.map((f) => {
                const isLocked = plan === 'free' && !UNLOCKED_FREE_FONTS.includes(f.id);
                return (
                  <option key={f.id} value={f.id}>
                    {f.name} {isLocked ? '🔒 (PRO)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Layout Density */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-indigo-500" />
              {t.layoutDensity}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['compact', 'standard', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ ...themeConfig, density: d })}
                  className={`py-1.5 text-xs font-medium capitalize rounded-lg transition ${
                    themeConfig.density === d
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {d === 'compact' ? t.densityCompact : d === 'spacious' ? t.densitySpacious : t.densityStandard}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        language={language}
        lockedFeatureName={lockedFeatureName}
      />
    </>
  );
};
