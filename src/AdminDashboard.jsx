import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { getDestinationImage } from "./utils/imageMapper";
import "./adminDashboard.css";

function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageKey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_URL}/destinations`);
      const data = await response.json();

      if (response.ok) {
        setDestinations(data);
      }
    } catch (err) {
      console.error("Failed to load destinations:", err);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [API_URL]);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

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
      const response = await fetch(`${API_URL}/admin/destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          imageKey: formData.imageKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add destination");
      }

      toast.success("Destination created!");
      setFormData({
        name: "",
        category: "",
        description: "",
        imageKey: "",
      });
      fetchDestinations();
    } catch (submitError) {
      toast.error(submitError.message || "Failed to add destination");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete destination");
      }

      toast.success("Destination deleted!");
      fetchDestinations();
    } catch (err) {
      toast.error(err.message || "Failed to delete destination");
    }
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__panel">
        <div className="admin-dashboard__actions-top">
          <Link className="admin-dashboard__button admin-dashboard__button--secondary" to="/">
            Back to home
          </Link>
          <button className="admin-dashboard__button admin-dashboard__button--secondary" onClick={handleSignOut} type="button">
            Sign Out
          </button>
        </div>

        <p className="admin-dashboard__eyebrow">Admin Dashboard</p>
        <h1 className="admin-dashboard__title">Manage Tourly destinations</h1>
        <p className="admin-dashboard__subtitle">
          {user?.fullName || user?.username || "Admin"}, add new places here for travelers to discover and book.
        </p>

        <form className="admin-dashboard__form" onSubmit={handleSubmit}>
          <div className="admin-dashboard__field">
            <label className="admin-dashboard__label" htmlFor="name">
              Destination Name
            </label>
            <input className="admin-dashboard__input" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="admin-dashboard__field">
            <label className="admin-dashboard__label" htmlFor="category">
              Category
            </label>
            <input className="admin-dashboard__input" id="category" name="category" value={formData.category} onChange={handleChange} required />
          </div>

          <div className="admin-dashboard__field">
            <label className="admin-dashboard__label" htmlFor="imageKey">
              Image Key
            </label>
            <input className="admin-dashboard__input" id="imageKey" name="imageKey" value={formData.imageKey} onChange={handleChange} required />
          </div>

          <div className="admin-dashboard__field">
            <label className="admin-dashboard__label" htmlFor="description">
              Description
            </label>
            <textarea
              className="admin-dashboard__input admin-dashboard__input--textarea"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-dashboard__actions">
            <button className="admin-dashboard__button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add destination"}
            </button>
            <Link className="admin-dashboard__button admin-dashboard__button--secondary" to="/">
              Back home
            </Link>
          </div>
        </form>

        <div className="admin-dashboard__inventory">
          <h2 className="admin-dashboard__section-title">Current Destinations ({destinations.length})</h2>
          <div className="admin-dashboard__table-container">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-dashboard__empty-cell">
                      No destinations found.
                    </td>
                  </tr>
                ) : (
                  destinations.map((dest) => (
                    <tr key={dest.id}>
                      <td>#{dest.id}</td>
                      <td>
                        <img
                          src={getDestinationImage(dest.image_key)}
                          alt={dest.name}
                          className="admin-dashboard__thumb"
                        />
                      </td>
                      <td>
                        <strong>{dest.name}</strong>
                      </td>
                      <td>
                        <span className="admin-dashboard__category-badge">{dest.category}</span>
                      </td>
                      <td>
                        <button
                          className="admin-dashboard__delete-btn"
                          onClick={() => handleDeleteDestination(dest.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
