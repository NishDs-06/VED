import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import styles from './TeamPreview.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function TeamPreview() {
    const sectionRef = useRef(null);
    const bgRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            });

            // Parallax effect on the background image
            tl.fromTo(bgRef.current, {
                y: '-15%'
            }, {
                y: '15%',
                ease: 'none'
            }, 0);

            // Cinematic text reveal
            const contentElements = Array.from(contentRef.current.children);
            gsap.fromTo(contentElements, {
                opacity: 0,
                y: 50,
                filter: 'blur(10px)'
            }, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                    end: 'top 20%',
                    scrub: 1,
                },
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                stagger: 0.1,
                ease: 'power3.out'
            });
        });

        mm.add("(max-width: 768px)", () => {
             // Mobile simplified parallax
             gsap.fromTo(bgRef.current, { y: '-5%' }, {
                y: '5%',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
             });
             
             // Mobile text reveal
             const contentElements = Array.from(contentRef.current.children);
             gsap.fromTo(contentElements, { opacity: 0, y: 30 }, {
                 opacity: 1, y: 0,
                 stagger: 0.1,
                 scrollTrigger: {
                     trigger: sectionRef.current,
                     start: 'top 80%',
                 }
             });
        });

        return () => mm.revert();
    }, []);

    return (
        <section className={styles.section} ref={sectionRef}>
            <div className={styles.bgWrapper}>
                <img 
                    ref={bgRef}
                    src="/team_group.jpg" 
                    alt="The VED Team" 
                    className={styles.bgImage} 
                />
                <div className={styles.overlay}></div>
            </div>
            
            <div className={styles.content} ref={contentRef}>
                <h2 className={styles.title}>THE ARCHITECTS<br />OF TOMORROW</h2>
                <p className={styles.subtitle}>A collective of engineers pushing the boundaries of silicon design and embedded systems.</p>
                <Link to="/team" className={styles.ctaButton}>
                    <span>MEET THE TEAM</span>
                    <div className={styles.ctaHoverBg}></div>
                </Link>
            </div>
        </section>
    );
}
