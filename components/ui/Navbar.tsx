"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useScroll } from "./ScrollContext";
import LoginModal from "./LoginModal";
import { scrollToSection } from "../../utils/scrollUtils";

interface NavbarProps {
  user?: {
    id: number;
    email: string;
    name?: string | null;
    department?: string;
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const { scrolled } = useScroll();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleNavClick = (sectionId: string) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

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
            {user ? (
              <button
                onClick={handleDashboardClick}
                className={styles.loginButton}
              >
                Dashboard
              </button>
            ) : (
              <button onClick={handleLoginClick} className={styles.loginButton}>
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Navbar;
