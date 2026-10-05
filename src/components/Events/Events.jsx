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
        title: 'RTL Design Fundamentals',
        date: 'September 12, 2025',
        month: 'SEP 2025',
        day: '12',
        type: 'WORKSHOP',
        summary: 'Hands-on Verilog workshop covering FSMs, pipelining, and testbench writing.',
        description: 'A full-day, hands-on workshop introducing Register-Transfer Level design with Verilog HDL. Attendees built synthesisable FSMs, pipelined datapaths, and wrote self-checking testbenches. Included live demos on Vivado with Artix-7 boards provided by the lab.',
        location: 'EC Lab 3, AB-2, MIT Bangalore',
        host: 'Raagmanas Madhukar',
        tags: ['VERILOG', 'VIVADO', 'FPGA'],
        isUpcoming: false,
        registrationEnabled: false,
        registrationLink: '',
    },
    {
        id: 'e2',
        title: 'The SKY130 Open-Source PDK',
        date: 'October 4, 2025',
        month: 'OCT 2025',
        day: '04',
        type: 'TALK',
        summary: 'Introduction to the Skywater 130nm process and open-source EDA toolchain.',
        description: 'A guest talk introducing the Skywater 130nm open-source process design kit and the full open-source EDA toolchain — from synthesis with Yosys through place-and-route with OpenROAD to GDS generation. Covered what "open silicon" means for academic labs and how VED members can tape out real chips.',
        location: 'Seminar Hall, AB-1, MIT Bangalore',
        host: 'Dr. Shreshta Valasa',
        tags: ['SKY130', 'OPENROAD', 'YOSYS'],
        isUpcoming: false,
        registrationEnabled: false,
        registrationLink: '',
    },
    {
        id: 'e3',
        title: 'Circuit Debugging Sprint',
        date: 'November 18, 2025',
        month: 'NOV 2025',
        day: '18',
        type: 'COMPETITION',
        summary: 'Timed fault-finding competition across analog and digital circuit problems.',
        description: 'A fast-paced, timed competition where teams raced to find and fix faults in pre-built analog and digital circuits. Problems ranged from misbiased BJT amplifiers to broken FSM implementations. Scores were based on accuracy and speed, with bonus points for clean documentation.',
        location: 'EC Lab 1, AB-2, MIT Bangalore',
        host: null,
        tags: ['ANALOG', 'DIGITAL', 'DEBUGGING'],
        isUpcoming: false,
        registrationEnabled: false,
        registrationLink: '',
    },
    {
        id: 'e4',
        title: 'Low-Power Design Techniques',
        date: 'January 22, 2026',
        month: 'JAN 2026',
        day: '22',
        type: 'SEMINAR',
        summary: 'Deep dive into clock gating, power domains, and sub-threshold operation.',
        description: 'An in-depth seminar covering modern low-power design techniques at the RTL, gate, and transistor levels. Topics included clock gating, multi-Vt libraries, power domain partitioning (UPF), voltage scaling, and sub-threshold circuit operation. Featured case studies from real tapeouts.',
        location: 'Seminar Hall, AB-1, MIT Bangalore',
        host: 'Dr. Bharath Sreenivasulu V',
        tags: ['LOW-POWER', 'UPF', 'CLOCK-GATING'],
        isUpcoming: false,
        registrationEnabled: false,
        registrationLink: '',
    },
    {
        id: 'e5',
        title: 'Silicon Sprint — Spring Edition',
        date: 'March 8, 2026',
        month: 'MAR 2026',
        day: '08',
        type: 'HACKATHON',
        summary: '24-hour FPGA and PCB design challenge open to all MIT BLR students.',
        description: 'VED\'s flagship 24-hour design marathon. Teams of 2–4 designed and implemented a complete system — from RTL on FPGA to a custom PCB breakout board — within a single day. Judging criteria included correctness, power efficiency, documentation quality, and creative use of constraints. Open to all MIT Bangalore students.',
        location: 'Innovation Centre, MIT Bangalore',
        host: null,
        tags: ['FPGA', 'PCB', 'HACKATHON'],
        isUpcoming: false,
        registrationEnabled: false,
        registrationLink: '',
    },
    {
        id: 'e6',
        title: 'OpenROAD Physical Design Bootcamp',
        date: 'June 20, 2026',
        month: 'JUN 2026',
        day: '20',
        type: 'WORKSHOP',
        summary: 'Full placement-and-route flow on a sample RISC-V core using OpenROAD v3.',
        description: 'A hands-on bootcamp walking participants through the complete digital physical design flow using the OpenROAD v3 toolchain. Starting from a synthesised RISC-V core netlist, attendees will perform floorplanning, global and detailed placement, clock tree synthesis, and detailed routing — culminating in GDS generation and DRC/LVS verification.',
        location: 'EC Lab 3, AB-2, MIT Bangalore',
        host: "Nishanth D'Souza",
        tags: ['OPENROAD', 'RISC-V', 'PNR'],
        isUpcoming: true,
        registrationEnabled: true,
        registrationLink: 'https://forms.google.com',
    },
    {
        id: 'e7',
        title: 'Neuromorphic Computing at Scale',
        date: 'July 11, 2026',
        month: 'JUL 2026',
        day: '11',
        type: 'TALK',
        summary: 'Guest lecture on SNN hardware deployment for edge inference workloads.',
        description: 'A guest lecture exploring how spiking neural network architectures are being deployed on custom silicon for ultra-low-power edge inference. Covers SNN encoding schemes, hardware neuron models, on-chip learning with STDP, and real-world deployment at scale on neuromorphic processors.',
        location: 'Seminar Hall, AB-1, MIT Bangalore',
        host: 'TBA',
        tags: ['SNN', 'NEUROMORPHIC', 'EDGE-AI'],
        isUpcoming: true,
        registrationEnabled: true,
        registrationLink: 'https://forms.google.com',
    },
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
                <div className={styles.popupShimmer} />

                <button className={styles.closeBtn} onClick={handleOverlayClick} aria-label="Close">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.popupInner}>
                    <div className={styles.popupBadgeRow}>
                        <span
                            className={styles.popupTypeBadge}
                            style={{ color: typeColor, borderColor: typeColor + '33', background: typeColor + '11' }}
                        >
                            {event.type}
                        </span>
                        {event.isUpcoming && (
                            <>
                                <span className={styles.popupStatusDot} />
                                <span className={styles.popupStatusLabel}>Upcoming</span>
                            </>
                        )}
                    </div>

                    <h2 className={styles.popupName}>{event.title}</h2>

                    <div className={styles.popupDivider} />

                    {event.isUpcoming && event.registrationEnabled && (
                        <CountdownTimer dateString={event.date} />
                    )}

                    <div className={styles.metaRow}>
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

                    <div className={styles.popupDivider} />

                    <p className={styles.popupSectionLabel}>About This Event</p>
                    <p className={styles.popupAbout}>{event.description}</p>

                    {event.isUpcoming && event.registrationEnabled && event.registrationLink && (
                        <>
                            <div className={styles.popupDivider} />
                            <div className={styles.popupActions}>
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.registerBtn}
                                >
                                    Register Now →
                                </a>
                            </div>
                        </>
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
    
    const upcomingEvents = EVENTS.filter(e => e.isUpcoming)
    const pastEvents = EVENTS.filter(e => !e.isUpcoming)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                `.${styles.heroCard}, .${styles.cascadeCard}`,
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

            {upcomingEvents.length > 0 && (
                <div className={styles.eventGroup}>
                    <h3 className={styles.groupLabel}>Upcoming</h3>
                    <div className={styles.heroGrid}>
                        {upcomingEvents.map(evt => {
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
                                    <div className={styles.heroInner}>
                                        <div className={styles.heroTop}>
                                            <span 
                                                className={styles.typeBadge}
                                                style={{ color: typeColor, borderColor: typeColor + '40', background: typeColor + '0f' }}
                                            >
                                                {evt.type}
                                            </span>
                                            <span className={styles.liveIndicator}>
                                                <span className={styles.liveDot} />
                                                LIVE
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
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {pastEvents.length > 0 && (
                <div className={styles.eventGroup}>
                    <h3 className={styles.groupLabel}>Archive</h3>
                    <div className={styles.cascadeStack}>
                        {pastEvents.map((evt, i) => {
                            const typeColor = TYPE_COLOR[evt.type] || '#FFFFFF'
                            const rotation = i % 2 === 0 ? '-2deg' : '2deg'
                            const xOffset = i % 2 === 0 ? '-10px' : '10px'
                            
                            return (
                                <div 
                                    key={evt.id} 
                                    className={styles.cascadeCard}
                                    style={{ zIndex: i, '--rot': rotation, '--x': xOffset }}
                                    onClick={() => setSelected(evt)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && setSelected(evt)}
                                >
                                    <div className={styles.cascadeInner}>
                                        <div className={styles.bentoTop}>
                                            <span className={styles.bentoDate}>{evt.month} {evt.day}</span>
                                            <span 
                                                className={styles.typeBadge}
                                                style={{ color: typeColor, borderColor: typeColor + '40', background: typeColor + '0f' }}
                                            >
                                                {evt.type}
                                            </span>
                                        </div>
                                        <h4 className={styles.bentoTitle}>{evt.title}</h4>
                                        <p className={styles.bentoSummary}>{evt.summary}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {selected && createPortal(
                <EventPopup event={selected} onClose={() => setSelected(null)} />,
                document.body
            )}
        </section>
    )
}
