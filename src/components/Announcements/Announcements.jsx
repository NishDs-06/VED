import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Announcements.module.css';

gsap.registerPlugin(ScrollTrigger);

const ANNOUNCEMENTS = [
    {
        id: 1,
        tag: 'Hackathon',
        title: 'PowerNext-AI Hackathon 2026',
        date: 'Oct 10-11, 2026',
        desc: 'Join Karnataka\'s largest undergraduate AI power sector hackathon with CPRI. ₹3 Lakh prize pool!',
        span: 'col-span-2 row-span-2',
        image: '/images/ved-020.png',
        position: 'center 25%'
    },
    {
        id: 2,
        tag: 'Workshop',
        title: 'RISC-V Renode Batch 1',
        date: 'Sept 10, 2026',
        desc: 'Successful completion of our first edge emulation workshop.',
        span: 'col-span-1 row-span-1',
        image: '/images/ved-008.jpg'
    },
    {
        id: 3,
        tag: 'Workshop',
        title: 'RISC-V Renode Batch 2',
        date: 'Sept 18, 2026',
        desc: 'Due to overwhelming demand, we are back with Batch 2!',
        span: 'col-span-1 row-span-2',
        image: '/images/ved-013.png'
    },
    {
        id: 4,
        tag: 'Event',
        title: 'VED Tech Orientation 2026',
        date: 'Sept 16, 2026',
        desc: 'Housefull at AB5! Welcoming the new incoming batch to VED.',
        span: 'col-span-2 row-span-1',
        image: '/images/ved-000.jpg'
    },
    {
        id: 5,
        tag: 'Event',
        title: 'Engineering Day 2026',
        date: 'Sept 15, 2026',
        desc: 'Celebrating innovation and building the semiconductor community.',
        span: 'col-span-1 row-span-1',
        image: '/images/engineering-day.jpg'
    },
    {
        id: 6,
        tag: 'Training',
        title: 'CMTI Fabrication Training',
        date: 'Apr 21-24, 2026',
        desc: 'Hands-on semiconductor fabrication at STDC, CMTI.',
        span: 'col-span-1 row-span-2',
        image: '/images/ved-003.png'
    }
];

export default function Announcements() {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const gridRef = useRef(null);
    const cardsRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Intro
            gsap.fromTo(heroRef.current, 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
            );

            // Stagger Grid Items
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 100, scale: 0.95 },
                {
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                        end: 'bottom bottom'
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.ambientGlow} />
            
            {/* Cinematic Center Hero */}
            <header className={styles.hero} ref={heroRef}>
                <div className={styles.heroContent}>
                    <p className={styles.eyebrow}>LATEST UPDATES</p>
                    <h1 className={styles.headline}>
                        We are shaping the <span className={styles.inlineImage} style={{backgroundImage: 'url(/images/ved-004.png)'}}></span> future of VLSI.
                    </h1>
                    <p className={styles.subhead}>
                        Stay updated with our latest workshops, hackathons, research initiatives, and global collaborations.
                    </p>
                </div>
            </header>

            {/* Gapless Bento Grid */}
            <section className={styles.bentoSection} ref={gridRef}>
                <div className={styles.bentoGrid}>
                    {ANNOUNCEMENTS.map((ann, i) => {
                        return (
                            <div 
                                key={ann.id} 
                                ref={el => cardsRef.current[i] = el}
                                className={`${styles.bentoCard} ${styles[ann.span.split(' ')[0]]} ${styles[ann.span.split(' ')[1]]}`}
                            >
                                <div className={styles.cardImageBg} style={{ backgroundImage: `url(${ann.image})`, backgroundPosition: ann.position || 'center' }} />
                                <div className={styles.cardOverlay} />
                                <div className={styles.cardContent}>
                                    <div className={styles.cardTop}>
                                        <span className={styles.tag}>{ann.tag}</span>
                                        <span className={styles.date}>{ann.date}</span>
                                    </div>
                                    <div className={styles.cardBottom}>
                                        <h3 className={styles.title}>{ann.title}</h3>
                                        <p className={styles.desc}>{ann.desc}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}
