"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { useScroll } from "./ScrollContext";
import LoginModal from "./LoginModal";
import { scrollToSection } from "../../utils/scrollUtils";

const Navbar = () => {
  const { scrolled } = useScroll();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <>
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
            <button
              onClick={() => handleNavClick("home")}
              className={styles.navButton}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick("about")}
              className={styles.navButton}
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick("events")}
              className={styles.navButton}
            >
              Events
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick("contact")}
              className={styles.navButton}
            >
              Contact
            </button>
          </li>
          <li className={styles.loginBtn}>
            <button onClick={handleLoginClick} className={styles.loginButton}>
              Login
            </button>
          </li>
        </ul>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Navbar;
