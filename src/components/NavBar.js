import { useState } from "react";
import logo from "../images/metromovies.png";
export function Navbar({ children }) {
  return (
    <nav className="navbar navbar-light">
      <div className="container-fluid navbar-custom">
        <Logo />

        {children}
      </div>
    </nav>
  );
}
export function Input({ setMovie }) {
  const [name, setName] = useState("");
  const regex = /[^a-z0-9 ]/i;
  function handleSummit(e) {
    e.preventDefault();
    if (
      name !== "" &&
      name.length > 1 &&
      !regex.test(name) &&
      name.length <= 40
    ) {
      setMovie(name);
    }
    setName("");
  }

  return (
    <form onSubmit={handleSummit}>
      <input
        className="search"
        type="text"
        placeholder="Type the name of the movie here."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="search-btn" type="submit">
        Submit
      </button>
    </form>
  );
}
function Logo() {
  return (
    <div className="logo">
      <img src={logo} alt="logo" />
    </div>
  );
}
