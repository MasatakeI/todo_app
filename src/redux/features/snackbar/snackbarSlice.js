// @/redux/features/snackbar/snackbarSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const snackbarInitialState = {
  snackbarMessage: "",
  snackbarOpen: false,
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: snackbarInitialState,

  reducers: {
    showSnackbar: (state, action) => {
      state.snackbarOpen = true;
      state.snackbarMessage = action.payload;
    },
    hideSnackbar: (state) => {
      state.snackbarOpen = false;
    },
    clearSnackbar: () => snackbarInitialState,
  },
});

export const selectSnackbarMessage = (state) => state.snackbar.snackbarMessage;
export const selectSnackbarOpen = (state) => state.snackbar.snackbarOpen;

export const { showSnackbar, hideSnackbar, clearSnackbar } =
  snackbarSlice.actions;

export default snackbarSlice.reducer;
