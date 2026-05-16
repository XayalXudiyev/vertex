import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  center: [number, number];
  zoom: number;
  selectedPin: {
    lat: number;
    lon: number;
    label: string;
  } | null;
}

const initialState: MapState = {
  center: [40.4093, 49.8671], // Bakı
  zoom: 12,
  selectedPin: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter(state, action: PayloadAction<[number, number]>) {
      state.center = action.payload;
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
    setSelectedPin(
      state,
      action: PayloadAction<{ lat: number; lon: number; label: string } | null>
    ) {
      state.selectedPin = action.payload;
    },
    clearPin(state) {
      state.selectedPin = null;
    },
  },
});

export const { setCenter, setZoom, setSelectedPin, clearPin } = mapSlice.actions;
export default mapSlice.reducer;
