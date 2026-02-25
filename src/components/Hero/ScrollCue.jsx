import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * ScrollCue — Layer 5
 * Minimal SCROLL label + downward chevron.
 * Moment 4: opacity pulses 0.2 → 0.55 → 0.2 at 2200ms.
 * Disappears instantly on first scroll.
 */
const ScrollCue = forwardRef(function ScrollCue(_, ref) {
    const tweenRef = useRef(null)

    useEffect(() => {
        const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const el = ref?.current
        if (!el) return

        if (!PRM) {
            tweenRef.current = gsap.to(el, {
                opacity: 0.55,
                duration: 1.1,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                paused: false,
            })
            // Start opacity at 0.2 (set by GSAP fromTo in VEDLogoCanvas.revealText)
        }

        function onScroll() {
            if (tweenRef.current) tweenRef.current.kill()
            gsap.to(el, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
            window.removeEventListener('scroll', onScroll)
        }
        window.addEventListener('scroll', onScroll, { passive: true, once: true })

        return () => {
            if (tweenRef.current) tweenRef.current.kill()
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <div
            ref={ref}
            aria-hidden="true"
            style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                visibility: 'hidden',   // GSAP autoAlpha
                opacity: 0.2,
                zIndex: 5,
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            <span
                style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.32em',
                    color: 'rgba(232, 234, 240, 0.25)',
                    textTransform: 'uppercase',
                }}
            >
                Scroll
            </span>
            <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                style={{ display: 'block' }}
            >
                <path
                    d="M1 1L8 9L15 1"
                    stroke="rgba(232,234,240,0.4)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
        </div>
    )
})

export default ScrollCue
