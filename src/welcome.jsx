import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./welcome.css";

function Welcome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loggedInUser = user?.fullName || user?.username;

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="welcome">
      <div className="welcome__panel">
        <div className="welcome__actions">
          <Link className="welcome__home" to="/">
            Back to home
          </Link>
          <button className="welcome__home" onClick={handleSignOut} type="button">
            Sign Out
          </button>
        </div>
        <p className="welcome__eyebrow">Tourly Dashboard</p>
        <h1 className="welcome__title">{loggedInUser ? `Welcome, ${loggedInUser}` : "Welcome"}</h1>
        <p className="welcome__subtitle">
          Your account is ready. Start your next trip by choosing one of the destinations you added to the database.
        </p>
        <div className="welcome__cta">
          <Link className="welcome__button" to="/booking">
            Book now
          </Link>
          <Link className="welcome__button welcome__button--secondary" to="/bookings">
            View bookings
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
