import { useEffect, useRef } from 'react'

/*
  SectionAtmosphere — full-viewport ambient glow layer
  Canvas is position:fixed so it always covers 100vw × 100vh
  regardless of any max-width constraint on the parent section.
  It only renders while its section is in the viewport.
*/

const IS_MOBILE = typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches

const GLOW_VARIANTS = {
    projects: [
        { cx: 0.05, cy: 0.20, rx: 0.38, ry: 0.30, col: 'rgba(123,47,255,', peak: 0.22, spd: 0.00020, ph: 0.0 },
        { cx: 0.95, cy: 0.10, rx: 0.35, ry: 0.28, col: 'rgba(88,28,220,', peak: 0.18, spd: 0.00018, ph: 2.1 },
        { cx: 0.50, cy: 0.85, rx: 0.55, ry: 0.35, col: 'rgba(109,40,217,', peak: 0.25, spd: 0.00013, ph: 1.4 },
        { cx: 0.88, cy: 0.60, rx: 0.28, ry: 0.30, col: 'rgba(139,92,246,', peak: 0.16, spd: 0.00022, ph: 3.0 },
    ],
    team: [
        { cx: 0.10, cy: 0.30, rx: 0.40, ry: 0.32, col: 'rgba(109,40,217,', peak: 0.20, spd: 0.00016, ph: 1.0 },
        { cx: 0.90, cy: 0.20, rx: 0.36, ry: 0.26, col: 'rgba(123,47,255,', peak: 0.18, spd: 0.00021, ph: 2.6 },
        { cx: 0.45, cy: 0.90, rx: 0.50, ry: 0.38, col: 'rgba(88,28,220,', peak: 0.22, spd: 0.00014, ph: 0.5 },
        { cx: 0.08, cy: 0.75, rx: 0.30, ry: 0.24, col: 'rgba(139,92,246,', peak: 0.15, spd: 0.00024, ph: 3.8 },
        { cx: 0.92, cy: 0.70, rx: 0.28, ry: 0.30, col: 'rgba(76,29,149,', peak: 0.14, spd: 0.00019, ph: 1.8 },
    ],
}

function makeParticles(W, H, count) {
    const out = []
    for (let i = 0; i < count; i++) {
        const dr = Math.random()
        const depth = dr < 0.55 ? 'far' : dr < 0.82 ? 'mid' : 'near'
        const cfg = {
            far: { rMin: 0.3, rMax: 0.8, opMin: 0.018, opMax: 0.055, spdMul: 0.18 },
            mid: { rMin: 0.6, rMax: 1.2, opMin: 0.030, opMax: 0.080, spdMul: 0.40 },
            near: { rMin: 1.0, rMax: 1.8, opMin: 0.050, opMax: 0.110, spdMul: 0.65 },
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

export default function SectionAtmosphere({ variant = 'projects', sectionRef }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const glows = GLOW_VARIANTS[variant] || GLOW_VARIANTS.projects

        let W = 0, H = 0, particles = [], rafId, alive = true

        function setup() {
            // Always use the full viewport — the canvas is position:fixed
            W = window.innerWidth
            H = window.innerHeight
            canvas.width = W
            canvas.height = H
            canvas.style.width = W + 'px'
            canvas.style.height = H + 'px'
            const count = IS_MOBILE ? 18 : 36
            particles = makeParticles(W, H, count)
        }

        function drawGlows(now) {
            for (const g of glows) {
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
                ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill()
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
                op *= p.twinkle
                    ? 0.6 + 0.4 * Math.sin(now * 0.0018 + p.phase)
                    : 0.75 + 0.25 * Math.sin(now * 0.0006 + p.phase)
                ctx.globalAlpha = op
                ctx.fillStyle = `rgb(${p.color})`
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
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

        // Only run the RAF while the section is visible — also hide the canvas
        // so the last painted frame doesn't bleed into adjacent sections
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                canvas.style.opacity = '1'
                if (!alive) { alive = true; rafId = requestAnimationFrame(loop) }
            } else {
                alive = false
                cancelAnimationFrame(rafId)
                canvas.style.opacity = '0'
                ctx.clearRect(0, 0, W, H)
            }
        }, { threshold: 0 })

        // Observe the section element (not the canvas, which is fixed)
        const sectionEl = sectionRef?.current
        if (sectionEl) observer.observe(sectionEl)

        function onVis() {
            if (document.hidden) { alive = false; cancelAnimationFrame(rafId) }
            else if (sectionEl && sectionEl.getBoundingClientRect().bottom > 0) {
                alive = true; rafId = requestAnimationFrame(loop)
            }
        }
        document.addEventListener('visibilitychange', onVis)

        let resizeTimer
        function onResize() {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(setup, 200)
        }
        window.addEventListener('resize', onResize)

        canvas.style.opacity = '0'
        canvas.style.transition = 'opacity 0.4s ease'

        document.fonts.ready.then(() => {
            requestAnimationFrame(() => { setup(); rafId = requestAnimationFrame(loop) })
        })

        return () => {
            alive = false
            cancelAnimationFrame(rafId)
            clearTimeout(resizeTimer)
            observer.disconnect()
            document.removeEventListener('visibilitychange', onVis)
            window.removeEventListener('resize', onResize)
        }
    }, [variant])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',   // breaks out of max-width container → full viewport
                top: 0,
                left: 0,
                zIndex: 0,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    )
}