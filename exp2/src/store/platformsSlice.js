import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { apiFetchPlatforms } from "../api/mockApi";

const platformsAdapter = createEntityAdapter();

const initialState = platformsAdapter.getInitialState({
  loading: "idle",
  error: null,
});

export const fetchPlatforms = createAsyncThunk("platforms/fetchPlatforms", async () => {
  return await apiFetchPlatforms();
});

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = "succeeded";
        platformsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export default platformsSlice.reducer;

export const platformsSelectors = platformsAdapter.getSelectors((state) => state.platforms);
