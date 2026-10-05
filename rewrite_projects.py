import re

with open('src/components/Projects/Projects.jsx', 'r') as f:
    content = f.read()

# 1. Add star logic to Projects.jsx
stars_logic = """    const canvasRef = useRef(null)
    const camera = useRef({ x: 0, y: 0, z: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx2d = canvas.getContext('2d', { alpha: false })
        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        const stars = []
        for (let i = 0; i < 4000; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 4000,
                y: (Math.random() - 0.5) * 4000,
                z: Math.random() * 4000,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random()
            })
        }

        const dotCanvas = document.createElement('canvas')
        dotCanvas.width = 16
        dotCanvas.height = 16
        const dotCtx = dotCanvas.getContext('2d')
        dotCtx.fillStyle = '#ffffff'
        dotCtx.beginPath()
        dotCtx.arc(8, 8, 8, 0, Math.PI * 2)
        dotCtx.fill()

        let raf;
        const render = () => {
            ctx2d.fillStyle = '#000000'
            ctx2d.fillRect(0, 0, width, height)

            const cx = width / 2
            const cy = height / 2
            const fl = 800
            const camZ = camera.current.z

            // Continuous slow forward drift even when not scrolling
            camera.current.z += 0.5;

            ctx2d.fillStyle = '#ffffff'
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]
                
                // Wrap stars so they loop endlessly
                let z = s.z - camZ
                while (z < -100) z += 4000;
                while (z > 3900) z -= 4000;
                
                if (z >= fl) continue;

                const scale = fl / (fl - z)
                const px = cx + s.x * scale
                const py = cy + s.y * scale

                if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) continue;

                ctx2d.globalAlpha = Math.max(0, Math.min(1, s.opacity * scale))
                const r = s.size * scale * 0.5
                const size = Math.max(1, r * 2)
                ctx2d.drawImage(dotCanvas, 0, 0, 16, 16, px - r, py - r, size, size)
            }
            raf = requestAnimationFrame(render)
        }
        raf = requestAnimationFrame(render)

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(raf)
        }
    }, [])"""

# Inject stars logic
content = content.replace("const itemsRef = useRef([])", "const itemsRef = useRef([])\n" + stars_logic)

# Add canvas element to JSX
canvas_jsx = """        <section className={styles.section} id="projects" ref={containerRef}>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />"""
content = content.replace('<section className={styles.section} id="projects" ref={containerRef}>', canvas_jsx)

# Update GSAP timeline
old_gsap = """        tl.to(introRef.current, {
            opacity: 0,
            scale: 1.1,
            y: -50,
            duration: 1,
            ease: 'power2.inOut'
        })
        
        tl.fromTo(listRef.current, {
            opacity: 0,
            y: 50,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.5')"""

new_gsap = """        // Fly camera through stars on scroll
        tl.to(camera.current, {
            z: '+=2000', // Move 2000px forward on scroll
            duration: 2,
            ease: 'power2.inOut'
        })

        // Fade out intro like a cinematic flight
        tl.to(introRef.current, {
            opacity: 0,
            scale: 1.5, // Fly towards screen
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power2.in'
        }, 0)
        
        // Staggered reveal of list items from lower middle
        tl.fromTo(itemsRef.current, {
            opacity: 0,
            y: 150,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        }, 0.5)"""

content = content.replace(old_gsap, new_gsap)
# Increase ScrollTrigger end to give more time for stagger
content = content.replace("end: '+=100%',", "end: '+=150%',")

with open('src/components/Projects/Projects.jsx', 'w') as f:
    f.write(content)
