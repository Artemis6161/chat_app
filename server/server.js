express = require('express');
cors = require('cors');
dotenv = require('dotenv');
mongoose = require('mongoose');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
connectDB();
const Message = require('./models/Message');
const Chat = require('./models/Chat');

// Middleware
app.use(cors()); 
app.use(express.json()); 

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);
app.get('/', (req, res) => {
  res.send('API is running');
  console.log('API is running');
})




const server = http.createServer(app);
//  Initialize socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// socket connection
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  // Join a chat room
  socket.on('join chat', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

 
socket.on('new message', async (messageData) => {
  try {
    const { content, chat } = messageData;
    if (!chat?._id || !messageData.sender?._id) return;

    // Save message to DB
    const newMessage = await Message.create({
      sender: messageData.sender._id,
      content,
      chat: chat._id,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username email")
      .populate({
        path: "chat",
        populate: { path: "members", select: "username email" },
      });

    // Update last message in Chat
    await Chat.findByIdAndUpdate(chat._id, { lastMessage: populatedMessage });

    // Emit to room
    io.to(chat._id).emit('message received', populatedMessage);
  } catch (err) {
    console.error("Error in socket new message:", err.message);
  }
});

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});