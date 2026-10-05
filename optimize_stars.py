import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# 1. Update star count to 8000
content = content.replace('for (let i = 0; i < 4000; i++) {', 'for (let i = 0; i < 8000; i++) {')

# 2. Update Canvas drawing from arc to fillRect for maximum performance
old_draw = """                    ctx2d.beginPath()
                    ctx2d.arc(px, py, Math.max(0.5, r), 0, Math.PI * 2)
                    ctx2d.fill()"""

new_draw = """                    const size = Math.max(1, r * 2)
                    ctx2d.fillRect(px - r, py - r, size, size)"""

content = content.replace(old_draw, new_draw)

# 3. Update easing to be more Emil-like (snappy, premium)
content = content.replace("ease: 'power2.inOut',", "ease: 'power3.inOut',")
content = content.replace("ease: 'power2.out',", "ease: 'power4.out',")
content = content.replace("scale: 0.9,", "scale: 0.95,")
content = content.replace("scale: 1.1,", "scale: 1.05,")

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
