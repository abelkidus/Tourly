import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import "./welcome.css";

function Welcome() {
  const { user } = useAuth();
  const loggedInUser = user?.fullName || user?.username;

  return (
    <DashboardLayout>
      <section className="welcome">
        <div className="welcome__panel">
          <p className="welcome__eyebrow">Tourly Dashboard</p>
          <h1 className="welcome__title">{loggedInUser ? `Welcome, ${loggedInUser}` : "Welcome"}</h1>
          <p className="welcome__subtitle">
            Ready for your next adventure? Explore our catalog of worldwide destinations, book your next trip, and manage your upcoming itineraries all in one place.
          </p>

          <div className="welcome__cta">
            <Link to="/booking" className="welcome__button">
              Browse Destinations
            </Link>
            <Link to="/bookings" className="welcome__button welcome__button--secondary">
              View My Trips
            </Link>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Welcome;
