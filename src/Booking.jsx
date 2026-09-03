import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import "./booking.css";

function Booking() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedDestinationId = searchParams.get("destinationId");
  const displayName = user?.fullName || user?.username;

  const API_URL = import.meta.env.VITE_API_URL;
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    destinationId: preselectedDestinationId || "",
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
          const match = preselectedDestinationId && data.find((d) => String(d.id) === String(preselectedDestinationId));
          setFormData((current) => ({
            ...current,
            destinationId: match ? String(match.id) : current.destinationId || String(data[0].id),
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [API_URL, preselectedDestinationId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationId: Number(formData.destinationId),
          travelersCount: Number(formData.travelersCount),
          travelDate: formData.travelDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      toast.success("Trip booked successfully!");
      setFormData((current) => ({
        ...current,
        travelersCount: 1,
        travelDate: "",
      }));
    } catch (err) {
      toast.error(err.message || "Failed to create booking");
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
              <Link className="booking__button booking__button--secondary" to="/welcome">
                Back to welcome
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default Booking;
