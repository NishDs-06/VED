import { useState, useEffect, useRef } from 'react'
import styles from './Team.module.css'

/* ── Icons ─────────────────────────────────────────────────── */
const LinkedInIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)
const GitHubIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
)

/* ── Data ──────────────────────────────────────────────────── */
const ROW1 = [
    { id: 'rm', role: 'President', initials: 'RM', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'sg', role: 'Vice President', initials: 'SG', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'gs', role: 'General Secretary', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
]

const ROW2 = [
    { id: 'tl', role: 'Technical Lead', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'rl', role: 'Research Lead', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'el', role: 'Events Lead', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'fl', role: 'Finance Lead', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
]

const ROW3 = [
    { id: 'nd', role: 'Web & Design Lead', initials: 'ND', name: "Nishanth D'Souza", photo: null, oneLiner: 'Turns silicon specs into pixels. Built this site.', tags: ['Frontend', 'UI/UX', 'React'], linkedin: null, github: 'https://nishds-06.github.io/' },
    { id: 'wc2', role: 'Working Committee', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'wc3', role: 'Working Committee', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'wc4', role: 'Working Committee', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
]

const ROW4 = [
    { id: 'fa1', role: 'Faculty Adviser', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'fa2', role: 'Faculty Adviser', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
    { id: 'fa3', role: 'Faculty Adviser', initials: '?', name: null, photo: null, oneLiner: null, tags: [], linkedin: null, github: null },
]

/* ── Sine Wave ─────────────────────────────────────────────── */
function SineWave() {
    const ref = useRef(null)
    const raf = useRef(null)

    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let t = 0

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const draw = () => {
            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)
            const amp = 20, freq = (2 * Math.PI) / (W * 0.38)

                ;[
                    { ph: 0, a: 0.45, w: 1.4 },
                    { ph: 1.1, a: 0.18, w: 0.8 },
                    { ph: -0.7, a: 0.08, w: 0.5 },
                ].forEach(({ ph, a, w }) => {
                    ctx.beginPath()
                    ctx.strokeStyle = `rgba(168,85,247,${a})`
                    ctx.lineWidth = w
                    ctx.shadowBlur = a > 0.4 ? 10 : 0
                    ctx.shadowColor = 'rgba(168,85,247,0.35)'
                    for (let x = 0; x <= W; x += 2) {
                        const y = H / 2 + amp * Math.sin(freq * x + t + ph)
                        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    ctx.shadowBlur = 0
                })

            const dx = (t * 40) % W
            const dy = H / 2 + amp * Math.sin(freq * dx + t)
            ctx.beginPath()
            ctx.arc(dx, dy, 3, 0, Math.PI * 2)
            ctx.fillStyle = '#C084FC'
            ctx.shadowBlur = 12
            ctx.shadowColor = '#A855F7'
            ctx.fill()
            ctx.shadowBlur = 0

            t += 0.022
            raf.current = requestAnimationFrame(draw)
        }

        draw()
        return () => {
            cancelAnimationFrame(raf.current)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={ref} className={styles.sineCanvas} aria-hidden="true" />
}

/* ── Popup ─────────────────────────────────────────────────── */
function Popup({ member, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        const onKey = e => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>

                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.popupTop}>
                    <div className={styles.popupPhotoBox}>
                        {member.photo
                            ? <img src={member.photo} alt={member.name} className={styles.popupImg} />
                            : <span className={styles.popupInitials}>{member.initials}</span>
                        }
                    </div>
                    <div className={styles.popupMeta}>
                        <span className={styles.popupRoleBadge}>{member.role}</span>
                        <h3 className={styles.popupName}>{member.name || '—'}</h3>
                        {member.oneLiner && <p className={styles.popupQuote}>"{member.oneLiner}"</p>}
                    </div>
                </div>

                {member.tags.length > 0 && (
                    <div className={styles.popupSection}>
                        <span className={styles.popupSectionLabel}>Expertise</span>
                        <div className={styles.popupTags}>
                            {member.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                        </div>
                    </div>
                )}

                {(member.linkedin || member.github) && (
                    <div className={styles.popupSection}>
                        <span className={styles.popupSectionLabel}>Links</span>
                        <div className={styles.popupLinks}>
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                    <LinkedInIcon /> LinkedIn
                                </a>
                            )}
                            {member.github && (
                                <a href={member.github} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                    <GitHubIcon /> {member.id === 'nd' ? 'Portfolio' : 'GitHub'}
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <p className={styles.popupHint}>ESC or click outside to close</p>
            </div>
        </div>
    )
}

/* ── Card ──────────────────────────────────────────────────── */
function Card({ member, onClick, large }) {
    return (
        <div
            className={`${styles.card} ${large ? styles.cardLarge : ''}`}
            onClick={() => onClick(member)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick(member)}
        >
            <div className={styles.cardAccentLine} />

            <div className={styles.photoBox}>
                {member.photo
                    ? <img src={member.photo} alt={member.name || member.role} className={styles.photoImg} />
                    : (
                        <div className={styles.photoPlaceholder}>
                            <span className={styles.photoInitials}>{member.initials}</span>
                            <div className={styles.photoGrid} />
                        </div>
                    )
                }
                <div className={styles.scanLine} />
            </div>

            <div className={styles.cardBody}>
                <p className={styles.cardRole}>{member.role}</p>
                {member.name
                    ? <p className={styles.cardName}>{member.name}</p>
                    : <p className={styles.cardPlaceholder}>Coming soon</p>
                }
                {member.oneLiner && <p className={styles.cardOneLiner}>"{member.oneLiner}"</p>}
                {member.tags.length > 0 && (
                    <div className={styles.cardTags}>
                        {member.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                )}
                <div className={styles.cardFooter}>
                    {member.linkedin && <LinkedInIcon />}
                    {member.github && <GitHubIcon />}
                    <span className={styles.ctaText}>VIEW →</span>
                </div>
            </div>
        </div>
    )
}

/* ── Row ───────────────────────────────────────────────────── */
function Row({ label, sublabel, members, cols, onClick, large }) {
    const gridClass = cols === 3 ? styles.grid3 : styles.grid4
    return (
        <div className={styles.rowWrap}>
            {label && (
                <div className={styles.rowHeader}>
                    <span className={styles.rowLabel}>{label}</span>
                    {sublabel && <span className={styles.rowSublabel}>{sublabel}</span>}
                    <div className={styles.rowRule} />
                </div>
            )}
            <div className={gridClass}>
                {members.map(m => (
                    <Card key={m.id} member={m} onClick={onClick} large={large} />
                ))}
            </div>
        </div>
    )
}

/* ── Team ──────────────────────────────────────────────────── */
export default function Team() {
    const [selected, setSelected] = useState(null)

    return (
        <section className={styles.section} id="team">
            <div className={styles.header}>
                <p className={styles.eyebrow}>Our Team</p>
                <h2 className={styles.heading}>The People Behind VED</h2>
                <div className={styles.headingRule} />
                <p className={styles.sub}>Roles confirmed · Names coming soon</p>
            </div>

            <SineWave />

            <Row label="Core Committee" sublabel="Leadership & Department Heads" members={ROW1} cols={3} onClick={setSelected} large={true} />
            <Row members={ROW2} cols={4} onClick={setSelected} large={false} />
            <Row label="Working Committee" sublabel="Builders & Makers" members={ROW3} cols={4} onClick={setSelected} large={false} />
            <Row label="Faculty Advisers" sublabel="Mentors & Guides" members={ROW4} cols={3} onClick={setSelected} large={false} />

            {selected && <Popup member={selected} onClose={() => setSelected(null)} />}
        </section>
    )
}