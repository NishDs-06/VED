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
                marginTop: '48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                visibility: 'hidden',
                position: 'relative',
                zIndex: 4,
                userSelect: 'none',
                textAlign: 'center',
            }}
        >
            <p
                style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 600,
                    fontSize: 'clamp(16px, 2.2vw, 28px)',
                    letterSpacing: '0.18em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                }}
            >
                VLSI &amp; Embedded Design Club
            </p>
            <p
                style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 400,
                    fontSize: 'clamp(12px, 1.4vw, 18px)',
                    letterSpacing: '0.22em',
                    color: 'rgba(255, 255, 255, 0.65)',
                    textTransform: 'uppercase',
                }}
            >
                MIT BLR
            </p>
        </div>
    )
})

export default HeroText
