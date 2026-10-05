import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# 1. Change GSAP easings
content = content.replace("ease: 'power4.out',", "ease: 'power2.out',")
content = content.replace("ease: 'power3.inOut',", "ease: 'power2.inOut',")
content = content.replace("ease: 'power3.out',", "ease: 'power2.out',") # also ease out for text elements

# 2. Add dotCanvas for perfect circles
old_canvas_init = """            let raf;
            const render = () => {"""

new_canvas_init = """            const dotCanvas = document.createElement('canvas')
            dotCanvas.width = 16
            dotCanvas.height = 16
            const dotCtx = dotCanvas.getContext('2d')
            dotCtx.fillStyle = '#ffffff'
            dotCtx.beginPath()
            dotCtx.arc(8, 8, 8, 0, Math.PI * 2)
            dotCtx.fill()

            let raf;
            const render = () => {"""

content = content.replace(old_canvas_init, new_canvas_init)

# 3. Replace fillRect with drawImage
old_draw = """                    const size = Math.max(1, r * 2)
                    ctx2d.fillRect(px - r, py - r, size, size)"""

new_draw = """                    const size = Math.max(1, r * 2)
                    ctx2d.drawImage(dotCanvas, 0, 0, 16, 16, px - r, py - r, size, size)"""

content = content.replace(old_draw, new_draw)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
