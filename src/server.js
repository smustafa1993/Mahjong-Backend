// src/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import gameRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/auth', authRoutes);

// Verify Health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Mahjong Engine Running' });
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
