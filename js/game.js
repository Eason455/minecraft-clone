// ============================================================
// Minecraft Clone — Single File Build
// ============================================================

import * as THREE from 'three';

// === js/constants.js ===
// ============================================================
// Block types, item types, and world constants
// ============================================================

// Block IDs
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  GRAVEL: 5,
  BEDROCK: 6,
  OAK_LOG: 7,
  OAK_LEAVES: 8,
  WATER: 9,
  GLASS: 10,
  COBBLESTONE: 11,
  WOOD_PLANKS: 12,
  COAL_ORE: 13,
  IRON_ORE: 14,
  GOLD_ORE: 15,
  DIAMOND_ORE: 16,
  OBSIDIAN: 17,
  BRICK: 18,
  SANDSTONE: 19,
  SNOW: 20,
  CRAFTING_TABLE: 21,
  FURNACE: 22,
  TORCH: 23,
  GRASS_PLANT: 24,
  FLOWER_DANDELION: 25,
  FLOWER_ROSE: 26,
  BIRCH_LOG: 27,
  BIRCH_LEAVES: 28,
};

// Block name map
  [BLOCK.AIR]: 'Air',
  [BLOCK.GRASS]: 'Grass Block',
  [BLOCK.DIRT]: 'Dirt',
  [BLOCK.STONE]: 'Stone',
  [BLOCK.SAND]: 'Sand',
  [BLOCK.GRAVEL]: 'Gravel',
  [BLOCK.BEDROCK]: 'Bedrock',
  [BLOCK.OAK_LOG]: 'Oak Log',
  [BLOCK.OAK_LEAVES]: 'Oak Leaves',
  [BLOCK.WATER]: 'Water',
  [BLOCK.GLASS]: 'Glass',
  [BLOCK.COBBLESTONE]: 'Cobblestone',
  [BLOCK.WOOD_PLANKS]: 'Wood Planks',
  [BLOCK.COAL_ORE]: 'Coal Ore',
  [BLOCK.IRON_ORE]: 'Iron Ore',
  [BLOCK.GOLD_ORE]: 'Gold Ore',
  [BLOCK.DIAMOND_ORE]: 'Diamond Ore',
  [BLOCK.OBSIDIAN]: 'Obsidian',
  [BLOCK.BRICK]: 'Brick',
  [BLOCK.SANDSTONE]: 'Sandstone',
  [BLOCK.SNOW]: 'Snow',
  [BLOCK.CRAFTING_TABLE]: 'Crafting Table',
  [BLOCK.FURNACE]: 'Furnace',
  [BLOCK.TORCH]: 'Torch',
  [BLOCK.GRASS_PLANT]: 'Grass',
  [BLOCK.FLOWER_DANDELION]: 'Dandelion',
  [BLOCK.FLOWER_ROSE]: 'Rose',
  [BLOCK.BIRCH_LOG]: 'Birch Log',
  [BLOCK.BIRCH_LEAVES]: 'Birch Leaves',
};

// Block properties: { hardness, transparent, collidable, topTex, sideTex, bottomTex }
  [BLOCK.AIR]: { hardness: 0, transparent: true, collidable: false },
  [BLOCK.GRASS]: { hardness: 0.8, transparent: false, collidable: true, topTex: 'grass_top', sideTex: 'grass_side', bottomTex: 'dirt' },
  [BLOCK.DIRT]: { hardness: 0.5, transparent: false, collidable: true, tex: 'dirt' },
  [BLOCK.STONE]: { hardness: 1.5, transparent: false, collidable: true, tex: 'stone' },
  [BLOCK.SAND]: { hardness: 0.5, transparent: false, collidable: true, tex: 'sand' },
  [BLOCK.GRAVEL]: { hardness: 0.6, transparent: false, collidable: true, tex: 'gravel' },
  [BLOCK.BEDROCK]: { hardness: Infinity, transparent: false, collidable: true, tex: 'bedrock' },
  [BLOCK.OAK_LOG]: { hardness: 2.0, transparent: false, collidable: true, topTex: 'log_oak_top', sideTex: 'log_oak', bottomTex: 'log_oak_top' },
  [BLOCK.OAK_LEAVES]: { hardness: 0.2, transparent: true, collidable: true, tex: 'leaves_oak' },
  [BLOCK.WATER]: { hardness: 0, transparent: true, collidable: false, tex: 'water' },
  [BLOCK.GLASS]: { hardness: 0.3, transparent: true, collidable: true, tex: 'glass' },
  [BLOCK.COBBLESTONE]: { hardness: 2.0, transparent: false, collidable: true, tex: 'cobblestone' },
  [BLOCK.WOOD_PLANKS]: { hardness: 2.0, transparent: false, collidable: true, tex: 'planks' },
  [BLOCK.COAL_ORE]: { hardness: 3.0, transparent: false, collidable: true, tex: 'coal_ore' },
  [BLOCK.IRON_ORE]: { hardness: 3.0, transparent: false, collidable: true, tex: 'iron_ore' },
  [BLOCK.GOLD_ORE]: { hardness: 3.0, transparent: false, collidable: true, tex: 'gold_ore' },
  [BLOCK.DIAMOND_ORE]: { hardness: 3.0, transparent: false, collidable: true, tex: 'diamond_ore' },
  [BLOCK.OBSIDIAN]: { hardness: 50, transparent: false, collidable: true, tex: 'obsidian' },
  [BLOCK.BRICK]: { hardness: 2.0, transparent: false, collidable: true, tex: 'brick' },
  [BLOCK.SANDSTONE]: { hardness: 0.8, transparent: false, collidable: true, topTex: 'sandstone_top', sideTex: 'sandstone', bottomTex: 'sandstone_bottom' },
  [BLOCK.SNOW]: { hardness: 0.2, transparent: false, collidable: true, tex: 'snow' },
  [BLOCK.CRAFTING_TABLE]: { hardness: 2.5, transparent: false, collidable: true, topTex: 'crafting_table_top', sideTex: 'crafting_table_side', bottomTex: 'planks' },
  [BLOCK.FURNACE]: { hardness: 3.5, transparent: false, collidable: true, topTex: 'furnace_top', sideTex: 'furnace_side', bottomTex: 'furnace_top' },
  [BLOCK.TORCH]: { hardness: 0, transparent: true, collidable: false, tex: 'torch' },
  [BLOCK.GRASS_PLANT]: { hardness: 0, transparent: true, collidable: false, tex: 'grass_plant' },
  [BLOCK.FLOWER_DANDELION]: { hardness: 0, transparent: true, collidable: false, tex: 'flower_dandelion' },
  [BLOCK.FLOWER_ROSE]: { hardness: 0, transparent: true, collidable: false, tex: 'flower_rose' },
  [BLOCK.BIRCH_LOG]: { hardness: 2.0, transparent: false, collidable: true, topTex: 'log_birch_top', sideTex: 'log_birch', bottomTex: 'log_birch_top' },
  [BLOCK.BIRCH_LEAVES]: { hardness: 0.2, transparent: true, collidable: true, tex: 'leaves_birch' },
};

// Which block drops what when broken
  [BLOCK.GRASS]: BLOCK.DIRT,
  [BLOCK.STONE]: BLOCK.COBBLESTONE,
  [BLOCK.COAL_ORE]: BLOCK.COAL_ORE, // drops itself (coal)
  [BLOCK.IRON_ORE]: BLOCK.IRON_ORE,
  [BLOCK.GOLD_ORE]: BLOCK.GOLD_ORE,
  [BLOCK.DIAMOND_ORE]: BLOCK.DIAMOND_ORE,
};

// Which textures use cross/plant rendering instead of cube
  BLOCK.GRASS_PLANT, BLOCK.FLOWER_DANDELION, BLOCK.FLOWER_ROSE, BLOCK.TORCH,
]);

// Fluid blocks (special rendering)

// World constants

// Item types (for inventory)
// Map block IDs to item IDs (1:1 for most blocks)
Object.keys(BLOCK).forEach(key => {
  ITEM[key] = BLOCK[key];
});


// === js/textures.js ===
// ============================================================
// Procedural texture generation using Canvas 2D
// All textures are 16x16 pixels, Minecraft style
// ============================================================


const TEX_SIZE = 16;
const ATLAS_COLS = 8;

// Generate all textures and build a texture atlas
let atlasCanvas, atlasCtx, textureCoords;
let waterCanvas, waterCtx; // animated water

// Simple seeded random for consistent textures
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Fill a 16x16 area with a base color
function fillBase(ctx, x, y, r, g, b) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(x, y, TEX_SIZE, TEX_SIZE);
}

// Add noise to a 16x16 area
function addNoise(ctx, x, y, seed, intensity = 20, alpha = 0.5) {
  const rand = seededRandom(seed);
  const imageData = ctx.getImageData(x, y, TEX_SIZE, TEX_SIZE);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (rand() - 0.5) * intensity * 2;
    data[i] = Math.min(255, Math.max(0, data[i] + noise * alpha));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * alpha));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * alpha));
  }
  ctx.putImageData(imageData, x, y);
}

// Draw individual pixels (for patterns)
function setPixel(ctx, x, y, px, py, r, g, b, a = 255) {
  ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
  ctx.fillRect(x + px, y + py, 1, 1);
}

// ============ Individual Texture Generators ============

function genDirt(ctx, x, y, seed) {
  fillBase(ctx, x, y, 134, 96, 62);
  addNoise(ctx, x, y, seed, 30, 0.6);
  // Add some darker spots
  const rand = seededRandom(seed + 100);
  for (let i = 0; i < 20; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    const shade = 80 + Math.floor(rand() * 60);
    setPixel(ctx, x, y, px, py, shade, shade * 0.7, shade * 0.4);
  }
}

function genGrassTop(ctx, x, y, seed) {
  fillBase(ctx, x, y, 90, 155, 45);
  addNoise(ctx, x, y, seed, 25, 0.5);
  const rand = seededRandom(seed + 200);
  // Grass blade lines
  for (let i = 0; i < 30; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    const shade = 70 + Math.floor(rand() * 40);
    setPixel(ctx, x, y, px, py, 50, shade + 30, 20);
  }
}

function genGrassSide(ctx, x, y, seed) {
  // Top 4 pixels green, rest dirt
  fillBase(ctx, x, y, 134, 96, 62);
  addNoise(ctx, x, y, seed, 30, 0.4);
  // Green top overlay
  const rand = seededRandom(seed + 300);
  for (let py = 0; py < 5; py++) {
    for (let px = 0; px < 16; px++) {
      const shade = 80 + Math.floor(rand() * 30);
      setPixel(ctx, x, y, px, py, 50, shade + 30, 20);
    }
  }
  // Blend line
  for (let px = 0; px < 16; px++) {
    const shade = 100 + Math.floor(rand() * 20);
    setPixel(ctx, x, y, px, 4, shade, shade * 0.7, shade * 0.3);
  }
}

function genStone(ctx, x, y, seed) {
  fillBase(ctx, x, y, 125, 125, 125);
  addNoise(ctx, x, y, seed, 35, 0.7);
  const rand = seededRandom(seed + 400);
  // Cracks and veins
  for (let i = 0; i < 8; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    const shade = 60 + Math.floor(rand() * 80);
    setPixel(ctx, x, y, px, py, shade, shade, shade);
  }
}

function genCobblestone(ctx, x, y, seed) {
  fillBase(ctx, x, y, 115, 115, 115);
  const rand = seededRandom(seed + 450);
  // Large stone chunks with mortar lines
  const chunks = [];
  for (let i = 0; i < 12; i++) {
    chunks.push({
      cx: Math.floor(rand() * 12) + 2,
      cy: Math.floor(rand() * 12) + 2,
      w: Math.floor(rand() * 6) + 3,
      h: Math.floor(rand() * 5) + 3,
      shade: 70 + Math.floor(rand() * 70),
    });
  }
  // Draw mortar background
  fillBase(ctx, x, y, 140, 140, 140);
  // Draw stones
  for (const c of chunks) {
    ctx.fillStyle = `rgb(${c.shade},${c.shade},${c.shade})`;
    ctx.fillRect(x + c.cx, y + c.cy, c.w, c.h);
  }
}

function genSand(ctx, x, y, seed) {
  fillBase(ctx, x, y, 219, 207, 138);
  addNoise(ctx, x, y, seed, 18, 0.4);
  const rand = seededRandom(seed + 500);
  for (let i = 0; i < 15; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    setPixel(ctx, x, y, px, py, 230, 220, 160);
  }
}

function genGravel(ctx, x, y, seed) {
  fillBase(ctx, x, y, 130, 128, 125);
  addNoise(ctx, x, y, seed, 25, 0.5);
  const rand = seededRandom(seed + 600);
  for (let i = 0; i < 25; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    const shade = 80 + Math.floor(rand() * 60);
    setPixel(ctx, x, y, px, py, shade, shade, shade);
  }
}

function genBedrock(ctx, x, y, seed) {
  fillBase(ctx, x, y, 30, 30, 30);
  addNoise(ctx, x, y, seed, 40, 0.8);
  const rand = seededRandom(seed + 650);
  for (let i = 0; i < 5; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    setPixel(ctx, x, y, px, py, 60, 60, 60);
  }
}

function genObsidian(ctx, x, y, seed) {
  fillBase(ctx, x, y, 15, 10, 25);
  const rand = seededRandom(seed + 660);
  // Purple-ish dark with small specks
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      const shade = 8 + Math.floor(rand() * 20);
      setPixel(ctx, x, y, px, py, shade + 5, shade, shade + 10);
    }
  }
}

function genLogOak(ctx, x, y, seed) {
  fillBase(ctx, x, y, 106, 85, 50);
  const rand = seededRandom(seed + 700);
  // Vertical bark lines
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      const shade = 80 + Math.floor(rand() * 40);
      // Darker vertical streaks
      if (px % 3 === 0 && rand() < 0.6) {
        setPixel(ctx, x, y, px, py, shade - 15, shade * 0.7 - 10, shade * 0.5 - 10);
      } else {
        setPixel(ctx, x, y, px, py, shade + 20, shade * 0.8, shade * 0.4);
      }
    }
  }
}

function genLogOakTop(ctx, x, y, seed) {
  fillBase(ctx, x, y, 130, 110, 70);
  const rand = seededRandom(seed + 720);
  // Tree rings
  let cx = 7 + Math.floor(rand() * 3);
  let cy = 8 + Math.floor(rand() * 2);
  for (let r = 7; r >= 1; r--) {
    ctx.beginPath();
    ctx.arc(x + cx, y + cy, r, 0, Math.PI * 2);
    const shade = 100 + (7 - r) * 10;
    ctx.fillStyle = `rgb(${shade + 20},${shade * 0.7},${shade * 0.3})`;
    ctx.fill();
  }
  // Dark center
  ctx.fillStyle = 'rgb(80,50,20)';
  ctx.fillRect(x + cx - 1, y + cy - 1, 2, 2);
}

function genLeavesOak(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0); // transparent base
  const rand = seededRandom(seed + 730);
  // Fill with leaf color, some gaps
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      if (rand() > 0.15) { // 15% transparent gaps
        const shade = 40 + Math.floor(rand() * 40);
        setPixel(ctx, x, y, px, py, 20, shade + 30, 10, 220 + Math.floor(rand() * 35));
      }
    }
  }
}

function genLogBirch(ctx, x, y, seed) {
  fillBase(ctx, x, y, 220, 220, 210);
  const rand = seededRandom(seed + 750);
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      const shade = 200 + Math.floor(rand() * 40);
      if (px % 4 === 0) {
        setPixel(ctx, x, y, px, py, shade - 10, shade - 10, shade - 5);
      } else {
        setPixel(ctx, x, y, px, py, shade, shade, shade - 5);
      }
    }
  }
  // Dark horizontal marks
  for (let i = 0; i < 3; i++) {
    const py = 3 + i * 4 + Math.floor(rand() * 2);
    for (let px = 0; px < 16; px++) {
      setPixel(ctx, x, y, px, py, 150, 145, 130);
    }
  }
}

function genLogBirchTop(ctx, x, y, seed) {
  fillBase(ctx, x, y, 235, 230, 220);
  const rand = seededRandom(seed + 760);
  for (let r = 6; r >= 1; r--) {
    ctx.beginPath();
    ctx.arc(x + 8, y + 8, r, 0, Math.PI * 2);
    const shade = 210 + (6 - r) * 5;
    ctx.fillStyle = `rgb(${shade},${shade - 5},${shade - 15})`;
    ctx.fill();
  }
}

function genLeavesBirch(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0);
  const rand = seededRandom(seed + 770);
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      if (rand() > 0.15) {
        const shade = 70 + Math.floor(rand() * 40);
        setPixel(ctx, x, y, px, py, shade, shade + 30, shade, 200 + Math.floor(rand() * 55));
      }
    }
  }
}

function genGlass(ctx, x, y, seed) {
  fillBase(ctx, x, y, 255, 255, 255);
  const rand = seededRandom(seed + 800);
  // Glass: mostly transparent with white/silver border
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      const onEdge = px === 0 || px === 15 || py === 0 || py === 15;
      const nearEdge = px <= 2 || px >= 13 || py <= 2 || py >= 13;
      if (onEdge) {
        setPixel(ctx, x, y, px, py, 220, 230, 240, 220);
      } else if (nearEdge) {
        setPixel(ctx, x, y, px, py, 240, 245, 250, 150);
      } else {
        setPixel(ctx, x, y, px, py, 250, 252, 255, 40);
      }
    }
  }
}

function genPlanks(ctx, x, y, seed) {
  fillBase(ctx, x, y, 185, 145, 80);
  const rand = seededRandom(seed + 820);
  // Horizontal plank lines
  for (let py = 0; py < 16; py++) {
    const shade = 160 + Math.floor(rand() * 40);
    for (let px = 0; px < 16; px++) {
      const gap = py % 4 === 3;
      if (gap) {
        setPixel(ctx, x, y, px, py, 120, 85, 40);
      } else {
        setPixel(ctx, x, y, px, py, shade + 20, shade * 0.7, shade * 0.3);
      }
    }
  }
}

function genBrick(ctx, x, y, seed) {
  fillBase(ctx, x, y, 150, 60, 30);
  const rand = seededRandom(seed + 840);
  // Brick pattern
  for (let row = 0; row < 8; row++) {
    const py = row * 2;
    const offset = row % 2 === 0 ? 0 : 4;
    for (let col = 0; col < 5; col++) {
      const px = col * 4 + offset - (col > 3 ? 4 : 0);
      const bshade = 130 + Math.floor(rand() * 40);
      for (let by = 0; by < 2; by++) {
        for (let bx = 0; bx < 3; bx++) {
          const ax = x + px + bx;
          const ay = y + py + by;
          if (ax < x + 16 && ay < y + 16) {
            setPixel(ctx, x, y, px + bx, py + by, bshade, bshade * 0.3, bshade * 0.15);
          }
        }
      }
    }
  }
  // Mortar lines
  for (let row = 0; row < 8; row++) {
    const py = row * 2;
    for (let px = 0; px < 16; px++) {
      setPixel(ctx, x, y, px, py, 130, 120, 110);
    }
  }
}

function genSandstone(ctx, x, y, seed) {
  fillBase(ctx, x, y, 216, 200, 120);
  addNoise(ctx, x, y, seed, 15, 0.3);
  const rand = seededRandom(seed + 860);
  // Horizontal strata lines
  for (let py = 3; py < 14; py += 3) {
    for (let px = 0; px < 16; px++) {
      setPixel(ctx, x, y, px, py, 200, 180, 100);
    }
  }
}

function genSandstoneTop(ctx, x, y, seed) {
  fillBase(ctx, x, y, 220, 205, 130);
  addNoise(ctx, x, y, seed, 12, 0.3);
}

function genSandstoneBottom(ctx, x, y, seed) {
  fillBase(ctx, x, y, 200, 180, 100);
  addNoise(ctx, x, y, seed, 18, 0.4);
}

function genSnow(ctx, x, y, seed) {
  fillBase(ctx, x, y, 245, 245, 250);
  addNoise(ctx, x, y, seed, 8, 0.2);
  const rand = seededRandom(seed + 880);
  // Some sparkle pixels
  for (let i = 0; i < 8; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    setPixel(ctx, x, y, px, py, 255, 255, 255);
  }
}

function genOre(ctx, x, y, seed, oreR, oreG, oreB) {
  // Stone base with colored ore spots
  genStone(ctx, x, y, seed);
  const rand = seededRandom(seed + 990);
  for (let i = 0; i < 10; i++) {
    const cx = 3 + Math.floor(rand() * 10);
    const cy = 3 + Math.floor(rand() * 10);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (rand() > 0.3 && cx + dx >= 0 && cx + dx < 16 && cy + dy >= 0 && cy + dy < 16) {
          setPixel(ctx, x, y, cx + dx, cy + dy, oreR, oreG, oreB);
        }
      }
    }
  }
}

function genCoalOre(ctx, x, y, seed) { genOre(ctx, x, y, seed, 30, 30, 30); }
function genIronOre(ctx, x, y, seed) { genOre(ctx, x, y, seed, 180, 150, 130); }
function genGoldOre(ctx, x, y, seed) { genOre(ctx, x, y, seed, 220, 200, 50); }
function genDiamondOre(ctx, x, y, seed) { genOre(ctx, x, y, seed, 80, 220, 220); }

function genCraftingTableTop(ctx, x, y, seed) {
  fillBase(ctx, x, y, 140, 100, 55);
  const rand = seededRandom(seed + 900);
  // Tool icons: hammer, pick shapes
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      const onGrid = (px % 4 === 0 || px % 4 === 3 || py % 4 === 0 || py % 4 === 3);
      if (onGrid) {
        setPixel(ctx, x, y, px, py, 100, 70, 35);
      } else {
        setPixel(ctx, x, y, px, py, 160, 120, 65);
      }
    }
  }
  // Hammer in center
  ctx.fillStyle = 'rgb(80,80,80)';
  ctx.fillRect(x + 6, y + 4, 4, 6); // handle
  ctx.fillRect(x + 5, y + 3, 6, 2); // head
}

function genCraftingTableSide(ctx, x, y, seed) {
  genPlanks(ctx, x, y, seed);
}

function genFurnaceTop(ctx, x, y, seed) {
  fillBase(ctx, x, y, 80, 80, 80);
  const rand = seededRandom(seed + 910);
  addNoise(ctx, x, y, seed + 1, 20, 0.4);
  // Vent lines
  for (let py = 4; py < 13; py += 3) {
    for (let px = 2; px < 14; px++) {
      setPixel(ctx, x, y, px, py, 60, 60, 60);
    }
  }
}

function genFurnaceSide(ctx, x, y, seed) {
  fillBase(ctx, x, y, 90, 90, 90);
  const rand = seededRandom(seed + 920);
  addNoise(ctx, x, y, seed + 2, 20, 0.4);
  // Furnace opening (top half)
  for (let py = 2; py < 7; py++) {
    for (let px = 4; px < 12; px++) {
      setPixel(ctx, x, y, px, py, 40, 40, 40);
    }
  }
  // Fire particles inside opening
  setPixel(ctx, x, y, 7, 4, 255, 140, 30);
  setPixel(ctx, x, y, 8, 4, 255, 180, 40);
  setPixel(ctx, x, y, 7, 5, 255, 120, 20);
}

function genWater(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0);
  const rand = seededRandom(seed + 950);
  for (let py = 0; py < 16; py++) {
    for (let px = 0; px < 16; px++) {
      setPixel(ctx, x, y, px, py, 30, 80, 220, 160 + Math.floor(rand() * 30));
    }
  }
  // Highlights
  for (let i = 0; i < 8; i++) {
    const px = Math.floor(rand() * 16);
    const py = Math.floor(rand() * 16);
    setPixel(ctx, x, y, px, py, 100, 160, 255, 200);
  }
}

function genTorch(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0);
  const rand = seededRandom(seed + 960);
  // Handle
  for (let py = 6; py < 16; py++) {
    for (let px = 7; px < 9; px++) {
      setPixel(ctx, x, y, px, py, 100, 70, 30);
    }
  }
  // Flame
  setPixel(ctx, x, y, 7, 3, 255, 200, 30);
  setPixel(ctx, x, y, 8, 3, 255, 200, 30);
  setPixel(ctx, x, y, 7, 4, 255, 160, 20);
  setPixel(ctx, x, y, 8, 4, 255, 160, 20);
  setPixel(ctx, x, y, 6, 4, 255, 180, 20);
  setPixel(ctx, x, y, 9, 4, 255, 180, 20);
  setPixel(ctx, x, y, 7, 5, 255, 140, 15);
  setPixel(ctx, x, y, 8, 5, 255, 120, 10);
  setPixel(ctx, x, y, 7, 6, 255, 100, 5);
  setPixel(ctx, x, y, 8, 6, 255, 80, 5);
}

function genGrassPlant(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0);
  const rand = seededRandom(seed + 970);
  // Tall grass: multiple blades
  for (let i = 0; i < 12; i++) {
    const bx = 5 + Math.floor(rand() * 6);
    const by = 2 + Math.floor(rand() * 13);
    const shade = 50 + Math.floor(rand() * 50);
    setPixel(ctx, x, y, bx, by, 20, shade + 40, 10);
  }
}

function genFlowerDandelion(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0);
  const rand = seededRandom(seed + 980);
  // Stem
  for (let py = 5; py < 16; py++) {
    setPixel(ctx, x, y, 7, py, 50, 120, 30);
    setPixel(ctx, x, y, 8, py, 50, 120, 30);
  }
  // Petals
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (Math.abs(dx) + Math.abs(dy) <= 3) {
        const shade = 255 - Math.floor(Math.abs(dx) + Math.abs(dy)) * 20;
        setPixel(ctx, x, y, 7 + dx, 3 + dy, shade, shade - 30, 0);
      }
    }
  }
  // Center
  setPixel(ctx, x, y, 7, 3, 200, 150, 0);
  setPixel(ctx, x, y, 8, 3, 200, 150, 0);
}

function genFlowerRose(ctx, x, y, seed) {
  fillBase(ctx, x, y, 0, 0, 0, 0);
  // Stem
  for (let py = 5; py < 16; py++) {
    setPixel(ctx, x, y, 7, py, 40, 100, 30);
    setPixel(ctx, x, y, 8, py, 40, 100, 30);
  }
  // Red petals
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (Math.abs(dx) + Math.abs(dy) <= 3) {
        setPixel(ctx, x, y, 7 + dx, 3 + dy, 220, 30, 30);
      }
    }
  }
  setPixel(ctx, x, y, 7, 3, 250, 50, 50);
  setPixel(ctx, x, y, 8, 3, 250, 50, 50);
}

// ============ Texture map & atlas builder ============

// List of textures to generate, in atlas order
const TEXTURE_LIST = [
  { name: 'dirt', gen: genDirt, seed: 10 },
  { name: 'grass_top', gen: genGrassTop, seed: 20 },
  { name: 'grass_side', gen: genGrassSide, seed: 30 },
  { name: 'stone', gen: genStone, seed: 40 },
  { name: 'cobblestone', gen: genCobblestone, seed: 50 },
  { name: 'sand', gen: genSand, seed: 60 },
  { name: 'gravel', gen: genGravel, seed: 70 },
  { name: 'bedrock', gen: genBedrock, seed: 80 },
  { name: 'obsidian', gen: genObsidian, seed: 90 },
  { name: 'log_oak', gen: genLogOak, seed: 100 },
  { name: 'log_oak_top', gen: genLogOakTop, seed: 110 },
  { name: 'leaves_oak', gen: genLeavesOak, seed: 120 },
  { name: 'log_birch', gen: genLogBirch, seed: 130 },
  { name: 'log_birch_top', gen: genLogBirchTop, seed: 140 },
  { name: 'leaves_birch', gen: genLeavesBirch, seed: 150 },
  { name: 'glass', gen: genGlass, seed: 160 },
  { name: 'planks', gen: genPlanks, seed: 170 },
  { name: 'brick', gen: genBrick, seed: 180 },
  { name: 'sandstone', gen: genSandstone, seed: 190 },
  { name: 'sandstone_top', gen: genSandstoneTop, seed: 200 },
  { name: 'sandstone_bottom', gen: genSandstoneBottom, seed: 210 },
  { name: 'snow', gen: genSnow, seed: 220 },
  { name: 'coal_ore', gen: genCoalOre, seed: 230 },
  { name: 'iron_ore', gen: genIronOre, seed: 240 },
  { name: 'gold_ore', gen: genGoldOre, seed: 250 },
  { name: 'diamond_ore', gen: genDiamondOre, seed: 260 },
  { name: 'crafting_table_top', gen: genCraftingTableTop, seed: 270 },
  { name: 'crafting_table_side', gen: genCraftingTableSide, seed: 280 },
  { name: 'furnace_top', gen: genFurnaceTop, seed: 290 },
  { name: 'furnace_side', gen: genFurnaceSide, seed: 300 },
  { name: 'torch', gen: genTorch, seed: 310 },
  { name: 'grass_plant', gen: genGrassPlant, seed: 320 },
  { name: 'flower_dandelion', gen: genFlowerDandelion, seed: 330 },
  { name: 'flower_rose', gen: genFlowerRose, seed: 340 },
  { name: 'water', gen: genWater, seed: 350 },
];

let textureIndex = {}; // name -> { u0, v0, u1, v1 }
let textureCanvas; // individual canvases for items

// Build the full texture atlas
  const cols = ATLAS_COLS;
  const rows = Math.ceil(TEXTURE_LIST.length / cols);
  const atlasW = cols * TEX_SIZE;
  const atlasH = rows * TEX_SIZE;

  atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = atlasW;
  atlasCanvas.height = atlasH;
  atlasCtx = atlasCanvas.getContext('2d');

  TEXTURE_LIST.forEach((tex, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * TEX_SIZE;
    const y = row * TEX_SIZE;
    tex.gen(atlasCtx, x, y, tex.seed);
    textureIndex[tex.name] = {
      u0: x / atlasW,
      v0: y / atlasH,
      u1: (x + TEX_SIZE) / atlasW,
      v1: (y + TEX_SIZE) / atlasH,
    };
  });

  // Build individual canvases for inventory icons
  textureCanvas = {};
  TEXTURE_LIST.forEach((tex, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * TEX_SIZE;
    const y = row * TEX_SIZE;
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ct = c.getContext('2d');
    ct.drawImage(atlasCanvas, x, y, TEX_SIZE, TEX_SIZE, 0, 0, TEX_SIZE, TEX_SIZE);
    textureCanvas[tex.name] = c;
  });

  return atlasCanvas;
}

// Get UV coords for a texture name
  if (!textureIndex[name]) {
    // fallback: return first texture
    name = TEXTURE_LIST[0].name;
  }
  const uv = textureIndex[name];
  return {
    u0: uv.u0, v0: uv.v0,
    u1: uv.u1, v1: uv.v1,
  };
}

// Get individual texture canvas (for inventory icons)
  return textureCanvas[name] || textureCanvas['stone'];
}

// Get atlas dimensions
  return {
    width: atlasCanvas.width,
    height: atlasCanvas.height,
  };
}

  return atlasCanvas;
}



// === js/world.js ===
// ============================================================
// World/terrain generation using Simplex-like noise
// ============================================================


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
  if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) {
    return null; // Out of bounds
  }
  return chunkData[(ly * CHUNK_SIZE + lz) * CHUNK_SIZE + lx];
}

// Set block in chunk data
  if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) {
    return false;
  }
  chunkData[(ly * CHUNK_SIZE + lz) * CHUNK_SIZE + lx] = blockId;
  return true;
}


// === js/chunks.js ===
// ============================================================
// Chunk management system
// ============================================================


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


// === js/mesher.js ===
// ============================================================
// Chunk mesh builder — converts block data to Three.js BufferGeometry
// Uses face culling (only render exposed faces) + greedy meshing
// ============================================================

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
  for (const key in materialCache) {
    if (materialCache[key].map) materialCache[key].map = window._textureAtlas;
  }
}

// Create and set the texture atlas for all materials
  window._textureAtlas = texture;
}


// === js/input.js ===
// ============================================================
// Keyboard + Mouse input manager with Pointer Lock API
// ============================================================

class InputManager {
  constructor() {
    this.keys = {};
    this.keysJustPressed = {};
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.mouseButtons = {};
    this.mouseButtonsJustPressed = {};
    this.mouseButtonsJustReleased = {};
    this.scrollDelta = 0;
    this.pointerLocked = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);

    // Keyboard events on window
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    // Mouse events on document (reliable for Pointer Lock movementX/Y)
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('wheel', this._onWheel, { passive: false });
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    document.addEventListener('contextmenu', this._onContextMenu);
  }

  _onKeyDown(e) {
    if (!this.keys[e.code]) {
      this.keysJustPressed[e.code] = true;
    }
    this.keys[e.code] = true;
    // Prevent browser shortcuts
    if (['KeyE', 'Escape', 'Tab'].includes(e.code)) {
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    this.keys[e.code] = false;
    this.keysJustPressed[e.code] = false;
  }

  _onMouseMove(e) {
    if (this.pointerLocked) {
      this.mouseDX += e.movementX || 0;
      this.mouseDY += e.movementY || 0;
    } else if (this._lastMouseX !== undefined) {
      // Fallback: track regular mouse when not locked (for browsers without Pointer Lock)
      this.mouseDX += e.clientX - this._lastMouseX;
      this.mouseDY += e.clientY - this._lastMouseY;
    }
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
  }

  _onMouseDown(e) {
    this.mouseButtons[e.button] = true;
    this.mouseButtonsJustPressed[e.button] = true;
  }

  _onMouseUp(e) {
    this.mouseButtons[e.button] = false;
    this.mouseButtonsJustReleased[e.button] = true;
  }

  _onWheel(e) {
    e.preventDefault();
    this.scrollDelta += Math.sign(e.deltaY);
  }

  _onPointerLockChange() {
    this.pointerLocked = document.pointerLockElement !== null;
  }

  _onContextMenu(e) {
    e.preventDefault();
  }

  // Check if key is held down
  isKeyDown(code) {
    return !!this.keys[code];
  }

  // Check if key was just pressed this frame
  isKeyPressed(code) {
    return !!this.keysJustPressed[code];
  }

  isMouseDown(button = 0) {
    return !!this.mouseButtons[button];
  }

  isMousePressed(button = 0) {
    return !!this.mouseButtonsJustPressed[button];
  }

  isMouseReleased(button = 0) {
    return !!this.mouseButtonsJustReleased[button];
  }

  getMouseDelta() {
    const dx = this.mouseDX;
    const dy = this.mouseDY;
    this.mouseDX = 0;
    this.mouseDY = 0;
    return { x: dx, y: dy };
  }

  getScroll() {
    const s = this.scrollDelta;
    this.scrollDelta = 0;
    return s;
  }

  // Call at end of each frame to clear one-frame state
  endFrame() {
    this.keysJustPressed = {};
    this.mouseButtonsJustPressed = {};
    this.mouseButtonsJustReleased = {};
    this.scrollDelta = 0;
  }

  requestPointerLock(element) {
    element.requestPointerLock();
  }

  exitPointerLock() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  isPointerLocked() {
    return this.pointerLocked;
  }
}

// Singleton
const input = new InputManager();


// === js/player.js ===
// ============================================================
// First-person player controller with physics and collision
// ============================================================

  BLOCK, BLOCK_PROPS, GRAVITY, JUMP_VELOCITY,
  PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_EYE_HEIGHT,
  PLAYER_SPEED, PLAYER_SPRINT_SPEED, WORLD_HEIGHT,
} from './constants.js';

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
    // Creative mode flying
    if (window._isCreative) {
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
      let mx = 0, my = 0, mz = 0;
      if (input.isKeyDown('KeyW')) { mx += forward.x; mz += forward.z; }
      if (input.isKeyDown('KeyS')) { mx -= forward.x; mz -= forward.z; }
      if (input.isKeyDown('KeyA')) { mx -= right.x; mz -= right.z; }
      if (input.isKeyDown('KeyD')) { mx += right.x; mz += right.z; }
      if (input.isKeyDown('Space')) my += 1;
      if (input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight')) my -= 1;
      const flySpeed = 15;
      const len = Math.sqrt(mx*mx+my*my+mz*mz);
      if (len > 0) { mx /= len; my /= len; mz /= len; }
      this.velocity.set(mx * flySpeed, my * flySpeed, mz * flySpeed);
      this.onGround = false;
      return;
    }

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
    const sprintKey = input.isKeyDown('ControlLeft') || input.isKeyDown('ControlRight');
    // Double-tap W for sprint
    if (input.isKeyPressed('KeyW') && this._lastWPress && Date.now() - this._lastWPress < 300) {
      this._sprintToggle = true;
    }
    if (input.isKeyPressed('KeyW')) this._lastWPress = Date.now();
    if (!input.isKeyDown('KeyW')) this._sprintToggle = false;
    this.isSprinting = sprintKey || this._sprintToggle;

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
      this.velocity.y = Math.min(this.velocity.y + 0.8, 3);
    }

    // Sprint drains hunger
    if (this.isSprinting && len > 0) {
      this._sprintTimer = (this._sprintTimer || 0) + dt;
      if (this._sprintTimer > 3) { // every 3 seconds of sprinting
        this._sprintTimer = 0;
        if (this.hunger > 0) this.hunger -= 0.1;
      }
      // Can't sprint if too hungry
      if (this.hunger <= 3) this.isSprinting = false;
    } else {
      this._sprintTimer = 0;
    }
  }

  _updatePhysics(dt) {
    const prevY = this.position.y;

    // Apply gravity (reduced in water)
    if (!this.onGround) {
      const g = this.isInWater ? GRAVITY * 0.3 : GRAVITY;
      this.velocity.y -= g * dt;
    }

    // Buoyancy in water
    if (this.isInWater && this.velocity.y < -2) {
      this.velocity.y *= 0.9;
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



// === js/interaction.js ===
// ============================================================
// Block interaction — breaking, placing, highlighting
// ============================================================


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
    if (blockId === BLOCK.BEDROCK && !window._isCreative) return;

    // Set to air
    this.chunkManager.setBlock(wx, wy, wz, BLOCK.AIR);

    // Particles
    if (typeof spawnBlockParticles !== 'undefined') {
      spawnBlockParticles(wx, wy, wz, blockId);
    }

    // Get drop (only in survival)
    if (!window._isCreative) {
      const dropId = BLOCK_DROPS[blockId] || blockId;
      if (dropId !== BLOCK.AIR) {
        this.inventory.addItem(dropId, 1);
      }
    }

    // Check for nearby falling blocks
    if (typeof checkFallingAround !== 'undefined') {
      checkFallingAround(wx, wy, wz);
    }

    // Trigger re-mesh
    this._remeshAffectedChunks(wx, wz);
  }

  _placeBlock(hit) {
    const { position, normal, blockId: hitBlockId } = hit;

    // Check if right-clicking a crafting table or furnace
    if (hitBlockId === BLOCK.CRAFTING_TABLE) {
      if (this._onOpenTable) this._onOpenTable();
      return;
    }
    if (hitBlockId === BLOCK.FURNACE) {
      // Simple furnace: smelt 1 coal ore + 1 raw material → result
      const hasCoal = this.inventory.hasItems(BLOCK.COAL_ORE, 1);
      const hasIron = this.inventory.hasItems(BLOCK.IRON_ORE, 1);
      const hasGold = this.inventory.hasItems(BLOCK.GOLD_ORE, 1);
      const hasSand = this.inventory.hasItems(BLOCK.SAND, 1);
      if (hasCoal && hasIron) {
        this.inventory.consumeItems(BLOCK.COAL_ORE, 1);
        this.inventory.consumeItems(BLOCK.IRON_ORE, 1);
        this.inventory.addItem(BLOCK.IRON_ORE, 1); // smelted iron = iron block for now
        if (this._onMessage) this._onMessage('[OK] Smelted Iron Ore!');
      } else if (hasCoal && hasGold) {
        this.inventory.consumeItems(BLOCK.COAL_ORE, 1);
        this.inventory.consumeItems(BLOCK.GOLD_ORE, 1);
        this.inventory.addItem(BLOCK.GOLD_ORE, 2); // bonus gold
        if (this._onMessage) this._onMessage('[OK] Smelted Gold Ore!');
      } else if (hasCoal && hasSand) {
        this.inventory.consumeItems(BLOCK.COAL_ORE, 1);
        this.inventory.consumeItems(BLOCK.SAND, 1);
        this.inventory.addItem(BLOCK.GLASS, 1);
        if (this._onMessage) this._onMessage('[OK] Smelted Glass!');
      } else {
        if (this._onMessage) this._onMessage('[!] Furnace needs Coal + (Iron/Gold/Sand) in inventory');
      }
      return;
    }

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
      if (!window._isCreative) {
        this.inventory.removeItem(this.player.selectedSlot, 1);
      }
      this._remeshAffectedChunks(px, pz);
    }
  }

  _remeshAffectedChunks(wx, wz) {
    // The setBlock method in chunkManager already marks chunks dirty
    // Remeshing happens in the main loop
  }
}



// === js/inventory.js ===
// ============================================================
// Inventory system — 36 slots (9 hotbar + 27 storage)
// ============================================================


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
    99: 'planks',      // stick
    101: 'planks',     // wood pickaxe
    102: 'cobblestone', // stone pickaxe
    103: 'planks',     // wood axe
    104: 'cobblestone', // stone axe
    105: 'planks',     // wood sword
    106: 'cobblestone', // stone sword
    107: 'planks',     // wood shovel
    108: 'cobblestone', // stone shovel
  };

  _virtualItemNames = {
    99: 'Stick',
    101: 'Wooden Pickaxe',
    102: 'Stone Pickaxe',
    103: 'Wooden Axe',
    104: 'Stone Axe',
    105: 'Wooden Sword',
    106: 'Stone Sword',
    107: 'Wooden Shovel',
    108: 'Stone Shovel',
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



// === js/crafting.js ===
// ============================================================
// Crafting system — recipe matching, 2x2 and 3x3 grids
// ============================================================


// Recipe format: { pattern: [string, string, (string)], result: { id, count }, shapeless: bool }
// pattern uses single-character keys, key maps to block ID
// For 2x2 recipes, pattern is 2 rows
// For 3x3 recipes, pattern is 3 rows

// Item IDs (virtual, not blocks)
const ITEM_STICK = 99;
const ITEM_WOOD_PICKAXE = 101;
const ITEM_STONE_PICKAXE = 102;
const ITEM_WOOD_AXE = 103;
const ITEM_STONE_AXE = 104;
const ITEM_WOOD_SWORD = 105;
const ITEM_STONE_SWORD = 106;
const ITEM_WOOD_SHOVEL = 107;
const ITEM_STONE_SHOVEL = 108;
const ITEM_COAL = BLOCK.COAL_ORE; // coal ore drops itself

const RECIPES = [
  // === Log → Planks (shapeless, 1 log → 4 planks) ===
  { pattern: ['L'], key: { L: BLOCK.OAK_LOG }, result: { id: BLOCK.WOOD_PLANKS, count: 4 }, shapeless: true },
  { pattern: ['L'], key: { L: BLOCK.BIRCH_LOG }, result: { id: BLOCK.WOOD_PLANKS, count: 4 }, shapeless: true },

  // === Planks → Sticks (2 planks vertical → 4 sticks) ===
  { pattern: ['P', 'P'], key: { P: BLOCK.WOOD_PLANKS }, result: { id: ITEM_STICK, count: 4 }, shapeless: true },

  // === Crafting Table (2x2 of planks) ===
  { pattern: ['PP', 'PP'], key: { P: BLOCK.WOOD_PLANKS }, result: { id: BLOCK.CRAFTING_TABLE, count: 1 }, shapeless: false },

  // === Torches (coal + stick) ===
  { pattern: ['C', 'S'], key: { C: ITEM_COAL, S: ITEM_STICK }, result: { id: BLOCK.TORCH, count: 4 }, shapeless: true },

  // === Furnace (3x3: 8 cobblestone ring) ===
  { pattern: ['CCC', 'C C', 'CCC'], key: { C: BLOCK.COBBLESTONE }, result: { id: BLOCK.FURNACE, count: 1 }, shapeless: false },

  // === Sandstone (2x2 sand) ===
  { pattern: ['SS', 'SS'], key: { S: BLOCK.SAND }, result: { id: BLOCK.SANDSTONE, count: 1 }, shapeless: false },

  // === Bricks (2x2 bricks) ===
  { pattern: ['BB', 'BB'], key: { B: BLOCK.BRICK }, result: { id: BLOCK.BRICK, count: 1 }, shapeless: false },

  // === Wooden Pickaxe ===
  { pattern: ['PPP', ' S ', ' S '], key: { P: BLOCK.WOOD_PLANKS, S: ITEM_STICK }, result: { id: ITEM_WOOD_PICKAXE, count: 1 }, shapeless: false },

  // === Stone Pickaxe ===
  { pattern: ['CCC', ' S ', ' S '], key: { C: BLOCK.COBBLESTONE, S: ITEM_STICK }, result: { id: ITEM_STONE_PICKAXE, count: 1 }, shapeless: false },

  // === Stone Axe ===
  { pattern: ['CC', 'CS', ' S'], key: { C: BLOCK.COBBLESTONE, S: ITEM_STICK }, result: { id: ITEM_STONE_AXE, count: 1 }, shapeless: false },

  // === Stone Sword ===
  { pattern: ['C', 'C', 'S'], key: { C: BLOCK.COBBLESTONE, S: ITEM_STICK }, result: { id: ITEM_STONE_SWORD, count: 1 }, shapeless: false },

  // === Stone Shovel ===
  { pattern: ['C', 'S', 'S'], key: { C: BLOCK.COBBLESTONE, S: ITEM_STICK }, result: { id: ITEM_STONE_SHOVEL, count: 1 }, shapeless: false },

  // === Planks 4x from 1 log (shapeless alt) ===
  { pattern: ['P'], key: { P: BLOCK.WOOD_PLANKS }, result: { id: ITEM_STICK, count: 2 }, shapeless: true },
];

// Match a crafting grid against recipes
  // Flatten the 2D grid into a pattern
  const flatIds = [];
  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      const idx = row * gridWidth + col;
      flatIds.push(grid[idx] ? grid[idx].id : BLOCK.AIR);
    }
  }

  // Check if all slots are empty
  if (flatIds.every(id => id === BLOCK.AIR)) return null;

  // Try each recipe
  for (const recipe of RECIPES) {
    // Skip 3x3 recipes if grid is 2x2
    if (recipe.pattern.length > gridHeight) continue;
    if (recipe.pattern[0] && recipe.pattern[0].length > gridWidth) continue;

    if (recipe.shapeless) {
      // Shapeless: just check that all required items are present (any position)
      if (matchShapeless(flatIds, recipe)) {
        return recipe.result;
      }
    } else {
      // Shaped: check all positions/rotations
      if (matchShaped(grid, gridWidth, gridHeight, recipe)) {
        return recipe.result;
      }
    }
  }

  return null;
}

function matchShapeless(flatIds, recipe) {
  // Collect required items from recipe
  const required = [];
  for (const row of recipe.pattern) {
    for (const ch of row) {
      required.push(recipe.key[ch]);
    }
  }

  // Collect provided items (non-air)
  const provided = flatIds.filter(id => id !== BLOCK.AIR);

  if (required.length !== provided.length) return false;

  // Sort and compare
  required.sort();
  provided.sort();
  return required.every((r, i) => r === provided[i]);
}

function matchShaped(grid, gridWidth, gridHeight, recipe) {
  const patRows = recipe.pattern.length;
  const patCols = recipe.pattern[0].length;

  if (patRows > gridHeight || patCols > gridWidth) return false;

  // Try all possible offsets of the pattern within the grid
  for (let rowOff = 0; rowOff <= gridHeight - patRows; rowOff++) {
    for (let colOff = 0; colOff <= gridWidth - patCols; colOff++) {
      let matches = true;

      for (let r = 0; r < patRows && matches; r++) {
        for (let c = 0; c < patCols && matches; c++) {
          const ch = recipe.pattern[r][c];
          const gridIdx = (rowOff + r) * gridWidth + (colOff + c);
          const gridItem = grid[gridIdx];

          if (ch === ' ') {
            // Space means must be empty
            if (gridItem && gridItem.id !== BLOCK.AIR) matches = false;
          } else {
            const expectedId = recipe.key[ch];
            if (!gridItem || gridItem.id !== expectedId) matches = false;
          }
        }
      }

      // Also check that slots outside the pattern area are empty
      // (otherwise a recipe could match with extra items)
      for (let r = 0; r < gridHeight && matches; r++) {
        for (let c = 0; c < gridWidth && matches; c++) {
          const inPattern = r >= rowOff && r < rowOff + patRows &&
                            c >= colOff && c < colOff + patCols;
          if (!inPattern) {
            const gridIdx = r * gridWidth + c;
            if (grid[gridIdx] && grid[gridIdx].id !== BLOCK.AIR) {
              matches = false;
            }
          }
        }
      }

      if (matches) return true;
    }
  }

  return false;
}

// Consume ingredients from crafting grid
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] && grid[i].id !== BLOCK.AIR) {
      // Reduce count by 1
      grid[i].count--;
      if (grid[i].count <= 0) {
        grid[i] = { id: BLOCK.AIR, count: 0 };
      }
    }
  }
}

// Get the recipe result for display
  return findCraftingRecipe(grid, gridWidth, gridHeight);
}


// === js/sky.js ===
// ============================================================
// Sky, sun, moon, and day/night cycle
// ============================================================


class SkyManager {
  constructor(scene) {
    this.scene = scene;
    this.time = 0.3; // 0-1, 0=dawn, 0.25=noon, 0.5=dusk, 0.75=midnight
    this.dayLength = DAY_LENGTH;
    this.elapsed = 0.3 * DAY_LENGTH; // start at late morning

    // Sky gradient (using scene background color)
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Sun
    const sunGeo = new THREE.SphereGeometry(20, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff80 });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.sun.renderOrder = -1;
    this.sun.material.depthTest = false;
    this.sun.material.depthWrite = false;
    scene.add(this.sun);

    // Moon
    const moonGeo = new THREE.SphereGeometry(15, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xeeeeff });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.renderOrder = -1;
    this.moon.material.depthTest = false;
    this.moon.material.depthWrite = false;
    scene.add(this.moon);

    // Ambient light (changes with time)
    this.ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(this.ambientLight);

    // Directional light (sun)
    this.sunLight = new THREE.DirectionalLight(0xfff0d0, 1.2);
    this.sunLight.position.set(100, 100, 100);
    scene.add(this.sunLight);

    // Hemisphere light (sky/ground)
    this.hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x362907, 0.5);
    scene.add(this.hemiLight);

    // Set initial state
    this.time = 0.3; // start at late morning
  }

  update(deltaTime) {
    this.elapsed += deltaTime;
    this.time = (this.elapsed / this.dayLength) % 1.0;

    const angle = this.time * Math.PI * 2; // full circle

    // Sun and moon orbit
    const sunY = Math.sin(angle) * 150;
    const sunX = Math.cos(angle) * 150;
    this.sun.position.set(sunX, sunY, 0);

    const moonAngle = angle + Math.PI;
    const moonY = Math.sin(moonAngle) * 150;
    const moonX = Math.cos(moonAngle) * 150;
    this.moon.position.set(moonX, moonY, 0);

    // Sun visibility (only above horizon)
    this.sun.visible = sunY > -15;

    // Moon visibility (only above horizon, opposite of sun)
    this.moon.visible = moonY > -15;

    // Lighting based on time of day
    let sunIntensity, ambientIntensity, hemiIntensity;
    let skyColor, fogColor;

    if (this.time < 0.25) {
      // Dawn to noon
      const t = this.time / 0.25;
      sunIntensity = 0.4 + t * 0.8;
      ambientIntensity = 0.3 + t * 0.3;
      hemiIntensity = 0.3 + t * 0.3;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x1a1a3a), new THREE.Color(0x87CEEB), t
      );
    } else if (this.time < 0.5) {
      // Noon to dusk
      const t = (this.time - 0.25) / 0.25;
      sunIntensity = 1.2 - t * 0.6;
      ambientIntensity = 0.6 - t * 0.2;
      hemiIntensity = 0.6 - t * 0.2;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x87CEEB), new THREE.Color(0xff8c42), t
      );
    } else if (this.time < 0.75) {
      // Dusk to midnight
      const t = (this.time - 0.5) / 0.25;
      sunIntensity = 0.6 - t * 0.6;
      ambientIntensity = 0.4 - t * 0.25;
      hemiIntensity = 0.4 - t * 0.25;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0xff8c42), new THREE.Color(0x0a0a1e), t
      );
    } else {
      // Midnight to dawn
      const t = (this.time - 0.75) / 0.25;
      sunIntensity = t * 0.4;
      ambientIntensity = 0.15 + t * 0.15;
      hemiIntensity = 0.15 + t * 0.15;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x0a0a1e), new THREE.Color(0x1a1a3a), t
      );
    }

    // Apply lighting
    this.sunLight.intensity = Math.max(0, sunIntensity);
    this.ambientLight.intensity = Math.max(0.1, ambientIntensity);
    this.hemiLight.intensity = Math.max(0.1, hemiIntensity);

    // Sky/fog color
    this.scene.background = skyColor;
    this.scene.fog.color.copy(skyColor);

    // Sunlight direction
    this.sunLight.position.copy(this.sun.position);
  }

  // Get current time as formatted string
  getTimeString() {
    const totalMinutes = this.time * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}



// === js/audio.js ===
// ============================================================
// Procedural audio using Web Audio API
// ============================================================

class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.masterGain = null;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this.enabled = true;
    } catch (e) {
      console.warn('Audio not available:', e);
      this.enabled = false;
    }
  }

  _ensureContext() {
    if (!this.enabled) return false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  // Play a footstep sound
  playFootstep(blockType = 'dirt') {
    if (!this._ensureContext()) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';

    // Different pitches for different blocks
    const pitchMap = {
      dirt: 80, grass: 90, stone: 120, cobblestone: 110,
      sand: 70, gravel: 100, wood: 95, planks: 100,
      snow: 60, brick: 130,
    };
    osc.frequency.value = pitchMap[blockType] || 100;

    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Block breaking sound
  playBlockBreak(blockType) {
    if (!this._ensureContext()) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise burst
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 20);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500 + Math.random() * 1000;
    filter.Q.value = 0.8;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);
  }

  // Block place sound (thud)
  playBlockPlace() {
    if (!this._ensureContext()) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Player hurt sound
  playHurt() {
    if (!this._ensureContext()) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Item pickup sound (pop)
  playPickup() {
    if (!this._ensureContext()) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }
}

// Singleton
const audio = new AudioManager();


// === js/ui.js ===
// ============================================================
// UI Manager — HUD, inventory screen, crafting UI
// ============================================================


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



// === js/main.js ===
// ============================================================
// Main entry point — game initialization and loop
// ============================================================


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

