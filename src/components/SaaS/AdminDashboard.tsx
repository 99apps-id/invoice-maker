import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  UserRoundCheck,
} from 'lucide-react';
import type { AppTheme } from '../../types';

const ADMIN_EMAILS = ['99apps.id@gmail.com', 'support@99apps.id'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'admin' | 'user';
  joinedAt: string;
  profilesCount: number;
  invoicesCount: number;
  totalVolume: number;
}

interface AdminDashboardProps {
  token: string | null;
  theme?: AppTheme;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!token) {
      setError('Sesi admin tidak ditemukan. Silakan masuk kembali.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !Array.isArray(data)) {
        throw new Error(data.error || 'Daftar pengguna belum bisa dimuat.');
      }

      setUsers(
        data.map((item) => ({
          id: String(item.id),
          name: String(item.name || 'Tanpa nama'),
          email: String(item.email),
          picture: item.picture ? String(item.picture) : undefined,
          role: item.role === 'admin' ? 'admin' : 'user',
          joinedAt: String(item.created_at),
          profilesCount: Number(item.profiles_count) || 0,
          invoicesCount: Number(item.invoices_count) || 0,
          totalVolume: Number(item.total_volume) || 0,
        }))
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Daftar pengguna belum bisa dimuat.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [roleFilter, search, users]);

  const stats = useMemo(
    () => ({
      users: users.length,
      businesses: users.reduce((sum, user) => sum + user.profilesCount, 0),
      invoices: users.reduce((sum, user) => sum + user.invoicesCount, 0),
      activeAccounts: users.length,
    }),
    [users]
  );

  const panel = isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <section className="space-y-6" aria-labelledby="admin-title">
      <div className={`flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="admin-title" className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Pengguna Tagih Dong
            </h2>
            <p className={`mt-0.5 text-sm ${muted}`}>
              Data akun yang benar-benar tersimpan di sistem.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          {loading ? 'Memuat…' : 'Perbarui data'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Pengguna', value: stats.users, icon: Users },
          { label: 'Profil usaha', value: stats.businesses, icon: Building2 },
          { label: 'Invoice tersimpan', value: stats.invoices, icon: FileText },
          { label: 'Akun aktif', value: stats.activeAccounts, icon: UserRoundCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className={`rounded-xl border p-4 ${panel}`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`text-sm font-medium ${muted}`}>{label}</span>
              <Icon className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            </div>
            <p className={`mt-3 text-2xl font-extrabold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {loading ? '—' : value.toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Cari pengguna</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau email…"
            className={`min-h-11 w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${panel}`}
          />
        </label>
        <label>
          <span className="sr-only">Saring berdasarkan peran</span>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
            className={`min-h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-44 ${panel}`}
          >
            <option value="all">Semua peran</option>
            <option value="admin">Admin</option>
            <option value="user">Pengguna</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className={`rounded-xl border p-5 ${isDark ? 'border-rose-900 bg-rose-950/40' : 'border-rose-200 bg-rose-50'}`} role="alert">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <p className={`font-semibold ${isDark ? 'text-rose-200' : 'text-rose-900'}`}>Data belum berhasil dimuat</p>
              <p className={`mt-1 text-sm ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>{error}</p>
              <button type="button" onClick={() => void loadUsers()} className="mt-3 text-sm font-semibold text-rose-700 underline underline-offset-4 dark:text-rose-300">
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panel}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className={`border-b ${isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                <tr>
                  <th className="px-4 py-3 font-semibold">Pengguna</th>
                  <th className="px-4 py-3 font-semibold">Peran</th>
                  <th className="px-4 py-3 text-right font-semibold">Profil</th>
                  <th className="px-4 py-3 text-right font-semibold">Invoice</th>
                  <th className="px-4 py-3 text-right font-semibold">Nilai item</th>
                  <th className="px-4 py-3 font-semibold">Bergabung</th>
                </tr>
              </thead>
              <tbody className={isDark ? 'divide-y divide-slate-800' : 'divide-y divide-slate-100'}>
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={6} className="px-4 py-4">
                          <div className={`h-9 animate-pulse rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                        </td>
                      </tr>
                    ))
                  : filteredUsers.map((user) => (
                      <tr key={user.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {user.picture ? (
                              <img src={user.picture} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className={`max-w-60 truncate font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                              <p className={`max-w-60 truncate text-xs ${muted}`}>{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={user.role === 'admin' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : muted}>
                            {user.role === 'admin' ? 'Admin' : 'Pengguna'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">{user.profilesCount}</td>
                        <td className="px-4 py-4 text-right tabular-nums">{user.invoicesCount}</td>
                        <td className="px-4 py-4 text-right font-medium tabular-nums">{formatCurrency(user.totalVolume)}</td>
                        <td className={`px-4 py-4 ${muted}`}>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatDate(user.joinedAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                {!loading && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className={`px-4 py-14 text-center ${muted}`}>
                      {users.length === 0
                        ? 'Belum ada pengguna yang terdaftar.'
                        : 'Tidak ada pengguna yang cocok dengan pencarian.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!loading && users.length > 0 && (
            <div className={`border-t px-4 py-3 text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
              Menampilkan {filteredUsers.length} dari {users.length} pengguna.
            </div>
          )}
        </div>
      )}
    </section>
  );
};
