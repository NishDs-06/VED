import { useEffect, useRef } from 'react'

/**
 * AmbientCanvas — Layer 2
 * 65–80 drifting particles. Separate canvas element.
 * Key fix: uses setTransform once then never again in the loop.
 * Pauses via Page Visibility API.
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
        let W = 0, H = 0, dprW = 0, dprH = 0

        function setup() {
            const dpr = window.devicePixelRatio || 1
            W = window.innerWidth
            H = window.innerHeight
            dprW = Math.round(W * dpr)
            dprH = Math.round(H * dpr)

            canvas.width = dprW
            canvas.height = dprH
            canvas.style.width = W + 'px'
            canvas.style.height = H + 'px'

            // Reset transform to identity first, then apply dpr scale
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        function spawn() {
            particles = []
            const count = window.innerWidth < 768 ? 35 : 75
            for (let i = 0; i < count; i++) {
                const isBlue = Math.random() > 0.55
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: 0.7 + Math.random() * 1.3,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    color: isBlue ? '0,194,255' : '30,240,144',
                    op: isBlue ? (0.08 + Math.random() * 0.10) : (0.06 + Math.random() * 0.08),
                })
            }
        }

        function loop() {
            if (!alive) return
            ctx.clearRect(0, 0, W, H)

            /* Draw particles */
            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < -2) p.x = W + 2
                if (p.x > W + 2) p.x = -2
                if (p.y < -2) p.y = H + 2
                if (p.y > H + 2) p.y = -2

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${p.color},${p.op.toFixed(3)})`
                ctx.fill()
            }

            /* Edge vignette — radial gradient masks out particles near viewport edges
               so they can't accumulate and glow at the border.
               'destination-in' clips existing content (particles) by the gradient alpha. */
            const cx = W / 2, cy = H / 2
            const grad = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.30, cx, cy, Math.max(W, H) * 0.72)
            grad.addColorStop(0, 'rgba(0,0,0,1)')   // fully opaque center: keep particles
            grad.addColorStop(1, 'rgba(0,0,0,0)')   // transparent at edges: erase particles
            ctx.globalCompositeOperation = 'destination-in'
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, W, H)
            ctx.globalCompositeOperation = 'source-over'   // restore default

            rafId = requestAnimationFrame(loop)
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                alive = false
                cancelAnimationFrame(rafId)
            } else {
                alive = true
                rafId = requestAnimationFrame(loop)
            }
        })

        let resizeTimer
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                setup()
                spawn()
            }, 180)
        })

        setup()
        spawn()
        loop()

        return () => {
            alive = false
            cancelAnimationFrame(rafId)
        }
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
                overflow: 'hidden',
            }}
        />
    )
}
