import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Hero from './components/Hero/Hero'
import Domains from './components/Domains/Domains'
import Projects from './components/Projects/Projects'
import Team from './components/Team/Team'
import Footer from './components/Footer/Footer'
import ChipLoader from './components/ChipLoader/ChipLoader'

gsap.registerPlugin(ScrollTrigger)

const SNAP_IDS = ['hero', 'domains', 'projects', 'team']
const SNAP_EASE = (t) => 1 - Math.pow(1 - t, 4)
const SNAP_DUR = 1.1
const SNAP_ZONE = 180

function getSnapPoints() {
    return SNAP_IDS.map(id => {
        const el = document.getElementById(id)
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return Math.round(rect.top + window.scrollY)
    }).filter(Boolean)
}

export default function App() {
    const [loading, setLoading] = useState(false) // ChipLoader disabled — set to true to re-enable

    useEffect(() => {
        if (loading) return  // Don't init Lenis/ST until loader is gone

        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 1.5,
            touchInertiaMultiplier: 20,
        })

        let lastVelocity = 0
        let snapTimer = null
        let isSnapping = false
        let snapPoints = []

        function refreshSnapPoints() {
            snapPoints = getSnapPoints()
        }

        setTimeout(refreshSnapPoints, 600)
        window.addEventListener('resize', refreshSnapPoints)

        function trySnap(currentY) {
            if (isSnapping || snapPoints.length === 0) return
            let nearest = null
            let minDist = Infinity
            for (const pt of snapPoints) {
                const dist = Math.abs(currentY - pt)
                if (dist < minDist) { minDist = dist; nearest = pt }
            }
            if (nearest === null || minDist > SNAP_ZONE) return
            if (minDist < 4) return
            isSnapping = true
            lenis.scrollTo(nearest, {
                duration: SNAP_DUR,
                easing: SNAP_EASE,
                force: true,
            })
            setTimeout(() => { isSnapping = false }, SNAP_DUR * 1000 + 100)
        }

        lenis.on('scroll', (e) => {
            window.__lenisY = e.scroll
            ScrollTrigger.update()
            lastVelocity = e.velocity
            clearTimeout(snapTimer)
            if (!isSnapping) {
                snapTimer = setTimeout(() => {
                    if (Math.abs(lastVelocity) < 0.8) {
                        trySnap(e.scroll)
                    }
                }, 80)
            }
        })

        const tickerFn = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(tickerFn)
        gsap.ticker.lagSmoothing(0)

        return () => {
            clearTimeout(snapTimer)
            window.removeEventListener('resize', refreshSnapPoints)
            lenis.destroy()
            gsap.ticker.remove(tickerFn)
            ScrollTrigger.killAll()
        }
    }, [loading])

    return (
        <>
            {loading && (
                <ChipLoader onComplete={() => setLoading(false)} />
            )}
            <main style={{ visibility: loading ? 'hidden' : 'visible' }}>
                <Hero />
                <Domains />
                <Projects />
                <Team />
                <Footer />
            </main>
        </>
    )
}