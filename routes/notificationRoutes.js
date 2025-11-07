const express = require('express');
const router = express.Router();
const { sendNotifications } = require('../utils/notifications');
const { verifyToken, permitRoles } = require('../middleware/authMiddleware');

router.post('/trigger', verifyToken, permitRoles('PROJECT-INPUTTER', 'PROJECT-AUTHORIZER'), async (req, res) => {
  try {
    await sendNotifications();
    res.json({ message: 'Notifications triggered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;