import "./hero.css";
import heroImage from "../assets/images/hero.jpg";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <h1>
          Discover Your Next<span className="different">Adventure</span>
        </h1>
        <p>Explore breathtaking destinations and unforgettable experiences with Tourly.</p>
        <button>Explore Tours</button>
      </div>
    </section>
  );
}

export default Hero;
