import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const GitHubIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
)

const STATUS_CONFIG = {
    'DESIGNING': { color: '#FF3366', label: 'Designing' },
    'BUILDING': { color: '#00E5FF', label: 'Building' },
    'TESTING': { color: '#00FF66', label: 'Testing' },
    'ACTIVE': { color: '#FFE600', label: 'Active' },
}
const CATEGORY_COLOR = {
    'DEVICE': '#FF3366',
    'CIRCUIT': '#00E5FF',
    'EMBEDDED': '#00FF66',
    'DIGITAL': '#BF00FF',
    'RESEARCH': '#FFE600'
}

function ProjectPopup({ project, onClose }) {
    const accent = CATEGORY_COLOR[project.category] || '#FFFFFF'
    const statusCfg = STATUS_CONFIG[project.status] || { color: '#888', label: 'Planning' }

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

                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.popupInner}>
                    <div className={styles.popupHeader}>
                        <div className={styles.popupBadgeRow}>
                            <span className={styles.popupCategoryBadge} style={{ color: accent, background: accent + '11' }}>
                                {project.category}
                            </span>
                        </div>
                        <h2 className={styles.popupName}>{project.name}</h2>
                        <p className={styles.popupDomain}>{project.domain}</p>
                    </div>

                    <div className={styles.popupGrid}>
                        <div className={styles.popupMainContent}>
                            <p className={styles.sectionLabel}>Problem Statement</p>
                            <p className={styles.popupAbout}>{project.about}</p>

                            {project.learn && project.learn.length > 0 && (
                                <>
                                    <p className={styles.sectionLabel} style={{ marginTop: 32 }}>What You'll Learn</p>
                                    <ul className={styles.learnList}>
                                        {project.learn.map(l => (
                                            <li key={l}>
                                                <span className={styles.learnArrow} style={{ color: accent }}>→</span>
                                                {l}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div className={styles.popupSidebar}>
                            <div className={styles.sidebarBlock}>
                                <span className={styles.metaLabel}>Status</span>
                                <div className={styles.statusWrap}>
                                    <span className={styles.popupStatusDot} style={{ background: statusCfg.color }} />
                                    <span className={styles.metaVal} style={{ color: statusCfg.color }}>{statusCfg.label}</span>
                                </div>
                            </div>
                            <div className={styles.sidebarBlock}>
                                <span className={styles.metaLabel}>Team</span>
                                <span className={styles.metaVal}>{project.members} members</span>
                            </div>
                            <div className={styles.sidebarBlock}>
                                <span className={styles.metaLabel}>Cycle</span>
                                <span className={styles.metaVal}>Spring 2026</span>
                            </div>
                            <div className={styles.sidebarBlock}>
                                <span className={styles.metaLabel}>Tech Stack</span>
                                <div className={styles.toolsRow}>
                                    {project.tools && project.tools.map(t => <span key={t} className={styles.toolPill}>{t}</span>)}
                                </div>
                            </div>
                            <div className={styles.sidebarBlock} style={{ marginTop: 'auto', paddingTop: '16px' }}>
                                {project.github ? (
                                    <a href={project.github} target="_blank" rel="noreferrer" className={styles.actionGhost}>
                                        <GitHubIcon /> View Repository
                                    </a>
                                ) : (
                                    <span className={styles.actionGhost} style={{ opacity: 0.3, cursor: 'not-allowed' }}>
                                        <GitHubIcon /> Code Private
                                    </span>
                                )}
                            </div>
                        </div>
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
    },
    {
        id: 'tsing-hua',
        name: 'NTHU Taiwan Collaboration',
        domain: 'Research / International Relations',
        category: 'RESEARCH',
        status: 'ACTIVE',
        members: 12,
        tools: ['VLSI DESIGN', 'FABRICATION', 'EMBEDDED'],
        about: 'Official affiliation and delegation visit to National Tsing Hua University (NTHU), Taiwan, exploring collaborative research in semiconductor technology, fabrication, and embedded systems.',
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
        if (!listRef.current) return;
        
        const ctx = gsap.context(() => {
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
        }, listRef)
        
        return () => {
            ctx.revert()
        }
    }, [])

    return (
                <section className={styles.section} id="projects" ref={containerRef}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className={styles.introText} ref={introRef}>
                <span className={styles.introEyebrow}>VED · MIT Bangalore · 2026</span>
                <span className={styles.introWord}>PROJECTS</span>
                <span className={styles.introWord}>& RESEARCH</span>
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
