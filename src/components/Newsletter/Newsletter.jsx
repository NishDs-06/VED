import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Newsletter.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ── SIGNAL POSTS ─────────────────────────────────────────────────
   Lightweight link-out entries to club updates on LinkedIn/Instagram.

   ► Add a post: add a new object below (keep exactly 3 active at once
     for layout consistency — remove the oldest before adding a new one).
   ► Remove a post: delete its object below.
   ► 'link' should point to the original LinkedIn/Instagram post URL.
     If link is empty or missing, the "Read More" link will not render.
──────────────────────────────────────────────────────────────────── */
const SIGNAL_POSTS = [
    {
        id: 'post-1',
        title: 'The Future of AI Is Being Engineered at the Silicon Level',
        teaser: 'As AI workloads continue to grow, the semiconductor industry is evolving to meet new demands in performance, efficiency, and scalability. From AI superchips to energy-efficient manufacturing, Nvidia and TSMC are driving the next wave of innovation.',
        link: 'https://www.linkedin.com/posts/ved-mitblr_ai-nvidia-tsmc-activity-7467938705903648768-gKZs',
    },
    {
        id: 'post-2',
        title: 'Stepping Beyond the Classroom and Into Innovation',
        teaser: 'Our students explored semiconductor fabrication through hands-on training and gained valuable exposure to real-world industry practices.',
        link: 'https://www.linkedin.com/posts/ved-mitblr_stepping-beyond-the-classroom-and-into-innovation-activity-7465378974542499840-KFji',
    },
    {
        id: 'post-3',
        title: '4-Day Fabrication Program at CMTI',
        teaser: '20 students from the BTech VLSI Design & Technology batch attended a hands-on fabrication program at CMTI — from wafer processing to MOSCAP characterisation in a cleanroom environment.',
        link: 'https://www.linkedin.com/posts/ved-mitblr_20-students-from-the-btech-vlsi-design-and-activity-7454882382551351297-CDL2',
    },
]

export default function Newsletter() {
    const sectionRef = useRef(null)
    const contentRef = useRef(null)

    /* ── GSAP enter animation ────────────────────────────────── */
    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        once: true,
                    },
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            className={styles.section}
            id="newsletter"
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <div ref={contentRef} className={styles.content}>
                {/* ── Header ─────────────────────────────────── */}
                <div className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>Dispatches</p>
                    <h2 className={styles.heading}>Stay on the Signal</h2>
                    <div className={styles.headingRule} />
                </div>

                {/* ── Posts grid ──────────────────────────────── */}
                <div className={styles.grid}>
                    {SIGNAL_POSTS.map(post => (
                        <div key={post.id} className={styles.card}>
                            <div className={styles.cardTopLine} />

                            <h3 className={styles.cardTitle}>{post.title}</h3>
                            <p className={styles.cardTeaser}>{post.teaser}</p>

                            <div className={styles.cardFooter}>
                                {post.link ? (
                                    <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.readMore}
                                    >
                                        Read More →
                                    </a>
                                ) : (
                                    <span className={styles.readMoreDisabled}>
                                        Link unavailable
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Footnote ───────────────────────────────── */}
                <p className={styles.footnote}>
                    MIT BANGALORE · VED · vedclub.mit@manipal.edu
                </p>
            </div>
        </section>
    )
}
