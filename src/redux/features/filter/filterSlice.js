import { createSlice } from "@reduxjs/toolkit";
import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
  FILTER_PINNED,
  FILTER_IMPORTANT,
} from "../utils/filterType";

import { fetchTodosAsync } from "../todos/todosThunks";

export const filterInitialState = {
  filterType: FILTER_ALL,
};

const fitlerSlice = createSlice({
  name: "filter",
  initialState: filterInitialState,

  reducers: {
    setFilterType: (state, action) => {
      const validTypes = [
        FILTER_ALL,
        FILTER_ACTIVE,
        FILTER_COMPLETED,
        FILTER_PINNED,
        FILTER_IMPORTANT,
      ];

      if (validTypes.includes(action.payload)) {
        state.filterType = action.payload;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchTodosAsync.fulfilled, (state, action) => {
      state.filterType = FILTER_ALL;
    });
  },
});

export const { setFilterType } = fitlerSlice.actions;

export default fitlerSlice.reducer;
