import React from "react";
import { useSelector } from "react-redux";
import { selectEngagementByPlatform, selectStatusBreakdown } from "../store/selectors";

const STATUS_COLORS = { draft: "#8b92a0", scheduled: "#ffb020", published: "#2dd4bf" };

function AnalyticsView() {
  const engagementByPlatform = useSelector(selectEngagementByPlatform);
  const statusBreakdown = useSelector(selectStatusBreakdown);

  const maxEngagement = Math.max(1, ...engagementByPlatform.map((e) => e.total));
  const totalPosts = Object.values(statusBreakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="panel">
        <h2>Engagement by platform</h2>
        {engagementByPlatform.map(({ platform, total, postCount }) => (
          <div className="bar-row" key={platform.id}>
            <span>{platform.name}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(total / maxEngagement) * 100}%`,
                  background: platform.color,
                }}
              />
            </div>
            <span className="stat-value">
              {total} · {postCount}p
            </span>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Status breakdown</h2>
        {Object.entries(statusBreakdown).map(([status, count]) => (
          <div className="bar-row" key={status}>
            <span style={{ textTransform: "capitalize" }}>{status}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(count / totalPosts) * 100}%`,
                  background: STATUS_COLORS[status],
                }}
              />
            </div>
            <span className="stat-value">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsView;
