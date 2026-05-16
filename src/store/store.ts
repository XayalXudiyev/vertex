import { configureStore } from "@reduxjs/toolkit";
import { locationsApi } from "./api/locationsApi";
import mapReducer from "./slices/mapSlice";
import tasksReducer from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    tasks: tasksReducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(locationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
