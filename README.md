# Minecraft Clone — Browser Edition

A full-featured Minecraft-style voxel game built from scratch using Three.js and vanilla JavaScript. Runs entirely in the browser with no backend required.

## [OK] Features

- **Infinite 3D voxel world** with procedurally generated terrain
- **Chunk-based rendering** — loads/unloads chunks as you explore
- **Multiple biomes**: Plains, Forest, Desert, Snowy
- **Cave systems** generated with 3D noise
- **20+ block types**: Grass, Dirt, Stone, Sand, Ores, Trees, Water, Glass, etc.
- **Tree generation** — Oak and Birch with proper trunk + canopy
- **First-person controls** — WASD move, mouse look, Space jump, Shift sneak
- **Block interaction** — left-click to mine, right-click to place
- **Inventory system** — 36 slots, item stacking (up to 64), drag & drop
- **Crafting system** — 2x2 grid, recipe pattern matching
- **Day/night cycle** — 20-minute full cycle with sun/moon
- **Dynamic lighting** — ambient + directional light changes with time of day
- **Procedural audio** — footstep, mining, placing sounds via Web Audio API
- **HUD** — health, hunger, hotbar, crosshair
- **All textures procedurally generated** via Canvas 2D (no external image files)

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look around |
| Left click | Mine/break block |
| Right click | Place block |
| Space | Jump |
| Shift | Sneak |
| Ctrl | Sprint |
| E | Inventory / Crafting |
| 1-9 | Select hotbar slot |
| Scroll wheel | Cycle hotbar |
| Escape | Release mouse cursor |

## Running Locally

A local HTTP server is required because the game uses ES modules.

```bash
cd minecraft-clone
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Technical Details

- **Engine**: Three.js 0.160 (WebGL renderer)
- **Terrain**: Simplex noise (2D for heightmap, 3D for caves)
- **Renderer**: Custom greedy meshing with face culling
- **Textures**: 16x16 pixel art generated via Canvas 2D, packed into texture atlas
- **Physics**: AABB collision detection per-axis
- **Audio**: Web Audio API with procedurally generated sounds
- **Modules**: ES modules with import maps (zero build step)

## File Structure

```
minecraft-clone/
├── index.html           # Entry point
├── css/
│   └── style.css        # UI styling
└── js/
    ├── main.js          # Game loop, initialization
    ├── constants.js     # Block types, world parameters
    ├── textures.js      # Procedural texture generation
    ├── world.js         # Terrain generation (Simplex noise)
    ├── chunks.js        # Chunk loading/unloading
    ├── mesher.js        # Block → Three.js mesh builder
    ├── player.js        # First-person controller + physics
    ├── input.js         # Keyboard/mouse input
    ├── interaction.js   # Block mining/placing
    ├── inventory.js     # 36-slot inventory
    ├── crafting.js      # Recipe matching
    ├── sky.js           # Day/night cycle
    ├── audio.js         # Procedural sound effects
    └── ui.js            # HUD + inventory UI
```

## License

MIT — Educational project
