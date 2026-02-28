import { useState, useEffect, useRef } from 'react'
import styles from './Projects.module.css'

const GitHubIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
)

const PROJECTS = [
    {
        id: 'mosfet',
        name: 'Low-Leakage MOSFET',
        domain: 'Device Physics / Low-Power Design',
        category: 'DEVICE',
        status: 'DESIGNING',
        members: 3,
        tools: ['SPICE', 'CADENCE', 'SPECTRE', 'MATLAB'],
        about: 'Simulation and performance analysis of a modified MOSFET structure targeting ultra-low leakage for IoT applications. As IoT devices demand sub-threshold operation, conventional MOSFETs suffer from leakage currents and short-channel effects. This project simulates and characterises a novel gate structure to reduce leakage while maintaining adequate drive current.',
        learn: [
            'MOSFET short-channel effects and leakage mechanisms',
            'SPICE-level device simulation and characterisation',
            'Low-power design tradeoffs for embedded IoT nodes',
        ],
        github: 'https://github.com',
    },
    {
        id: 'comparator',
        name: 'Dynamic Comparator',
        domain: 'Analog / Mixed-Signal',
        category: 'CIRCUIT',
        status: 'BUILDING',
        members: 2,
        tools: ['CADENCE', 'SPECTRE', 'MATLAB', 'SPICE'],
        about: 'A low-offset dynamic latch comparator for energy-efficient SAR ADCs. Designed for high-speed operation with minimised offset voltage through systematic offset cancellation. Focuses on kickback noise reduction at the input, Monte Carlo mismatch analysis across process corners, and full characterisation of dynamic power vs. accuracy tradeoffs.',
        learn: [
            'Dynamic latch comparator architecture and offset sources',
            'Kickback noise modelling and mitigation techniques',
            'Monte Carlo analysis for mismatch and yield estimation',
        ],
        github: 'https://github.com',
    },
    {
        id: 'puf-boot',
        name: 'PUF Secure Boot',
        domain: 'Embedded Systems / Security',
        category: 'EMBEDDED',
        status: 'BUILDING',
        members: 4,
        tools: ['VERILOG', 'VIVADO', 'ARTIX-7', 'C/C++'],
        about: "Replacing static eFuse/BBRAM key storage with a PUF-based root of trust on the Artix-7 XC7A100T. Cryptographic keys are derived dynamically from the device's intrinsic SRAM power-up behaviour, integrated into a complete soft-core processor secure boot pipeline, and validated for reliability under real-world temperature and voltage stress.",
        learn: [
            'Physical Unclonable Functions (PUF) design and evaluation',
            'FPGA secure boot pipeline integration',
            'Reliability testing under environmental stress conditions',
        ],
        github: 'https://github.com',
    },
    {
        id: 'drone-sensor',
        name: 'Drone Pathogen Sensor',
        domain: 'IoT / Sensor Systems',
        category: 'IOT',
        status: 'DESIGNING',
        members: 4,
        tools: ['RASPBERRY PI', 'LORAWAN', 'PYTHON', 'C/C++'],
        about: 'A drone-based autonomous bio-polymer sensor system for real-time airborne pathogen detection. Current monitoring relies on manual lab sampling with delayed results. This system integrates stable bio-polymer sensors, Raspberry Pi-based processing, and LoRaWAN communication for continuous, long-range environmental surveillance with real-time remote data transmission.',
        learn: [
            'Bio-polymer sensor integration and signal conditioning',
            'Autonomous drone payload and power budgeting',
            'LoRaWAN protocol design for long-range IoT telemetry',
        ],
        github: 'https://github.com',
    },
    {
        id: 'neuromorphic',
        name: 'Neuromorphic Core',
        domain: 'Neuromorphics / Edge AI',
        category: 'NEUROMORPHIC',
        status: 'PLANNING',
        members: 3,
        tools: ['VERILOG', 'PYTHON', 'MATLAB', 'CADENCE'],
        about: 'Design and evaluation of a simplified low-power neuromorphic computing model to overcome the von Neumann bottleneck. Inspired by biological neurons and synapses, this architecture enables massively parallel, event-driven, low-power computation suited to real-time sensory data, pattern recognition, and edge intelligence where latency and energy efficiency are critical.',
        learn: [
            'Spiking neural network (SNN) models and spike encoding',
            'In-memory and near-memory compute architectures',
            'Hardware implementation of STDP learning rules',
        ],
        github: 'https://github.com',
    },
]

const CATEGORY_COLOR = {
    DEVICE: '#C084FC',
    CIRCUIT: '#A855F7',
    EMBEDDED: '#9333EA',
    IOT: '#7C3AED',
    NEUROMORPHIC: '#6D28D9',
}

const STATUS_CONFIG = {
    BUILDING: { color: '#C084FC', label: 'Building' },
    DESIGNING: { color: 'rgba(192,132,252,0.55)', label: 'Designing' },
    PLANNING: { color: 'rgba(192,132,252,0.3)', label: 'Planning' },
    TESTING: { color: '#ffffff', label: 'Testing' },
}

/* ── Popup ───────────────────────────────────────────────────── */
function ProjectPopup({ project, onClose }) {
    const accent = CATEGORY_COLOR[project.category] || '#A855F7'
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

/* ── Project card — always visible, no scroll animation ──────── */
function ProjectCard({ project, onClick }) {
    const accent = CATEGORY_COLOR[project.category] || '#A855F7'
    const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.PLANNING

    return (
        <div
            className={styles.card}
            style={{ '--accent': accent }}
            onClick={() => onClick(project)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick(project)}
        >
            <div className={styles.cardTopLine} style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

            <div className={styles.cardTagRow}>
                <span className={styles.cardCategory} style={{ color: accent, borderColor: accent + '40', background: accent + '0f' }}>
                    {project.category}
                </span>
                <span className={styles.cardStatusDot} style={{ background: statusCfg.color }} />
                <span className={styles.cardStatusLabel} style={{ color: statusCfg.color }}>
                    {statusCfg.label}
                </span>
            </div>

            <h3 className={styles.cardName}>{project.name}</h3>
            <p className={styles.cardDomain}>{project.domain}</p>
            <div className={styles.cardDivider} />

            <div className={styles.cardTools}>
                {project.tools.slice(0, 3).map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                ))}
                {project.tools.length > 3 && (
                    <span className={styles.toolChip}>+{project.tools.length - 3}</span>
                )}
            </div>

            <div className={styles.cardFooter}>
                <span className={styles.cardMembers}>{project.members} members</span>
                <span className={styles.cardCta}>View →</span>
            </div>

            <div className={styles.cardGlow} style={{ background: `radial-gradient(ellipse at 50% 100%, ${accent}22 0%, transparent 70%)` }} />
        </div>
    )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Projects() {
    const [selected, setSelected] = useState(null)
    const sectionRef = useRef(null)

    return (
        <section ref={sectionRef} className={styles.section} id="projects" style={{ position: 'relative', overflow: 'hidden' }}>
            {/*
                SectionAtmosphere removed — the canvas RAF startup was causing
                the lag spike when transitioning from Domains.
                GSAP card stagger animation also removed — cards are now
                immediately visible, no scroll-triggered opacity/transform.
            */}

            <div className={styles.sectionHeader}>
                <p className={styles.watermark} aria-hidden>PROJECTS</p>
                <p className={styles.eyebrow}>Spring 2026</p>
                <h2 className={styles.heading}>What We're Building</h2>
                <div className={styles.headingRule} />
            </div>

            <div className={styles.terminalBar}>
                <span><span className={styles.prompt}>&gt;</span> ACTIVE PROBLEM STATEMENTS — SPRING 2026</span>
                <span className={styles.termRight}>
                    <span className={styles.liveDot} />
                    {PROJECTS.length} PROJECTS
                </span>
            </div>

            <div className={styles.grid}>
                {PROJECTS.map(p => (
                    <ProjectCard key={p.id} project={p} onClick={setSelected} />
                ))}
            </div>

            {selected && <ProjectPopup project={selected} onClose={() => setSelected(null)} />}
        </section>
    )
}