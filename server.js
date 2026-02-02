const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const ideaRoutes = require('./routes/idea');
const interestRoutes = require('./routes/interest');
const commentRoutes = require('./routes/comment');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://idealink-frontend.vercel.app',
    'https://idealink-frontend-git-main-annita-cherutos-projects.vercel.app',
    'https://idealink-frontend-anitacheru.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/idea", ideaRoutes);
app.use('/api/interests', interestRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("IdeaLink API is running..."));

// Sync DB and start server
const PORT = process.env.PORT || 5000;

// 🔥 FORCE SYNC - This will update the database schema
sequelize.sync({ alter: true })  // ← CHANGED THIS LINE
  .then(() => {
    console.log("✅ Database synced with { alter: true }");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ Database sync error:", err));