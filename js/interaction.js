// ============================================================
// Block interaction — breaking, placing, highlighting
// ============================================================

import * as THREE from 'three';
import { BLOCK, BLOCK_PROPS, BLOCK_DROPS, REACH_DISTANCE, PLANT_BLOCKS } from './constants.js';
import input from './input.js';

class InteractionManager {
  constructor(player, chunkManager, inventory) {
    this.player = player;
    this.chunkManager = chunkManager;
    this.inventory = inventory;

    // Highlight cube
    this.highlightGeo = new THREE.BoxGeometry(1.005, 1.005, 1.005);
    this.highlightEdges = new THREE.EdgesGeometry(this.highlightGeo);
    this.highlightLine = new THREE.LineSegments(
      this.highlightEdges,
      new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 })
    );
    this.highlightLine.visible = false;
    this.highlightTarget = null;

    // Breaking state
    this.isBreaking = false;
    this.breakProgress = 0;
    this.breakTarget = null;
    this.breakTime = 0;

    // Right-click cooldown (prevent rapid place)
    this.placeCooldown = 0;
  }

  getHighlightLine() {
    return this.highlightLine;
  }

  update(deltaTime) {
    // Update place cooldown
    if (this.placeCooldown > 0) this.placeCooldown -= deltaTime;

    // Raycast to find target block
    const hit = this.player.getLookAtBlock(REACH_DISTANCE);

    // Update highlight
    if (hit) {
      this.highlightLine.position.set(hit.position.x + 0.5, hit.position.y + 0.5, hit.position.z + 0.5);
      this.highlightLine.visible = true;

      // Show block name
      const nameEl = document.getElementById('block-name');
      if (nameEl) {
        const props = BLOCK_PROPS[hit.blockId];
        const blockName = props ? (props.name || 'Unknown') : 'Unknown';
        // Use BLOCK_NAMES imported
        nameEl.textContent = hit.blockId >= 0 ? Object.keys(BLOCK).find(k => BLOCK[k] === hit.blockId) || 'Block' : 'Block';
        nameEl.style.display = 'block';
      }
    } else {
      this.highlightLine.visible = false;
      const nameEl = document.getElementById('block-name');
      if (nameEl) nameEl.style.display = 'none';
    }

    // Handle breaking (left click hold)
    if (input.isMouseDown(0) && hit && !input.isKeyDown('KeyE')) {
      if (!this.isBreaking || this.breakTarget === null ||
          this.breakTarget.position.x !== hit.position.x ||
          this.breakTarget.position.y !== hit.position.y ||
          this.breakTarget.position.z !== hit.position.z) {
        // Start breaking new block
        this.isBreaking = true;
        this.breakTarget = hit;
        this.breakProgress = 0;
        const props = BLOCK_PROPS[hit.blockId];
        // Break time based on hardness (seconds)
        this.breakTime = props ? props.hardness * 1.5 : 1.5;
      }

      // Progress breaking
      this.breakProgress += deltaTime / this.breakTime;

      // Update UI progress bar
      const progressEl = document.getElementById('breaking-progress');
      const fillEl = document.getElementById('breaking-fill');
      if (progressEl && fillEl) {
        progressEl.style.display = 'block';
        fillEl.style.width = `${Math.min(100, this.breakProgress * 100)}%`;
      }

      // Complete break
      if (this.breakProgress >= 1.0) {
        this._breakBlock(hit);
        this.isBreaking = false;
        this.breakProgress = 0;
        this.breakTarget = null;
        const progressEl = document.getElementById('breaking-progress');
        if (progressEl) progressEl.style.display = 'none';
      }
    } else {
      // Cancel breaking
      if (this.isBreaking) {
        this.isBreaking = false;
        this.breakProgress = 0;
        this.breakTarget = null;
        const progressEl = document.getElementById('breaking-progress');
        if (progressEl) progressEl.style.display = 'none';
      }
    }

    // Handle placing (right click)
    if (input.isMousePressed(2) && hit && this.placeCooldown <= 0) {
      this._placeBlock(hit);
      this.placeCooldown = 0.15;
    }
  }

  _breakBlock(hit) {
    const { position, blockId } = hit;
    const wx = position.x;
    const wy = position.y;
    const wz = position.z;

    // Don't break bedrock in survival
    if (blockId === BLOCK.BEDROCK) return;

    // Set to air
    this.chunkManager.setBlock(wx, wy, wz, BLOCK.AIR);

    // Get drop
    const dropId = BLOCK_DROPS[blockId] || blockId;
    if (dropId !== BLOCK.AIR) {
      this.inventory.addItem(dropId, 1);
    }

    // Trigger re-mesh of affected chunks
    this._remeshAffectedChunks(wx, wz);
  }

  _placeBlock(hit) {
    const { position, normal } = hit;

    // Calculate place position (adjacent to hit face)
    const px = position.x + normal.x;
    const py = position.y + normal.y;
    const pz = position.z + normal.z;

    // Don't place inside player
    const playerPos = this.player.position;
    const pw = this.player.width / 2;
    const ph = this.player.height;
    if (px + 0.5 > playerPos.x - pw && px + 0.5 < playerPos.x + pw &&
        py + 0.5 > playerPos.y && py + 0.5 < playerPos.y + ph &&
        pz + 0.5 > playerPos.z - pw && pz + 0.5 < playerPos.z + pw) {
      return;
    }

    // Don't place above world height
    if (py >= 255) return;

    // Get held item
    const heldItem = this.inventory.getSelectedItem();
    if (!heldItem || heldItem.count <= 0) return;

    const blockId = heldItem.id;

    // Only place blocks (not items)
    if (PLANT_BLOCKS.has(blockId) || BLOCK_PROPS[blockId]) {
      this.chunkManager.setBlock(px, py, pz, blockId);
      this.inventory.removeItem(this.player.selectedSlot, 1);
      this._remeshAffectedChunks(px, pz);
    }
  }

  _remeshAffectedChunks(wx, wz) {
    // The setBlock method in chunkManager already marks chunks dirty
    // Remeshing happens in the main loop
  }
}

export default InteractionManager;
