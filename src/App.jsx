import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Hero from './components/Hero/Hero'
import Domains from './components/Domains/Domains'
import Projects from './components/Projects/Projects'
import Team from './components/Team/Team'
import Footer from './components/Footer/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            /*
             * smoothTouch: true — critical for mobile pinning.
             *
             * With smoothTouch: false (the previous default), mobile uses native
             * scroll events which fire AFTER the browser has already painted the
             * frame. ScrollTrigger's pin mechanism reads scroll position to decide
             * when to lock the section — but it always gets the position one frame
             * late, so the section visually scrolls past before the pin kicks in.
             *
             * With smoothTouch: true, Lenis drives ALL scroll (desktop + mobile)
             * through gsap.ticker, which fires BEFORE paint. ScrollTrigger then
             * sees the updated scroll position in the same tick it locks the pin —
             * so the section pins exactly at the right moment on mobile too.
             *
             * The tradeoff: Lenis now intercepts native touch momentum on mobile.
             * We compensate with a shorter duration (0.8 vs 1.4) on touch so it
             * still feels responsive and not floaty.
             */
            smoothTouch: true,
            touchMultiplier: 1.5,     // how much finger movement translates to scroll
            touchInertiaMultiplier: 20, // momentum feel after lifting finger
        })

        lenis.on('scroll', (e) => {
            window.__lenisY = e.scroll
            ScrollTrigger.update()
        })

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
            <Domains />
            <Projects />
            <Team />
            <Footer />
        </main>
    )
}