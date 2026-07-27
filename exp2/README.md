# PulseDesk — Redux Toolkit Content State Management

A working implementation of **Experiment 2: Redux-Based Content State Management** — a
social-media content ops dashboard (posts + platforms) built to demonstrate normalized
state, async thunks, and memoized selectors for calendar and analytics views.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`). `npm run build`
produces a static production bundle in `dist/`.

Data is served from an in-memory mock API (`src/api/mockApi.js`) with simulated network
delay, so `fetchPosts` genuinely goes `pending → fulfilled` (or occasionally `rejected`,
~5% of loads, to exercise the error path — hit **Retry** if you see it).

## Where each assignment lives

| Assignment | Implementation |
|---|---|
| **1. Redux slice implementation** | `src/store/postsSlice.js` — `createSlice` with a normalized initial state, plus `PostForm.jsx` / `CalendarView.jsx` wired via `useDispatch` / `useSelector`. |
| **2. Async data handling** | `fetchPosts`, `createPost`, `updatePost`, `deletePost` in `postsSlice.js`, all `createAsyncThunk`s with full `pending/fulfilled/rejected` handling in `extraReducers`. Loading/error state surfaces in `App.jsx` and the status bar. |
| **3. State normalization** | `createEntityAdapter` in `postsSlice.js` and `platformsSlice.js` — state is stored as `{ ids: [], entities: {} }`, updated via `setAll` / `addOne` / `updateOne` / `removeOne`. |
| **4. Selector optimization** | `src/store/selectors.js` — `createSelector` (Reselect) chains for `selectFilteredPosts`, `selectPostsByDay`, `selectEngagementByPlatform`, etc. Each only recomputes when its actual inputs change. |
| **5. Performance optimization** | `PostCard` wrapped in `React.memo`; stable callbacks via `useCallback` (e.g. `handleDelete` in `CalendarView`, filter handlers in `FilterBar`); derived groupings memoized with `useMemo`. |

## Architecture notes

- **Separation of data vs. UI state**: `postsSlice` / `platformsSlice` hold server data;
  `uiSlice` holds only the active view and filters. Changing a filter never touches the
  posts entity table, and vice versa.
- **Selectors as the only read path**: components never read `state.posts.entities`
  directly — everything goes through `src/store/selectors.js`, so the internal shape of
  the store can change without touching components.
- **Signature/debug element**: the status bar at the top renders the store's live shape
  (`posts.entities` / `platforms.entities` counts, loading state) directly — a visible
  window into the normalized state described in the experiment write-up.

## Stack

React 18 · Redux Toolkit 2 · React-Redux 9 · Reselect 5 · Vite 5
