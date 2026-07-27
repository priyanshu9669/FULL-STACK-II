import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPlatforms } from "../store/selectors";
import { createPost } from "../store/postsSlice";

const emptyDraft = {
  platformId: "",
  content: "",
  status: "draft",
  scheduledFor: new Date().toISOString().slice(0, 16),
};

function PostForm() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const [draft, setDraft] = useState(emptyDraft);
  const mutating = useSelector((state) => state.posts.mutating);

  const limit = platforms.find((p) => p.id === draft.platformId)?.limit ?? null;

  const handleChange = useCallback((field) => (e) => {
    setDraft((d) => ({ ...d, [field]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!draft.platformId || !draft.content.trim()) return;
      dispatch(
        createPost({
          ...draft,
          scheduledFor: new Date(draft.scheduledFor).toISOString(),
        })
      );
      setDraft((d) => ({ ...emptyDraft, platformId: d.platformId }));
    },
    [dispatch, draft]
  );

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label htmlFor="platform">Platform</label>
      <select id="platform" value={draft.platformId} onChange={handleChange("platformId")} required>
        <option value="" disabled>
          Choose a platform
        </option>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label htmlFor="content">Content</label>
      <textarea
        id="content"
        rows={4}
        value={draft.content}
        onChange={handleChange("content")}
        placeholder="Write the post..."
      />
      {limit && (
        <div className={`char-count ${draft.content.length > limit ? "over" : ""}`}>
          {draft.content.length} / {limit}
        </div>
      )}

      <label htmlFor="status">Status</label>
      <select id="status" value={draft.status} onChange={handleChange("status")}>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>

      <label htmlFor="scheduledFor">Scheduled for</label>
      <input
        id="scheduledFor"
        type="datetime-local"
        value={draft.scheduledFor}
        onChange={handleChange("scheduledFor")}
      />

      <button type="submit" className="btn primary" style={{ marginTop: 16, width: "100%" }} disabled={mutating}>
        {mutating ? "Adding…" : "Add to queue"}
      </button>
    </form>
  );
}

export default PostForm;
