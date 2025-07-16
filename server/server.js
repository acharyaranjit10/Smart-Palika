// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Handle large base64 images
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/users', require('./routes/users')); // For future profile page

// Root check
// app.get('/', (req, res) => {
//   res.send('Smart Palika backend is running 🚀');
// });

// Start server
const PORT = process.env.PORT || 5000;

const path = require('path');

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));