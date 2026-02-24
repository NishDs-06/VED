import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
  VEDLogoCanvas — Digital Noise Edition

  Coordinate system: EVERYTHING is in viewport-absolute px.
  finalX/finalY = where the dot ends up on screen (centered VED)
  scatterX/scatterY = where the dot starts from (off-screen edge)
  chipX/chipY = chip morph target on screen

  No offset juggling — just draw at (d.x, d.y) directly.
*/

const GRID = 2

/* ── Font-sample → viewport-absolute dot positions ───────── */
function generateDots(vpW, vpH) {
    const spacing = 7

    // Max text region: 82% wide, 44% tall, centered at (50%, 38%)
    const maxW = vpW * 0.82
    const maxH = vpH * 0.44
    const cx = vpW / 2           // horizontal center
    const cy = vpH * 0.47        // vertical center — matches heroContent top:47%

    // Measure text at reference size
    const ref = document.createElement('canvas')
    const rctx = ref.getContext('2d')
    const refSize = 300
    ref.width = 3000; ref.height = 800
    rctx.font = `900 ${refSize}px "DM Mono", monospace`
    rctx.textBaseline = 'top'
    const rawW = rctx.measureText('VED').width
    const rawH = refSize * 1.05

    const scale = Math.min(maxW / rawW, maxH / rawH)
    const fontSize = Math.floor(refSize * scale)
    const textW = Math.ceil(rawW * scale)
    const textH = Math.ceil(fontSize * 1.1)

    // Draw text centred at (cx, cy)
    const drawX = cx - textW / 2
    const drawY = cy - textH / 2

    const off = document.createElement('canvas')
    off.width = textW
    off.height = textH
    const octx = off.getContext('2d')
    octx.fillStyle = '#fff'
    octx.font = `900 ${fontSize}px "DM Mono", monospace`
    octx.textBaseline = 'top'
    octx.fillText('VED', 0, fontSize * 0.05)
    const px = octx.getImageData(0, 0, textW, textH).data

    const dots = []

    for (let y = 0; y < textH; y += spacing) {
        for (let x = 0; x < textW; x += spacing) {
            const alpha = px[(y * textW + x) * 4 + 3]
            if (alpha < 40) continue

            const edgeFactor = alpha / 255
            const prob = 0.5 + edgeFactor * 0.38
            if (Math.random() > prob) continue

            // Viewport-absolute final position (grid-snapped)
            const fx = Math.round((drawX + x) / GRID) * GRID
            const fy = Math.round((drawY + y) / GRID) * GRID

            const t = Math.random()
            const shape = t < 0.45 ? 'circle' : t < 0.80 ? 'square' : 'speck'
            const ss = 0.55 + Math.random() * 0.65

            // Brightness: center brighter, edges dimmer
            const dx = (x - textW / 2) / (textW / 2)
            const dy = (y - textH / 2) / (textH / 2)
            const bri = Math.max(0.3, Math.min(1, edgeFactor * (1 - Math.hypot(dx, dy) * 0.22)))

            dots.push({
                finalX: fx, finalY: fy,
                scatterX: 0, scatterY: 0,   // set in build
                chipX: fx, chipY: fy,        // set in build
                shape, sizeScale: ss,
                brightness: bri,
                stagger: 0,
                phase: Math.random() * Math.PI * 2,
            })
        }
    }

    return { dots, textW, textH, drawX, drawY }
}

/* ── Chip layout: viewport-absolute positions ─────────────── */
function generateChipTargets(vpW, vpH, dotCount) {
    const chipW = vpW * 0.68
    const chipH = vpH * 0.70
    const L = (vpW - chipW) / 2
    const T = (vpH - chipH) / 2
    const R = L + chipW
    const B = T + chipH
    const s = 5

    const pos = []

    // Double outer border
    for (let x = L; x <= R; x += s) {
        pos.push({ x, y: T }, { x, y: B })
        if (x > L + s * 2 && x < R - s * 2) {
            pos.push({ x, y: T + s * 2 }, { x, y: B - s * 2 })
        }
    }
    for (let y = T; y <= B; y += s) {
        pos.push({ x: L, y }, { x: R, y })
        if (y > T + s * 2 && y < B - s * 2) {
            pos.push({ x: L + s * 2, y }, { x: R - s * 2, y })
        }
    }

    // Internal blocks (normalised to chip area)
    const blocks = [
        { x: 0.52, y: 0.06, w: 0.44, h: 0.50, d: 0.42 },
        { x: 0.04, y: 0.04, w: 0.44, h: 0.08, d: 0.52 },
        { x: 0.04, y: 0.15, w: 0.13, h: 0.50, d: 0.40 },
        { x: 0.21, y: 0.15, w: 0.27, h: 0.27, d: 0.30 },
        { x: 0.56, y: 0.60, w: 0.40, h: 0.33, d: 0.52 },
        { x: 0.04, y: 0.73, w: 0.48, h: 0.21, d: 0.40 },
        { x: 0.21, y: 0.46, w: 0.27, h: 0.23, d: 0.34 },
    ]
    for (const b of blocks) {
        const bx = L + b.x * chipW, by = T + b.y * chipH
        const bw = b.w * chipW, bh = b.h * chipH
        for (let x = 0; x <= bw; x += s) { pos.push({ x: bx + x, y: by }, { x: bx + x, y: by + bh }) }
        for (let y = 0; y <= bh; y += s) { pos.push({ x: bx, y: by + y }, { x: bx + bw, y: by + y }) }
        for (let y = s; y < bh; y += s)
            for (let x = s; x < bw; x += s)
                if (Math.random() < b.d) pos.push({ x: bx + x, y: by + y })
    }

    // Routing lines
    for (const ry of [0.13, 0.44, 0.60, 0.71]) {
        const ly = T + ry * chipH
        for (let x = L; x < R; x += s * 2) if (Math.random() < 0.5) pos.push({ x, y: ly })
    }
    for (const rx of [0.20, 0.50]) {
        const lx = L + rx * chipW
        for (let y = T; y < B; y += s * 2) if (Math.random() < 0.45) pos.push({ x: lx, y })
    }

    while (pos.length < dotCount) pos.push({ x: L + Math.random() * chipW, y: T + Math.random() * chipH })
    for (let i = pos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pos[i], pos[j]] = [pos[j], pos[i]]
    }
    return pos.slice(0, dotCount)
}

/* ── Draw one digital noise pixel ────────────────────────── */
function drawPixel(ctx, x, y, baseR, shape, sizeScale, bri, alpha) {
    if (alpha < 0.02) return
    const r = baseR * sizeScale
    const g = Math.round(178 + 72 * bri)
    ctx.globalAlpha = alpha
    ctx.fillStyle = `rgb(${g},${g},${g})`

    if (shape === 'circle') {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
        // Tiny inner highlight
        ctx.globalAlpha = alpha * 0.4
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(x, y, r * 0.36, 0, Math.PI * 2); ctx.fill()
    } else if (shape === 'square') {
        const h = r * 0.9; ctx.fillRect(x - h, y - h, h * 2, h * 2)
    } else {
        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5)
    }
    ctx.globalAlpha = 1
}

/* ═══════════════════════════════════════════════════════════ */
export default function VEDLogoCanvas({ heroRef, heroTextRef, scrollCueRef }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let dots = []
        let vpW = 0, vpH = 0, baseR = 0
        let rafId = null
        let alive = true
        let entryDone = false
        let entryProg = 0
        let scrollProg = 0
        let breathTween = null

        /* ── Build ─────────────────────────────────────────── */
        function build() {
            // Use hero element dimensions — matches actual CSS layout
            const hero = heroRef?.current
            vpW = hero ? hero.clientWidth : window.innerWidth
            vpH = hero ? hero.clientHeight : window.innerHeight

            const result = generateDots(vpW, vpH)
            dots = result.dots
            baseR = Math.max(1.5, 7 * 0.40)

            // Set scatter start positions (off-screen edges, viewport-absolute)
            dots.forEach(d => {
                const edge = Math.floor(Math.random() * 4)
                switch (edge) {
                    case 0: d.scatterX = d.finalX + (Math.random() - 0.5) * vpW * 0.7; d.scatterY = -60 - Math.random() * vpH * 0.4; break
                    case 1: d.scatterX = d.finalX + (Math.random() - 0.5) * vpW * 0.7; d.scatterY = vpH + 60 + Math.random() * vpH * 0.4; break
                    case 2: d.scatterX = -60 - Math.random() * vpW * 0.4; d.scatterY = d.finalY + (Math.random() - 0.5) * vpH * 0.4; break
                    default: d.scatterX = vpW + 60 + Math.random() * vpW * 0.4; d.scatterY = d.finalY + (Math.random() - 0.5) * vpH * 0.4; break
                }
                const dxC = d.finalX - vpW / 2
                const dyC = d.finalY - vpH * 0.47
                d.stagger = Math.hypot(dxC, dyC)
            })
            const maxD = Math.max(...dots.map(d => d.stagger), 1)
            dots.forEach(d => { d.stagger = (d.stagger / maxD) * 0.3 })

            // Chip morph targets
            const chipPos = generateChipTargets(vpW, vpH, dots.length)
            dots.forEach((d, i) => { d.chipX = chipPos[i].x; d.chipY = chipPos[i].y })

            // Canvas = exact hero element size, CSS pixels
            canvas.width = vpW
            canvas.height = vpH
            canvas.style.width = vpW + 'px'
            canvas.style.height = vpH + 'px'
        }

        /* ── Entry animation ───────────────────────────────── */
        function runEntry() {
            if (PRM) { entryProg = 1; entryDone = true; revealUI(); startBreathing(); return }
            entryProg = 0
            const p = { t: 0 }
            gsap.to(p, {
                t: 1, duration: 2.2, ease: 'power3.out', delay: 0.25,
                onUpdate() { entryProg = p.t },
                onComplete() { entryProg = 1; entryDone = true; revealUI(); startBreathing() },
            })
        }

        function revealUI() {
            const t = heroTextRef?.current
            const c = scrollCueRef?.current
            if (t) gsap.fromTo(t, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
            if (c) gsap.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.3 })
        }

        function startBreathing() {
            if (!PRM) breathTween = gsap.to(canvas, { opacity: 0.88, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }

        /* ── ScrollTrigger ─────────────────────────────────── */
        function setupScrollTrigger() {
            ScrollTrigger.create({
                trigger: heroRef?.current || '#hero',
                start: 'top top', end: '+=160%', scrub: 1.2, pin: true,
                onUpdate(self) {
                    scrollProg = self.progress
                    const t = heroTextRef?.current
                    const c = scrollCueRef?.current
                    if (self.progress > 0.03) {
                        const fade = Math.max(0, 1 - (self.progress - 0.03) / 0.10)
                        if (t) t.style.opacity = fade
                        if (c) c.style.opacity = 0
                    } else if (entryDone) {
                        if (t) t.style.opacity = 1
                        if (c) c.style.opacity = 1
                    }
                },
            })
        }

        /* ── RAF Loop ──────────────────────────────────────── */
        function loop(now) {
            if (!alive) return
            ctx.clearRect(0, 0, vpW, vpH)

            const sp = scrollProg
            const scan = (now * 0.00011) % 1   // diagonal scan, ~9s period

            for (const d of dots) {
                let x, y, alpha, bri

                if (!entryDone) {
                    // ── Entry: scatter → final ──
                    const rawP = (entryProg - d.stagger) / (1 - d.stagger)
                    const p = Math.max(0, Math.min(1, rawP))
                    x = d.scatterX + (d.finalX - d.scatterX) * p
                    y = d.scatterY + (d.finalY - d.scatterY) * p
                    alpha = p
                    bri = d.brightness
                } else {
                    alpha = 1
                    bri = d.brightness

                    if (sp < 0.02) {
                        // ── Idle: VED, subtle drift + shimmer ──
                        x = d.finalX + Math.sin(now * 0.0005 + d.phase) * 0.4
                        y = d.finalY + Math.cos(now * 0.00063 + d.phase) * 0.4

                        // Diagonal scan shimmer
                        const diagPos = (d.finalX / vpW * 0.6 + (1 - d.finalY / vpH) * 0.4)
                        const scanDist = Math.abs(diagPos - scan)
                        if (scanDist < 0.07) bri = Math.min(1, bri + (1 - scanDist / 0.07) * 0.55)

                    } else if (sp <= 0.14) {
                        // ── Phase 1: vibrate — sine-based, no random flicker ──
                        const amp = (sp / 0.14) * 4
                        x = d.finalX + Math.sin(now * 0.004 + d.phase) * amp
                        y = d.finalY + Math.cos(now * 0.005 + d.phase) * amp

                    } else if (sp <= 0.86) {
                        // ── Phase 2: morph VED → chip ──
                        const t = (sp - 0.14) / 0.72
                        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
                        x = d.finalX + (d.chipX - d.finalX) * ease
                        y = d.finalY + (d.chipY - d.finalY) * ease
                        bri = d.brightness + (1 - d.brightness) * ease * 0.45

                    } else {
                        // ── Phase 3: chip formed ──
                        x = d.chipX
                        y = d.chipY
                        bri = Math.min(1, d.brightness + 0.25)

                        const diagPos = (d.chipX / vpW * 0.6 + (1 - d.chipY / vpH) * 0.4)
                        const scanDist = Math.abs(diagPos - scan)
                        if (scanDist < 0.05) bri = Math.min(1, bri + (1 - scanDist / 0.05) * 0.38)
                    }
                }

                if (alpha < 0.02) continue
                drawPixel(ctx, x, y, baseR, d.shape, d.sizeScale, bri, alpha)
            }

            rafId = requestAnimationFrame(loop)
        }

        /* ── Visibility / Resize ───────────────────────────── */
        function onVis() {
            if (document.hidden) { alive = false; cancelAnimationFrame(rafId); breathTween?.pause() }
            else { alive = true; rafId = requestAnimationFrame(loop); breathTween?.resume() }
        }
        document.addEventListener('visibilitychange', onVis)

        let resizeTimer
        function onResize() {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => { build(); if (entryDone) entryProg = 1 }, 200)
        }
        window.addEventListener('resize', onResize)

        /* ── Boot ─────────────────────────────────────────── */
        async function boot() {
            await document.fonts.ready
            requestAnimationFrame(() => {
                build()
                setupScrollTrigger()
                rafId = requestAnimationFrame(loop)
                runEntry()
            })
        }
        boot()

        return () => {
            alive = false
            cancelAnimationFrame(rafId)
            breathTween?.kill()
            window.removeEventListener('resize', onResize)
            document.removeEventListener('visibilitychange', onVis)
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-label="VED dot-matrix logo"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'block',
                pointerEvents: 'none',
            }}
        />
    )
}