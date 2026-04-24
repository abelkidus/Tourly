import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./booking.css";

function Booking() {
  const location = useLocation();
  const savedUser = JSON.parse(localStorage.getItem("tourlyUser") || "null");
  const user = location.state?.user || savedUser;
  const displayName = user?.fullName || user?.username;

  const API_URL = import.meta.env.VITE_API_URL;
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    destinationId: "",
    travelersCount: 1,
    travelDate: "",
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/destinations`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch destinations");
        }

        setDestinations(data);
        if (data.length > 0) {
          setFormData((current) => ({
            ...current,
            destinationId: String(data[0].id),
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [API_URL]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubmitError("");
    setSuccessMessage("");
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setSubmitError("You need to log in before making a booking.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          destinationId: Number(formData.destinationId),
          travelersCount: Number(formData.travelersCount),
          travelDate: formData.travelDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setSuccessMessage("Booking created successfully.");
      setFormData((current) => ({
        ...current,
        travelersCount: 1,
        travelDate: "",
      }));
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="booking">
      <div className="booking__panel">
        <p className="booking__eyebrow">Booking Page</p>
        <h1 className="booking__title">Plan your next destination</h1>
        <p className="booking__subtitle">{displayName ? `${displayName}, choose a destination to book.` : "Choose a destination to book."}</p>

        {loading && <p className="booking__status">Loading destinations...</p>}
        {error && <p className="booking__status booking__status--error">{error}</p>}

        {!loading && !error && (
          <form className="booking__form" onSubmit={handleSubmit}>
            <div className="booking__field">
              <label className="booking__label" htmlFor="destinationId">
                Destination
              </label>
              <select
                className="booking__input"
                id="destinationId"
                name="destinationId"
                value={formData.destinationId}
                onChange={handleChange}
                required
              >
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking__field">
              <label className="booking__label" htmlFor="travelersCount">
                Travelers Count
              </label>
              <input
                className="booking__input"
                type="number"
                id="travelersCount"
                name="travelersCount"
                min="1"
                value={formData.travelersCount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="booking__field">
              <label className="booking__label" htmlFor="travelDate">
                Travel Date
              </label>
              <input
                className="booking__input"
                type="date"
                id="travelDate"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="booking__actions">
              <button className="booking__button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Continue Booking"}
              </button>
              <Link className="booking__button booking__button--secondary" to="/welcome" state={{ user }}>
                Back to welcome
              </Link>
            </div>

            {submitError && <p className="booking__status booking__status--error">{submitError}</p>}
            {successMessage && <p className="booking__status booking__status--success">{successMessage}</p>}
          </form>
        )}
      </div>
    </section>
  );
}

export default Booking;
