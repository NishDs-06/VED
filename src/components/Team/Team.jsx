import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Team.module.css'

/* ── Real team members ───────────────────────────────────────── */
const MEMBERS = [
    {
        name: 'Raagmanas Madhukar',
        role: 'President',
        initials: 'RM',
        tier: 'leadership',
    },
    {
        name: 'Siddharth Gaur',
        role: 'Vice President',
        initials: 'SG',
        tier: 'leadership',
    },
    {
        name: '——',
        role: 'General Secretary',
        initials: '?',
        tier: 'leadership',
        ghost: true,
    },
    {
        name: '——',
        role: 'Technical Lead',
        initials: '?',
        tier: 'lead',
        ghost: true,
    },
    {
        name: '——',
        role: 'Research Lead',
        initials: '?',
        tier: 'lead',
        ghost: true,
    },
    {
        name: '——',
        role: 'Events Lead',
        initials: '?',
        tier: 'lead',
        ghost: true,
    },
    {
        name: '——',
        role: 'Finance Lead',
        initials: '?',
        tier: 'lead',
        ghost: true,
    },
    {
        name: '——',
        role: 'Faculty Advisor',
        initials: '?',
        tier: 'faculty',
        ghost: true,
    },
]

/* ── Main component ──────────────────────────────────────────── */
export default function Team() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const [focused, setFocused] = useState(-1)

    useEffect(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        // Wait a tick so layout is settled
        const raf = requestAnimationFrame(() => {
            const trackW = track.scrollWidth
            const offset = trackW - window.innerWidth + 80

            if (offset <= 0) return  // no scroll needed if cards fit

            const st = ScrollTrigger.create({
                trigger: section,
                pin: true,
                start: 'top top',
                end: () => `+=${offset}`,
                scrub: 1.2,
                onUpdate(self) {
                    gsap.set(track, { x: -self.progress * offset })

                    // Which card is closest to center?
                    const cards = track.querySelectorAll('[data-card]')
                    const mid = window.innerWidth / 2
                    let closest = -1, minDist = Infinity
                    cards.forEach((card, i) => {
                        const rect = card.getBoundingClientRect()
                        const dist = Math.abs(rect.left + rect.width / 2 - mid)
                        if (dist < minDist) { minDist = dist; closest = i }
                    })
                    setFocused(closest)
                },
            })

            return () => st.kill()
        })

        return () => cancelAnimationFrame(raf)
    }, [])

    return (
        <section ref={sectionRef} className={styles.teamSection} id="team">
            <div className={styles.sectionHeader}>
                <p className={styles.label}>The People</p>
                <h2 className={styles.heading}>Leadership</h2>
                <div className={styles.rule} />
            </div>

            <div className={styles.trackWrap}>
                <div ref={trackRef} className={styles.track}>
                    {MEMBERS.map((m, i) => (
                        <div
                            key={i}
                            data-card={i}
                            data-tier={m.tier}
                            className={`${styles.card} ${m.ghost ? styles.ghost : ''} ${focused === i ? styles.focused : ''}`}
                            style={{ opacity: focused === -1 ? 1 : focused === i ? 1 : 0.45 }}
                        >
                            <div className={styles.avatar}>
                                {m.ghost ? <span className={styles.ghostMark}>?</span> : (
                                    <span className={styles.initials}>{m.initials}</span>
                                )}
                            </div>
                            <div className={styles.info}>
                                <p className={styles.name}>{m.name}</p>
                                <p className={styles.role}>{m.role}</p>
                            </div>
                            {!m.ghost && (
                                <div className={styles.activeRow}>
                                    <span className={styles.dot} />
                                    <span className={styles.activeTxt}>Active 2026</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
