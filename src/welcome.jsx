import { Link, useLocation } from "react-router-dom";
import "./welcome.css";

function Welcome() {
  const location = useLocation();
  const savedUser = JSON.parse(localStorage.getItem("tourlyUser") || "null");
  const user = location.state?.user || savedUser;
  const loggedInUser = user?.fullName || user?.username;

  return (
    <section className="welcome">
      <div className="welcome__panel">
        <p className="welcome__eyebrow">Tourly Dashboard</p>
        <h1 className="welcome__title">{loggedInUser ? `Welcome, ${loggedInUser}` : "Welcome"}</h1>
        <p className="welcome__subtitle">
          Your account is ready. Start your next trip by choosing one of the destinations you added to the database.
        </p>
        <Link className="welcome__button" to="/booking" state={{ user }}>
          Book now
        </Link>
      </div>
    </section>
  );
}

export default Welcome;
