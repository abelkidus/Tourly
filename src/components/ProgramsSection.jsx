import "./programsSection.css";

function ProgramsSection() {
  return (
    <section className="programs">
      <div className="program-row">
        <div className="program-intro">
          <p className="program-script">Working Holiday</p>
          <h2>PROGRAMS</h2>
          <p>Working Holidays around the World! In Japan, China, Germany. Try something different!</p>
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
          <p className="program-script">Volunteering</p>
          <h2>ABROAD</h2>
          <p>A wide range of meaningful volunteering options with charitable organizations worldwide!</p>
          <a href="/">Explore all programs</a>
        </div>

        <div className="program-cards">
          <article className="program-card">Tanzania</article>
          <article className="program-card">Vietnam</article>
          <article className="program-card">Nepal</article>
          <article className="program-card">Nicaragua</article>
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
