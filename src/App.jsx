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

/*
 * SNAP SYSTEM
 * -----------
 * We don't use CSS scroll-snap because it doesn't play well with Lenis +
 * GSAP ScrollTrigger pins (the pinSpacing spacer confuses snap calculations).
 *
 * Instead: on Lenis 'scroll' events we track velocity. When velocity drops
 * below a threshold (user lifted finger / stopped wheel) we find the nearest
 * snap point and call lenis.scrollTo() with a smooth easing.
 *
 * Snap points are computed dynamically from the actual DOM positions AFTER
 * ScrollTrigger has added its pinSpacing spacers — so they're always accurate.
 *
 * Snap targets (by section id):
 *   #hero       → top of page (0)
 *   #domains    → top of domains section (after Hero pin spacer)
 *   #projects   → top of projects section (after Domains pin spacer)
 *   #team       → top of team section
 *
 * Footer is intentionally excluded — it's a destination you scroll TO,
 * not a section you snap INTO. Snapping to it would feel wrong.
 */

const SNAP_IDS = ['hero', 'domains', 'projects', 'team']
const SNAP_EASE = (t) => 1 - Math.pow(1 - t, 4)   // easeOutQuart — premium deceleration
const SNAP_DUR = 1.1    // seconds
// How close (px) to a snap point before we snap — wider = more magnetic
const SNAP_ZONE = 180

function getSnapPoints() {
    return SNAP_IDS.map(id => {
        const el = document.getElementById(id)
        if (!el) return null
        // getBoundingClientRect gives position relative to viewport;
        // add current scroll to get absolute document position
        const rect = el.getBoundingClientRect()
        return Math.round(rect.top + window.scrollY)
    }).filter(Boolean)
}

export default function App() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 1.5,
            touchInertiaMultiplier: 20,
        })

        // ── Snap state ──────────────────────────────────────────────
        let lastVelocity = 0
        let snapTimer = null
        let isSnapping = false
        let snapPoints = []   // populated after ST is ready

        // Recompute snap points whenever layout might change
        // (ST creates pin spacers with a 300ms delay — we wait for that)
        function refreshSnapPoints() {
            snapPoints = getSnapPoints()
        }

        // Initial compute — wait for ScrollTrigger pin spacers to exist
        setTimeout(refreshSnapPoints, 600)
        window.addEventListener('resize', refreshSnapPoints)

        // ── Core snap logic ─────────────────────────────────────────
        function trySnap(currentY) {
            if (isSnapping || snapPoints.length === 0) return

            // Find the nearest snap point
            let nearest = null
            let minDist = Infinity
            for (const pt of snapPoints) {
                const dist = Math.abs(currentY - pt)
                if (dist < minDist) { minDist = dist; nearest = pt }
            }

            // Only snap if within the magnetic zone
            if (nearest === null || minDist > SNAP_ZONE) return
            // Don't snap if already basically there
            if (minDist < 4) return

            isSnapping = true
            lenis.scrollTo(nearest, {
                duration: SNAP_DUR,
                easing: SNAP_EASE,
                force: true,
            })

            // Release snap lock once Lenis finishes
            setTimeout(() => { isSnapping = false }, SNAP_DUR * 1000 + 100)
        }

        // ── Lenis scroll listener ────────────────────────────────────
        lenis.on('scroll', (e) => {
            window.__lenisY = e.scroll
            ScrollTrigger.update()

            lastVelocity = e.velocity

            // Debounce: wait until scroll has been still for 80ms
            // This fires when the user stops wheeling or lifts their finger
            clearTimeout(snapTimer)
            if (!isSnapping) {
                snapTimer = setTimeout(() => {
                    // Velocity should be near-zero — confirms scroll has settled
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