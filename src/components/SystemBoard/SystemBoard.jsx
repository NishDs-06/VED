import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SystemBoard.module.css'

/* ── Module data ─────────────────────────────────────────────── */
const MODULES = [
    {
        id: 'riscv', label: 'RISC-V CORE', desig: 'U1',
        status: 'green', net: 'data',
        x: 6, y: 8, w: 18, h: 11,
        desc: 'Custom 5-stage RISC-V RV32I core with in-order execution, branch prediction, and configurable cache. Synthesized on SKY130.',
        tools: ['VERILOG', 'SYNOPSYS DC', 'GEM5'],
        learn: ['Implement forwarding paths', 'Explore OoO execution', 'Add multiply/divide unit'],
        path: 'VEDA → U1 via APB bus',
    },
    {
        id: 'uart', label: 'UART', desig: 'U2',
        status: 'green', net: 'control',
        x: 60, y: 8, w: 11, h: 9,
        desc: 'Universal Asynchronous Receiver-Transmitter with baud rate generator, FIFO buffers, and parity error detection.',
        tools: ['VERILOG', 'MODELSIM'],
        learn: ['Configure 16550 compatible mode', 'Test with real FPGA loopback', 'Add flow control (RTS/CTS)'],
        path: 'VEDA → U2 via AHB',
    },
    {
        id: 'sram', label: 'SRAM ARRAY', desig: 'U3',
        status: 'cyan', net: 'data',
        x: 76, y: 8, w: 18, h: 11,
        desc: '8T SRAM array with sense amplifiers, column mux, and wordline driver. 256×8 bit organisation for minimum area.',
        tools: ['MAGIC', 'NGSPICE', 'KLAYOUT'],
        learn: ['Characterise read/write margins', 'Design custom bitcell', 'Layout DRC-clean array'],
        path: 'VEDA → U3 via memory bus',
    },
    {
        id: 'alu', label: 'ALU', desig: 'U4',
        status: 'amber', net: 'data',
        x: 6, y: 42, w: 14, h: 11,
        desc: '32-bit ALU supporting ADD, SUB, AND, OR, XOR, SHL, SHR with overflow detection and zero flag generation.',
        tools: ['VERILOG', 'YOSYS', 'NEXTPNR'],
        learn: ['Explore carry-lookahead vs ripple', 'Implement barrel shifter', 'Synthesise and analyse critical path'],
        path: 'VEDA → U4 (internal)',
    },
    {
        id: 'adc', label: 'ADC INTERFACE', desig: 'U5',
        status: 'green', net: 'control',
        x: 76, y: 42, w: 18, h: 11,
        desc: '12-bit SAR ADC interface with SPI protocol, sample-hold circuit, and digital filtering for noise rejection.',
        tools: ['SPICE', 'CADENCE', 'MATLAB'],
        learn: ['Understand SAR algorithm', 'Model DNL/INL errors', 'Design antialiasing filter'],
        path: 'VEDA → U5 via SPI',
    },
    {
        id: 'openroad', label: 'OpenROAD FLOW', desig: 'U6',
        status: 'green', net: 'data',
        x: 6, y: 76, w: 22, h: 11,
        desc: 'Complete RTL-to-GDS implementation flow using open-source EDA. Floorplan → Place → Route → Sign-off on SKY130 PDK.',
        tools: ['OPENROAD', 'KLAYOUT', 'MAGIC', 'NETGEN'],
        learn: ['Run full flow on sample design', 'Achieve timing closure', 'Read GDS in KLayout'],
        path: 'VEDA → U6 (flow engine)',
    },
    {
        id: 'embedded', label: 'EMBEDDED CTRL', desig: 'U7',
        status: 'cyan', net: 'control',
        x: 68, y: 76, w: 18, h: 11,
        desc: 'FreeRTOS-based embedded controller on STM32F4. Manages peripheral drivers, UART logger, and sensor fusion pipeline.',
        tools: ['C/C++', 'FREERTOS', 'STM32CUBE', 'OPENOCD'],
        learn: ['Write a task scheduler from scratch', 'Implement DMA transfers', 'Debug with SWD and logic analyser'],
        path: 'VEDA → U7 via JTAG',
    },
]

/* ── Wire paths between modules ─────────────────────────────── */
const WIRES = [
    { from: 'riscv', to: 'uart', net: 'data', d: 'M 29,13.5 H 60' },
    { from: 'riscv', to: 'sram', net: 'data', d: 'M 24,14 V 5 H 85 V 8' },
    { from: 'riscv', to: 'alu', net: 'data', d: 'M 15,19 V 42' },
    { from: 'riscv', to: 'openroad', net: 'control', d: 'M 10,19 V 76' },
    { from: 'sram', to: 'adc', net: 'control', d: 'M 85,19 V 36 H 85 V 42' },
    { from: 'uart', to: 'embedded', net: 'control', d: 'M 65,17 V 30 H 72 V 76' },
    { from: 'alu', to: 'embedded', net: 'data', d: 'M 20,53 H 68' },
]

function netColor(net) {
    if (net === 'data') return 'rgba(229,231,235,0.3)'
    if (net === 'power') return 'rgba(255,100,100,0.3)'
    return 'rgba(255,122,0,0.25)'
}

function ledColor(s) {
    if (s === 'green') return '#E5E7EB'
    if (s === 'amber') return '#FFB347'
    return '#FF7A00'
}

/* ── Main Component ──────────────────────────────────────────── */
export default function SystemBoard() {
    const sectionRef = useRef(null)
    const boardRef = useRef(null)
    const scanRef = useRef(null)
    const overlayRef = useRef(null)
    const [hovered, setHovered] = useState(null)
    const [selected, setSelected] = useState(null)
    const [panelVisible, setPanelVisible] = useState(false)

    useEffect(() => {
        const section = sectionRef.current
        const board = boardRef.current
        const scan = scanRef.current
        if (!section || !board || !scan) return

        const ctx = { alive: true }

        // Holographic scan reveal
        const st = ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            once: true,
            onEnter() {
                if (!ctx.alive) return
                // Scan line sweeps 0% → 100%
                gsap.fromTo(scan,
                    { top: '0%', opacity: 1 },
                    {
                        top: '100%', duration: 1.8, ease: 'power1.inOut',
                        onComplete() { scan.style.opacity = '0' },
                    }
                )
                // Each module fades in as scan reaches it
                const boardH = board.clientHeight
                board.querySelectorAll('[data-module]').forEach(el => {
                    const rect = el.getBoundingClientRect()
                    const boardRect = board.getBoundingClientRect()
                    const relY = (rect.top - boardRect.top) / boardH
                    gsap.fromTo(el,
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: relY * 1.8 }
                    )
                })
            },
        })

        return () => { ctx.alive = false; st.kill() }
    }, [])

    function handleModuleClick(mod, e) {
        e.stopPropagation()
        setSelected(mod)
        setPanelVisible(false)

        // Ripple
        const ripple = document.createElement('div')
        ripple.style.cssText = `
            position:fixed;left:${e.clientX}px;top:${e.clientY}px;
            width:0;height:0;border-radius:50%;
            background:rgba(229,231,235,0.25);
            transform:translate(-50%,-50%);
            pointer-events:none;z-index:9990;
        `
        document.body.appendChild(ripple)
        gsap.to(ripple, {
            width: 400, height: 400, opacity: 0,
            duration: 0.6, ease: 'power2.out',
            onComplete: () => ripple.remove(),
        })

        // Panel slide in
        setTimeout(() => setPanelVisible(true), 400)
    }

    function closePanel() {
        setPanelVisible(false)
        setTimeout(() => setSelected(null), 350)
    }

    const sel = MODULES.find(m => m.id === selected)

    return (
        <section ref={sectionRef} className={styles.systemSection} id="system-board">
            <div className={styles.header}>
                <p className={styles.headerLabel}>SYSTEM ARCHITECTURE</p>
                <h2 className={`${styles.headerTitle} glitch`} data-scramble>The VEDA Chip</h2>
                <p className={styles.headerSub}>Click any module to explore its role in the silicon stack</p>
            </div>

            <div className={styles.boardWrap} ref={boardRef}>
                {/* Scan line */}
                <div ref={scanRef} className={styles.scanLine} />
                {/* Corner fiducials */}
                {['tl', 'tr', 'bl', 'br'].map(c => (
                    <div key={c} className={`${styles.fiducial} ${styles[c]}`} aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="16" height="16">
                            <line x1="8" y1="0" x2="8" y2="16" stroke="rgba(255,122,0,0.4)" strokeWidth="0.8" />
                            <line x1="0" y1="8" x2="16" y2="8" stroke="rgba(255,122,0,0.4)" strokeWidth="0.8" />
                            <circle cx="8" cy="8" r="2" fill="none" stroke="rgba(255,122,0,0.4)" strokeWidth="0.8" />
                        </svg>
                    </div>
                ))}

                {/* Silkscreen label */}
                <span className={styles.silkscreen}>VEDA-PCB-2026  REV-A  MIT BANGALORE</span>

                {/* SVG wire layer */}
                <svg className={styles.wireSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                    {WIRES.map((w, i) => (
                        <path key={i} d={w.d}
                            stroke={netColor(w.net)}
                            strokeWidth="0.5"
                            fill="none"
                            className={`${styles.wire} ${hovered && hovered !== w.from && hovered !== w.to ? styles.wireDim : ''} ${hovered === w.from || hovered === w.to ? styles.wireHi : ''}`}
                        />
                    ))}
                </svg>

                {/* VEDA chip centre */}
                <div className={styles.vedaChip}>
                    <div className={styles.vedaOuter}>
                        <div className={styles.vedaInner}>
                            <div className={styles.vedaHeart} />
                            <span className={styles.vedaLabel}>VEDA</span>
                            <span className={styles.vedaSub}>MIT BLR 2026</span>
                        </div>
                    </div>
                </div>

                {/* Modules */}
                {MODULES.map(mod => (
                    <div
                        key={mod.id}
                        data-module={mod.id}
                        className={`${styles.module} ${hovered === mod.id ? styles.moduleHi : ''} ${hovered && hovered !== mod.id ? styles.moduleDim : ''}`}
                        style={{
                            left: `${mod.x}%`, top: `${mod.y}%`,
                            width: `${mod.w}%`, height: `${mod.h}%`,
                        }}
                        onMouseEnter={() => setHovered(mod.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={(e) => handleModuleClick(mod.id, e)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${mod.label} — click for details`}
                    >
                        <span className={styles.modDesig}>{mod.desig}</span>
                        <span className={styles.modLabel}>{mod.label}</span>
                        {/* LED */}
                        <div className={styles.led} style={{ color: ledColor(mod.status) }} />
                        {/* Status badge */}
                        <div className={styles.badge} style={{ background: ledColor(mod.status) }} />
                    </div>
                ))}

                {/* Board overlay on select */}
                {selected && (
                    <div
                        ref={overlayRef}
                        className={styles.boardOverlay}
                        onClick={closePanel}
                        style={{ opacity: panelVisible ? 1 : 0 }}
                    />
                )}
            </div>

            {/* Detail panel */}
            {sel && (
                <div className={`${styles.detailPanel} ${panelVisible ? styles.panelIn : ''}`}>
                    <button className={styles.closeBtn} onClick={closePanel} aria-label="Close">×</button>
                    <div className={styles.panelHeader}>
                        <p className={styles.panelDesig}>{sel.desig} / {sel.net.toUpperCase()} NET</p>
                        <h3 className={styles.panelName}>{sel.label}</h3>
                        <span className={styles.panelBadge} style={{ background: ledColor(MODULES.find(m => m.id === sel.id)?.status) }}>
                            ACTIVE
                        </span>
                    </div>
                    <div className={styles.panelDivider} />
                    <p className={styles.panelDesc}>{sel.desc}</p>
                    <div className={styles.panelTools}>
                        {sel.tools.map(t => (
                            <span key={t} className={styles.toolPill}>{t}</span>
                        ))}
                    </div>
                    <ul className={styles.panelLearn}>
                        {sel.learn.map(l => (
                            <li key={l}><span className={styles.arrow}>→</span>{l}</li>
                        ))}
                    </ul>
                    <p className={styles.panelPath}>{sel.path}</p>
                </div>
            )}
        </section>
    )
}
