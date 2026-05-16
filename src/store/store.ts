import { configureStore } from "@reduxjs/toolkit";
import { locationsApi } from "./api/locationsApi";
import { tasksApi } from "./api/tasksApi";
import { categoriesApi } from "./api/categoriesApi";
import mapReducer from "./slices/mapSlice";
import tasksReducer from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    tasks: tasksReducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(locationsApi.middleware)
      .concat(tasksApi.middleware)
      .concat(categoriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
