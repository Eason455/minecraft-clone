// ============================================================
// Procedural texture generation using Canvas 2D
// All textures are 16x16 pixels, Minecraft style
// ============================================================

import { BLOCK } from './constants.js';

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
export function buildTextureAtlas() {
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
export function getTextureUV(name, face = 'all') {
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
export function getTextureCanvas(name) {
  return textureCanvas[name] || textureCanvas['stone'];
}

// Get atlas dimensions
export function getAtlasSize() {
  return {
    width: atlasCanvas.width,
    height: atlasCanvas.height,
  };
}

export function getAtlasCanvas() {
  return atlasCanvas;
}

export const TEX_LIST = TEXTURE_LIST;
export { TEX_SIZE, ATLAS_COLS };
