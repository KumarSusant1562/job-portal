// Initialize Socket.io for real-time notifications
const initializeSocket = (io) => {
  const userSockets = {}; // Map userId to socketId
  const socketUsers = {}; // Map socketId to userId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins their notification room
    socket.on('user_connected', (userId) => {
      const previousUserId = socketUsers[socket.id];
      if (previousUserId && previousUserId !== userId) {
        socket.leave(`user_${previousUserId}`);
        delete userSockets[previousUserId];
      }

      userSockets[userId] = socket.id;
      socketUsers[socket.id] = userId;
      socket.join(`user_${userId}`);
      console.log(`User ${userId} connected to notifications`);
    });

    socket.on('user_disconnected', (userId) => {
      if (socketUsers[socket.id] === userId) {
        socket.leave(`user_${userId}`);
        delete userSockets[userId];
        delete socketUsers[socket.id];
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const userId = socketUsers[socket.id] || Object.keys(userSockets).find((key) => userSockets[key] === socket.id);
      if (userId) {
        delete userSockets[userId];
        delete socketUsers[socket.id];
        console.log(`User ${userId} disconnected`);
      }
    });
  });

  // Emit notification to specific user
  const sendNotificationToUser = (userId, notification) => {
    io.to(`user_${userId}`).emit('new_notification', notification);
  };

  // Emit to multiple users (e.g., all job seekers)
  const broadcastNotification = (userIds, notification) => {
    userIds.forEach((userId) => {
      io.to(`user_${userId}`).emit('new_notification', notification);
    });
  };

  return { sendNotificationToUser, broadcastNotification, userSockets };
};

module.exports = { initializeSocket };
