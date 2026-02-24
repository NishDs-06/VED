import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'

const V_MAP = [
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
]
const E_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
const D_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

function buildDots(dotSize, gap) {
    const COLS = 11, ROWS = 15
    const cell = dotSize + gap
    const letterW = COLS * cell
    const letterH = ROWS * cell
    const letterGap = cell * 2.2
    const totalW = letterW * 3 + letterGap * 2
    const totalH = letterH
    const dots = []

        ;[V_MAP, E_MAP, D_MAP].forEach((map, li) => {
            const ox = li * (letterW + letterGap)
            map.forEach((row, ri) => {
                row.forEach((on, ci) => {
                    if (!on) return
                    for (let sy = 0; sy < 2; sy++)
                        for (let sx = 0; sx < 2; sx++)
                            dots.push({
                                finalX: ox + ci * cell + sx * (dotSize * 0.54),
                                finalY: ri * cell + sy * (dotSize * 0.54),
                                brightness: 0.6 + Math.random() * 0.4,
                                phase: Math.random() * Math.PI * 2,
                                staggerDelay: 0,
                            })
                })
            })
        })
    return { dots, totalW, totalH }
}

function drawDot(ctx, x, y, r, bri, alpha) {
    if (alpha < 0.01) return
    ctx.globalAlpha = alpha
    const g1 = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5)
    g1.addColorStop(0, `rgba(255,255,255,${(0.13 * bri).toFixed(3)})`)
    g1.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g1
    ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2); ctx.fill()

    const g2 = ctx.createRadialGradient(x, y, 0, x, y, r * 1.9)
    g2.addColorStop(0, `rgba(255,255,255,${(0.55 * bri).toFixed(3)})`)
    g2.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g2
    ctx.beginPath(); ctx.arc(x, y, r * 1.9, 0, Math.PI * 2); ctx.fill()

    const g = Math.round(165 + 90 * bri)
    ctx.fillStyle = `rgb(${g},${g},${g})`
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1
}

export default function VEDLogoCanvas({ heroRef, heroTextRef, scrollCueRef }) {
    const wrapperRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const wrapper = wrapperRef.current
        if (!canvas || !wrapper) return

        const ctx = canvas.getContext('2d')
        const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // ── CRITICAL: alive is a local object, not a primitive ────
        // When StrictMode double-invokes, the cleanup sets state.alive=false.
        // Because state is an object reference, the second mount's loop()
        // closure sees the updated value and stops immediately.
        // Fix: each effect invocation creates its OWN state object.
        // The cleanup for that specific invocation only affects its own state.
        const state = {
            alive: true,
            rafId: null,
            scrollProg: 0,
            breathTween: null,
            animProgress: PRM ? 1 : 0,
            dots: [],
            canvasW: 0,
            canvasH: 0,
            dotR: 4,
        }

        function build() {
            const maxW = window.innerWidth * 0.88
            const maxH = window.innerHeight * 0.56

            let dotSize = 7, gap = 3
            let r = buildDots(dotSize, gap)

            if (r.totalW > maxW || r.totalH > maxH) {
                const scale = Math.min(maxW / r.totalW, maxH / r.totalH)
                dotSize = Math.max(2.5, dotSize * scale)
                gap = Math.max(1, gap * scale)
                r = buildDots(dotSize, gap)
            }

            state.dots = r.dots
            state.canvasW = r.totalW
            state.canvasH = r.totalH
            state.dotR = dotSize * 0.42

            const cx = state.canvasW / 2, cy = state.canvasH / 2
            const maxD = Math.hypot(state.canvasW, state.canvasH) / 2
            state.dots.forEach(d => {
                d.staggerDelay = (Math.hypot(d.finalX - cx, d.finalY - cy) / maxD) * 0.3
            })

            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(state.canvasW * dpr)
            canvas.height = Math.round(state.canvasH * dpr)
            canvas.style.width = state.canvasW + 'px'
            canvas.style.height = state.canvasH + 'px'
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            console.log(`[VED] built: ${state.dots.length} dots | ${Math.round(state.canvasW)}×${Math.round(state.canvasH)}`)
        }

        function loop(now) {
            // Reads from THIS effect's state object — immune to other invocations
            if (!state.alive) return
            ctx.clearRect(0, 0, state.canvasW, state.canvasH)

            const p = state.animProgress
            const sp = state.scrollProg
            const cx = state.canvasW / 2, cy = state.canvasH / 2
            const diagMax = state.canvasW + state.canvasH
            const shimmer = (now * 0.00018) % 1

            for (const d of state.dots) {
                let x, y, alpha, bri = d.brightness

                if (p < 1) {
                    const raw = (p - d.staggerDelay) / (1 - d.staggerDelay + 0.001)
                    const ep = 1 - Math.pow(1 - Math.max(0, Math.min(1, raw)), 3)
                    x = cx + (d.finalX - cx) * ep
                    y = cy + (d.finalY - cy) * ep
                    alpha = Math.min(1, ep * 2)
                } else if (sp < 0.04) {
                    x = d.finalX + Math.sin(now * 0.0005 + d.phase) * 0.5
                    y = d.finalY + Math.cos(now * 0.00065 + d.phase) * 0.5
                    alpha = 1
                    const sd = Math.abs((d.finalX + (state.canvasH - d.finalY)) / diagMax - shimmer)
                    if (sd < 0.06) bri = Math.min(1, bri + (1 - sd / 0.06) * 0.4)
                } else if (sp < 0.25) {
                    const t = (sp - 0.04) / 0.21
                    x = d.finalX + (Math.random() - 0.5) * t * 7
                    y = d.finalY + (Math.random() - 0.5) * t * 7
                    alpha = 1
                } else if (sp < 0.85) {
                    const t = (sp - 0.25) / 0.60
                    const ease = t * t
                    const dx = d.finalX - cx, dy = d.finalY - cy
                    const len = Math.hypot(dx, dy) || 1
                    x = d.finalX + (dx / len) * ease * state.canvasW
                    y = d.finalY + (dy / len) * ease * state.canvasH
                    alpha = Math.max(0, 1 - ease * 1.4)
                } else continue

                drawDot(ctx, x, y, state.dotR, bri, alpha)
            }

            state.rafId = requestAnimationFrame(loop)
        }

        function revealUI() {
            const t = heroTextRef?.current
            const c = scrollCueRef?.current
            if (t) gsap.fromTo(t, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 })
            if (c) gsap.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 0.25, duration: 0.6, delay: 0.6 })
        }

        function startBreathing() {
            if (PRM) return
            state.breathTween = gsap.to(wrapper, {
                filter: 'brightness(1.22)', duration: 3.5,
                ease: 'sine.inOut', yoyo: true, repeat: -1,
            })
        }

        function runEntry() {
            if (PRM) { revealUI(); startBreathing(); return }
            gsap.fromTo(wrapper,
                { filter: 'brightness(6)' },
                { filter: 'brightness(1.15)', duration: 0.8, ease: 'power2.out', delay: 0.05 }
            )
            gsap.to(state, {
                animProgress: 1, duration: 1.5, ease: 'power3.out', delay: 0.1,
                onComplete: () => { revealUI(); startBreathing() }
            })
        }

        function onScroll() {
            const pct = Math.min(1, window.scrollY / window.innerHeight)
            state.scrollProg = pct
            const t = heroTextRef?.current
            const c = scrollCueRef?.current
            if (pct > 0.04) {
                const fade = Math.max(0, 1 - (pct - 0.04) / 0.15)
                if (t) t.style.opacity = fade
                if (c) c.style.opacity = 0
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        function onVis() {
            if (document.hidden) {
                state.alive = false
                cancelAnimationFrame(state.rafId)
                state.breathTween?.pause()
            } else {
                state.alive = true
                state.rafId = requestAnimationFrame(loop)
                state.breathTween?.resume()
            }
        }
        document.addEventListener('visibilitychange', onVis)

        let resizeTimer
        function onResize() {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                build()
                state.animProgress = 1
            }, 200)
        }
        window.addEventListener('resize', onResize)

        // ── BOOT — runs immediately, no waiting ───────────────────
        build()
        state.rafId = requestAnimationFrame(loop)
        runEntry()

        // Pin setup in next microtask — doesn't affect canvas sizing
        Promise.resolve().then(() => {
            ScrollTrigger.create({
                trigger: heroRef?.current || '#hero',
                start: 'top top',
                end: '+=130%',
                pin: true,
            })
        })

        // ── CLEANUP ───────────────────────────────────────────────
        // Only kills THIS invocation's state. If StrictMode remounts,
        // the new invocation has its own fresh state object.
        return () => {
            state.alive = false
            cancelAnimationFrame(state.rafId)
            state.breathTween?.kill()
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
            document.removeEventListener('visibilitychange', onVis)
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <div ref={wrapperRef} className={styles.vedWrapper} style={{ filter: 'brightness(1.15)' }}>
            <canvas ref={canvasRef} aria-label="VED dot-matrix logo" style={{ display: 'block' }} />
        </div>
    )
}