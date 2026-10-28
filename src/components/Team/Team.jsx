import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { COMMITTEES, MEMBERS } from './team_data'
import styles from './Team.module.css'

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

/* ── Dock ──────────────────────────────────────────────────────
 * A row of uncropped photo cards. On hover-capable devices the cards
 * magnify around the cursor like the macOS dock: each card's scale comes
 * from its distance to the pointer, and neighbours slide aside so nothing
 * overlaps. Transform-only, and the loop only runs while something moves.
 */
const MAX_SCALE = 2
const RADIUS = 210
const GAP = 10
const SHEET_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MIN_BASE = 72

const initials = name => name.replace(/^Dr\.\s*/, '').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()

// Photo, or a black placeholder with initials until the photo arrives
function Portrait({ m, size }) {
    if (!m.img) return <span className={styles.placeholder} aria-hidden="true"><span>{initials(m.name)}</span></span>
    return size === 'sm'
        ? <img src={`/team/${m.img}-sm.webp`} width={Math.round(320 * m.w / m.h)} height={320} alt="" loading="lazy" decoding="async" draggable="false" />
        : <img key={m.id} src={`/team/${m.img}.webp`} width={m.w} height={m.h} alt={m.name} decoding="async" />
}

/* Splits a committee into the fewest balanced rows that keep cards at least
   MIN_BASE tall, so a growing committee wraps instead of shrinking to slivers */
function Dock({ members, openId, onOpen, registerCard }) {
    const wrapRef = useRef(null)
    const [layout, setLayout] = useState({ base: 96, rows: [members] })
    const [active, setActive] = useState(null)

    useLayoutEffect(() => {
        const wrap = wrapRef.current
        const fit = () => {
            // Leave headroom for the row to widen while magnified (about one radius of growth)
            const W = wrap.clientWidth - (canHover() ? (MAX_SCALE - 1) * RADIUS : 0)
            const max = members.length <= 3 ? 168 : 120
            let best = null
            for (let k = 1; k <= members.length; k++) {
                const per = Math.ceil(members.length / k)
                const rows = Array.from({ length: k }, (_, r) => members.slice(r * per, (r + 1) * per)).filter(r => r.length)
                const base = Math.min(...rows.map(r =>
                    (W - GAP * (r.length - 1)) / r.reduce((sum, m) => sum + m.w / m.h, 0)))
                best = { base: Math.floor(Math.min(max, base)), rows }
                if (base >= MIN_BASE) break
            }
            setLayout(prev => prev.base === best.base && prev.rows.length === best.rows.length ? prev : best)
        }
        fit()
        const ro = new ResizeObserver(fit)
        ro.observe(wrap)
        return () => ro.disconnect()
    }, [members])

    // On touch screens the dock is a single swipeable strip
    const rows = canHover() ? layout.rows : [members]
    const shown = active && members.find(m => m.id === active)

    return (
        <div className={styles.dockWrap} ref={wrapRef} style={{ '--h': `${layout.base}px`, '--lift': `${layout.base * (MAX_SCALE - 1)}px` }}>
            <div className={styles.dockRows}>
                {rows.map((row, r) => (
                    <DockRow
                        key={r}
                        members={row}
                        offset={rows.slice(0, r).reduce((n, x) => n + x.length, 0)}
                        base={layout.base}
                        openId={openId}
                        onOpen={onOpen}
                        registerCard={registerCard}
                        onActive={setActive}
                    />
                ))}
            </div>
            <p className={styles.caption} aria-hidden="true">
                {shown ? (
                    <span key={shown.id} className={styles.captionInner}>
                        <span className={styles.captionRole}>{shown.role}</span>
                        <span className={styles.captionName}>{shown.name}</span>
                    </span>
                ) : (
                    <span className={styles.captionIdle}>Hover to browse · click to open</span>
                )}
            </p>
        </div>
    )
}

function DockRow({ members, offset, base, openId, onOpen, registerCard, onActive }) {
    const rowRef = useRef(null)
    const cardRefs = useRef([])

    useEffect(() => {
        if (!canHover() || reduceMotion()) return
        const row = rowRef.current
        const cards = cardRefs.current.slice(0, members.length)
        const n = cards.length
        const cur = new Array(n).fill(1)
        const target = new Array(n).fill(1)
        let centers = [], widths = [], pointerX = null, raf = 0, lastActive = -1

        const measure = () => {
            centers = cards.map(c => c.offsetLeft + c.offsetWidth / 2)
            widths = cards.map(c => c.offsetWidth)
        }

        const frame = () => {
            let moving = false
            for (let i = 0; i < n; i++) {
                const d = pointerX === null ? Infinity : Math.abs(pointerX - centers[i])
                target[i] = d < RADIUS ? 1 + (MAX_SCALE - 1) * (Math.cos(Math.PI * d / RADIUS) + 1) / 2 : 1
                const next = cur[i] + (target[i] - cur[i]) * 0.2
                if (Math.abs(target[i] - next) > 0.001) moving = true
                cur[i] = Math.abs(target[i] - next) > 0.001 ? next : target[i]
            }
            // Grow from the bottom centre and push neighbours outward so the row stays centred
            const extra = cur.map((s, i) => widths[i] * (s - 1))
            const total = extra.reduce((a, b) => a + b, 0)
            let before = 0
            for (let i = 0; i < n; i++) {
                const after = total - before - extra[i]
                cards[i].style.transform = `translateX(${(before - after) / 2}px) scale(${cur[i]})`
                cards[i].style.zIndex = cur[i] > 1.01 ? Math.round(cur[i] * 10) : ''
                before += extra[i]
            }

            let nearest = -1
            if (pointerX !== null) {
                let best = Infinity
                centers.forEach((c, i) => { const d = Math.abs(pointerX - c); if (d < best) { best = d; nearest = i } })
            }
            if (nearest !== lastActive) {
                lastActive = nearest
                if (nearest >= 0) onActive(members[nearest].id)
            }

            raf = moving ? requestAnimationFrame(frame) : 0
        }
        const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }

        const onMove = e => {
            pointerX = e.clientX - row.getBoundingClientRect().left
            kick()
        }
        const onEnter = e => { measure(); onMove(e) }
        const onLeave = () => { pointerX = null; onActive(id => (members.some(m => m.id === id) ? null : id)); kick() }
        // Keyboard focus magnifies the focused card too
        const onFocusIn = e => {
            const i = cards.indexOf(e.target)
            if (i < 0) return
            measure(); pointerX = centers[i]; kick()
        }
        const onFocusOut = e => { if (!row.contains(e.relatedTarget)) onLeave() }

        row.addEventListener('pointerenter', onEnter)
        row.addEventListener('pointermove', onMove)
        row.addEventListener('pointerleave', onLeave)
        row.addEventListener('focusin', onFocusIn)
        row.addEventListener('focusout', onFocusOut)
        return () => {
            cancelAnimationFrame(raf)
            row.removeEventListener('pointerenter', onEnter)
            row.removeEventListener('pointermove', onMove)
            row.removeEventListener('pointerleave', onLeave)
            row.removeEventListener('focusin', onFocusIn)
            row.removeEventListener('focusout', onFocusOut)
            cards.forEach(c => { c.style.transform = ''; c.style.zIndex = '' })
        }
    }, [members, base, onActive])

    return (
        <div className={styles.dock} ref={rowRef}>
            {members.map((m, i) => (
                <button
                    key={m.id}
                    type="button"
                    className={`${styles.card} ${openId === m.id ? styles.cardHidden : ''}`}
                    style={{ '--a': m.w / m.h, '--i': offset + i }}
                    ref={el => { cardRefs.current[i] = el; registerCard(m.id, el) }}
                    onClick={e => onOpen(m.id, e.currentTarget)}
                    aria-label={`${m.name}, ${m.role}`}
                >
                    <span className={styles.cardInner}>
                        <Portrait m={m} size="sm" />
                    </span>
                    <span className={styles.cardLabel} aria-hidden="true">
                        <span className={styles.cardLabelRole}>{m.role}</span>
                        <span className={styles.cardLabelName}>{m.name}</span>
                    </span>
                </button>
            ))}
        </div>
    )
}

/* ── Member sheet ──────────────────────────────────────────────
 * Apple-style detail view: the photo flies from its card to the sheet
 * (FLIP with WAAPI, transform only) while the surface and copy fade in.
 * Closing flies the photo back to whichever member's card is showing.
 */
function MemberSheet({ list, index, committeeTitle, getCard, onIndex, onClosed }) {
    const m = list[index]
    const backdropRef = useRef(null)
    const surfaceRef = useRef(null)
    const photoRef = useRef(null)
    const infoRef = useRef(null)
    const closeRef = useRef(null)
    const closing = useRef(false)

    const flight = (card, photo) => {
        const from = card.getBoundingClientRect()
        const to = photo.getBoundingClientRect()
        const s = from.width / to.width
        return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${s})`
    }

    useLayoutEffect(() => {
        window.dispatchEvent(new Event('ved:popup:open'))
        document.documentElement.style.overflow = 'hidden'
        const card = getCard(m.id)
        const photo = photoRef.current
        const still = reduceMotion() || !card
        backdropRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' })
        if (!still) {
            photo.animate([{ transform: flight(card, photo) }, { transform: 'none' }], { duration: 560, easing: SHEET_EASE })
        }
        const fadeIn = still ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }]
        surfaceRef.current.animate([{ opacity: 0, transform: still ? 'none' : 'scale(0.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: SHEET_EASE })
        infoRef.current.animate(fadeIn, { duration: 420, delay: 90, easing: SHEET_EASE, fill: 'backwards' })
        closeRef.current.focus({ preventScroll: true })
        return () => {
            window.dispatchEvent(new Event('ved:popup:close'))
            document.documentElement.style.overflow = ''
        }
        // Runs once per open; navigation inside the sheet swaps content without a flight
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const close = () => {
        if (closing.current) return
        closing.current = true
        const card = getCard(m.id)
        const photo = photoRef.current
        const r = card?.getBoundingClientRect()
        const visible = r && r.bottom > 0 && r.top < window.innerHeight
        const opts = { duration: 300, easing: SHEET_EASE, fill: 'forwards' }
        backdropRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' })
        surfaceRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'forwards' })
        infoRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-out', fill: 'forwards' })
        const anim = visible && !reduceMotion()
            ? photo.animate([{ transform: 'none' }, { transform: flight(card, photo) }], opts)
            : photo.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.96)' }], { ...opts, duration: 200 })
        anim.finished.then(() => {
            onClosed()
            card?.focus({ preventScroll: true })
        })
    }

    const step = dir => onIndex((index + dir + list.length) % list.length)

    useEffect(() => {
        const onKey = e => {
            if (e.key === 'Escape') close()
            else if (list.length > 1 && e.key === 'ArrowRight') step(1)
            else if (list.length > 1 && e.key === 'ArrowLeft') step(-1)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    })

    const links = [
        m.linkedin && { href: m.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
        m.github && { href: m.github, label: 'GitHub', Icon: GitHubIcon },
        m.instagram && { href: m.instagram, label: 'Instagram', Icon: InstagramIcon },
    ].filter(Boolean)

    return (
        <div className={styles.sheetLayer} role="dialog" aria-modal="true" aria-label={`${m.name}, ${m.role}`}>
            <div className={styles.backdrop} ref={backdropRef} onClick={close} />
            <div className={styles.sheet}>
                <div className={styles.surface} ref={surfaceRef} />
                <div className={`${styles.sheetPhoto} ${m.img ? '' : styles.sheetPhotoEmpty}`} ref={photoRef} style={{ '--a': m.w / m.h, backgroundImage: m.img ? `url(/team/${m.img}-sm.webp)` : 'none' }}>
                    <Portrait m={m} size="lg" />
                </div>
                <div className={styles.sheetInfo} ref={infoRef}>
                    <div className={styles.sheetMeta}>
                        <span>{committeeTitle}</span>
                        <span className={styles.sheetCount}>
                            {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                        </span>
                    </div>
                    <div key={m.id} className={styles.sheetBody}>
                        <p className={styles.sheetRole}>{m.role}</p>
                        <h3 className={styles.sheetName}>{m.name}</h3>
                        {(m.oneLiner || m.qual) && <p className={styles.sheetText}>{m.oneLiner || m.qual}</p>}
                        {m.tags?.length > 0 && (
                            <ul className={styles.sheetTags}>
                                {m.tags.map(t => <li key={t}>{t}</li>)}
                            </ul>
                        )}
                        {links.length > 0 && (
                            <div className={styles.sheetLinks}>
                                {links.map(({ href, label, Icon }) => (
                                    <a key={label} href={href} target="_blank" rel="noreferrer">
                                        <Icon /> {label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    {list.length > 1 && (
                        <div className={styles.sheetNav}>
                            <button type="button" onClick={() => step(-1)} aria-label="Previous member">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <button type="button" onClick={() => step(1)} aria-label="Next member">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    )}
                </div>
                <button type="button" className={styles.sheetClose} ref={closeRef} onClick={close} aria-label="Close">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
            </div>
        </div>
    )
}

/* ── Committee section ─────────────────────────────────────── */
function Committee({ index, title, members, openId, onOpen, registerCard }) {
    const ref = useRef(null)
    const [seen, setSeen] = useState(false)

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setSeen(true); io.disconnect() }
        }, { rootMargin: '0px 0px -15% 0px' })
        io.observe(ref.current)
        return () => io.disconnect()
    }, [])

    return (
        <section className={`${styles.committee} ${seen ? styles.isIn : ''}`} ref={ref} aria-labelledby={`committee-${index}`}>
            <header className={styles.committeeHead}>
                <span className={styles.committeeIndex}>{String(index + 1).padStart(2, '0')}</span>
                <h2 className={styles.committeeTitle} id={`committee-${index}`}>
                    <span>{title}</span>
                </h2>
                <span className={styles.committeeCount}>
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                </span>
            </header>
            <Dock members={members} openId={openId} onOpen={onOpen} registerCard={registerCard} />
        </section>
    )
}

/* ── Team ──────────────────────────────────────────────────── */
export default function Team() {
    const [open, setOpen] = useState(null) // { committee, index }
    const cards = useRef(new Map())

    const groups = useMemo(() => COMMITTEES
        .map(c => ({ ...c, members: MEMBERS.filter(m => m.committee === c.id) }))
        .filter(c => c.members.length > 0), [])

    const registerCard = useCallback((id, el) => {
        if (el) cards.current.set(id, el)
        else cards.current.delete(id)
    }, [])
    const getCard = useCallback(id => cards.current.get(id), [])

    const openGroup = open && groups.find(g => g.id === open.committee)
    const openId = openGroup ? openGroup.members[open.index].id : null

    return (
        <div className={styles.page}>
            <div className={styles.bgGlow1} aria-hidden="true" />
            <div className={styles.bgGlow2} aria-hidden="true" />

            <header className={styles.landing}>
                <span className={styles.introEyebrow}>VED · MIT Bangalore · 2026</span>
                <h1 className={styles.introTitle}>
                    <span className={styles.introLine}><span>Our</span></span>
                    <span className={styles.introLine}><span>Team</span></span>
                </h1>
                <div className={styles.scrollHint} aria-hidden="true">
                    <span className={styles.scrollHintLine} />
                    scroll to explore
                    <span className={styles.scrollHintLine} />
                </div>
            </header>

            {groups.map((g, gi) => (
                <Committee
                    key={g.id}
                    index={gi}
                    title={g.title}
                    members={g.members}
                    openId={openId}
                    registerCard={registerCard}
                    onOpen={id => setOpen({ committee: g.id, index: g.members.findIndex(m => m.id === id) })}
                />
            ))}

            {openGroup && createPortal(
                <MemberSheet
                    list={openGroup.members}
                    index={open.index}
                    committeeTitle={openGroup.title}
                    getCard={getCard}
                    onIndex={i => setOpen(o => ({ ...o, index: i }))}
                    onClosed={() => setOpen(null)}
                />,
                document.body
            )}
        </div>
    )
}
