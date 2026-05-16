// Mock data for Vértice Retail Intelligence dashboard

export interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface BasketAnomaly {
  id: number;
  storeId: number;
  storeName: string;
  pair: string;
  globalLift: number;
  localLift: number;
}

export interface ItemAnomaly {
  id: number;
  storeId: number;
  storeName: string;
  item: string;
  drop: number;
  zScore: number;
  trend: number[];
}

export interface BasketBuddy {
  id: number;
  pair: string;
  transactions: number;
  support: number;
  lift: number;
  leverage: number;
  conviction: number;
  globalBest: boolean;
}

export const STORES: Store[] = [
  { id: 1, name: "Ahmedli", lat: 40.3893, lng: 49.9023 },
  { id: 2, name: "28 May", lat: 40.3753, lng: 49.8511 },
  { id: 3, name: "Ganjlik", lat: 40.4093, lng: 49.8711 },
];

export const BASKET_ANOMALIES: BasketAnomaly[] = [
  { id: 1, storeId: 1, storeName: "Ahmedli", pair: "Beer & Chips", globalLift: 2.41, localLift: 1.12 },
  { id: 2, storeId: 1, storeName: "Ahmedli", pair: "Milk & Bread", globalLift: 1.98, localLift: 0.87 },
  { id: 3, storeId: 1, storeName: "Ahmedli", pair: "Diapers & Wipes", globalLift: 3.10, localLift: 1.54 },
  { id: 4, storeId: 1, storeName: "Ahmedli", pair: "Coffee & Sugar", globalLift: 2.75, localLift: 1.31 },
  { id: 5, storeId: 1, storeName: "Ahmedli", pair: "Yogurt & Granola", globalLift: 2.20, localLift: 0.99 },
  { id: 6, storeId: 2, storeName: "28 May", pair: "Wine & Cheese", globalLift: 3.50, localLift: 1.78 },
  { id: 7, storeId: 2, storeName: "28 May", pair: "Butter & Eggs", globalLift: 2.10, localLift: 0.92 },
  { id: 8, storeId: 2, storeName: "28 May", pair: "Pasta & Sauce", globalLift: 2.88, localLift: 1.40 },
  { id: 9, storeId: 2, storeName: "28 May", pair: "Chips & Soda", globalLift: 1.95, localLift: 0.80 },
  { id: 10, storeId: 2, storeName: "28 May", pair: "Ice Cream & Syrup", globalLift: 2.60, localLift: 1.22 },
  { id: 11, storeId: 3, storeName: "Ganjlik", pair: "Beer & Diapers", globalLift: 4.10, localLift: 2.01 },
  { id: 12, storeId: 3, storeName: "Ganjlik", pair: "Shampoo & Conditioner", globalLift: 2.90, localLift: 1.38 },
  { id: 13, storeId: 3, storeName: "Ganjlik", pair: "Nuts & Dried Fruit", globalLift: 2.35, localLift: 1.10 },
  { id: 14, storeId: 3, storeName: "Ganjlik", pair: "Tea & Honey", globalLift: 3.00, localLift: 1.47 },
  { id: 15, storeId: 3, storeName: "Ganjlik", pair: "Bread & Jam", globalLift: 1.80, localLift: 0.71 },
];

export const ITEM_ANOMALIES: ItemAnomaly[] = [
  { id: 1, storeId: 1, storeName: "Ahmedli", item: "Coca-Cola 2L", drop: -34, zScore: -2.81, trend: [120, 115, 108, 99, 88, 74, 65] },
  { id: 2, storeId: 1, storeName: "Ahmedli", item: "Lay's Classic", drop: -28, zScore: -2.43, trend: [90, 88, 82, 78, 70, 65, 58] },
  { id: 3, storeId: 1, storeName: "Ahmedli", item: "Snickers Bar", drop: -22, zScore: -1.98, trend: [60, 58, 56, 52, 48, 44, 40] },
  { id: 4, storeId: 1, storeName: "Ahmedli", item: "Activia Yogurt", drop: -19, zScore: -1.72, trend: [45, 44, 42, 40, 38, 35, 32] },
  { id: 5, storeId: 1, storeName: "Ahmedli", item: "Heinz Ketchup", drop: -17, zScore: -1.55, trend: [30, 29, 28, 27, 25, 24, 22] },
  { id: 6, storeId: 2, storeName: "28 May", item: "Pepsi Max 1.5L", drop: -41, zScore: -3.20, trend: [100, 96, 90, 82, 71, 60, 51] },
  { id: 7, storeId: 2, storeName: "28 May", item: "Red Bull 250ml", drop: -37, zScore: -2.95, trend: [80, 77, 72, 65, 56, 48, 42] },
  { id: 8, storeId: 2, storeName: "28 May", item: "Nesquik Cereal", drop: -25, zScore: -2.10, trend: [55, 53, 50, 46, 42, 38, 35] },
  { id: 9, storeId: 2, storeName: "28 May", item: "Milka Chocolate", drop: -21, zScore: -1.88, trend: [70, 68, 65, 62, 57, 53, 48] },
  { id: 10, storeId: 2, storeName: "28 May", item: "Orbit Gum", drop: -18, zScore: -1.60, trend: [40, 39, 38, 36, 33, 31, 28] },
  { id: 11, storeId: 3, storeName: "Ganjlik", item: "Lipton Iced Tea", drop: -45, zScore: -3.50, trend: [130, 124, 116, 105, 92, 79, 68] },
  { id: 12, storeId: 3, storeName: "Ganjlik", item: "Ferrero Rocher", drop: -38, zScore: -3.01, trend: [50, 48, 45, 41, 36, 31, 27] },
  { id: 13, storeId: 3, storeName: "Ganjlik", item: "Doritos Nacho", drop: -30, zScore: -2.55, trend: [75, 72, 67, 61, 55, 50, 45] },
  { id: 14, storeId: 3, storeName: "Ganjlik", item: "Evian Water 1.5L", drop: -24, zScore: -2.05, trend: [95, 92, 88, 83, 77, 71, 66] },
  { id: 15, storeId: 3, storeName: "Ganjlik", item: "Pringles Original", drop: -20, zScore: -1.80, trend: [65, 63, 60, 57, 53, 49, 46] },
];

export const BASKET_BUDDIES: BasketBuddy[] = [
  { id: 1, pair: "Beer & Diapers", transactions: 1420, support: 0.142, lift: 4.10, leverage: 0.108, conviction: 3.20, globalBest: true },
  { id: 2, pair: "Wine & Cheese", transactions: 1180, support: 0.118, lift: 3.50, leverage: 0.089, conviction: 2.75, globalBest: true },
  { id: 3, pair: "Coffee & Sugar", transactions: 2200, support: 0.220, lift: 2.75, leverage: 0.071, conviction: 2.10, globalBest: true },
  { id: 4, pair: "Shampoo & Conditioner", transactions: 980, support: 0.098, lift: 2.90, leverage: 0.064, conviction: 2.30, globalBest: true },
  { id: 5, pair: "Chips & Soda", transactions: 1850, support: 0.185, lift: 2.40, leverage: 0.058, conviction: 1.95, globalBest: false },
  { id: 6, pair: "Milk & Bread", transactions: 3100, support: 0.310, lift: 1.98, leverage: 0.045, conviction: 1.72, globalBest: false },
  { id: 7, pair: "Butter & Eggs", transactions: 1560, support: 0.156, lift: 2.10, leverage: 0.050, conviction: 1.85, globalBest: false },
  { id: 8, pair: "Pasta & Sauce", transactions: 1340, support: 0.134, lift: 2.88, leverage: 0.068, conviction: 2.25, globalBest: false },
  { id: 9, pair: "Tea & Honey", transactions: 1120, support: 0.112, lift: 3.00, leverage: 0.075, conviction: 2.40, globalBest: false },
  { id: 10, pair: "Yogurt & Granola", transactions: 890, support: 0.089, lift: 2.20, leverage: 0.053, conviction: 1.88, globalBest: false },
  { id: 11, pair: "Ice Cream & Syrup", transactions: 760, support: 0.076, lift: 2.60, leverage: 0.062, conviction: 2.05, globalBest: false },
  { id: 12, pair: "Nuts & Dried Fruit", transactions: 680, support: 0.068, lift: 2.35, leverage: 0.057, conviction: 1.92, globalBest: false },
];

export const KPI_SUMMARY = {
  totalTransactions: 48320,
  totalBasketBuddies: BASKET_BUDDIES.length,
  totalBasketAnomalies: BASKET_ANOMALIES.length,
  totalItemAnomalies: ITEM_ANOMALIES.length,
};

export function storePopupData(storeId: number) {
  return {
    basketAnomalies: BASKET_ANOMALIES.filter((b) => b.storeId === storeId).slice(0, 5),
    salesDrops: ITEM_ANOMALIES.filter((i) => i.storeId === storeId).slice(0, 5),
  };
}
