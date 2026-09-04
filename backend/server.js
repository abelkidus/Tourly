require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { signupValidationRules, validateSignup } = require("./validator");
const { authenticateToken, requireAdmin } = require("./middleware/auth");
const { OAuth2Client } = require("google-auth-library");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 5000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "https://tourly-nu.vercel.app",
];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many authentication attempts, please try again after 15 minutes." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
});

app.use(apiLimiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth server is running");
});

app.post("/users/signup", authLimiter, signupValidationRules, validateSignup, async (req, res) => {
  try {
    const { fullName, username, phone, email, address, birthDate, password } = req.body;

    const existingUser = await pool.query("SELECT id FROM users WHERE username = $1 OR email = $2", [username, email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
  (full_name, username, phone, email, address, birth_date, password_hash, role)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [fullName, username, phone, email, address, birthDate, passwordHash, "user"],
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

app.post("/users/login", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/users/google-login", authLimiter, async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(400).json({ message: "Invalid Google account" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [payload.email]);
    let user;

    if (result.rows.length === 0) {
      const baseUsername = payload.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "user";

      let username = baseUsername;
      const usernameCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

      if (usernameCheck.rows.length > 0) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        username = `${baseUsername.slice(0, 15)}_${randomSuffix}`;
      }

      const fullName = payload.name || "Google User";

      const insertResult = await pool.query(
        `INSERT INTO users (full_name, username, email, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, username, email, role`,
        [fullName, username, payload.email, "user"],
      );

      user = insertResult.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Server error during Google login" });
  }
});

app.get("/destinations", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, category, description, image_key FROM destinations ORDER BY id ASC");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch destinations error:", error);
    res.status(500).json({ message: "Server error while fetching destinations" });
  }
});

app.post("/admin/destinations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, category, description, imageKey } = req.body;

    if (!name || !category || !description || !imageKey) {
      return res.status(400).json({ message: "All destination fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO destinations (name, category, description, image_key)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, category, description, image_key`,
      [name, category, description, imageKey],
    );

    return res.status(201).json({
      message: "Destination added successfully",
      destination: result.rows[0],
    });
  } catch (error) {
    console.error("Add destination error:", error);
    return res.status(500).json({ message: "Server error while adding destination" });
  }
});

app.delete("/admin/destinations/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const destinationId = req.params.id;

    const bookingCheck = await pool.query(
      "SELECT id FROM bookings WHERE destination_id = $1 LIMIT 1",
      [destinationId],
    );

    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({ message: "Cannot delete destination with active bookings" });
    }

    const result = await pool.query(
      "DELETE FROM destinations WHERE id = $1 RETURNING id",
      [destinationId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Delete destination error:", error);
    res.status(500).json({ message: "Server error while deleting destination" });
  }
});

app.post("/bookings", authenticateToken, async (req, res) => {
  try {
    const { destinationId, travelersCount, travelDate } = req.body;

    if (!destinationId || !travelersCount || !travelDate) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    const count = Number(travelersCount);
    if (isNaN(count) || count < 1) {
      return res.status(400).json({ message: "Travelers count must be at least 1" });
    }

    const bookingDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return res.status(400).json({ message: "Travel date cannot be in the past" });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, destination_id, travelers_count, travel_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, destinationId, count, travelDate],
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
});

app.get("/bookings", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        bookings.id,
        bookings.travelers_count,
        bookings.travel_date,
        destinations.name AS destination_name,
        destinations.category AS destination_category,
        destinations.description AS destination_description,
        destinations.image_key AS destination_image_key
       FROM bookings
       JOIN destinations ON bookings.destination_id = destinations.id
       WHERE bookings.user_id = $1
       ORDER BY bookings.travel_date ASC, bookings.id ASC`,
      [req.user.id],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

app.delete("/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const result = await pool.query(
      "DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING id",
      [bookingId, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await pool.testConnection();
});
