export type Language = 'id' | 'en';
export type AppTheme = 'dark' | 'light';

export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'SGD' | 'GBP' | 'AUD' | 'JPY';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export type TemplateId = 
  | 'modern' 
  | 'editorial' 
  | 'atmospheric' 
  | 'corporate' 
  | 'risograph' 
  | 'minimal_mono'
  | 'swiss_grid'
  | 'emerald_boutique'
  | 'tech_neo'
  | 'warm_artisan'
  | 'metro_compact'
  | 'pastel_pop'
  | 'sidebar_layout'
  | 'top_hero_banner'
  | 'receipt_ticket'
  | 'classic_letterhead'
  | 'duotone_split'
  | 'terminal_console'
  | 'minimal_table_only'
  | 'stamp_certification'
  | 'card_grid_tiles'
  | 'creative_asymmetric'
  | 'compact_slip'
  | 'luxury_gold_leaf';

export type FontFamily = 'inter' | 'jakarta' | 'space' | 'playfair' | 'mono';

export type BusinessType = 'trading' | 'service' | 'repair' | 'retail' | 'general';
export type CatalogCategory = 'product' | 'service';
export interface UserProfile {
  id: string;
  name: string; // Company / Business Name
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  taxId?: string; // NPWP / Tax ID
  website?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  swiftCode?: string;
  qrisUrl?: string;
  signatureUrl?: string;
  defaultCurrency: CurrencyCode;
  businessType?: BusinessType;
  isDefault?: boolean;
}

export interface Client {
  id: string;
  profileId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
}

export interface CatalogItem {
  id: string;
  profileId: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string; // e.g. "jam / hr", "proyek / project", "pcs", "bulan / mo"
  defaultTaxRate: number;
  category?: CatalogCategory; // 'product' | 'service'
}

export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  taxRate: number; // e.g., 11 for 11% PPN
  discount: number;
  discountType: 'percent' | 'fixed';
}

export interface InvoiceThemeConfig {
  templateId: TemplateId;
  primaryColor: string; // Hex color code
  fontFamily: FontFamily;
  density: 'compact' | 'standard' | 'spacious';
  showWatermark: boolean;
  watermarkText?: string;
  showQrPayment: boolean;
  showSignature: boolean;
}

export interface Invoice {
  id: string;
  profileId: string;
  number: string; // e.g., INV/2026/07/001
  issueDate: string;
  dueDate: string;
  poNumber?: string;
  status: InvoiceStatus;
  language: Language;
  currency: CurrencyCode;
  issuer: UserProfile;
  client: Client;
  items: LineItem[];
  taxName: string; // "PPN", "VAT", "GST", etc.
  shippingFee: number;
  notes: string;
  paymentTerms: string;
  theme: InvoiceThemeConfig;
  createdAt: string;
  updatedAt: string;
}
