import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Sign_up.css";

function Sign_up() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const maxBirthDate = new Date().toISOString().split("T")[0];

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordCriteria({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
    });
  };

  const validate = (data) => {
    const newErrors = {};

    if (!data.fullName || data.fullName.trim().length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters long";
    }

    if (!data.username || !/^[a-z0-9_]{3,}$/.test(data.username.trim())) {
      newErrors.username = "Username must be at least 3 characters (lowercase, numbers, _)";
    }

    if (!data.phone || !/^\+?[0-9]{10,15}$/.test(data.phone.trim())) {
      newErrors.phone = "Phone number must be 10 to 15 digits";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.address || data.address.trim().length < 4) {
      newErrors.address = "Address must be at least 4 characters long";
    }

    if (!data.birthDate) {
      newErrors.bday = "Birth date is required";
    } else if (new Date(data.birthDate) > new Date()) {
      newErrors.bday = "Birth date cannot be in the future";
    }

    if (!data.password || data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[a-z]/.test(data.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(data.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[^A-Za-z0-9]/.test(data.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    return newErrors;
  };

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

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

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
        toast.success("Account created! Please log in.");
        navigate("/Log_in");
      } else {
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const serverErrors = {};
          data.errors.forEach((err) => {
            const field = err.path || err.param;
            if (field) {
              const fieldKey = field === "fullName" ? "fullname" : field === "birthDate" ? "bday" : field;
              serverErrors[fieldKey] = err.msg || err.message;
            }
            toast.error(err.msg || err.message);
          });
          if (Object.keys(serverErrors).length > 0) {
            setErrors(serverErrors);
          }
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Could not connect to the server");
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

        <form className="signup__form" onSubmit={handleSubmit} noValidate>
          <div className="signup__field">
            <label className="signup__label" htmlFor="fullname">
              Full name
            </label>
            <input
              className={`signup__input ${errors.fullname ? "error-border" : ""}`}
              type="text"
              name="fullname"
              id="fullname"
            />
            {errors.fullname && <span className="error-text">{errors.fullname}</span>}
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="username">
              Username
            </label>
            <input
              className={`signup__input ${errors.username ? "error-border" : ""}`}
              type="text"
              name="username"
              id="username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="phone">
              Phone number
            </label>
            <input
              className={`signup__input ${errors.phone ? "error-border" : ""}`}
              type="tel"
              name="phone"
              id="phone"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="email">
              Email address
            </label>
            <input
              className={`signup__input ${errors.email ? "error-border" : ""}`}
              type="email"
              name="email"
              id="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="address">
              Address
            </label>
            <input
              className={`signup__input ${errors.address ? "error-border" : ""}`}
              type="text"
              name="address"
              id="address"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="bday">
              Birth date
            </label>
            <input
              className={`signup__input ${errors.bday ? "error-border" : ""}`}
              type="date"
              name="bday"
              id="bday"
              max={maxBirthDate}
            />
            {errors.bday && <span className="error-text">{errors.bday}</span>}
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="password">
              Password
            </label>
            <input
              className={`signup__input ${errors.password ? "error-border" : ""}`}
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <ul className="signup__password-criteria">
              <li className={`signup__criterion ${passwordCriteria.length ? "signup__criterion--met" : "signup__criterion--unmet"}`}>
                <span className="signup__criterion-icon">{passwordCriteria.length ? "✓" : "○"}</span>
                At least 8 characters
              </li>
              <li className={`signup__criterion ${passwordCriteria.upper ? "signup__criterion--met" : "signup__criterion--unmet"}`}>
                <span className="signup__criterion-icon">{passwordCriteria.upper ? "✓" : "○"}</span>
                One uppercase letter
              </li>
              <li className={`signup__criterion ${passwordCriteria.lower ? "signup__criterion--met" : "signup__criterion--unmet"}`}>
                <span className="signup__criterion-icon">{passwordCriteria.lower ? "✓" : "○"}</span>
                One lowercase letter
              </li>
              <li className={`signup__criterion ${passwordCriteria.number ? "signup__criterion--met" : "signup__criterion--unmet"}`}>
                <span className="signup__criterion-icon">{passwordCriteria.number ? "✓" : "○"}</span>
                One number
              </li>
              <li className={`signup__criterion ${passwordCriteria.special ? "signup__criterion--met" : "signup__criterion--unmet"}`}>
                <span className="signup__criterion-icon">{passwordCriteria.special ? "✓" : "○"}</span>
                One special character
              </li>
            </ul>
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
