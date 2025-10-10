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
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address.");
      return;
    }

    setResetLoading(true);
    setError("");
    setResetSuccess("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setResetSuccess("Email with your password has been sent successfully!");
      setResetEmail("");

      // Auto close success message and reset form after 3 seconds
      setTimeout(() => {
        setShowResetForm(false);
        setResetSuccess("");
      }, 3000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
    setError("");
    setResetSuccess("");
    setResetEmail("");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.loginBox}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {!showResetForm ? (
          // Login Form
          <>
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
                Forgot your password?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleResetForm();
                  }}
                >
                  Reset it
                </a>
              </span>
            </div>
          </>
        ) : (
          // Reset Password Form
          <>
            <h2 className={styles.loginTitle}>Reset Password</h2>
            <p className={styles.loginSubtitle}>
              Enter your email to receive your password via email.
            </p>

            {resetSuccess ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✅</div>
                <p>{resetSuccess}</p>
              </div>
            ) : (
              <form className={styles.loginForm} onSubmit={handleResetPassword}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Enter your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  autoComplete="email"
                />
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending..." : "Reset Now"}
                </button>
              </form>
            )}

            <div className={styles.loginFooter}>
              <span>
                Remember your password?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleResetForm();
                  }}
                >
                  Back to Login
                </a>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
