import React from "react";

// React.memo does a shallow prop comparison and skips re-rendering this
// card unless its own post/platform/onDelete props actually changed - so
// editing the filter or adding one new post doesn't re-render every card
// in the list, only the ones affected.
const PostCard = React.memo(function PostCard({ post, platform, onDelete }) {
  return (
    <div className="post-card">
      <span
        className="platform-chip"
        style={{ background: platform?.color ?? "#555" }}
        title={platform?.name}
      >
        {platform?.name ?? "Unknown"}
      </span>
      <div className="content">
        <div>{post.content}</div>
        <div className="meta">
          <span className={`status-pill ${post.status}`}>{post.status}</span>
          <span>{new Date(post.scheduledFor).toLocaleDateString()}</span>
          <span>
            ♥ {post.engagement.likes} · ↻ {post.engagement.shares} · 💬 {post.engagement.comments}
          </span>
        </div>
      </div>
      <button className="btn danger-ghost" onClick={() => onDelete(post.id)} title="Delete post">
        ✕
      </button>
    </div>
  );
});

export default PostCard;
