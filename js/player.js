// ============================================================
// First-person player controller with physics and collision
// ============================================================

import * as THREE from 'three';
import {
  BLOCK, BLOCK_PROPS, GRAVITY, JUMP_VELOCITY,
  PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_EYE_HEIGHT,
  PLAYER_SPEED, PLAYER_SPRINT_SPEED, WORLD_HEIGHT,
} from './constants.js';
import input from './input.js';

class Player {
  constructor(camera, chunkManager) {
    this.camera = camera;
    this.chunkManager = chunkManager;

    // Position (feet position)
    this.position = new THREE.Vector3(0, 70, 0);

    // Velocity
    this.velocity = new THREE.Vector3(0, 0, 0);

    // Rotation (euler angles in radians)
    this.yaw = -0.5; // start facing slightly right so we can see terrain
    this.pitch = -0.3; // look slightly down to see ground

    // State
    this.onGround = false;
    this.isSprinting = false;
    this.isSneaking = false;
    this.isInWater = false;
    this.health = 20;
    this.hunger = 20;
    this.fallDistance = 0;
    this.selectedSlot = 0;

    // Mouse sensitivity
    this.mouseSensitivity = 0.002;

    // Collision box: width x height x depth
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.eyeHeight = PLAYER_EYE_HEIGHT;
  }

  update(deltaTime) {
    // Clamp delta to avoid physics explosions
    const dt = Math.min(deltaTime, 0.1);

    // Handle mouse look
    this._updateLook();

    // Handle hotbar selection
    this._updateHotbarSelection();

    // Handle movement
    this._updateMovement(dt);

    // Apply physics
    this._updatePhysics(dt);

    // Update camera position
    this._updateCamera();
  }

  _updateLook() {
    const mouseDelta = input.getMouseDelta();
    this.yaw -= mouseDelta.x * this.mouseSensitivity;
    this.pitch -= mouseDelta.y * this.mouseSensitivity;
    this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
  }

  _updateHotbarSelection() {
    // Scroll wheel
    const scroll = input.getScroll();
    if (scroll !== 0) {
      this.selectedSlot = ((this.selectedSlot - scroll) % 9 + 9) % 9;
    }
    // Number keys 1-9
    for (let i = 0; i < 9; i++) {
      if (input.isKeyPressed(`Digit${i + 1}`)) {
        this.selectedSlot = i;
      }
    }
  }

  _updateMovement(dt) {
    // Compute forward direction from yaw (bypass camera quaternion for frame-perfect input)
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();

    let moveX = 0;
    let moveZ = 0;

    if (input.isKeyDown('KeyW')) { moveX += forward.x; moveZ += forward.z; }
    if (input.isKeyDown('KeyS')) { moveX -= forward.x; moveZ -= forward.z; }
    if (input.isKeyDown('KeyA')) { moveX -= right.x; moveZ -= right.z; }
    if (input.isKeyDown('KeyD')) { moveX += right.x; moveZ += right.z; }

    // Normalize horizontal movement
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
    }

    // Sprinting (Ctrl or double-tap W)
    this.isSprinting = input.isKeyDown('ControlLeft') || input.isKeyDown('ControlRight');

    // Sneaking (Shift)
    this.isSneaking = input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight');
    if (this.isSneaking) this.isSprinting = false;

    // Speed calculation
    let speed = PLAYER_SPEED;
    if (this.isSprinting) speed = PLAYER_SPRINT_SPEED;
    if (this.isSneaking) speed = PLAYER_SPEED * 0.4;
    if (this.isInWater) speed *= 0.5;
    if (!this.onGround) speed *= 0.7;

    // Apply horizontal movement
    const velX = moveX * speed;
    const velZ = moveZ * speed;

    this.velocity.x = velX;
    this.velocity.z = velZ;

    // Jumping
    if (input.isKeyPressed('Space') && this.onGround && !this.isSneaking) {
      this.velocity.y = JUMP_VELOCITY;
      this.onGround = false;
    }

    // In water, jump to swim up
    if (input.isKeyDown('Space') && this.isInWater) {
      this.velocity.y = Math.min(this.velocity.y + 0.5, 4);
    }
  }

  _updatePhysics(dt) {
    const prevY = this.position.y;

    // Apply gravity
    if (!this.onGround) {
      this.velocity.y -= GRAVITY * dt;
    }

    // Terminal velocity
    this.velocity.y = Math.max(-80, Math.min(80, this.velocity.y));

    // Check if in water
    this._checkWater();

    // Move with collision detection (separate axes for sliding)
    this._moveAxis('x', this.velocity.x * dt);
    this._moveAxis('z', this.velocity.z * dt);
    this._moveAxis('y', this.velocity.y * dt);

    // Check on ground
    this.onGround = this._checkCollision(
      this.position.x,
      this.position.y - 0.05,
      this.position.z
    );

    // Fall distance
    if (!this.onGround && this.velocity.y < 0) {
      this.fallDistance += prevY - this.position.y;
    } else if (this.onGround) {
      if (this.fallDistance > 3) {
        const damage = Math.floor(this.fallDistance - 3);
        this.health = Math.max(0, this.health - damage);
      }
      this.fallDistance = 0;
    }

    // Prevent falling through world
    if (this.position.y < -10) {
      this.position.set(0, 70, 0);
      this.velocity.set(0, 0, 0);
      this.health = this.health - 5;
    }

    // Health regen with full hunger
    if (this.hunger >= 18 && this.health < 20) {
      // Slow regen
    }
  }

  _checkWater() {
    const headY = this.position.y + this.eyeHeight;
    const blockAtHead = this.chunkManager.getBlock(
      Math.floor(this.position.x), Math.floor(headY), Math.floor(this.position.z)
    );
    const blockAtFeet = this.chunkManager.getBlock(
      Math.floor(this.position.x), Math.floor(this.position.y + 0.3), Math.floor(this.position.z)
    );
    this.isInWater = (blockAtHead === BLOCK.WATER) || (blockAtFeet === BLOCK.WATER);
  }

  _moveAxis(axis, distance) {
    if (Math.abs(distance) < 0.0001) return;

    const step = Math.sign(distance) * 0.05;
    const steps = Math.floor(Math.abs(distance) / 0.05);

    for (let i = 0; i < steps; i++) {
      const pos = this.position.clone();
      if (axis === 'x') pos.x += step;
      if (axis === 'y') pos.y += step;
      if (axis === 'z') pos.z += step;

      if (!this._checkCollision(pos.x, pos.y, pos.z)) {
        this.position.copy(pos);
      } else if (axis === 'y' && step > 0) {
        // Try to step up if moving forward
        this.velocity.y = 0;
      } else if (axis === 'y' && step < 0) {
        this.velocity.y = 0;
      }
    }
  }

  _checkCollision(px, py, pz) {
    const hw = this.width / 2;
    const hh = this.height;

    // Check all blocks the player bounding box overlaps
    const minX = Math.floor(px - hw);
    const maxX = Math.floor(px + hw - 0.001);
    const minY = Math.floor(py);
    const maxY = Math.floor(py + hh - 0.001);
    const minZ = Math.floor(pz - hw);
    const maxZ = Math.floor(pz + hw - 0.001);

    for (let bx = minX; bx <= maxX; bx++) {
      for (let by = minY; by <= maxY; by++) {
        for (let bz = minZ; bz <= maxZ; bz++) {
          // Check if chunk is loaded first
          if (!this.chunkManager.isChunkLoaded(bx, bz)) {
            // Unloaded chunk — treat as solid barrier to prevent falling through
            return true;
          }
          const block = this.chunkManager.getBlock(bx, by, bz);
          // null = unknown (already checked above via isChunkLoaded)
          if (block === null) return true;
          if (block === BLOCK.AIR || block === BLOCK.WATER) continue;
          const props = BLOCK_PROPS[block];
          if (props && !props.collidable) continue;

          // Block AABB vs player AABB overlap check
          if (px + hw > bx && px - hw < bx + 1 &&
              py + hh > by && py < by + 1 &&
              pz + hw > bz && pz - hw < bz + 1) {
            return true;
          }
        }
      }
    }
    return false;
  }

  _updateCamera() {
    // Position
    const eyeY = this.position.y + (this.isSneaking ? this.eyeHeight - 0.3 : this.eyeHeight);
    this.camera.position.set(this.position.x, eyeY, this.position.z);

    // Rotation: compute forward from yaw/pitch, use lookAt
    const cp = Math.cos(this.pitch);
    const fx = -Math.sin(this.yaw) * cp;
    const fy = Math.sin(this.pitch);
    const fz = -Math.cos(this.yaw) * cp;
    const target = new THREE.Vector3(
      this.camera.position.x + fx,
      this.camera.position.y + fy,
      this.camera.position.z + fz
    );
    this.camera.lookAt(target);
  }

  // Get the block the player is looking at (via raycasting)
  getLookAtBlock(maxDistance = 5) {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);

    const origin = this.camera.position.clone();
    const step = 0.05;
    let distance = 0;

    let lastBlockX = -1, lastBlockY = -1, lastBlockZ = -1;

    while (distance < maxDistance) {
      origin.addScaledVector(direction, step);
      distance += step;

      const bx = Math.floor(origin.x);
      const by = Math.floor(origin.y);
      const bz = Math.floor(origin.z);

      if (bx !== lastBlockX || by !== lastBlockY || bz !== lastBlockZ) {
        lastBlockX = bx;
        lastBlockY = by;
        lastBlockZ = bz;

        const block = this.chunkManager.getBlock(bx, by, bz);
        if (block !== null && block !== BLOCK.AIR && block !== BLOCK.WATER) {
          return {
            position: new THREE.Vector3(bx, by, bz),
            normal: this._getBlockNormal(origin, direction, bx, by, bz),
            blockId: block,
          };
        }
      }
    }

    return null;
  }

  _getBlockNormal(hitPoint, direction, bx, by, bz) {
    const center = new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5);
    const diff = hitPoint.clone().sub(center);

    // Determine which face was hit based on which component is closest to ±0.5
    const absX = Math.abs(diff.x) - 0.5;
    const absY = Math.abs(diff.y) - 0.5;
    const absZ = Math.abs(diff.z) - 0.5;

    const maxComp = Math.max(absX, absY, absZ);
    if (maxComp === absX) return new THREE.Vector3(Math.sign(diff.x), 0, 0);
    if (maxComp === absY) return new THREE.Vector3(0, Math.sign(diff.y), 0);
    return new THREE.Vector3(0, 0, Math.sign(diff.z));
  }

  // Get spawn position (top of terrain at 0,0)
  findSpawnPosition() {
    const wx = 0, wz = 0;
    const cm = this.chunkManager;

    // Generate the spawn chunk
    cm.generateChunk(0, 0);

    // Find the highest non-air block
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      const block = cm.getBlock(wx, y, wz);
      if (block !== BLOCK.AIR) {
        this.position.set(wx + 0.5, y + 1, wz + 0.5);
        return;
      }
    }
    this.position.set(0, 70, 0);
  }
}

export default Player;
