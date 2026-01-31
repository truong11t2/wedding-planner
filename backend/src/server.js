const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');

// Import models to ensure they're registered with Sequelize
const User = require('./models/User');
const Comment = require('./models/Comment');
const Album = require('./models/Album');

// Set up model associations if they exist
if (Album.associate) {
  Album.associate({ User, Comment, Album });
}

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const timelineRoutes = require('./routes/timelineRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const guestRoutes = require('./routes/guestRoutes');
const photosRoutes = require('./routes/photoRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const albumRoutes = require('./routes/albumRoutes');

const app = express();

// Session configuration (required for OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = process.env.CORS_URL.split(',');

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/albums', albumRoutes);

// Serve static album files
app.use('/albums', express.static('public/albums'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync database (create tables)
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();