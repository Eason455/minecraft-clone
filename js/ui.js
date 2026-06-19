// ============================================================
// UI Manager — HUD, inventory screen, crafting UI
// ============================================================

import { BLOCK, BLOCK_NAMES } from './constants.js';
import { getTextureCanvas } from './textures.js';
import { findCraftingRecipe, consumeCraftingIngredients } from './crafting.js';

class UIManager {
  constructor(player, inventory, interactionManager) {
    this.player = player;
    this.inventory = inventory;
    this.interaction = interactionManager;

    this.selectedSlot = 0;

    // UI elements
    this.hud = document.getElementById('hud');
    this.inventoryOverlay = document.getElementById('inventory-overlay');
    this.blocker = document.getElementById('blocker');

    this._buildHUD();
    this._buildInventoryUI();
    this._buildCraftingUI();

    // Initial render
    this.updateHUD();
  }

  // ============ HUD ============

  _buildHUD() {
    this.hud.innerHTML = '';

    // Player stats
    const stats = document.createElement('div');
    stats.id = 'player-stats';

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';
    healthBar.id = 'health-bar';
    stats.appendChild(healthBar);

    const hungerBar = document.createElement('div');
    hungerBar.className = 'hunger-bar';
    hungerBar.id = 'hunger-bar';
    stats.appendChild(hungerBar);

    this.hud.appendChild(stats);

    // Hotbar
    this.hotbarEl = document.createElement('div');
    this.hotbarEl.className = 'hotbar';
    this.hotbarEl.id = 'hotbar';

    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.id = `hotbar-slot-${i}`;
      if (i === 0) slot.classList.add('selected');

      const keyHint = document.createElement('span');
      keyHint.className = 'key-hint';
      keyHint.textContent = i + 1;
      slot.appendChild(keyHint);

      const img = document.createElement('img');
      img.id = `hotbar-img-${i}`;
      slot.appendChild(img);

      const count = document.createElement('span');
      count.className = 'count';
      count.id = `hotbar-count-${i}`;
      slot.appendChild(count);

      this.hotbarEl.appendChild(slot);
    }

    this.hud.appendChild(this.hotbarEl);
  }

  updateHUD() {
    const inv = this.inventory;
    const selectedSlot = this.player.selectedSlot || 0;

    // Update hotbar
    for (let i = 0; i < 9; i++) {
      const item = inv.slots[i];
      const img = document.getElementById(`hotbar-img-${i}`);
      const count = document.getElementById(`hotbar-count-${i}`);
      const slot = document.getElementById(`hotbar-slot-${i}`);

      if (item && item.id !== BLOCK.AIR) {
        const texCanvas = inv.getItemTexture(item.id);
        if (texCanvas && img) {
          img.src = texCanvas.toDataURL();
          img.style.display = 'block';
        }
        if (count) {
          count.textContent = item.count > 1 ? item.count : '';
        }
      } else {
        if (img) img.style.display = 'none';
        if (count) count.textContent = '';
      }

      if (slot) {
        slot.classList.toggle('selected', i === selectedSlot);
      }
    }

    // Update health
    const healthBar = document.getElementById('health-bar');
    if (healthBar) {
      healthBar.innerHTML = '';
      for (let i = 0; i < 10; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = i < Math.ceil(this.player.health / 2) ? '[HP]' : '[--]';
        heart.style.color = i < Math.ceil(this.player.health / 2) ? '#ff4444' : '#444';
        healthBar.appendChild(heart);
      }
    }

    // Update hunger
    const hungerBar = document.getElementById('hunger-bar');
    if (hungerBar) {
      hungerBar.innerHTML = '';
      for (let i = 0; i < 10; i++) {
        const stick = document.createElement('span');
        stick.className = 'drumstick';
        stick.textContent = i < Math.ceil(this.player.hunger / 2) ? '[FD]' : '[--]';
        stick.style.color = i < Math.ceil(this.player.hunger / 2) ? '#d4a017' : '#444';
        hungerBar.appendChild(stick);
      }
    }
  }

  // ============ Inventory Screen ============

  _buildInventoryUI() {
    this.inventoryOverlay.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'inventory-container';

    const title = document.createElement('div');
    title.className = 'inventory-title';
    title.textContent = 'Inventory';
    container.appendChild(title);

    // Storage grid (3 rows x 9 cols = slots 9-35)
    const grid = document.createElement('div');
    grid.className = 'inventory-grid';
    grid.id = 'inventory-grid';
    for (let i = 9; i < 36; i++) {
      const slot = this._createInventorySlot(i);
      grid.appendChild(slot);
    }
    container.appendChild(grid);

    // Hotbar row (slots 0-8)
    const hotbarRow = document.createElement('div');
    hotbarRow.className = 'inventory-hotbar-row';
    hotbarRow.id = 'inventory-hotbar-row';
    for (let i = 0; i < 9; i++) {
      const slot = this._createInventorySlot(i);
      hotbarRow.appendChild(slot);
    }
    container.appendChild(hotbarRow);

    // Crafting section
    this._buildCraftingPanel(container);

    this.inventoryOverlay.appendChild(container);
  }

  _createInventorySlot(index) {
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.id = `inv-slot-${index}`;
    slot.dataset.slotIndex = index;

    const img = document.createElement('img');
    img.id = `inv-img-${index}`;
    slot.appendChild(img);

    const count = document.createElement('span');
    count.className = 'count';
    count.id = `inv-count-${index}`;
    slot.appendChild(count);

    // Click events
    slot.addEventListener('click', (e) => this._onInventoryClick(index, e));
    slot.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this._onInventoryRightClick(index);
    });

    return slot;
  }

  _buildCraftingPanel(container) {
    const panel = document.createElement('div');
    panel.className = 'crafting-panel';
    panel.style.marginTop = '12px';

    // 2x2 Crafting grid
    const grid2x2 = document.createElement('div');
    grid2x2.className = 'crafting-grid-container';

    const label2 = document.createElement('div');
    label2.className = 'crafting-label';
    label2.textContent = 'Crafting';
    grid2x2.appendChild(label2);

    const craftGrid = document.createElement('div');
    craftGrid.className = 'crafting-grid';
    craftGrid.id = 'crafting-grid-2x2';
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      slot.className = 'crafting-slot';
      slot.id = `craft-slot-${i}`;
      slot.dataset.craftIndex = i;
      // Click to put item from cursor
      slot.addEventListener('click', () => this._onCraftSlotClick(i));
      slot.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this._onCraftSlotRightClick(i);
      });
      craftGrid.appendChild(slot);
    }
    grid2x2.appendChild(craftGrid);

    panel.appendChild(grid2x2);

    // Arrow
    const arrow = document.createElement('div');
    arrow.className = 'crafting-arrow';
    arrow.textContent = '==>';
    panel.appendChild(arrow);

    // Result slot
    const resultSlot = document.createElement('div');
    resultSlot.className = 'crafting-result';
    resultSlot.id = 'crafting-result';
    resultSlot.addEventListener('click', () => this._onCraftResultClick());
    panel.appendChild(resultSlot);

    container.appendChild(panel);
  }

  _buildCraftingUI() {
    // The crafting panel is built as part of the inventory overlay
  }

  // ============ 3x3 Crafting Table ============

  openCraftingTable() {
    // Show inventory with 3x3 crafting mode
    this.usingTable = true;
    this.showInventory();
    // Swap the 2x2 crafting grid label and grid to 3x3
    const grid2x2 = document.getElementById('crafting-grid-2x2');
    const label = grid2x2 ? grid2x2.previousElementSibling : null;
    if (grid2x2) {
      grid2x2.className = 'crafting-grid table';
      grid2x2.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.className = 'crafting-slot';
        slot.id = `craft-slot-${i}`;
        slot.dataset.craftIndex = i;
        slot.addEventListener('click', () => this._onTableSlotClick(i));
        slot.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this._onTableSlotRightClick(i);
        });
        grid2x2.appendChild(slot);
      }
      if (label) label.textContent = 'Crafting Table';
    }
  }

  _onTableSlotClick(index) {
    const inv = this.inventory;
    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      if (inv.tableGrid[index].id === BLOCK.AIR) {
        inv.tableGrid[index] = { id: inv.cursorItem.id, count: 1 };
        inv.cursorItem.count--;
        if (inv.cursorItem.count <= 0) inv.cursorItem = null;
      }
    } else if (inv.tableGrid[index].id !== BLOCK.AIR) {
      inv.cursorItem = { ...inv.tableGrid[index] };
      inv.tableGrid[index] = { id: BLOCK.AIR, count: 0 };
    }
    this.updateInventoryDisplay();
  }

  _onTableSlotRightClick(index) {
    const inv = this.inventory;
    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      if (inv.tableGrid[index].id === BLOCK.AIR) {
        inv.tableGrid[index] = { id: inv.cursorItem.id, count: 1 };
        inv.cursorItem.count--;
        if (inv.cursorItem.count <= 0) inv.cursorItem = null;
      } else if (inv.tableGrid[index].id === inv.cursorItem.id) {
        inv.tableGrid[index].count++;
        inv.cursorItem.count--;
        if (inv.cursorItem.count <= 0) inv.cursorItem = null;
      }
    } else if (inv.tableGrid[index].id !== BLOCK.AIR) {
      const half = Math.ceil(inv.tableGrid[index].count / 2);
      inv.cursorItem = { id: inv.tableGrid[index].id, count: half };
      inv.tableGrid[index].count -= half;
      if (inv.tableGrid[index].count <= 0) {
        inv.tableGrid[index] = { id: BLOCK.AIR, count: 0 };
      }
    }
    this.updateInventoryDisplay();
  }

  // ============ Inventory interactions ============

  updateInventoryDisplay() {
    const inv = this.inventory;

    // Update all inventory slots
    for (let i = 0; i < 36; i++) {
      const item = inv.slots[i];
      this._updateSlotDisplay(i, item);
    }

    // Update crafting grid
    for (let i = 0; i < 4; i++) {
      const item = inv.craftingGrid[i];
      const img = document.getElementById(`craft-slot-${i}`)?.querySelector('img');
      const slot = document.getElementById(`craft-slot-${i}`);
      if (!slot) continue;
      if (item && item.id !== BLOCK.AIR) {
        const texCanvas = inv.getItemTexture(item.id);
        if (texCanvas) {
          let imgEl = slot.querySelector('img');
          if (!imgEl) {
            imgEl = document.createElement('img');
            slot.appendChild(imgEl);
          }
          imgEl.src = texCanvas.toDataURL();
          slot.title = `${inv.getItemName(item.id)} x${item.count}`;
        }
      } else {
        const imgEl = slot.querySelector('img');
        if (imgEl) imgEl.remove();
        slot.title = '';
      }
    }

    // Update crafting result (2x2 or 3x3 table)
    const grid = this.usingTable ? inv.tableGrid : inv.craftingGrid;
    const gridW = this.usingTable ? 3 : 2;
    const gridH = this.usingTable ? 3 : 2;
    const result = findCraftingRecipe(grid, gridW, gridH);
    const resultSlot = document.getElementById('crafting-result');
    if (resultSlot) {
      resultSlot.innerHTML = '';
      if (result) {
        const texCanvas = inv.getItemTexture(result.id);
        if (texCanvas) {
          const img = document.createElement('img');
          img.src = texCanvas.toDataURL();
          resultSlot.appendChild(img);
        }
        if (result.count > 1) {
          const count = document.createElement('span');
          count.className = 'count';
          count.textContent = result.count;
          resultSlot.appendChild(count);
        }
      }
    }

    // Update table grid slots if in table mode
    if (this.usingTable) {
      for (let i = 0; i < 9; i++) {
        const item = inv.tableGrid[i];
        const slot = document.getElementById(`craft-slot-${i}`);
        if (!slot) continue;
        let imgEl = slot.querySelector('img');
        if (item && item.id !== BLOCK.AIR) {
          const texCanvas = inv.getItemTexture(item.id);
          if (texCanvas) {
            if (!imgEl) { imgEl = document.createElement('img'); slot.appendChild(imgEl); }
            imgEl.src = texCanvas.toDataURL();
          }
          slot.title = `${inv.getItemName(item.id)} x${item.count}`;
        } else {
          if (imgEl) imgEl.remove();
          slot.title = '';
        }
      }
    }
  }

  _updateSlotDisplay(index, item) {
    const img = document.getElementById(`inv-img-${index}`);
    const count = document.getElementById(`inv-count-${index}`);

    if (item && item.id !== BLOCK.AIR) {
      const texCanvas = this.inventory.getItemTexture(item.id);
      if (texCanvas && img) {
        img.src = texCanvas.toDataURL();
        img.style.display = 'block';
      }
      if (count) {
        count.textContent = item.count > 1 ? item.count : '';
      }
    } else {
      if (img) img.style.display = 'none';
      if (count) count.textContent = '';
    }
  }

  _onInventoryClick(index, event) {
    const inv = this.inventory;

    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      // Place cursor item into slot
      if (event.shiftKey) {
        // Place one item
        if (inv.slots[index].id === BLOCK.AIR) {
          inv.slots[index] = { id: inv.cursorItem.id, count: 1 };
          inv.cursorItem.count--;
          if (inv.cursorItem.count <= 0) inv.cursorItem = null;
        } else if (inv.slots[index].id === inv.cursorItem.id) {
          inv.slots[index].count++;
          inv.cursorItem.count--;
          if (inv.cursorItem.count <= 0) inv.cursorItem = null;
        }
      } else {
        // Swap/stack between cursor and slot
        this._swapCursorWithSlot(index);
      }
    } else {
      // Pick up from slot
      this._pickupFromSlot(index);
    }

    this.updateInventoryDisplay();
  }

  _onInventoryRightClick(index) {
    const inv = this.inventory;
    const item = inv.slots[index];

    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      // Place one from cursor
      if (item.id === BLOCK.AIR) {
        inv.slots[index] = { id: inv.cursorItem.id, count: 1 };
        inv.cursorItem.count--;
      } else if (item.id === inv.cursorItem.id && item.count < 64) {
        inv.slots[index].count++;
        inv.cursorItem.count--;
      }
      if (inv.cursorItem.count <= 0) inv.cursorItem = null;
    } else if (item && item.id !== BLOCK.AIR) {
      // Split stack: pick up half
      const half = Math.ceil(item.count / 2);
      inv.cursorItem = { id: item.id, count: half };
      inv.slots[index].count -= half;
      if (inv.slots[index].count <= 0) {
        inv.slots[index] = { id: BLOCK.AIR, count: 0 };
      }
    }

    this.updateInventoryDisplay();
  }

  _swapCursorWithSlot(index) {
    const inv = this.inventory;
    const temp = inv.cursorItem;
    inv.cursorItem = inv.slots[index].id !== BLOCK.AIR ? { ...inv.slots[index] } : null;
    inv.slots[index] = temp || { id: BLOCK.AIR, count: 0 };
  }

  _pickupFromSlot(index) {
    const inv = this.inventory;
    const item = inv.slots[index];
    if (item && item.id !== BLOCK.AIR) {
      inv.cursorItem = { ...item };
      inv.slots[index] = { id: BLOCK.AIR, count: 0 };
    }
  }

  _onCraftSlotClick(index) {
    const inv = this.inventory;
    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      // Place one in crafting slot
      if (inv.craftingGrid[index].id === BLOCK.AIR) {
        inv.craftingGrid[index] = { id: inv.cursorItem.id, count: 1 };
        inv.cursorItem.count--;
        if (inv.cursorItem.count <= 0) inv.cursorItem = null;
      }
    } else if (inv.craftingGrid[index].id !== BLOCK.AIR) {
      // Pick up from crafting slot
      inv.cursorItem = { ...inv.craftingGrid[index] };
      inv.craftingGrid[index] = { id: BLOCK.AIR, count: 0 };
    }
    this.updateInventoryDisplay();
  }

  _onCraftSlotRightClick(index) {
    const inv = this.inventory;
    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      if (inv.craftingGrid[index].id === BLOCK.AIR) {
        inv.craftingGrid[index] = { id: inv.cursorItem.id, count: 1 };
        inv.cursorItem.count--;
        if (inv.cursorItem.count <= 0) inv.cursorItem = null;
      } else if (inv.craftingGrid[index].id === inv.cursorItem.id) {
        inv.craftingGrid[index].count++;
        inv.cursorItem.count--;
        if (inv.cursorItem.count <= 0) inv.cursorItem = null;
      }
    } else if (inv.craftingGrid[index].id !== BLOCK.AIR) {
      const half = Math.ceil(inv.craftingGrid[index].count / 2);
      inv.cursorItem = { id: inv.craftingGrid[index].id, count: half };
      inv.craftingGrid[index].count -= half;
      if (inv.craftingGrid[index].count <= 0) {
        inv.craftingGrid[index] = { id: BLOCK.AIR, count: 0 };
      }
    }
    this.updateInventoryDisplay();
  }

  _onCraftResultClick() {
    const inv = this.inventory;
    const grid = this.usingTable ? inv.tableGrid : inv.craftingGrid;
    const gridW = this.usingTable ? 3 : 2;
    const gridH = this.usingTable ? 3 : 2;
    const result = findCraftingRecipe(grid, gridW, gridH);
    if (!result) return;

    // Consume one from each crafting slot
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].id !== BLOCK.AIR) {
        grid[i].count--;
        if (grid[i].count <= 0) {
          grid[i] = { id: BLOCK.AIR, count: 0 };
        }
      }
    }

    // Add result to inventory
    inv.addItem(result.id, result.count);

    this.updateInventoryDisplay();
  }

  // ============ Visibility ============

  showInventory() {
    this.inventory.isOpen = true;
    this.inventoryOverlay.classList.remove('hidden');
    this.updateInventoryDisplay();
  }

  hideInventory() {
    const inv = this.inventory;
    inv.isOpen = false;
    this.inventoryOverlay.classList.add('hidden');
    // Return crafting items to inventory
    this._returnCraftingItems();
    // Return table items if was in table mode
    if (this.usingTable) {
      this.usingTable = false;
      for (let i = 0; i < 9; i++) {
        if (inv.tableGrid[i].id !== BLOCK.AIR) {
          const overflow = inv.addItem(inv.tableGrid[i].id, inv.tableGrid[i].count);
          inv.tableGrid[i] = { id: BLOCK.AIR, count: 0 };
        }
      }
      // Reset grid to 2x2
      const grid2x2 = document.getElementById('crafting-grid-2x2');
      if (grid2x2) {
        grid2x2.className = 'crafting-grid';
        grid2x2.innerHTML = '';
        for (let i = 0; i < 4; i++) {
          const slot = document.createElement('div');
          slot.className = 'crafting-slot';
          slot.id = `craft-slot-${i}`;
          slot.dataset.craftIndex = i;
          slot.addEventListener('click', () => this._onCraftSlotClick(i));
          slot.addEventListener('contextmenu', (e) => { e.preventDefault(); this._onCraftSlotRightClick(i); });
          grid2x2.appendChild(slot);
        }
        const label = grid2x2.previousElementSibling;
        if (label) label.textContent = 'Crafting';
      }
    }
    // Return cursor item to inventory
    if (inv.cursorItem && inv.cursorItem.id !== BLOCK.AIR) {
      const overflow = inv.addItem(inv.cursorItem.id, inv.cursorItem.count);
      inv.cursorItem = null;
    }
  }

  _returnCraftingItems() {
    const inv = this.inventory;
    for (let i = 0; i < 4; i++) {
      if (inv.craftingGrid[i].id !== BLOCK.AIR) {
        const overflow = inv.addItem(inv.craftingGrid[i].id, inv.craftingGrid[i].count);
        if (overflow > 0) {
          // Drop on ground — for now just lose it
        }
        inv.craftingGrid[i] = { id: BLOCK.AIR, count: 0 };
      }
    }
  }

  // ============ Game state messages ============

  showMessage(text, duration = 2000) {
    let msgEl = document.getElementById('game-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'game-message';
      document.body.appendChild(msgEl);
    }
    msgEl.textContent = text;
    msgEl.style.opacity = '1';
    clearTimeout(msgEl._timeout);
    msgEl._timeout = setTimeout(() => {
      msgEl.style.opacity = '0';
    }, duration);
  }

  // Show/hide the click-to-start blocker
  hideBlocker() {
    this.blocker.style.display = 'none';
  }

  showBlocker() {
    this.blocker.style.display = 'flex';
  }
}

export default UIManager;
