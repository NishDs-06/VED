import { forwardRef } from 'react'

/**
 * HeroText — Layer 4 (corrected spec)
 * Bold, readable club name + location.
 * GSAP autoAlpha controls visibility.
 */
const HeroText = forwardRef(function HeroText(_, ref) {
    return (
        <div
            ref={ref}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px', // ── PREMIUM FIX: Balanced gap
                visibility: 'hidden',
                position: 'relative',
                zIndex: 4,
                userSelect: 'none',
                textAlign: 'center',
            }}
        >
            <p
                style={{
                    fontFamily: "'DM Mono', monospace", // Back to the hardware roots
                    fontWeight: 600,
                    fontSize: 'clamp(13px, 3.5vw, 24px)', 
                    letterSpacing: 'clamp(0.1em, 1vw, 0.18em)', 
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    textShadow: '0 0 24px rgba(255,255,255,0.15)' // Subtle premium bloom
                }}
            >
                VLSI &amp; Embedded Design Club
            </p>
            <p
                style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: 'clamp(10px, 1.5vw, 13px)',
                    letterSpacing: 'clamp(0.15em, 1vw, 0.3em)',
                    color: 'rgba(255, 255, 255, 0.45)',
                    textTransform: 'uppercase',
                }}
            >
                MIT BLR
            </p>
        </div>
    )
})

export default HeroText
