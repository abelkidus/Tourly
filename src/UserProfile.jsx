import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "./components/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import "./userProfile.css";

function UserProfile() {
  const { token, user, login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfileData({
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [API_URL, token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: profileData.fullName,
          phone: profileData.phone,
          address: profileData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success(data.message || "Profile updated successfully");

      if (login && user) {
        login(token, {
          ...user,
          fullName: data.user.full_name,
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(`${API_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success(data.message || "Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="user-profile">
        <div className="user-profile__panel">
          <header className="user-profile__header">
            <p className="user-profile__eyebrow">Account Settings</p>
            <h1 className="user-profile__title">User Profile</h1>
            <p className="user-profile__subtitle">
              Manage your personal information, contact details, and account security.
            </p>
          </header>

          {loading ? (
            <div className="user-profile__card">
              <p className="user-profile__loading">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Personal Information Form */}
              <section className="user-profile__card">
                <div className="user-profile__card-header">
                  <h2 className="user-profile__card-title">Personal Information</h2>
                  <p className="user-profile__card-desc">
                    Update your personal details and contact information.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="user-profile__form">
                  <div className="user-profile__form-grid">
                    <div className="user-profile__form-group">
                      <label htmlFor="fullName" className="user-profile__label">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        placeholder="John Doe"
                        className="user-profile__input"
                        required
                      />
                    </div>

                    <div className="user-profile__form-group">
                      <label htmlFor="email" className="user-profile__label">
                        Email Address
                        <span className="user-profile__label-hint">(Read-only)</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                        className="user-profile__input user-profile__input--disabled"
                      />
                    </div>

                    <div className="user-profile__form-group">
                      <label htmlFor="phone" className="user-profile__label">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="+1 (555) 000-0000"
                        className="user-profile__input"
                      />
                    </div>

                    <div className="user-profile__form-group">
                      <label htmlFor="address" className="user-profile__label">
                        Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        placeholder="123 Travel Way, City, Country"
                        className="user-profile__input"
                      />
                    </div>
                  </div>

                  <div className="user-profile__btn-wrapper">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="user-profile__btn"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Security / Change Password Form */}
              <section className="user-profile__card">
                <div className="user-profile__card-header">
                  <h2 className="user-profile__card-title">Security / Change Password</h2>
                  <p className="user-profile__card-desc">
                    Ensure your account is using a secure password.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="user-profile__form">
                  <div className="user-profile__form-grid user-profile__form-grid--full">
                    <div className="user-profile__form-group">
                      <label htmlFor="currentPassword" className="user-profile__label">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="user-profile__input"
                        required
                      />
                    </div>

                    <div className="user-profile__form-group">
                      <label htmlFor="newPassword" className="user-profile__label">
                        New Password
                        <span className="user-profile__label-hint">(Min. 6 characters)</span>
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="user-profile__input"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="user-profile__form-group">
                      <label htmlFor="confirmNewPassword" className="user-profile__label">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmNewPassword"
                        type="password"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="user-profile__input"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="user-profile__btn-wrapper">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="user-profile__btn"
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </section>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserProfile;
