const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./config/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');

// Import models to ensure they're registered with Sequelize
const User = require('./models/User');
const Comment = require('./models/Comment');
const Album = require('./models/Album');
const Invitation = require('./models/Invitation');
const InvitationWish = require('./models/InvitationWish');
const InvitationRsvp = require('./models/InvitationRsvp');

// Set up model associations if they exist
if (Album.associate) {
  Album.associate({ User, Comment, Album });
}
if (Invitation.associate) {
  Invitation.associate({ User, InvitationWish });
}
if (InvitationWish.associate) {
  InvitationWish.associate({ Invitation });
}
if (InvitationRsvp.associate) {
  InvitationRsvp.associate({ Invitation });
}

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const timelineRoutes = require('./routes/timelineRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const guestRoutes = require('./routes/guestRoutes');
const photosRoutes = require('./routes/photoRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const albumRoutes = require('./routes/albumRoutes');
const contactRoutes = require('./routes/contactRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const invitationController = require('./controllers/invitationController');
const { cleanupExpiredInvitations } = invitationController;
const invitationWishRoutes = require('./routes/invitationWishRoutes');

const app = express();

const sessionStore = new pgSession({
  conString: process.env.DATABASE_URL || `postgres://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  tableName: 'session',
  createTableIfMissing: true
});

// Session configuration (required for OAuth)
app.use(session({
  store: sessionStore,
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
app.use('/api/contact', contactRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/invitations', invitationWishRoutes);
app.get('/i/:slug', invitationController.getInvitationBySlug);

// Serve static album files
app.use('/albums', express.static('public/albums'));

// Serve generated invitation files without caching so edits are always reflected
app.use('/invitations', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Serve static invitation files
app.use('/invitations', express.static('public/invitations'));

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

    await cleanupExpiredInvitations();
    setInterval(() => {
      cleanupExpiredInvitations().catch((error) => {
        console.error('Invitation cleanup failed:', error);
      });
    }, 24 * 60 * 60 * 1000); //Every 24 hours clean up

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