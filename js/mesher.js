// ============================================================
// Chunk mesh builder — converts block data to Three.js BufferGeometry
// Uses face culling (only render exposed faces) + greedy meshing
// ============================================================

import * as THREE from 'three';
import { BLOCK, BLOCK_PROPS, CHUNK_SIZE, WORLD_HEIGHT, PLANT_BLOCKS } from './constants.js';
// Face directions: right, left, top, bottom, front, back
// Face vertices in CCW winding order (Three.js FrontSide = CCW when viewed from face normal direction)
// Verified: cross product of triangle (v0,v1,v2) gives normal pointing toward viewer
const FACES = [
  { dir: [1, 0, 0], uv: [0, 0], verts: [[1,0,1],[1,0,0],[1,1,0],[1,1,1]], normal: [1,0,0] },  // right +x
  { dir: [-1, 0, 0], uv: [0, 0], verts: [[0,0,1],[0,1,1],[0,1,0],[0,0,0]], normal: [-1,0,0] }, // left -x
  { dir: [0, 1, 0], uv: [0, 0], verts: [[0,1,0],[0,1,1],[1,1,1],[1,1,0]], normal: [0,1,0] },  // top +y
  { dir: [0, -1, 0], uv: [0, 0], verts: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]], normal: [0,-1,0] }, // bottom -y
  { dir: [0, 0, 1], uv: [0, 0], verts: [[1,1,1],[0,1,1],[0,0,1],[1,0,1]], normal: [0,0,1] },  // front +z
  { dir: [0, 0, -1], uv: [0, 0], verts: [[0,1,0],[1,1,0],[1,0,0],[0,0,0]], normal: [0,0,-1] }, // back -z
];

// Face name for texture lookup
const FACE_NAMES = ['side', 'side', 'top', 'bottom', 'side', 'side'];

// Check if a face should be rendered
function shouldRenderFace(blockId, neighborId, faceIdx) {
  if (blockId === BLOCK.AIR) return false;
  if (neighborId === null || neighborId === undefined) return true; // chunk boundary, render

  const props = BLOCK_PROPS[blockId] || {};
  const neighborProps = BLOCK_PROPS[neighborId] || {};

  // Always render if neighbor is air
  if (neighborId === BLOCK.AIR) return true;

  // Both transparent — don't render if same block type
  if (props.transparent && neighborProps.transparent) {
    return blockId !== neighborId;
  }

  // If neighbor is transparent and this is not, render
  if (neighborProps.transparent) return true;

  // If this is transparent and neighbor is solid, render
  if (props.transparent && !neighborProps.transparent) return true;

  // Both solid — don't render
  return false;
}

// Get texture UV for a specific face of a block
function getFaceUV(blockId, faceIdx) {
  const props = BLOCK_PROPS[blockId] || {};
  let texName;
  if (faceIdx === 2) { // top
    texName = props.topTex || props.tex || 'stone';
  } else if (faceIdx === 3) { // bottom
    texName = props.bottomTex || props.tex || 'stone';
  } else { // sides
    texName = props.sideTex || props.tex || 'stone';
  }
  // Use dynamic import pattern — this function is called after textures module loaded
  return getTexUV(texName);
}

// Wrapper to avoid import issues (textures.js must be loaded first)
function getTexUV(name) {
  if (typeof window.__getTextureUV === 'function') {
    return window.__getTextureUV(name);
  }
  return { u0: 0, v0: 0, u1: 1, v1: 1 };
}

// Get neighbor block, checking adjacent chunks
function getNeighbor(chunkData, neighborChunks, lx, ly, lz, dx, dy, dz) {
  const nx = lx + dx;
  const ny = ly + dy;
  const nz = lz + dz;

  if (nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < WORLD_HEIGHT && nz >= 0 && nz < CHUNK_SIZE) {
    return chunkData[(ny * CHUNK_SIZE + nz) * CHUNK_SIZE + nx];
  }

  // Need to check neighbor chunk
  const ncx = Math.floor(nx / CHUNK_SIZE);
  const ncz = Math.floor(nz / CHUNK_SIZE);
  const key = `${ncx},${ncz}`;
  const neighbor = neighborChunks.get(key);
  if (!neighbor || !neighbor.data) return null; // unknown, render face

  const nnx = ((nx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  const nnz = ((nz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  if (ny < 0 || ny >= WORLD_HEIGHT) return BLOCK.AIR;
  return neighbor.data[(ny * CHUNK_SIZE + nnz) * CHUNK_SIZE + nnx];
}

// Build mesh for a chunk
export function buildChunkMesh(chunk, neighborChunks) {
  const { data, cx, cz } = chunk;
  if (!data) return null;

  const group = new THREE.Group();

  // Group vertices by block type for efficient rendering
  const blockTypeGroups = {};

  // For each block type, collect face data
  for (let ly = 0; ly < WORLD_HEIGHT; ly++) {
    for (let lz = 0; lz < CHUNK_SIZE; lz++) {
      for (let lx = 0; lx < CHUNK_SIZE; lx++) {
        const blockId = data[(ly * CHUNK_SIZE + lz) * CHUNK_SIZE + lx];
        if (blockId === BLOCK.AIR) continue;

        const props = BLOCK_PROPS[blockId];
        if (!props) continue;

        // Handle plant blocks (cross rendering)
        if (PLANT_BLOCKS.has(blockId)) {
          if (!blockTypeGroups[blockId]) blockTypeGroups[blockId] = [];
          buildPlantCross(blockTypeGroups[blockId], lx, ly, lz, blockId);
          continue;
        }

        // Standard cube blocks
        for (let f = 0; f < 6; f++) {
          const neighbor = getNeighbor(data, neighborChunks, lx, ly, lz, FACES[f].dir[0], FACES[f].dir[1], FACES[f].dir[2]);
          if (shouldRenderFace(blockId, neighbor, f)) {
            if (!blockTypeGroups[blockId]) blockTypeGroups[blockId] = [];
            addFace(blockTypeGroups[blockId], lx, ly, lz, blockId, f);
          }
        }
      }
    }
  }

  // Build geometries per block type
  let totalFaces = 0;
  for (const [blockId, faces] of Object.entries(blockTypeGroups)) {
    if (faces.length === 0) continue;
    totalFaces += faces.length;

    const geometry = buildGeometry(faces, parseInt(blockId));
    if (geometry) {
      const material = createBlockMaterial(parseInt(blockId));
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(cx * CHUNK_SIZE, 0, cz * CHUNK_SIZE);
      group.add(mesh);
    }
  }

  // Debug: log first few chunk meshes
  if (!window._meshDebugCount) window._meshDebugCount = 0;
  if (window._meshDebugCount < 3) {
    console.log(`[mesher] chunk (${cx},${cz}): ${totalFaces} faces, ${group.children.length} block types, ${group.children.length} meshes`);
    window._meshDebugCount++;
  }

  return group;
}

// Add a single face to the face list
function addFace(faces, x, y, z, blockId, faceIdx) {
  const uv = getFaceUV(blockId, faceIdx);
  faces.push({
    x, y, z,
    faceIdx,
    blockId,
    u0: uv.u0, v0: uv.v0, u1: uv.u1, v1: uv.v1,
  });
}

// Build a cross/plant shape (two intersecting quads)
function buildPlantCross(faces, x, y, z, blockId) {
  const uv = getFaceUV(blockId, 0);
  const hw = 0.4; // half width of cross

  // Diagonal quad 1
  faces.push({
    x, y, z,
    type: 'plant',
    blockId,
    u0: uv.u0, v0: uv.v0, u1: uv.u1, v1: uv.v1,
    // Vertices: two triangles forming a quad from (-hw,y,-hw) to (hw,y+1,hw)
    px: x, py: y, pz: z,
  });

  return; // We'll handle plant geometry separately
}

// Build BufferGeometry from face list
function buildGeometry(faces, blockId) {
  if (faces.length === 0) return null;

  const isPlant = PLANT_BLOCKS.has(blockId);

  if (isPlant) {
    // Build small cross geometry (Minecraft-style: thin diagonals, not full block width)
    const positions = [];
    const uvs = [];
    const indices = [];
    const hw = 0.15;  // narrow: 30% of block width
    const plantHeight = 0.7;  // shorter than full block
    const yBase = 0.15;  // raised slightly from ground

    for (let i = 0; i < faces.length; i++) {
      const { x, y, z, u0, v0, u1, v1 } = faces[i];
      const cx = x + 0.5;
      const cy = y + yBase;
      const cz = z + 0.5;
      const top = cy + plantHeight;

      const baseIdx = positions.length / 3;

      // Quad 1: diagonal /
      positions.push(
        cx - hw, cy, cz - hw,  cx + hw, cy, cz + hw,
        cx + hw, top, cz + hw,  cx - hw, top, cz - hw,
      );
      // Quad 2: diagonal \
      positions.push(
        cx - hw, cy, cz + hw,  cx + hw, cy, cz - hw,
        cx + hw, top, cz - hw,  cx - hw, top, cz + hw,
      );
      uvs.push(u0, v1, u1, v1, u1, v0, u0, v0);
      uvs.push(u0, v1, u1, v1, u1, v0, u0, v0);

      indices.push(
        baseIdx, baseIdx + 1, baseIdx + 2,
        baseIdx, baseIdx + 2, baseIdx + 3,
        baseIdx + 4, baseIdx + 5, baseIdx + 6,
        baseIdx + 4, baseIdx + 6, baseIdx + 7,
      );
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // Standard cube faces
  const positions = [];
  const uvs = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i < faces.length; i++) {
    const { x, y, z, faceIdx, u0, v0, u1, v1 } = faces[i];
    const verts = FACES[faceIdx].verts;
    const normal = FACES[faceIdx].normal;
    const baseIdx = positions.length / 3;

    // 4 vertices per face
    for (let v = 0; v < 4; v++) {
      positions.push(x + verts[v][0], y + verts[v][1], z + verts[v][2]);
      normals.push(normal[0], normal[1], normal[2]);
    }

    // UV mapping (flip V for Three.js)
    uvs.push(u0, 1 - v1, u1, 1 - v1, u1, 1 - v0, u0, 1 - v0);

    // Two triangles
    indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
    indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  return geo;
}

// Cache materials to avoid creating duplicates
const materialCache = {};

// Create textured material for a block type
function createBlockMaterial(blockId) {
  if (materialCache[blockId]) return materialCache[blockId];

  const props = BLOCK_PROPS[blockId];
  const isTransparent = props && props.transparent;
  const tex = window._textureAtlas;

  // Fallback: solid color if atlas not loaded
  if (!tex) {
    const fallbackColors = {
      [BLOCK.GRASS]: 0x7c9c4c, [BLOCK.DIRT]: 0x8b6914, [BLOCK.STONE]: 0x7f7f7f,
      [BLOCK.SAND]: 0xdbd08e, [BLOCK.WATER]: 0x3355cc, [BLOCK.OAK_LEAVES]: 0x2d5a1e,
      [BLOCK.BIRCH_LEAVES]: 0x4a8c2a, [BLOCK.SNOW]: 0xf0f0ff,
    };
    const mat = new THREE.MeshStandardMaterial({
      color: fallbackColors[blockId] || 0x808080,
      roughness: 0.8, metalness: 0.05,
      transparent: isTransparent, opacity: isTransparent ? 0.6 : 1.0,
      side: THREE.FrontSide, depthWrite: !isTransparent,
    });
    materialCache[blockId] = mat;
    return mat;
  }

  // Use texture atlas
  const material = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.0,
    transparent: isTransparent,
    opacity: isTransparent ? 0.7 : 1.0,
    alphaTest: isTransparent ? 0.1 : 0,
    side: THREE.FrontSide,
    depthWrite: !isTransparent,
  });

  material.name = `block-${blockId}`;
  materialCache[blockId] = material;
  return material;
}

// Clear material cache
export function clearMaterialCache() {
  for (const key in materialCache) {
    if (materialCache[key].map) materialCache[key].map = window._textureAtlas;
  }
}

// Create and set the texture atlas for all materials
export function setTextureAtlas(texture) {
  window._textureAtlas = texture;
}
