import { useEffect, useRef } from 'react'

/*
  HeroAtmosphere — ambient depth layer behind VED dots
  - 5 slow-breathing elliptical purple glows (BOOSTED opacity)
  - 3-layer depth particles (far/mid/near)
  - Accepts heroRef so it reads dimensions from the actual hero element
*/

const IS_MOBILE = typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches

const GLOW_DEFS = [
    // ── PREMIUM FIX: Reduced radius and opacity so the background stays mostly black
    // The glow should be a subtle white highlight, not a global wash.
    { cx: 0.12, cy: 0.18, rx: 0.40, ry: 0.35, col: '255,255,255', peak: 0.15, spd: 0.00018, ph: 0.0 },
    { cx: 0.88, cy: 0.14, rx: 0.35, ry: 0.30, col: '230,230,230', peak: 0.12, spd: 0.00022, ph: 1.8 },
    { cx: 0.50, cy: 0.75, rx: 0.55, ry: 0.40, col: '255,255,255', peak: 0.18, spd: 0.00015, ph: 3.2 },
    { cx: 0.08, cy: 0.92, rx: 0.30, ry: 0.25, col: '240,240,240', peak: 0.10, spd: 0.00025, ph: 0.9 },
    { cx: 0.92, cy: 0.55, rx: 0.35, ry: 0.35, col: '250,250,250', peak: 0.10, spd: 0.00020, ph: 2.4 },
]

// ── OPTIMIZATION: Pre-render glows to offscreen canvases ──
const GLOW_SPRITES = GLOW_DEFS.map(g => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 256
    const ctx = c.getContext('2d')
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, `rgba(${g.col}, 1)`)
    grad.addColorStop(0.4, `rgba(${g.col}, 0.4)`)
    grad.addColorStop(1, `rgba(${g.col}, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    return c
})

function makeParticles(W, H) {
    // ── PREMIUM FIX: Bringing back a richer sense of depth
    const count = IS_MOBILE ? 20 : 45 
    const out = []
    for (let i = 0; i < count; i++) {
        const dr = Math.random()
        const depth = dr < 0.50 ? 'far' : dr < 0.80 ? 'mid' : 'near'
        const cfg = {
            far: { rMin: 0.3, rMax: 0.8, opMin: 0.020, opMax: 0.050, spdMul: 0.05 },
            mid: { rMin: 0.6, rMax: 1.2, opMin: 0.035, opMax: 0.080, spdMul: 0.15 },
            near: { rMin: 1.0, rMax: 2.0, opMin: 0.050, opMax: 0.120, spdMul: 0.30 },
        }[depth]
        const r = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin)
        const baseOp = cfg.opMin + Math.random() * (cfg.opMax - cfg.opMin)
        // ── PREMIUM FIX: Drastically slower particles so they feel elegant, not chaotic.
        const speed = (0.005 + Math.random() * 0.015) * cfg.spdMul

        const angle = Math.random() * Math.PI * 2
        const pb = depth === 'far' ? 0 : depth === 'mid' ? 0.3 : 0.6
        const rc = Math.round(200 + (255 - 200) * pb)
        const gc = Math.round(200 + (255 - 200) * pb)
        const bc = Math.round(200 + (255 - 200) * pb)
        out.push({
            x: Math.random() * W, y: Math.random() * H,
            r, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            baseOp, phase: Math.random() * Math.PI * 2,
            twinkle: depth === 'near',
            color: `${rc},${gc},${bc}`,
        })
    }
    return out
}

export default function HeroAtmosphere({ heroRef }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let W = 0, H = 0, particles = [], rafId, alive = true

        function setup() {
            const hero = heroRef?.current
            W = hero ? hero.clientWidth : window.innerWidth
            H = hero ? hero.clientHeight : window.innerHeight
            canvas.width = W
            canvas.height = H
            canvas.style.width = W + 'px'
            canvas.style.height = H + 'px'
            particles = makeParticles(W, H)
        }

        function drawGlows(now) {
            ctx.globalCompositeOperation = 'screen'
            for (let i = 0; i < GLOW_DEFS.length; i++) {
                const g = GLOW_DEFS[i]
                const sprite = GLOW_SPRITES[i]
                const pulse = 0.5 + 0.5 * Math.sin(now * g.spd + g.ph)
                const opacity = g.peak * (0.55 + 0.45 * pulse)
                const cx = g.cx * W, cy = g.cy * H
                const rx = g.rx * W, ry = g.ry * H
                
                ctx.globalAlpha = opacity
                // Much faster: drawing a pre-rendered image instead of building a gradient on the CPU per frame
                ctx.drawImage(sprite, cx - rx, cy - ry, rx * 2, ry * 2)
            }
            ctx.globalCompositeOperation = 'source-over'
        }

        function drawParticles(now) {
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy
                if (p.x < -4) p.x = W + 4
                if (p.x > W + 4) p.x = -4
                if (p.y < -4) p.y = H + 4
                if (p.y > H + 4) p.y = -4

                let op = p.baseOp
                if (p.twinkle) {
                    op *= 0.8 + 0.6 * Math.sin(now * 0.0018 + p.phase)
                } else {
                    op *= 0.95 + 0.45 * Math.sin(now * 0.0006 + p.phase)
                }
                ctx.globalAlpha = Math.max(0, op)
                ctx.fillStyle = `rgb(${p.color})`
                // OPTIMIZATION: fillRect is massively faster than arc() and visually identical for small radii
                ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
            }
            ctx.globalAlpha = 1
        }

        function loop(now) {
            if (!alive) return
            ctx.clearRect(0, 0, W, H)
            drawGlows(now)
            drawParticles(now)
            rafId = requestAnimationFrame(loop)
        }

        function onVis() {
            if (document.hidden) { alive = false; cancelAnimationFrame(rafId) }
            else { alive = true; rafId = requestAnimationFrame(loop) }
        }
        document.addEventListener('visibilitychange', onVis)

        let resizeTimer
        function onResize() {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(setup, 200)
        }
        window.addEventListener('resize', onResize)

        document.fonts.ready.then(() => {
            requestAnimationFrame(() => {
                setup()
                rafId = requestAnimationFrame(loop)
            })
        })

        return () => {
            alive = false
            cancelAnimationFrame(rafId)
            clearTimeout(resizeTimer)
            document.removeEventListener('visibilitychange', onVis)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'absolute',
                top: 0, left: 0,
                // ── FIX: raised to z-index 2 so it sits above the base bg
                // but below the VED logo canvas (which is auto/3+)
                zIndex: 2,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    )
}