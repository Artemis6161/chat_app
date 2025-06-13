express = require('express');
cors = require('cors');
dotenv = require('dotenv');
mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
  console.log('API is running');
})

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});