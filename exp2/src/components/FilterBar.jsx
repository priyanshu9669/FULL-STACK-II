import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPlatforms, selectPlatformFilter, selectStatusFilter } from "../store/selectors";
import { platformFilterChanged, statusFilterChanged } from "../store/uiSlice";

function FilterBar() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const platformFilter = useSelector(selectPlatformFilter);
  const statusFilter = useSelector(selectStatusFilter);

  // useCallback keeps these handler references stable across re-renders so
  // they don't invalidate memoized children that receive them as props.
  const onPlatformChange = useCallback(
    (e) => dispatch(platformFilterChanged(e.target.value)),
    [dispatch]
  );
  const onStatusChange = useCallback(
    (e) => dispatch(statusFilterChanged(e.target.value)),
    [dispatch]
  );

  return (
    <div className="filter-bar">
      <select value={platformFilter} onChange={onPlatformChange}>
        <option value="all">All platforms</option>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <select value={statusFilter} onChange={onStatusChange}>
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>
      <div className="spacer" />
    </div>
  );
}

export default FilterBar;
