const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, (req, res) => {
  // Access req.user.id here (from token)
  res.json({ message: 'Protected route', userId: req.user.id });
});

module.exports = router;
