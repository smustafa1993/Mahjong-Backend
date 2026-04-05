// src/core/deck.js
import { v4 as uuidv4 } from 'uuid';
import { TILE_TEMPLATES } from './constants.js';
import { registry } from './registry.js';

class DeckManager {
  constructor() {
    this.drawPile = [];
    this.discardPile = [];
    this.emptyDrawPileCount = 0;
  }

  // Generates a fully new standard 136-tile deck, registers their UUIDs in the registry
  generateFreshDeck() {
    const newTiles = [];
    TILE_TEMPLATES.forEach((template) => {
      // 4 copies of each tile in a standard game
      for (let i = 0; i < 4; i++) {
        const id = uuidv4();
        registry.registerTile(template.templateId, template.baseValue);
        
        newTiles.push({
          id: id,
          templateId: template.templateId,
          type: template.type,
          name: template.name,
          suit: template.suit,
          baseValue: template.baseValue,
          isSpecial: template.isSpecial
          // Dynamic value is decoupled and accessed via registry!
        });
      }
    });

    return this.shuffle(newTiles);
  }

  // Shuffle an array (Fisher-Yates)
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Starts or resets the session
  initSession() {
    this.emptyDrawPileCount = 0;
    this.discardPile = [];
    this.drawPile = this.generateFreshDeck();
  }

  // Draws N tiles. Trigger the trap reshuffle exactly as requested if deck runs empty.
  drawHand(size = 5) {
    const hand = [];

    // Draw tiles 1 by 1
    for (let i = 0; i < size; i++) {
      if (this.drawPile.length === 0) {
        this.emptyDrawPileCount += 1;
        
        // Trap check -> game over is checked externally by gameLogic, but we flag it
        if (this.emptyDrawPileCount >= 3) {
          // Can't draw anymore, limit reached
          break;
        }

        // --- THE TRAP: Add fresh deck, combine with discard, shuffle ---
        const freshDeck = this.generateFreshDeck();
        this.drawPile = this.shuffle([...freshDeck, ...this.discardPile]);
        this.discardPile = []; // Discard pile consumed
      }

      // Safe to pop if we have tiles
      if (this.drawPile.length > 0) {
        hand.push(this.drawPile.pop());
      }
    }
    
    return hand;
  }

  // Send a hand to the discard pile
  discardHand(hand) {
    this.discardPile.push(...hand);
  }
}

export const deckManager = new DeckManager();
