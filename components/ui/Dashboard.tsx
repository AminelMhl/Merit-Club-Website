"use client";
import { logout } from "@/lib/clientAuth";

type User = {
  id: number;
  email: string;
  name?: string | null;
  department?: string;
};

export default function Dashboard({ user }: { user: User }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        color: "#fff",
        background: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <button
          onClick={logout}
          style={{
            background: "#fccc06",
            color: "#000",
            border: "none",
            padding: "0.6rem 1rem",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
      <p style={{ opacity: 0.9, marginTop: "1rem" }}>
        Welcome, {user.name || user.email} —{" "}
        <span style={{ color: "#fccc06" }}>{user.department}</span>
      </p>
    </div>
  );
}
