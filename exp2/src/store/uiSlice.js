import { createSlice } from "@reduxjs/toolkit";

// Kept deliberately separate from posts/platforms: view filters and the
// active view are UI concerns, not server data, and change on a different
// rhythm. Mixing the two forces unrelated components to re-render together.
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeView: "calendar", // 'calendar' | 'analytics'
    platformFilter: "all",
    statusFilter: "all",
  },
  reducers: {
    viewChanged(state, action) {
      state.activeView = action.payload;
    },
    platformFilterChanged(state, action) {
      state.platformFilter = action.payload;
    },
    statusFilterChanged(state, action) {
      state.statusFilter = action.payload;
    },
  },
});

export const { viewChanged, platformFilterChanged, statusFilterChanged } = uiSlice.actions;
export default uiSlice.reducer;
