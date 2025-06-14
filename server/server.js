express = require('express');
cors = require('cors');
dotenv = require('dotenv');
mongoose = require('mongoose');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
connectDB();
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
    origin: "http://localhost:3000", // Your frontend URL
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

  // Handle new message
  socket.on('new message', (messageData) => {
    const chat = messageData.chat;
    if (!chat?.members) return;

    chat.members.forEach((user) => {
      if (user._id !== messageData.sender._id) {
        socket.to(user._id).emit('message received', messageData);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});