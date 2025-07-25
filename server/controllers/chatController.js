const Chat = require('../models/Chat');

const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    // Check if chat exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      members: { $all: [req.user._id, userId] },
    }).populate('members', '-password');

    if (chat) return res.json(chat);

    // Create new chat
    const newChat = new Chat({
      members: [req.user._id, userId],
    });

    await newChat.save();

    const fullChat = await Chat.findById(newChat._id).populate('members', '-password');
    res.status(201).json(fullChat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const fetchChats = async (req, res) => {
  const userId = req.user._id;
  try {
    let chats = await Chat.find({ members: { $in: [userId] } })
      .populate('members', '-password') // ✅ correct field name
      .populate('lastMessage')          // Make sure your schema has this field
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createChat,fetchChats, };
