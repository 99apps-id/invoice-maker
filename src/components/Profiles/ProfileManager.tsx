import React, { useState } from 'react';
import { Plus, Briefcase, CheckCircle, Edit3, Trash2, Landmark } from 'lucide-react';
import type { CurrencyCode, Language, UserProfile } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { lookupSwiftCode } from '../../constants/banks';
import { BankSelectorInput } from '../UI/BankSelectorInput';
import { QrisCropperModal } from '../UI/QrisCropperModal';

interface ProfileManagerProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectActiveProfile: (id: string) => void;
  onSaveProfile: (profile: UserProfile) => void;
  onDeleteProfile: (id: string) => void;
  language: Language;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfileId,
  onSelectActiveProfile,
  onSaveProfile,
  onDeleteProfile,
  language,
}) => {
  const t = getTranslation(language);
  const [editingProfile, setEditingProfile] = useState<Partial<UserProfile> | null>(null);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingProfile({
      id: `prof-${Date.now()}`,
      name: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      logoUrl: '',
      taxId: '',
      website: '',
      bankName: '',
      bankAccountNo: '',
      bankAccountName: '',
      swiftCode: '',
      qrisUrl: '',
      defaultCurrency: 'IDR',
      businessType: 'general',
      isDefault: false,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile || !editingProfile.name) return;

    onSaveProfile({
      id: editingProfile.id || `prof-${Date.now()}`,
      name: editingProfile.name || '',
      ownerName: editingProfile.ownerName || '',
      email: editingProfile.email || '',
      phone: editingProfile.phone || '',
      address: editingProfile.address || '',
      logoUrl: editingProfile.logoUrl || '',
      taxId: editingProfile.taxId || '',
      website: editingProfile.website || '',
      bankName: editingProfile.bankName || '',
      bankAccountNo: editingProfile.bankAccountNo || '',
      bankAccountName: editingProfile.bankAccountName || '',
      swiftCode: editingProfile.swiftCode || '',
      qrisUrl: editingProfile.qrisUrl || '',
      defaultCurrency: (editingProfile.defaultCurrency as CurrencyCode) || 'IDR',
      businessType: editingProfile.businessType || 'general',
      isDefault: editingProfile.isDefault || false,
    });

    setEditingProfile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            {t.profilesTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.profileDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs btn-hallmark"
        >
          <Plus className="w-4 h-4" />
          {t.newProfile}
        </button>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          return (
            <div
              key={profile.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt={profile.name}
                        className="w-12 h-12 rounded-xl object-contain border border-slate-200 dark:border-slate-700 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {profile.name}
                      </h3>
                      {profile.ownerName && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {profile.ownerName}
                        </p>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p>{profile.address}</p>
                  <p>
                    {profile.email} • {profile.phone}
                  </p>
                  {profile.taxId && (
                    <p className="font-mono text-[11px] text-slate-400">NPWP: {profile.taxId}</p>
                  )}
                  {profile.bankName && (
                    <p className="flex items-center gap-1 text-slate-500 pt-1">
                      <Landmark className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.bankName} - {profile.bankAccountNo} ({profile.bankAccountName})</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {!isActive ? (
                  <button
                    type="button"
                    onClick={() => onSelectActiveProfile(profile.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
                  >
                    Ganti ke Profil Ini
                  </button>
                ) : (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    Profil Sedang Digunakan
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(profile)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteProfile(profile.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {editingProfile.id ? 'Edit Profil Bisnis' : t.newProfile}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.companyName}
                </label>
                <input
                  type="text"
                  value={editingProfile.name || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  placeholder="e.g. PT Nusantara Digital Creative"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.ownerName}
                  </label>
                  <input
                    type="text"
                    value={editingProfile.ownerName || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, ownerName: e.target.value })}
                    placeholder="e.g. Budi Santoso, S.Kom"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    URL Logo Perusahaan
                  </label>
                  <input
                    type="text"
                    value={editingProfile.logoUrl || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.businessTypeLabel}
                </label>
                <select
                  value={editingProfile.businessType || 'general'}
                  onChange={(e) => setEditingProfile({ ...editingProfile, businessType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  <option value="trading">{t.btTrading}</option>
                  <option value="service">{t.btService}</option>
                  <option value="repair">{t.btRepair}</option>
                  <option value="retail">{t.btRetail}</option>
                  <option value="general">{t.btGeneral}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={editingProfile.email || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.phone}
                  </label>
                  <input
                    type="text"
                    value={editingProfile.phone || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.address}
                </label>
                <textarea
                  value={editingProfile.address || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.taxId}
                  </label>
                  <input
                    type="text"
                    value={editingProfile.taxId || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, taxId: e.target.value })}
                    placeholder="01.234.567.8-012.000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.website}
                  </label>
                  <input
                    type="text"
                    value={editingProfile.website || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, website: e.target.value })}
                    placeholder="https://mycompany.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Banking Details Header */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Detail Rekening Bank & Pembayaran
                </span>
                <div className="space-y-3">
                  <BankSelectorInput
                    bankName={editingProfile.bankName || ''}
                    swiftCode={editingProfile.swiftCode || ''}
                    onSelectBank={(bName, sCode) => {
                      setEditingProfile({
                        ...editingProfile,
                        bankName: bName,
                        swiftCode: sCode,
                      });
                    }}
                    onBankNameChange={(bName) => {
                      const autoSwift = lookupSwiftCode(bName);
                      setEditingProfile({
                        ...editingProfile,
                        bankName: bName,
                        swiftCode: autoSwift || editingProfile.swiftCode || '',
                      });
                    }}
                    onSwiftCodeChange={(sCode) =>
                      setEditingProfile({ ...editingProfile, swiftCode: sCode })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        {t.accountNo}
                      </label>
                      <input
                        type="text"
                        value={editingProfile.bankAccountNo || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, bankAccountNo: e.target.value })}
                        placeholder="883-0492-109"
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        {t.accountName}
                      </label>
                      <input
                        type="text"
                        value={editingProfile.bankAccountName || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, bankAccountName: e.target.value })}
                        placeholder="Nama di Rekening"
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* QRIS Upload & Crop Option */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Barcode QRIS Statis (Opsional)
                    </label>
                    <div className="flex items-center justify-between gap-3">
                      {editingProfile.qrisUrl ? (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <img
                            src={editingProfile.qrisUrl}
                            alt="QRIS Preview"
                            className="w-8 h-8 rounded-md object-contain bg-white"
                          />
                          <span className="text-[10px] font-bold text-emerald-600">QRIS Statis Aktif</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Belum ada QRIS statis diupload</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsQrisModalOpen(true)}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                      >
                        {editingProfile.qrisUrl ? 'Ubah / Potong QRIS' : 'Upload & Crop QRIS'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QRIS Upload & Crop Modal */}
      {editingProfile && (
        <QrisCropperModal
          isOpen={isQrisModalOpen}
          onClose={() => setIsQrisModalOpen(false)}
          currentQrisUrl={editingProfile.qrisUrl}
          onSaveQrisUrl={(qUrl) => setEditingProfile({ ...editingProfile, qrisUrl: qUrl })}
          language={language}
        />
      )}
    </div>
  );
};
