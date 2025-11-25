const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const ideaRoutes = require('./routes/idea');
const interestRoutes = require('./routes/interest');

dotenv.config();

const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/idea", ideaRoutes);
app.use("/api/interest", interestRoutes);

app.get("/", (req, res) => res.send("IdeaLink API is running..."));

// Sync DB and start server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log("✅ Database synced");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ Database sync error:", err));