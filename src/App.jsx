import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'  // eslint-disable-line
import Hero from './components/Hero/Hero'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
        })

        lenis.on('scroll', ScrollTrigger.update)

        const tickerFn = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(tickerFn)
        gsap.ticker.lagSmoothing(0)

        return () => {
            lenis.destroy()
            gsap.ticker.remove(tickerFn)
            ScrollTrigger.killAll()
        }
    }, [])

    return (
        <main>
            <Hero />
            {/* Below-fold placeholder — replace with real sections */}
            <section
                style={{
                    width: '100%',
                    minHeight: '100vh',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <p
                    style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        color: 'rgba(232,234,240,0.18)',
                        textTransform: 'uppercase',
                    }}
                >
                    Next Section
                </p>
            </section>
        </main>
    )
}
