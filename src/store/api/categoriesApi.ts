import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ItemInfo {
  id: number;
  name: string;
  score: number;
  percent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BasketBodyInfo {
  id: number;
  name: string;
  global: number;
  local: number;
  percent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  itemInfo: ItemInfo[];
  basketBodyInfo: BasketBodyInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  venues: Venue[];
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  timestamp: string;
}

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
