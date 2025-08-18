
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { useScroll } from "./ScrollContext";

const Navbar = () => {
  const { scrolled } = useScroll();

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Image
          src="/Merit Logo.png"
          alt="Merit Logo"
          width={100}
          height={75}
          priority
        />
      </div>
      <ul className={styles.links}>
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
        <li className={styles.loginBtn}>
          <Link href="/Login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
