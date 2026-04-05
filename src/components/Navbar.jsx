import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">Tourly</div>

      <ul className="navbar__links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#destinations">Destinations</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <button className="navbar__button">Sign-in</button>
    </nav>
  );
}

export default Navbar;
