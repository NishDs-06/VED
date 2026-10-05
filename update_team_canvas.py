import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Replace the useMemo for stars with Canvas logic inside useEffect
stars_pattern = r'const stars = useMemo.*?return field;\n    }, \[chunks\.length\]\);'
content = re.sub(stars_pattern, 'const camera = useRef({ z: 0 })', content, flags=re.DOTALL)

# Add canvasRef
content = content.replace('const chunkRefs    = useRef([])', 'const chunkRefs    = useRef([])\n    const canvasRef    = useRef(null)')

# Add canvas element
canvas_element = """
            <canvas 
                ref={canvasRef} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}
            />
"""
content = content.replace('<div className={styles.particles} />', '<div className={styles.particles} />' + canvas_element)

# Remove the DOM stars mapping
dom_stars_pattern = r'\{stars\.map\(star => \(.*?\)\)\}'
content = re.sub(dom_stars_pattern, '', content, flags=re.DOTALL)

# Update GSAP context to include camera animation and Canvas render loop
gsap_pattern = r'tl\.to\(stageRef\.current, \{.*?\+=0\x27\)'
def gsap_replace(match):
    original = match.group(0)
    # Add camera animation
    return original.replace('stageRef.current', 'stageRef.current') + '\n\n                tl.to(camera.current, {\n                    z: targetZ,\n                    duration: i === 0 ? 0.8 : 1.8,\n                    ease: \'power3.inOut\',\n                }, i === 0 ? \'-=0.2\' : \'+\')'.replace("'+'", "'<'")

content = re.sub(gsap_pattern, gsap_replace, content, flags=re.DOTALL)

# Add Canvas render loop inside useEffect
render_loop = """
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const stars = []
            const maxZ = 2000
            const minZ = -(chunks.length + 3) * DEPTH_STEP
            for (let i = 0; i < 4000; i++) {
                stars.push({
                    x: (Math.random() - 0.5) * 8000,
                    y: (Math.random() - 0.5) * 8000,
                    z: Math.random() * (maxZ - minZ) + minZ,
                    size: Math.random() > 0.90 ? Math.random() * 4 + 2 : Math.random() * 2 + 1,
                    opacity: Math.random() * 0.8 + 0.4
                })
            }

            let raf;
            const render = () => {
                if (!canvas) return;
                if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
                if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                const cx = canvas.width / 2
                const cy = canvas.height / 2
                const fl = 900 // matches CSS perspective
                const camZ = camera.current.z
                
                ctx.fillStyle = '#ffffff'
                for (let i = 0; i < stars.length; i++) {
                    const s = stars[i]
                    const z = s.z + camZ
                    if (z >= fl) continue;
                    
                    const scale = fl / (fl - z)
                    const px = cx + s.x * scale
                    const py = cy + s.y * scale
                    
                    if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) continue;
                    
                    ctx.globalAlpha = Math.max(0, Math.min(1, s.opacity * scale))
                    const r = s.size * scale * 0.5
                    
                    ctx.beginPath()
                    ctx.arc(px, py, Math.max(0.5, r), 0, Math.PI * 2)
                    ctx.fill()
                }
                raf = requestAnimationFrame(render)
            }
            raf = requestAnimationFrame(render)
"""

# Insert render_loop inside gsap.context, right before `tl.to(introTextRef.current`
content = content.replace('tl.to(introTextRef.current, {', render_loop + '\n            tl.to(introTextRef.current, {')

# Add cleanup for raf
content = content.replace('return () => ctx.revert()', 'return () => {\n            cancelAnimationFrame(raf)\n            ctx.revert()\n        }')

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)

