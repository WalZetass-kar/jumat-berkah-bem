export type TransactionType = 'INCOME' | 'EXPENSE';

export type DonationCategory = 
  | 'Donasi Tunai'
  | 'Transfer Bank'
  | 'Sumbangan Nasi Kotak'
  | 'Sumbangan Sembako'
  | 'Kotak Amal Jumat'
  | 'Ngutip Infak Kampus';

export type ExpenseCategory = 
  | 'Nasi Kotak / Makanan Siap Saji'
  | 'Bahan Baku & Sembako'
  | 'Air Mineral & Minuman'
  | 'Kemasan, Plastik & Mangkuk'
  | 'Operasional & Transportasi'
  | 'Santunan Cash / Dhuafa';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: DonationCategory | ExpenseCategory;
  date: string; // YYYY-MM-DD
  fridayPeriod: string; // e.g., "2026-07-24" or "Jumat, 24 Juli 2026"
  donorOrVendor: string; // e.g., "Hamba Allah", "Ibu Hajah Siti", "Catering Berkah"
  notes: string;
  paymentMethod: 'Cash' | 'Transfer BSI' | 'Barang / In-Kind' | 'QRIS';
  receiptUrl?: string;
  verifiedBy?: string;
}

export interface DistributionSpot {
  id: string;
  name: string;
  targetPackages: number;
  distributedPackages: number;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  coordinator: string;
  timeSlot: string;
  notes?: string;
  category: 'Masjid' | 'Panti Asuhan' | 'Pejuang Jalanan / Ojol' | 'Dhuafa / Pemulung';
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  date: string;
  portions: string;
  imageUrl: string;
  description: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface Volunteer {
  id: string;
  name: string;
  prodi: string;
  nim: string;
  wa_number: string;
  status: 'Menunggu' | 'Dihubungi' | 'Ditolak';
  created_at?: string;
}

export interface WeeklyConfig {
  organizationName: string;
  motto: string;
  bankInfo: string;
  accountHolder: string;
  targetPortions: number; // Target per Jumat
  targetMonthlyPortions: number; // Target Bulanan (Porsi)
  targetMonthlyDonation: number; // Target Bulanan (Donasi Rp)
  targetMonthLabel: string; // e.g., "Juli 2026"
  estimatedCostPerPortion: number;
  currentFridayLabel: string;
  qrisImageUrl?: string;
  contactWa?: string;
  shareText?: string;
}

export interface FridayTrendData {
  fridayDate: string;
  label: string;
  income: number;
  expense: number;
  portions: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'Kegiatan BEM' | 'Jumat Berkah' | 'Pengumuman' | 'Prestasi' | 'Artikel';
  author: string;
  imageUrl?: string;
  publishedAt: string;
  views?: number;
}

