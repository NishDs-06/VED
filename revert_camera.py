import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Remove x and y targets
content = re.sub(r'const targetX = Math\.sin\(i \* 0\.8\) \* 150\n\s*const targetY = Math\.cos\(i \* 0\.6\) \* 100', '', content)
content = re.sub(r'x: -targetX,\n\s*y: -targetY,', '', content)
content = re.sub(r'x: targetX,\n\s*y: targetY,', '', content)

# Remove x and y from canvas loop
old_canvas = """                    const px = cx + (s.x - camX) * scale
                    const py = cy + (s.y - camY) * scale"""
new_canvas = """                    const px = cx + s.x * scale
                    const py = cy + s.y * scale"""
content = content.replace(old_canvas, new_canvas)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
