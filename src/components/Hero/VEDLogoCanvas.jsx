import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
  VEDLogoCanvas — Two-phase renderer

  Phase A (sp 0 → 0.55):  Dots spell VED then morph into the chip footprint
  Phase B (sp 0.55 → 0.70): Crossfade — dots fade out, solid chip fades in
  Phase C (sp 0.70 → 1.0):  Solid canvas chip holds — crisp on every screen size

  The solid chip is drawn with real canvas geometry (filled rects, strokes,
  labels) so it looks identical and pixel-perfect on desktop AND mobile.
*/

const GRID = 2

// ── OPTIMIZATION: Cached sprites for dots. Replaces expensive path geometry.
const CIRCLE_SPRITE = document.createElement('canvas')
CIRCLE_SPRITE.width = 16
CIRCLE_SPRITE.height = 16
const cctx = CIRCLE_SPRITE.getContext('2d')
cctx.fillStyle = '#fff'
cctx.beginPath(); cctx.arc(8, 8, 8, 0, Math.PI * 2); cctx.fill()
// Shiny inner core
cctx.fillStyle = 'rgba(255,255,255,0.8)'
cctx.beginPath(); cctx.arc(8, 8, 3, 0, Math.PI * 2); cctx.fill()

const SQUARE_SPRITE = document.createElement('canvas')
SQUARE_SPRITE.width = 16
SQUARE_SPRITE.height = 16
const sctx = SQUARE_SPRITE.getContext('2d')
sctx.fillStyle = '#fff'
sctx.fillRect(0, 0, 16, 16)

/* ─── VED dot positions ─────────────────────────────────────── */
// ─────────────────────────────────────────────────────────────
// DROP-IN REPLACEMENT for the generateDots function in VEDLogoCanvas.jsx
// Find the existing generateDots function and replace it with this one.
//
// Changes:
//   - cy uses 0.44 on mobile (portrait) instead of 0.47 — sits more centred
//   - maxH uses 0.32 on mobile instead of 0.44 — prevents overflow on narrow screens
//   - maxW uses 0.88 on mobile instead of 0.82 — uses more horizontal space
// ─────────────────────────────────────────────────────────────

function generateDots(vpW, vpH) {
    const isMobileView = vpW < 768
    // ── PREMIUM FIX: Wider spacing. A sparse, intentional dot-matrix feels 
    // like an expensive mechanical interface. Dense dots feel like TV static.
    // ── PERFORMANCE FIX: Slightly increased to reduce overall dot count for a buttery smooth entrance.
    const spacing = isMobileView ? 9 : 13 

    // On mobile (portrait) the visual centre of the canvas feels higher
    // because the subtitle sits below — push VED up slightly less than desktop
    const cyFrac = isMobileView ? 0.44 : 0.47
    const maxWFrac = isMobileView ? 0.88 : 0.82
    const maxHFrac = isMobileView ? 0.30 : 0.44

    const maxW = vpW * maxWFrac
    const maxH = vpH * maxHFrac
    const cx = vpW / 2
    const cy = vpH * cyFrac

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
    const drawX = cx - textW / 2
    const drawY = cy - textH / 2

    const off = document.createElement('canvas')
    off.width = textW; off.height = textH
    const octx = off.getContext('2d')
    octx.fillStyle = '#fff'
    octx.font = `900 ${fontSize}px "DM Mono", monospace`
    octx.textBaseline = 'top'
    octx.fillText('VED', 0, fontSize * 0.05)
    const px = octx.getImageData(0, 0, textW, textH).data

    const dots = []
    for (let y = 0; y < textH; y += spacing) {
        for (let x = 0; x < textW; x += spacing) {
            const a = px[(y * textW + x) * 4 + 3]
            if (a < 40) continue
            const ef = a / 255
            if (Math.random() > 0.5 + ef * 0.38) continue
            const fx = Math.round((drawX + x) / GRID) * GRID
            const fy = Math.round((drawY + y) / GRID) * GRID
            const t = Math.random()
            const shape = t < 0.45 ? 'circle' : t < 0.80 ? 'square' : 'speck'
            const ss = 0.55 + Math.random() * 0.65
            const dx = (x - textW / 2) / (textW / 2)
            const dy = (y - textH / 2) / (textH / 2)
            const bri = Math.max(0.3, Math.min(1, ef * (1 - Math.hypot(dx, dy) * 0.22)))
            const isShiny = Math.random() < 0.03 // ✨ 3% of dots are shiny
            dots.push({
                finalX: fx, finalY: fy, scatterX: 0, scatterY: 0,
                chipX: 0, chipY: 0, shape, sizeScale: ss, brightness: bri,
                stagger: 0, phase: Math.random() * Math.PI * 2,
                mOffX: 0, mOffY: 0, isShiny
            })
        }
    }
    return { dots }
}

/* ─── Scatter targets: dot landing positions inside chip area ── */
function generateChipTargets(vpW, vpH, dotCount) {
    const size = Math.min(vpW * 0.55, vpH * 0.60)
    const cX = vpW / 2, cY = vpH / 2
    const L = cX - size / 2, T = cY - size / 2
    const s = 5
    const pos = []

    // Border
    for (let x = L; x <= L + size; x += s) { pos.push({ x, y: T }); pos.push({ x, y: T + size }) }
    for (let y = T; y <= T + size; y += s) { pos.push({ x: L, y }); pos.push({ x: L + size, y }) }

    // Interior block density
    const blocks = [
        { rx: 0.52, ry: 0.06, rw: 0.44, rh: 0.43, d: 0.50 },
        { rx: 0.04, ry: 0.06, rw: 0.44, rh: 0.09, d: 0.55 },
        { rx: 0.04, ry: 0.19, rw: 0.13, rh: 0.43, d: 0.42 },
        { rx: 0.21, ry: 0.19, rw: 0.27, rh: 0.27, d: 0.38 },
        { rx: 0.56, ry: 0.54, rw: 0.40, rh: 0.38, d: 0.48 },
        { rx: 0.04, ry: 0.72, rw: 0.48, rh: 0.22, d: 0.44 },
        { rx: 0.21, ry: 0.50, rw: 0.27, rh: 0.17, d: 0.35 },
    ]
    for (const b of blocks) {
        const bx = L + b.rx * size, by = T + b.ry * size
        const bw = b.rw * size, bh = b.rh * size
        for (let x = 0; x <= bw; x += s) { pos.push({ x: bx + x, y: by }); pos.push({ x: bx + x, y: by + bh }) }
        for (let y = 0; y <= bh; y += s) { pos.push({ x: bx, y: by + y }); pos.push({ x: bx + bw, y: by + y }) }
        for (let y = s; y < bh; y += s)
            for (let x = s; x < bw; x += s)
                if (Math.random() < b.d) pos.push({ x: bx + x, y: by + y })
    }

    while (pos.length < dotCount) pos.push({ x: L + Math.random() * size, y: T + Math.random() * size })
    for (let i = pos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pos[i], pos[j]] = [pos[j], pos[i]]
    }
    return pos.slice(0, dotCount)
}

/* ─── Rounded rect helper ────────────────────────────────────── */
function rrect(ctx, x, y, w, h, r) {
    const mr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + mr, y)
    ctx.lineTo(x + w - mr, y); ctx.arcTo(x + w, y, x + w, y + mr, mr)
    ctx.lineTo(x + w, y + h - mr); ctx.arcTo(x + w, y + h, x + w - mr, y + h, mr)
    ctx.lineTo(x + mr, y + h); ctx.arcTo(x, y + h, x, y + h - mr, mr)
    ctx.lineTo(x, y + mr); ctx.arcTo(x, y, x + mr, y, mr)
    ctx.closePath()
}

/* ─── SOLID CHIP RENDERER ────────────────────────────────────── */
function drawSolidChip(ctx, vpW, vpH, alpha, smirkPhase) {
    if (alpha < 0.01) return
    ctx.save()

    const size = Math.min(vpW * 0.55, vpH * 0.60)
    const cX = vpW / 2, cY = vpH / 2
    const L = cX - size / 2, T = cY - size / 2
    const R = L + size, B = T + size
    const pinLen = size * 0.065
    const pinW = size * 0.030
    const PINS = 7
    const chamfer = size * 0.052
    const pad = size * 0.10

    // ── PREMIUM FIX: Base substrate - Deep physical graphite, no purple wash ──
    ctx.globalAlpha = alpha
    const pkgGrad = ctx.createLinearGradient(L - pinLen, T - pinLen, R + pinLen, B + pinLen)
    pkgGrad.addColorStop(0, '#15161A')
    pkgGrad.addColorStop(0.4, '#101115')
    pkgGrad.addColorStop(0.7, '#131418')
    pkgGrad.addColorStop(1, '#0C0D10')
    ctx.fillStyle = pkgGrad
    rrect(ctx, L - pinLen, T - pinLen, size + pinLen * 2, size + pinLen * 2, chamfer)
    ctx.fill()

    // Outer border — Crisp structural silver
    ctx.globalAlpha = alpha
    const pkgBorder = ctx.createLinearGradient(L - pinLen, T - pinLen, R + pinLen, B + pinLen)
    pkgBorder.addColorStop(0, 'rgba(255,255,255,0.40)')  
    pkgBorder.addColorStop(0.35, 'rgba(255,255,255,0.15)')  
    pkgBorder.addColorStop(0.65, 'rgba(255,255,255,0.08)')
    pkgBorder.addColorStop(1, 'rgba(255,255,255,0.25)')  
    ctx.strokeStyle = pkgBorder
    ctx.lineWidth = 1.5
    rrect(ctx, L - pinLen, T - pinLen, size + pinLen * 2, size + pinLen * 2, chamfer)
    ctx.stroke()

    // ── Die body — Carbon core ──────────────────────────────────────────────
    ctx.globalAlpha = alpha
    const dieGrad = ctx.createLinearGradient(L, T, R, B)
    dieGrad.addColorStop(0, '#090A0D')
    dieGrad.addColorStop(0.5, '#060709')
    dieGrad.addColorStop(1, '#08090C')
    ctx.fillStyle = dieGrad
    ctx.beginPath(); ctx.rect(L, T, size, size); ctx.fill()

    // Die border — Laser cut silver
    ctx.globalAlpha = alpha
    const dieBorder = ctx.createLinearGradient(L, T, R, B)
    dieBorder.addColorStop(0, 'rgba(255,255,255,0.5)')
    dieBorder.addColorStop(0.5, 'rgba(255,255,255,0.1)')
    dieBorder.addColorStop(1, 'rgba(255,255,255,0.3)')
    ctx.strokeStyle = dieBorder
    ctx.lineWidth = 2.0
    ctx.beginPath(); ctx.rect(L, T, size, size); ctx.stroke()

    // ── Pins — metallic silver fill + purple stroke ───────────
    ctx.globalAlpha = alpha
    const pinSpan = size - pad * 2
    const pinStep = pinSpan / (PINS - 1)

    for (let i = 0; i < PINS; i++) {
        const t2 = pad + i * pinStep
        const configs = [
            { x: L + t2 - pinW / 2, y: T - pinLen, w: pinW, h: pinLen },
            { x: L + t2 - pinW / 2, y: B, w: pinW, h: pinLen },
            { x: L - pinLen, y: T + t2 - pinW / 2, w: pinLen, h: pinW },
            { x: R, y: T + t2 - pinW / 2, w: pinLen, h: pinW },
        ]
        for (const p of configs) {
            // Metallic silver-grey pin fill
            const pg = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h)
            pg.addColorStop(0, 'rgba(230,235,245,0.6)')
            pg.addColorStop(0.5, 'rgba(200,205,215,0.3)')
            pg.addColorStop(1, 'rgba(230,235,245,0.6)')
            ctx.fillStyle = pg
            ctx.strokeStyle = 'rgba(255,255,255,0.8)'
            ctx.lineWidth = 0.8
            ctx.beginPath(); ctx.rect(p.x, p.y, p.w, p.h)
            ctx.fill(); ctx.stroke()
        }
    }

    // ── PREMIUM FIX: Functional blocks — Structural silver wireframes, no muddy fills
    const BLOCKS = [
        { rx: 0.52, ry: 0.06, rw: 0.44, rh: 0.43, label: 'CPU CORE' },
        { rx: 0.04, ry: 0.06, rw: 0.44, rh: 0.09, label: 'SRAM' },
        { rx: 0.04, ry: 0.19, rw: 0.13, rh: 0.43, label: 'I/O' },
        { rx: 0.21, ry: 0.19, rw: 0.27, rh: 0.27, label: 'ALU' },
        { rx: 0.56, ry: 0.54, rw: 0.40, rh: 0.38, label: 'CACHE' },
        { rx: 0.04, ry: 0.72, rw: 0.48, rh: 0.22, label: 'PWR/CLK' },
        { rx: 0.21, ry: 0.50, rw: 0.27, rh: 0.17, label: 'CTRL' },
    ]

    for (const b of BLOCKS) {
        const bx = L + b.rx * size + 2, by = T + b.ry * size + 2
        const bw = b.rw * size - 4, bh = b.rh * size - 4

        ctx.globalAlpha = alpha * 0.03
        ctx.fillStyle = 'rgba(255,255,255,1)'
        ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill()

        ctx.globalAlpha = alpha * 0.25
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 1.0
        ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.stroke()

        if (bw > 28 && bh > 14) {
            const fs = Math.max(5.5, Math.min(8.5, bw * 0.11))
            ctx.globalAlpha = alpha * 0.90
            ctx.fillStyle = 'rgba(230,232,240,1)' // Stark white text
            ctx.font = `600 ${fs}px "DM Mono", monospace`
            ctx.textAlign = 'left'; ctx.textBaseline = 'top'
            ctx.fillText(b.label, bx + 5, by + 5)
        }
    }

    // ── PREMIUM FIX: The "Cool" Factor — Glowing Purple Laser Routing ──
    ctx.globalAlpha = alpha * 0.85
    ctx.strokeStyle = 'rgba(255,255,255,1)'
    ctx.shadowColor = 'rgba(255,255,255,0.8)'
    ctx.shadowBlur = 8
    ctx.lineWidth = 1.5

    // Draw some complex angular data pathways
    const traces = [
        [[0.17, 0.40], [0.17, 0.10], [0.48, 0.10]],
        [[0.48, 0.35], [0.52, 0.35]],
        [[0.21, 0.60], [0.17, 0.60], [0.17, 0.85], [0.52, 0.85], [0.52, 0.92]],
        [[0.48, 0.58], [0.52, 0.58]],
        [[0.04, 0.50], [0.10, 0.50], [0.10, 0.65], [0.21, 0.65]]
    ]
    
    for (const line of traces) {
        ctx.beginPath()
        for (let i = 0; i < line.length; i++) {
            const px = L + line[i][0] * size
            const py = T + line[i][1] * size
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.stroke()
        
        // Draw photon node at start and end
        ctx.fillStyle = '#FFFFFF'
        const start = line[0], end = line[line.length - 1]
        ctx.beginPath(); ctx.arc(L + start[0]*size, T + start[1]*size, 2, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(L + end[0]*size, T + end[1]*size, 2, 0, Math.PI*2); ctx.fill()
    }
    
    // Clear shadow for remainder
    ctx.shadowBlur = 0

    //     // ── SMIRK SHINE — Shimmering glass reflection ──
    if (alpha > 0.30) {
        const sp = smirkPhase % 1
        const diagLen = Math.hypot(size, size)
        const bandPos = sp * (diagLen + size * 0.5) - size * 0.25
        ctx.save()
        ctx.beginPath(); ctx.rect(L, T, size, size); ctx.clip()
        const normX = 1 / Math.SQRT2
        const normY = -1 / Math.SQRT2
        const bandCX = L + bandPos * normX
        const bandCY = B + bandPos * normY
        const halfW = size * 0.12

        const p1x = bandCX - normX * halfW, p1y = bandCY - normY * halfW
        const p2x = bandCX + normX * halfW, p2y = bandCY + normY * halfW

        const shineGrad = ctx.createLinearGradient(p1x, p1y, p2x, p2y)
        shineGrad.addColorStop(0, 'rgba(255,255,255,0)')
        shineGrad.addColorStop(0.40, 'rgba(255,255,255,0.05)')
        shineGrad.addColorStop(0.50, 'rgba(255,255,255,0.40)')   // peak — blinding white flash
        shineGrad.addColorStop(0.60, 'rgba(255,255,255,0.05)')
        shineGrad.addColorStop(1, 'rgba(255,255,255,0)')

        ctx.globalAlpha = alpha
        ctx.fillStyle = shineGrad
        ctx.fillRect(L - size, T - size, size * 3, size * 3)
        ctx.restore()
    }

    ctx.restore()
}

/* ─── Dot pixel renderer (OPTIMIZED) ────────────────────────── */
function drawPixel(ctx, x, y, baseR, shape, sizeScale, bri, alpha) {
    if (alpha < 0.02) return
    const r = baseR * sizeScale
    const d = r * 2
    
    // Convert brightness to alpha scale on a white sprite
    // This allows us to use one white sprite for all brightness levels
    const g = 178 + 72 * bri
    const brightnessAlpha = g / 255
    ctx.globalAlpha = alpha * brightnessAlpha
    
    if (shape === 'circle') {
        ctx.drawImage(CIRCLE_SPRITE, x - r, y - r, d, d)
    } else if (shape === 'square') {
        const h = r * 0.9
        ctx.drawImage(SQUARE_SPRITE, x - h, y - h, h * 2, h * 2)
    } else {
        ctx.fillStyle = '#fff'
        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5)
    }
    ctx.globalAlpha = 1
}

/* ══════════════════════════════════════════════════════════════ */
export default function VEDLogoCanvas({ heroRef, heroTextRef, scrollCueRef }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let dots = []
        let vpW = 0, vpH = 0, baseR = 0
        let rafId = null, alive = true
        let entryDone = false, entryProg = 0, scrollProg = 0
        let breathTween = null
        let chipAlpha = 0, dotAlpha = 1

        let mouseX = -1000, mouseY = -1000, isHovering = false
        function onPointerMove(e) {
            if (!canvasRef.current) return
            const rect = canvasRef.current.getBoundingClientRect()
            mouseX = e.clientX - rect.left
            mouseY = e.clientY - rect.top
            isHovering = true
        }
        window.addEventListener('pointermove', onPointerMove)

        /* ── Build ─────────────────────────────────────────── */
        function build() {
            const hero = heroRef?.current
            vpW = hero ? hero.clientWidth : window.innerWidth
            vpH = hero ? hero.clientHeight : window.innerHeight

            const { dots: d } = generateDots(vpW, vpH)
            dots = d
            baseR = Math.max(1.5, 7 * 0.40)

            dots.forEach(dot => {
                const edge = Math.floor(Math.random() * 4)
                switch (edge) {
                    case 0: dot.scatterX = dot.finalX + (Math.random() - .5) * vpW * .7; dot.scatterY = -60 - Math.random() * vpH * .4; break
                    case 1: dot.scatterX = dot.finalX + (Math.random() - .5) * vpW * .7; dot.scatterY = vpH + 60 + Math.random() * vpH * .4; break
                    case 2: dot.scatterX = -60 - Math.random() * vpW * .4; dot.scatterY = dot.finalY + (Math.random() - .5) * vpH * .4; break
                    default: dot.scatterX = vpW + 60 + Math.random() * vpW * .4; dot.scatterY = dot.finalY + (Math.random() - .5) * vpH * .4; break
                }
                const dxC = dot.finalX - vpW / 2, dyC = dot.finalY - vpH * .47
                dot.stagger = Math.hypot(dxC, dyC)
            })
            const maxD = Math.max(...dots.map(d => d.stagger), 1)
            dots.forEach(d => { d.stagger = (d.stagger / maxD) * 0.3 })

            const chipPos = generateChipTargets(vpW, vpH, dots.length)
            dots.forEach((d, i) => { d.chipX = chipPos[i].x; d.chipY = chipPos[i].y })

            canvas.width = vpW; canvas.height = vpH
            canvas.style.width = vpW + 'px'; canvas.style.height = vpH + 'px'
        }

        /* ── Entry ─────────────────────────────────────────── */
        function runEntry() {
            if (PRM) { entryProg = 1; entryDone = true; revealUI(); startBreathing(); return }
            const p = { t: 0 }
            gsap.to(p, {
                t: 1, duration: 2.2, ease: 'power3.out', delay: 0.25,
                onUpdate() { entryProg = p.t },
                onComplete() { entryProg = 1; entryDone = true; revealUI(); startBreathing() },
            })
        }
        function revealUI() {
            const t = heroTextRef?.current, c = scrollCueRef?.current
            // ── PREMIUM FIX: Choreographed sequence. Stagger the lines of text.
            if (t && t.children) {
                gsap.set(t, { autoAlpha: 1 }) // Make container visible
                gsap.fromTo(t.children, 
                    { autoAlpha: 0, y: 20 }, 
                    { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'expo.out' }
                )
            }
            if (c) gsap.fromTo(c, { autoAlpha: 0, y: -15 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'expo.out', delay: 0.5 })
        }
        function startBreathing() {
            if (!PRM) breathTween = gsap.to(canvas, { opacity: 0.88, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }

        /* ── ScrollTrigger ─────────────────────────────────── */
        let heroST = null
        function setupScrollTrigger() {
            const heroEl = heroRef?.current
            ScrollTrigger.create({
                trigger: heroEl || '#hero',
                start: 'top top', end: '+=380%', scrub: 1.2, pin: true, refreshPriority: 2,
                onUpdate(self) {
                    scrollProg = self.progress
                    const t = heroTextRef?.current, c = scrollCueRef?.current

                    if (self.progress > 0.03) {
                        const fade = Math.max(0, 1 - (self.progress - 0.03) / 0.10)
                        if (t) t.style.opacity = fade
                        if (c) c.style.opacity = 0
                    } else if (entryDone) {
                        if (t) t.style.opacity = 1
                        if (c) c.style.opacity = 1
                    }

                    const chipLabel = document.getElementById('chip-label')
                    if (chipLabel) {
                        chipLabel.style.opacity = self.progress > 0.72
                            ? String(Math.min(1, (self.progress - 0.72) / 0.08) * 0.55) : '0'
                    }

                    // Crossfade window: sp 0.55 → 0.70
                    if (self.progress < 0.55) {
                        dotAlpha = 1; chipAlpha = 0
                    } else if (self.progress < 0.70) {
                        const t2 = (self.progress - 0.55) / 0.15
                        const ease = t2 < 0.5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2
                        dotAlpha = 1 - ease
                        chipAlpha = ease
                    } else {
                        dotAlpha = 0; chipAlpha = 1
                    }
                },
            })
            // ── PREMIUM FIX: Deterministic sync
            // Notify downstream components (like Domains) that our massive pin-spacer 
            // is now in the DOM so they can calculate their offsets accurately.
            window.dispatchEvent(new Event('hero-st-ready'))
        }

        /* ── RAF loop ──────────────────────────────────────── */
        // Detect mobile once — reduce vibrate amplitude on touch screens
        const isMobile = window.matchMedia('(pointer: coarse)').matches

        function loop(now) {
            if (!alive) return
            ctx.clearRect(0, 0, vpW, vpH)
            const sp = scrollProg
            // Smirk phase: one full sweep every ~6 seconds
            const smirk = (now * 0.000165) % 1

            // Draw dots
            if (dotAlpha > 0.01) {
                for (const d of dots) {
                    let x, y, alpha, bri
                    if (!entryDone) {
                        const rawP = (entryProg - d.stagger) / (1 - d.stagger)
                        const p = Math.max(0, Math.min(1, rawP))
                        x = d.scatterX + (d.finalX - d.scatterX) * p
                        y = d.scatterY + (d.finalY - d.scatterY) * p
                        alpha = p * dotAlpha; bri = d.brightness
                    } else {
                        bri = d.brightness
                        
                        // ✨ Premium Twinkle Effect
                        if (d.isShiny) {
                            bri = bri + Math.max(0, Math.sin(now * 0.003 + d.phase)) * 0.8
                        }

                        if (sp < 0.02) {
                            x = d.finalX + Math.sin(now * .0005 + d.phase) * .4
                            y = d.finalY + Math.cos(now * .00063 + d.phase) * .4
                            const diagPos = (d.finalX / vpW * .6 + (1 - d.finalY / vpH) * .4)
                            const dist = Math.abs(diagPos - smirk)
                            if (dist < 0.07) bri = Math.min(1, bri + (1 - dist / 0.07) * .55)
                            alpha = dotAlpha
                        } else if (sp <= 0.08) {
                            // Mobile: tiny 0.6px max, desktop: 2.2px max — no jitter
                            const maxAmp = isMobile ? 0.6 : 2.2
                            const amp = (sp / 0.08) * maxAmp
                            x = d.finalX + Math.sin(now * .004 + d.phase) * amp
                            y = d.finalY + Math.cos(now * .005 + d.phase) * amp
                            alpha = dotAlpha
                        } else if (sp <= 0.60) {
                            const t2 = (sp - 0.08) / 0.52
                            const ease = t2 < .5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2
                            x = d.finalX + (d.chipX - d.finalX) * ease
                            y = d.finalY + (d.chipY - d.finalY) * ease
                            bri = d.brightness + (1 - d.brightness) * ease * .45
                            alpha = dotAlpha
                        } else {
                            x = d.chipX; y = d.chipY
                            bri = Math.min(1, d.brightness * 1.8 + .15)
                            alpha = dotAlpha
                        }
                    }

                    // 💥 Splash Effect: Spring Mouse Repulsion
                    let targetOffX = 0, targetOffY = 0
                    if (isHovering && entryDone && alpha > 0.1) {
                        const dx = x - mouseX
                        const dy = y - mouseY
                        const dist = Math.hypot(dx, dy)
                        if (dist < 100 && dist > 0.1) {
                            const force = Math.pow((100 - dist) / 100, 2) // Quadratic falloff for natural feel
                            targetOffX = (dx / dist) * force * 35
                            targetOffY = (dy / dist) * force * 35
                        }
                    }
                    if (Math.abs(d.mOffX) > 0.05 || Math.abs(d.mOffY) > 0.05 || targetOffX !== 0 || targetOffY !== 0) {
                        d.mOffX += (targetOffX - d.mOffX) * 0.12
                        d.mOffY += (targetOffY - d.mOffY) * 0.12
                        x += d.mOffX
                        y += d.mOffY
                    } else {
                        d.mOffX = 0
                        d.mOffY = 0
                    }

                    if (alpha < 0.02) continue
                    drawPixel(ctx, x, y, baseR, d.shape, d.sizeScale, bri, alpha)
                }
            }

            // Draw solid chip
            if (chipAlpha > 0.01) drawSolidChip(ctx, vpW, vpH, chipAlpha, smirk)

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

        /* ── Boot ──────────────────────────────────────────── */
        async function boot() {
            await document.fonts.ready
            requestAnimationFrame(() => {
                build(); setupScrollTrigger()
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
            window.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('visibilitychange', onVis)
            heroST?.kill()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-label="VED dot-matrix logo"
            style={{ position: 'absolute', top: 0, left: 0, display: 'block', pointerEvents: 'none' }}
        />
    )
}