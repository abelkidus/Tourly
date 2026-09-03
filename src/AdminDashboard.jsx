import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./adminDashboard.css";

function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageKey: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setSuccessMessage("");
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

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

      setSuccessMessage("Destination added successfully.");
      setFormData({
        name: "",
        category: "",
        description: "",
        imageKey: "",
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
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

          {error && <p className="admin-dashboard__status admin-dashboard__status--error">{error}</p>}
          {successMessage && <p className="admin-dashboard__status admin-dashboard__status--success">{successMessage}</p>}
        </form>
      </div>
    </section>
  );
}

export default AdminDashboard;
