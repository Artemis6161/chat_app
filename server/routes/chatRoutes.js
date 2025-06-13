const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createChat } = require('../controllers/chatController');

router.post('/', protect, createChat); // POST /api/chat

module.exports = router;
