import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { getDestinationImage } from "./utils/imageMapper";
import DashboardLayout from "./components/DashboardLayout";
import "./adminDashboard.css";

function AdminDashboard() {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [destinations, setDestinations] = useState([]);
  const [errors, setErrors] = useState({});
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Destination name is required";
    }

    if (!formData.category || !formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.imageKey || !formData.imageKey.trim()) {
      newErrors.imageKey = "Image key is required";
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
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
      const response = await fetch(`${API_URL}/admin/destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          imageKey: formData.imageKey.trim(),
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
      setErrors({});
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

      toast.success("Destination deleted");
      setDestinations((prev) => prev.filter((dest) => dest.id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete destination");
    }
  };

  return (
    <DashboardLayout>
      <section className="admin-dashboard">
        <div className="admin-dashboard__panel">
          <p className="admin-dashboard__eyebrow">Admin Dashboard</p>
          <h1 className="admin-dashboard__title">Manage Tourly destinations</h1>
          <p className="admin-dashboard__subtitle">
            {user?.fullName || user?.username || "Admin"}, add new places here for travelers to discover and book.
          </p>

          <form className="admin-dashboard__form" onSubmit={handleSubmit} noValidate>
            <div className="admin-dashboard__field">
              <label className="admin-dashboard__label" htmlFor="name">
                Destination Name
              </label>
              <input
                className={`admin-dashboard__input ${errors.name ? "error-border" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="admin-dashboard__field">
              <label className="admin-dashboard__label" htmlFor="category">
                Category
              </label>
              <input
                className={`admin-dashboard__input ${errors.category ? "error-border" : ""}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="admin-dashboard__field">
              <label className="admin-dashboard__label" htmlFor="imageKey">
                Image Key
              </label>
              <input
                className={`admin-dashboard__input ${errors.imageKey ? "error-border" : ""}`}
                id="imageKey"
                name="imageKey"
                value={formData.imageKey}
                onChange={handleChange}
              />
              {errors.imageKey && <span className="error-text">{errors.imageKey}</span>}
            </div>

            <div className="admin-dashboard__field">
              <label className="admin-dashboard__label" htmlFor="description">
                Description
              </label>
              <textarea
                className={`admin-dashboard__input admin-dashboard__input--textarea ${errors.description ? "error-border" : ""}`}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="admin-dashboard__actions">
              <button className="admin-dashboard__button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add destination"}
              </button>
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
    </DashboardLayout>
  );
}

export default AdminDashboard;
