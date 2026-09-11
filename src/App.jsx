import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopSection from "./components/TopSection";
import ProgramsSection from "./components/ProgramsSection";
import Sign_up from "./Sign_up";
import Log_in from "./Log_in";
import Welcome from "./welcome";
import Booking from "./Booking";
import BookingList from "./BookingList";
import UserProfile from "./UserProfile";
import AdminHome from "./AdminHome";
import AdminDashboard from "./AdminDashboard";
import AdminManageUsers from "./AdminManageUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./components/NotFound";

function HomePage() {
  return (
    <>
      <TopSection />
      <ProgramsSection />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Sign_up" element={<Sign_up />} />
        <Route path="/Log_in" element={<Log_in />} />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/destinations"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminManageUsers />
            </AdminRoute>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/admin/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


