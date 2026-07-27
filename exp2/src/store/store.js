import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import platformsReducer from "./platformsSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    ui: uiReducer,
  },
});
