const express = require("express");
const cors = require("cors");
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.Routes');
const appRoutes = require('./routes/app.Routes');
const { createGeneralLimiter, createAuthLimiter } = require('./middleware/rateLimiter');

const app = express();

// General rate limiting
const generalLimiter = createGeneralLimiter();
const authLimiter = createAuthLimiter();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/apps', appRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SentriQ Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        me: 'GET /api/auth/me'
      },
      apps: {
        checkRisk: 'POST /api/apps/check-risk',
        getApps: 'GET /api/apps',
        getStats: 'GET /api/apps/stats',
        getApp: 'GET /api/apps/:id',
        updateApp: 'PUT /api/apps/:id',
        deleteApp: 'DELETE /api/apps/:id'
      }
    }
  });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;