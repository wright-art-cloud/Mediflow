import { db } from '../data/repositories.js';

export const notificationService = {
  getForUser(userId) {
    return db.notifications
      .findBy('user_id', userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getUnreadCount(userId) {
    return db.notifications.findBy('user_id', userId).filter((n) => !n.is_read).length;
  },

  markAsRead(notificationId) {
    return db.notifications.update(notificationId, { is_read: true });
  },

  markAllAsRead(userId) {
    const unread = db.notifications.findBy('user_id', userId).filter((n) => !n.is_read);
    unread.forEach((n) => db.notifications.update(n.notification_id, { is_read: true }));
    return unread.length;
  },

  create({ userId, type, message, relatedId = null, severity = 'info' }) {
    return db.notifications.create({
      user_id: userId,
      type,
      message,
      related_id: relatedId,
      severity,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  },
};
