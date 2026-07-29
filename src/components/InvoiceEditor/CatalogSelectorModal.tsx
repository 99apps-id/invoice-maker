import React, { useState } from 'react';
import { X, Search, Package } from 'lucide-react';
import type { CatalogItem, CurrencyCode, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { formatCurrency } from '../../utils/formatters';

interface CatalogSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogItem[];
  currency: CurrencyCode;
  onSelectCatalogItem: (item: CatalogItem) => void;
  language: Language;
}

export const CatalogSelectorModal: React.FC<CatalogSelectorModalProps> = ({
  isOpen,
  onClose,
  catalog,
  currency,
  onSelectCatalogItem,
  language,
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'product' | 'service'>('all');

  if (!isOpen) return null;

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ? true : (item.category || 'service') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            {t.selectFromCatalog}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.catAll}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('product')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === 'product'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.catProduct}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('service')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === 'service'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.catService}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {filteredCatalog.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                Tidak ada produk/layanan di kategori ini.
              </p>
            ) : (
              filteredCatalog.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectCatalogItem(item);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition group flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        item.category === 'product'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                      }`}>
                        {item.category === 'product' ? t.catProduct : t.catService}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span className="font-bold text-sm font-mono text-slate-900 dark:text-white block">
                      {formatCurrency(item.unitPrice, currency, language)}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      / {item.unit || 'pcs'}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
