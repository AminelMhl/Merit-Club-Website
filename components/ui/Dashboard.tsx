"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/clientAuth";
import styles from "./Dashboard.module.css";
import Navbar from "./Navbar";

type User = {
  id: number;
  email: string;
  name?: string | null;
  department?: string;
  avatar?: string | null;
  points?: number;
  isAdmin?: boolean;
};

interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  points?: number;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export default function Dashboard({ user }: { user: User }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPoints, setCurrentPoints] = useState(user.points || 0);
  const [loading, setLoading] = useState(true);

  // Fetch latest user data including points and tasks
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await fetch("/api/profile");
        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setCurrentPoints(userData.user.points || 0);
        }

        // Fetch user tasks
        const tasksResponse = await fetch("/api/tasks");
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData.tasks || []);
        }

        // Fetch user notifications
        const notificationsResponse = await fetch("/api/notifications");
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const memberPoints = currentPoints;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTask = async (taskId: number) => {
    try {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (!currentTask) return;

      // Update UI
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );

      // Update task completion status in database
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !currentTask.completed,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const markNotificationRead = async (notificationId: number) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      // Update notification in database
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: notificationId,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: false } : notif
          )
        );
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert on error
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: false } : notif
        )
      );
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      // Optimistically remove from UI
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );

      // Delete notification from database
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Revert on error - would need to refetch to restore properly
        console.error("Failed to delete notification");
        // Refetch notifications to restore state
        const notificationsResponse = await fetch("/api/notifications");
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications || []);
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Refetch notifications on error
      const notificationsResponse = await fetch("/api/notifications");
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.notifications || []);
      }
    }
  };

  const deleteTask = async (taskId: number, isCompleted: boolean) => {
    if (!isCompleted) {
      alert("You can only delete completed tasks!");
      return;
    }

    try {
      // Optimistically remove from UI
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Delete task from database
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Revert on error - would need to refetch to restore properly
        console.error("Failed to delete task");
        // Refetch tasks to restore state
        const tasksResponse = await fetch("/api/tasks");
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData.tasks || []);
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Refetch tasks on error
      const tasksResponse = await fetch("/api/tasks");
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks || []);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <>
      <Navbar user={user} />
      <div className={styles.dashboardContainer}>
        {/* Dashboard Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.navLeft}>
            <h2 className={styles.logo}>Dashboard</h2>
          </div>

          <div className={styles.navCenter}>
            <span className={styles.userName}>
              Welcome, {user.name || user.email}
            </span>
          </div>

          <div className={styles.navRight}>
            {/* Notifications */}
            <div className={styles.notificationContainer} ref={notificationRef}>
              <button
                className={styles.notificationButton}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                🔔
                {unreadCount > 0 && (
                  <span className={styles.notificationBadge}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.dropdownHeader}>
                    <h4>Notifications</h4>
                  </div>
                  {notifications.length == 0 ? (
                    <center>
                      <h3>No new notifications.</h3>
                    </center>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`${styles.notificationItem} ${
                          !notif.read ? styles.unread : ""
                        }`}
                      >
                        <div
                          className={styles.notificationContent}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <p className={styles.notificationMessage}>
                            {notif.message}
                          </p>
                          <span className={styles.notificationTime}>
                            {formatNotificationTime(notif.createdAt)}
                          </span>
                        </div>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          title="Delete notification"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Avatar Dropdown */}
            <div className={styles.userContainer} ref={dropdownRef}>
              <button
                className={styles.userAvatar}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar} // ✅ Use user.avatar directly (already includes full path)
                    alt={user.name || user.email}
                    className={styles.avatarImg}
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  getInitials(user.name || user.email)
                )}
              </button>

              {dropdownOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.userAvatarLarge}>
                        {user.avatar ? (
                          <img
                            src={user.avatar} // ✅ Use user.avatar directly (already includes full path)
                            alt={user.name || user.email}
                            className={styles.avatarImgLarge}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              // Show initials fallback
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = getInitials(
                                  user.name || user.email
                                );
                              }
                            }}
                          />
                        ) : (
                          getInitials(user.name || user.email)
                        )}
                      </div>
                      <div>
                        <p className={styles.userNameDropdown}>
                          {user.name || user.email}
                        </p>
                        <p className={styles.userRole}>{user.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.dropdownMenu}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => router.push("/Profile")}
                    >
                      👤 Profile
                    </button>
                    <button className={styles.dropdownItem} onClick={logout}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Dashboard Content */}
        <main className={styles.mainContent}>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{memberPoints}</h3>
                <p className={styles.statLabel}>Member Points</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : tasks.filter((t) => t.completed).length}
                </h3>
                <p className={styles.statLabel}>Tasks Completed</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : tasks.filter((t) => !t.completed).length}
                </h3>
                <p className={styles.statLabel}>Pending Tasks</p>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className={styles.tasksSection}>
            <h2 className={styles.sectionTitle}>Your Tasks</h2>
            <div className={styles.tasksList}>
              {loading ? (
                <h1 className={styles.noTasks}>Loading tasks...</h1>
              ) : tasks.length == 0 ? (
                <h1 className={styles.noTasks}>
                  You have no tasks, for now...
                </h1>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`${styles.taskCard} ${
                      task.completed ? styles.completed : ""
                    }`}
                  >
                    <div className={styles.taskHeader}>
                      <div className={styles.taskCheckbox}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className={styles.checkbox}
                        />
                      </div>
                      <div className={styles.taskInfo}>
                        <h4 className={styles.taskTitle}>{task.title}</h4>
                        {task.description && (
                          <p className={styles.taskDescription}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className={styles.taskMeta}>
                        <div className={styles.taskMetaContent}>
                          {task.points && (
                            <span className={styles.taskPoints}>
                              +{task.points} pts
                            </span>
                          )}
                          <span className={styles.taskDue}>
                            Created: {formatDate(task.createdAt)}
                          </span>
                        </div>
                        {task.completed && (
                          <button
                            className={styles.deleteTaskButton}
                            onClick={() => deleteTask(task.id, task.completed)}
                            title="Delete completed task"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
