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

/* ─── VED dot positions ─────────────────────────────────────── */
function generateDots(vpW, vpH) {
    const spacing = 7
    const maxW = vpW * 0.82, maxH = vpH * 0.44
    const cx = vpW / 2, cy = vpH * 0.47

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
    const drawX = cx - textW / 2, drawY = cy - textH / 2

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
            const dx = (x - textW / 2) / (textW / 2), dy = (y - textH / 2) / (textH / 2)
            const bri = Math.max(0.3, Math.min(1, ef * (1 - Math.hypot(dx, dy) * 0.22)))
            dots.push({
                finalX: fx, finalY: fy, scatterX: 0, scatterY: 0,
                chipX: 0, chipY: 0, shape, sizeScale: ss, brightness: bri,
                stagger: 0, phase: Math.random() * Math.PI * 2
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

    // ── Package body — dark with subtle silver sheen ──────────
    // Base fill
    ctx.globalAlpha = alpha
    const pkgGrad = ctx.createLinearGradient(L - pinLen, T - pinLen, R + pinLen, B + pinLen)
    pkgGrad.addColorStop(0, '#0e0a1a')
    pkgGrad.addColorStop(0.4, '#0b0816')
    pkgGrad.addColorStop(0.7, '#110d1f')
    pkgGrad.addColorStop(1, '#0a0714')
    ctx.fillStyle = pkgGrad
    rrect(ctx, L - pinLen, T - pinLen, size + pinLen * 2, size + pinLen * 2, chamfer)
    ctx.fill()

    // Silver outer border — bolder, metallic
    ctx.globalAlpha = alpha
    const pkgBorder = ctx.createLinearGradient(L - pinLen, T - pinLen, R + pinLen, B + pinLen)
    pkgBorder.addColorStop(0, 'rgba(200,200,220,0.70)')  // silver top-left
    pkgBorder.addColorStop(0.35, 'rgba(168, 85,247,0.65)')  // purple mid
    pkgBorder.addColorStop(0.65, 'rgba(120,100,180,0.55)')
    pkgBorder.addColorStop(1, 'rgba(160,160,190,0.50)')  // silver bottom-right
    ctx.strokeStyle = pkgBorder
    ctx.lineWidth = 2.0
    rrect(ctx, L - pinLen, T - pinLen, size + pinLen * 2, size + pinLen * 2, chamfer)
    ctx.stroke()

    // Inner package ring — faint silver
    ctx.globalAlpha = alpha * 0.35
    ctx.strokeStyle = 'rgba(200,200,220,0.30)'
    ctx.lineWidth = 0.8
    rrect(ctx, L - pinLen + 6, T - pinLen + 6, size + pinLen * 2 - 12, size + pinLen * 2 - 12, chamfer - 4)
    ctx.stroke()

    // ── Die body ──────────────────────────────────────────────
    ctx.globalAlpha = alpha
    const dieGrad = ctx.createLinearGradient(L, T, R, B)
    dieGrad.addColorStop(0, '#0f0b1e')
    dieGrad.addColorStop(0.5, '#0b0718')
    dieGrad.addColorStop(1, '#100c1c')
    ctx.fillStyle = dieGrad
    ctx.beginPath(); ctx.rect(L, T, size, size); ctx.fill()

    // Die border — bolder silver-to-purple
    ctx.globalAlpha = alpha
    const dieBorder = ctx.createLinearGradient(L, T, R, B)
    dieBorder.addColorStop(0, 'rgba(210,210,230,0.85)')
    dieBorder.addColorStop(0.4, 'rgba(168, 85,247,0.75)')
    dieBorder.addColorStop(1, 'rgba(180,160,220,0.65)')
    ctx.strokeStyle = dieBorder
    ctx.lineWidth = 2.2
    ctx.beginPath(); ctx.rect(L, T, size, size); ctx.stroke()

    // Die inner border — subtle
    ctx.globalAlpha = alpha * 0.28
    ctx.strokeStyle = 'rgba(200,200,220,0.4)'
    ctx.lineWidth = 0.6
    ctx.beginPath(); ctx.rect(L + 7, T + 7, size - 14, size - 14); ctx.stroke()

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
            pg.addColorStop(0, 'rgba(180,175,200,0.35)')
            pg.addColorStop(0.5, 'rgba(140,130,170,0.20)')
            pg.addColorStop(1, 'rgba(180,175,200,0.30)')
            ctx.fillStyle = pg
            ctx.strokeStyle = 'rgba(190,180,210,0.70)'
            ctx.lineWidth = 1.0
            ctx.beginPath(); ctx.rect(p.x, p.y, p.w, p.h)
            ctx.fill(); ctx.stroke()
        }
    }

    // ── Functional blocks ─────────────────────────────────────
    const BLOCKS = [
        { rx: 0.52, ry: 0.06, rw: 0.44, rh: 0.43, label: 'CPU CORE', fillA: 0.22, borderA: 0.55 },
        { rx: 0.04, ry: 0.06, rw: 0.44, rh: 0.09, label: 'SRAM', fillA: 0.24, borderA: 0.50 },
        { rx: 0.04, ry: 0.19, rw: 0.13, rh: 0.43, label: 'I/O', fillA: 0.14, borderA: 0.45 },
        { rx: 0.21, ry: 0.19, rw: 0.27, rh: 0.27, label: 'ALU', fillA: 0.18, borderA: 0.50 },
        { rx: 0.56, ry: 0.54, rw: 0.40, rh: 0.38, label: 'CACHE', fillA: 0.20, borderA: 0.50 },
        { rx: 0.04, ry: 0.72, rw: 0.48, rh: 0.22, label: 'PWR / CLK', fillA: 0.16, borderA: 0.44 },
        { rx: 0.21, ry: 0.50, rw: 0.27, rh: 0.17, label: 'CTRL', fillA: 0.14, borderA: 0.44 },
    ]

    for (const b of BLOCKS) {
        const bx = L + b.rx * size + 2, by = T + b.ry * size + 2
        const bw = b.rw * size - 4, bh = b.rh * size - 4

        ctx.globalAlpha = alpha * b.fillA
        ctx.fillStyle = 'rgba(168,85,247,1)'
        ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill()

        ctx.globalAlpha = alpha * b.borderA
        ctx.strokeStyle = 'rgba(180,160,220,0.9)'
        ctx.lineWidth = 1.0
        ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.stroke()

        if (bw > 28 && bh > 14) {
            const fs = Math.max(5.5, Math.min(8.5, bw * 0.11))
            ctx.globalAlpha = alpha * 0.60
            ctx.fillStyle = 'rgba(200,185,240,1)'
            ctx.font = `500 ${fs}px "DM Mono", monospace`
            ctx.textAlign = 'left'; ctx.textBaseline = 'top'
            ctx.fillText(b.label, bx + 4, by + 4)
        }
    }

    // ── Internal routing traces ───────────────────────────────
    ctx.globalAlpha = alpha * 0.28
    ctx.strokeStyle = 'rgba(200,200,220,0.55)'
    ctx.lineWidth = 0.7
    const hBuses = [0.17, 0.49, 0.54, 0.73]
    for (const ry of hBuses) {
        const ly = T + ry * size
        ctx.beginPath(); ctx.moveTo(L + 4, ly); ctx.lineTo(R - 4, ly); ctx.stroke()
    }
    ctx.globalAlpha = alpha * 0.22
    const vBuses = [0.20, 0.50, 0.56]
    for (const rx of vBuses) {
        const lx = L + rx * size
        ctx.beginPath(); ctx.moveTo(lx, T + 4); ctx.lineTo(lx, B - 4); ctx.stroke()
    }

    // ── Pin-1 notch — silver dot ───────────────────────────────
    ctx.globalAlpha = alpha * 0.90
    ctx.fillStyle = 'rgba(210,205,230,0.95)'
    ctx.beginPath()
    ctx.arc(L + size * 0.055, T + size * 0.055, size * 0.020, 0, Math.PI * 2)
    ctx.fill()

    // ── Corner registration marks — bolder ────────────────────
    ctx.globalAlpha = alpha * 0.55
    ctx.strokeStyle = 'rgba(200,195,225,0.85)'
    ctx.lineWidth = 1.2
    const cmSize = size * 0.046
    const corners2 = [[L, T], [R, T], [L, B], [R, B]]
    const offsets2 = [[1, 1], [-1, 1], [1, -1], [-1, -1]]
    for (let i = 0; i < 4; i++) {
        const [cx2, cy2] = corners2[i], [ox, oy] = offsets2[i]
        ctx.beginPath()
        ctx.moveTo(cx2 + ox * cmSize, cy2)
        ctx.lineTo(cx2, cy2)
        ctx.lineTo(cx2, cy2 + oy * cmSize)
        ctx.stroke()
    }

    // ── SMIRK SHINE — diagonal glint from bottom-left → top-right ──
    // A narrow bright band sweeping diagonally, like light catching a chip edge
    if (alpha > 0.30) {
        // smirkPhase: 0→1 over ~6s, repeating
        const sp = smirkPhase % 1
        // Band travels from (L, B) corner to (R, T) corner
        // Parameterise as a diagonal slice: offset along the BL→TR diagonal
        const diagLen = Math.hypot(size, size)           // diagonal length
        const bandPos = sp * (diagLen + size * 0.5) - size * 0.25  // current offset along diagonal

        // The shine is a thin perpendicular band across the die
        // We clip to the die rect first
        ctx.save()
        ctx.beginPath(); ctx.rect(L, T, size, size); ctx.clip()

        // Perpendicular to BL→TR diagonal means direction (-1, -1) normalised
        // Band centre point along the diagonal from BL
        const normX = 1 / Math.SQRT2
        const normY = -1 / Math.SQRT2   // diagonal from BL to TR
        const bandCX = L + bandPos * normX
        const bandCY = B + bandPos * normY

        const halfW = size * 0.09   // band half-width (thin glint)

        const p1x = bandCX - normX * halfW, p1y = bandCY - normY * halfW
        const p2x = bandCX + normX * halfW, p2y = bandCY + normY * halfW

        const shineGrad = ctx.createLinearGradient(p1x, p1y, p2x, p2y)
        shineGrad.addColorStop(0, 'rgba(255,255,255,0)')
        shineGrad.addColorStop(0.35, 'rgba(230,225,255,0.04)')
        shineGrad.addColorStop(0.50, 'rgba(255,252,255,0.14)')   // peak — silver-white
        shineGrad.addColorStop(0.65, 'rgba(200,190,255,0.05)')
        shineGrad.addColorStop(1, 'rgba(255,255,255,0)')

        // Draw a large rect and let the gradient + clip do the work
        ctx.globalAlpha = alpha
        ctx.fillStyle = shineGrad
        ctx.fillRect(L - size, T - size, size * 3, size * 3)

        ctx.restore()
    }

    ctx.restore()
}

/* ─── Dot pixel renderer ─────────────────────────────────────── */
function drawPixel(ctx, x, y, baseR, shape, sizeScale, bri, alpha) {
    if (alpha < 0.02) return
    const r = baseR * sizeScale
    const g = Math.round(178 + 72 * bri)
    ctx.globalAlpha = alpha
    ctx.fillStyle = `rgb(${g},${g},${g})`
    if (shape === 'circle') {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = alpha * 0.15; ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.fill()
    } else if (shape === 'square') {
        const h = r * 0.9; ctx.fillRect(x - h, y - h, h * 2, h * 2)
    } else {
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
            if (t) gsap.fromTo(t, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
            if (c) gsap.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.3 })
        }
        function startBreathing() {
            if (!PRM) breathTween = gsap.to(canvas, { opacity: 0.88, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }

        /* ── ScrollTrigger ─────────────────────────────────── */
        function setupScrollTrigger() {
            const heroEl = heroRef?.current
            ScrollTrigger.create({
                trigger: heroEl || '#hero',
                start: 'top top', end: '+=380%', scrub: 1.2, pin: true,
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
            document.removeEventListener('visibilitychange', onVis)
            ScrollTrigger.getAll().forEach(t => t.kill())
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