import { useEffect, useState } from "react";
import apiClient from "../api/client";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, activityResponse] = await Promise.all([
        apiClient.get("/dashboard"),
        apiClient.get("/activity?limit=10")
      ]);

      setData(dashboardResponse.data.data);
      setActivities(activityResponse.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>Failed to load dashboard.</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <article className="stat-card">
          <h3>Total Orders Today</h3>
          <p>{data.totalOrdersToday}</p>
        </article>
        <article className="stat-card">
          <h3>Pending Orders</h3>
          <p>{data.pendingVsCompleted.pending}</p>
        </article>
        <article className="stat-card">
          <h3>Completed Orders</h3>
          <p>{data.pendingVsCompleted.completed}</p>
        </article>
        <article className="stat-card">
          <h3>Revenue Today</h3>
          <p>${data.revenueToday.toFixed(2)}</p>
        </article>
      </div>

      <div className="two-col">
        <section className="panel">
          <h2>Low Stock Snapshot</h2>
          <p className="muted">Items below threshold: {data.lowStockItemsCount}</p>
          <ul>
            {data.productSummary.map((item) => (
              <li key={item.productName}>{item.productName} - {item.stockText}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Recent Activity</h2>
          <ul>
            {activities.map((item) => (
              <li key={item._id}>
                <strong>{item.action}</strong>
                <p className="muted small">{item.details}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
