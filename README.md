# Tourly 🌍✈️

Tourly is a full-stack modern travel and tour booking platform. It features seamless destination exploration, secure authentication (JWT & Google OAuth 2.0), user trip booking and management, dynamic destination discovery, and an administrative management dashboard.

---

## 🚀 Features

- **Dynamic Landing Page**: Responsive hero, navigation, and dynamically loaded destination programs.
- **Secure Authentication**: 
  - Email & password registration and login with bcrypt hashing.
  - Google OAuth 2.0 single sign-on with automatic user provisioning.
  - Stateless JSON Web Token (JWT) sessions with role-based authorization (`user` & `admin`).
- **Trip Booking Management**:
  - Book trips for destinations with traveler count and date validation.
  - View personal booking history with UTC-safe date formatting.
  - Cancel existing trips with user ownership protection.
- **Admin Dashboard**:
  - Protected admin routes for destination management.
  - Add new destination packages with metadata and image key mappings.
  - Review destination inventory and safely delete unbooked destinations.
- **Security & Reliability**:
  - Scoped rate limiting on authentication routes.
  - Strict CORS policy and HTTP security headers via Helmet.
  - Client-side and server-side input sanitization and validation.
  - Toast notifications and asynchronous loading spinners.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM 7, React Hot Toast, Google OAuth React
- **Backend**: Node.js, Express 5, PostgreSQL (`pg`), JSONWebToken, Helmet, Express-Rate-Limit, Express-Validator
- **Database**: PostgreSQL 14+

---

## 📦 Getting Started

### 1. Prerequisites

- **Node.js**: `v18.x` or higher
- **PostgreSQL**: `v14.x` or higher
- **Google Cloud OAuth 2.0 Client ID** (for Google Login)

---

### 2. Clone the Repository

```bash
git clone https://github.com/abelkidus/Tourly.git
cd Tourly
```

---

### 3. Environment Variables Configuration

#### Frontend (`.env`)
Create a `.env` file in the project root based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the values:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:5000
```

#### Backend (`backend/.env`)
Create a `backend/.env` file based on `backend/.env.example`:
```bash
cp backend/.env.example backend/.env
```
Fill in the values:
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tourly_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_64_character_hex_or_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

### 4. Database Setup

1. **Create the Database**:
   ```sql
   CREATE DATABASE tourly_db;
   ```

2. **Initialize Database Schema**:
   Run the schema initialization script using `psql` or your database client:
   ```bash
   psql -U postgres -d tourly_db -f backend/schema.sql
   ```

3. **Seed Initial Destination Data**:
   ```bash
   cd backend
   npm install
   npm run seed
   ```

---

### 5. Install Dependencies & Run

#### Backend Server
```bash
cd backend
npm install
npm start
# Server will run on http://localhost:5000
```

#### Frontend Client
```bash
# In the project root directory
npm install
npm run dev
# App will run on http://localhost:5173
```

---

## 📂 Project Structure

```
Tourly/
├── .env.example               # Root environment variables template
├── index.html                 # Main HTML entry point
├── package.json               # Frontend dependencies & scripts
├── vite.config.js             # Vite configuration
├── src/
│   ├── assets/images/         # Destination and theme image assets
│   ├── components/            # Reusable UI components (Navbar, TopSection, Programs, Route Guards, NotFound)
│   ├── context/               # React Context (AuthContext for JWT & user state)
│   ├── utils/                 # Utility helpers (imageMapper)
│   ├── AdminDashboard.jsx     # Admin destination management page
│   ├── Booking.jsx            # Booking creation page
│   ├── BookingList.jsx        # User booking history page
│   ├── Log_in.jsx             # User login & Google OAuth page
│   ├── Sign_up.jsx            # Registration page
│   ├── welcome.jsx            # Authenticated welcome dashboard
│   ├── App.jsx                # Application routes & layout
│   └── main.jsx               # Application entry point with Providers
└── backend/
    ├── .env.example           # Backend environment variables template
    ├── db.js                  # PostgreSQL connection pool & healthcheck
    ├── middleware/            # Auth middleware (authenticateToken, requireAdmin)
    ├── package.json           # Backend dependencies & scripts
    ├── schema.sql             # PostgreSQL table schema & index definitions
    ├── seed.js                # Database seeder script
    ├── server.js              # Express API server & routes
    └── validator.js           # Express validator rules for registration
```

---

## 📄 License

This project is licensed under the ISC License.
