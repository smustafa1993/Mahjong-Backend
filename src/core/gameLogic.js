// src/core/gameLogic.js
import { registry } from './registry.js';
import { deckManager } from './deck.js';

class GameLogic {
  constructor() {
    this.currentHand = [];
    this.previousHand = [];
    this.score = 0;
    this.history = []; // Array of { hand: [], totalValue: number }
  }

  // Get total dynamic value of a given hand
  getHandValue(hand) {
    let total = 0;
    hand.forEach(tile => {
      // Template-level dynamic tracking
      total += registry.getValue(tile.templateId);
    });
    return total;
  }

  // Start fresh game
  startGame() {
    registry.reset();
    deckManager.initSession();
    this.score = 0;
    this.history = [];
    this.previousHand = [];
    
    // Draw initial hand
    this.currentHand = deckManager.drawHand(5);
    
    return this.getGameState();
  }

  // Process a user's bet ('higher' or 'lower')
  processBet(betDirection) {
    if (this.currentHand.length === 0) {
      throw new Error("Game hasn't started");
    }

    // 1. Snapshot the "Old" hand (which was current)
    const oldHandValue = this.getHandValue(this.currentHand);
    
    // Move current hand to history (keep history small, e.g. last 5)
    this.previousHand = [...this.currentHand];
    this.history.unshift({ hand: this.previousHand, totalValue: oldHandValue });
    if (this.history.length > 5) this.history.pop();

    // 2. Discard it physically
    deckManager.discardHand(this.currentHand);

    // 3. Draw "New" Hand
    this.currentHand = deckManager.drawHand(5);
    const newHandValue = this.getHandValue(this.currentHand);

    // 4. Resolve Bet
    let isWin = false;
    let isTie = false;
    if (newHandValue > oldHandValue && betDirection === 'higher') isWin = true;
    else if (newHandValue < oldHandValue && betDirection === 'lower') isWin = true;
    else if (newHandValue === oldHandValue) isTie = true; // House usually wins ties, or it's a wash. Let's make tie a loss for stakes.

    // 5. Dynamic Scaling! 
    // "Every time a non-number tile is part of a winning hand, its value increases by 1. 
    // If it is part of a losing hand, it decreases by 1 (specific to that tile)."
    // NOTE: This targets `previousHand` (Hand A) which is the hand the player bet ON!
    this.previousHand.forEach(tile => {
      if (tile.isSpecial) {
        if (isWin) {
          registry.updateValue(tile.templateId, +1);
        } else if (!isTie) { // If it's a flat loss
          registry.updateValue(tile.templateId, -1);
        }
      }
    });

    if (isWin) {
      this.score += 1;
    }

    // 6. Check Game Over Conditions
    let gameOverCheck = registry.checkGameOverCondition();
    
    if (deckManager.emptyDrawPileCount >= 3) {
      gameOverCheck = { isGameOver: true, reason: 'Draw Pile exhausted for the 3rd time.' };
    }

    return {
      isWin,
      oldHandValue,
      newHandValue,
      gameState: this.getGameState(gameOverCheck)
    };
  }

  // Bundle the current state for API shipping
  getGameState(gameOverCheck = { isGameOver: false }) {
    // Map registry values onto the hand for the frontend
    const currentHandWithValues = this.currentHand.map(tile => ({
      ...tile,
      currentValue: registry.getValue(tile.templateId)
    }));

    // Reconstruct history with current values slightly, though history tile values represent what they were at the time.
    // The history object already stored the `totalValue` statically. We return it.

    return {
      currentHand: currentHandWithValues,
      currentHandValue: this.getHandValue(this.currentHand),
      score: this.score,
      history: this.history.map(h => ({
        hand: h.hand.map(t => ({ ...t, valueSnapshot: registry.getValue(t.templateId) })), // Exact real-time template snapshot
        totalValue: h.totalValue
      })),
      drawPileCount: deckManager.drawPile.length,
      discardPileCount: deckManager.discardPile.length,
      isGameOver: gameOverCheck.isGameOver,
      gameOverReason: gameOverCheck.reason || null
    };
  }
}

export const gameLogic = new GameLogic();
