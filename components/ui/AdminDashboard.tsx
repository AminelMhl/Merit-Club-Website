"use client";

import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Navbar from "./Navbar";

interface User {
  id: number;
  email: string;
  name?: string | null;
  avatar?: string | null;
  department?: string;
  isAdmin?: boolean;
}

interface AdminDashboardProps {
  user: User;
}

interface NonAdminUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  department?: { name: string } | null;
  points: number;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [users, setUsers] = useState<NonAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    userId: "",
  });
  const [notificationForm, setNotificationForm] = useState({
    message: "",
    userId: "",
  });
  const [pointsForm, setPointsForm] = useState({
    points: "",
    userId: "",
  });

  // Fetch non-admin users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      });

      if (response.ok) {
        setSuccess("Task added successfully!");
        setTaskForm({ title: "", userId: "" });
        setShowTaskModal(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add task");
      }
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationForm),
      });

      if (response.ok) {
        setSuccess("Notification sent successfully!");
        setNotificationForm({ message: "", userId: "" });
        setShowNotificationModal(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send notification");
      }
    } catch (err) {
      setError("Failed to send notification");
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pointsForm),
      });

      if (response.ok) {
        setSuccess("Points added successfully!");
        setPointsForm({ points: "", userId: "" });
        setShowPointsModal(false);
        fetchUsers(); // Refresh user list to show updated points
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add points");
      }
    } catch (err) {
      setError("Failed to add points");
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        setSuccess("User removed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to remove user");
      }
    } catch (err) {
      setError("Failed to remove user");
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Navbar user={user} />
      <div className={styles.dashboardContainer}>
        {/* Dashboard Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.navLeft}>
            <h2 className={styles.logo}>Admin Dashboard</h2>
          </div>

          <div className={styles.navCenter}>
            <span className={styles.userName}>
              Welcome back, {user.name}! Manage your team and tasks.
            </span>
          </div>

          <div className={styles.navRight}>
            {/* You can add admin-specific controls here */}
          </div>
        </nav>

        {/* Main Dashboard Content */}
        <main className={styles.mainContent}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{users.length}</h3>
                <p className={styles.statLabel}>Team Members</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {users.reduce((total, user) => total + user.points, 0)}
                </h3>
                <p className={styles.statLabel}>Total Points</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>Admin</h3>
                <p className={styles.statLabel}>Access Level</p>
              </div>
            </div>
          </div>

          {/* Admin Actions Section */}
          <div className={styles.tasksSection}>
            <h2 className={styles.sectionTitle}>Admin Actions</h2>
            <div className={styles.adminActionsGrid}>
              <button
                className={styles.adminActionCard}
                onClick={() => setShowTaskModal(true)}
              >
                <div className={styles.actionIcon}>📋</div>
                <div className={styles.actionContent}>
                  <h3>Add Task</h3>
                  <p>Assign new tasks to team members</p>
                </div>
              </button>

              <button
                className={styles.adminActionCard}
                onClick={() => setShowNotificationModal(true)}
              >
                <div className={styles.actionIcon}>📢</div>
                <div className={styles.actionContent}>
                  <h3>Send Notification</h3>
                  <p>Send messages to users</p>
                </div>
              </button>

              <button
                className={styles.adminActionCard}
                onClick={() => setShowPointsModal(true)}
              >
                <div className={styles.actionIcon}>⭐</div>
                <div className={styles.actionContent}>
                  <h3>Add Points</h3>
                  <p>Award points to team members</p>
                </div>
              </button>
            </div>
          </div>

          {/* Team Members Section */}
          <div className={styles.tasksSection}>
            <h2 className={styles.sectionTitle}>
              Team Members ({users.length})
            </h2>

            {loading ? (
              <div className={styles.loading}>Loading users...</div>
            ) : users.length === 0 ? (
              <p>No team members found.</p>
            ) : (
              <div className={styles.tasksList}>
                {users.map((user) => (
                  <div key={user.id} className={styles.taskCard}>
                    <div className={styles.taskHeader}>
                      <div className={styles.taskInfo}>
                        <div className={styles.userInfoContainer}>
                          <div className={styles.userAvatar}>
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              getUserInitials(user.name)
                            )}
                          </div>
                          <div className={styles.userDetails}>
                            <h4 className={styles.taskTitle}>{user.name}</h4>
                            <p className={styles.taskDescription}>
                              {user.email}
                            </p>
                            <p className={styles.taskDescription}>
                              {user.department?.name || "No Department"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskPoints}>
                          {user.points} pts
                        </span>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Task</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowTaskModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddTask} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Assign to User</label>
                <select
                  className={styles.userSelect}
                  value={taskForm.userId}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, userId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={styles.submitButton}>
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Send Notification</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowNotificationModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSendNotification} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      message: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter your notification message"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Send to User</label>
                <select
                  className={styles.userSelect}
                  value={notificationForm.userId}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      userId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={styles.submitButton}>
                Send Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Points Modal */}
      {showPointsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add Points</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowPointsModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddPoints} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Points to Add</label>
                <input
                  type="number"
                  value={pointsForm.points}
                  onChange={(e) =>
                    setPointsForm({ ...pointsForm, points: e.target.value })
                  }
                  required
                  placeholder="Enter points amount"
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Add to User</label>
                <select
                  className={styles.userSelect}
                  value={pointsForm.userId}
                  onChange={(e) =>
                    setPointsForm({ ...pointsForm, userId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - Current: {user.points} pts
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={styles.submitButton}>
                Add Points
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
