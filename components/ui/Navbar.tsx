"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useScroll } from "./ScrollContext";
import LoginModal from "./LoginModal";
import { scrollToSection } from "../../utils/scrollUtils";
import { logout } from "@/lib/clientAuth";

interface NavbarProps {
  user?: {
    id: number;
    email: string;
    name?: string | null;
    department?: string;
    isAdmin?: boolean;
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const { scrolled } = useScroll();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Ensure component is mounted on client before showing interactive elements
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    closeMobileMenu();
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.isAdmin) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
    closeMobileMenu();
  };

  const handleLogoutClick = () => {
    logout();
    closeMobileMenu();
  };

  const handleNavClick = (sectionId: string) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

    scrollToSection(sectionId);
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

        {/* Burger Menu Button - only render after mounting */}
        <div suppressHydrationWarning>
          {mounted && (
            <button
              className={styles.burgerMenu}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span
                className={`${styles.burgerLine} ${
                  isMobileMenuOpen ? styles.line1Open : ""
                }`}
              ></span>
              <span
                className={`${styles.burgerLine} ${
                  isMobileMenuOpen ? styles.line2Open : ""
                }`}
              ></span>
              <span
                className={`${styles.burgerLine} ${
                  isMobileMenuOpen ? styles.line3Open : ""
                }`}
              ></span>
            </button>
          )}
        </div>

        {/* Mobile Menu Overlay - only render after mounting */}
        {mounted && isMobileMenuOpen && (
          <div className={styles.mobileOverlay} onClick={closeMobileMenu}></div>
        )}

        {/* Navigation Links */}
        <ul
          className={`${styles.links} ${
            mounted && isMobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
          suppressHydrationWarning
        >
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
              // Show logout button if admin and on admin page, otherwise show dashboard button
              user.isAdmin && pathname === "/admin" ? (
                <button
                  onClick={handleLogoutClick}
                  className={styles.loginButton}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleDashboardClick}
                  className={styles.loginButton}
                >
                  {user.isAdmin ? "Admin Dashboard" : "Dashboard"}
                </button>
              )
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
