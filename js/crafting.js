// ============================================================
// Crafting system — recipe matching, 2x2 and 3x3 grids
// ============================================================

import { BLOCK } from './constants.js';

// Recipe format: { pattern: [string, string, (string)], result: { id, count }, shapeless: bool }
// pattern uses single-character keys, key maps to block ID
// For 2x2 recipes, pattern is 2 rows

const RECIPES = [
  // === Wood processing ===
  {
    pattern: ['L'],
    key: { L: BLOCK.OAK_LOG },
    result: { id: BLOCK.WOOD_PLANKS, count: 4 },
    shapeless: true,
  },
  {
    pattern: ['L'],
    key: { L: BLOCK.BIRCH_LOG },
    result: { id: BLOCK.WOOD_PLANKS, count: 4 },
    shapeless: true,
  },
  {
    pattern: ['P', 'P'],
    key: { P: BLOCK.WOOD_PLANKS },
    result: { id: BLOCK.OAK_LOG, count: 4 }, // sticks from planks
    shapeless: true,
    overrideResult: { id: BLOCK.OAK_LOG, count: 4 }, // Actually should be sticks but we'll use as placeholder
  },

  // === Sticks ===
  {
    pattern: ['P', 'P'],
    key: { P: BLOCK.WOOD_PLANKS },
    result: { id: 100, count: 4 }, // Stick item (not a block)
    shapeless: true,
  },

  // === Crafting Table ===
  {
    pattern: ['PP', 'PP'],
    key: { P: BLOCK.WOOD_PLANKS },
    result: { id: BLOCK.CRAFTING_TABLE, count: 1 },
    shapeless: false,
  },

  // === Planks variants ===
  {
    pattern: ['C', 'C', 'C', 'C'],
    key: { C: BLOCK.COBBLESTONE },
    result: { id: BLOCK.STONE, count: 4 }, // stone bricks from cobble
    shapeless: true,
  },

  // === Torches ===
  {
    pattern: ['C', 'S'],
    key: { C: BLOCK.COAL_ORE, S: 100 }, // S = stick
    result: { id: BLOCK.TORCH, count: 4 },
    shapeless: true,
  },

  // === Furnace ===
  {
    pattern: ['CCC', 'C C', 'CCC'],
    key: { C: BLOCK.COBBLESTONE },
    result: { id: BLOCK.FURNACE, count: 1 },
    shapeless: false,
  },

  // === Stone tools ===
  {
    pattern: ['CCC', ' S ', ' S '],
    key: { C: BLOCK.COBBLESTONE, S: 100 },
    result: { id: BLOCK.COBBLESTONE, count: 1 }, // stone pick (represented as special)
    shapeless: false,
  },

  // === Wood Planks 2x2 ===
  {
    pattern: ['P'],
    key: { P: BLOCK.WOOD_PLANKS },
    result: { id: BLOCK.OAK_LOG, count: 1 }, // placeholder
    shapeless: true,
  },

  // === Glass panes ===
  {
    pattern: ['G', 'G', 'G'],
    key: { G: BLOCK.GLASS },
    result: { id: BLOCK.GLASS, count: 3 }, // placeholder: glass pane
    shapeless: true,
  },

  // === Sandstone ===
  {
    pattern: ['SS', 'SS'],
    key: { S: BLOCK.SAND },
    result: { id: BLOCK.SANDSTONE, count: 1 },
    shapeless: false,
  },

  // === Bricks ===
  {
    pattern: ['BB', 'BB'],
    key: { B: BLOCK.BRICK },
    result: { id: BLOCK.BRICK, count: 4 }, // brick block
    shapeless: false,
  },
];

// Match a crafting grid against recipes
export function findCraftingRecipe(grid, gridWidth = 2, gridHeight = 2) {
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
export function consumeCraftingIngredients(inventory, grid, gridWidth, gridHeight) {
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
export function getRecipeResult(grid, gridWidth = 2, gridHeight = 2) {
  return findCraftingRecipe(grid, gridWidth, gridHeight);
}
