import React from "react";
import NavMessage from "../NavMessage";

function Nav(props) {
  return (
    <nav className="navbar">
      <ul>
        <li className="brand">
          <a href="/">Memory Game</a>
        </li>
        <NavMessage score={props.score} />
        <li>
          Score: {props.score}
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
