import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Events.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ── RARITY COLOR SYSTEM ─────────────────────────────────────────
   Visual tier system for event importance. Each key maps to a hex color
   used as the accent tint on the event row and its popup shimmer bar.

   ► Add a new rarity tier: add a new key below with a hex color.
   ► Remove a rarity tier: delete its line below (update any events
     using that key in the EVENTS array, or they will fall back to
     RARITY_COLORS.default).
   ► Apply a rarity to an event: set event.rarity to match a key here.
──────────────────────────────────────────────────────────────────── */
const RARITY_COLORS = {
    legendary:  '#FFD700',   // gold — reserved for flagship events
    epic:       '#A855F7',   // purple — major workshops, talks, hackathons
    rare:       '#3B82F6',   // blue — notable seminars, guest lectures
    uncommon:   '#22C55E',   // green — regular events, meetups
    simple:     '#6B7280',   // grey — minor or administrative events
    default:    '#A855F7',   // fallback if an event's rarity key isn't found above
}

const TYPE_COLOR = {
    WORKSHOP:    '#C084FC',
    TALK:        '#A855F7',
    COMPETITION: '#9333EA',
    HACKATHON:   '#7C3AED',
    SEMINAR:     '#6D28D9',
}

/* ── EVENTS DATA ─────────────────────────────────────────────────
   Each event object defines one entry in the timeline.

   EDITABLE FIELDS FOR THE CODE MAINTAINER:
   ─────────────────────────────────────────
   • isUpcoming:          Set to true for future events, false for past events.
                          Controls whether the row shows the UPCOMING badge
                          and whether the "Register Now" button can appear.
                          No other code changes needed to toggle this.

   • registrationEnabled: Set to true to show a "Register Now" button inside
                          the popup. The button ONLY appears when BOTH
                          isUpcoming=true AND registrationEnabled=true.
                          Set to false to hide it — no other changes needed.

   • registrationLink:    URL for the registration form. Only used when
                          registrationEnabled=true and isUpcoming=true.

   • rarity:              Must match a key in RARITY_COLORS above (e.g.
                          'legendary', 'epic', 'rare', 'uncommon', 'simple').
                          If the key doesn't exist, falls back to 'default'.
                          Controls the colour tint on the event row.
──────────────────────────────────────────────────────────────────── */
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
        // Set to true/false to toggle this event's upcoming status — no other code changes needed.
        isUpcoming: false,
        // Set to true/false to toggle this event's registration button — no other code changes needed.
        registrationEnabled: false,
        registrationLink: '',
        // Must match a key in RARITY_COLORS ('legendary', 'epic', 'rare', 'uncommon', 'simple')
        rarity: 'epic',
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
        rarity: 'rare',
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
        rarity: 'uncommon',
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
        rarity: 'rare',
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
        rarity: 'legendary',
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
        // Set to true/false to toggle this event's upcoming status — no other code changes needed.
        isUpcoming: true,
        // Set to true/false to toggle this event's registration button — no other code changes needed.
        registrationEnabled: true,
        registrationLink: 'https://forms.google.com',
        rarity: 'epic',
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
        rarity: 'rare',
    },
]

/* ── Countdown timer hook ────────────────────────────────────── */
function useCountdown(dateString) {
    const [timeLeft, setTimeLeft] = useState(null)

    useEffect(() => {
        // Parse "Month DD, YYYY" format
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
    // Resolved rarity color — pulls from RARITY_COLORS, falls back to default
    const accent = RARITY_COLORS[event.rarity] || RARITY_COLORS.default
    const typeColor = TYPE_COLOR[event.type] || '#A855F7'

    useEffect(() => {
        window.dispatchEvent(new Event('ved:popup:open'))
        document.body.style.overflow = 'hidden'
        const onKey = e => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        return () => {
            window.dispatchEvent(new Event('ved:popup:close'))
            document.body.style.overflow = ''
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
                <div className={styles.popupShimmer} style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, backgroundSize: '300%' }} />

                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.popupInner}>
                    {/* Badge row — type only */}
                    <div className={styles.popupBadgeRow}>
                        <span
                            className={styles.popupTypeBadge}
                            style={{ color: typeColor, borderColor: typeColor + '33', background: typeColor + '11' }}
                        >
                            {event.type}
                        </span>
                        {event.isUpcoming && (
                            <>
                                <span className={styles.popupStatusDot} style={{ background: accent }} />
                                <span className={styles.popupStatusLabel}>Upcoming</span>
                            </>
                        )}
                    </div>

                    <h2 className={styles.popupName}>{event.title}</h2>

                    <div className={styles.popupDivider} />

                    {/* Countdown timer — only for upcoming events with registration */}
                    {event.isUpcoming && event.registrationEnabled && (
                        <CountdownTimer dateString={event.date} />
                    )}

                    {/* Meta row */}
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

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className={styles.toolsRow}>
                            {event.tags.map(t => (
                                <span key={t} className={styles.toolPill}>{t}</span>
                            ))}
                        </div>
                    )}

                    <div className={styles.popupDivider} />

                    {/* Description */}
                    <p className={styles.popupSectionLabel}>About This Event</p>
                    <p className={styles.popupAbout}>{event.description}</p>

                    {/* Register Now — only if upcoming AND registration enabled */}
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
    const rowRefs = useRef([])

    const upcomingCount = EVENTS.filter(e => e.isUpcoming).length

    /* ── GSAP enter animation ────────────────────────────────── */
    useEffect(() => {
        const rows = rowRefs.current.filter(Boolean)
        if (rows.length === 0) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                rows,
                { opacity: 0, x: -16 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
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
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {/* ── Header ─────────────────────────────────────── */}
            <div className={styles.sectionHeader}>
                <p className={styles.eyebrow}>Event Log</p>
                <h2 className={styles.heading}>What's Happening</h2>
                <div className={styles.headingRule} />
                <div className={styles.headerDivider} />
            </div>

            {/* ── Terminal bar ────────────────────────────────── */}
            <div className={styles.terminalBar}>
                <span>
                    <span className={styles.prompt}>&gt;</span>
                    {' '}EVENT LOG — VED · MIT BANGALORE
                </span>
                <span className={styles.termRight}>
                    {upcomingCount > 0 && <span className={styles.liveDot} />}
                    {EVENTS.length} EVENTS
                </span>
            </div>

            {/* ── Timeline ───────────────────────────────────── */}
            <div className={styles.timeline}>
                {EVENTS.map((evt, i) => {
                    // Rarity accent — pulls from RARITY_COLORS, falls back to default.
                    // To reassign an event's rarity, change event.rarity to any key in RARITY_COLORS.
                    const accent = RARITY_COLORS[evt.rarity] || RARITY_COLORS.default
                    const typeColor = TYPE_COLOR[evt.type] || '#A855F7'
                    const isPast = !evt.isUpcoming
                    const isUpcoming = evt.isUpcoming

                    const rowClasses = [
                        styles.eventRow,
                        isPast ? styles.eventRowPast : '',
                        isUpcoming ? styles.eventRowUpcoming : '',
                    ].filter(Boolean).join(' ')

                    const nodeClasses = [
                        styles.timelineNode,
                        isPast ? styles.timelineNodePast : '',
                        isUpcoming ? styles.timelineNodeUpcoming : '',
                    ].filter(Boolean).join(' ')

                    return (
                        <div
                            key={evt.id}
                            ref={el => { rowRefs.current[i] = el }}
                            className={rowClasses}
                            style={{ '--rarity-color': accent }}
                            onClick={() => setSelected(evt)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setSelected(evt)}
                        >
                            {/* Rarity tint glow — fills the row background */}
                            <div
                                className={styles.rarityGlow}
                                style={{
                                    background: `linear-gradient(90deg, ${accent}12, ${accent}26 30%, ${accent}1A 70%, transparent)`,
                                }}
                            />

                            {/* Timeline node — colored by rarity */}
                            <div
                                className={nodeClasses}
                                style={isUpcoming ? {
                                    borderColor: accent + '99',
                                    background: accent + '40',
                                    boxShadow: `0 0 8px ${accent}4D`,
                                } : {}}
                            />

                            {/* Hover accent line */}
                            <div
                                className={styles.accentReveal}
                                style={{ background: `linear-gradient(180deg, transparent 0%, ${accent}99 30%, ${accent}CC 50%, ${accent}99 70%, transparent 100%)` }}
                            />

                            {/* Date column */}
                            <div className={styles.dateCol}>
                                <span className={styles.monthLabel}>{evt.month}</span>
                                <span className={styles.dayNumber}>{evt.day}</span>
                            </div>

                            {/* Content column */}
                            <div className={styles.contentCol}>
                                <span
                                    className={styles.typeBadge}
                                    style={{
                                        color: typeColor,
                                        borderColor: typeColor + '40',
                                        background: typeColor + '0f',
                                    }}
                                >
                                    {evt.type}
                                </span>
                                <h3 className={styles.eventName}>{evt.title}</h3>
                                <p className={styles.eventDesc}>{evt.summary}</p>
                                {evt.host && (
                                    <span className={styles.hostLabel}>
                                        Hosted by {evt.host}
                                    </span>
                                )}
                                {isUpcoming && (
                                    <span className={styles.upcomingBadge}>
                                        <span className={styles.upcomingDot} />
                                        UPCOMING
                                    </span>
                                )}
                            </div>

                            {/* Index counter */}
                            <span className={styles.eventIndex}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* ── Popup via portal ────────────────────────────── */}
            {selected && createPortal(
                <EventPopup event={selected} onClose={() => setSelected(null)} />,
                document.body
            )}
        </section>
    )
}
