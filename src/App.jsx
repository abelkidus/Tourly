import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopSection from "./components/TopSection";
import ProgramsSection from "./components/ProgramsSection";
import Sign_up from "./Sign_up";
import Log_in from "./Log_in";
import Welcome from "./welcome";
import Booking from "./Booking";
import BookingList from "./BookingList";
import AdminDashboard from "./AdminDashboard";

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
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
