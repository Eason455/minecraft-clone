// ============================================================
// Block types, item types, and world constants
// ============================================================

// Block IDs
export const BLOCK = {
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
export const BLOCK_NAMES = {
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
export const BLOCK_PROPS = {
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
export const BLOCK_DROPS = {
  [BLOCK.GRASS]: BLOCK.DIRT,
  [BLOCK.STONE]: BLOCK.COBBLESTONE,
  [BLOCK.COAL_ORE]: BLOCK.COAL_ORE, // drops itself (coal)
  [BLOCK.IRON_ORE]: BLOCK.IRON_ORE,
  [BLOCK.GOLD_ORE]: BLOCK.GOLD_ORE,
  [BLOCK.DIAMOND_ORE]: BLOCK.DIAMOND_ORE,
};

// Which textures use cross/plant rendering instead of cube
export const PLANT_BLOCKS = new Set([
  BLOCK.GRASS_PLANT, BLOCK.FLOWER_DANDELION, BLOCK.FLOWER_ROSE, BLOCK.TORCH,
]);

// Fluid blocks (special rendering)
export const FLUID_BLOCKS = new Set([BLOCK.WATER]);

// World constants
export const CHUNK_SIZE = 16;
export const WORLD_HEIGHT = 256;
export const SEA_LEVEL = 64;
export const RENDER_DISTANCE = 6; // chunks in each direction
export const GRAVITY = 25; // blocks/sec^2
export const JUMP_VELOCITY = 8.5;
export const PLAYER_HEIGHT = 1.8;
export const PLAYER_WIDTH = 0.6;
export const PLAYER_EYE_HEIGHT = 1.62;
export const PLAYER_SPEED = 5.5;
export const PLAYER_SPRINT_SPEED = 8.0;
export const REACH_DISTANCE = 5;
export const DAY_LENGTH = 1200; // seconds for full cycle (20 min)

// Item types (for inventory)
export const ITEM = {};
// Map block IDs to item IDs (1:1 for most blocks)
Object.keys(BLOCK).forEach(key => {
  ITEM[key] = BLOCK[key];
});
