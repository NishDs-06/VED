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
            smoothTouch: false,
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
