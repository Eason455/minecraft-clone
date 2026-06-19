// ============================================================
// World/terrain generation using Simplex-like noise
// ============================================================

import { BLOCK, BLOCK_PROPS, CHUNK_SIZE, WORLD_HEIGHT, SEA_LEVEL } from './constants.js';

// ============ 2D OpenSimplex-like Noise ============
// Using a permutation table approach based on Stefan Gustavson's implementation

const PERM = new Uint8Array(512);
const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

function initPerm(seed = 42) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle with seed
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) {
    PERM[i] = p[i & 255];
  }
}

function dot2(g, x, y) {
  return g[0] * x + g[1] * y;
}

function dot3(g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z;
}

// 2D Simplex noise
function noise2D(x, y) {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  let i1, j1;
  if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;
  const gi0 = PERM[ii + PERM[jj]] % 12;
  const gi1 = PERM[ii + i1 + PERM[jj + j1]] % 12;
  const gi2 = PERM[ii + 1 + PERM[jj + 1]] % 12;

  let n0, n1, n2;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) n0 = 0; else { t0 *= t0; n0 = t0 * t0 * dot2(GRAD3[gi0], x0, y0); }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) n1 = 0; else { t1 *= t1; n1 = t1 * t1 * dot2(GRAD3[gi1], x1, y1); }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) n2 = 0; else { t2 *= t2; n2 = t2 * t2 * dot2(GRAD3[gi2], x2, y2); }

  return 70 * (n0 + n1 + n2);
}

// 3D Simplex noise
function noise3D(x, y, z) {
  const F3 = 1 / 3;
  const G3 = 1 / 6;

  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;

  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3;
  const y2 = y0 - j2 + 2 * G3;
  const z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3;
  const y3 = y0 - 1 + 3 * G3;
  const z3 = z0 - 1 + 3 * G3;

  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;

  const gi0 = PERM[ii + PERM[jj + PERM[kk]]] % 12;
  const gi1 = PERM[ii + i1 + PERM[jj + j1 + PERM[kk + k1]]] % 12;
  const gi2 = PERM[ii + i2 + PERM[jj + j2 + PERM[kk + k2]]] % 12;
  const gi3 = PERM[ii + 1 + PERM[jj + 1 + PERM[kk + 1]]] % 12;

  let n0, n1, n2, n3;
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) n0 = 0; else { t0 *= t0; n0 = t0 * t0 * dot3(GRAD3[gi0], x0, y0, z0); }
  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) n1 = 0; else { t1 *= t1; n1 = t1 * t1 * dot3(GRAD3[gi1], x1, y1, z1); }
  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) n2 = 0; else { t2 *= t2; n2 = t2 * t2 * dot3(GRAD3[gi2], x2, y2, z2); }
  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) n3 = 0; else { t3 *= t3; n3 = t3 * t3 * dot3(GRAD3[gi3], x3, y3, z3); }

  return 32 * (n0 + n1 + n2 + n3);
}

// ============ Octave noise ============

function octave2D(x, y, octaves, persistence = 0.5, lacunarity = 2.0) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxValue;
}

function octave3D(x, y, z, octaves, persistence = 0.5, lacunarity = 2.0) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxValue;
}

// ============ World generation ============

// Initialize noise with world seed
export function initWorld(seed = Math.floor(Math.random() * 100000)) {
  initPerm(seed);
  console.log('World seed:', seed);
  return seed;
}

// Temperature/moisture for biome determination
function getTemperature(x, z) {
  return octave2D(x * 0.001, z * 0.001, 3, 0.5, 2.0) * 0.5 + 0.5;
}

function getMoisture(x, z) {
  return octave2D(x * 0.001 + 1000, z * 0.001 + 1000, 3, 0.5, 2.0) * 0.5 + 0.5;
}

// Determine biome at position
function getBiome(x, z, temp, moist) {
  if (temp === undefined) temp = getTemperature(x, z);
  if (moist === undefined) moist = getMoisture(x, z);
  if (temp > 0.6 && moist < 0.35) return 'desert';
  if (temp > 0.45 && moist > 0.5) return 'forest';
  if (temp < 0.25) return 'snowy';
  return 'plains';
}

// Get biome-dependent colors
function getBiomeColors(biome) {
  switch (biome) {
    case 'desert': return { grass: [180, 160, 80], leaves: [100, 120, 30], water: [50, 140, 200] };
    case 'forest': return { grass: [60, 130, 30], leaves: [30, 80, 15], water: [30, 80, 200] };
    case 'snowy': return { grass: [130, 150, 140], leaves: [80, 100, 80], water: [40, 100, 180] };
    default: return { grass: [90, 155, 45], leaves: [50, 100, 20], water: [30, 80, 220] };
  }
}

// Get terrain height at world coordinates
export function getTerrainHeight(wx, wz) {
  const continentalness = octave2D(wx * 0.003, wz * 0.003, 4, 0.5, 2.0); // Large features
  const erosion = octave2D(wx * 0.008, wz * 0.008, 3, 0.5, 2.0); // Medium features
  const peaks = Math.abs(octave2D(wx * 0.015, wz * 0.015, 3, 0.4, 2.0)); // Detail

  let height;
  if (continentalness < -0.1) {
    // Ocean
    height = SEA_LEVEL - 10 + continentalness * 30;
  } else if (continentalness > 0.5) {
    // Mountains
    height = SEA_LEVEL + (continentalness - 0.5) * 60 + peaks * 40;
  } else {
    // Plains/hills
    height = SEA_LEVEL + continentalness * 20 + erosion * 8 + peaks * 5;
  }

  return Math.floor(Math.max(0, Math.min(WORLD_HEIGHT - 1, height)));
}

// Check if position is a cave
function isCave(wx, wy, wz) {
  if (wy < 8) return false; // No caves near bedrock
  if (wy > 80) {
    // Fewer caves near surface
    const caveNoise = octave3D(wx * 0.05, wy * 0.05, wz * 0.05, 2, 0.5, 2.0);
    return caveNoise > 0.55;
  }
  const caveNoise1 = octave3D(wx * 0.06, wy * 0.06, wz * 0.06, 3, 0.5, 2.0);
  const caveNoise2 = octave3D(wx * 0.03 + 500, wy * 0.03, wz * 0.03 + 500, 2, 0.5, 2.0);
  return caveNoise1 > 0.3 && caveNoise2 > -0.1;
}

// Get block at world coordinate
export function getBlock(wx, wy, wz, chunkDataCache = null) {
  if (wy < 0) return BLOCK.BEDROCK;
  if (wy >= WORLD_HEIGHT) return BLOCK.AIR;

  const terrainHeight = getTerrainHeight(wx, wz);

  if (wy > terrainHeight) {
    if (wy <= SEA_LEVEL && terrainHeight < SEA_LEVEL - 2) {
      return BLOCK.WATER;
    }
    return BLOCK.AIR;
  }

  if (wy === 0) return BLOCK.BEDROCK;
  if (wy < 4) {
    // Deep bedrock layer
    return Math.random() < 0.6 ? BLOCK.BEDROCK : BLOCK.STONE;
  }

  // Cave check (skip for known surface blocks)
  if (wy < terrainHeight - 3 && isCave(wx, wy, wz)) {
    if (wy <= SEA_LEVEL && wy >= terrainHeight) return BLOCK.WATER;
    return BLOCK.AIR;
  }

  // Surface layers
  const biome = getBiome(wx, wz);

  if (wy === terrainHeight) {
    if (biome === 'desert') return BLOCK.SAND;
    if (biome === 'snowy') return BLOCK.SNOW;
    return BLOCK.GRASS;
  }
  if (wy >= terrainHeight - 3) {
    if (biome === 'desert') return BLOCK.SAND;
    return BLOCK.DIRT;
  }

  // Ores in stone layer
  if (wy < 50) {
    const oreChance = Math.random();
    const oreSeed = wx * 73856093 ^ wy * 19349663 ^ wz * 83492791;
    const oreRand = ((oreSeed * 16807 + 0) % 2147483647) / 2147483646;

    if (wy < 16 && oreRand < 0.01) return BLOCK.DIAMOND_ORE;
    if (wy < 32 && oreRand < 0.02) return BLOCK.GOLD_ORE;
    if (wy < 50 && oreRand < 0.04) return BLOCK.IRON_ORE;
    if (wy < 60 && oreRand < 0.06) return BLOCK.COAL_ORE;
  }

  // Stone below dirt
  return BLOCK.STONE;
}

// Generate a full chunk (16×WORLD_HEIGHT×16) of block data
export function generateChunkData(cx, cz) {
  const data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);
  const biomeMap = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE); // Store biome per column
  const treePositions = []; // { x, z, height, type }

  const worldX = cx * CHUNK_SIZE;
  const worldZ = cz * CHUNK_SIZE;

  // First pass: terrain height map + biomes
  const heightMap = new Int16Array(CHUNK_SIZE * CHUNK_SIZE);
  for (let lz = 0; lz < CHUNK_SIZE; lz++) {
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      const wx = worldX + lx;
      const wz = worldZ + lz;
      heightMap[lz * CHUNK_SIZE + lx] = getTerrainHeight(wx, wz);
      const temp = getTemperature(wx, wz);
      const moist = getMoisture(wx, wz);
      const biome = getBiome(wx, wz, temp, moist);
      biomeMap[lz * CHUNK_SIZE + lx] = ['plains', 'desert', 'forest', 'snowy'].indexOf(biome);

      // Tree placement
      if (biome === 'forest' && Math.random() < 0.08) {
        const h = heightMap[lz * CHUNK_SIZE + lx];
        if (h > SEA_LEVEL && h < WORLD_HEIGHT - 8) {
          const treeType = Math.random() < 0.7 ? 'oak' : 'birch';
          treePositions.push({ x: lx, z: lz, height: 4 + Math.floor(Math.random() * 3), type: treeType });
        }
      } else if (biome === 'plains' && Math.random() < 0.005) {
        const h = heightMap[lz * CHUNK_SIZE + lx];
        if (h > SEA_LEVEL && h < WORLD_HEIGHT - 8) {
          treePositions.push({ x: lx, z: lz, height: 4 + Math.floor(Math.random() * 2), type: 'oak' });
        }
      }
    }
  }

  // Second pass: fill blocks
  for (let lz = 0; lz < CHUNK_SIZE; lz++) {
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      const wx = worldX + lx;
      const wz = worldZ + lz;
      const th = heightMap[lz * CHUNK_SIZE + lx];
      const biome = ['plains', 'desert', 'forest', 'snowy'][biomeMap[lz * CHUNK_SIZE + lx]];

      for (let wy = 0; wy < WORLD_HEIGHT; wy++) {
        const idx = (wy * CHUNK_SIZE + lz) * CHUNK_SIZE + lx;
        const worldY = wy;

        if (wy > th) {
          // Above terrain
          if (wy <= SEA_LEVEL && th < SEA_LEVEL - 2) {
            data[idx] = BLOCK.WATER;
          } else {
            data[idx] = BLOCK.AIR;
          }
          continue;
        }

        if (wy === 0) { data[idx] = BLOCK.BEDROCK; continue; }
        if (wy < 4) { data[idx] = Math.random() < 0.6 ? BLOCK.BEDROCK : BLOCK.STONE; continue; }

        // Caves
        if (wy < th - 3 && isCave(wx, wy, wz)) {
          if (wy <= SEA_LEVEL && th < SEA_LEVEL - 2) {
            data[idx] = BLOCK.WATER;
          } else {
            data[idx] = BLOCK.AIR;
          }
          continue;
        }

        // Surface
        if (wy === th) {
          if (biome === 'desert') data[idx] = BLOCK.SAND;
          else if (biome === 'snowy') data[idx] = BLOCK.SNOW;
          else data[idx] = BLOCK.GRASS;
        } else if (wy >= th - 3) {
          if (biome === 'desert') data[idx] = BLOCK.SAND;
          else data[idx] = BLOCK.DIRT;
        } else {
          // Stone layer with ores
          const oreSeed = wx * 73856093 ^ wy * 19349663 ^ wz * 83492791;
          const oreRand = (((oreSeed * 16807 + 0) % 2147483647) + 2147483647) % 2147483647 / 2147483646;

          if (wy < 16 && oreRand < 0.008) data[idx] = BLOCK.DIAMOND_ORE;
          else if (wy < 32 && oreRand < 0.015) data[idx] = BLOCK.GOLD_ORE;
          else if (wy < 50 && oreRand < 0.03) data[idx] = BLOCK.IRON_ORE;
          else if (wy < 60 && oreRand < 0.05) data[idx] = BLOCK.COAL_ORE;
          else data[idx] = BLOCK.STONE;
        }
      }
    }
  }

  // Third pass: generate trees
  for (const tree of treePositions) {
    const { x: lx, z: lz, height: treeH, type } = tree;
    const baseY = heightMap[lz * CHUNK_SIZE + lx] + 1;
    const logBlock = type === 'oak' ? BLOCK.OAK_LOG : BLOCK.BIRCH_LOG;
    const leafBlock = type === 'oak' ? BLOCK.OAK_LEAVES : BLOCK.BIRCH_LEAVES;

    // Trunk
    for (let y = 0; y < treeH; y++) {
      const wy = baseY + y;
      if (wy < WORLD_HEIGHT) {
        const idx = (wy * CHUNK_SIZE + lz) * CHUNK_SIZE + lx;
        data[idx] = logBlock;
      }
    }
    // Leaves canopy
    const leafStart = baseY + treeH - 2;
    for (let dy = -1; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && Math.random() > 0.5) continue;
          if (Math.abs(dx) === 2 && dz === 0 && dy > 0 && Math.random() > 0.3) continue;
          if (Math.abs(dz) === 2 && dx === 0 && dy > 0 && Math.random() > 0.3) continue;
          const bx = lx + dx;
          const bz = lz + dz;
          const by = leafStart + dy;
          if (bx >= 0 && bx < CHUNK_SIZE && bz >= 0 && bz < CHUNK_SIZE && by >= 0 && by < WORLD_HEIGHT) {
            const idx = (by * CHUNK_SIZE + bz) * CHUNK_SIZE + bx;
            if (data[idx] === BLOCK.AIR) {
              data[idx] = leafBlock;
            }
          }
        }
      }
    }
    // Top leaves
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const bx = lx + dx;
        const bz = lz + dz;
        const by = baseY + treeH;
        if (bx >= 0 && bx < CHUNK_SIZE && bz >= 0 && bz < CHUNK_SIZE && by < WORLD_HEIGHT) {
          const idx = (by * CHUNK_SIZE + bz) * CHUNK_SIZE + bx;
          if (data[idx] === BLOCK.AIR && Math.random() < 0.6) {
            data[idx] = leafBlock;
          }
        }
      }
    }
  }

  // Fourth pass: grass and flowers on top
  for (let lz = 0; lz < CHUNK_SIZE; lz++) {
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      const th = heightMap[lz * CHUNK_SIZE + lx];
      const biome = ['plains', 'desert', 'forest', 'snowy'][biomeMap[lz * CHUNK_SIZE + lx]];

      if (biome === 'snowy' || biome === 'desert') continue;

      // Grass on top of grass blocks
      if (th >= SEA_LEVEL && th + 1 < WORLD_HEIGHT) {
        const idxAbove = ((th + 1) * CHUNK_SIZE + lz) * CHUNK_SIZE + lx;
        if (data[idxAbove] === BLOCK.AIR) {
          const rand = Math.random();
          if (rand < 0.12) {
            data[idxAbove] = BLOCK.GRASS_PLANT;
          } else if (rand < 0.14) {
            data[idxAbove] = Math.random() < 0.5 ? BLOCK.FLOWER_DANDELION : BLOCK.FLOWER_ROSE;
          }
        }
      }
    }
  }

  return { data, treePositions, heightMap };
}

// Get block from chunk data
export function getBlockInChunk(chunkData, lx, ly, lz) {
  if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) {
    return null; // Out of bounds
  }
  return chunkData[(ly * CHUNK_SIZE + lz) * CHUNK_SIZE + lx];
}

// Set block in chunk data
export function setBlockInChunk(chunkData, lx, ly, lz, blockId) {
  if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) {
    return false;
  }
  chunkData[(ly * CHUNK_SIZE + lz) * CHUNK_SIZE + lx] = blockId;
  return true;
}
