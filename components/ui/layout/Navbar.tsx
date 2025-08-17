import React from "react";
import Button from "../Button";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo"></div>
      <div className="links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/events">Events</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </div>
      <div className="login-btn">
        <Button text="Login" />
      </div>
    </div>
  );
};
export default Navbar;
