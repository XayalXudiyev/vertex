export interface MockLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  type: "office" | "warehouse" | "store" | "event";
  description?: string;
  // Optional link back to the analytics store (for dashboard wiring)
  storeId?: number;
}

export const MOCK_LOCATIONS: MockLocation[] = [
  {
    id: "1",
    name: "Ahmedli",
    address: "Ahmedli, Bakı",
    lat: 40.3893,
    lon: 49.9023,
    type: "store",
    description: "Şərq filialı",
    storeId: 1,
  },
  {
    id: "2",
    name: "28 May",
    address: "28 May, Bakı",
    lat: 40.3753,
    lon: 49.8511,
    type: "store",
    description: "Mərkəz filialı",
    storeId: 2,
  },
  {
    id: "3",
    name: "Ganjlik",
    address: "Ganjlik, Bakı",
    lat: 40.4093,
    lon: 49.8711,
    type: "store",
    description: "Şimal filialı",
    storeId: 3,
  },
];

export const LOCATION_TYPE_LABELS: Record<MockLocation["type"], string> = {
  office: "Ofis",
  warehouse: "Anbar",
  store: "Mağaza",
  event: "Tədbir",
};

export const LOCATION_TYPE_COLORS: Record<MockLocation["type"], string> = {
  office: "#77bc20",
  warehouse: "#f59e0b",
  store: "#77bc20",
  event: "#a855f7",
};
