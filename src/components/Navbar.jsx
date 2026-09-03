import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Tourly
      </Link>

      <ul className="navbar__links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#destinations">Destinations</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <div className="navbar__actions">
        {!isAuthenticated ? (
          <Link to="/Log_in" className="navbar__button">
            Sign-in
          </Link>
        ) : (
          <div className="navbar__user-menu">
            <span className="navbar__greeting">
              Hi, {user?.fullName || user?.username || "Traveler"}
            </span>
            {isAdmin && (
              <Link to="/dashboard" className="navbar__link-item">
                Dashboard
              </Link>
            )}
            <Link to="/bookings" className="navbar__link-item">
              Bookings
            </Link>
            <button onClick={handleSignOut} className="navbar__button navbar__button--signout" type="button">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

