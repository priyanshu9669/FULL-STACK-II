import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostsByDay, selectPlatformsById } from "../store/selectors";
import { deletePost } from "../store/postsSlice";
import PostCard from "./PostCard";

function CalendarView() {
  const dispatch = useDispatch();
  const postsByDay = useSelector(selectPostsByDay);
  const platformsById = useSelector(selectPlatformsById);

  // Stable handler reference passed down to memoized PostCard instances.
  const handleDelete = useCallback((id) => dispatch(deletePost(id)), [dispatch]);

  // Sort the day keys once per postsByDay change, not on every render.
  const sortedDays = useMemo(() => Object.keys(postsByDay).sort(), [postsByDay]);

  if (sortedDays.length === 0) {
    return <div className="empty-state">No posts match the current filters.</div>;
  }

  return (
    <div>
      {sortedDays.map((day) => (
        <div className="calendar-day" key={day}>
          <div className="day-label">
            {new Date(day).toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
          {postsByDay[day].map((post) => (
            <PostCard
              key={post.id}
              post={post}
              platform={platformsById[post.platformId]}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default CalendarView;
