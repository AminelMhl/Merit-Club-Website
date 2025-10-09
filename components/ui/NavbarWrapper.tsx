"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";

type User = {
  id: number;
  email: string;
  name?: string | null;
  department?: string;
};

export default function NavbarWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(0);

  const checkSession = async () => {
    // Prevent excessive session checks (minimum 5 second interval)
    const now = Date.now();
    if (now - lastCheck < 5000) {
      return;
    }
    setLastCheck(now);

    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
      } else {
        console.error("Session check error:", response.status);
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    // Listen for storage events to refresh session when login/logout happens
    const handleStorageChange = () => {
      checkSession();
    };

    // Listen for focus events to refresh session when user returns to tab
    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (loading) {
    // Return navbar without user info while loading
    return <Navbar user={null} />;
  }

  return <Navbar user={user} />;
}
