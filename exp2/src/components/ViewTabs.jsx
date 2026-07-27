import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveView } from "../store/selectors";
import { viewChanged } from "../store/uiSlice";

const TABS = [
  { id: "calendar", label: "Calendar" },
  { id: "analytics", label: "Analytics" },
];

function ViewTabs() {
  const dispatch = useDispatch();
  const activeView = useSelector(selectActiveView);

  return (
    <div className="view-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`view-tab ${activeView === tab.id ? "active" : ""}`}
          onClick={() => dispatch(viewChanged(tab.id))}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ViewTabs;
