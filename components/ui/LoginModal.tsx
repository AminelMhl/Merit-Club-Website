"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Login failed" }));
        setError(data.error || "Login failed");
        return;
      }

      const data = await res.json();
      onClose();
      router.replace(data.redirectPath || "/dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.loginBox}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.loginTitle}>Welcome Back, Meritor</h2>
        <p className={styles.loginSubtitle}>
          You have to be a member of Merit TBS to be able to login.
        </p>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.inputField}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            className={styles.inputField}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <div className={styles.loginFooter}>
          <span>
            Forgot your password? <a href="#">Reset it</a>
          </span>
        </div>
      </div>
    </div>
  );
}
