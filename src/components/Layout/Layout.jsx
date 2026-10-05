import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import ChipLoader from '../ChipLoader/ChipLoader';
import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loading) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true,
        });

        lenis.on('scroll', (e) => {
            window.__lenisY = e.scroll;
            ScrollTrigger.update();
        });

        const tickerFn = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tickerFn);
            ScrollTrigger.killAll();
        };
    }, [loading]);

    return (
        <>
            {loading && <ChipLoader onComplete={() => setLoading(false)} />}
            <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
                <Navigation />
                <main>{children}</main>
                <Footer />
            </div>
        </>
    );
}
