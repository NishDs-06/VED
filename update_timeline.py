import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# 1. Update camera initialization to include x and y
content = content.replace("const camera = useRef({ z: 0 })", "const camera = useRef({ x: 0, y: 0, z: 0 })")

# 2. Add x and y targets to the timeline
old_loop = """            chunks.forEach((chunk, i) => {
                const targetZ = (i + 1) * DEPTH_STEP
                const chunkEl = chunkRefs.current[i]

                tl.to(stageRef.current, {
                    z: targetZ,
                    duration: i === 0 ? 1.0 : 2.0,
                    ease: 'power3.inOut',
                }, i === 0 ? '-=0.2' : '-=0.5')

                tl.to(camera.current, {
                    z: targetZ,
                    duration: i === 0 ? 1.0 : 2.0,
                    ease: 'power3.inOut',
                }, i === 0 ? '-=0.2' : '<')"""

new_loop = """            chunks.forEach((chunk, i) => {
                const targetZ = (i + 1) * DEPTH_STEP
                // Meander paths for realism
                const targetX = Math.sin(i * 0.8) * 150
                const targetY = Math.cos(i * 0.6) * 100
                const chunkEl = chunkRefs.current[i]

                tl.to(stageRef.current, {
                    x: -targetX,
                    y: -targetY,
                    z: targetZ,
                    duration: 2.5,
                    ease: 'power3.inOut',
                }, i === 0 ? '-=0.2' : '-=0.8')

                tl.to(camera.current, {
                    x: targetX,
                    y: targetY,
                    z: targetZ,
                    duration: 2.5,
                    ease: 'power3.inOut',
                }, '<')"""

content = content.replace(old_loop, new_loop)

# 3. Update Canvas loop to use camera.x and camera.y
old_canvas_logic = """                const camZ = camera.current.z
                
                ctx2d.fillStyle = '#ffffff'
                for (let i = 0; i < stars.length; i++) {
                    const s = stars[i]
                    const z = s.z + camZ
                    if (z >= fl) continue;
                    
                    const scale = fl / (fl - z)
                    const px = cx + s.x * scale
                    const py = cy + s.y * scale"""

new_canvas_logic = """                const camX = camera.current.x
                const camY = camera.current.y
                const camZ = camera.current.z
                
                ctx2d.fillStyle = '#ffffff'
                for (let i = 0; i < stars.length; i++) {
                    const s = stars[i]
                    const z = s.z + camZ
                    if (z >= fl) continue;
                    
                    const scale = fl / (fl - z)
                    const px = cx + (s.x - camX) * scale
                    const py = cy + (s.y - camY) * scale"""

content = content.replace(old_canvas_logic, new_canvas_logic)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
