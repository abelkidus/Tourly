require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const pool = require("./db");
const { signupValidationRules, validateSignup } = require("./validator");
const { OAuth2Client } = require("google-auth-library");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 5000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

app.use(limiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   }),
// );
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth server is running");
});

app.post("/users/signup", signupValidationRules, validateSignup, async (req, res) => {
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

app.post("/users/login", async (req, res) => {
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

    res.status(200).json({
      message: "Login successful",
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

app.post("/users/google-login", async (req, res) => {
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No account found with this Google email. Please sign up first.",
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      message: "Google login successful",
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

app.post("/admin/destinations", async (req, res) => {
  try {
    const { userId, name, category, description, imageKey } = req.body;

    if (!userId || !name || !category || !description || !imageKey) {
      return res.status(400).json({ message: "All destination fields are required" });
    }

    const adminCheck = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);

    if (adminCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (adminCheck.rows[0].role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
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

app.post("/bookings", async (req, res) => {
  try {
    const { userId, destinationId, travelersCount, travelDate } = req.body;

    if (!userId || !destinationId || !travelersCount || !travelDate) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, destination_id, travelers_count, travel_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, destinationId, travelersCount, travelDate],
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

app.get("/bookings", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

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
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
