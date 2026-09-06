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
            Your account is ready. Use the sidebar navigation to discover destinations, organize your bookings, and manage your travel itinerary.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Welcome;
