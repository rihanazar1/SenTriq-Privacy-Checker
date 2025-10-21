const express = require("express");
const cors = require("cors");
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.Routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;