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

// ============ Initialize Systems ============

initWorld(Math.floor(Math.random() * 100000));

// Add test cube to verify rendering works
const testGeo = new THREE.BoxGeometry(2, 2, 2);
const testMat = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.5 });
const testCube = new THREE.Mesh(testGeo, testMat);
testCube.position.set(5, 70, 5);
testCube.name = 'test-cube';
scene.add(testCube);

// Add a grid of colored cubes for visual debug
for (let i = 0; i < 5; i++) {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const m = new THREE.MeshStandardMaterial({ color: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff][i], roughness: 0.5 });
  const cube = new THREE.Mesh(g, m);
  cube.position.set(3 + i * 2, 70, 3);
  scene.add(cube);
}
console.log('[init] Test cubes added — you should see 6 colored cubes near spawn');

const inventory = new Inventory();
const player = new Player(camera, chunkManager);
const interaction = new InteractionManager(player, chunkManager, inventory);

// Sky
const skyManager = new SkyManager(scene);

// Audio (initialize on first user interaction)
document.addEventListener('click', () => audio.init(), { once: true });

// UI
const uiManager = new UIManager(player, inventory, interaction);

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
const MAX_MESH_PER_FRAME = 4;

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
  }

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
