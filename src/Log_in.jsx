import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import "./Log_in.css";

function Log_in() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState({});

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;

      if (!credential) {
        toast.error("Google login failed: missing credential");
        return;
      }

      const response = await fetch(`${API_URL}/users/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast.success("Welcome, " + (data.user.fullName || data.user.username || "Traveler"));
        navigate(data.user.role === "admin" ? "/dashboard" : "/welcome");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Could not connect to the server for Google login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const newErrors = {};
    if (!username || !username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const formData = {
      username: username.trim(),
      password,
    };

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast.success(data.message || "Login successful");
        navigate(data.user.role === "admin" ? "/dashboard" : "/welcome");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Could not connect to the server");
    }
  };

  return (
    <section className="login">
      <div className="login__panel">
        <div className="login__actions">
          <Link className="login__home" to="/">
            Back to home
          </Link>
        </div>
        <p className="login__eyebrow">Welcome back</p>
        <h2 className="login__title">Pick up your travel plans where you left off.</h2>
        <p className="login__subtitle">Sign in to access saved itineraries, personalized destination ideas, and your Tourly account details.</p>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <label className="login__label" htmlFor="username">
              Username
            </label>
            <input
              className={`login__input ${errors.username ? "error-border" : ""}`}
              type="text"
              name="username"
              id="username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">
              Password
            </label>
            <input
              className={`login__input ${errors.password ? "error-border" : ""}`}
              type="password"
              name="password"
              id="password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button className="login__submit" type="submit">
            Log in
          </button>
        </form>

        <div className="login__divider">or continue with</div>

        <div className="login__google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error("Google login failed");
              toast.error("Google login failed. Please try again.");
            }}
          />
        </div>

        <p className="login__footer">
          Don't have an account?{" "}
          <Link className="login__link" to="/sign_up">
            Sign up here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Log_in;
