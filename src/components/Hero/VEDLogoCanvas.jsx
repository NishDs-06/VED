import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'

/* ═══════════════════════════════════════════════════════════════
   VEDLogoCanvas — Halftone Edition
   
   1. Font-sample "VED" → per-dot brightness + size variation
   2. ~15% random gaps for authentic halftone texture
   3. Two-tier sprite (crisp core + small bloom only, no heavy glow)
   4. Diagonal shimmer sweep animation
   5. Entry: dots fly in from all 4 browser edges
   6. Scroll: VED dots morph → chip layout grid
═══════════════════════════════════════════════════════════════ */

/* ── Two sprite tiers: dim grey + bright white ───────────── */
function makeSprite(radius, brightness) {
    const pad = radius * 2.2
    const size = Math.ceil(pad * 2)
    const off = document.createElement('canvas')
    off.width = size
    off.height = size
    const c = off.getContext('2d')
    const cx = size / 2
    const cy = size / 2
    const b = brightness // 0–1

    // Small soft bloom only (not huge halo)
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6)
    g.addColorStop(0, `rgba(255,255,255,${(0.35 * b).toFixed(2)})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')
    c.fillStyle = g
    c.beginPath(); c.arc(cx, cy, radius * 1.6, 0, Math.PI * 2); c.fill()

    // Crisp core
    const grey = Math.round(140 + 115 * b) // 140 (grey) → 255 (white)
    c.fillStyle = `rgb(${grey},${grey},${grey})`
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.fill()

    return { canvas: off, size, pad }
}

/* ── Chip layout target positions ────────────────────────── */
function generateChipPositions(canvasW, canvasH, dotCount) {
    const positions = []
    const cx = canvasW / 2
    const cy = canvasH / 2

    // Chip dimensions — fills most of the canvas area
    const chipW = canvasW * 0.80
    const chipH = canvasH * 0.90
    const chipL = cx - chipW / 2
    const chipT = cy - chipH / 2

    // Define rectangular blocks inside the chip (inspired by SRAM reference)
    const blocks = [
        // Main memory array (large block, right side)
        { x: 0.52, y: 0.06, w: 0.44, h: 0.52, density: 0.45 },
        // Top header with small subblocks
        { x: 0.04, y: 0.04, w: 0.44, h: 0.09, density: 0.55 },
        // Decoder left column
        { x: 0.04, y: 0.16, w: 0.14, h: 0.52, density: 0.40 },
        // Control logic center
        { x: 0.22, y: 0.16, w: 0.26, h: 0.28, density: 0.30 },
        // Highlight block (accent area — right-bottom)
        { x: 0.56, y: 0.62, w: 0.40, h: 0.32, density: 0.55 },
        // Bottom row of cells
        { x: 0.04, y: 0.74, w: 0.48, h: 0.20, density: 0.40 },
        // Small control blocks (center)
        { x: 0.22, y: 0.48, w: 0.26, h: 0.22, density: 0.35 },
        // Additional small blocks for detail
        { x: 0.04, y: 0.70, w: 0.14, h: 0.08, density: 0.50 },
        { x: 0.52, y: 0.60, w: 0.10, h: 0.06, density: 0.45 },
    ]

    // Outer border dots (double border for chip package pins)
    const borderSpacing = 4
    for (let x = 0; x <= chipW; x += borderSpacing) {
        positions.push({ x: chipL + x, y: chipT })
        positions.push({ x: chipL + x, y: chipT + chipH })
        // Second border line offset inward
        if (x > borderSpacing * 2 && x < chipW - borderSpacing * 2) {
            positions.push({ x: chipL + x, y: chipT + borderSpacing * 2 })
            positions.push({ x: chipL + x, y: chipT + chipH - borderSpacing * 2 })
        }
    }
    for (let y = 0; y <= chipH; y += borderSpacing) {
        positions.push({ x: chipL, y: chipT + y })
        positions.push({ x: chipL + chipW, y: chipT + y })
        if (y > borderSpacing * 2 && y < chipH - borderSpacing * 2) {
            positions.push({ x: chipL + borderSpacing * 2, y: chipT + y })
            positions.push({ x: chipL + chipW - borderSpacing * 2, y: chipT + y })
        }
    }

    // Fill blocks with dots
    const spacing = 4
    for (const block of blocks) {
        const bx = chipL + block.x * chipW
        const by = chipT + block.y * chipH
        const bw = block.w * chipW
        const bh = block.h * chipH

        // Block border
        for (let x = 0; x <= bw; x += spacing) {
            positions.push({ x: bx + x, y: by })
            positions.push({ x: bx + x, y: by + bh })
        }
        for (let y = 0; y <= bh; y += spacing) {
            positions.push({ x: bx, y: by + y })
            positions.push({ x: bx + bw, y: by + y })
        }

        // Internal fill
        for (let y = spacing; y < bh; y += spacing) {
            for (let x = spacing; x < bw; x += spacing) {
                if (Math.random() < block.density) {
                    positions.push({ x: bx + x, y: by + y })
                }
            }
        }
    }

    // Routing lines between blocks (horizontal + vertical traces)
    const routeY = [0.14, 0.46, 0.60, 0.72]
    for (const ry of routeY) {
        const ly = chipT + ry * chipH
        for (let x = 0; x < chipW; x += spacing * 2) {
            if (Math.random() < 0.55) positions.push({ x: chipL + x, y: ly })
        }
    }
    const routeX = [0.20, 0.50, 0.95]
    for (const rx of routeX) {
        const lx = chipL + rx * chipW
        for (let y = 0; y < chipH; y += spacing * 2) {
            if (Math.random() < 0.45) positions.push({ x: lx, y: chipT + y })
        }
    }

    // Ensure we have enough — pad or trim to match dotCount
    while (positions.length < dotCount) {
        positions.push({
            x: chipL + Math.random() * chipW,
            y: chipT + Math.random() * chipH,
        })
    }

    // Shuffle and trim
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]]
    }
    return positions.slice(0, dotCount)
}

/* ── Font-sampled dot generation with halftone variation ── */
function generateDots(maxW, maxH) {
    const off = document.createElement('canvas')
    const octx = off.getContext('2d')
    const spacing = 6

    const refSize = 300
    off.width = 3000; off.height = 800
    octx.font = `900 ${refSize}px "DM Mono", monospace`
    octx.textBaseline = 'top'
    const m = octx.measureText('VED')
    const textW = m.width
    const textH = refSize * 1.05

    const scale = Math.min(maxW / textW, maxH / textH)
    const fontSize = Math.floor(refSize * scale)
    const finalW = Math.ceil(textW * scale)
    const finalH = Math.ceil(fontSize * 1.1)

    off.width = finalW
    off.height = finalH
    octx.clearRect(0, 0, finalW, finalH)
    octx.fillStyle = '#FFFFFF'
    octx.font = `900 ${fontSize}px "DM Mono", monospace`
    octx.textBaseline = 'top'
    octx.fillText('VED', 0, fontSize * 0.05)

    const imgData = octx.getImageData(0, 0, finalW, finalH).data
    const dots = []

    for (let y = 0; y < finalH; y += spacing) {
        for (let x = 0; x < finalW; x += spacing) {
            const alpha = imgData[(y * finalW + x) * 4 + 3]
            if (alpha < 40) continue

            // ~15% random gaps for halftone authenticity
            if (Math.random() < 0.15) continue

            // Brightness based on alpha (edge pixels are dimmer)
            const rawBrightness = alpha / 255
            // Add noise for texture
            const noise = 0.7 + Math.random() * 0.3
            const brightness = Math.max(0.3, Math.min(1, rawBrightness * noise))

            dots.push({
                finalX: x, finalY: y,
                // Chip target (assigned later)
                chipX: x, chipY: y,
                // Scatter start
                scatterX: 0, scatterY: 0,
                stagger: 0, phase: Math.random() * Math.PI * 2,
                // Per-dot variation
                brightness,
                baseRadius: 1,
                // Disintegration velocity
                velX: 0, velY: 0,
            })
        }
    }

    return { dots, canvasW: finalW, canvasH: finalH, spacing }
}

/* ── Assign scatter positions outside actual viewport ─────── */
function assignScatter(dots, cw, ch, canvasRect) {
    // canvasRect is the canvas bounding rect on screen
    const vpW = window.innerWidth
    const vpH = window.innerHeight
    const cx = cw / 2, cy = ch / 2

    dots.forEach(d => {
        const edge = Math.floor(Math.random() * 4)
        // Convert canvas-local to screen-local scatter start
        const screenFinalX = canvasRect.left + d.finalX
        const screenFinalY = canvasRect.top + d.finalY

        let screenScatterX, screenScatterY
        switch (edge) {
            case 0: // from above viewport
                screenScatterX = screenFinalX + (Math.random() - 0.5) * vpW * 0.6
                screenScatterY = -50 - Math.random() * vpH * 0.5
                break
            case 1: // from below viewport
                screenScatterX = screenFinalX + (Math.random() - 0.5) * vpW * 0.6
                screenScatterY = vpH + 50 + Math.random() * vpH * 0.5
                break
            case 2: // from left
                screenScatterX = -50 - Math.random() * vpW * 0.5
                screenScatterY = screenFinalY + (Math.random() - 0.5) * vpH * 0.6
                break
            default: // from right
                screenScatterX = vpW + 50 + Math.random() * vpW * 0.5
                screenScatterY = screenFinalY + (Math.random() - 0.5) * vpH * 0.6
                break
        }

        // Convert back to canvas-local coordinates
        d.scatterX = screenScatterX - canvasRect.left
        d.scatterY = screenScatterY - canvasRect.top

        // Stagger based on distance from center
        d.stagger = Math.hypot(d.finalX - cx, d.finalY - cy)

        // Disintegration velocity
        const dx = d.finalX - cx, dy = d.finalY - cy
        const len = Math.hypot(dx, dy) || 1
        const mag = (0.4 + Math.random() * 1.0) * cw
        d.velX = (dx / len) * mag; d.velY = (dy / len) * mag + ch * 0.04
    })

    const maxD = Math.max(...dots.map(d => d.stagger), 1)
    dots.forEach(d => { d.stagger = (d.stagger / maxD) * 0.25 })
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function VEDLogoCanvas({ heroRef, heroTextRef, scrollCueRef }) {
    const wrapperRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const wrapper = wrapperRef.current
        if (!canvas || !wrapper) return
        const ctx = canvas.getContext('2d')
        const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let dots = []
        let canvasW = 0
        let canvasH = 0
        let sprites = []  // array of sprites at different brightness levels
        let dotR = 0
        let rafId = null
        let alive = true
        let entryDone = false
        let entryProg = 0
        let scrollProg = 0
        let breathTween = null

        /* ── Build sprites at different brightness tiers ──────── */
        function buildSprites(radius) {
            sprites = []
            const tiers = 8
            for (let i = 0; i < tiers; i++) {
                const b = (i + 1) / tiers  // 0.125 → 1.0
                sprites.push(makeSprite(radius, b))
            }
        }

        /* ── Pick sprite based on brightness ──────────────────── */
        function spriteForBrightness(b) {
            const idx = Math.min(sprites.length - 1, Math.floor(b * sprites.length))
            return sprites[Math.max(0, idx)]
        }

        /* ── Build everything ─────────────────────────────────── */
        function build() {
            console.log('[VED] build() called')
            const vw = window.innerWidth
            const vh = window.innerHeight
            const maxW = vw * 0.88
            const maxH = vh * 0.58

            const result = generateDots(maxW, maxH)
            dots = result.dots
            canvasW = result.canvasW
            canvasH = result.canvasH
            dotR = Math.max(1.5, result.spacing * 0.35)

            buildSprites(dotR)

            // Assign per-dot base radius variation
            const cx = canvasW / 2, cy = canvasH / 2
            const maxDist = Math.hypot(canvasW, canvasH) / 2
            dots.forEach(d => {
                // Center dots are larger, edge dots smaller
                const dist = Math.hypot(d.finalX - cx, d.finalY - cy) / maxDist
                d.baseRadius = dotR * (0.7 + (1 - dist) * 0.35)
            })

            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(canvasW * dpr)
            canvas.height = Math.round(canvasH * dpr)
            canvas.style.width = canvasW + 'px'
            canvas.style.height = canvasH + 'px'
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            // Get actual screen position for scatter calculation
            const rect = canvas.getBoundingClientRect()
            assignScatter(dots, canvasW, canvasH, rect)

            // Generate chip morph targets
            const chipTargets = generateChipPositions(canvasW, canvasH, dots.length)
            dots.forEach((d, i) => {
                d.chipX = chipTargets[i].x
                d.chipY = chipTargets[i].y
            })
            console.log('[VED] build done:', dots.length, 'dots, canvas:', canvasW, 'x', canvasH, 'dotR:', dotR)
        }

        /* ── Entry animation ────────────────────────────────── */
        function runEntry() {
            // DEBUG: skip animation to test rendering
            entryProg = 1; entryDone = true
            revealUI(); startBreathing()
            console.log('[VED] entry skipped for debug, dots should be visible')
        }

        /* ── Text slides up from below ───────────────────────── */
        function revealUI() {
            const t = heroTextRef?.current
            const c = scrollCueRef?.current
            if (t) gsap.fromTo(t,
                { autoAlpha: 0, y: 50 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.05 }
            )
            if (c) gsap.fromTo(c,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.4, delay: 0.4 }
            )
        }

        /* ── Breathing glow ─────────────────────────────────── */
        function startBreathing() {
            if (PRM) return
            breathTween = gsap.to(wrapper, {
                filter: 'brightness(1.06)',
                duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
            })
        }

        /* ── ScrollTrigger — pinned so morph stays visible ──── */
        function setupScrollTrigger() {
            ScrollTrigger.create({
                trigger: heroRef?.current || '#hero',
                start: 'top top', end: '+=150%', scrub: 1.5,
                pin: true,
                onUpdate: (self) => {
                    scrollProg = self.progress

                    // Fade out text + scroll cue as morph begins
                    const t = heroTextRef?.current
                    const c = scrollCueRef?.current
                    if (self.progress > 0.02) {
                        const fade = Math.max(0, 1 - (self.progress - 0.02) / 0.12)
                        if (t) t.style.opacity = fade
                        if (c) c.style.opacity = 0
                    } else if (entryDone) {
                        if (t) t.style.opacity = 1
                        if (c) c.style.opacity = 1
                    }
                },
            })
        }

        /* ── RAF loop ─────────────────────────────────────────── */
        function loop(now) {
            if (!alive) return
            ctx.clearRect(0, 0, canvasW, canvasH)

            const sp = scrollProg
            const cxC = canvasW / 2
            const cyC = canvasH / 2

            // Shimmer: diagonal sweep (bottom-left → top-right), repeating every 4s
            const shimmerPos = ((now * 0.00025) % 1)
            // Normalize position along diagonal: 0 = bottom-left, 1 = top-right
            const diagMax = canvasW + canvasH

            for (const d of dots) {
                let x, y, op, bri

                if (!entryDone) {
                    /* Entry: scatter → final with per-dot stagger */
                    const rawP = (entryProg - d.stagger) / (1 - d.stagger)
                    const p = Math.max(0, Math.min(1, rawP))
                    x = d.scatterX + (d.finalX - d.scatterX) * p
                    y = d.scatterY + (d.finalY - d.scatterY) * p
                    op = p
                    bri = d.brightness
                } else {
                    op = 1
                    bri = d.brightness

                    if (sp < 0.02) {
                        /* Idle state: VED formed */
                        x = d.finalX
                        y = d.finalY

                        // Micro-drift
                        x += Math.sin(now * 0.0006 + d.phase) * 0.3
                        y += Math.cos(now * 0.0006 * 1.3 + d.phase) * 0.3

                        // Shimmer: boost brightness for dots near the sweep line
                        const dotDiag = (d.finalX + (canvasH - d.finalY)) / diagMax
                        const dist = Math.abs(dotDiag - shimmerPos)
                        if (dist < 0.08) {
                            const boost = 1 - dist / 0.08
                            bri = Math.min(1, bri + boost * 0.5)
                        }
                    } else if (sp <= 0.15) {
                        /* Phase 1: vibrate VED */
                        x = d.finalX
                        y = d.finalY
                        const amp = (sp / 0.15) * 3
                        x += (Math.random() - 0.5) * amp * 2
                        y += (Math.random() - 0.5) * amp * 2
                    } else if (sp <= 0.80) {
                        /* Phase 2: morph VED → chip layout */
                        const t = (sp - 0.15) / 0.65
                        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
                        x = d.finalX + (d.chipX - d.finalX) * ease
                        y = d.finalY + (d.chipY - d.finalY) * ease
                        // All dots become white during morph
                        bri = d.brightness + (1 - d.brightness) * ease * 0.5
                    } else {
                        /* Phase 3: chip formed, stable */
                        x = d.chipX
                        y = d.chipY
                        bri = Math.min(1, d.brightness + 0.3)

                        // Shimmer on chip too
                        const dotDiag = (d.chipX + (canvasH - d.chipY)) / diagMax
                        const dist = Math.abs(dotDiag - shimmerPos)
                        if (dist < 0.06) {
                            bri = Math.min(1, bri + (1 - dist / 0.06) * 0.4)
                        }
                    }
                }

                if (op < 0.02) continue

                // Pick sprite tier based on current brightness
                const spr = spriteForBrightness(bri)
                const half = spr.pad
                ctx.globalAlpha = op
                ctx.drawImage(spr.canvas, x - half, y - half)
            }

            ctx.globalAlpha = 1
            rafId = requestAnimationFrame(loop)
        }

        /* ── Visibility ─────────────────────────────────────── */
        function onVis() {
            if (document.hidden) { alive = false; cancelAnimationFrame(rafId); if (breathTween) breathTween.pause() }
            else { alive = true; rafId = requestAnimationFrame(loop); if (breathTween) breathTween.resume() }
        }
        document.addEventListener('visibilitychange', onVis)

        /* ── Resize ─────────────────────────────────────────── */
        let resizeTimer
        function onResize() {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                build()
                if (entryDone) entryProg = 1
            }, 200)
        }
        window.addEventListener('resize', onResize)

        /* ── Boot ────────────────────────────────────────────── */
        async function boot() {
            console.log('[VED] boot() starting, waiting for fonts...')
            await document.fonts.ready
            console.log('[VED] fonts ready, scheduling build')
            requestAnimationFrame(() => {
                console.log('[VED] rAF fired, building...')
                build()
                setupScrollTrigger()
                rafId = requestAnimationFrame(loop)
                runEntry()
                console.log('[VED] boot complete, entry started')
            })
        }
        boot()

        return () => {
            alive = false
            cancelAnimationFrame(rafId)
            if (breathTween) breathTween.kill()
            window.removeEventListener('resize', onResize)
            document.removeEventListener('visibilitychange', onVis)
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <div ref={wrapperRef} className={styles.vedWrapper}>
            <canvas
                ref={canvasRef}
                aria-label="VED dot-matrix logo"
                style={{ display: 'block' }}
            />
        </div>
    )
}
