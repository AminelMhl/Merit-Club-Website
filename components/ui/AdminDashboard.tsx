"use client";

import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Navbar from "./Navbar";
import SuccessNotification from "./SuccessNotification";
import LoadingIndicator from "./LoadingIndicator";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface User {
  id: number;
  email: string;
  name?: string | null;
  avatar?: string | null;
  department?: string;
  isAdmin?: boolean;
  adminRole?: string;
  departmentId?: number | null;
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
  departmentId?: number | null;
  points: number;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [users, setUsers] = useState<NonAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Loading states for operations
  const [taskLoading, setTaskLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [removeUserLoading, setRemoveUserLoading] = useState<number | null>(
    null
  );

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{
    departmentId: number | null;
    departmentName: string | null;
  }>({ departmentId: null, departmentName: null });

  const [taskForm, setTaskForm] = useState({
    title: "",
    userId: "",
  });
  const [notificationForm, setNotificationForm] = useState({
    message: "",
    userIds: [] as string[], // Changed to support multiple users
    selectAll: false,
    selectDepartment: false,
  });
  const [pointsForm, setPointsForm] = useState({
    points: "",
    userIds: [] as string[], // Changed to support multiple users
    action: "add", // "add" or "reduce"
    selectAll: false,
    selectDepartment: false,
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

        // Get admin department info if available
        if (data.adminDepartment) {
          setAdminInfo({
            departmentId: data.adminDepartment.id,
            departmentName: data.adminDepartment.name,
          });
        }
      } else {
        setError("Failed to fetch members");
      }
    } catch (err) {
      setError("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show success notifications
  const showSuccessNotification = (message: string, description: string) => {
    setNotificationMessage(message);
    setNotificationDescription(description);
    setShowNotification(true);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskLoading(true);
    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      });

      if (response.ok) {
        const selectedUser = users.find(
          (u) => u.id.toString() === taskForm.userId
        );
        const userName = selectedUser ? selectedUser.name : "member";

        showSuccessNotification(
          "Task Added Successfully!",
          `Task "${taskForm.title}" assigned to ${userName}`
        );

        setTaskForm({ title: "", userId: "" });
        setShowTaskModal(false);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add task");
      }
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setTaskLoading(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationForm.userIds.length === 0) {
      setError("Please select at least one member");
      return;
    }

    setNotificationLoading(true);
    try {
      const response = await fetch("/api/admin/notifications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: notificationForm.message,
          userIds: notificationForm.userIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        showSuccessNotification(
          "Notification Sent Successfully!",
          `Message delivered to ${data.count} member(s)`
        );

        setNotificationForm({
          message: "",
          userIds: [],
          selectAll: false,
          selectDepartment: false,
        });
        setShowNotificationModal(false);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send notification");
      }
    } catch (err) {
      setError("Failed to send notification");
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsForm.userIds.length === 0) {
      setError("Please select at least one member");
      return;
    }

    setPointsLoading(true);
    try {
      const pointsValue = parseInt(pointsForm.points);
      const finalPoints =
        pointsForm.action === "reduce" ? -pointsValue : pointsValue;

      const response = await fetch("/api/admin/points/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: finalPoints,
          userIds: pointsForm.userIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const action = pointsForm.action === "add" ? "Added" : "Reduced";
        const pointsValue = Math.abs(parseInt(pointsForm.points));

        showSuccessNotification(
          `Points ${action} Successfully!`,
          `${pointsValue} points ${
            pointsForm.action === "add" ? "added to" : "reduced from"
          } ${pointsForm.userIds.length} member(s)`
        );

        setPointsForm({
          points: "",
          userIds: [],
          action: "add",
          selectAll: false,
          selectDepartment: false,
        });
        setShowPointsModal(false);
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update points");
      }
    } catch (err) {
      setError("Failed to update points");
    } finally {
      setPointsLoading(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user?")) return;

    setRemoveUserLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const removedUser = users.find((u) => u.id === userId);
        setUsers(users.filter((u) => u.id !== userId));

        showSuccessNotification(
          "User Removed Successfully!",
          `${removedUser?.name || "Member"} has been removed from the system`
        );
      } else {
        const data = await response.json();
        setError(data.error || "Failed to remove user");
      }
    } catch (err) {
      setError("Failed to remove user");
    } finally {
      setRemoveUserLoading(null);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Helper functions for multi-user selection
  const handleUserToggle = (
    userId: string,
    formType: "notification" | "points"
  ) => {
    if (formType === "notification") {
      const currentIds = notificationForm.userIds;
      const updatedIds = currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId];

      setNotificationForm({
        ...notificationForm,
        userIds: updatedIds,
        selectAll: updatedIds.length === users.length,
        selectDepartment: false, // Reset department selection when individual users are selected
      });
    } else {
      const currentIds = pointsForm.userIds;
      const updatedIds = currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId];

      setPointsForm({
        ...pointsForm,
        userIds: updatedIds,
        selectAll: updatedIds.length === users.length,
        selectDepartment: false, // Reset department selection when individual users are selected
      });
    }
  };

  const handleSelectAll = (formType: "notification" | "points") => {
    if (formType === "notification") {
      const newSelectAll = !notificationForm.selectAll;
      setNotificationForm({
        ...notificationForm,
        userIds: newSelectAll ? users.map((u) => u.id.toString()) : [],
        selectAll: newSelectAll,
        selectDepartment: false, // Reset department selection
      });
    } else {
      const newSelectAll = !pointsForm.selectAll;
      setPointsForm({
        ...pointsForm,
        userIds: newSelectAll ? users.map((u) => u.id.toString()) : [],
        selectAll: newSelectAll,
        selectDepartment: false, // Reset department selection
      });
    }
  };

  const handleSelectDepartment = (formType: "notification" | "points") => {
    if (!adminInfo.departmentId) return;

    const departmentUsers = users.filter(
      (user) => user.departmentId === adminInfo.departmentId
    );

    if (formType === "notification") {
      const newSelectDepartment = !notificationForm.selectDepartment;
      setNotificationForm({
        ...notificationForm,
        userIds: newSelectDepartment
          ? departmentUsers.map((u) => u.id.toString())
          : [],
        selectAll: false, // Reset select all
        selectDepartment: newSelectDepartment,
      });
    } else {
      const newSelectDepartment = !pointsForm.selectDepartment;
      setPointsForm({
        ...pointsForm,
        userIds: newSelectDepartment
          ? departmentUsers.map((u) => u.id.toString())
          : [],
        selectAll: false, // Reset select all
        selectDepartment: newSelectDepartment,
      });
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar .simplebar-scrollbar:before {
          background-color: #fdc703 !important;
        }
        .custom-scrollbar .simplebar-track {
          background-color: transparent !important;
        }
      `}</style>
      <Navbar user={user} />

      {/* Success Notification */}
      <SuccessNotification
        message={notificationMessage}
        description={notificationDescription}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <SimpleBar
        className="custom-scrollbar"
        style={{
          maxHeight: "100vh",
          height: "100vh",
          width: "100%",
        }}
        autoHide={true}
      >
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
                    <h3>Manage Points</h3>
                    <p>Add or reduce points for team members</p>
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
                <LoadingIndicator
                  size="medium"
                  message="Loading team members..."
                />
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
                            disabled={removeUserLoading === user.id}
                          >
                            {removeUserLoading === user.id ? (
                              <LoadingIndicator
                                size="small"
                                message="Removing..."
                              />
                            ) : (
                              "Remove"
                            )}
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
      </SimpleBar>

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
              <button
                type="submit"
                className={styles.submitButton}
                disabled={taskLoading}
              >
                {taskLoading ? (
                  <LoadingIndicator size="small" message="Adding Task..." />
                ) : (
                  "Add Task"
                )}
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
                <label>Send to Members</label>
                <div className={styles.selectAllContainer}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={notificationForm.selectAll}
                      onChange={() => handleSelectAll("notification")}
                    />
                    <span>Select All Members ({users.length})</span>
                  </label>
                  {adminInfo.departmentId && (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={notificationForm.selectDepartment}
                        onChange={() => handleSelectDepartment("notification")}
                      />
                      <span>
                        Select Department Members (
                        {
                          users.filter(
                            (u) => u.departmentId === adminInfo.departmentId
                          ).length
                        }
                        {adminInfo.departmentName
                          ? ` - ${adminInfo.departmentName}`
                          : ""}
                        )
                      </span>
                    </label>
                  )}
                </div>
                <div className={styles.userSelectionContainer}>
                  {users.map((user) => (
                    <label key={user.id} className={styles.userCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={notificationForm.userIds.includes(
                          user.id.toString()
                        )}
                        onChange={() =>
                          handleUserToggle(user.id.toString(), "notification")
                        }
                      />
                      <span className={styles.userCheckboxText}>
                        {user.name} ({user.email}) -{" "}
                        {user.department?.name || "No Department"}
                      </span>
                    </label>
                  ))}
                </div>
                <div className={styles.selectionSummary}>
                  Selected: {notificationForm.userIds.length} member(s)
                </div>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={notificationLoading}
              >
                {notificationLoading ? (
                  <LoadingIndicator size="small" message="Sending..." />
                ) : (
                  "Send Notification"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manage Points Modal */}
      {showPointsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Manage Points</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowPointsModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddPoints} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Action</label>
                <div className={styles.actionToggle}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="action"
                      value="add"
                      checked={pointsForm.action === "add"}
                      onChange={(e) =>
                        setPointsForm({ ...pointsForm, action: e.target.value })
                      }
                    />
                    <span
                      className={`${styles.radioOption} ${styles.addOption}`}
                    >
                      Add Points
                    </span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="action"
                      value="reduce"
                      checked={pointsForm.action === "reduce"}
                      onChange={(e) =>
                        setPointsForm({ ...pointsForm, action: e.target.value })
                      }
                    />
                    <span
                      className={`${styles.radioOption} ${styles.reduceOption}`}
                    >
                      Reduce Points
                    </span>
                  </label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Points Amount</label>
                <input
                  type="number"
                  value={pointsForm.points}
                  onChange={(e) =>
                    setPointsForm({ ...pointsForm, points: e.target.value })
                  }
                  required
                  placeholder={`Enter points to ${pointsForm.action}`}
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Select Members</label>
                <div className={styles.selectAllContainer}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={pointsForm.selectAll}
                      onChange={() => handleSelectAll("points")}
                    />
                    <span>Select All Members ({users.length})</span>
                  </label>
                  {adminInfo.departmentId && (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={pointsForm.selectDepartment}
                        onChange={() => handleSelectDepartment("points")}
                      />
                      <span>
                        Select Department Members (
                        {
                          users.filter(
                            (u) => u.departmentId === adminInfo.departmentId
                          ).length
                        }
                        {adminInfo.departmentName
                          ? ` - ${adminInfo.departmentName}`
                          : ""}
                        )
                      </span>
                    </label>
                  )}
                </div>
                <div className={styles.userSelectionContainer}>
                  {users.map((user) => (
                    <label key={user.id} className={styles.userCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={pointsForm.userIds.includes(
                          user.id.toString()
                        )}
                        onChange={() =>
                          handleUserToggle(user.id.toString(), "points")
                        }
                      />
                      <span className={styles.userCheckboxText}>
                        {user.name} ({user.email}) - Current: {user.points} pts
                      </span>
                    </label>
                  ))}
                </div>
                <div className={styles.selectionSummary}>
                  Selected: {pointsForm.userIds.length} member(s)
                </div>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={pointsLoading}
              >
                {pointsLoading ? (
                  <LoadingIndicator
                    size="small"
                    message={`${
                      pointsForm.action === "add" ? "Adding" : "Reducing"
                    } Points...`}
                  />
                ) : (
                  `${pointsForm.action === "add" ? "Add" : "Reduce"} Points`
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
