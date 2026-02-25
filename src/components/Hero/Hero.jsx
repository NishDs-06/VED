import { useRef } from 'react'
import styles from './Hero.module.css'
import VEDLogoCanvas from './VEDLogoCanvas'
import HeroText from './HeroText'
import ScrollCue from './ScrollCue'

// BackgroundGrid and AmbientCanvas removed per corrected spec:
// pure black background, no PCB grid, no ambient particles

export default function Hero() {
    const heroRef = useRef(null)
    const heroTextRef = useRef(null)
    const scrollCueRef = useRef(null)

    return (
        <section className={styles.hero} id="hero" ref={heroRef}>
            {/* Canvas is a direct child of hero so position:absolute anchors to hero's top-left */}
            <VEDLogoCanvas
                heroRef={heroRef}
                heroTextRef={heroTextRef}
                scrollCueRef={scrollCueRef}
            />
            <div className={styles.heroContent}>
                <HeroText ref={heroTextRef} />
            </div>
            <ScrollCue ref={scrollCueRef} />

            {/* Chip recognition label — fades in during chip hold phase */}
            <div
                id="chip-label"
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    bottom: '17%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: 0,
                    zIndex: 6,
                    pointerEvents: 'none',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                }}
            >
                <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.38em',
                    color: 'rgba(123,53,232,0.6)',
                    textTransform: 'uppercase',
                    marginBottom: '7px',
                }}>
                    System-on-Chip Architecture
                </p>
                <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '8px',
                    letterSpacing: '0.22em',
                    color: 'rgba(255,255,255,0.15)',
                    textTransform: 'uppercase',
                }}>
                    SKY130 · 130nm · MIT Bangalore
                </p>
            </div>
        </section>
    )
}
