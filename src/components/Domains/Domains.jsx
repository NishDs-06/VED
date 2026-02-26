import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Domains.module.css'

/* ── Domain data ────────────────────────────────────────────── */
const DOMAINS = [
    {
        num: '01',
        title: 'Digital Design',
        desc: 'From RTL to gates — crafting logic that operates at picosecond precision. Synchronous state machines, pipelined datapaths, and verification flows.',
        tools: 'VERILOG · SYSTEMVERILOG · MODELSIM · VIVADO',
        visual: 'oscilloscope',
    },
    {
        num: '02',
        title: 'Analog Design',
        desc: 'Amplifiers, filters, and mixed-signal interfaces tuned to the physical limits of silicon. Frequency response, noise margin, and PVT variation analysis.',
        tools: 'SPICE · CADENCE · SPECTRE · MATLAB',
        visual: 'bode',
    },
    {
        num: '03',
        title: 'Architecture',
        desc: 'Building processors from instruction sets up. IPC optimisation, hazard resolution, cache hierarchies, and microarchitectural tradeoffs.',
        tools: 'RISC-V · GEM5 · SPIKE · CHISEL',
        visual: 'pipeline',
    },
    {
        num: '04',
        title: 'Physical Design',
        desc: 'Placing and routing standard cells within micron-level constraints. Timing closure, IR drop analysis, and sign-off flow automation.',
        tools: 'OPENROAD · MAGIC · KLAYOUT · INNOVUS',
        visual: 'placement',
    },
    {
        num: '05',
        title: 'Embedded Systems',
        desc: 'Bare-metal firmware to RTOS-driven systems. Sensor fusion, peripheral drivers, and real-time bus protocols on ARM and RISC-V SOCs.',
        tools: 'C/C++ · FREERTOS · STM32 · ZEPHYR',
        visual: 'mcu',
    },
]

/* ── Visuals ─────────────────────────────────────────────────── */
function Oscilloscope() {
    return (
        <svg viewBox="0 0 320 200" className={styles.vizSvg} aria-hidden="true">
            <rect x="4" y="4" width="312" height="192" rx="6" fill="none" stroke="rgba(229,231,235,0.5)" strokeWidth="1" />
            <rect x="10" y="10" width="300" height="140" rx="2" fill="rgba(0,0,0,0.95)" stroke="rgba(229,231,235,0.2)" strokeWidth="0.5" />
            {[0.25, 0.5, 0.75].map(f => (<line key={f} x1="10" y1={10 + 140 * f} x2="310" y2={10 + 140 * f} stroke="rgba(229,231,235,0.08)" strokeWidth="0.5" />))}
            {[0.2, 0.4, 0.6, 0.8].map(f => (<line key={f} x1={10 + 300 * f} y1="10" x2={10 + 300 * f} y2="150" stroke="rgba(229,231,235,0.08)" strokeWidth="0.5" />))}
            <polyline points="10,55 40,55 40,100 80,100 80,55 120,55 120,100 160,100 160,55 200,55 200,100 240,100 240,55 280,55 280,100 310,100" fill="none" stroke="rgba(229,231,235,0.9)" strokeWidth="1.5" className={styles.waveClk} />
            <polyline points="10,130 50,130 50,80 90,80 90,130 110,130 110,80 170,80 170,130 210,130 210,80 265,80 265,130 310,130" fill="none" stroke="rgba(229,231,235,0.6)" strokeWidth="1" className={styles.waveDat} />
            <line x1="10" y1="62" x2="310" y2="62" stroke="#FFB347" strokeWidth="1" strokeDasharray="4 6" className={styles.waveEn} />
            <line x1="0" y1="10" x2="0" y2="150" stroke="rgba(229,231,235,0.7)" strokeWidth="1" className={styles.scanCursor} />
            <text x="14" y="168" fill="rgba(229,231,235,0.5)" fontSize="8" fontFamily="DM Mono, monospace">0ns</text>
            <text x="84" y="168" fill="rgba(229,231,235,0.5)" fontSize="8" fontFamily="DM Mono, monospace">10ns</text>
            <text x="154" y="168" fill="rgba(229,231,235,0.5)" fontSize="8" fontFamily="DM Mono, monospace">20ns</text>
            <text x="224" y="168" fill="rgba(229,231,235,0.5)" fontSize="8" fontFamily="DM Mono, monospace">30ns</text>
            <text x="14" y="52" fill="rgba(229,231,235,0.6)" fontSize="7" fontFamily="DM Mono, monospace">CLK</text>
            <text x="14" y="128" fill="rgba(123,53,232,0.7)" fontSize="7" fontFamily="DM Mono, monospace">DATA</text>
            <text x="14" y="60" fill="rgba(155,90,255,0.7)" fontSize="7" fontFamily="DM Mono, monospace">EN</text>
            <text x="14" y="190" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="DM Mono, monospace">CH1 1V/div  10ns/div  TRIG: NORM</text>
        </svg>
    )
}
function BodePlot() {
    return (
        <svg viewBox="0 0 320 200" className={styles.vizSvg} aria-hidden="true">
            <rect x="0" y="0" width="320" height="200" fill="rgba(0,0,0,0.92)" rx="4" />
            {[0.2, 0.4, 0.6, 0.8].map(f => (<line key={f} x1="30" y1={10 + 90 * f} x2="310" y2={10 + 90 * f} stroke="rgba(229,231,235,0.06)" strokeWidth="0.5" />))}
            {[0.2, 0.4, 0.6, 0.8].map(f => (<line key={f} x1={30 + 280 * f} y1="10" x2={30 + 280 * f} y2="100" stroke="rgba(229,231,235,0.06)" strokeWidth="0.5" />))}
            <line x1="30" y1="10" x2="30" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <line x1="30" y1="100" x2="310" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <path d="M30,25 L120,25 Q160,25 200,45 Q240,65 280,85 L310,88" fill="none" stroke="rgba(123,53,232,0.7)" strokeWidth="1.5" className={styles.bodeLine} />
            <text x="2" y="28" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">0dB</text>
            <text x="2" y="68" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">-20</text>
            <text x="2" y="100" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">-40</text>
            <text x="28" y="110" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">10Hz</text>
            <text x="148" y="110" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">1kHz</text>
            <text x="268" y="110" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">1MHz</text>
            <line x1="30" y1="118" x2="310" y2="118" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <path d="M30,140 Q48,120 65,140 Q83,160 100,140 Q118,120 135,140 Q153,160 170,140 Q188,120 205,140 Q223,160 240,140 Q258,120 275,140 Q293,160 310,140" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" className={styles.sineIn} />
            <path d="M30,148 Q48,132 65,148 Q83,164 100,148 Q118,132 135,148 Q153,164 170,148 Q188,132 205,148 Q223,164 240,148 Q258,132 275,148 Q293,164 310,148" fill="none" stroke="rgba(229,231,235,0.8)" strokeWidth="1.5" className={styles.sineOut} />
            <text x="30" y="190" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="DM Mono, monospace">INPUT 1Vpp  OUTPUT 0.7Vpp  φ=-12°</text>
        </svg>
    )
}
function Pipeline() {
    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB']
    const stageW = 48, stageH = 36, gap = 8, startX = 18, startY = 62
    return (
        <svg viewBox="0 0 320 200" className={styles.vizSvg} aria-hidden="true">
            <rect x="0" y="0" width="320" height="200" fill="rgba(0,0,0,0.92)" rx="4" />
            {stages.map((s, i) => (
                <g key={s}>
                    <rect x={startX + i * (stageW + gap)} y={startY} width={stageW} height={stageH} rx="2" fill="rgba(229,231,235,0.08)" stroke="rgba(229,231,235,0.4)" strokeWidth="0.8" className={styles[`stage${i}`]} />
                    <text x={startX + i * (stageW + gap) + stageW / 2} y={startY + stageH / 2 + 4} fill="rgba(229,231,235,0.9)" fontSize="9" fontFamily="DM Mono, monospace" textAnchor="middle">{s}</text>
                    {i < stages.length - 1 && (<path d={`M${startX + i * (stageW + gap) + stageW},${startY + stageH / 2} L${startX + (i + 1) * (stageW + gap)},${startY + stageH / 2}`} fill="none" stroke="rgba(229,231,235,0.3)" strokeWidth="1" markerEnd="url(#arr)" />)}
                </g>
            ))}
            <rect x="18" y="115" width="270" height="22" rx="2" fill="none" stroke="rgba(123,53,232,0.2)" strokeWidth="0.8" strokeDasharray="3 3" />
            <text x="22" y="130" fill="rgba(123,53,232,0.5)" fontSize="7" fontFamily="DM Mono, monospace">Hazard Detection Unit</text>
            <path d="M130,62 C130,50 186,50 186,62" fill="none" stroke="rgba(155,90,255,0.3)" strokeWidth="0.8" strokeDasharray="2 2" />
            <path d="M186,62 C186,44 242,44 242,62" fill="none" stroke="rgba(155,90,255,0.25)" strokeWidth="0.8" strokeDasharray="2 2" />
            <rect className={styles.tokenA} x="0" y={startY + 6} width="10" height="10" rx="1" fill="rgba(123,53,232,0.8)" />
            <rect className={styles.tokenB} x="0" y={startY + 18} width="10" height="10" rx="1" fill="rgba(229,231,235,0.6)" />
            <rect className={styles.tokenC} x="0" y={startY + 6} width="10" height="10" rx="1" fill="rgba(155,90,255,0.7)" />
            <defs><marker id="arr" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(229,231,235,0.4)" /></marker></defs>
            <text x="8" y="18" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="DM Mono, monospace">5-STAGE RISC-V PIPELINE — IN-ORDER</text>
            <text x="8" y="188" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="DM Mono, monospace">IPC: 0.94 avg  Stalls: 6.2%  Branch: 8.4%  CPI: 1.07</text>
        </svg>
    )
}
function ChipPlacement() {
    const cols = 32, rows = 16
    const cells = Array.from({ length: cols * rows }, (_, i) => i)
    return (
        <svg viewBox="0 0 320 200" className={styles.vizSvg} aria-hidden="true">
            <rect x="0" y="0" width="320" height="200" fill="rgba(0,0,0,0.92)" rx="4" />
            <rect x="10" y="10" width="230" height="140" rx="1" fill="none" stroke="rgba(123,53,232,0.3)" strokeWidth="1" />
            {cells.map(i => {
                const col = i % cols, row = Math.floor(i / cols)
                return (<rect key={i} x={10 + col * 7} y={10 + row * 8} width="5" height="6" rx="0.5" fill="rgba(229,231,235,0.08)" stroke="rgba(229,231,235,0.15)" strokeWidth="0.3" className={styles.cell} style={{ animationDelay: `${(i / cells.length) * 2}s` }} />)
            })}
            <path d="M50,30 H180 V80 H100 V120" fill="none" stroke="rgba(229,231,235,0.4)" strokeWidth="0.8" className={styles.routeLine} />
            <path d="M30,70 H80 V130 H200 V50 H220" fill="none" stroke="rgba(123,53,232,0.3)" strokeWidth="0.8" className={styles.routeLine} style={{ animationDelay: '0.3s' }} />
            <path d="M90,10 V150" fill="none" stroke="rgba(155,90,255,0.2)" strokeWidth="0.6" className={styles.routeLine} style={{ animationDelay: '0.6s' }} />
            <rect x="248" y="10" width="64" height="140" rx="2" fill="rgba(229,231,235,0.03)" stroke="rgba(229,231,235,0.15)" strokeWidth="0.5" />
            <text x="252" y="28" fill="rgba(229,231,235,0.7)" fontSize="7" fontFamily="DM Mono, monospace">UTIL: 73.4%</text>
            <text x="252" y="42" fill="rgba(123,53,232,0.7)" fontSize="7" fontFamily="DM Mono, monospace">WNS: +0.08</text>
            <text x="252" y="56" fill="rgba(155,90,255,0.7)" fontSize="7" fontFamily="DM Mono, monospace">TNS: 0.00</text>
            <text x="252" y="70" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="DM Mono, monospace">DRC: 0</text>
            <text x="252" y="84" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="DM Mono, monospace">CELLS: 8.2k</text>
            <text x="252" y="98" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="DM Mono, monospace">NETS: 9.4k</text>
            <text x="252" y="132" fill="rgba(155,90,255,0.5)" fontSize="7" fontFamily="DM Mono, monospace">OPENROAD</text>
            <text x="252" y="144" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="DM Mono, monospace">FLOW v3.0</text>
            <text x="10" y="165" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="DM Mono, monospace">SKY130 PDK  100MHz target  Floorplan: 240μm × 160μm</text>
        </svg>
    )
}
function MCUSystem() {
    return (
        <svg viewBox="0 0 320 200" className={styles.vizSvg} aria-hidden="true">
            <rect x="0" y="0" width="320" height="200" fill="rgba(0,0,0,0.92)" rx="4" />
            <rect x="115" y="65" width="90" height="70" rx="3" fill="rgba(229,231,235,0.06)" stroke="rgba(229,231,235,0.5)" strokeWidth="1" />
            <text x="160" y="95" textAnchor="middle" fill="rgba(229,231,235,0.9)" fontSize="8" fontFamily="DM Mono, monospace">Cortex-M4</text>
            <text x="160" y="108" textAnchor="middle" fill="rgba(229,231,235,0.5)" fontSize="7" fontFamily="DM Mono, monospace">168MHz</text>
            <text x="160" y="120" textAnchor="middle" fill="rgba(229,231,235,0.4)" fontSize="6" fontFamily="DM Mono, monospace">STM32F4</text>
            <rect x="10" y="20" width="60" height="28" rx="2" fill="rgba(123,53,232,0.05)" stroke="rgba(123,53,232,0.3)" strokeWidth="0.8" />
            <text x="40" y="36" textAnchor="middle" fill="rgba(123,53,232,0.8)" fontSize="8" fontFamily="DM Mono, monospace">UART</text>
            <rect x="250" y="20" width="60" height="28" rx="2" fill="rgba(229,231,235,0.05)" stroke="rgba(229,231,235,0.3)" strokeWidth="0.8" />
            <text x="280" y="36" textAnchor="middle" fill="rgba(229,231,235,0.8)" fontSize="8" fontFamily="DM Mono, monospace">SPI</text>
            <rect x="10" y="86" width="60" height="28" rx="2" fill="rgba(155,90,255,0.05)" stroke="rgba(155,90,255,0.3)" strokeWidth="0.8" />
            <text x="40" y="102" textAnchor="middle" fill="rgba(155,90,255,0.8)" fontSize="8" fontFamily="DM Mono, monospace">GPIO</text>
            <rect x="250" y="86" width="60" height="28" rx="2" fill="rgba(155,90,255,0.05)" stroke="rgba(155,90,255,0.3)" strokeWidth="0.8" />
            <text x="280" y="102" textAnchor="middle" fill="rgba(155,90,255,0.8)" fontSize="8" fontFamily="DM Mono, monospace">ADC</text>
            <rect x="130" y="158" width="60" height="28" rx="2" fill="rgba(123,53,232,0.05)" stroke="rgba(123,53,232,0.3)" strokeWidth="0.8" />
            <text x="160" y="174" textAnchor="middle" fill="rgba(123,53,232,0.8)" fontSize="8" fontFamily="DM Mono, monospace">TIM</text>
            <line x1="70" y1="34" x2="115" y2="90" stroke="rgba(123,53,232,0.3)" strokeWidth="0.8" />
            <line x1="250" y1="34" x2="205" y2="90" stroke="rgba(229,231,235,0.3)" strokeWidth="0.8" />
            <line x1="70" y1="100" x2="115" y2="100" stroke="rgba(155,90,255,0.3)" strokeWidth="0.8" />
            <line x1="205" y1="100" x2="250" y2="100" stroke="rgba(155,90,255,0.3)" strokeWidth="0.8" />
            <line x1="160" y1="135" x2="160" y2="158" stroke="rgba(123,53,232,0.3)" strokeWidth="0.8" />
            <circle className={styles.pulse1} r="3" fill="rgba(123,53,232,0.8)" />
            <circle className={styles.pulse2} r="3" fill="rgba(229,231,235,0.8)" />
            <circle className={styles.pulse3} r="3" fill="rgba(155,90,255,0.8)" />
            <circle cx="12" cy="140" r="6" fill="rgba(123,53,232,0.2)" stroke="rgba(123,53,232,0.6)" strokeWidth="0.8" className={styles.gpioLed} />
            <text x="22" y="144" fill="rgba(123,53,232,0.5)" fontSize="7" fontFamily="DM Mono, monospace">LED_STATUS</text>
            <text x="10" y="190" fill="rgba(229,231,235,0.3)" fontSize="7" fontFamily="DM Mono, monospace" className={styles.binStream}>01101001 01101110 00100000 01110010 01110100 01101100</text>
        </svg>
    )
}

function DomainVisual({ type }) {
    switch (type) {
        case 'oscilloscope': return <Oscilloscope />
        case 'bode': return <BodePlot />
        case 'pipeline': return <Pipeline />
        case 'placement': return <ChipPlacement />
        case 'mcu': return <MCUSystem />
        default: return null
    }
}

const IS_TOUCH = typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches &&
    window.innerWidth < 1024

export default function Domains() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const glitchRef = useRef(null)
    const progressRef = useRef([])
    const panelRefs = useRef([])

    useEffect(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        let lastPanel = 0
        gsap.set(track, { x: 0, rotateX: 0 })

        // Pause CSS animations on off-screen panels
        const panelObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const animated = entry.target.querySelectorAll(
                        '[class*="waveClk"],[class*="waveDat"],[class*="waveEn"],' +
                        '[class*="scanCursor"],[class*="bodeLine"],[class*="sineIn"],' +
                        '[class*="sineOut"],[class*="tokenA"],[class*="tokenB"],[class*="tokenC"],' +
                        '[class*="cell"],[class*="routeLine"],[class*="pulse1"],[class*="pulse2"],' +
                        '[class*="pulse3"],[class*="gpioLed"],[class*="binStream"]'
                    )
                    animated.forEach(el => {
                        el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
                    })
                })
            },
            { threshold: 0, rootMargin: '0px 100px 0px 100px' }
        )
        panelRefs.current.forEach(p => { if (p) panelObserver.observe(p) })

        if (IS_TOUCH) {
            return () => { panelObserver.disconnect() }
        }

        let hst = null

        function createST() {
            hst?.kill()
            hst = ScrollTrigger.create({
                trigger: section,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                start: 'top top',
                end: () => `+=${window.innerWidth * (DOMAINS.length - 1) * 1.05}`,
                scrub: 1,
                onUpdate(self) {
                    const progress = Math.max(0, Math.min(1, self.progress))
                    gsap.set(track, { x: -progress * window.innerWidth * (DOMAINS.length - 1) })

                    if (progress > 0.85) {
                        const tiltProg = (progress - 0.85) / 0.15
                        gsap.set(track, { rotateX: tiltProg * 4, transformPerspective: 800 })
                    } else {
                        gsap.set(track, { rotateX: 0 })
                    }

                    const currentPanel = Math.round(progress * (DOMAINS.length - 1))
                    progressRef.current.forEach((sq, i) => {
                        if (!sq) return
                        sq.style.background = i <= currentPanel ? 'var(--accent)' : 'transparent'
                        sq.style.boxShadow = i === currentPanel ? 'var(--glow-xs)' : 'none'
                    })

                    if (currentPanel !== lastPanel) {
                        lastPanel = currentPanel
                        const g = glitchRef.current
                        if (g) {
                            g.style.display = 'block'
                            setTimeout(() => { if (g) g.style.display = 'none' }, 300)
                        }
                    }
                },
                onEnterBack() {
                    lastPanel = 0
                    gsap.set(track, { x: 0, rotateX: 0 })
                },
            })
        }

        // ── Why setTimeout works here ─────────────────────────
        // Hero's ScrollTrigger is created inside an async chain:
        //   fonts.ready → requestAnimationFrame → ScrollTrigger.create()
        // That chain completes in well under 500ms on any device
        // (fonts.ready is near-instant on repeat loads; the rAF is ~16ms).
        //
        // By waiting 500ms we guarantee Hero's ST and its pin spacer
        // are in the DOM before we create the Domains ST, so
        // `start: 'top top'` measures the correct offset (~480vh
        // rather than ~100vh without the spacer).
        //
        // After creating, ScrollTrigger.refresh() recalculates all
        // positions once more as a belt-and-suspenders measure.
        // ─────────────────────────────────────────────────────
        const timer = setTimeout(() => {
            createST()
            ScrollTrigger.refresh()
        }, 500)

        return () => {
            clearTimeout(timer)
            hst?.kill()
            panelObserver.disconnect()
        }
    }, [])

    return (
        <section ref={sectionRef} className={styles.domainsSection} id="domains">
            <div className={styles.perspectiveGrid} aria-hidden="true" />
            <div ref={glitchRef} className={styles.glitchOverlay} aria-hidden="true" />

            <div ref={trackRef} className={styles.domainTrack}>
                {DOMAINS.map((d, i) => (
                    <div
                        key={d.num}
                        className={`${styles.panel} ${i % 2 === 0 ? styles.panelOdd : styles.panelEven}`}
                        data-panel={i}
                        ref={el => { panelRefs.current[i] = el }}
                    >
                        {i % 2 === 0 ? (
                            <>
                                <div className={styles.vizArea}><DomainVisual type={d.visual} /></div>
                                <div className={styles.textArea}>
                                    <span className={styles.panelNum}>{d.num}</span>
                                    <h2 className={styles.panelTitle}>{d.title}</h2>
                                    <p className={styles.panelDesc}>{d.desc}</p>
                                    <p className={styles.panelTools}>{d.tools}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.textArea}>
                                    <span className={styles.panelNum}>{d.num}</span>
                                    <h2 className={styles.panelTitle}>{d.title}</h2>
                                    <p className={styles.panelDesc}>{d.desc}</p>
                                    <p className={styles.panelTools}>{d.tools}</p>
                                </div>
                                <div className={styles.vizArea}><DomainVisual type={d.visual} /></div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.progressBar}>
                {DOMAINS.map((d, i) => (
                    <div
                        key={d.num}
                        className={styles.progressSq}
                        ref={el => { progressRef.current[i] = el }}
                        aria-label={d.title}
                    />
                ))}
            </div>
        </section>
    )
}