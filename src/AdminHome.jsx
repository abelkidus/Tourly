import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import "./adminHome.css";

function AdminHome() {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDestinations: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard statistics");
        }

        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        toast.error(err.message || "Could not fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL, token]);

  const adminName = user?.fullName || user?.username || "Admin";

  return (
    <DashboardLayout>
      <section className="admin-home">
        <div className="admin-home__panel">
          <p className="admin-home__eyebrow">Overview</p>
          <h1 className="admin-home__title">
            Welcome to the Admin Dashboard, {adminName}
          </h1>
          <p className="admin-home__subtitle">
            Here is a quick snapshot of the current activity across the Tourly platform.
          </p>

          <div className="admin-home__cards">
            <div className="admin-home__card">
              <div className="admin-home__card-icon">👥</div>
              <div className="admin-home__card-content">
                <span className="admin-home__card-label">Total Users</span>
                <span className="admin-home__card-value">
                  {loading ? "..." : stats.totalUsers}
                </span>
              </div>
            </div>

            <div className="admin-home__card">
              <div className="admin-home__card-icon">🌍</div>
              <div className="admin-home__card-content">
                <span className="admin-home__card-label">Total Destinations</span>
                <span className="admin-home__card-value">
                  {loading ? "..." : stats.totalDestinations}
                </span>
              </div>
            </div>

            <div className="admin-home__card">
              <div className="admin-home__card-icon">✈️</div>
              <div className="admin-home__card-content">
                <span className="admin-home__card-label">Total Bookings</span>
                <span className="admin-home__card-value">
                  {loading ? "..." : stats.totalBookings}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default AdminHome;
