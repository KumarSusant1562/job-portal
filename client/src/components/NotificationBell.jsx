import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import '../styles/NotificationBell.css';

const NotificationBell = ({ socket }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const isNotificationVisibleForRole = (notification) => {
    if (!user) return false;
    if (user.role === 'jobseeker') {
      return notification.type !== 'new_application';
    }
    return true;
  };

  const visibleNotifications = useMemo(
    () => notifications.filter((notification) => isNotificationVisibleForRole(notification)),
    [notifications, user]
  );

  const visibleUnreadCount = useMemo(
    () => visibleNotifications.filter((notification) => !notification.isRead).length,
    [visibleNotifications]
  );

  useEffect(() => {
    if (user && socket) {
      // Connect user to socket for real-time notifications
      socket.emit('user_connected', user._id);

      // Listen for new notifications
      socket.on('new_notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    // Fetch existing notifications
    fetchNotifications();

    return () => {
      if (socket) {
        if (user?._id) {
          socket.emit('user_disconnected', user._id);
        }
        socket.off('new_notification');
      }
    };
  }, [user, socket]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!user) return;
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === 'job_posted' && notification.relatedId) {
      // Navigate to job details page
      navigate(`/jobs/${notification.relatedId}`);
      setIsOpen(false);
    } else if (notification.type === 'application_status' || notification.type === 'new_application') {
      // For job seekers, go to dashboard
      if (user.role === 'jobseeker') {
        navigate('/jobseeker-dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard?section=applications');
      }
      setIsOpen(false);
    } else if (notification.link) {
      // Use the link field as fallback
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        🔔
        {visibleUnreadCount > 0 && <span className="notification-badge">{visibleUnreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {visibleUnreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {visibleNotifications.length === 0 ? (
              <div className="empty-state">
                <p>📭 No notifications yet</p>
              </div>
            ) : (
              visibleNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notification-icon">{notification.icon}</div>

                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {getTimeAgo(new Date(notification.createdAt))}
                    </div>
                  </div>

                  {!notification.isRead && <div className="unread-dot"></div>}

                  <button
                    className="delete-notification-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {visibleNotifications.length > 0 && (
            <button
              type="button"
              className="view-all-notifications"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
            >
              View all notifications →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format time
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return 'Just now';
}

export default NotificationBell;
