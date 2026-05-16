import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NominatimLocation {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  address: {
    city?: string;
    country?: string;
    state?: string;
    road?: string;
  };
}

export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://nominatim.openstreetmap.org",
    prepareHeaders: (headers) => {
      headers.set("Accept-Language", "az,en");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchLocations: builder.query<NominatimLocation[], string>({
      query: (q) =>
        `/search?q=${encodeURIComponent(q)}&format=json&limit=8&addressdetails=1`,
      keepUnusedDataFor: 300,
    }),
    reverseGeocode: builder.query<
      NominatimLocation,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) =>
        `/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    }),
  }),
});

export const { useSearchLocationsQuery, useReverseGeocodeQuery } = locationsApi;
