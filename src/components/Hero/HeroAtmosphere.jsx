import { useEffect, useRef } from 'react'

/*
  HeroAtmosphere — ambient depth layer behind VED dots
  - 5 slow-breathing elliptical purple glows
  - 3-layer depth particles (far/mid/near)
  - Accepts heroRef so it reads dimensions from the actual hero element
*/

const IS_MOBILE = typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches

const GLOW_DEFS = [
    { cx: 0.12, cy: 0.18, rx: 0.42, ry: 0.35, col: 'rgba(123,47,255,', peak: 0.10, spd: 0.00018, ph: 0.0 },
    { cx: 0.88, cy: 0.14, rx: 0.38, ry: 0.30, col: 'rgba(88,28,220,', peak: 0.08, spd: 0.00022, ph: 1.8 },
    { cx: 0.50, cy: 0.75, rx: 0.60, ry: 0.40, col: 'rgba(109,40,217,', peak: 0.12, spd: 0.00015, ph: 3.2 },
    { cx: 0.08, cy: 0.92, rx: 0.32, ry: 0.25, col: 'rgba(76,29,149,', peak: 0.07, spd: 0.00025, ph: 0.9 },
    { cx: 0.92, cy: 0.55, rx: 0.30, ry: 0.32, col: 'rgba(139,92,246,', peak: 0.07, spd: 0.00020, ph: 2.4 },
]

function makeParticles(W, H) {
    const count = IS_MOBILE ? 28 : 55
    const out = []
    for (let i = 0; i < count; i++) {
        const dr = Math.random()
        const depth = dr < 0.50 ? 'far' : dr < 0.80 ? 'mid' : 'near'
        const cfg = {
            far: { rMin: 0.3, rMax: 0.8, opMin: 0.020, opMax: 0.060, spdMul: 0.20 },
            mid: { rMin: 0.6, rMax: 1.2, opMin: 0.035, opMax: 0.090, spdMul: 0.45 },
            near: { rMin: 1.0, rMax: 2.0, opMin: 0.055, opMax: 0.130, spdMul: 0.70 },
        }[depth]
        const r = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin)
        const baseOp = cfg.opMin + Math.random() * (cfg.opMax - cfg.opMin)
        const speed = (0.04 + Math.random() * 0.08) * cfg.spdMul
        const angle = Math.random() * Math.PI * 2
        const pb = depth === 'far' ? 0 : depth === 'mid' ? 0.3 : 0.6
        const rc = Math.round(210 + (168 - 210) * pb)
        const gc = Math.round(210 + (85 - 210) * pb)
        const bc = Math.round(230 + (247 - 230) * pb)
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
            // Read from hero element if available — same as VEDLogoCanvas
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
            for (const g of GLOW_DEFS) {
                const pulse = 0.5 + 0.5 * Math.sin(now * g.spd + g.ph)
                const opacity = g.peak * (0.55 + 0.45 * pulse)
                const cx = g.cx * W, cy = g.cy * H
                const rx = g.rx * W, ry = g.ry * H

                ctx.save()
                ctx.translate(cx, cy)
                ctx.scale(rx, ry)
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
                grad.addColorStop(0, g.col + opacity + ')')
                grad.addColorStop(0.4, g.col + (opacity * 0.4) + ')')
                grad.addColorStop(1, g.col + '0)')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(0, 0, 1, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
            }
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
                    op *= 0.6 + 0.4 * Math.sin(now * 0.0018 + p.phase)
                } else {
                    op *= 0.75 + 0.25 * Math.sin(now * 0.0006 + p.phase)
                }
                ctx.globalAlpha = op
                ctx.fillStyle = `rgb(${p.color})`
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fill()
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

        // Wait for fonts + layout before reading dimensions
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
                zIndex: 1,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    )
}