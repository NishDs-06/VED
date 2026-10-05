import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const STATUS_CONFIG = {
    'DESIGNING': { color: '#FF3366', label: 'Designing' },
    'BUILDING': { color: '#00E5FF', label: 'Building' },
    'TESTING': { color: '#00FF66', label: 'Testing' },
}
const CATEGORY_COLOR = {
    'DEVICE': '#FF3366',
    'CIRCUIT': '#00E5FF',
    'EMBEDDED': '#00FF66',
    'DIGITAL': '#BF00FF'
}

function ProjectPopup({ project, onClose }) {
    const accent = CATEGORY_COLOR[project.category] || '#FFFFFF'
    const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.PLANNING

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
                <div className={styles.popupShimmer} />

                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.popupInner}>
                    <div className={styles.popupBadgeRow}>
                        <span className={styles.popupCategoryBadge} style={{ color: accent, borderColor: accent + '33', background: accent + '11' }}>
                            {project.category}
                        </span>
                        <span className={styles.popupStatusDot} style={{ background: statusCfg.color }} />
                        <span className={styles.popupStatusLabel} style={{ color: statusCfg.color }}>{statusCfg.label}</span>
                    </div>

                    <h2 className={styles.popupName}>{project.name}</h2>
                    <p className={styles.popupDomain}>{project.domain}</p>

                    <div className={styles.popupDivider} />

                    <div className={styles.metaRow}>
                        <div className={styles.metaBox}>
                            <span className={styles.metaLabel}>Team</span>
                            <span className={styles.metaVal}>{project.members} members</span>
                        </div>
                        <div className={styles.metaBox}>
                            <span className={styles.metaLabel}>Cycle</span>
                            <span className={styles.metaVal}>Spring 2026</span>
                        </div>
                        <div className={styles.metaBox}>
                            <span className={styles.metaLabel}>Status</span>
                            <span className={styles.metaVal} style={{ color: statusCfg.color }}>{statusCfg.label}</span>
                        </div>
                    </div>

                    <div className={styles.toolsRow}>
                        {project.tools.map(t => <span key={t} className={styles.toolPill}>{t}</span>)}
                    </div>

                    <div className={styles.popupDivider} />

                    <p className={styles.sectionLabel}>Problem Statement</p>
                    <p className={styles.popupAbout}>{project.about}</p>

                    <p className={styles.sectionLabel} style={{ marginTop: 22 }}>What You'll Learn</p>
                    <ul className={styles.learnList}>
                        {project.learn.map(l => (
                            <li key={l}>
                                <span className={styles.learnArrow} style={{ color: accent }}>→</span>
                                {l}
                            </li>
                        ))}
                    </ul>

                    <div className={styles.popupDivider} />

                    <div className={styles.popupActions}>
                        <a href={project.github} target="_blank" rel="noreferrer" className={styles.actionGhost}>
                            <GitHubIcon /> GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PROJECTS = [
    {
        id: 'mosfet',
        name: 'Low-Leakage MOSFET',
        domain: 'Device Physics / Low-Power Design',
        category: 'DEVICE',
        status: 'DESIGNING',
        members: 3,
        tools: ['SPICE', 'CADENCE', 'SPECTRE', 'MATLAB'],
        about: 'Simulation and performance analysis of a modified MOSFET structure targeting ultra-low leakage for IoT applications.',
    },
    {
        id: 'comparator',
        name: 'Dynamic Comparator',
        domain: 'Analog / Mixed-Signal',
        category: 'CIRCUIT',
        status: 'BUILDING',
        members: 2,
        tools: ['CADENCE', 'SPECTRE', 'MATLAB', 'SPICE'],
        about: 'A low-offset dynamic latch comparator for energy-efficient SAR ADCs. Focuses on kickback noise reduction.',
    },
    {
        id: 'puf-boot',
        name: 'PUF Secure Boot',
        domain: 'Embedded Systems / Security',
        category: 'EMBEDDED',
        status: 'BUILDING',
        members: 4,
        tools: ['VIVADO', 'C', 'ARM', 'VERILOG'],
        about: 'Implementation of a physically unclonable function (PUF) to derive a root of trust for embedded system secure boot.',
    },
    {
        id: 'accelerator',
        name: 'NN Accelerator',
        domain: 'Digital VLSI',
        category: 'DIGITAL',
        status: 'TESTING',
        members: 5,
        tools: ['VERILOG', 'PYTHON', 'VIVADO'],
        about: 'RTL implementation of a systolic array based neural network accelerator targeting real-time edge inference.',
    }
]

export default function Projects() {
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
        if (!containerRef.current) return;
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=150%',
                scrub: 1,
                pin: true,
            }
        })

        // Fly camera through stars on scroll
        tl.to(camera.current, {
            z: '+=2000', // Move 2000px forward on scroll
            duration: 2,
            ease: 'power2.inOut'
        })

        // Fade out intro like a cinematic flight
        tl.to(introRef.current, {
            opacity: 0,
            scale: 1.5, // Fly towards screen
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power2.in'
        }, 0)
        
        // Staggered reveal of list items from lower middle
        tl.fromTo(itemsRef.current, {
            opacity: 0,
            y: 150,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        }, 0.5)
        
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
                <section className={styles.section} id="projects" ref={containerRef}>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
            <div className={styles.introText} ref={introRef}>
                <h2 className={styles.title}>OUR</h2>
                <h2 className={styles.titleOutline}>PROJECTS</h2>
            </div>

            <div className={styles.listWrapper} ref={listRef}>
                <div className={styles.listContainer}>
                    {PROJECTS.map((project, i) => (
                        <div 
                            key={project.id} 
                            className={styles.listItem}
                            ref={el => itemsRef.current[i] = el}
                            onClick={() => setSelected(project)}
                            style={{cursor: 'pointer'}}
                        >
                            <div className={styles.itemCategory}>
                                {project.category}
                            </div>
                            <div>
                                <h3 className={styles.itemName}>{project.name}</h3>
                                <p className={styles.itemDesc}>{project.about}</p>
                            </div>
                            <div className={styles.itemMeta}>
                                <div>{project.status}</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{project.members} Team Members</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selected && createPortal(
                <ProjectPopup project={selected} onClose={() => setSelected(null)} />,
                document.body
            )}
        </section>
    )
}
