let onlineUsers = 0;
let totalVisits = 0;

exports.trackVisit = (req, res, next) => {
  totalVisits++;
  next();
};

exports.getStats = async (req, res) => {
  const User = require('../models/User');
  const userCount = await User.countDocuments();
  res.json({
    online: onlineUsers,
    total: totalVisits,
    users: userCount
  });
};

// Gọi trong middleware khi client kết nối
exports.userConnected = () => {
  onlineUsers++;
};

exports.userDisconnected = () => {
  if (onlineUsers > 0) onlineUsers--;
};
