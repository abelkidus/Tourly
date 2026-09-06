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
  const [errors, setErrors] = useState({});
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
          const selectedId = preselectedDestinationId || data[0].id;
          setFormData((current) => ({
            ...current,
            destinationId: String(selectedId),
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

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.destinationId) {
      newErrors.destinationId = "Please select a destination";
    }

    if (!formData.travelersCount || Number(formData.travelersCount) < 1) {
      newErrors.travelersCount = "Travelers count must be at least 1";
    } else if (Number(formData.travelersCount) > 20) {
      newErrors.travelersCount = "Travelers count cannot exceed 20";
    }

    if (!formData.travelDate) {
      newErrors.travelDate = "Travel date is required";
    } else if (formData.travelDate < today) {
      newErrors.travelDate = "Travel date cannot be in the past";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
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

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <section className="booking">
      <div className="booking__panel">
        <p className="booking__eyebrow">Booking Page</p>
        <h1 className="booking__title">Plan your next destination</h1>
        <p className="booking__subtitle">{displayName ? `${displayName}, choose a destination to book.` : "Choose a destination to book."}</p>

        {loading && <p className="booking__status">Loading destinations...</p>}
        {error && <p className="booking__status booking__status--error">{error}</p>}

        {!loading && !error && (
          <form className="booking__form" onSubmit={handleSubmit} noValidate>
            <div className="booking__field">
              <label className="booking__label" htmlFor="destinationId">
                Destination
              </label>
              <select
                className={`booking__input ${errors.destinationId ? "error-border" : ""}`}
                id="destinationId"
                name="destinationId"
                value={formData.destinationId}
                onChange={handleChange}
              >
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
              {errors.destinationId && <span className="error-text">{errors.destinationId}</span>}
            </div>

            <div className="booking__field">
              <label className="booking__label" htmlFor="travelersCount">
                Travelers Count
              </label>
              <input
                className={`booking__input ${errors.travelersCount ? "error-border" : ""}`}
                type="number"
                id="travelersCount"
                name="travelersCount"
                min="1"
                max="20"
                value={formData.travelersCount}
                onChange={handleChange}
              />
              {errors.travelersCount && <span className="error-text">{errors.travelersCount}</span>}
            </div>

            <div className="booking__field">
              <label className="booking__label" htmlFor="travelDate">
                Travel Date
              </label>
              <input
                className={`booking__input ${errors.travelDate ? "error-border" : ""}`}
                type="date"
                id="travelDate"
                name="travelDate"
                min={todayDate}
                value={formData.travelDate}
                onChange={handleChange}
              />
              {errors.travelDate && <span className="error-text">{errors.travelDate}</span>}
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
