const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createChat,fetchChats } = require('../controllers/chatController');

router.post('/', protect, createChat); 
router.get("/", protect, fetchChats);
module.exports = router;
