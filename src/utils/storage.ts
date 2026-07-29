import type { CatalogItem, Client, Invoice, UserProfile } from '../types';

const PROFILES_KEY = 'invoicecraft_profiles_v1';
const ACTIVE_PROFILE_KEY = 'invoicecraft_active_profile_id_v1';
const CLIENTS_KEY = 'invoicecraft_clients_v1';
const CATALOG_KEY = 'invoicecraft_catalog_v1';
const INVOICES_KEY = 'invoicecraft_invoices_v1';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'prof-1',
    name: 'PT Nusantara Digital Creative',
    ownerName: 'Budi Santoso, S.Kom',
    email: 'finance@nusantaradigital.id',
    phone: '+62 812-3456-7890',
    address: 'Menara BTPN Lt. 24, Jl. Dr. Ide Anak Agung Gde Agung, Jakarta Selatan, 12950',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    taxId: '01.234.567.8-012.000',
    website: 'https://nusantaradigital.id',
    bankName: 'Bank Central Asia (BCA)',
    bankAccountNo: '883-0492-109',
    bankAccountName: 'PT Nusantara Digital Creative',
    swiftCode: 'CENAIDJA',
    qrisUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020101021126580014ID.LINKAJA.WWW01189360091100000000005204581253033605802ID5925PT%20NUSANTARA%20DIGITAL6007JAKARTA6105129506304D1A2',
    defaultCurrency: 'IDR',
    businessType: 'general',
    isDefault: true,
  },
  {
    id: 'prof-2',
    name: 'Alex Design & Code Studio',
    ownerName: 'Alexander Wright',
    email: 'alex@alexwright.design',
    phone: '+1 (555) 234-5678',
    address: '450 Mission Street, Suite 800, San Francisco, CA 94105',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
    taxId: 'US-EIN-987654321',
    website: 'https://alexwright.design',
    bankName: 'Silicon Valley Bank / Wise',
    bankAccountNo: '9901-2241-883',
    bankAccountName: 'Alexander Wright Studio',
    swiftCode: 'SVBKUS6S',
    defaultCurrency: 'USD',
    businessType: 'service',
    isDefault: false,
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    profileId: 'prof-1',
    name: 'Rina Wijaya',
    company: 'PT Global Solusi Gemilang',
    email: 'rina.w@globalsolusi.co.id',
    phone: '+62 811-987-654',
    address: 'Gedung Cyber 2 Lt. 10, Jl. H.R. Rasuna Said, Jakarta Selatan',
    taxId: '02.998.776.5-015.000',
  },
  {
    id: 'cli-2',
    profileId: 'prof-1',
    name: 'Hendrik Pratama',
    company: 'CV Warung Kopi Senja',
    email: 'hendrik@kopisenja.com',
    phone: '+62 856-1122-3344',
    address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    taxId: '03.112.334.5-011.000',
  },
  {
    id: 'cli-3',
    profileId: 'prof-2',
    name: 'Sarah Connor',
    company: 'Cyberdyne Systems Corp',
    email: 's.connor@cyberdyne.io',
    phone: '+1 (415) 890-1122',
    address: '100 Cyberdyne Way, Austin, TX 78701',
    taxId: 'US-88776655',
  }
];

export const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: 'cat-1',
    profileId: 'prof-1',
    name: 'Desain Sistem UI/UX & Prototipe Web',
    description: 'Pengembangan design system Figma komprehensif, riset pengguna, dan prototipe interaktif.',
    unitPrice: 18500000,
    unit: 'Proyek',
    defaultTaxRate: 11,
    category: 'service',
  },
  {
    id: 'cat-2',
    profileId: 'prof-1',
    name: 'Pengembangan Frontend React & TypeScript',
    description: 'Implementasi antarmuka web modern responsive, integrasi REST/GraphQL API, dan pengujian.',
    unitPrice: 650000,
    unit: 'Jam',
    defaultTaxRate: 11,
    category: 'service',
  },
  {
    id: 'cat-3',
    profileId: 'prof-1',
    name: 'Server Router Wi-Fi 6 Enterprise Access Point',
    description: 'Hardware perangkat keras jaringan frekuensi ganda 5GHz dengan lisensi garansi 3 tahun.',
    unitPrice: 3250000,
    unit: 'Unit',
    defaultTaxRate: 11,
    category: 'product',
  },
  {
    id: 'cat-4',
    profileId: 'prof-1',
    name: 'Kabel Fiber Optik Armor Outdoor 100m',
    description: 'Kabel jaringan serat optik kualitas industri tahan cuaca ekstrem dan interferensi.',
    unitPrice: 1450000,
    unit: 'Roll',
    defaultTaxRate: 11,
    category: 'product',
  },
  {
    id: 'cat-5',
    profileId: 'prof-2',
    name: 'Brand Identity & Visual System Design',
    description: 'Complete brand guidelines, typography selection, logo assets, and social media templates.',
    unitPrice: 3500,
    unit: 'Package',
    defaultTaxRate: 0,
    category: 'service',
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    profileId: 'prof-1',
    number: 'INV/2026/07/001',
    issueDate: '2026-07-15',
    dueDate: '2026-08-15',
    poNumber: 'PO-GSG-2026-992',
    status: 'pending',
    language: 'id',
    currency: 'IDR',
    issuer: INITIAL_PROFILES[0],
    client: INITIAL_CLIENTS[0],
    items: [
      {
        id: 'li-1',
        name: 'Pengembangan Aplikasi Web E-Commerce V2',
        description: 'Tahap 1: Arsitektur UI/UX, integrasi Payment Gateway & Keranjang Belanja',
        quantity: 1,
        unitPrice: 25000000,
        unit: 'Proyek',
        taxRate: 11,
        discount: 5,
        discountType: 'percent'
      },
      {
        id: 'li-2',
        name: 'Optimasi Performa & SEO Technical',
        description: 'Audit Core Web Vitals, optimasi aset gambar, & penataan meta tags',
        quantity: 20,
        unitPrice: 500000,
        unit: 'Jam',
        taxRate: 11,
        discount: 0,
        discountType: 'fixed'
      }
    ],
    taxName: 'PPN',
    shippingFee: 0,
    notes: 'Terima kasih atas kerja samanya! Pembayaran dapat ditransfer langsung ke rekening BCA tercantum.',
    paymentTerms: 'Jatuh tempo pembayaran adalah 30 hari sejak tanggal terbit invoice. Denda 1% per minggu berlaku setelah jatuh tempo.',
    theme: {
      templateId: 'modern',
      primaryColor: '#4f46e5',
      fontFamily: 'inter',
      density: 'standard',
      showWatermark: true,
      watermarkText: 'PENDING',
      showQrPayment: true,
      showSignature: true,
    },
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-15T09:00:00Z',
  },
  {
    id: 'inv-2',
    profileId: 'prof-1',
    number: 'INV/2026/06/048',
    issueDate: '2026-06-01',
    dueDate: '2026-06-30',
    poNumber: 'PO-WKS-881',
    status: 'paid',
    language: 'id',
    currency: 'IDR',
    issuer: INITIAL_PROFILES[0],
    client: INITIAL_CLIENTS[1],
    items: [
      {
        id: 'li-3',
        name: 'Pengembangan Website Company Profile',
        description: 'Desain responsive 5 halaman utama dengan animasi halus dan CMS',
        quantity: 1,
        unitPrice: 12000000,
        unit: 'Proyek',
        taxRate: 11,
        discount: 1000000,
        discountType: 'fixed'
      }
    ],
    taxName: 'PPN',
    shippingFee: 0,
    notes: 'Invoice ini telah dilunasi penuh. Terima kasih banyak!',
    paymentTerms: 'Lunas',
    theme: {
      templateId: 'editorial',
      primaryColor: '#1e293b',
      fontFamily: 'playfair',
      density: 'standard',
      showWatermark: true,
      watermarkText: 'LUNAS',
      showQrPayment: false,
      showSignature: true,
    },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-28T14:30:00Z',
  },
  {
    id: 'inv-3',
    profileId: 'prof-2',
    number: 'INV-2026-009',
    issueDate: '2026-07-10',
    dueDate: '2026-07-24',
    poNumber: 'CYBER-PO-4091',
    status: 'pending',
    language: 'en',
    currency: 'USD',
    issuer: INITIAL_PROFILES[1],
    client: INITIAL_CLIENTS[2],
    items: [
      {
        id: 'li-4',
        name: 'Design System & Component Library',
        description: 'Custom React & Tailwind CSS component system creation',
        quantity: 40,
        unitPrice: 125,
        unit: 'hours',
        taxRate: 0,
        discount: 0,
        discountType: 'percent'
      }
    ],
    taxName: 'VAT',
    shippingFee: 0,
    notes: 'Thank you for choosing Alex Design Studio! Please wire payment to our Wise/SVB account.',
    paymentTerms: 'Net 14 days from date of invoice.',
    theme: {
      templateId: 'atmospheric',
      primaryColor: '#059669',
      fontFamily: 'space',
      density: 'compact',
      showWatermark: true,
      watermarkText: 'UNPAID',
      showQrPayment: false,
      showSignature: true,
    },
    createdAt: '2026-07-10T11:20:00Z',
    updatedAt: '2026-07-10T11:20:00Z',
  }
];

function stripNpwp(str?: string): string | undefined {
  if (!str) return str;
  return str.replace(/\s*\([^)]*NPWP\)/gi, '').trim();
}

export function loadProfiles(): UserProfile[] {
  const data = localStorage.getItem(PROFILES_KEY);
  let profiles: UserProfile[] = INITIAL_PROFILES;
  if (data) {
    try { profiles = JSON.parse(data); } catch (e) { profiles = INITIAL_PROFILES; }
  } else {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
  }
  return profiles.map(p => ({
    ...p,
    taxId: stripNpwp(p.taxId)
  }));
}

export function saveProfiles(profiles: UserProfile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId(): string {
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (activeId) return activeId;
  const profiles = loadProfiles();
  const defaultProf = profiles.find(p => p.isDefault) || profiles[0];
  if (defaultProf) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, defaultProf.id);
    return defaultProf.id;
  }
  return 'prof-1';
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function loadClients(profileId?: string): Client[] {
  const data = localStorage.getItem(CLIENTS_KEY);
  let clients: Client[] = INITIAL_CLIENTS;
  if (data) {
    try { clients = JSON.parse(data); } catch (e) { clients = INITIAL_CLIENTS; }
  } else {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS));
  }
  const sanitized = clients.map(c => ({ ...c, taxId: stripNpwp(c.taxId) }));
  if (profileId) {
    return sanitized.filter(c => c.profileId === profileId);
  }
  return sanitized;
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function loadCatalog(profileId?: string): CatalogItem[] {
  const data = localStorage.getItem(CATALOG_KEY);
  let catalog: CatalogItem[] = INITIAL_CATALOG;
  if (data) {
    try { catalog = JSON.parse(data); } catch (e) { catalog = INITIAL_CATALOG; }
  } else {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(INITIAL_CATALOG));
  }
  if (profileId) {
    return catalog.filter(item => item.profileId === profileId);
  }
  return catalog;
}

export function saveCatalog(catalog: CatalogItem[]): void {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
}

export function loadInvoices(profileId?: string): Invoice[] {
  const data = localStorage.getItem(INVOICES_KEY);
  let invoices: Invoice[] = INITIAL_INVOICES;
  if (data) {
    try { invoices = JSON.parse(data); } catch (e) { invoices = INITIAL_INVOICES; }
  } else {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
  }
  const sanitized = invoices.map(inv => ({
    ...inv,
    issuer: { ...inv.issuer, taxId: stripNpwp(inv.issuer.taxId) },
    client: { ...inv.client, taxId: stripNpwp(inv.client.taxId) },
  }));
  if (profileId) {
    return sanitized.filter(inv => inv.profileId === profileId);
  }
  return sanitized;
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}
