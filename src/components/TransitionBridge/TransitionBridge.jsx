import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function TransitionBridge() {
    const ref = useRef(null)
    const canvasRef = useRef(null)
    const chipRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let alive = true, rafId

        function resize() {
            canvas.width = window.innerWidth
            canvas.height = canvas.offsetHeight
        }
        resize()

        // Signal streams falling from top (data leaving the chip)
        const streams = Array.from({ length: 28 }, () => ({
            x: Math.random() * canvas.width,
            speed: 0.6 + Math.random() * 1.2,
            length: 24 + Math.random() * 80,
            opacity: 0.03 + Math.random() * 0.09,
            y: -Math.random() * 180,
        }))

        function draw() {
            if (!alive) return
            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)
            for (const s of streams) {
                s.y += s.speed
                if (s.y > H + s.length) s.y = -s.length
                const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y)
                grad.addColorStop(0, `rgba(123,53,232,0)`)
                grad.addColorStop(0.6, `rgba(123,53,232,${s.opacity})`)
                grad.addColorStop(1, `rgba(255,255,255,${s.opacity * 0.4})`)
                ctx.strokeStyle = grad
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(s.x, s.y - s.length)
                ctx.lineTo(s.x, s.y)
                ctx.stroke()
            }
            rafId = requestAnimationFrame(draw)
        }
        draw()

        // Animate the whole bridge in on scroll enter
        ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 90%',
            once: true,
            onEnter() {
                // 1. Section fades in
                gsap.fromTo(ref.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: 'power2.out' }
                )
                // 2. Chip icon scales in from large → small (zoom out effect)
                if (chipRef.current) {
                    gsap.fromTo(chipRef.current,
                        { scale: 3.5, opacity: 0, rotateX: 5 },
                        { scale: 1, opacity: 1, rotateX: 0, duration: 1.2, ease: 'power3.inOut', delay: 0.2 }
                    )
                }
            }
        })

        window.addEventListener('resize', resize)
        return () => {
            alive = false
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div
            ref={ref}
            style={{
                background: '#000000',
                height: '200px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                zIndex: 2,
            }}
        >
            {/* Signal streams canvas */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    pointerEvents: 'none',
                }}
            />

            {/* Chip icon — zooms out as you enter this section */}
            <div
                ref={chipRef}
                aria-hidden="true"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    opacity: 0,
                    textAlign: 'center',
                    perspective: '400px',
                }}
            >
                {/* Tiny SVG chip icon */}
                <svg
                    width="40" height="40"
                    viewBox="0 0 40 40"
                    style={{ display: 'block', margin: '0 auto 12px' }}
                    aria-hidden="true"
                >
                    <rect x="8" y="8" width="24" height="24" rx="1"
                        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    <rect x="11" y="11" width="18" height="18" rx="1"
                        fill="rgba(255,255,255,0.03)" stroke="rgba(123,53,232,0.4)" strokeWidth="0.5" />
                    {/* Pin marks */}
                    {[13, 18, 23, 27].map(y => (
                        <line key={`l${y}`} x1="4" y1={y} x2="8" y2={y}
                            stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                    ))}
                    {[13, 18, 23, 27].map(y => (
                        <line key={`r${y}`} x1="32" y1={y} x2="36" y2={y}
                            stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                    ))}
                    {[13, 18, 23, 27].map(x => (
                        <line key={`t${x}`} x1={x} y1="4" x2={x} y2="8"
                            stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                    ))}
                    {[13, 18, 23, 27].map(x => (
                        <line key={`b${x}`} x1={x} y1="32" x2={x} y2="36"
                            stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                    ))}
                    {/* Center dot */}
                    <circle cx="20" cy="20" r="2"
                        fill="rgba(123,53,232,0.5)" />
                </svg>

                <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '8px',
                    letterSpacing: '0.32em',
                    color: 'rgba(255,255,255,0.1)',
                    textTransform: 'uppercase',
                    marginBottom: '5px',
                }}>
                    — Signal Handoff —
                </p>
                <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '7px',
                    letterSpacing: '0.2em',
                    color: 'rgba(123,53,232,0.2)',
                    textTransform: 'uppercase',
                }}>
                    Domain Knowledge → Active Projects
                </p>
            </div>
        </div>
    )
}
