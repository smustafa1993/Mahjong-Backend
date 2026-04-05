// src/core/constants.js
// This file serves as the "Blueprints" or Templates for our tiles.
// It satisfies the "Junior+ scalability" pattern by separating the definition from the dynamic state.

export const TILE_TYPES = {
  NUMBER: 'NUMBER',
  WIND: 'WIND',
  DRAGON: 'DRAGON',
};

export const SUITS = {
  BAMBOO: 'BAMBOO',
  CHARACTER: 'CHARACTER',
  DOT: 'DOT',
};

export const WINDS = ['East', 'South', 'West', 'North'];
export const DRAGONS = ['Red', 'Green', 'White'];

// We only define one of each type of tile here. They will be instantiated x4 when building the deck.
export const TILE_TEMPLATES = [];

// 1. Generate Number Templates (1-9 for each suit)
Object.values(SUITS).forEach((suit) => {
  for (let value = 1; value <= 9; value++) {
    TILE_TEMPLATES.push({
      templateId: `${suit}_${value}`,
      type: TILE_TYPES.NUMBER,
      suit: suit,
      name: `${value} of ${suit.charAt(0) + suit.slice(1).toLowerCase()}s`,
      baseValue: value,
      isSpecial: false,
    });
  }
});

// 2. Generate Wind Templates
WINDS.forEach((wind) => {
  TILE_TEMPLATES.push({
    templateId: `WIND_${wind.toUpperCase()}`,
    type: TILE_TYPES.WIND,
    name: `${wind} Wind`,
    baseValue: 5,
    isSpecial: true,
  });
});

// 3. Generate Dragon Templates
DRAGONS.forEach((dragon) => {
  TILE_TEMPLATES.push({
    templateId: `DRAGON_${dragon.toUpperCase()}`,
    type: TILE_TYPES.DRAGON,
    name: `${dragon} Dragon`,
    baseValue: 5,
    isSpecial: true,
  });
});
