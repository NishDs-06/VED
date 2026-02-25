import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Team.module.css'

/* ── SVG Icons ───────────────────────────────────────────────── */
const GitHubIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
)
const LinkedInIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

/* ── Team data ───────────────────────────────────────────────── */
const TEAM = [
    {
        id: 'rm', ghost: false,
        name: 'Raagmanas Madhukar', role: 'President', initials: 'RM',
        oneLiner: 'Keeps the oscilloscope running and the team from oscillating.',
        linkedin: 'https://linkedin.com/in/raagmanas-madhukar',
        github: 'https://github.com/raagmanas',
        tags: ['Digital Design', 'RTL', 'Team Ops'],
    },
    {
        id: 'sg', ghost: false,
        name: 'Siddharth Gaur', role: 'Vice President', initials: 'SG',
        oneLiner: 'Writes Verilog faster than most people write emails.',
        linkedin: 'https://linkedin.com/in/siddharth-gaur',
        github: 'https://github.com/siddharthgaur',
        tags: ['Architecture', 'FPGA', 'SV'],
    },
    { id: 'gs', ghost: true, role: 'General Secretary', initials: '?', name: null, oneLiner: null, linkedin: null, github: null, tags: [] },
    { id: 'tl', ghost: true, role: 'Technical Lead', initials: '?', name: null, oneLiner: null, linkedin: null, github: null, tags: [] },
    { id: 'rl', ghost: true, role: 'Research Lead', initials: '?', name: null, oneLiner: null, linkedin: null, github: null, tags: [] },
    { id: 'el', ghost: true, role: 'Events Lead', initials: '?', name: null, oneLiner: null, linkedin: null, github: null, tags: [] },
    { id: 'fl', ghost: true, role: 'Finance Lead', initials: '?', name: null, oneLiner: null, linkedin: null, github: null, tags: [] },
]

/* ── Sine-wave Canvas ────────────────────────────────────────── */
function SineWaveCanvas() {
    const canvasRef = useRef(null)
    const rafRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let t = 0

        function resize() {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        function draw() {
            const W = canvas.width
            const H = canvas.height
            ctx.clearRect(0, 0, W, H)

            const amplitude = 28
            const freq = (2 * Math.PI) / (W * 0.38) // one full wave per ~38% width
            const speed = 0.025

            // Draw 3 layered sine waves with different phase + opacity
            const waves = [
                { phase: 0, alpha: 0.35, lw: 1.2 },
                { phase: 1.1, alpha: 0.18, lw: 0.8 },
                { phase: -0.7, alpha: 0.10, lw: 0.5 },
            ]

            waves.forEach(({ phase, alpha, lw }) => {
                ctx.beginPath()
                ctx.strokeStyle = `rgba(123,53,232,${alpha})`
                ctx.lineWidth = lw
                ctx.shadowBlur = alpha > 0.3 ? 8 : 0
                ctx.shadowColor = 'rgba(123,53,232,0.3)'

                for (let x = 0; x <= W; x += 2) {
                    const y = H / 2 + amplitude * Math.sin(freq * x + t + phase)
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                }
                ctx.stroke()
                ctx.shadowBlur = 0
            })

            // Pulsing dot that rides the primary wave
            const dotX = (t * 40) % W
            const dotY = H / 2 + amplitude * Math.sin(freq * dotX + t)
            ctx.beginPath()
            ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
            ctx.fillStyle = '#7B35E8'
            ctx.shadowBlur = 12
            ctx.shadowColor = '#7B35E8'
            ctx.fill()
            ctx.shadowBlur = 0

            t += speed
            rafRef.current = requestAnimationFrame(draw)
        }

        draw()
        return () => {
            cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className={styles.sineCanvas} aria-hidden="true" />
}

/* ── Popup ───────────────────────────────────────────────────── */
function MemberPopup({ member, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const onKey = e => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

                {/* Header */}
                <div className={styles.popupHeader}>
                    <span className={styles.popupInitials}>{member.initials}</span>
                    <div>
                        <div className={styles.popupName}>{member.name}</div>
                        <div className={styles.popupRole}>{member.role}</div>
                    </div>
                </div>

                <div className={styles.popupDivider} />

                <p className={styles.popupQuote}>"{member.oneLiner}"</p>

                {member.tags.length > 0 && (
                    <div className={styles.popupTags}>
                        {member.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                )}

                <div className={styles.popupDivider} />

                <div className={styles.popupLinks}>
                    {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                            <LinkedInIcon /> LinkedIn
                        </a>
                    )}
                    {member.github && (
                        <a href={member.github} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                            <GitHubIcon /> GitHub
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── Card ────────────────────────────────────────────────────── */
function TeamCard({ member, onClick }) {
    if (member.ghost) {
        return (
            <div className={`${styles.card} ${styles.ghost}`} aria-hidden="true">
                <div className={styles.cardTop}>
                    <span className={styles.cardInitials}>{member.initials}</span>
                    <span className={styles.cardRole}>{member.role}</span>
                </div>
                <div className={styles.cardDivider} />
                <p className={styles.cardPlaceholder}>Recruitment open</p>
            </div>
        )
    }
    return (
        <div
            className={styles.card}
            onClick={() => onClick(member)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick(member)}
            aria-label={`${member.name} — click for details`}
        >
            <div className={styles.cardTop}>
                <span className={styles.cardInitials}>{member.initials}</span>
                <span className={styles.cardRole}>{member.role}</span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardName}>{member.name}</p>
            {member.oneLiner && <p className={styles.cardOneLiner}>"{member.oneLiner}"</p>}
            {member.tags.length > 0 && (
                <div className={styles.cardTags}>
                    {member.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
            )}
            <div className={styles.cardFooter}>
                {member.linkedin && <LinkedInIcon />}
                {member.github && <GitHubIcon />}
                <span className={styles.cardCta}>TAP FOR BIO →</span>
            </div>
        </div>
    )
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Team() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const [selected, setSelected] = useState(null)

    // No GSAP pin — use CSS overflow-x scroll on trackWrap

    const realCount = TEAM.filter(m => !m.ghost).length

    return (
        <section ref={sectionRef} className={styles.section} id="team">

            {/* Header */}
            <div className={styles.header}>
                <p className={styles.eyebrow}>Our Team</p>
                <h2 className={styles.heading}>The People Behind VED</h2>
                <div className={styles.rule} />
                <p className={styles.sub}>{realCount} confirmed · {TEAM.length - realCount} positions open</p>
            </div>

            {/* Sinusoidal wave */}
            <SineWaveCanvas />

            {/* Scrollable track */}
            <div className={styles.trackWrap}>
                <div ref={trackRef} className={styles.track}>
                    {TEAM.map(m => (
                        <TeamCard key={m.id} member={m} onClick={setSelected} />
                    ))}
                </div>
            </div>

            {/* Popup */}
            {selected && <MemberPopup member={selected} onClose={() => setSelected(null)} />}
        </section>
    )
}
