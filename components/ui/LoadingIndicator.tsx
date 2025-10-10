"use client";

import React from "react";
import styles from "./LoadingIndicator.module.css";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "medium",
  message = "Loading...",
}) => {
  return (
    <div className={`${styles.loadingWrapper} ${styles[size]}`}>
      <div className={styles.typingIndicator}>
        <div className={styles.typingCircle} />
        <div className={styles.typingCircle} />
        <div className={styles.typingCircle} />
        <div className={styles.typingShadow} />
        <div className={styles.typingShadow} />
        <div className={styles.typingShadow} />
      </div>
      {message && <p className={styles.loadingMessage}>{message}</p>}
    </div>
  );
};

export default LoadingIndicator;
