import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Campus.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Campus() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const textRef = useRef(null);
    const overlayRef = useRef(null);

    useLayoutEffect(() => {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const widthPx = vw * 0.47; // 47vw width
            const heightPx = widthPx * (9 / 16); // 16:9 aspect ratio
            const topPct = ((vh - heightPx) / 2 / vh) * 100;

            const videoEl = videoRef.current.querySelector('video');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=300%',
                    pin: true,
                    scrub: 2,
                    refreshPriority: -1,
                }
            });

            tl.fromTo(overlayRef.current, { opacity: 0.1 }, { opacity: 0.3, duration: 1 }, 0)
              .fromTo(videoRef.current, {
                  clipPath: 'inset(0% 0% 0% 0% round 0px)'
              }, {
                  clipPath: `inset(${topPct}% 5% ${topPct}% 48% round 12px)`,
                  duration: 1,
                  ease: 'power3.inOut'
              }, 0)
              .fromTo(videoEl, {
                  x: '0vw'
              }, {
                  x: '14vw',
                  duration: 1,
                  ease: 'power3.inOut'
              }, 0)
              .fromTo(textRef.current.children, {
                  y: 40,
                  opacity: 0,
                  filter: 'blur(8px)'
              }, {
                  y: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                  duration: 0.6,
                  stagger: 0.1,
                  ease: 'power2.out'
              }, 0.3);
              
            return () => { tl.kill(); };
        });

        mm.add("(max-width: 768px)", () => {
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const widthPx = vw * 0.90; // 90vw width
            const heightPx = widthPx * (9 / 16); // 16:9 aspect ratio
            const heightPct = (heightPx / vh) * 100;
            const bottomPct = 100 - 10 - heightPct;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=350%',
                    pin: true,
                    scrub: 2,
                    refreshPriority: -1,
                }
            });

            tl.fromTo(overlayRef.current, { opacity: 0.1 }, { opacity: 0.3, duration: 1 }, 0)
              .fromTo(videoRef.current, {
                  clipPath: 'inset(0% 0% 0% 0% round 0px)',
                  opacity: 1
              }, {
                  clipPath: `inset(10% 5% ${bottomPct}% 5% round 12px)`,
                  opacity: 1,
                  duration: 1,
                  ease: 'power3.inOut'
              }, 0)
              .fromTo(textRef.current.children, {
                  y: 30,
                  opacity: 0,
                  filter: 'blur(8px)'
              }, {
                  y: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                  duration: 0.6,
                  stagger: 0.1,
                  ease: 'power2.out'
              }, 0.3)
              .to(videoRef.current, {
                  opacity: 0,
                  duration: 0.5,
                  ease: 'power2.inOut'
              }, 1)
              .to(textRef.current, {
                  y: '-15vh',
                  duration: 0.5,
                  ease: 'power2.inOut'
              }, 1);
              
            return () => { tl.kill(); };
        });

        ScrollTrigger.refresh();

        return () => mm.revert();
    }, []);

    return (
        <section className={styles.campusSection} ref={containerRef}>
            <div className={styles.videoWrapper} ref={videoRef}>
                <video 
                    autoPlay 
                    loop
                    muted 
                    playsInline 
                    className={styles.video}
                    src="/campus_watermark_removed.webm"
                />
                <div className={styles.overlay} ref={overlayRef}></div>
            </div>
            
            <div className={styles.textContainer} ref={textRef}>
                <h3 className={styles.title}>Our University</h3>
                <p className={styles.lead}>
                    Situated in a thriving technological hub, our institution provides a world-class ecosystem for next-generation engineering and research.
                </p>
                <p className={styles.description}>
                    We operate at the intersection of industry standards and academic rigor, seamlessly bridging the gap between theoretical semiconductor physics and practical, real-world chip fabrication.
                </p>
            </div>
        </section>
    );
}
