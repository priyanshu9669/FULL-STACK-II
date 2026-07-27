import React from "react";
import { useSelector } from "react-redux";
import { selectPostsLoading, selectAllPosts, selectAllPlatforms } from "../store/selectors";

// Deliberately reads raw-ish state (loading flag, entity counts) to make the
// abstract idea of "normalized store" visible: this is quite literally
// { ids: [], entities: {} } rendered as a readout instead of hidden from the user.
function StoreStatusBar() {
  const loading = useSelector(selectPostsLoading);
  const posts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);

  const dotClass = loading === "pending" ? "pending" : loading === "failed" ? "failed" : "live";
  const label = loading === "pending" ? "SYNCING" : loading === "failed" ? "ERROR" : "LIVE";

  return (
    <div className="status-bar">
      <span className="brand">◆ PulseDesk</span>
      <span>
        <span className={`status-dot ${dotClass}`} />
        store: {label}
      </span>
      <span className="status-metric">
        posts.entities: <strong>{posts.length}</strong>
      </span>
      <span className="status-metric">
        platforms.entities: <strong>{platforms.length}</strong>
      </span>
      <span className="status-metric" style={{ marginLeft: "auto", color: "var(--text-faint)" }}>
        redux toolkit · normalized · memoized selectors
      </span>
    </div>
  );
}

export default StoreStatusBar;
