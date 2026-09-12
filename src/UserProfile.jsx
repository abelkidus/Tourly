import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "./components/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import "./userProfile.css";

function UserProfile() {
  const { token, user, updateUser, login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatar_url: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarImgError, setAvatarImgError] = useState(false);

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

        const avatar = data.avatar_url || data.avatarUrl || "";

        setProfileData({
          fullName: data.full_name || data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          avatar_url: avatar,
          avatarUrl: avatar,
        });

        if (avatar && updateUser) {
          updateUser({
            avatar_url: avatar,
            avatarUrl: avatar,
            fullName: data.full_name || data.fullName || user?.fullName,
          });
        }
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

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = profileData.fullName || user?.fullName || user?.username || "Traveler";
  const initials = getInitials(displayName);
  const currentAvatar = profileData.avatar_url || profileData.avatarUrl || user?.avatar_url || user?.avatarUrl;

  useEffect(() => {
    setAvatarImgError(false);
  }, [currentAvatar]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingAvatar(true);

    try {
      const response = await fetch(`${API_URL}/user/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to upload avatar");
      }

      const updatedAvatarUrl = data.user?.avatar_url || data.user?.avatarUrl;

      setProfileData((prev) => ({
        ...prev,
        avatar_url: updatedAvatarUrl,
        avatarUrl: updatedAvatarUrl,
      }));

      if (updateUser) {
        updateUser({
          avatar_url: updatedAvatarUrl,
          avatarUrl: updatedAvatarUrl,
          fullName: data.user?.full_name || data.user?.fullName || user?.fullName,
        });
      } else if (login && user) {
        login(token, {
          ...user,
          avatar_url: updatedAvatarUrl,
          avatarUrl: updatedAvatarUrl,
          fullName: data.user?.full_name || data.user?.fullName || user?.fullName,
        });
      }

      toast.success("Profile photo updated!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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

      const updatedUserObj = {
        fullName: data.user?.full_name || profileData.fullName,
        full_name: data.user?.full_name || profileData.fullName,
        avatar_url: data.user?.avatar_url || profileData.avatar_url,
        avatarUrl: data.user?.avatar_url || profileData.avatarUrl,
      };

      if (updateUser) {
        updateUser(updatedUserObj);
      } else if (login && user) {
        login(token, {
          ...user,
          ...updatedUserObj,
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

                {/* Avatar Section */}
                <div className="user-profile__avatar-section">
                  <div className="user-profile__avatar-wrapper">
                    <div
                      className="user-profile__avatar"
                      onClick={() => fileInputRef.current?.click()}
                      title="Click to change photo"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      {currentAvatar && !avatarImgError ? (
                        <img
                          src={currentAvatar}
                          alt={displayName}
                          className="user-profile__avatar-img"
                          onError={() => setAvatarImgError(true)}
                        />
                      ) : (
                        <span className="user-profile__avatar-initials">{initials}</span>
                      )}
                      <div className="user-profile__avatar-overlay">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      id="avatar-file-input"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleAvatarUpload}
                      className="user-profile__file-input"
                    />
                  </div>

                  <div className="user-profile__avatar-info">
                    <div className="user-profile__avatar-name">{displayName}</div>
                    <div className="user-profile__avatar-hint">
                      PNG, JPEG, or WEBP up to 5MB
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="user-profile__avatar-btn"
                    >
                      {uploadingAvatar ? (
                        <>
                          <span className="user-profile__avatar-spinner" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          Change Photo
                        </>
                      )}
                    </button>
                  </div>
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
