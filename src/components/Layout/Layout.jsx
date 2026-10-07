import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import ChipLoader from '../ChipLoader/ChipLoader';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }) {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const lenisRef = useRef(null);
    const tickerFnRef = useRef(null);
    const isFirstMount = useRef(true);

    // Create Lenis once on mount
    useEffect(() => {
        if (loading) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true,
        });
        lenisRef.current = lenis;

        lenis.on('scroll', (e) => {
            window.__lenisY = e.scroll;
            ScrollTrigger.update();
        });

        const tickerFn = (time) => lenis.raf(time * 1000);
        tickerFnRef.current = tickerFn;
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        
        window.__scrollToTop = () => {
            if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
        };

        const onPopupOpen = () => lenis.stop();
        const onPopupClose = () => lenis.start();

        window.addEventListener('ved:popup:open', onPopupOpen);
        window.addEventListener('ved:popup:close', onPopupClose);

        return () => {
            window.removeEventListener('ved:popup:open', onPopupOpen);
            window.removeEventListener('ved:popup:close', onPopupClose);
            lenis.destroy();
            lenisRef.current = null;
            if (tickerFnRef.current) {
                gsap.ticker.remove(tickerFnRef.current);
                tickerFnRef.current = null;
            }
            ScrollTrigger.killAll();
            delete window.__scrollToTop;
        };
    }, [loading]);

    // After new page components have mounted + registered their triggers,
    // do one final refresh so all start/end positions are correctly calculated.
    useEffect(() => {
        if (!isFirstMount.current) {
            const raf = requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
            return () => cancelAnimationFrame(raf);
        } else {
            isFirstMount.current = false;
        }
    }, [location.pathname]);

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
