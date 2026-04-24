import "./programsSection.css";

function ProgramsSection() {
  return (
    <section className="programs">
      <div className="program-row">
        <div className="program-intro">
          <p className="program-script">Worldwide</p>
          <h2>PROGRAMS</h2>
          <p>Explore the world!</p>
          <a href="/">Explore all programs</a>
        </div>

        <div className="program-cards">
          <article className="program-card" id="australia">
            Australia
          </article>
          <article className="program-card" id="japan">
            Japan
          </article>
          <article className="program-card" id="china">
            China
          </article>
          <article className="program-card" id="germany">
            Germany
          </article>
        </div>
      </div>

      <div className="program-row program-row--alt">
        <div className="program-intro">
          <p className="program-script">Africa</p>
          <h2>ABROAD</h2>
          <p>Enjoy your Holidays in Africa!</p>
          <a href="/">Explore all programs</a>
        </div>

        <div className="program-cards">
          <article className="program-card" id="ethiopia">
            Ethiopia
          </article>
          <article className="program-card" id="tanzania">
            Tanzania
          </article>
          <article className="program-card" id="southAfrica">
            South Africa
          </article>
          <article className="program-card" id="ghana">
            Ghana
          </article>
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
