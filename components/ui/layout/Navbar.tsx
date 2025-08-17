import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./Navbar.css"; 
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <Image src="/Merit Logo.png" alt="Merit Logo" width={80} height={65} />
      </div>
      <div className="links">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/About">About</Link>
        </li>
        <li>
          <Link href="/Events">Events</Link>
        </li>
        <li>
          <Link href="/Contact">Contact</Link>
        </li>
        <li className="login-btn">
          <Link href="/Login">Login</Link>
        </li>
      </div>
    </div>
  );
};
export default Navbar;
