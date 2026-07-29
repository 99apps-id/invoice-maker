import type { FontFamily, TemplateId } from '../types';

export interface TemplateDefinition {
  id: TemplateId;
  nameKey: string;
  description: Record<'id' | 'en', string>;
  defaultColor: string;
  defaultFont: FontFamily;
  previewBg: string;
  badgeBg: string;
  formatType?: 'standard' | 'sidebar' | 'banner' | 'receipt' | 'letterhead' | 'terminal' | 'cards' | 'asymmetric' | 'certified';
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    nameKey: 'tplModern',
    description: {
      id: 'Hemat tinta: Latar putih bersih dengan garis aksen indigo tipis.',
      en: 'Ink-friendly: Clean white background with fine indigo line accents.'
    },
    defaultColor: '#4f46e5',
    defaultFont: 'inter',
    previewBg: 'bg-white border-indigo-200',
    badgeBg: 'bg-indigo-50 text-indigo-800 border border-indigo-200'
  },
  {
    id: 'editorial',
    nameKey: 'tplEditorial',
    description: {
      id: 'Format surat kabar klasik bertipe Playfair Serif yang hemat cetak.',
      en: 'Classic newsprint style with elegant Playfair Serif typography.'
    },
    defaultColor: '#334155',
    defaultFont: 'playfair',
    previewBg: 'bg-slate-50 border-slate-300',
    badgeBg: 'bg-slate-100 text-slate-900 border border-slate-300'
  },
  {
    id: 'atmospheric',
    nameKey: 'tplAtmospheric',
    description: {
      id: 'Latar putih bersih dengan aksen garis emerald kontras tinggi.',
      en: 'Clean white background with high-contrast emerald line accents.'
    },
    defaultColor: '#059669',
    defaultFont: 'space',
    previewBg: 'bg-white border-emerald-500/40 text-slate-900',
    badgeBg: 'bg-emerald-50 text-emerald-800 border border-emerald-300'
  },
  {
    id: 'corporate',
    nameKey: 'tplCorporate',
    description: {
      id: 'Layout eksekutif formal dengan bingkai biru sapphire yang rapi.',
      en: 'Formal executive layout with structured sapphire blue borders.'
    },
    defaultColor: '#2563eb',
    defaultFont: 'jakarta',
    previewBg: 'bg-white border-blue-200',
    badgeBg: 'bg-blue-50 text-blue-800 border border-blue-200'
  },
  {
    id: 'risograph',
    nameKey: 'tplRisograph',
    description: {
      id: 'Aksen terracotta studio hangat pada kertas krem terang yang lembut.',
      en: 'Warm studio terracotta accents on soft light cream paper.'
    },
    defaultColor: '#ea580c',
    defaultFont: 'jakarta',
    previewBg: 'bg-orange-50/40 border-orange-200',
    badgeBg: 'bg-orange-100 text-orange-900 border border-orange-200'
  },
  {
    id: 'minimal_mono',
    nameKey: 'tplMinimalMono',
    description: {
      id: 'Monokrom hitam putih tajam bertipe monospaced arsitektural.',
      en: 'Sharp black & white monochrome design with architectural monospace type.'
    },
    defaultColor: '#000000',
    defaultFont: 'mono',
    previewBg: 'bg-white border-neutral-400',
    badgeBg: 'bg-neutral-100 text-neutral-900 border border-neutral-300'
  },
  {
    id: 'swiss_grid',
    nameKey: 'tplSwiss',
    description: {
      id: 'Gaya grid internasional Swiss dengan pita aksen merah di garis tepi.',
      en: 'Swiss International grid style with bold red left border accent.'
    },
    defaultColor: '#dc2626',
    defaultFont: 'inter',
    previewBg: 'bg-white border-l-4 border-l-red-600 border-slate-200',
    badgeBg: 'bg-red-50 text-red-800 border border-red-200'
  },
  {
    id: 'emerald_boutique',
    nameKey: 'tplBoutique',
    description: {
      id: 'Gaya mewah botani pada kertas putih dengan teks emerald & garis emas.',
      en: 'Botanical luxury style on white paper with emerald text & gold borders.'
    },
    defaultColor: '#047857',
    defaultFont: 'playfair',
    previewBg: 'bg-white border-amber-300 text-emerald-950',
    badgeBg: 'bg-amber-50 text-amber-900 border border-amber-300'
  },
  {
    id: 'tech_neo',
    nameKey: 'tplTechNeo',
    description: {
      id: 'Gaya Developer bersih pada latar terang dengan aksen garis cyan.',
      en: 'Clean developer layout on light background with cyan border accents.'
    },
    defaultColor: '#0891b2',
    defaultFont: 'space',
    previewBg: 'bg-white border-cyan-300 text-slate-900',
    badgeBg: 'bg-cyan-50 text-cyan-900 border border-cyan-200'
  },
  {
    id: 'warm_artisan',
    nameKey: 'tplWarmArtisan',
    description: {
      id: 'Nuansa organik hangat untuk Kafe, Bakery, & Usaha Kerajinan.',
      en: 'Warm organic tones for Cafes, Bakeries, & Artisan Craft businesses.'
    },
    defaultColor: '#65a30d',
    defaultFont: 'jakarta',
    previewBg: 'bg-stone-50 border-stone-300',
    badgeBg: 'bg-stone-100 text-stone-900 border border-stone-300'
  },
  {
    id: 'metro_compact',
    nameKey: 'tplMetroCompact',
    description: {
      id: 'Tata letak terstruktur bersih khusus tagihan ber-item banyak.',
      en: 'Clean structured layout tailored for high line-item invoices.'
    },
    defaultColor: '#475569',
    defaultFont: 'inter',
    previewBg: 'bg-white border-slate-300',
    badgeBg: 'bg-slate-100 text-slate-800 border border-slate-200'
  },
  {
    id: 'pastel_pop',
    nameKey: 'tplPastelPop',
    description: {
      id: 'Gaya studio modern cerah dengan lencana pastel lavender.',
      en: 'Bright modern studio vibe with soft lavender pastel pills.'
    },
    defaultColor: '#7c3aed',
    defaultFont: 'jakarta',
    previewBg: 'bg-purple-50/30 border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-900 border border-purple-200'
  },
  {
    id: 'sidebar_layout',
    nameKey: 'tplSidebarLayout',
    description: {
      id: 'Format 2 Kolom Vertikal: Bilah abu-abu terang di kiri, isi utama di kanan.',
      en: 'Vertical 2-Column Sidebar: Soft light gray left pane, main body on right.'
    },
    defaultColor: '#334155',
    defaultFont: 'jakarta',
    previewBg: 'bg-slate-50 border-slate-300 text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-900 border border-slate-300',
    formatType: 'sidebar'
  },
  {
    id: 'top_hero_banner',
    nameKey: 'tplHeroBanner',
    description: {
      id: 'Format Kartu Hero: Bingkai kontras di bagian atas tanpa blok warna tebal.',
      en: 'Hero Card format: High-contrast header frame without solid color blocks.'
    },
    defaultColor: '#2563eb',
    defaultFont: 'jakarta',
    previewBg: 'bg-white border-2 border-blue-500 text-slate-900',
    badgeBg: 'bg-blue-50 text-blue-900 border border-blue-200',
    formatType: 'banner'
  },
  {
    id: 'receipt_ticket',
    nameKey: 'tplReceiptTicket',
    description: {
      id: 'Format Struk Kasir / Tiket: Kertas putih bersih dengan garis putus-putus.',
      en: 'Receipt & Voucher Ticket format: Clean white paper with dashed lines.'
    },
    defaultColor: '#16a34a',
    defaultFont: 'mono',
    previewBg: 'bg-white border-2 border-dashed border-emerald-400 text-slate-900',
    badgeBg: 'bg-emerald-50 text-emerald-900 border border-emerald-300',
    formatType: 'receipt'
  },
  {
    id: 'classic_letterhead',
    nameKey: 'tplClassicLetterhead',
    description: {
      id: 'Format Kop Surat Klasik: Perataan tengah simetris dengan garis ganda formal.',
      en: 'Classic Letterhead format: Symmetrical center-aligned branding & double rules.'
    },
    defaultColor: '#334155',
    defaultFont: 'playfair',
    previewBg: 'bg-white border-slate-400',
    badgeBg: 'bg-slate-100 text-slate-900 border border-slate-300',
    formatType: 'letterhead'
  },
  {
    id: 'duotone_split',
    nameKey: 'tplDuotoneSplit',
    description: {
      id: 'Format Dwi-Warna Terang: Header bingkai abu-abu lembut dengan isi putih.',
      en: 'Light Duo-Tone format: Soft gray header box with clean white body.'
    },
    defaultColor: '#1e293b',
    defaultFont: 'inter',
    previewBg: 'bg-white border-slate-300 text-slate-900',
    badgeBg: 'bg-slate-100 text-slate-900 border border-slate-300',
    formatType: 'banner'
  },
  {
    id: 'terminal_console',
    nameKey: 'tplTerminalConsole',
    description: {
      id: 'Format Kode Monospaced: Kertas putih bersih dengan teks hijau tua & border konsol.',
      en: 'Clean Monospaced Code format: White paper with dark green text & console border.'
    },
    defaultColor: '#15803d',
    defaultFont: 'mono',
    previewBg: 'bg-white border-2 border-green-600 text-green-950',
    badgeBg: 'bg-green-50 text-green-900 border border-green-300',
    formatType: 'terminal'
  },
  // 🚀 MORE NEW FORMATS 🚀
  {
    id: 'minimal_table_only',
    nameKey: 'tplMinimalTable',
    description: {
      id: 'Format Tabel Ultra Minimalis: Tanpa kotak luar, mengutamakan tabel bersih & luas.',
      en: 'Ultra Minimalist Table format: Borderless outer frame focusing on clean line items.'
    },
    defaultColor: '#09090b',
    defaultFont: 'inter',
    previewBg: 'bg-white border-b-2 border-zinc-900',
    badgeBg: 'bg-zinc-100 text-zinc-900 border border-zinc-300'
  },
  {
    id: 'stamp_certification',
    nameKey: 'tplCertifiedTax',
    description: {
      id: 'Format Faktur Resmi Ber-Lencana: Dilengkapi kotak verifikasi audit & lencana resmi.',
      en: 'Certified Official Invoice format: Equipped with audit verification box & official seal.'
    },
    defaultColor: '#b91c1c',
    defaultFont: 'jakarta',
    previewBg: 'bg-white border-2 border-red-800 text-slate-900',
    badgeBg: 'bg-red-50 text-red-900 border border-red-300',
    formatType: 'certified'
  },
  {
    id: 'card_grid_tiles',
    nameKey: 'tplCardGridTiles',
    description: {
      id: 'Format Ubin Kartu Grid: Item rincian ditampilkan dalam bentuk ubin modul bersih.',
      en: 'Card Grid Tiles format: Line items rendered in clean modular grid cards.'
    },
    defaultColor: '#4f46e5',
    defaultFont: 'jakarta',
    previewBg: 'bg-slate-50 border-2 border-indigo-200 text-slate-900',
    badgeBg: 'bg-indigo-100 text-indigo-900 border border-indigo-300',
    formatType: 'cards'
  },
  {
    id: 'creative_asymmetric',
    nameKey: 'tplAsymmetric',
    description: {
      id: 'Format Asimetris Kreatif: Perataan offset modern dengan kartu total menonjol.',
      en: 'Creative Asymmetric format: Modern offset alignment with prominent total card.'
    },
    defaultColor: '#0891b2',
    defaultFont: 'space',
    previewBg: 'bg-white border-l-8 border-l-cyan-600 border-slate-200',
    badgeBg: 'bg-cyan-50 text-cyan-900 border border-cyan-200',
    formatType: 'asymmetric'
  },
  {
    id: 'compact_slip',
    nameKey: 'tplCompactSlip',
    description: {
      id: 'Format Slip Order Ringkas: Tata letak padat efisiensi tinggi untuk layanan cepat.',
      en: 'Compact Express Order Slip: High-density layout built for quick service notes.'
    },
    defaultColor: '#d97706',
    defaultFont: 'mono',
    previewBg: 'bg-amber-50/50 border-amber-300 text-slate-900',
    badgeBg: 'bg-amber-100 text-amber-900 border border-amber-300'
  },
  {
    id: 'luxury_gold_leaf',
    nameKey: 'tplLuxuryGold',
    description: {
      id: 'Format Premium Monogram Emas: Bingkai ganda emas mewah & huruf monogram.',
      en: 'Premium Monogram Gold format: Double luxury gold borders & monogram initials.'
    },
    defaultColor: '#b45309',
    defaultFont: 'playfair',
    previewBg: 'bg-white border-2 border-amber-400 text-amber-950',
    badgeBg: 'bg-amber-100/60 text-amber-900 border border-amber-400'
  }
];

export const PRESET_COLORS = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Sapphire Blue', hex: '#2563eb' },
  { name: 'Forest Emerald', hex: '#059669' },
  { name: 'Teal Cyan', hex: '#0891b2' },
  { name: 'Swiss Red', hex: '#dc2626' },
  { name: 'Warm Terracotta', hex: '#ea580c' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Slate Gray', hex: '#334155' },
  { name: 'Charcoal Black', hex: '#18181b' },
];

export const FONT_OPTIONS: { id: FontFamily; name: string; class: string }[] = [
  { id: 'inter', name: 'Inter (Sans-Serif)', class: 'font-sans' },
  { id: 'jakarta', name: 'Plus Jakarta Sans (Modern)', class: 'font-jakarta' },
  { id: 'space', name: 'Space Grotesk (Tech)', class: 'font-space' },
  { id: 'playfair', name: 'Playfair Display (Serif)', class: 'font-serif' },
  { id: 'mono', name: 'Space Mono (Monospace)', class: 'font-mono' },
];
