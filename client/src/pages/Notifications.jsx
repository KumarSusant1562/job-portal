import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import '../styles/Notifications.css';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.data);
    } catch (fetchError) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationAPI.markAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((item) => (item._id === notification._id ? { ...item, isRead: true } : item))
        );
      }

      if (notification.type === 'job_posted' && notification.relatedId) {
        navigate(`/jobs/${notification.relatedId}`);
        return;
      }

      if (notification.type === 'application_status' || notification.type === 'new_application') {
        if (user?.role === 'recruiter') {
          navigate('/recruiter-dashboard?section=applications');
        } else {
          navigate('/jobseeker-dashboard');
        }
        return;
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (clickError) {
      setError('Failed to open notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (markAllError) {
      setError('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((item) => item._id !== notificationId));
    } catch (deleteError) {
      setError('Failed to delete notification');
    }
  };

  const roleFilteredNotifications = notifications.filter((notification) => {
    if (user?.role === 'jobseeker') {
      return notification.type !== 'new_application';
    }
    return true;
  });

  const visibleNotifications = roleFilteredNotifications.filter((notification) => {
    if (activeFilter === 'unread') {
      return !notification.isRead;
    }

    return true;
  });

  const unreadCount = roleFilteredNotifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="notifications-page">
      <section className="notifications-hero">
        <div>
          <p className="eyebrow">Activity Center</p>
          <h1>Notifications</h1>
          <p>Track application updates, recruiter activity, and new job alerts in one place.</p>
        </div>

        <div className="notifications-summary">
          <div>
            <span>{roleFilteredNotifications.length}</span>
            <small>Total</small>
          </div>
          <div>
            <span>{unreadCount}</span>
            <small>Unread</small>
          </div>
        </div>
      </section>

      <section className="notifications-panel">
        <div className="notifications-toolbar">
          <div className="filter-tabs">
            <button
              type="button"
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={activeFilter === 'unread' ? 'active' : ''}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
            </button>
          </div>

          <div className="toolbar-actions">
            <button type="button" className="secondary-action" onClick={fetchNotifications}>
              Refresh
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
        </div>

        {loading ? (
          <p className="notifications-state">Loading notifications...</p>
        ) : error ? (
          <div className="notifications-state error">{error}</div>
        ) : visibleNotifications.length === 0 ? (
          <div className="notifications-empty">
            <h2>No notifications yet</h2>
            <p>When something changes, it will appear here immediately.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {visibleNotifications.map((notification) => (
              <article
                key={notification._id}
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
              >
                <button
                  type="button"
                  className="notification-card-main"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-card-icon">{notification.icon}</div>

                  <div className="notification-card-body">
                    <div className="notification-card-meta">
                      <h3>{notification.title}</h3>
                      <span>{getTimeAgo(new Date(notification.createdAt))}</span>
                    </div>
                    <p>{notification.message}</p>
                  </div>
                </button>

                <div className="notification-card-actions">
                  {!notification.isRead && (
                    <button
                      type="button"
                      className="mini-action"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    className="mini-action danger"
                    onClick={() => handleDelete(notification._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return `${Math.floor(interval)} years ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return 'Just now';
}

export default Notifications;