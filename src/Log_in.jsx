import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Log_in.css";

function Log_in() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;

      if (!credential) {
        alert("Google login failed: missing credential");
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
        localStorage.setItem("tourlyUser", JSON.stringify(data.user));
        alert(data.message);
        navigate("/welcome", { state: { user: data.user } });
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Could not connect to the server for Google login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: e.target.username.value,
      password: e.target.password.value,
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
        localStorage.setItem("tourlyUser", JSON.stringify(data.user));
        alert(data.message);
        navigate("/welcome", { state: { user: data.user } });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Could not connect to the server");
    }
  };

  return (
    <section className="login">
      <div className="login__panel">
        <p className="login__eyebrow">Welcome back</p>
        <h2 className="login__title">Pick up your travel plans where you left off.</h2>
        <p className="login__subtitle">Sign in to access saved itineraries, personalized destination ideas, and your Tourly account details.</p>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label className="login__label" htmlFor="username">
              Username
            </label>
            <input className="login__input" type="text" name="username" id="username" required />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">
              Password
            </label>
            <input className="login__input" type="password" name="password" id="password" required />
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
              console.log("Loggin failed");
              alert("Google login failed. Please try again.");
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
