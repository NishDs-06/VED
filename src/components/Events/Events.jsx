import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Events.module.css'

gsap.registerPlugin(ScrollTrigger)

const TYPE_COLOR = {
    'CONFERENCE': '#FF3366',
    'WORKSHOP': '#00E5FF',
    'SEMINAR': '#00FF66',
    'COMPETITION': '#BF00FF'
}

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

const EVENTS = [
    {
        id: 'silicon-symposium',
        title: 'Silicon Symposium 2026',
        date: 'MARCH 15',
        type: 'CONFERENCE',
        location: 'Main Auditorium',
        summary: 'Annual gathering of VLSI enthusiasts, featuring guest speakers from industry leaders in semiconductor design.',
    },
    {
        id: 'fpga-workshop',
        title: 'FPGA Architecture Workshop',
        date: 'APRIL 02',
        type: 'WORKSHOP',
        location: 'Hardware Lab',
        summary: 'Hands-on session on advanced FPGA routing, synthesis optimization, and timing closure techniques.',
    },
    {
        id: 'powernext-ai',
        title: 'PowerNext AI',
        date: 'APRIL 10',
        type: 'SEMINAR',
        location: 'Virtual',
        summary: 'Exploring the intersection of artificial intelligence and ultra-low power hardware accelerators.',
    },
    {
        id: 'tapeout-talks',
        title: 'Tapeout Talks: First Silicon',
        date: 'APRIL 18',
        type: 'SEMINAR',
        location: 'Virtual',
        summary: 'Alumni share their experiences and challenges taking their first chip from RTL to actual tapeout.',
    },
    {
        id: 'hackathon',
        title: 'Embedded Systems Hackathon',
        date: 'MAY 10',
        type: 'COMPETITION',
        location: 'Innovation Center',
        summary: 'A 24-hour hardware hackathon focusing on ultra-low power IoT solutions and embedded security.',
    }
]

export default function Events() {
    const [selected, setSelected] = useState(null)
    const containerRef = useRef(null)
    const introRef = useRef(null)
    const listRef = useRef(null)
    const itemsRef = useRef([])
    const canvasRef = useRef(null)
    const camera = useRef({ x: 0, y: 0, z: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx2d = canvas.getContext('2d', { alpha: false })
        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        const stars = []
        for (let i = 0; i < 4000; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 4000,
                y: (Math.random() - 0.5) * 4000,
                z: Math.random() * 4000,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random()
            })
        }

        const dotCanvas = document.createElement('canvas')
        dotCanvas.width = 16
        dotCanvas.height = 16
        const dotCtx = dotCanvas.getContext('2d')
        dotCtx.fillStyle = '#ffffff'
        dotCtx.beginPath()
        dotCtx.arc(8, 8, 8, 0, Math.PI * 2)
        dotCtx.fill()

        let raf;
        const render = () => {
            ctx2d.fillStyle = '#000000'
            ctx2d.fillRect(0, 0, width, height)

            const cx = width / 2
            const cy = height / 2
            const fl = 800
            const camZ = camera.current.z

            // Continuous slow forward drift even when not scrolling
            camera.current.z += 0.5;

            ctx2d.fillStyle = '#ffffff'
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]
                
                // Wrap stars so they loop endlessly
                let z = s.z - camZ
                while (z < -100) z += 4000;
                while (z > 3900) z -= 4000;
                
                if (z >= fl) continue;

                const scale = fl / (fl - z)
                const px = cx + s.x * scale
                const py = cy + s.y * scale

                if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) continue;

                ctx2d.globalAlpha = Math.max(0, Math.min(1, s.opacity * scale))
                const r = s.size * scale * 0.5
                const size = Math.max(1, r * 2)
                ctx2d.drawImage(dotCanvas, 0, 0, 16, 16, px - r, py - r, size, size)
            }
            raf = requestAnimationFrame(render)
        }
        raf = requestAnimationFrame(render)

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(raf)
        }
    }, [])

    useEffect(() => {
        if (!listRef.current) return;
        
        // Staggered reveal of list items from lower middle using Emil's rules
        // "Start from scale(0.95) with opacity: 0"
        gsap.fromTo(itemsRef.current, {
            opacity: 0,
            y: 50,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: listRef.current,
                start: 'top 85%',
            }
        })
        
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
                <section className={styles.section} id="events" ref={containerRef}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className={styles.introText} ref={introRef}>
                <h2 className={styles.title}>UPCOMING</h2>
                <h2 className={styles.titleOutline}>EVENTS</h2>
            </div>

            <div className={styles.listWrapper} ref={listRef}>
                <div className={styles.listContainer}>
                    {EVENTS.map((event, i) => (
                        <div 
                            key={event.id} 
                            className={styles.listItem}
                            ref={el => itemsRef.current[i] = el}
                            onClick={() => setSelected(event)}
                            style={{cursor: 'pointer'}}
                        >
                            <div className={styles.itemDate}>
                                {event.date}
                            </div>
                            <div>
                                <h3 className={styles.itemName}>{event.title}</h3>
                                <p className={styles.itemDesc}>{event.summary}</p>
                            </div>
                            <div className={styles.itemMeta}>
                                <div>{event.type}</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '0.8rem' }}>{event.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selected && createPortal(
                <EventPopup event={selected} onClose={() => setSelected(null)} />,
                document.body
            )}
        </section>
    )
}
