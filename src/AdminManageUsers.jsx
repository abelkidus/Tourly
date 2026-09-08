import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import ConfirmModal from "./components/ConfirmModal";
import "./adminDashboard.css";

function AdminManageUsers() {
  const { user: currentUser, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API_URL, token]);

  const handleDelete = (id) => {
    if (Number(id) === Number(currentUser?.id)) {
      toast.error("You cannot delete your own account");
      return;
    }
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`${API_URL}/admin/users/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      toast.success(data.message || "User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsModalOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <DashboardLayout>
      <section className="admin-dashboard">
        <div className="admin-dashboard__panel">
          <p className="admin-dashboard__eyebrow">User Management</p>
          <h1 className="admin-dashboard__title">Registered Users</h1>
          <p className="admin-dashboard__subtitle">
            View all registered travelers and administrators on the Tourly platform.
          </p>

          <div className="admin-dashboard__inventory" style={{ marginTop: "24px", paddingTop: "0", borderTop: "none" }}>
            <h2 className="admin-dashboard__section-title">
              All Users ({users.length})
            </h2>

            {loading && <p className="admin-dashboard__status">Loading users...</p>}
            {error && <p className="admin-dashboard__status admin-dashboard__status--error">{error}</p>}

            {!loading && !error && (
              <div className="admin-dashboard__table-container">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="admin-dashboard__empty-cell">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const isSelf = Number(u.id) === Number(currentUser?.id);
                        return (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td>
                              <strong>{u.full_name || u.username}</strong>
                              {isSelf && (
                                <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#2f6c60", fontWeight: "bold" }}>
                                  (You)
                                </span>
                              )}
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className="admin-dashboard__category-badge">
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <button
                                className="admin-dashboard__delete-btn"
                                onClick={() => handleDelete(u.id)}
                                type="button"
                                disabled={isSelf}
                                style={isSelf ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? Their bookings will also be removed."
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUserId(null);
        }}
        confirmText="Yes, Delete"
      />
    </DashboardLayout>
  );
}

export default AdminManageUsers;
