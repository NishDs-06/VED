import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const STATUS_CONFIG = {
    'NOT_STARTED': { color: '#FF9900', label: 'Not Started (Recruiting Soon)' },
    'DESIGNING': { color: '#FF3366', label: 'Designing' },
    'BUILDING': { color: '#00E5FF', label: 'Building' },
    'TESTING': { color: '#00FF66', label: 'Testing' },
    'ACTIVE': { color: '#FFE600', label: 'Active' },
    'LIT_REVIEW': { color: '#B388FF', label: 'Literature Review' },
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PROJECTS = [
    {
        id: 'puf-credential',
        name: 'PUF-Anchored Secure Document Issuance',
        domain: 'Hardware Security / FPGA / Blockchain',
        category: 'DIGITAL',
        status: 'NOT_STARTED',
        members: 8,
        tools: ['Vivado', 'SystemVerilog', 'SRAM PUF', 'ECDSA', 'Blockchain', 'Python'],
        about: 'A hardware-rooted credential system for issuing and verifying university degree certificates. An SRAM PUF implemented on a Nexys A7 FPGA generates the issuer\'s cryptographic key, which is used to sign certificate hashes; blockchain stores the issuer\'s public key, credential hash, and revocation status for tamper-evident verification.',
    },
    {
        id: 'fpga-rfid',
        name: 'FPGA Multi-Factor Asset Authentication',
        domain: 'Hardware Security / RF / Industrial IoT',
        category: 'EMBEDDED',
        status: 'NOT_STARTED',
        members: 5,
        tools: ['Nexys A7', 'SystemVerilog', 'PN532', 'MATLAB', 'GNU Radio', 'RF Signal Processing'],
        about: 'A physical-layer authentication system for detecting cloned industrial assets. Combines RF fingerprinting with phase-based proximity verification on an FPGA to verify both physical identity and presence, providing resistance against cloning, emulation, and relay attacks.',
    },
    {
        id: 'chipdna-x',
        name: 'ChipDNA-X: Semiconductor Forensics',
        domain: 'Analog Devices / Semiconductor Forensics',
        category: 'CIRCUIT',
        status: 'NOT_STARTED',
        members: 5,
        tools: ['STM32', 'ESP32', 'ADS1115', 'PCB Design', 'Embedded Firmware'],
        about: 'An embedded semiconductor forensics platform that measures current, voltage, power and temperature signatures of ICs to generate repeatable electrical fingerprints to identify counterfeit, recycled, or tampered semiconductor devices.',
    },
    {
        id: 'rdf-bti-cmos',
        name: 'RDF and BTI Effects on Nanoscale CMOS',
        domain: 'Semiconductor Device Physics',
        category: 'DEVICE',
        status: 'LIT_REVIEW',
        members: '3–4',
        tools: ['TCAD'],
        about: 'A TCAD study of how random dopant fluctuation (RDF) and bias temperature instability (BTI) degrade threshold voltage and reliability in nanoscale CMOS transistors.',
    },
    {
        id: 'sar-adc-comparator',
        name: 'Dynamic Latch Comparator for SAR ADC',
        domain: 'Circuits',
        category: 'CIRCUIT',
        status: 'LIT_REVIEW',
        members: '3–4',
        tools: ['Cadence'],
        about: 'Design and characterisation of a low-power dynamic latch comparator, the core decision element of a successive-approximation (SAR) ADC, optimised for speed, offset and energy per conversion.',
    },
    {
        id: 'self-heating-ro',
        name: 'Self-Heating Effects in CMOS Ring Oscillators',
        domain: 'Semiconductor Device Physics',
        category: 'DEVICE',
        status: 'LIT_REVIEW',
        members: '3–4',
        tools: ['TCAD', 'Cadence'],
        about: 'Investigating how self-heating in scaled CMOS devices shifts the frequency and stability of ring oscillators, linking device-level TCAD thermal models to circuit-level behaviour in Cadence.',
    },
    {
        id: 'self-cal-ro',
        name: 'Self-Calibrating CMOS Ring Oscillator',
        domain: 'Circuits',
        category: 'CIRCUIT',
        status: 'LIT_REVIEW',
        members: '3–4',
        tools: ['Cadence'],
        about: 'A ring oscillator with on-chip calibration that compensates for process, voltage and temperature (PVT) variation to hold a stable output frequency.',
    },
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
        // Phones get fewer stars; density stays similar on the smaller screen
        const starCount = window.innerWidth <= 768 ? 1200 : 2500
        for (let i = 0; i < starCount; i++) {
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
                if (size < 2.5) ctx2d.fillRect(px - r, py - r, size, size)
                else ctx2d.drawImage(dotCanvas, 0, 0, 16, 16, px - r, py - r, size, size)
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
                                <div>{(STATUS_CONFIG[project.status] || {}).label || project.status}</div>
                                <div style={{ color: 'rgba(255,255,255,0.72)', marginTop: '4px' }}>{project.members} Team Members</div>
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
