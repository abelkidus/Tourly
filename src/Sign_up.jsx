import { Link, useNavigate } from "react-router-dom";
import "./Sign_up.css";

function Sign_up() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: e.target.fullname.value,
      username: e.target.username.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      address: e.target.address.value,
      birthDate: e.target.bday.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/Log_in");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Could not connect to the server");
    }
  };

  return (
    <section className="signup">
      <div className="signup__panel">
        <div className="signup__actions">
          <Link className="signup__home" to="/">
            Back to home
          </Link>
        </div>
        <p className="signup__eyebrow">Create account</p>
        <h2 className="signup__title">Join and start planning your next journey.</h2>
        <p className="signup__subtitle">Build your Tourly account to save destinations, organize bookings, and keep your travel ideas in one place.</p>

        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__field">
            <label className="signup__label" htmlFor="fullname">
              Full name
            </label>
            <input className="signup__input" type="text" name="fullname" id="fullname" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="username">
              Username
            </label>
            <input className="signup__input" type="text" name="username" id="username" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="phone">
              Phone number
            </label>
            <input className="signup__input" type="text" name="phone" id="phone" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="email">
              Email address
            </label>
            <input className="signup__input" type="email" name="email" id="email" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="address">
              Address
            </label>
            <input className="signup__input" type="text" name="address" id="address" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="bday">
              Birth date
            </label>
            <input className="signup__input" type="date" name="bday" id="bday" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="password">
              Password
            </label>
            <input className="signup__input" type="password" name="password" id="password" />
          </div>

          <button className="signup__submit" type="submit">
            Create account
          </button>
        </form>

        <p className="signup__footer">
          Already have an account?{" "}
          <Link className="signup__link" to="/Log_in">
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Sign_up;
