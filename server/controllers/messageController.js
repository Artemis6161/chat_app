const Chat = require("../models/Chat");
const Message = require("../models/Message");


const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username email")
      .populate({
        path: "chat",
        populate: {
          path: "members",
          select: "username email",
        },
      });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: populatedMessage });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email")
      .populate({
        path: 'chat',
        populate: { path: 'members', select: 'username email' }
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};




module.exports = { sendMessage, getMessages };