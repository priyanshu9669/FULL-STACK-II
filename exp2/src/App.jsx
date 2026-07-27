import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoreStatusBar from "./components/StoreStatusBar";
import ViewTabs from "./components/ViewTabs";
import FilterBar from "./components/FilterBar";
import CalendarView from "./components/CalendarView";
import AnalyticsView from "./components/AnalyticsView";
import PostForm from "./components/PostForm";
import { fetchPosts } from "./store/postsSlice";
import { fetchPlatforms } from "./store/platformsSlice";
import { selectActiveView, selectPostsError, selectPostsLoading } from "./store/selectors";

function App() {
  const dispatch = useDispatch();
  const activeView = useSelector(selectActiveView);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    dispatch(fetchPlatforms());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="app-shell">
      <StoreStatusBar />
      <ViewTabs />

      {error && (
        <div className="error-banner">
          {error}{" "}
          <button className="btn" style={{ marginLeft: 10 }} onClick={() => dispatch(fetchPosts())}>
            Retry
          </button>
        </div>
      )}

      <div className="layout">
        <div>
          <FilterBar />
          {loading === "pending" ? (
            <div className="empty-state">Loading posts…</div>
          ) : activeView === "calendar" ? (
            <CalendarView />
          ) : (
            <AnalyticsView />
          )}
        </div>
        <div className="panel">
          <h2>New post</h2>
          <PostForm />
        </div>
      </div>
    </div>
  );
}

export default App;
