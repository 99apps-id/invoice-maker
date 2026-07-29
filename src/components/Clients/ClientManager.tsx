import React, { useState } from 'react';
import { Plus, User, Trash2, Edit3, Search, Mail, Phone, MapPin } from 'lucide-react';
import type { Client, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface ClientManagerProps {
  clients: Client[];
  activeProfileId: string;
  onSaveClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  language: Language;
}

export const ClientManager: React.FC<ClientManagerProps> = ({
  clients,
  activeProfileId,
  onSaveClient,
  onDeleteClient,
  language,
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingClient({
      id: `cli-${Date.now()}`,
      profileId: activeProfileId,
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || (!editingClient.name && !editingClient.company)) return;

    onSaveClient({
      id: editingClient.id || `cli-${Date.now()}`,
      profileId: activeProfileId,
      name: editingClient.name || '',
      company: editingClient.company || '',
      email: editingClient.email || '',
      phone: editingClient.phone || '',
      address: editingClient.address || '',
      taxId: editingClient.taxId || '',
    });

    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            {t.clientsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola kontak klien dan informasi tagihan perusahaan untuk pembuatan invoice cepat.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs btn-hallmark"
        >
          <Plus className="w-4 h-4" />
          {t.newClient}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
        />
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-400 transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {client.company || client.name}
                  </h3>
                  {client.company && (
                    <span className="text-xs font-medium text-slate-500 block">
                      Attn: {client.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingClient(client)}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClient(client.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                {client.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </p>
                )}
                {client.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{client.phone}</span>
                  </p>
                )}
                {client.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{client.address}</span>
                  </p>
                )}
                {client.taxId && (
                  <p className="font-mono text-[11px] text-slate-400 pt-1">
                    NPWP: {client.taxId}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {editingClient.id ? 'Edit Klien' : t.newClient}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.companyName}
                </label>
                <input
                  type="text"
                  value={editingClient.company || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  placeholder="PT Global Solusi Gemilang"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.ownerName}
                </label>
                <input
                  type="text"
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder="Ibu Rina Wijaya"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={editingClient.email || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.phone}
                  </label>
                  <input
                    type="text"
                    value={editingClient.phone || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.address}
                </label>
                <textarea
                  value={editingClient.address || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.taxId}
                </label>
                <input
                  type="text"
                  value={editingClient.taxId || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, taxId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {t.saveClient}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
