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
        </section>
    )
}
