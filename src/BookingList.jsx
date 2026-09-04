import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import "./bookingList.css";

function BookingList() {
  const { user, token } = useAuth();
  const displayName = user?.fullName || user?.username;

  const API_URL = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError("You need to log in before viewing bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [API_URL, token]);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      toast.success("Booking cancelled");
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (err) {
      toast.error(err.message || "Could not cancel booking");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const cleanDate = typeof dateValue === "string" ? dateValue.split("T")[0] : dateValue;
    const [year, month, day] = cleanDate.split("-");

    if (year && month && day) {
      const utcDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      return new Intl.DateTimeFormat("en", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(utcDate);
    }

    return cleanDate;
  };

  return (
    <section className="bookings">
      <div className="bookings__panel">
        <p className="bookings__eyebrow">Your Bookings</p>
        <h1 className="bookings__title">{displayName ? `${displayName}'s trips` : "Your trips"}</h1>
        <p className="bookings__subtitle">Review the destinations you have booked and the dates you are planning to travel.</p>

        {loading && (
          <div className="bookings__loading">
            <div className="bookings__spinner"></div>
            <p className="bookings__status">Loading your bookings...</p>
          </div>
        )}
        {error && <p className="bookings__status bookings__status--error">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="bookings__empty">
            <p className="bookings__status">You do not have any bookings yet.</p>
            <div className="bookings__empty-actions">
              <Link className="bookings__button" to="/">
                Browse Destinations
              </Link>
              <Link className="bookings__button bookings__button--secondary" to="/booking">
                Book a trip
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="bookings__list">
            {bookings.map((booking) => (
              <article className="bookings__card" key={booking.id}>
                <div>
                  <p className="bookings__category">{booking.destination_category}</p>
                  <h2 className="bookings__destination">{booking.destination_name}</h2>
                  <p className="bookings__description">{booking.destination_description}</p>
                </div>
                <div className="bookings__details">
                  <span>{formatDate(booking.travel_date)}</span>
                  <span>
                    {booking.travelers_count} {Number(booking.travelers_count) === 1 ? "traveler" : "travelers"}
                  </span>
                  <button
                    className="bookings__cancel-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                    type="button"
                  >
                    Cancel Trip
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bookings__actions">
          <Link className="bookings__button" to="/booking">
            Book another trip
          </Link>
          <Link className="bookings__button bookings__button--secondary" to="/welcome">
            Back to welcome
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BookingList;
