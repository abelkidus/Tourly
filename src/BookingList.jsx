import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./bookingList.css";

function BookingList() {
  const location = useLocation();
  const savedUser = JSON.parse(localStorage.getItem("tourlyUser") || "null");
  const user = location.state?.user || savedUser;
  const displayName = user?.fullName || user?.username;

  const API_URL = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setError("You need to log in before viewing bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/bookings?userId=${user.id}`);
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
  }, [API_URL, user?.id]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateValue));
  };

  return (
    <section className="bookings">
      <div className="bookings__panel">
        <p className="bookings__eyebrow">Your Bookings</p>
        <h1 className="bookings__title">{displayName ? `${displayName}'s trips` : "Your trips"}</h1>
        <p className="bookings__subtitle">Review the destinations you have booked and the dates you are planning to travel.</p>

        {loading && <p className="bookings__status">Loading bookings...</p>}
        {error && <p className="bookings__status bookings__status--error">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="bookings__empty">
            <p className="bookings__status">You do not have any bookings yet.</p>
            <Link className="bookings__button" to="/booking" state={{ user }}>
              Book now
            </Link>
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
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bookings__actions">
          <Link className="bookings__button" to="/booking" state={{ user }}>
            Book another trip
          </Link>
          <Link className="bookings__button bookings__button--secondary" to="/welcome" state={{ user }}>
            Back to welcome
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BookingList;
