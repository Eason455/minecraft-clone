// ============================================================
// Chunk management system
// ============================================================

import { CHUNK_SIZE, WORLD_HEIGHT, RENDER_DISTANCE, BLOCK, BLOCK_PROPS } from './constants.js';
import { generateChunkData, getBlockInChunk } from './world.js';

class ChunkManager {
  constructor() {
    // Map of "cx,cz" -> Chunk object
    this.chunks = new Map();
    this.pendingGenerate = new Set();
    this.pendingMesh = new Set();
    this.onChunkMeshReady = null; // callback
  }

  // Chunk object structure:
  // { cx, cz, data: Uint8Array, mesh: THREE.Group|null, generated: bool, meshed: bool }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  getChunk(cx, cz) {
    return this.chunks.get(this.key(cx, cz));
  }

  hasChunk(cx, cz) {
    return this.chunks.has(this.key(cx, cz));
  }

  // Check if a chunk is loaded at the given world coordinates
  isChunkLoaded(wx, wz) {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const chunk = this.getChunk(cx, cz);
    return chunk && chunk.generated && chunk.data;
  }

  // Get block at world coordinate (checks loaded chunks)
  getBlock(wx, wy, wz) {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const chunk = this.getChunk(cx, cz);
    if (!chunk || !chunk.data) return null; // null = unloaded
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    return getBlockInChunk(chunk.data, lx, wy, lz);
  }

  // Set block at world coordinate
  setBlock(wx, wy, wz, blockId) {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const chunk = this.getChunk(cx, cz);
    if (!chunk || !chunk.data) return false;
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    if (lx < 0 || lx >= CHUNK_SIZE || wy < 0 || wy >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return false;
    chunk.data[(wy * CHUNK_SIZE + lz) * CHUNK_SIZE + lx] = blockId;
    chunk.meshed = false;
    this.pendingMesh.add(this.key(cx, cz));
    // Also re-mesh neighboring chunks if block is on edge
    if (lx === 0) this._markNeighborDirty(cx - 1, cz);
    if (lx === CHUNK_SIZE - 1) this._markNeighborDirty(cx + 1, cz);
    if (lz === 0) this._markNeighborDirty(cx, cz - 1);
    if (lz === CHUNK_SIZE - 1) this._markNeighborDirty(cx, cz + 1);
    return true;
  }

  _markNeighborDirty(cx, cz) {
    const chunk = this.getChunk(cx, cz);
    if (chunk && chunk.generated) {
      chunk.meshed = false;
      this.pendingMesh.add(this.key(cx, cz));
    }
  }

  // Generate chunk data
  generateChunk(cx, cz) {
    const key = this.key(cx, cz);
    if (this.chunks.has(key) && this.chunks.get(key).generated) return;
    this.pendingGenerate.delete(key);

    const { data, treePositions, heightMap } = generateChunkData(cx, cz);
    const chunk = {
      cx,
      cz,
      data,
      generated: true,
      meshed: false,
      mesh: null,
      treePositions,
      heightMap,
    };
    this.chunks.set(key, chunk);
    this.pendingMesh.add(key);
    return chunk;
  }

  // Update chunks around player position
  update(playerX, playerZ) {
    const pcx = Math.floor(playerX / CHUNK_SIZE);
    const pcz = Math.floor(playerZ / CHUNK_SIZE);

    // Determine which chunks should be loaded
    const needed = new Set();
    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const cx = pcx + dx;
        const cz = pcz + dz;
        needed.add(this.key(cx, cz));
        if (!this.hasChunk(cx, cz) || !this.getChunk(cx, cz).generated) {
          this.pendingGenerate.add(this.key(cx, cz));
        }
      }
    }

    // Unload far chunks
    for (const [key, chunk] of this.chunks) {
      if (!needed.has(key)) {
        if (chunk.mesh) {
          // Mesh cleanup handled by renderer
        }
        this.chunks.delete(key);
        this.pendingMesh.delete(key);
      }
    }
  }

  // Get all chunks that need meshing
  getPendingMesh() {
    return Array.from(this.pendingMesh).map(k => {
      const [cx, cz] = k.split(',').map(Number);
      return { cx, cz, key: k };
    });
  }

  // Get all currently loaded chunk coordinates
  getLoadedChunks() {
    const result = [];
    for (const [key, chunk] of this.chunks) {
      if (chunk.generated) {
        const [cx, cz] = key.split(',').map(Number);
        result.push({ cx, cz, chunk });
      }
    }
    return result;
  }
}

// Singleton
const chunkManager = new ChunkManager();
export default chunkManager;
