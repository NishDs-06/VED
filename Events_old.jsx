import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Events.module.css'

gsap.registerPlugin(ScrollTrigger)

const TYPE_COLOR = {
    WORKSHOP:    '#FFFFFF',
    TALK:        '#FFFFFF',
    COMPETITION: '#9333EA',
    HACKATHON:   '#7C3AED',
    SEMINAR:     '#6D28D9',
}

const EVENTS = [
    {
        id: 'e1',
        title: 'PowerNext-AI Hackathon',
        date: 'October 10, 2026',
        month: 'OCT 2026',
        day: '10',
        type: 'HACKATHON',
        summary: 'Flagship AI engineering hackathon with a ₹3 Lakh prize pool.',
        description: 'Organized by CPRI and MIT Bengaluru, PowerNext-AI is the premier hackathon focused on building next-generation AI and embedded systems solutions. Over a rigorous 48 hours, teams will prototype hardware-accelerated AI models and pitch to industry leaders. Top teams gain access to incubation programs.',
        location: 'MIT Bengaluru Campus',
        host: 'CPRI & MIT Bengaluru',
        tags: ['AI', 'EMBEDDED', 'HACKATHON'],
        registrationEnabled: true,
        registrationLink: 'https://www.powernext-ai.in/',
        image: '/poster_powernext.jpg',
    },
    {
        id: 'e2',
        title: 'Embedded Systems Workshop',
        date: 'October 24, 2026',
        month: 'OCT 2026',
        day: '24',
        type: 'WORKSHOP',
        summary: 'Building the future of interconnected devices and firmware.',
        description: 'A hands-on workshop covering embedded C, RTOS fundamentals, and direct hardware interfacing. Attendees will work with ARM Cortex-M microcontrollers to build a fully functional IoT sensor node from scratch.',
        location: 'EC Lab 1, MIT Bengaluru',
        host: 'VED Club Core',
        tags: ['ARM', 'RTOS', 'FIRMWARE'],
        registrationEnabled: false,
        registrationLink: '',
        image: '/poster_embedded_systems.jpg',
    },
    {
        id: 'e3',
        title: 'VLSI Design Sprint',
        date: 'November 12, 2026',
        month: 'NOV 2026',
        day: '12',
        type: 'COMPETITION',
        summary: 'Advanced silicon architectures and accelerated VLSI workflows.',
        description: 'An intensive design sprint focusing on digital logic design, synthesis, and physical design using industry-standard EDA tools. Participants will race to optimize a RISC-V core for power, performance, and area (PPA).',
        location: 'Innovation Centre, MIT Bengaluru',
        host: 'Dr. Eliza Chen',
        tags: ['VLSI', 'EDA', 'RISC-V'],
        registrationEnabled: false,
        registrationLink: '',
        image: '/poster_vlsi_sprint.jpg',
    }
]

/* ── Countdown timer hook ────────────────────────────────────── */
function useCountdown(dateString) {
    const [timeLeft, setTimeLeft] = useState(null)

    useEffect(() => {
        const target = new Date(dateString).getTime()
        if (isNaN(target)) return

        function calc() {
            const now = Date.now()
            const diff = target - now
            if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true }
            return {
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                mins: Math.floor((diff % 3600000) / 60000),
                secs: Math.floor((diff % 60000) / 1000),
                expired: false,
            }
        }

        setTimeLeft(calc())
        const id = setInterval(() => setTimeLeft(calc()), 1000)
        return () => clearInterval(id)
    }, [dateString])

    return timeLeft
}

/* ── Countdown display component ─────────────────────────────── */
function CountdownTimer({ dateString }) {
    const t = useCountdown(dateString)
    if (!t || t.expired) return null

    return (
        <div className={styles.countdown}>
            <span className={styles.countdownLabel}>Starts in</span>
            <div className={styles.countdownBlocks}>
                <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(t.days).padStart(2, '0')}</span>
                    <span className={styles.countdownSub}>D</span>
                </div>
                <span className={styles.countdownSep}>:</span>
                <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(t.hours).padStart(2, '0')}</span>
                    <span className={styles.countdownSub}>H</span>
                </div>
                <span className={styles.countdownSep}>:</span>
                <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(t.mins).padStart(2, '0')}</span>
                    <span className={styles.countdownSub}>M</span>
                </div>
                <span className={styles.countdownSep}>:</span>
                <div className={styles.countdownUnit}>
                    <span className={styles.countdownNum}>{String(t.secs).padStart(2, '0')}</span>
                    <span className={styles.countdownSub}>S</span>
                </div>
            </div>
        </div>
    )
}

/* ── Event Popup ─────────────────────────────────────────────── */
function EventPopup({ event, onClose }) {
    const [isClosing, setIsClosing] = useState(false)
    const typeColor = TYPE_COLOR[event.type] || '#FFFFFF'

    useEffect(() => {
        window.dispatchEvent(new Event('ved:popup:open'))
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        
        const handleClose = () => {
            setIsClosing(true)
            setTimeout(onClose, 250)
        }
        
        const onKey = e => e.key === 'Escape' && handleClose()
        document.addEventListener('keydown', onKey)
        return () => {
            window.dispatchEvent(new Event('ved:popup:close'))
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    const handleOverlayClick = () => {
        setIsClosing(true)
        setTimeout(onClose, 250)
    }

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`} onClick={handleOverlayClick}>
            <div className={`${styles.popup} ${isClosing ? styles.popupClosing : ''}`} onClick={e => e.stopPropagation()}>
                
                <button className={styles.closeBtn} onClick={handleOverlayClick} aria-label="Close">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                {event.image && (
                    <div className={styles.popupImageSide}>
                        <img src={event.image} alt={event.title} className={styles.popupImage} />
                        <div className={styles.popupImageOverlay} />
                    </div>
                )}

                <div className={styles.popupContentSide}>
                    <div className={styles.popupBadgeRow}>
                        <span
                            className={styles.popupTypeBadge}
                            style={{ color: typeColor, borderColor: typeColor + '33', background: typeColor + '11' }}
                        >
                            {event.type}
                        </span>
                    </div>

                    <h2 className={styles.popupName}>{event.title}</h2>
                    <p className={styles.popupSummary}>{event.summary}</p>

                    {event.registrationEnabled && (
                        <CountdownTimer dateString={event.date} />
                    )}

                    <div className={styles.metaGrid}>
                        <div className={styles.metaBox}>
                            <span className={styles.metaLabel}>Date</span>
                            <span className={styles.metaVal}>{event.date}</span>
                        </div>
                        <div className={styles.metaBox}>
                            <span className={styles.metaLabel}>Location</span>
                            <span className={styles.metaVal}>{event.location}</span>
                        </div>
                        {event.host && (
                            <div className={styles.metaBox}>
                                <span className={styles.metaLabel}>Host</span>
                                <span className={styles.metaVal}>{event.host}</span>
                            </div>
                        )}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                        <div className={styles.toolsRow}>
                            {event.tags.map(t => (
                                <span key={t} className={styles.toolPill}>{t}</span>
                            ))}
                        </div>
                    )}

                    <div className={styles.popupAboutSection}>
                        <p className={styles.popupSectionLabel}>About This Event</p>
                        <p className={styles.popupAbout}>{event.description}</p>
                    </div>

                    {event.registrationEnabled && event.registrationLink && (
                        <div className={styles.popupActions}>
                            <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.registerBtn}
                            >
                                Register Now <span className={styles.btnArrow}>↗</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── Component ───────────────────────────────────────────────── */
export default function Events() {
    const [selected, setSelected] = useState(null)
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                `.${styles.heroCard}`,
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'cubic-bezier(0.32,0.72,0,1)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
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
            id="events"
        >
            <div className={styles.sectionHeader}>
                <p className={styles.eyebrow}>Event Log</p>
                <h2 className={styles.heading}>What's Happening</h2>
                <div className={styles.headingRule} />
            </div>

            <div className={styles.eventGroup}>
                <div className={styles.heroGrid}>
                    {EVENTS.map(evt => {
                        const typeColor = TYPE_COLOR[evt.type] || '#FFFFFF'
                        return (
                            <div 
                                key={evt.id} 
                                className={styles.heroCard}
                                onClick={() => setSelected(evt)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && setSelected(evt)}
                            >
                                <div className={styles.heroGlow} />
                                <div className={styles.heroCardContent}>
                                    <div className={styles.heroInner}>
                                        <div className={styles.heroTop}>
                                            <span 
                                                className={styles.typeBadge}
                                                style={{ color: typeColor, borderColor: typeColor + '40', background: typeColor + '0f' }}
                                            >
                                                {evt.type}
                                            </span>
                                        </div>
                                        <h3 className={styles.heroTitle}>{evt.title}</h3>
                                        <p className={styles.heroSummary}>{evt.summary}</p>
                                        
                                        <div className={styles.heroMeta}>
                                            <span className={styles.heroDate}>{evt.month} {evt.day}</span>
                                            <div className={styles.cardCtaWrapper}>
                                                <span className={styles.heroCta}>View Details</span>
                                                <span className={styles.ctaIconWrapper} style={{ background: `${typeColor}22`, color: typeColor }}>↗</span>
                                            </div>
                                        </div>
                                    </div>
                                    {evt.image && (
                                        <div className={styles.heroImageContainer}>
                                            <img src={evt.image} alt={evt.title} className={styles.heroImage} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {selected && createPortal(
                <EventPopup event={selected} onClose={() => setSelected(null)} />,
                document.body
            )}
        </section>
    )
}
