import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { apiFetchPosts, apiCreatePost, apiUpdatePost, apiDeletePost } from "../api/mockApi";

// --- Normalization -----------------------------------------------------
// createEntityAdapter gives us { ids: [], entities: {} } plus a set of
// pre-built reducer functions (addOne, addMany, upsertOne, removeOne, ...).
// This mirrors 3NF-style relational storage: posts are flat rows keyed by id,
// never nested inside platforms or vice versa.
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor),
});

const initialState = postsAdapter.getInitialState({
  loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
  mutating: false, // separate flag so create/update/delete don't blow away list-loading UI
});

// --- Async thunks --------------------------------------------------------
// Each thunk crosses the async boundary via mockApi and lets RTK auto-generate
// pending/fulfilled/rejected action types.
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, { rejectWithValue }) => {
  try {
    return await apiFetchPosts();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createPost = createAsyncThunk("posts/createPost", async (postDraft) => {
  return await apiCreatePost(postDraft);
});

export const updatePost = createAsyncThunk("posts/updatePost", async ({ id, changes }) => {
  return await apiUpdatePost(id, changes);
});

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  return await apiDeletePost(id);
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Synchronous, optimistic local edit (e.g. drag-to-reschedule in the calendar)
    // without waiting on a round trip.
    postRescheduledLocally(state, action) {
      const { id, scheduledFor } = action.payload;
      postsAdapter.updateOne(state, { id, changes: { scheduledFor } });
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchPosts lifecycle ---
      .addCase(fetchPosts.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload ?? action.error.message;
      })
      // --- createPost ---
      .addCase(createPost.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.mutating = false;
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.error.message;
      })
      // --- updatePost ---
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        postsAdapter.updateOne(state, { id, changes });
      })
      // --- deletePost ---
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      });
  },
});

export const { postRescheduledLocally } = postsSlice.actions;
export default postsSlice.reducer;

// --- Adapter-generated selectors -----------------------------------------
// getSelectors() returns selectAll / selectById / selectIds already wired
// to this slice's location in the store.
export const postsSelectors = postsAdapter.getSelectors((state) => state.posts);
