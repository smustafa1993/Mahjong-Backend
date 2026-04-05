// src/core/registry.js
// Stores and tracks the dynamic state of all active tile instances.
// Allows us to decouple dynamic values from the tile templates.

class Registry {
  constructor() {
    this.instances = new Map();
  }

  // Register a new tile template with its default starting value.
  // Ignores if already registered (so drawing 4 duplicates only sets base once).
  registerTile(templateId, baseValue) {
    if (!this.instances.has(templateId)) {
      this.instances.set(templateId, baseValue);
    }
  }

  // Get current value
  getValue(templateId) {
    return this.instances.get(templateId);
  }

  // Update value (for dynamic scaling)
  updateValue(templateId, delta) {
    if (this.instances.has(templateId)) {
      const current = this.instances.get(templateId);
      this.instances.set(templateId, current + delta);
    }
  }

  // Check if any tile hit 0 or 10. Returns true if game over condition met, false otherwise.
  checkGameOverCondition() {
    for (let [templateId, value] of this.instances.entries()) {
      if (value <= 0 || value >= 10) {
        return { isGameOver: true, reason: `Tile value reached ${value} limit.`, templateId };
      }
    }
    return { isGameOver: false };
  }

  // Get full state of instances for debugging or client hydration if needed
  getAll() {
    return Object.fromEntries(this.instances);
  }

  // Reset the registry for a new game session
  reset() {
    this.instances.clear();
  }
}

// Singleton export
export const registry = new Registry();
