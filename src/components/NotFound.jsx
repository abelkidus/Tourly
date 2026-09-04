import { Link } from "react-router-dom";
import "./notFound.css";

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__panel">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__description">
          The destination you are looking for does not exist or has been moved. Let's get you back on track.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="not-found__button">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
