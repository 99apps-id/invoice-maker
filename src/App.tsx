import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { TabType } from './components/Navigation';
import { InvoiceForm } from './components/InvoiceEditor/InvoiceForm';
import { InvoicePaper } from './components/InvoicePreview/InvoicePaper';
import { InvoiceList } from './components/Dashboard/InvoiceList';
import { ClientManager } from './components/Clients/ClientManager';
import { ItemCatalogManager } from './components/Catalog/ItemCatalogManager';
import { ProfileManager } from './components/Profiles/ProfileManager';
import { LandingPagePolished } from './components/SaaS/LandingPagePolished';
import { AdminDashboard, isAdminEmail } from './components/SaaS/AdminDashboard';
import { useAuth } from './context/AuthContext';
import type {
  AppTheme,
  CatalogItem,
  Client,
  Invoice,
  Language,
  UserProfile,
} from './types';
import {
  getActiveProfileId,
  loadCatalog,
  loadClients,
  loadInvoices,
  loadProfiles,
  saveCatalog,
  saveClients,
  saveInvoices,
  saveProfiles,
  setActiveProfileId as persistActiveProfileId,
} from './utils/storage';
import { generateInvoiceNumber } from './utils/formatters';
import { CheckCircle2, Eye } from 'lucide-react';
import { getTranslation } from './i18n/translations';

export function App() {
  const { user, token, isAuthenticated } = useAuth();
  const isAdmin = isAdminEmail(user?.email) || user?.role === 'admin';

  // Application settings
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [language, setLanguage] = useState<Language>('id');
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('tagihdong_theme');
    return (saved as AppTheme) || 'light';
  });
  const [activeTab, setActiveTab] = useState<TabType>('editor');

  // Sync document theme class
  useEffect(() => {
    if (appTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tagihdong_theme', appTheme);
  }, [appTheme]);

  // Guard: Automatically return to landing page on logout, or transition to workspace upon login
  useEffect(() => {
    if (!isAuthenticated) {
      setViewMode('landing');
    } else {
      setViewMode('app');
    }
  }, [isAuthenticated]);

  // App Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [profiles, setProfiles] = useState<UserProfile[]>(loadProfiles());
  const [activeProfileId, setActiveProfileIdState] = useState<string>(getActiveProfileId());
  const [clients, setClients] = useState<Client[]>(loadClients());
  const [catalog, setCatalog] = useState<CatalogItem[]>(loadCatalog());
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices());

  // Active profile object
  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
      id: 'prof-1',
      name: 'Usaha Saya',
      ownerName: 'Owner',
      email: 'owner@example.com',
      phone: '',
      address: '',
      defaultCurrency: 'IDR',
    };

  // Active editing invoice
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(() => {
    const activeInvoices = invoices.filter((i) => i.profileId === activeProfileId);
    if (activeInvoices.length > 0) return activeInvoices[0];

    const profileClients = clients.filter((c) => c.profileId === activeProfileId);
    const defaultClient = profileClients[0] || {
      id: 'cli-temp',
      profileId: activeProfileId,
      name: 'Klien Umum',
      company: 'PT Pembeli Sukses',
      email: 'client@example.com',
      phone: '+62 812-3456-7890',
      address: 'Jl. Sudirman No. 100, Jakarta Pusat',
    };

    return {
      id: `inv-${Date.now()}`,
      profileId: activeProfileId,
      number: generateInvoiceNumber(invoices.length),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      language: 'id',
      currency: activeProfile.defaultCurrency || 'IDR',
      issuer: activeProfile,
      client: defaultClient,
      items: [
        {
          id: `li-${Date.now()}`,
          name: 'Jasa Pembuatan Design & Web Application',
          description: 'Pengembangan sistem web profesional dengan dukungan multi-tema',
          quantity: 1,
          unitPrice: 15000000,
          unit: 'Proyek',
          taxRate: 11,
          discount: 0,
          discountType: 'percent',
        },
      ],
      taxName: 'PPN',
      shippingFee: 0,
      notes: 'Terima kasih atas kepercayaan Anda! Pembayaran dapat ditransfer ke rekening di atas.',
      paymentTerms: 'Jatuh tempo pembayaran 30 hari sejak invoice diterbitkan.',
      theme: {
        templateId: 'modern',
        primaryColor: '#4f46e5',
        fontFamily: 'inter',
        density: 'standard',
        showWatermark: true,
        watermarkText: '',
        showQrPayment: true,
        showSignature: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Toggle Dark / Light Theme
  const handleToggleTheme = () => {
    const newTheme = appTheme === 'light' ? 'dark' : 'light';
    setAppTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch Active Profile
  const handleSelectProfile = (id: string) => {
    setActiveProfileIdState(id);
    persistActiveProfileId(id);

    const prof = profiles.find((p) => p.id === id);
    if (prof) {
      setCurrentInvoice((prev) => ({
        ...prev,
        profileId: id,
        issuer: prof,
        currency: prof.defaultCurrency || prev.currency,
      }));
    }
    showToast(`Profil aktif diganti ke: ${prof?.name}`);
  };

  // Save current invoice
  const handleSaveInvoice = () => {
    const existingIdx = invoices.findIndex((i) => i.id === currentInvoice.id);
    let updatedList: Invoice[];
    if (existingIdx >= 0) {
      updatedList = invoices.map((i) => (i.id === currentInvoice.id ? currentInvoice : i));
    } else {
      updatedList = [currentInvoice, ...invoices];
    }
    setInvoices(updatedList);
    saveInvoices(updatedList);
    showToast(getTranslation(language).savedSuccess);
  };

  // Create new blank invoice
  const handleNewInvoice = () => {
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      profileId: activeProfileId,
      number: generateInvoiceNumber(invoices.length),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      language: language,
      currency: activeProfile.defaultCurrency || 'IDR',
      issuer: activeProfile,
      client: clients.find((c) => c.profileId === activeProfileId) || {
        id: `cli-${Date.now()}`,
        profileId: activeProfileId,
        name: 'Nama Klien',
        company: 'PT Perusahaan Klien',
        email: 'klien@company.com',
        phone: '+62 812-0000-0000',
        address: 'Jl. Utama No. 1, Jakarta',
      },
      items: [
        {
          id: `li-${Date.now()}`,
          name: 'Pengembangan Layanan / Produk Baru',
          description: 'Spesifikasi rincian pekerjaan...',
          quantity: 1,
          unitPrice: 5000000,
          unit: 'Proyek',
          taxRate: 11,
          discount: 0,
          discountType: 'percent',
        },
      ],
      taxName: 'PPN',
      shippingFee: 0,
      notes: 'Terima kasih atas kerjasamanya.',
      paymentTerms: 'Pembayaran Net 30 hari.',
      theme: {
        templateId: 'modern',
        primaryColor: '#4f46e5',
        fontFamily: 'inter',
        density: 'standard',
        showWatermark: true,
        showQrPayment: true,
        showSignature: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentInvoice(newInv);
    setActiveTab('editor');
  };

  // Duplicate Invoice
  const handleDuplicateInvoice = (inv: Invoice) => {
    const duplicated: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      number: generateInvoiceNumber(invoices.length),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...invoices];
    setInvoices(updated);
    saveInvoices(updated);
    setCurrentInvoice(duplicated);
    setActiveTab('editor');
    showToast('Invoice berhasil diduplikat!');
  };

  // Mark invoice as paid
  const handleMarkAsPaid = (id: string) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: 'paid' as const, updatedAt: new Date().toISOString() } : inv
    );
    setInvoices(updated);
    saveInvoices(updated);
    if (currentInvoice.id === id) {
      setCurrentInvoice((prev) => ({ ...prev, status: 'paid' }));
    }
    showToast(getTranslation(language).congratsPaid);
  };

  // Delete invoice
  const handleDeleteInvoice = (id: string) => {
    if (!window.confirm(getTranslation(language).confirmDelete)) return;
    const updated = invoices.filter((i) => i.id !== id);
    setInvoices(updated);
    saveInvoices(updated);
    showToast('Invoice telah dihapus.');
  };

  // Print PDF handler
  const handlePrintPdf = () => {
    window.print();
  };

  // CRM Clients Handlers
  const handleSaveClient = (client: Client) => {
    const existing = clients.findIndex((c) => c.id === client.id);
    let updated: Client[];
    if (existing >= 0) {
      updated = clients.map((c) => (c.id === client.id ? client : c));
    } else {
      updated = [client, ...clients];
    }
    setClients(updated);
    saveClients(updated);
    showToast('Data klien berhasil disimpan!');
  };

  const handleSaveNewClientQuick = (clientData: Omit<Client, 'id' | 'profileId'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      profileId: activeProfileId,
    };
    handleSaveClient(newClient);
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    saveClients(updated);
    showToast('Klien telah dihapus.');
  };

  // Catalog Item Handlers
  const handleSaveCatalogItem = (item: CatalogItem) => {
    const existing = catalog.findIndex((c) => c.id === item.id);
    let updated: CatalogItem[];
    if (existing >= 0) {
      updated = catalog.map((c) => (c.id === item.id ? item : c));
    } else {
      updated = [item, ...catalog];
    }
    setCatalog(updated);
    saveCatalog(updated);
    showToast('Katalog berhasil diperbarui!');
  };

  const handleDeleteCatalogItem = (id: string) => {
    const updated = catalog.filter((c) => c.id !== id);
    setCatalog(updated);
    saveCatalog(updated);
    showToast('Item katalog dihapus.');
  };

  // Profile Handlers
  const handleSaveProfile = (prof: UserProfile) => {
    const existing = profiles.findIndex((p) => p.id === prof.id);
    let updated: UserProfile[];
    if (existing >= 0) {
      updated = profiles.map((p) => (p.id === prof.id ? prof : p));
    } else {
      updated = [...profiles, prof];
    }
    setProfiles(updated);
    saveProfiles(updated);
    showToast('Profil usaha berhasil disimpan!');
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
    if (activeProfileId === id) {
      handleSelectProfile(updated[0].id);
    }
    showToast('Profil dihapus.');
  };

  if (viewMode === 'landing' || !isAuthenticated) {
    return (
      <LandingPagePolished
        onStartInvoice={() => {
          if (isAuthenticated) {
            setViewMode('app');
          }
        }}
        language={language}
        theme={appTheme}
        onThemeToggle={handleToggleTheme}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${appTheme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        language={language}
        onLanguageChange={setLanguage}
        theme={appTheme}
        onThemeToggle={handleToggleTheme}
        onSaveInvoice={activeTab === 'editor' ? handleSaveInvoice : undefined}
        onPrintPdf={activeTab === 'editor' ? handlePrintPdf : undefined}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* Tab Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} language={language} theme={appTheme} isAdmin={isAdmin} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6 Columns: Invoice Editor Form */}
            <div className="lg:col-span-6 space-y-6 no-print">
              <InvoiceForm
                invoice={currentInvoice}
                onChange={setCurrentInvoice}
                clients={clients.filter((c) => c.profileId === activeProfileId)}
                catalogItems={catalog.filter((cat) => cat.profileId === activeProfileId)}
                onSaveNewClient={handleSaveNewClientQuick}
                language={language}
              />
            </div>

            {/* Right 6 Columns: Real-Time Live Preview & Printable Container */}
            <div className="lg:col-span-6 sticky top-20">
              <div className="flex items-center justify-between mb-3 no-print">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  Pratinjau Langsung (Live Preview)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Standard A4 Printable
                </span>
              </div>
              <InvoicePaper invoice={currentInvoice} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <InvoiceList
            invoices={invoices.filter((i) => i.profileId === activeProfileId)}
            onSelectInvoice={(inv) => {
              setCurrentInvoice(inv);
              setActiveTab('editor');
            }}
            onNewInvoice={handleNewInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            onDeleteInvoice={handleDeleteInvoice}
            language={language}
          />
        )}

        {activeTab === 'clients' && (
          <ClientManager
            clients={clients.filter((c) => c.profileId === activeProfileId)}
            activeProfileId={activeProfileId}
            onSaveClient={handleSaveClient}
            onDeleteClient={handleDeleteClient}
            language={language}
          />
        )}

        {activeTab === 'catalog' && (
          <ItemCatalogManager
            catalog={catalog.filter((cat) => cat.profileId === activeProfileId)}
            activeProfileId={activeProfileId}
            onSaveCatalogItem={handleSaveCatalogItem}
            onDeleteCatalogItem={handleDeleteCatalogItem}
            language={language}
          />
        )}

        {activeTab === 'profiles' && (
          <ProfileManager
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectActiveProfile={handleSelectProfile}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
            language={language}
          />
        )}

        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminDashboard
              token={token}
              theme={appTheme}
            />
          ) : (
            <div className="p-12 text-center space-y-4">
              <div className="inline-block p-4 rounded-full bg-rose-500/10 text-rose-500 font-bold text-lg">
                ⛔ Akses Ditolak
              </div>
              <h3 className="text-xl font-bold">Halaman Ini Khusus Super Admin</h3>
              <p className="text-sm text-slate-500">Anda tidak memiliki izin untuk mengakses Admin Dashboard.</p>
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs"
              >
                Kembali ke Editor
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;
