import re

files = [
    'js/constants.js',
    'js/textures.js',
    'js/world.js',
    'js/chunks.js',
    'js/mesher.js',
    'js/input.js',
    'js/player.js',
    'js/interaction.js',
    'js/inventory.js',
    'js/crafting.js',
    'js/sky.js',
    'js/audio.js',
    'js/ui.js',
    'js/main.js',
]

output = []
output.append('// ============================================================')
output.append('// Minecraft Clone — Single File Build')
output.append('// ============================================================')
output.append('')
output.append("import * as THREE from 'three';")
output.append('')

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = []
    for line in content.split('\n'):
        # Skip all import/export lines (THREE is already imported above)
        if line.strip().startswith('import ') or line.strip().startswith('export '):
            continue
        lines.append(line)
    
    clean = '\n'.join(lines)
    output.append(f'// === {fpath} ===')
    output.append(clean)
    output.append('')

result = '\n'.join(output)
with open('js/game.js', 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Built js/game.js: {len(result.split(chr(10)))} lines, {len(files)} files')
