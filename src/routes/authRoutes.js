// src/routes/authRoutes.js
import express from 'express';

const router = express.Router();

// In-Memory Leaderboard for the Technical Assessment
let leaderboard = [
  { name: 'DragonMaster', score: 25 },
  { name: 'WindWalker', score: 18 },
  { name: 'TileKing', score: 15 },
  { name: 'HighRoller', score: 12 },
  { name: 'EastWind', score: 10 },
];

router.get('/leaderboard', (req, res) => {
  res.status(200).json({
    success: true,
    data: leaderboard
  });
});

router.post('/submit', (req, res) => {
  const { name, score } = req.body;
  if (name && score !== undefined) {
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Keep only top 5
  }
  res.status(200).json({ success: true, data: leaderboard });
});

export default router;
