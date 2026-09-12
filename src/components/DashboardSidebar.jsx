import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./dashboardSidebar.css";

function DashboardSidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = user?.fullName || user?.username || "Traveler";
  const initials = getInitials(displayName);
  const avatarUrl = user?.avatar_url || user?.avatarUrl;

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__top">
        <Link to="/" className="dashboard-sidebar__brand">
          <h2 className="dashboard-sidebar__logo">Tourly</h2>
          <span className="dashboard-sidebar__badge">{isAdmin ? "Admin" : "User"}</span>
        </Link>

        <div className="dashboard-sidebar__user">
          <div className="dashboard-sidebar__avatar">
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="sidebar-avatar-img"
                onError={() => setAvatarError(true)}
              />
            ) : (
              initials
            )}
          </div>
          <div className="dashboard-sidebar__user-info">
            <span className="dashboard-sidebar__user-name">{displayName}</span>
            <span className="dashboard-sidebar__user-role">{isAdmin ? "Administrator" : "Traveler"}</span>
          </div>
        </div>

        <nav>
          <ul className="dashboard-sidebar__nav">
            {isAdmin ? (
              <>
                <li>
                  <NavLink
                    to="/admin/home"
                    end
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/destinations"
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    Manage Destinations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    Manage Users
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/welcome"
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/booking"
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    Book a Trip
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    My Trips
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="dashboard-sidebar__bottom">
        <Link to="/" className="dashboard-sidebar__home-btn">
          Back to Public Site
        </Link>
        <button className="dashboard-sidebar__signout-btn" onClick={handleSignOut} type="button">
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
