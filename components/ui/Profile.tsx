"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Profile.module.css";

type User = {
  id: number;
  email: string;
  name?: string | null;
  avatar?: string | null;
  department?: string;
  points?: number;
};

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [name, setName] = useState(user.name || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data.user.avatar) {
            setAvatarPreview(data.user.avatar);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file.");
        setMessageType("error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB.");
        setMessageType("error");
        return;
      }

      setAvatar(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setMessageType("success");

        if (result.avatar) {
          setAvatarPreview(result.avatar);
        }

        setAvatar(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(result.message || "Failed to update profile");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred while updating your profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <button
            onClick={() => router.push("/dashboard")}
            className={styles.backButton}
          >
            ← Back
          </button>
          <h1 className={styles.title}>Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer} onClick={handleAvatarClick}>
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile Avatar"
                  width={100}
                  height={100}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {getInitials(name || user.email)}
                </div>
              )}
              <div className={styles.avatarOverlay}>
                <span className={styles.cameraIcon}>📷</span>
                <span className={styles.changeText}>Change Photo</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <p className={styles.avatarHint}>
              Click to upload a new profile picture (max 5MB)
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          {message && (
            <div
              className={`${styles.message} ${
                messageType === "success" ? styles.success : styles.error
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
