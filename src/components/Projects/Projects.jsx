import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

/* ── SVG Icons ───────────────────────────────────────────────── */
const GitHubIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
)

const LinkedInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

/* ── Project data ────────────────────────────────────────────── */
const PROJECTS = [
    {
        id: 'riscv',
        name: 'RISC-V Core',
        domain: 'Digital Design / Architecture',
        status: 'BUILDING',
        members: 4,
        tools: ['SYSTEMVERILOG', 'MODELSIM', 'VIVADO', 'RISC-V GCC'],
        about: 'Students implementing a 5-stage pipelined RISC-V RV32I processor in SystemVerilog. Target: synthesizable on Xilinx FPGA, runs Dhrystone benchmark. Includes data forwarding, branch prediction stall logic, and performance counters.',
        learn: ['RTL design and pipelining', 'Hazard detection and forwarding', 'FPGA synthesis and timing closure'],
        github: 'https://github.com',
    },
    {
        id: 'uart',
        name: 'UART Controller',
        domain: 'Digital Design',
        status: 'TESTING',
        members: 2,
        tools: ['VERILOG', 'MODELSIM', 'FPGA'],
        about: 'Universal Asynchronous Receiver-Transmitter with configurable baud rate generator, 16-byte FIFO buffers, parity error detection, and 16550-compatible register map. Verified on Arty A7.',
        learn: ['Serial communication protocols', 'FIFO design and verification', 'FPGA loopback testing'],
        github: 'https://github.com',
    },
    {
        id: 'sram',
        name: 'SRAM Array',
        domain: 'Physical Design / Analog',
        status: 'BUILDING',
        members: 3,
        tools: ['MAGIC', 'NGSPICE', 'KLAYOUT'],
        about: '8T SRAM bitcell array on SKY130 PDK. Custom layout with sense amplifiers, column multiplexer, and wordline driver. 256×8 bit organisation targeting minimum area and static noise margin above 180mV.',
        learn: ['SRAM bitcell design and layout', 'Read/write margin characterisation', 'SKY130 design rule checks'],
        github: 'https://github.com',
    },
    {
        id: 'openroad',
        name: 'OpenROAD Flow',
        domain: 'Physical Design / EDA',
        status: 'DESIGNING',
        members: 3,
        tools: ['OPENROAD', 'KLAYOUT', 'MAGIC', 'NETGEN'],
        about: 'Complete RTL-to-GDS implementation flow using open-source EDA tools. Covers floorplanning, placement, CTS, routing, and sign-off DRC/LVS. Target design: AES-128 core on SKY130 with 100MHz closure.',
        learn: ['Full RTL-to-GDS flow', 'Static timing analysis', 'Reading and analysing GDS files'],
        github: 'https://github.com',
    },
    {
        id: 'adc',
        name: 'ADC Interface',
        domain: 'Analog / Mixed-Signal',
        status: 'DESIGNING',
        members: 2,
        tools: ['SPICE', 'CADENCE', 'MATLAB'],
        about: '12-bit SAR ADC front-end with SPI interface. Includes sample-and-hold circuit, charge redistribution DAC, digital anti-aliasing filter, and INL/DNL characterisation test fixture.',
        learn: ['SAR ADC architecture', 'DNL/INL error modelling', 'SPI protocol design'],
        github: 'https://github.com',
    },
    {
        id: 'embedded',
        name: 'Embedded Control',
        domain: 'Embedded Systems',
        status: 'BUILDING',
        members: 4,
        tools: ['C/C++', 'FREERTOS', 'STM32CUBE', 'OPENOCD'],
        about: 'FreeRTOS-based embedded controller on STM32F446. Real-time sensor fusion pipeline, UART logger, DMA-driven peripheral drivers, SWD debugging hooks, and watchdog supervision. Deployed on custom PCB.',
        learn: ['RTOS task scheduling', 'DMA and peripheral drivers', 'SWD debugging with OpenOCD'],
        github: 'https://github.com',
    },
]

const STATUS_COLOR = {
    BUILDING: '#7B35E8',
    TESTING: '#FFFFFF',
    DESIGNING: 'rgba(255,255,255,0.4)',
    PLANNING: 'rgba(255,255,255,0.2)',
}
const STATUS_BG = {
    BUILDING: 'rgba(123,53,232,0.08)',
    TESTING: 'rgba(255,255,255,0.06)',
    DESIGNING: 'rgba(255,255,255,0.03)',
    PLANNING: 'rgba(255,255,255,0.02)',
}

/* ── Popup ───────────────────────────────────────────────────── */
function ProjectPopup({ project, onClose }) {
    const color = STATUS_COLOR[project.status] || '#7B35E8'

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
                {/* Accent line top */}
                <div className={styles.popupAccent} style={{ background: color }} />

                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

                {/* Status + Name */}
                <div className={styles.popupTop}>
                    <span className={styles.popupStatus} style={{ color }}>● {project.status}</span>
                    <h2 className={styles.popupName}>{project.name}</h2>
                    <p className={styles.popupDomainLabel}>{project.domain}</p>
                </div>

                <div className={styles.popupRule} />

                {/* Meta row */}
                <div className={styles.metaRow}>
                    <div className={styles.metaBox}>
                        <span className={styles.metaLabel}>TEAM SIZE</span>
                        <span className={styles.metaVal}>{project.members} members</span>
                    </div>
                    <div className={styles.metaBox}>
                        <span className={styles.metaLabel}>CYCLE</span>
                        <span className={styles.metaVal}>Spring 2026</span>
                    </div>
                </div>

                {/* Tools */}
                <div className={styles.popupToolsWrap}>
                    {project.tools.map(t => (
                        <span key={t} className={styles.toolPill}>{t}</span>
                    ))}
                </div>

                <div className={styles.popupRule} />

                {/* About */}
                <p className={styles.sectionLabel}>ABOUT</p>
                <p className={styles.popupAbout}>{project.about}</p>

                {/* Learn */}
                <p className={styles.sectionLabel} style={{ marginTop: 20 }}>WHAT YOU'LL LEARN</p>
                <ul className={styles.learnList}>
                    {project.learn.map(l => (
                        <li key={l}><span className={styles.arrow}>→</span>{l}</li>
                    ))}
                </ul>

                <div className={styles.popupRule} />

                {/* Actions */}
                <div className={styles.popupActions}>
                    <a href={project.github} target="_blank" rel="noreferrer" className={styles.actionLink}>
                        <GitHubIcon /> VIEW ON GITHUB
                    </a>
                    <button className={styles.actionPrimary}>JOIN THIS PROJECT</button>
                </div>
            </div>
        </div>
    )
}

/* ── Project card ────────────────────────────────────────────── */
function ProjectCard({ project, onClick }) {
    const color = STATUS_COLOR[project.status] || '#7B35E8'
    const bgHint = STATUS_BG[project.status] || 'transparent'

    return (
        <div
            className={styles.card}
            style={{ '--card-accent': color, '--card-bg-hint': bgHint }}
            onClick={() => onClick(project)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick(project)}
        >
            {/* Accent line */}
            <div className={styles.cardAccent} />

            {/* Header row */}
            <div className={styles.cardHeader}>
                <p className={styles.cardName}>{project.name}</p>
                <span className={styles.cardStatus} style={{ color }}>
                    <span className={styles.statusDot} style={{ background: color }} />
                    {project.status}
                </span>
            </div>

            {/* Domain */}
            <p className={styles.cardDomain}>{project.domain}</p>

            {/* Separator */}
            <div className={styles.cardSep} />

            {/* Member count */}
            <div className={styles.cardMeta}>
                <span className={styles.cardMetaLabel}>TEAM</span>
                <span className={styles.cardMetaVal}>{project.members} members</span>
            </div>

            {/* Tools */}
            <div className={styles.cardTools}>
                {project.tools.slice(0, 3).map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                ))}
                {project.tools.length > 3 && (
                    <span className={styles.toolChip}>+{project.tools.length - 3}</span>
                )}
            </div>

            {/* CTA */}
            <p className={styles.cardCta}>▶ VIEW PROJECT</p>
        </div>
    )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Projects() {
    const [selected, setSelected] = useState(null)
    const sectionRef = useRef(null)

    // Staged reveal animation
    useEffect(() => {
        const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (PRM) return

        const section = sectionRef.current
        if (!section) return
        const terminalBar = section.querySelector('[class*="terminalBar"]')
        const allCards = section.querySelectorAll('[class*="card"]')
        if (!allCards?.length) return

        const firstTwo = Array.from(allCards).slice(0, 2)
        const rest = Array.from(allCards).slice(2)

        // Set everything invisible initially
        gsap.set([terminalBar, ...allCards], { opacity: 0, y: 16 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 65%',
                once: true,
            }
        })

        // 1. Terminal bar types in
        tl.to(terminalBar, {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: 'power2.out',
        })

        // 2. First 2 cards appear together
        tl.to(firstTwo, {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
        }, '+=0.1')

        // 3. Remaining 4 cards stagger in
        tl.to(rest, {
            opacity: 1, y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.07,
        }, '+=0.1')

    }, [])

    return (
        <section ref={sectionRef} className={styles.section} id="projects">
            <div className={styles.header}>
                <p className={styles.watermark} aria-hidden>PROJECTS</p>
                <p className={styles.eyebrow}>Spring 2026</p>
                <h2 className={styles.heading}>What We're Building</h2>
            </div>

            {/* Terminal bar */}
            <div className={styles.terminalBar}>
                <span><span className={styles.prompt}>&gt;</span> ACTIVE PROJECTS — SPRING 2026</span>
                <span><span className={styles.liveDot} /> {PROJECTS.length}/{PROJECTS.length} ACTIVE</span>
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {PROJECTS.map(p => (
                    <ProjectCard key={p.id} project={p} onClick={setSelected} />
                ))}
            </div>

            {selected && <ProjectPopup project={selected} onClose={() => setSelected(null)} />}
        </section>
    )
}
