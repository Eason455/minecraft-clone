// ============================================================
// Inventory system — 36 slots (9 hotbar + 27 storage)
// ============================================================

import { BLOCK, BLOCK_NAMES, BLOCK_PROPS, PLANT_BLOCKS } from './constants.js';
import { getTextureCanvas } from './textures.js';

const MAX_STACK = 64;

class Inventory {
  constructor() {
    // 36 slots: slots 0-8 hotbar, slots 9-35 storage
    this.slots = new Array(36).fill(null).map(() => ({ id: BLOCK.AIR, count: 0 }));

    // UI state
    this.isOpen = false;
    this.cursorItem = null; // { id, count } — item being dragged
    this.cursorFromSlot = -1;

    // Crafting state
    this.craftingGrid = new Array(4).fill(null).map(() => ({ id: BLOCK.AIR, count: 0 })); // 2x2
    this.tableGrid = new Array(9).fill(null).map(() => ({ id: BLOCK.AIR, count: 0 })); // 3x3
    this.craftingResult = null;
    this.usingTable = false;
    this.usingFurnace = false;

    // Give starter items
    this._giveStarterItems();
  }

  _giveStarterItems() {
    // Hotbar starter items for testing
    this.slots[0] = { id: BLOCK.OAK_LOG, count: 16 };
    this.slots[1] = { id: BLOCK.DIRT, count: 64 };
    this.slots[2] = { id: BLOCK.STONE, count: 64 };
    this.slots[3] = { id: BLOCK.COBBLESTONE, count: 32 };
    this.slots[4] = { id: 99, count: 16 }; // sticks
    this.slots[7] = { id: BLOCK.CRAFTING_TABLE, count: 1 };
    this.slots[8] = { id: BLOCK.TORCH, count: 16 };
  }

  // Get selected hotbar item
  getSelectedItem() {
    return this.slots[this._selectedSlot || 0];
  }

  setSelectedSlot(slot) {
    this._selectedSlot = Math.max(0, Math.min(8, slot));
  }

  getSelectedSlot() {
    return this._selectedSlot || 0;
  }

  // Add item to inventory (returns overflow count)
  addItem(itemId, count) {
    if (itemId === BLOCK.AIR || count <= 0) return 0;

    let remaining = count;

    // Try to stack with existing items first
    for (let i = 0; i < 36 && remaining > 0; i++) {
      if (this.slots[i].id === itemId && this.slots[i].count < MAX_STACK) {
        const space = MAX_STACK - this.slots[i].count;
        const toAdd = Math.min(space, remaining);
        this.slots[i].count += toAdd;
        remaining -= toAdd;
      }
    }

    // Then find empty slots
    for (let i = 0; i < 36 && remaining > 0; i++) {
      if (this.slots[i].id === BLOCK.AIR) {
        const toAdd = Math.min(MAX_STACK, remaining);
        this.slots[i] = { id: itemId, count: toAdd };
        remaining -= toAdd;
      }
    }

    return remaining;
  }

  // Remove items from a specific slot
  removeItem(slotIndex, count) {
    if (slotIndex < 0 || slotIndex >= 36) return;
    this.slots[slotIndex].count = Math.max(0, this.slots[slotIndex].count - count);
    if (this.slots[slotIndex].count <= 0) {
      this.slots[slotIndex] = { id: BLOCK.AIR, count: 0 };
    }
  }

  // Check if inventory has items (for crafting)
  hasItems(itemId, count) {
    let total = 0;
    for (const slot of this.slots) {
      if (slot.id === itemId) total += slot.count;
    }
    return total >= count;
  }

  // Consume items from inventory (for crafting)
  consumeItems(itemId, count) {
    let remaining = count;
    for (let i = 0; i < 36 && remaining > 0; i++) {
      if (this.slots[i].id === itemId) {
        const toRemove = Math.min(this.slots[i].count, remaining);
        this.slots[i].count -= toRemove;
        remaining -= toRemove;
        if (this.slots[i].count <= 0) {
          this.slots[i] = { id: BLOCK.AIR, count: 0 };
        }
      }
    }
    return remaining === 0;
  }

  // Swap/merge items between slots
  swapSlots(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;

    const fromItem = fromIdx >= 0 ? this.slots[fromIdx] : this.cursorItem;
    const toItem = toIdx >= 0 ? this.slots[toIdx] : this.cursorItem;

    if (!fromItem || !toItem) return;

    // If same item type, try to stack
    if (fromItem.id === toItem.id && fromItem.id !== BLOCK.AIR) {
      const total = fromItem.count + toItem.count;
      if (total <= MAX_STACK) {
        if (toIdx >= 0) {
          this.slots[toIdx].count = total;
          if (fromIdx >= 0) this.slots[fromIdx] = { id: BLOCK.AIR, count: 0 };
          else this.cursorItem = { id: BLOCK.AIR, count: 0 };
        }
        return;
      } else {
        // Fill to max, leave remainder
        const remainder = total - MAX_STACK;
        if (toIdx >= 0) this.slots[toIdx].count = MAX_STACK;
        if (fromIdx >= 0) this.slots[fromIdx].count = remainder;
        else this.cursorItem.count = remainder;
        return;
      }
    }

    // Different items — swap
    const temp = { ...(toIdx >= 0 ? this.slots[toIdx] : this.cursorItem) };
    if (toIdx >= 0) {
      this.slots[toIdx] = { ...(fromIdx >= 0 ? this.slots[fromIdx] : this.cursorItem) };
    } else {
      this.cursorItem = { ...(fromIdx >= 0 ? this.slots[fromIdx] : this.cursorItem) };
    }
    if (fromIdx >= 0) {
      this.slots[fromIdx] = temp;
    } else {
      this.cursorItem = temp;
    }
  }

  // Get item name for display
  getItemName(itemId) {
    return BLOCK_NAMES[itemId] || 'Unknown';
  }

  // Virtual item textures (not blocks)
  _virtualItemTextures = {
    99: 'planks',    // stick → looks like wood
    101: 'planks',   // wood pickaxe
    102: 'cobblestone', // stone pickaxe
    103: 'planks',   // wood axe
    104: 'cobblestone', // stone axe
    105: 'planks',   // wood sword
    106: 'cobblestone', // stone sword
    107: 'cobblestone', // stone shovel
  };

  _virtualItemNames = {
    99: 'Stick',
    101: 'Wooden Pickaxe',
    102: 'Stone Pickaxe',
    103: 'Wooden Axe',
    104: 'Stone Axe',
    105: 'Wooden Sword',
    106: 'Stone Sword',
    107: 'Stone Shovel',
  };

  // Get texture for an item
  getItemTexture(itemId) {
    const props = BLOCK_PROPS[itemId];
    if (props) {
      const texName = props.topTex || props.sideTex || props.tex || 'stone';
      return getTextureCanvas(texName);
    }
    // Try virtual item
    const vTex = this._virtualItemTextures[itemId];
    if (vTex) return getTextureCanvas(vTex);
    return getTextureCanvas('stone');
  }

  // Get name
  getItemName(itemId) {
    if (this._virtualItemNames[itemId]) return this._virtualItemNames[itemId];
    return BLOCK_NAMES[itemId] || 'Unknown';
  }
}

export default Inventory;
