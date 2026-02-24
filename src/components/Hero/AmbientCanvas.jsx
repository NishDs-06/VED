import { useEffect, useRef } from 'react'

/**
 * AmbientCanvas — Layer 2
 * Very subtle drifting particles. White only. Barely visible.
 * Slow motion. No flickering.
 */
export default function AmbientCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let particles = []
        let rafId = null
        let alive = true
        let W = 0, H = 0

        function setup() {
            const dpr = window.devicePixelRatio || 1
            W = window.innerWidth
            H = window.innerHeight
            canvas.width = Math.round(W * dpr)
            canvas.height = Math.round(H * dpr)
            canvas.style.width = W + 'px'
            canvas.style.height = H + 'px'
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        function spawn() {
            particles = []
            const count = window.innerWidth < 768 ? 28 : 55
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: 0.6 + Math.random() * 1.0,
                    vx: (Math.random() - 0.5) * 0.12,
                    vy: (Math.random() - 0.5) * 0.12,
                    phase: Math.random() * Math.PI * 2,
                    // max opacity 0.06 — barely visible
                    baseOp: 0.025 + Math.random() * 0.035,
                })
            }
        }

        function loop(now) {
            if (!alive) return
            ctx.clearRect(0, 0, W, H)

            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < -2) p.x = W + 2
                if (p.x > W + 2) p.x = -2
                if (p.y < -2) p.y = H + 2
                if (p.y > H + 2) p.y = -2

                // Slow sine variation — no per-frame Math.random()
                const op = p.baseOp * (0.7 + 0.3 * Math.sin(now * 0.0003 + p.phase))

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(229,231,235,${op.toFixed(3)})`
                ctx.fill()
            }

            // Edge vignette — keeps particles from crowding borders
            const cx = W / 2, cy = H / 2
            const grad = ctx.createRadialGradient(
                cx, cy, Math.min(W, H) * 0.30,
                cx, cy, Math.max(W, H) * 0.72
            )
            grad.addColorStop(0, 'rgba(0,0,0,1)')
            grad.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.globalCompositeOperation = 'destination-in'
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, W, H)
            ctx.globalCompositeOperation = 'source-over'

            rafId = requestAnimationFrame(loop)
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { alive = false; cancelAnimationFrame(rafId) }
            else { alive = true; rafId = requestAnimationFrame(loop) }
        })

        let resizeTimer
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => { setup(); spawn() }, 180)
        })

        setup()
        spawn()
        rafId = requestAnimationFrame(loop)

        return () => { alive = false; cancelAnimationFrame(rafId) }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'absolute',
                top: 0, left: 0,
                zIndex: 2,
                pointerEvents: 'none',
            }}
        />
    )
}
