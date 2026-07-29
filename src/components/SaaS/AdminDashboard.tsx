import React, { useState } from 'react';
import {
  Users,
  FileText,
  DollarSign,
  ShieldCheck,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  UserCheck,
  UserX,
  Eye,
  Sliders,
  Activity,
  Building2,
  Plus,
  Pencil,
  X,
  Save,
} from 'lucide-react';
import type { Invoice, Language, AppTheme, UserProfile } from '../../types';

// Admin-only email whitelist
const ADMIN_EMAILS = ['99apps.id@gmail.com', 'support@99apps.id'];

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  joinedAt: string;
  profilesCount: number;
  invoicesCount: number;
  totalVolume: number;
}

interface AdminDashboardProps {
  invoices: Invoice[];
  profiles: UserProfile[];
  language: Language;
  theme?: AppTheme;
  onDeleteInvoice?: (id: string) => void;
  onPreviewInvoice?: (invoice: Invoice) => void;
}

const EMPTY_USER: AdminUserItem = {
  id: '',
  name: '',
  email: '',
  role: 'user',
  status: 'active',
  joinedAt: new Date().toISOString().split('T')[0],
  profilesCount: 0,
  invoicesCount: 0,
  totalVolume: 0,
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  invoices,
  profiles,
  language: _language,
  theme = 'light',
  onDeleteInvoice,
  onPreviewInvoice,
}) => {
  const isDark = theme === 'dark';

  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'invoices' | 'settings'>('overview');

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // User CRUD Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [userForm, setUserForm] = useState<AdminUserItem>({ ...EMPTY_USER });

  // Mock users list with admin emails
  const [usersList, setUsersList] = useState<AdminUserItem[]>([
    {
      id: 'usr-admin-1',
      name: 'Admin 99apps',
      email: '99apps.id@gmail.com',
      role: 'admin',
      status: 'active',
      joinedAt: '2026-01-01',
      profilesCount: profiles.length || 2,
      invoicesCount: invoices.length || 12,
      totalVolume: invoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0), 0) || 45500000,
    },
    {
      id: 'usr-admin-2',
      name: 'Support 99apps',
      email: 'support@99apps.id',
      role: 'admin',
      status: 'active',
      joinedAt: '2026-01-01',
      profilesCount: 1,
      invoicesCount: 0,
      totalVolume: 0,
    },
    {
      id: 'usr-2',
      name: 'Budi Santoso',
      email: 'budi.santoso@nusantaradigital.co.id',
      role: 'user',
      status: 'active',
      joinedAt: '2026-02-01',
      profilesCount: 1,
      invoicesCount: 14,
      totalVolume: 68200000,
    },
    {
      id: 'usr-3',
      name: 'Rina Wijaya',
      email: 'rina.design@gmail.com',
      role: 'user',
      status: 'active',
      joinedAt: '2026-03-10',
      profilesCount: 2,
      invoicesCount: 23,
      totalVolume: 112500000,
    },
    {
      id: 'usr-4',
      name: 'Hendra Setiawan',
      email: 'hendra.store@tokopedia.com',
      role: 'user',
      status: 'active',
      joinedAt: '2026-04-20',
      profilesCount: 3,
      invoicesCount: 41,
      totalVolume: 194800000,
    },
    {
      id: 'usr-5',
      name: 'Siti Rahmawati',
      email: 'siti.catering@yahoo.com',
      role: 'user',
      status: 'suspended',
      joinedAt: '2026-05-02',
      profilesCount: 1,
      invoicesCount: 3,
      totalVolume: 12000000,
    },
  ]);

  // System settings toggles
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoQrisEngine, setAutoQrisEngine] = useState(true);
  const [inkSaverDefault, setInkSaverDefault] = useState(true);

  // ── User CRUD Handlers ──

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({ ...EMPTY_USER, id: `usr-${Date.now()}`, joinedAt: new Date().toISOString().split('T')[0] });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setUserForm({ ...user });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      showToast('Nama dan Email wajib diisi!');
      return;
    }
    if (editingUser) {
      // Update existing
      setUsersList((prev) => prev.map((u) => (u.id === editingUser.id ? { ...userForm } : u)));
      showToast(`Data pengguna "${userForm.name}" berhasil diperbarui.`);
    } else {
      // Create new
      setUsersList((prev) => [...prev, { ...userForm }]);
      showToast(`Pengguna baru "${userForm.name}" berhasil ditambahkan.`);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };


  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`Status ${u.name} diubah menjadi ${newStatus === 'active' ? 'AKTIF' : 'DITANGGUHKAN'}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      showToast(`Pengguna "${userName}" telah dihapus dari sistem.`);
    }
  };

  // ── Filtered lists ──

  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const q = invoiceSearch.toLowerCase();
    const matchSearch =
      inv.number.toLowerCase().includes(q) ||
      inv.issuer.name.toLowerCase().includes(q) ||
      inv.client.name.toLowerCase().includes(q) ||
      inv.client.company.toLowerCase().includes(q);
    const matchStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;
    return matchSearch && matchStatus;
  });

  // ── Stats ──

  const totalUsersCount = usersList.length;
  const totalInvoicesCount = invoices.length || 89;
  const totalVolumeRp =
    invoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0), 0) || 432900000;

  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const pendingCount = invoices.filter((i) => i.status === 'pending').length;
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;
  const draftCount = invoices.filter((i) => i.status === 'draft').length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'No Faktur,Penerbit,Klien,Tanggal,Status,Total Rp\n';
    const rows = filteredInvoices
      .map((inv) => {
        const total = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
        return `"${inv.number}","${inv.issuer.name}","${inv.client.company || inv.client.name}","${inv.issueDate}","${inv.status}",${total}`;
      })
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TagihDong_All_Invoices_${Date.now()}.csv`;
    a.click();
    showToast('Laporan CSV seluruh invoice berhasil diunduh!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border animate-bounce ${isDark ? 'bg-white text-slate-900 border-indigo-400' : 'bg-slate-900 text-white border-indigo-500'}`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}

      {/* ── Add/Edit User Modal ── */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsUserModalOpen(false)}>
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-5 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg flex items-center gap-2">
                {editingUser ? <Pencil className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button type="button" onClick={() => setIsUserModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Nama Lengkap *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Nama pengguna"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="email@contoh.com"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'user' })}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="user">User Biasa</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value as 'active' | 'suspended' })}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="active">Aktif</option>
                    <option value="suspended">Ditangguhkan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Jumlah Profil Usaha</label>
                  <input
                    type="number"
                    min={0}
                    value={userForm.profilesCount}
                    onChange={(e) => setUserForm({ ...userForm, profilesCount: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Jumlah Invoice</label>
                  <input
                    type="number"
                    min={0}
                    value={userForm.invoicesCount}
                    onChange={(e) => setUserForm({ ...userForm, invoicesCount: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className={`px-5 py-2.5 rounded-2xl border text-xs font-bold transition ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Title & Tab Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Admin Dashboard
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pusat Kontrol Manajemen Pengguna, Faktur & Operasional Sistem
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className={`flex items-center gap-1 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300/60'}`}>
          {([
            { key: 'overview', label: 'Ringkasan', icon: Activity },
            { key: 'users', label: `User (${usersList.length})`, icon: Users },
            { key: 'invoices', label: `Invoice (${invoices.length})`, icon: FileText },
            { key: 'settings', label: 'Pengaturan', icon: Sliders },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setAdminTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                adminTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total User Terdaftar', value: totalUsersCount, icon: Users, color: 'indigo', growth: '↑ 24%' },
              { label: 'Total Faktur Diterbitkan', value: totalInvoicesCount, icon: FileText, color: 'purple', growth: '↑ 38%' },
              { label: 'Total Omzet Tagihan', value: `Rp ${(totalVolumeRp / 1000000).toFixed(1)}Jt`, icon: DollarSign, color: 'emerald', growth: `Rp ${totalVolumeRp.toLocaleString('id-ID')}`, isMonetary: true },
              { label: 'Profil Usaha Aktif', value: profiles.length || 3, icon: Building2, color: 'amber' },
            ].map((card, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border space-y-3 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</span>
                  <div className={`w-10 h-10 rounded-2xl bg-${card.color}-500/10 text-${card.color}-600 dark:text-${card.color}-400 flex items-center justify-center`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className={`text-3xl font-black ${card.isMonetary ? 'text-emerald-600 dark:text-emerald-400 font-mono text-2xl' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {card.value}
                  </span>
                  {card.growth && (
                    <span className={`text-xs font-bold ml-2 ${card.isMonetary ? 'text-emerald-500 block' : 'text-emerald-500'}`}>{card.growth}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Status Distribution */}
          <div className={`p-8 rounded-3xl border space-y-5 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Distribusi Status Seluruh Faktur
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Lunas (Paid)', count: paidCount || 58, icon: CheckCircle2, scheme: 'emerald' },
                { label: 'Menunggu (Pending)', count: pendingCount || 18, icon: Clock, scheme: 'amber' },
                { label: 'Jatuh Tempo (Overdue)', count: overdueCount || 8, icon: AlertCircle, scheme: 'rose' },
                { label: 'Draft Faktur', count: draftCount || 5, icon: FileCheck, scheme: 'slate' },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border space-y-1 bg-${item.scheme}-50 dark:bg-${item.scheme}-950/60 border-${item.scheme}-200 dark:border-${item.scheme}-900/60`}>
                  <span className={`text-xs font-bold text-${item.scheme}-700 dark:text-${item.scheme}-300 block flex items-center gap-1.5`}>
                    <item.icon className={`w-4 h-4 text-${item.scheme}-500`} /> {item.label}
                  </span>
                  <span className={`text-2xl font-black text-${item.scheme}-600 dark:text-${item.scheme}-400 font-mono`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ USER MANAGEMENT TAB ═══════════ */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          {/* Search + Filter + Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pengguna berdasarkan nama atau email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className={`px-3 py-2.5 rounded-2xl border text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              >
                <option value="all">Semua Role</option>
                <option value="admin">Super Admin</option>
                <option value="user">User Biasa</option>
              </select>

              <button
                type="button"
                onClick={openAddUserModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah User</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className={`border rounded-3xl overflow-hidden shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b font-extrabold uppercase tracking-wider ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <tr>
                    <th className="py-3.5 px-4">Pengguna</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Profil</th>
                    <th className="py-3.5 px-4">Invoice</th>
                    <th className="py-3.5 px-4 text-right">Volume Transaksi</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-slate-400 font-medium">
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className={`transition ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span className={`font-extrabold block text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.name}</span>
                              <span className="text-[10px] text-slate-400 block">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30'
                              : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {u.role === 'admin' ? 'Super Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                            u.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          }`}>
                            {u.status === 'active' ? '✓ Aktif' : '✕ Suspended'}
                          </span>
                        </td>
                        <td className={`py-4 px-4 font-bold font-mono ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{u.profilesCount}</td>
                        <td className={`py-4 px-4 font-bold font-mono ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{u.invoicesCount}</td>
                        <td className="py-4 px-4 text-right font-black font-mono text-emerald-600 dark:text-emerald-400">
                          Rp {u.totalVolume.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => openEditUserModal(u)} className={`p-1.5 rounded-lg border transition ${isDark ? 'border-slate-700 hover:bg-indigo-950 text-indigo-400' : 'border-slate-200 hover:bg-indigo-50 text-indigo-600'}`} title="Edit User">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => handleToggleUserStatus(u.id)} className={`p-1.5 rounded-lg border transition ${u.status === 'active' ? isDark ? 'border-rose-800 text-rose-400 hover:bg-rose-950' : 'border-rose-200 text-rose-600 hover:bg-rose-50' : isDark ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-950' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`} title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                              {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                            <button type="button" onClick={() => handleDeleteUser(u.id, u.name)} className={`p-1.5 rounded-lg border transition ${isDark ? 'border-rose-900 text-rose-500 hover:bg-rose-950' : 'border-rose-200 text-rose-600 hover:bg-rose-50'}`} title="Hapus User">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ INVOICES TAB ═══════════ */}
      {adminTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari No Invoice, Penerbit, atau Klien..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-2xl border text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              >
                <option value="all">Semua Status</option>
                <option value="paid">Lunas</option>
                <option value="pending">Menunggu</option>
                <option value="overdue">Jatuh Tempo</option>
                <option value="draft">Draft</option>
              </select>
              <button type="button" onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md transition">
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          <div className={`border rounded-3xl overflow-hidden shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b font-extrabold uppercase tracking-wider ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <tr>
                    <th className="py-3.5 px-4">No. Invoice</th>
                    <th className="py-3.5 px-4">Penerbit</th>
                    <th className="py-3.5 px-4">Klien</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Nominal</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-slate-400 font-medium">
                        {invoices.length === 0 ? 'Belum ada invoice yang dibuat oleh pengguna.' : 'Tidak ada invoice yang cocok dengan filter.'}
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const total = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
                      return (
                        <tr key={inv.id} className={`transition ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                          <td className="py-4 px-4 font-mono">
                            <span className={`font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.number}</span>
                            <span className="text-[10px] text-slate-400 block">{inv.issueDate}</span>
                          </td>
                          <td className={`py-4 px-4 font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{inv.issuer.name}</td>
                          <td className="py-4 px-4">
                            <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.client.company || inv.client.name}</span>
                            <span className="text-[10px] text-slate-400 block">{inv.client.email}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase ${
                              inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : inv.status === 'pending' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              : inv.status === 'overdue' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>{inv.status}</span>
                          </td>
                          <td className="py-4 px-4 text-right font-black font-mono text-indigo-600 dark:text-indigo-400">
                            Rp {total.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {onPreviewInvoice && (
                                <button type="button" onClick={() => onPreviewInvoice(inv)} className={`p-1.5 rounded-lg border transition ${isDark ? 'border-slate-700 hover:bg-indigo-950 text-indigo-400' : 'border-slate-200 hover:bg-indigo-50 text-indigo-600'}`} title="Preview">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {onDeleteInvoice && (
                                <button type="button" onClick={() => onDeleteInvoice(inv.id)} className={`p-1.5 rounded-lg border transition ${isDark ? 'border-rose-900 text-rose-500 hover:bg-rose-950' : 'border-rose-200 text-rose-600 hover:bg-rose-50'}`} title="Hapus">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SETTINGS TAB ═══════════ */}
      {adminTab === 'settings' && (
        <div className="space-y-6">
          <div className={`p-8 rounded-3xl border space-y-6 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Pengaturan & Kontrol Operasional Platform
            </h3>

            {/* Admin Email Info */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-950 border-indigo-800' : 'bg-indigo-50 border-indigo-200'}`}>
              <h4 className={`font-extrabold text-sm mb-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>Email Admin Terdaftar</h4>
              <ul className="space-y-1 text-xs font-mono">
                <li className={isDark ? 'text-indigo-200' : 'text-indigo-800'}>• 99apps.id@gmail.com</li>
                <li className={isDark ? 'text-indigo-200' : 'text-indigo-800'}>• support@99apps.id</li>
              </ul>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Mode Perawatan Sistem (Maintenance Mode)', desc: 'Aktifkan untuk mengunci pembuatan faktur sementara.', state: maintenanceMode, toggle: () => { setMaintenanceMode(!maintenanceMode); showToast(`Maintenance Mode ${!maintenanceMode ? 'AKTIF' : 'NONAKTIF'}`); } },
                { label: 'Auto QRIS Static Barcode Cropper', desc: 'Otomatis potong & sesuaikan proporsi barcode QRIS.', state: autoQrisEngine, toggle: () => { setAutoQrisEngine(!autoQrisEngine); showToast(`Auto QRIS Engine ${!autoQrisEngine ? 'AKTIF' : 'NONAKTIF'}`); } },
                { label: 'Default Engine Ink-Saver A4', desc: 'Template faktur baru selalu menggunakan latar putih ramah tinta.', state: inkSaverDefault, toggle: () => { setInkSaverDefault(!inkSaverDefault); showToast(`Ink-Saver ${!inkSaverDefault ? 'AKTIF' : 'NONAKTIF'}`); } },
              ].map((setting, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <h4 className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{setting.label}</h4>
                    <p className="text-xs text-slate-400">{setting.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={setting.toggle}
                    className={`w-12 h-6 rounded-full transition p-1 flex items-center ${setting.state ? 'bg-indigo-600 justify-end' : isDark ? 'bg-slate-700 justify-start' : 'bg-slate-300 justify-start'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
