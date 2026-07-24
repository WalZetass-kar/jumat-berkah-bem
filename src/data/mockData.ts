import { Transaction, DistributionSpot, WeeklyConfig, FridayTrendData, GalleryItem } from '../types';

export const initialConfig: WeeklyConfig = {
  organizationName: "Politeknik LP3I Pekanbaru",
  motto: "Sedekah Membawa Keberkahan & Kelapangan Rezeki",
  bankInfo: "BSI (Bank Syariah Indonesia) 7100-2024-88",
  accountHolder: "BEM LP3I Pekanbaru (Kabinet Luminaire)",
  targetPortions: 500,
  targetMonthlyPortions: 2000,
  targetMonthlyDonation: 30000000,
  targetMonthLabel: "Juli 2026",
  estimatedCostPerPortion: 15000,
  currentFridayLabel: "Jumat, 24 Juli 2026",
};

export const initialTransactions: Transaction[] = [];

export const initialSpots: DistributionSpot[] = [];

export const mockTrendData: FridayTrendData[] = [];

export const initialGalleryItems: GalleryItem[] = [];

