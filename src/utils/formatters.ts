import type { CurrencyCode, Language, LineItem } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode, locale: Language = 'id'): string {
  const isIdr = currency === 'IDR';
  const loc = locale === 'id' ? 'id-ID' : 'en-US';

  try {
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: isIdr ? 0 : 2,
      maximumFractionDigits: isIdr ? 0 : 2,
    }).format(amount);
  } catch (e) {
    const symbolMap: Record<CurrencyCode, string> = {
      IDR: 'Rp ',
      USD: '$',
      EUR: '€',
      SGD: 'S$',
      GBP: '£',
      AUD: 'A$',
      JPY: '¥',
    };
    return `${symbolMap[currency] || ''}${amount.toLocaleString()}`;
  }
}

export function formatDate(dateString: string, locale: Language = 'id'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', options).format(date);
}

export function generateInvoiceNumber(existingCount = 0): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(existingCount + 1).padStart(3, '0');
  return `INV/${year}/${month}/${seq}`;
}

export function calculateLineTotal(item: LineItem): number {
  const base = item.quantity * item.unitPrice;
  let discountAmount = 0;
  
  if (item.discountType === 'percent') {
    discountAmount = base * (item.discount / 100);
  } else {
    discountAmount = item.discount || 0;
  }

  const afterDiscount = Math.max(0, base - discountAmount);
  const taxAmount = afterDiscount * (item.taxRate / 100);
  
  return afterDiscount + taxAmount;
}

export function calculateInvoiceTotals(items: LineItem[], shippingFee = 0) {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  items.forEach((item) => {
    const base = item.quantity * item.unitPrice;
    subtotal += base;

    let disc = 0;
    if (item.discountType === 'percent') {
      disc = base * ((item.discount || 0) / 100);
    } else {
      disc = item.discount || 0;
    }
    totalDiscount += disc;

    const afterDiscount = Math.max(0, base - disc);
    const tax = afterDiscount * ((item.taxRate || 0) / 100);
    totalTax += tax;
  });

  const grandTotal = Math.max(0, subtotal - totalDiscount) + totalTax + (shippingFee || 0);

  return {
    subtotal,
    totalDiscount,
    totalTax,
    shippingFee: shippingFee || 0,
    grandTotal,
  };
}
