import React, { useState } from 'react';
import { Plus, Package, Trash2, Edit3, Search } from 'lucide-react';
import type { CatalogItem, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { formatCurrency } from '../../utils/formatters';

interface ItemCatalogManagerProps {
  catalog: CatalogItem[];
  activeProfileId: string;
  onSaveCatalogItem: (item: CatalogItem) => void;
  onDeleteCatalogItem: (id: string) => void;
  language: Language;
}

export const ItemCatalogManager: React.FC<ItemCatalogManagerProps> = ({
  catalog,
  activeProfileId,
  onSaveCatalogItem,
  onDeleteCatalogItem,
  language,
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'product' | 'service'>('all');
  const [editingItem, setEditingItem] = useState<Partial<CatalogItem> | null>(null);

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ? true : (item.category || 'service') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenNew = () => {
    setEditingItem({
      id: `cat-${Date.now()}`,
      profileId: activeProfileId,
      name: '',
      description: '',
      unitPrice: 0,
      unit: 'pcs',
      defaultTaxRate: 11,
      category: 'product',
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;

    onSaveCatalogItem({
      id: editingItem.id || `cat-${Date.now()}`,
      profileId: activeProfileId,
      name: editingItem.name || '',
      description: editingItem.description || '',
      unitPrice: editingItem.unitPrice || 0,
      unit: editingItem.unit || 'pcs',
      defaultTaxRate: editingItem.defaultTaxRate || 0,
      category: editingItem.category || 'product',
    });

    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            {t.catalogTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simpan daftar produk dan tarif jasa standar untuk dimasukkan cepat ke faktur.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs btn-hallmark"
        >
          <Plus className="w-4 h-4" />
          {t.newItem}
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.catAll}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('product')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === 'product'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.catProduct}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('service')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === 'service'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.catService}
          </button>
        </div>
      </div>

      {/* Grid of Catalog Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-400 transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mb-1 border ${
                    item.category === 'product'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  }`}>
                    {item.category === 'product' ? t.catProduct : t.catService}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                    {item.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCatalogItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Harga Standar</span>
                <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                  {formatCurrency(item.unitPrice, 'IDR', language)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium"> / {item.unit}</span>
              </div>

              {item.defaultTaxRate > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  PPN {item.defaultTaxRate}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {editingItem.id ? 'Edit Produk / Jasa' : t.newItem}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.selectCategory}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, category: 'product' })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                      editingItem.category === 'product' || (!editingItem.category && selectedCategory === 'product')
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t.catProduct}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, category: 'service' })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                      editingItem.category === 'service' || (!editingItem.category && selectedCategory === 'service')
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t.catService}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Barang / Layanan
                </label>
                <input
                  type="text"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Desain Website Landing Page / Router Access Point"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi & Spesifikasi
                </label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  placeholder="Rincian deskripsi standar..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Harga Satuan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.unitPrice || 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, unitPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={editingItem.unit || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                    placeholder="proyek / jam / pcs"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Default Pajak (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.defaultTaxRate || 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        defaultTaxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {t.saveCatalogItem}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
