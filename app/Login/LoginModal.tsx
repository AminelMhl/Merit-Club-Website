"use client";
import React, { useState } from "react";
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    // TODO: Add authentication logic here
    alert("Logged in successfully!");
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
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
