import "./topSection.css";
import Navbar from "./Navbar";
import Hero from "./Hero";

function TopSection() {
  return (
    <div className="top-section" id="home">
      <Navbar />
      <Hero />
    </div>
  );
}

export default TopSection;
