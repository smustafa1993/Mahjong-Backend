// src/routes/gameRoutes.js
import express from 'express';
import { startGame, placeBet, getGameState } from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', startGame);
router.post('/bet', placeBet);
router.get('/state', getGameState);

export default router;
