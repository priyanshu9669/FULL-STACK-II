import { createSelector } from "reselect";
import { postsSelectors } from "./postsSlice";
import { platformsSelectors } from "./platformsSlice";

// --- Base (unmemoized) selectors ------------------------------------------
// Thin accessors only. Components should never reach into `state.posts.entities`
// directly - selectors are the abstraction layer between raw state and UI.
export const selectAllPosts = postsSelectors.selectAll;
export const selectAllPlatforms = platformsSelectors.selectAll;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectActiveView = (state) => state.ui.activeView;
export const selectPlatformFilter = (state) => state.ui.platformFilter;
export const selectStatusFilter = (state) => state.ui.statusFilter;

// --- Lookup map: platformId -> platform record ----------------------------
// Recomputes only when the platforms entity table changes, not on every
// posts update - avoids rebuilding this map on every keystroke elsewhere.
export const selectPlatformsById = createSelector([selectAllPlatforms], (platforms) =>
  Object.fromEntries(platforms.map((p) => [p.id, p]))
);

// --- Filtered posts (drives both Calendar and the post list) -------------
// Depends on three independent inputs; only recomputes when one of them
// actually changes, so switching the active view (which doesn't touch these)
// costs nothing here.
export const selectFilteredPosts = createSelector(
  [selectAllPosts, selectPlatformFilter, selectStatusFilter],
  (posts, platformFilter, statusFilter) =>
    posts.filter(
      (post) =>
        (platformFilter === "all" || post.platformId === platformFilter) &&
        (statusFilter === "all" || post.status === statusFilter)
    )
);

// --- Posts grouped by calendar day ----------------------------------------
export const selectPostsByDay = createSelector([selectFilteredPosts], (posts) => {
  const groups = {};
  for (const post of posts) {
    const day = post.scheduledFor.slice(0, 10); // YYYY-MM-DD
    (groups[day] ??= []).push(post);
  }
  return groups;
});

// --- Analytics: engagement totals per platform ----------------------------
export const selectEngagementByPlatform = createSelector(
  [selectAllPosts, selectAllPlatforms],
  (posts, platforms) =>
    platforms.map((platform) => {
      const platformPosts = posts.filter((p) => p.platformId === platform.id);
      const totals = platformPosts.reduce(
        (acc, p) => ({
          likes: acc.likes + p.engagement.likes,
          shares: acc.shares + p.engagement.shares,
          comments: acc.comments + p.engagement.comments,
        }),
        { likes: 0, shares: 0, comments: 0 }
      );
      return {
        platform,
        postCount: platformPosts.length,
        ...totals,
        total: totals.likes + totals.shares + totals.comments,
      };
    })
);

// --- Analytics: status breakdown (draft / scheduled / published) ---------
export const selectStatusBreakdown = createSelector([selectAllPosts], (posts) => {
  const breakdown = { draft: 0, scheduled: 0, published: 0 };
  for (const post of posts) breakdown[post.status] = (breakdown[post.status] ?? 0) + 1;
  return breakdown;
});

// --- Derived state example from the experiment text: "short posts" -------
export const selectShortPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((post) => post.content.length < 100)
);
