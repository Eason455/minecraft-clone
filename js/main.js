// ============================================================
// Main entry point — game initialization and loop
// ============================================================

import * as THREE from 'three';
import { BLOCK, BLOCK_PROPS, CHUNK_SIZE, RENDER_DISTANCE, WORLD_HEIGHT } from './constants.js';
import { buildTextureAtlas, getAtlasCanvas, getTextureCanvas } from './textures.js';
import { initWorld } from './world.js';
import { buildChunkMesh, setTextureAtlas } from './mesher.js';
import chunkManager from './chunks.js';
import Player from './player.js';
import input from './input.js';
import InteractionManager from './interaction.js';
import Inventory from './inventory.js';
import UIManager from './ui.js';
import SkyManager from './sky.js';
import audio from './audio.js';

// ============ Three.js Setup ============

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.insertBefore(renderer.domElement, document.body.firstChild);
renderer.domElement.id = 'game-canvas';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 80, 0);

// ============ Texture Atlas ============

console.log('Building texture atlas...');
const atlasCanvas = buildTextureAtlas();
const texture = new THREE.CanvasTexture(atlasCanvas);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;
texture.needsUpdate = true;
setTextureAtlas(texture);

// Bridge: expose getTextureUV for mesher.js (avoids circular import)
import { getTextureUV } from './textures.js';
window.__getTextureUV = getTextureUV;
console.log('[init] Texture atlas ready:', atlasCanvas.width, 'x', atlasCanvas.height);

// ============ Particle System ============

const particles = [];
const particleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
function spawnBlockParticles(wx, wy, wz, blockId) {
  const colorMap = { [BLOCK.GRASS]: 0x7c9c4c, [BLOCK.DIRT]: 0x8b6914, [BLOCK.STONE]: 0x7f7f7f,
    [BLOCK.SAND]: 0xdbd08e, [BLOCK.COBBLESTONE]: 0x6b6b6b, [BLOCK.WOOD_PLANKS]: 0xb8945c };
  const color = new THREE.Color(colorMap[blockId] || 0x808080);
  for (let i = 0; i < 6; i++) {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const p = new THREE.Mesh(particleGeo, mat);
    p.position.set(wx + 0.3 + Math.random() * 0.4, wy + 0.3 + Math.random() * 0.4, wz + 0.3 + Math.random() * 0.4);
    p.userData = { vx: (Math.random() - 0.5) * 3, vy: Math.random() * 4 + 2, vz: (Math.random() - 0.5) * 3, life: 0.5 + Math.random() * 0.5 };
    scene.add(p); particles.push(p);
  }
}
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.userData.life -= dt;
    if (p.userData.life <= 0) { scene.remove(p); p.material.dispose(); particles.splice(i, 1); continue; }
    p.userData.vy -= 9.8 * dt;
    p.position.x += p.userData.vx * dt; p.position.y += p.userData.vy * dt; p.position.z += p.userData.vz * dt;
    p.material.opacity = p.userData.life;
  }
}

// ============ Cloud System ============
const clouds = [];
function createClouds() {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, roughness: 1 });
  for (let i = 0; i < 30; i++) {
    const geo = new THREE.BoxGeometry(4 + Math.random() * 12, 0.5, 2 + Math.random() * 6);
    const c = new THREE.Mesh(geo, mat); c.position.set((Math.random() - 0.5) * 200, 100 + Math.random() * 30, (Math.random() - 0.5) * 200);
    c.userData = { speed: 1 + Math.random() * 3 }; scene.add(c); clouds.push(c);
  }
}
function updateClouds(dt) {
  for (const c of clouds) { c.position.x += c.userData.speed * dt; if (c.position.x > 150) c.position.x = -150; }
}

// ============ Torch Lights ============
const torchLights = [];
function updateTorchLights(px, py, pz) {
  for (const tl of torchLights) scene.remove(tl);
  torchLights.length = 0;
  let count = 0;
  for (let dx = -14; dx <= 14 && count < 6; dx++)
    for (let dy = -6; dy <= 6 && count < 6; dy++)
      for (let dz = -14; dz <= 14 && count < 6; dz++)
        if (chunkManager.getBlock(Math.floor(px) + dx, Math.floor(py) + dy, Math.floor(pz) + dz) === BLOCK.TORCH) {
          const l = new THREE.PointLight(0xffaa33, 1.8, 9); l.position.set(Math.floor(px) + dx + 0.5, Math.floor(py) + dy + 0.5, Math.floor(pz) + dz + 0.5);
          scene.add(l); torchLights.push(l); count++;
        }
}

// ============ Creative Mode ============
let isCreative = false;
window._isCreative = false;
function toggleCreative() {
  isCreative = !isCreative;
  window._isCreative = isCreative;
  player.isCreative = isCreative;
  uiManager.showMessage(isCreative ? '[OK] Creative Mode — Fly: Space/Shift, Infinite blocks' : '[OK] Survival Mode');
}

// ============ Initialize Systems ============

initWorld(Math.floor(Math.random() * 100000));
createClouds();

const inventory = new Inventory();
const player = new Player(camera, chunkManager);
const interaction = new InteractionManager(player, chunkManager, inventory);

// Sky
const skyManager = new SkyManager(scene);

// Audio (initialize on first user interaction)
document.addEventListener('click', () => audio.init(), { once: true });

// UI
const uiManager = new UIManager(player, inventory, interaction);

// Wire crafting table and furnace
interaction._onOpenTable = () => { uiManager.openCraftingTable(); };
interaction._onMessage = (msg) => { uiManager.showMessage(msg); };

// Add highlight line to scene
scene.add(interaction.getHighlightLine());

// ============ Pointer Lock & Game State ============

let gameRunning = false;
const blocker = document.getElementById('blocker');

function lockPointer() {
  // Try locking on document.body first (most compatible), then canvas
  const el = document.body;
  try {
    el.requestPointerLock();
    console.log('[input] Pointer lock requested');
  } catch (err) {
    console.warn('[input] Pointer lock failed:', err);
  }
}

blocker.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!gameRunning) {
    lockPointer();
    audio.init();
  }
});

// Also allow clicking the canvas directly to re-lock
renderer.domElement.addEventListener('click', () => {
  if (!gameRunning && blocker.style.display === 'none') {
    lockPointer();
  }
});

// Debug: log all pointer lock changes
document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement;
  console.log('[input] pointerlockchange — locked to:', locked ? locked.tagName : 'none');
  if (locked) {
    gameRunning = true;
    blocker.style.display = 'none';
    console.log('[OK] Game running, pointer locked');
  } else {
    gameRunning = false;
    if (!uiManager.inventory.isOpen) {
      blocker.style.display = 'flex';
    }
    console.log('[!] Game paused, pointer unlocked');
  }
});

// ============ Event Handlers ============

// Toggle inventory
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && !e.repeat) {
    if (uiManager.inventory.isOpen) {
      uiManager.hideInventory();
      if (gameRunning) {
        input.requestPointerLock(renderer.domElement);
      }
    } else {
      uiManager.showInventory();
      input.exitPointerLock();
    }
  }
});

// Pause menu (Escape)
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && !uiManager.inventory.isOpen) {
    gameRunning = false;
    input.exitPointerLock();
    blocker.style.display = 'flex';
  }
});

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ Spawn Player ============

player.findSpawnPosition();
camera.position.copy(player.position);
camera.position.y += player.eyeHeight;

// Pre-generate initial chunks around spawn
console.log('Pre-generating spawn area...');
const spawnCX = Math.floor(player.position.x / CHUNK_SIZE);
const spawnCZ = Math.floor(player.position.z / CHUNK_SIZE);
const INITIAL_RADIUS = 3;
for (let dx = -INITIAL_RADIUS; dx <= INITIAL_RADIUS; dx++) {
  for (let dz = -INITIAL_RADIUS; dz <= INITIAL_RADIUS; dz++) {
    chunkManager.generateChunk(spawnCX + dx, spawnCZ + dz);
  }
}
// Mesh initial chunks immediately
for (const [key, chunk] of chunkManager.chunks) {
  if (chunk.generated && !chunk.meshed) {
    chunkManager.pendingMesh.add(key);
  }
}
console.log(`Pre-generated ${chunkManager.chunks.size} spawn chunks`);

// ============ Game Loop ============

let lastTime = performance.now();
let footstepTimer = 0;
let hungerTimer = 0;
const MAX_MESH_PER_FRAME = 4;

// Falling blocks system
const fallingBlocks = [];

function spawnFallingBlock(wx, wy, wz, blockId) {
  // Check if already falling at this position
  for (const fb of fallingBlocks) {
    if (fb.wx === wx && fb.wz === wz && Math.abs(fb.y - wy) < 0.5) return;
  }
  fallingBlocks.push({
    wx, wy, wz, blockId,
    y: wy + 0.5,
    vy: 0,
    landed: false,
  });
  chunkManager.setBlock(wx, wy, wz, BLOCK.AIR);
}

function updateFallingBlocks(dt) {
  for (let i = fallingBlocks.length - 1; i >= 0; i--) {
    const fb = fallingBlocks[i];
    if (fb.landed) {
      // Place the block at the landed position
      const ly = Math.floor(fb.y);
      if (chunkManager.isChunkLoaded(fb.wx, fb.wz)) {
        chunkManager.setBlock(fb.wx, ly, fb.wz, fb.blockId);
      }
      fallingBlocks.splice(i, 1);
      continue;
    }
    fb.vy -= GRAVITY * dt;
    fb.y += fb.vy * dt;
    const targetY = Math.floor(fb.y);
    const blockBelow = chunkManager.getBlock(fb.wx, targetY - 1, fb.wz);
    if (blockBelow !== null && blockBelow !== BLOCK.AIR && blockBelow !== BLOCK.WATER) {
      fb.y = targetY;
      fb.landed = true;
      fb.vy = 0;
    }
    if (fb.y < -10) { fallingBlocks.splice(i, 1); }
  }
}

// Check for unsupported blocks (sand, gravel) after block changes
function checkFallingAround(wx, wy, wz) {
  const neighbors = [[1,0],[0,1],[-1,0],[0,-1]];
  for (const [dx, dz] of neighbors) {
    for (let dy = 0; dy < 3; dy++) {
      const nx = wx + dx, ny = wy + dy, nz = wz + dz;
      const block = chunkManager.getBlock(nx, ny, nz);
      if (block === BLOCK.SAND || block === BLOCK.GRAVEL) {
        const below = chunkManager.getBlock(nx, ny - 1, nz);
        if (below === BLOCK.AIR || below === BLOCK.WATER) {
          spawnFallingBlock(nx, ny, nz, block);
        }
      }
    }
  }
}

function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);

  let deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Clamp delta time
  if (deltaTime > 0.2) deltaTime = 0.2;
  if (deltaTime <= 0) deltaTime = 0.016;

  // === STEP 1: Update chunk loading BEFORE player moves ===
  // This ensures the player's current position has loaded chunks for collision
  chunkManager.update(player.position.x, player.position.z);

  // Generate pending chunks
  let generated = 0;
  const pendingGen = Array.from(chunkManager.pendingGenerate);
  for (const key of pendingGen) {
    if (generated >= 5) break;
    const [cx, cz] = key.split(',').map(Number);
    if (!chunkManager.hasChunk(cx, cz) || !chunkManager.getChunk(cx, cz).generated) {
      chunkManager.generateChunk(cx, cz);
      generated++;
    }
  }

  // Build meshes (spread across frames)
  const pending = chunkManager.getPendingMesh();
  let meshed = 0;
  for (const { cx, cz, key } of pending) {
    if (meshed >= MAX_MESH_PER_FRAME) break;
    const chunk = chunkManager.getChunk(cx, cz);
    if (!chunk || !chunk.data) continue;

    // Remove old mesh
    if (chunk.mesh) {
      scene.remove(chunk.mesh);
      chunk.mesh.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (child.material.map) child.material.map = window._textureAtlas;
          child.material.dispose();
        }
      });
      chunk.mesh = null;
    }

    // Build neighbor map for face culling at chunk boundaries
    const neighborChunks = new Map();
    for (const [nkey, nchunk] of chunkManager.chunks) {
      if (nchunk.generated) neighborChunks.set(nkey, nchunk);
    }

    // Build new mesh
    const mesh = buildChunkMesh(chunk, neighborChunks);
    if (mesh) {
      scene.add(mesh);
      chunk.mesh = mesh;
      chunkManager.pendingMesh.delete(key);
      meshed++;
    }
  }

  // === STEP 2: Update player AFTER chunks are loaded ===
  if (gameRunning) {
    player.update(deltaTime);

    // Hunger system: decrease hunger over time
    hungerTimer += deltaTime;
    if (hungerTimer > 30) { // every 30 seconds
      hungerTimer = 0;
      if (player.hunger > 0) player.hunger--;
      // Damage from starvation
      if (player.hunger <= 0 && player.health > 1) {
        player.health -= 1;
        audio.playHurt();
      }
      // Heal with full hunger
      if (player.hunger >= 18 && player.health < 20) {
        player.health = Math.min(20, player.health + 0.5);
      }
    }
  }

  // Update falling blocks
  updateFallingBlocks(deltaTime);

  // Debug: one-time camera and scene verification on first real frame
  if (!window._debugDone && gameRunning) {
    window._debugDone = true;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    console.log(`[camera] pos=(${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}) dir=(${dir.x.toFixed(3)},${dir.y.toFixed(3)},${dir.z.toFixed(3)})`);
    console.log(`[scene] children=${scene.children.length} chunks=${chunkManager.chunks.size} pendingGen=${chunkManager.pendingGenerate.size} pendingMesh=${chunkManager.pendingMesh.size}`);
    // Check if test cube is visible
    const testObj = scene.getObjectByName('test-cube');
    console.log(`[scene] test-cube found=${!!testObj} pos=${testObj ? testObj.position.toArray().join(',') : 'N/A'}`);
  }

  // Debug: scene stats every 120 frames (~2 sec)
  if (Math.floor(timestamp / 2000) !== Math.floor((timestamp - deltaTime * 1000) / 2000)) {
    const dir = new THREE.Vector3(); camera.getWorldDirection(dir);
    let chunkCount = chunkManager.chunks.size;
    let meshedCount = 0;
    for (const [k, c] of chunkManager.chunks) { if (c.mesh) meshedCount++; }
    console.log(`[debug] FPS≈${(1/deltaTime).toFixed(0)} yaw=${player.yaw.toFixed(2)} camDir=(${dir.x.toFixed(2)},${dir.y.toFixed(2)},${dir.z.toFixed(2)}) chunks=${chunkCount}/${meshedCount} pending=${chunkManager.pendingMesh.size}`);
    // Verify collision
    const bx = Math.floor(player.position.x);
    const bz = Math.floor(player.position.z);
    const blockBelow = chunkManager.getBlock(bx, Math.floor(player.position.y - 0.1), bz);
    const chunkLoaded = chunkManager.isChunkLoaded(bx, bz);
    console.log(`[debug] standingOn=${blockBelow} chunkLoaded=${chunkLoaded} onGround=${player.onGround} pos=(${player.position.x.toFixed(1)},${player.position.y.toFixed(1)},${player.position.z.toFixed(1)})`);
  }

  // Creative mode toggle (G key)
  if (input.isKeyPressed('KeyG')) {
    toggleCreative();
  }

  // Update interaction (block highlight, breaking, placing)
  if (gameRunning && !uiManager.inventory.isOpen) {
    interaction.update(deltaTime);

    // Footstep sounds
    if (player.onGround && (Math.abs(player.velocity.x) > 0.1 || Math.abs(player.velocity.z) > 0.1)) {
      footstepTimer -= deltaTime;
      if (footstepTimer <= 0) {
        footstepTimer = 0.4;
        const bx = Math.floor(player.position.x);
        const by = Math.floor(player.position.y - 0.1);
        const bz = Math.floor(player.position.z);
        const block = chunkManager.getBlock(bx, by, bz);
        // Map block to sound type — skip if chunk not loaded
        if (block !== null && block !== BLOCK.AIR) {
          let blockType = 'dirt';
          if (block === BLOCK.STONE || block === BLOCK.COBBLESTONE) blockType = 'stone';
          else if (block === BLOCK.GRASS) blockType = 'grass';
          else if (block === BLOCK.SAND || block === BLOCK.GRAVEL) blockType = 'sand';
          else if (block === BLOCK.WOOD_PLANKS) blockType = 'planks';
          else if (block === BLOCK.SNOW) blockType = 'snow';
          audio.playFootstep(blockType);
        }
      }
    }
  }

  // Update sky (day/night cycle)
  skyManager.update(deltaTime);

  // Update particles, clouds, torch lights
  updateParticles(deltaTime);
  updateClouds(deltaTime);
  if (Math.floor(timestamp / 500) !== Math.floor((timestamp - deltaTime * 1000) / 500)) {
    updateTorchLights(player.position.x, player.position.y, player.position.z);
  }

  // Update HUD
  uiManager.updateHUD();

  // Update player selected slot
  inventory.setSelectedSlot(player.selectedSlot);

  // Health management
  if (player.health <= 0) {
    // Respawn
    player.health = 20;
    player.hunger = 20;
    player.findSpawnPosition();
    uiManager.showMessage('[!] You died! Respawning...', 2000);
  }

  // Render
  renderer.render(scene, camera);

  // Clear per-frame input state
  input.endFrame();
}

// Start the game loop
console.log('Starting Minecraft clone...');
requestAnimationFrame(gameLoop);

// Export for debugging
window._game = {
  player,
  chunkManager,
  inventory,
  scene,
  camera,
};
