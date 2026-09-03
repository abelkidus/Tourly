import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDestinationImage } from "../utils/imageMapper";
import "./programsSection.css";

function ProgramsSection() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/destinations`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch destinations");
        }

        setDestinations(data);
      } catch (err) {
        setError(err.message || "Failed to load destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [API_URL]);

  if (loading) {
    return (
      <section className="programs" id="destinations">
        <p className="programs__status">Loading destinations...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="programs" id="destinations">
        <p className="programs__status programs__status--error">{error}</p>
      </section>
    );
  }

  const categories = Array.from(new Set(destinations.map((d) => d.category || "Destinations")));

  return (
    <section className="programs" id="destinations">
      {categories.map((category, idx) => {
        const categoryDestinations = destinations.filter((d) => (d.category || "Destinations") === category);

        return (
          <div key={category} className={`program-row ${idx % 2 === 1 ? "program-row--alt" : ""}`}>
            <div className="program-intro">
              <p className="program-script">{category}</p>
              <h2>{category.toUpperCase()}</h2>
              <p>Explore breathtaking places in {category} with Tourly!</p>
              <Link to="/booking">Book a trip</Link>
            </div>

            <div className="program-cards">
              {categoryDestinations.map((dest) => {
                const bgImage = getDestinationImage(dest.image_key);

                return (
                  <article
                    key={dest.id}
                    className="program-card"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  >
                    <div className="program-card__content">
                      <span className="program-card__category">{dest.category}</span>
                      <h3 className="program-card__name">{dest.name}</h3>
                      {dest.description && <p className="program-card__desc">{dest.description}</p>}
                      <button
                        className="program-card__book-btn"
                        onClick={() => navigate(`/booking?destinationId=${dest.id}`)}
                        type="button"
                      >
                        Book Now
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ProgramsSection;

