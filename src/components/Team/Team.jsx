import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
const InstagramIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
)

/* ── Data ──────────────────────────────────────────────────── */
const ROW1 = [
    {
        id: 'rm',
        role: 'President',
        initials: 'RM',
        name: 'Raagmanas Madhukar',
        photo: '/manas.webp',
        photoPosition: 'center bottom',
        oneLiner: 'Co-founder. Building VED from the ground up.',
        tags: [],
        linkedin: 'https://www.linkedin.com/in/raagmanasmadhukar',
        github: 'https://github.com/Cipher1712',
        instagram: null,
    },
    {
        id: 'sg',
        role: 'Vice President',
        initials: 'SG',
        name: 'Siddharth Gaur',
        photo: '/sid2.webp',
        useBackground: true,
        bgPos: 'center top',
        oneLiner: 'Co-founder. Steering vision into execution.',
        tags: [],
        linkedin: 'https://www.linkedin.com/in/siddharth-gaur-471084266',
        github: null,
        instagram: null,
    },
    {
        id: 'gs',
        role: 'General Secretary',
        initials: 'AA',
        name: 'Akshansh Alawa',
        photo: '/akshansh.webp',
        photoPosition: 'center 50%',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/akshansh-alawa-96a82a20a',
        github: null,
        instagram: null,
    },
]

const ROW2 = [
    {
        id: 'hk',
        role: 'Events Head',
        initials: 'HK',
        name: 'Hafiz Khan G J',
        photo: '/hafiz.webp',
        photoPosition: 'center bottom',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/hafiz-khan-g-j-0777323a8',
        github: null,
        instagram: null,
    },
    {
        id: 'kt',
        role: 'Treasurer',
        initials: 'KT',
        name: 'Karthik Deepak Narayan',
        photo: '/karthik.webp',
        photoPosition: 'center 20%',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/karthik-deepak-narayan-5524a4393',
        github: null,
        instagram: null,
    },
    {
        id: 'rj',
        role: 'Marketing Head',
        initials: 'RJ',
        name: 'Riya Joseph',
        photo: '/riya.webp',
        photoPosition: 'center bottom',
        oneLiner: null,
        tags: [],
        linkedin: 'https://in.linkedin.com/in/riya-joseph-319244374',
        github: 'https://github.com/riyaelizabethjoseph',
        instagram: null,
    },
    {
        id: 'fm',
        role: 'Graphic Design & Media Head',
        initials: 'FM',
        name: 'Farah Manikindi',
        photo: '/farah2.webp',
        photoPosition: 'center bottom',
        oneLiner: null,
        tags: ['Design', 'Branding'],
        linkedin: 'https://www.linkedin.com/in/farah-manikindi-fm9',
        github: null,
        instagram: null,
    },
]

const ROW3 = [
    {
        id: 'nd',
        role: 'Technical Head',
        initials: 'ND',
        name: "Nishanth D'Souza",
        photo: '/nd.webp',
        photoPosition: 'center 20%',
        oneLiner: 'Turns silicon specs into pixels. Built this site.',
        tags: ['Frontend', 'UI/UX', 'React'],
        linkedin: 'https://www.linkedin.com/in/nishds30/',
        github: 'https://github.com/NishDs-06',
        instagram: null,
    },
    {
        id: 'ak',
        role: 'Project Head',
        initials: 'AK',
        name: 'Akhil George Kurian',
        photo: '/akhil.webp',
        photoPosition: 'center 10%',
        oneLiner: null,
        tags: [],
        linkedin: null,
        github: 'https://github.com/Akhil8231',
        instagram: null,
    },
    {
        id: 'sp',
        role: 'Research Head',
        initials: 'SP',
        name: 'Sreeparvathy M',
        photo: '/sree.webp',
        photoPosition: 'center 22%',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/sreeparvathy-m-4b064930b',
        github: null,
        instagram: 'https://www.instagram.com/sreeparv4thy',
    },
    {
        id: 'sc',
        role: 'Vice Research Head',
        initials: 'SC',
        name: 'Sharadhi CP',
        photo: '/sharadhi.webp',
        photoPosition: 'center 15%',
        // Removed photoZoom — causes harsh cropping. Use CSS scale if needed.
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/sharadhi-cp-53791335a',
        github: 'https://github.com/sharadhi06',
        instagram: null,
    },
    {
        id: 'jt',
        role: 'Vice Project Head',
        initials: 'JT',
        name: 'Jeevan Thanu',
        photo: '/jeevan.webp',
        photoPosition: 'center 18%',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/jeevan-thanu-399b65375',
        github: 'https://github.com/jeevanthanu836-prog',
        instagram: null,
    },
    {
        id: 'vu',
        role: 'Executive Head',
        initials: 'VU',
        name: 'Veer Upadhyay',
        photo: '/veer.webp',
        photoPosition: 'center 35%',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/veer-upadhyay-2111b5318',
        github: null,
        instagram: null,
    },
    {
        id: 'vk',
        role: 'Social Media Head',
        initials: 'VK',
        name: 'Varshini V',
        photo: '/varshini.webp',
        photoPosition: 'center 10%',
        oneLiner: null,
        tags: [],
        linkedin: 'https://www.linkedin.com/in/varshini-v-5a45a736a',
        github: 'https://github.com/varshini-v20',
        instagram: null,
    },
]

const ROW4 = [
    {
        id: 'fa1',
        role: 'Faculty Adviser',
        initials: 'SV',
        name: 'Dr. Shreshta Valasa',
        photo: '/shrestamam.webp',
        photoPosition: 'center 15%',
        qual: 'Ph.D.',
        linkedin: 'https://www.linkedin.com/in/dr-shreshta-valasa-810999258',
        github: null,
        instagram: null,
        tags: [],
        oneLiner: null,
    },
    {
        id: 'fa2',
        role: 'Faculty Adviser',
        initials: 'BS',
        name: 'Dr. Bharath Sreenivasulu V',
        photo: '/bharatsir.webp',
        photoPosition: 'center 8%',
        qual: 'Ph.D. · Post-Doc (IIT Patna)',
        linkedin: 'https://www.linkedin.com/in/bharath-sreenivasulu-v-64b4a575',
        github: null,
        instagram: null,
        tags: [],
        oneLiner: null,
    },
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
        const trail = []
        const TRAIL_LEN = 16
        const STEP = 8
        let frameCount = 0
        let startTimer = null

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const draw = () => {
            frameCount++
            // 30fps cap on all devices — wave looks identical, half the GPU work
            if (frameCount % 2 !== 0) {
                raf.current = requestAnimationFrame(draw)
                return
            }

            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)
            const amp = 22, freq = (2 * Math.PI) / (W * 0.42)

            const waves = [
                { ph: 0, a: 0.65, w: 1.8 },
                { ph: 1.1, a: 0.28, w: 0.9 },
                { ph: -0.7, a: 0.12, w: 0.5 },
            ]
            for (const { ph, a, w } of waves) {
                ctx.beginPath()
                ctx.strokeStyle = `rgba(168,85,247,${a})`
                ctx.lineWidth = w
                for (let x = 0; x <= W; x += STEP) {
                    const y = H / 2 + amp * Math.sin(freq * x + t + ph)
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                }
                ctx.stroke()
            }

            const dotX = (t * 55) % W
            const dotY = H / 2 + amp * Math.sin(freq * dotX + t)
            trail.push({ x: dotX, y: dotY })
            if (trail.length > TRAIL_LEN) trail.shift()

            if (trail.length > 2) {
                ctx.beginPath()
                ctx.moveTo(trail[0].x, trail[0].y)
                for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y)
                ctx.strokeStyle = 'rgba(192,132,252,0.5)'
                ctx.lineWidth = 2
                ctx.stroke()
            }

            ctx.beginPath()
            ctx.arc(dotX, dotY, 4, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(216,180,254,0.6)'
            ctx.fill()

            ctx.beginPath()
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#fff'
            ctx.fill()

            t += 0.020
            raf.current = requestAnimationFrame(draw)
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Delay start so canvas doesn't fire during scroll momentum
                    startTimer = setTimeout(() => {
                        if (!raf.current) raf.current = requestAnimationFrame(draw)
                    }, 120)
                } else {
                    clearTimeout(startTimer)
                    cancelAnimationFrame(raf.current)
                    raf.current = null
                }
            },
            { threshold: 0 }
        )
        observer.observe(canvas)

        return () => {
            clearTimeout(startTimer)
            cancelAnimationFrame(raf.current)
            observer.disconnect()
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={ref} className={styles.sineCanvas} aria-hidden="true" />
}

/* ── Popup ─────────────────────────────────────────────────── */
function Popup({ member, onClose }) {
    useEffect(() => {
        window.dispatchEvent(new Event('ved:popup:open'))
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        const onKey = e => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        return () => {
            window.dispatchEvent(new Event('ved:popup:close'))
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    const isFaculty = member.qual !== undefined

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
                            ? <img
                                src={member.photo}
                                alt={member.name}
                                className={styles.popupImg}
                                loading="lazy"
                                decoding="async"
                                style={member.photoPosition ? { objectPosition: member.photoPosition } : {}}
                            />
                            : <span className={styles.popupInitials}>{member.initials}</span>
                        }
                    </div>
                    <div className={styles.popupMeta}>
                        <span className={styles.popupRoleBadge}>{member.role}</span>
                        <h3 className={styles.popupName}>{member.name || '—'}</h3>
                        {isFaculty && member.qual && (
                            <p className={styles.popupQual}>{member.qual}</p>
                        )}
                        {!isFaculty && member.oneLiner && (
                            <p className={styles.popupQuote}>"{member.oneLiner}"</p>
                        )}
                    </div>
                </div>

                {member.tags && member.tags.length > 0 && (
                    <div className={styles.popupSection}>
                        <span className={styles.popupSectionLabel}>Expertise</span>
                        <div className={styles.popupTags}>
                            {member.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                        </div>
                    </div>
                )}

                {(member.linkedin || member.github || member.instagram) && (
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
                                    <GitHubIcon /> GitHub
                                </a>
                            )}
                            {member.instagram && (
                                <a href={member.instagram} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                    <InstagramIcon /> Instagram
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

            <div className={styles.photoBox} style={member.photoBackground ? { background: member.photoBackground } : {}}>
                {member.photo
                    ? member.useBackground
                        ? <div
                            className={styles.photoImg}
                            style={{
                                backgroundImage: `url(${member.photo})`,
                                backgroundSize: member.bgSize || 'cover',
                                backgroundPosition: member.bgPos || 'center 15%',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                        : <img
                            src={member.photo}
                            alt={member.name || member.role}
                            className={styles.photoImg}
                            loading="lazy"
                            decoding="async"
                            style={{
                                objectPosition: member.photoPosition || 'center 15%',
                                objectFit: 'cover',
                                ...(member.photoZoom
                                    ? { transform: `scale(${member.photoZoom})`, transformOrigin: 'center top' }
                                    : member.photoScale
                                        ? { transform: `scale(${member.photoScale})`, transformOrigin: 'center center' }
                                        : {}),
                            }}
                        />
                    : (
                        <div className={styles.photoPlaceholder}>
                            <span className={styles.photoInitials}>{member.initials}</span>
                        </div>
                    )
                }
                <div className={styles.photoOverlay} />
                <div className={styles.scanLine} />
            </div>

            <div className={styles.cardBody}>
                <p className={styles.cardRole}>{member.role}</p>
                {member.name
                    ? <p className={styles.cardName}>{member.name}</p>
                    : <p className={styles.cardPlaceholder}>Coming soon</p>
                }
                <div className={styles.cardFooterRow}>
                    {member.linkedin && <LinkedInIcon />}
                    {member.github && <GitHubIcon />}
                    {member.instagram && <InstagramIcon />}
                    <span className={styles.ctaText}>VIEW →</span>
                </div>
            </div>
        </div>
    )
}

/* ── Row ───────────────────────────────────────────────────── */
function Row({ label, sublabel, members, cols, onClick, large, constrained }) {
    const gridClass = cols === 3 ? styles.grid3 : cols === 2 ? styles.grid2 : cols === 5 ? styles.grid5 : styles.grid4
    const wrapClass = label
        ? (constrained ? styles.rowWrapConstrained : styles.rowWrap)
        : (constrained ? styles.rowWrapPlainConstrained : styles.rowWrapPlain)

    return (
        <div className={wrapClass}>
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
    const sectionRef = useRef(null)

    // Preload all member photos when Team is 2 viewports away
    // so images are already decoded by the time the user arrives
    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        let preloaded = false
        const allPhotos = [...ROW1, ...ROW2, ...ROW3, ...ROW4]
            .map(m => m.photo)
            .filter(Boolean)

        const preload = () => {
            if (preloaded) return
            preloaded = true
            allPhotos.forEach(src => {
                const img = new Image()
                img.decoding = 'async'
                img.src = src
            })
        }

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) preload() },
            { rootMargin: '200% 0px' } // fires when section is 2 viewports away
        )
        observer.observe(section)

        return () => observer.disconnect()
    }, [])

    return (
        <section className={styles.section} id="team" ref={sectionRef} style={{ position: 'relative' }}>
            <div className={styles.header}>
                <p className={styles.eyebrow}>Our Team</p>
                <h2 className={styles.heading}>The People Behind VED</h2>
                <div className={styles.headingRule} />
                <p className={styles.sub}>Spring 2026 · MIT Bangalore</p>
            </div>

            <SineWave />

            <Row label="Core Committee" sublabel="Co-founders & Leadership" members={ROW1} cols={3} onClick={setSelected} large={true} />
            <Row members={ROW2} cols={4} onClick={setSelected} large={false} />
            <Row label="Working Committee" sublabel="Builders & Makers" members={ROW3} cols={4} onClick={setSelected} large={false} />
            <Row label="Faculty Advisers" sublabel="Mentors & Guides" members={ROW4} cols={2} onClick={setSelected} large={false} constrained={true} />

            {selected && createPortal(
                <Popup member={selected} onClose={() => setSelected(null)} />,
                document.body
            )}
        </section>
    )
}