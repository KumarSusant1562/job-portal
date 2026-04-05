// Initialize Socket.io for real-time notifications
const initializeSocket = (io) => {
  const userSockets = {}; // Map userId to socketId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins their notification room
    socket.on('user_connected', (userId) => {
      userSockets[userId] = socket.id;
      socket.join(`user_${userId}`);
      console.log(`User ${userId} connected to notifications`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const userId = Object.keys(userSockets).find((key) => userSockets[key] === socket.id);
      if (userId) {
        delete userSockets[userId];
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
