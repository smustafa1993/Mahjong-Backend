// src/controllers/gameController.js
import { gameLogic } from '../core/gameLogic.js';

export const startGame = (req, res, next) => {
  try {
    const initialState = gameLogic.startGame();
    res.status(200).json({
      success: true,
      message: 'New session started!',
      data: initialState
    });
  } catch (err) {
    next(err);
  }
};

export const placeBet = (req, res, next) => {
  try {
    const { bet } = req.body; // 'higher' or 'lower'
    
    if (!['higher', 'lower'].includes(bet)) {
      return res.status(400).json({ success: false, error: 'Invalid bet direction.' });
    }

    const result = gameLogic.processBet(bet);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const getGameState = (req, res, next) => {
  try {
    const state = gameLogic.getGameState();
    res.status(200).json({
      success: true,
      data: state
    });
  } catch (err) {
    next(err);
  }
};
