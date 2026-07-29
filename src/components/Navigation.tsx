import React from 'react';
import { FileEdit, History, Users, Package, Briefcase, ShieldCheck } from 'lucide-react';
import type { Language, AppTheme } from '../types';
import { getTranslation } from '../i18n/translations';

export type TabType = 'editor' | 'history' | 'clients' | 'catalog' | 'profiles' | 'admin';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  theme?: AppTheme;
  isAdmin?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  theme = 'light',
  isAdmin = false,
}) => {
  const t = getTranslation(language);
  const isDark = theme === 'dark';

  const baseTabs: { id: TabType; label: string; icon: React.ReactNode; isBadge?: boolean }[] = [
    { id: 'editor', label: t.navEditor, icon: <FileEdit className="w-4 h-4" /> },
    { id: 'history', label: t.navHistory, icon: <History className="w-4 h-4" /> },
    { id: 'clients', label: t.navClients, icon: <Users className="w-4 h-4" /> },
    { id: 'catalog', label: t.navCatalog, icon: <Package className="w-4 h-4" /> },
    { id: 'profiles', label: t.navProfiles, icon: <Briefcase className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    baseTabs.push({
      id: 'admin',
      label: t.navAdmin,
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      isBadge: true,
    });
  }

  return (
    <nav className={`no-print border-b transition-colors duration-300 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {baseTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
