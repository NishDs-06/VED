import { useEffect, useRef, useState } from 'react'

const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'
document.head.appendChild(fontLink)

export default function ChipLoader({ onComplete }) {
    const canvasRef = useRef(null)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let alive = true, rafId

        function resize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const W = () => canvas.width
        const H = () => canvas.height
        const CX = () => W() / 2
        const CY = () => H() / 2
        const S = () => Math.min(W(), H()) * 0.28
        const BV = () => S() * 0.04

        let phase = 'appear'
        let appearProg = 0
        let wireProg = 0
        let implodeProg = 0
        let startTime = null
        let pulseTimer = 0
        let traces = []
        let tracesBuilt = false

        function bevel(x, y, w, h, b) {
            ctx.beginPath()
            ctx.moveTo(x + b, y)
            ctx.lineTo(x + w - b, y)
            ctx.lineTo(x + w, y + b)
            ctx.lineTo(x + w, y + h - b)
            ctx.lineTo(x + w - b, y + h)
            ctx.lineTo(x + b, y + h)
            ctx.lineTo(x, y + h - b)
            ctx.lineTo(x, y + b)
            ctx.closePath()
        }

        function buildTraces() {
            const cs = S(), cx_ = CX(), cy_ = CY()
            const pad = cs * 0.20
            const L = cx_ - cs / 2 - pad, T = cy_ - cs / 2 - pad
            const bw = cs + pad * 2
            const PADS = 9
            const step = bw / (PADS + 1)
            const reach = cs * 1.4
            const cols = [
                'rgba(123,53,232,',
                'rgba(155,90,255,',
                'rgba(168,85,247,',
                'rgba(100,40,200,',
            ]
            const out = []
            for (let i = 0; i < PADS; i++) {
                const off = (i + 1) * step
                const jit = (Math.random() - 0.5) * reach * 0.55
                const len = reach * (0.4 + Math.random() * 0.6)
                const col = cols[i % cols.length]
                const delay = (i / PADS) * 0.55
                out.push({ sx: L + off, sy: T, dir: 'up', len, jit, col, delay, pulses: [] })
                out.push({ sx: L + off, sy: T + bw, dir: 'down', len: len * 0.85, jit: -jit, col: cols[(i + 1) % 4], delay: delay + 0.05, pulses: [] })
                out.push({ sx: L, sy: T + off, dir: 'left', len: len * 0.9, jit, col: cols[(i + 2) % 4], delay: delay * 0.9, pulses: [] })
                out.push({ sx: L + bw, sy: T + off, dir: 'right', len: len * 0.95, jit: -jit, col: cols[(i + 3) % 4], delay: delay * 0.85, pulses: [] })
            }
            return out
        }

        function drawTraces(wprog) {
            for (const tr of traces) {
                const lp = Math.max(0, Math.min(1, (wprog - tr.delay) / (1 - tr.delay + 0.001)))
                if (lp < 0.005) continue
                let ex = tr.sx, ey = tr.sy
                if (tr.dir === 'up') ey = tr.sy - tr.len * lp
                if (tr.dir === 'down') ey = tr.sy + tr.len * lp
                if (tr.dir === 'left') ex = tr.sx - tr.len * lp
                if (tr.dir === 'right') ex = tr.sx + tr.len * lp

                const bp = Math.max(0, (lp - 0.55) / 0.45)
                let bx = ex, by = ey
                if (tr.dir === 'up' || tr.dir === 'down') bx = ex + tr.jit * bp
                else by = ey + tr.jit * bp

                ctx.save()
                ctx.globalAlpha = 0.45 * lp
                ctx.strokeStyle = tr.col + '1)'
                ctx.lineWidth = 1.0
                ctx.shadowBlur = 6
                ctx.shadowColor = tr.col + '0.6)'
                ctx.beginPath(); ctx.moveTo(tr.sx, tr.sy); ctx.lineTo(ex, ey); ctx.stroke()

                if (bp > 0.01) {
                    ctx.globalAlpha = 0.28 * bp
                    ctx.lineWidth = 0.6
                    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(bx, by); ctx.stroke()
                    ctx.globalAlpha = 0.55 * bp
                    ctx.fillStyle = tr.col + '1)'
                    ctx.shadowBlur = 8
                    ctx.beginPath(); ctx.arc(bx, by, 2, 0, Math.PI * 2); ctx.fill()
                }

                for (const p of tr.pulses) {
                    const px = tr.sx + (ex - tr.sx) * p.t
                    const py = tr.sy + (ey - tr.sy) * p.t
                    ctx.globalAlpha = (1 - p.t) * 0.85
                    ctx.fillStyle = tr.col + '1)'
                    ctx.shadowBlur = 12
                    ctx.shadowColor = tr.col + '1)'
                    ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill()
                }
                ctx.restore()
            }
        }

        function drawChip(prog, impl) {
            const cs = S() * (impl ? 1 - impl : 1)
            const bv = BV() * (impl ? 1 - impl : 1)
            const pad = cs * 0.20
            const cx_ = CX(), cy_ = CY()
            const L = cx_ - cs / 2, T = cy_ - cs / 2
            const R = L + cs, B = T + cs
            const al = impl ? Math.pow(1 - impl, 1.8) : Math.pow(prog, 1.2)
            if (al < 0.005) return

            ctx.save()

            // PCB board
            const pl = L - pad, pt = T - pad, ps = cs + pad * 2
            ctx.globalAlpha = al * 0.85
            ctx.fillStyle = '#05020e'
            ctx.beginPath(); ctx.rect(pl, pt, ps, ps); ctx.fill()
            ctx.globalAlpha = al * 0.4
            ctx.strokeStyle = 'rgba(100,40,180,0.5)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.rect(pl, pt, ps, ps); ctx.stroke()

            // PCB grid
            ctx.globalAlpha = al * 0.04
            ctx.strokeStyle = 'rgba(140,70,255,1)'
            ctx.lineWidth = 0.4
            const gs = cs * 0.09
            for (let gx = pl; gx <= pl + ps; gx += gs) {
                ctx.beginPath(); ctx.moveTo(gx, pt); ctx.lineTo(gx, pt + ps); ctx.stroke()
            }
            for (let gy = pt; gy <= pt + ps; gy += gs) {
                ctx.beginPath(); ctx.moveTo(pl, gy); ctx.lineTo(pl + ps, gy); ctx.stroke()
            }

            // PCB pads
            const PADS = 9, pstep = ps / (PADS + 1), psz = cs * 0.016
            ctx.globalAlpha = al * 0.55
            ctx.fillStyle = 'rgba(120,60,200,0.6)'
            ctx.strokeStyle = 'rgba(150,90,240,0.5)'
            ctx.lineWidth = 0.5
            for (let i = 0; i < PADS; i++) {
                const off = (i + 1) * pstep
                    ;[
                        [pl + off - psz / 2, pt + psz, psz, psz * 1.5],
                        [pl + off - psz / 2, pt + ps - psz * 2.5, psz, psz * 1.5],
                        [pl + psz, pt + off - psz / 2, psz * 1.5, psz],
                        [pl + ps - psz * 2.5, pt + off - psz / 2, psz * 1.5, psz],
                    ].forEach(([rx, ry, rw, rh]) => {
                        ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.fill(); ctx.stroke()
                    })
            }

            // IHS body — dark purple-black
            ctx.globalAlpha = al
            const ihsGrad = ctx.createLinearGradient(L, T, R, B)
            ihsGrad.addColorStop(0, '#120820')
            ihsGrad.addColorStop(0.30, '#0d061a')
            ihsGrad.addColorStop(0.55, '#0a0416')
            ihsGrad.addColorStop(0.80, '#0f0620')
            ihsGrad.addColorStop(1, '#130924')
            ctx.fillStyle = ihsGrad
            bevel(L, T, cs, cs, bv)
            ctx.fill()

            // IHS border
            ctx.globalAlpha = al * 0.9
            const borderGrad = ctx.createLinearGradient(L, T, R, B)
            borderGrad.addColorStop(0, 'rgba(168,85,247,0.9)')
            borderGrad.addColorStop(0.5, 'rgba(123,53,232,0.7)')
            borderGrad.addColorStop(1, 'rgba(100,40,200,0.8)')
            ctx.strokeStyle = borderGrad
            ctx.lineWidth = 1.8
            bevel(L, T, cs, cs, bv)
            ctx.stroke()

            // Inner border
            ctx.globalAlpha = al * 0.18
            ctx.strokeStyle = 'rgba(168,85,247,0.5)'
            ctx.lineWidth = 0.6
            bevel(L + 5, T + 5, cs - 10, cs - 10, Math.max(2, bv - 3))
            ctx.stroke()

            // Top-left sheen
            ctx.globalAlpha = al * 0.10
            const sheen = ctx.createLinearGradient(L, T, L + cs * 0.6, T + cs * 0.6)
            sheen.addColorStop(0, 'rgba(200,150,255,0.5)')
            sheen.addColorStop(0.5, 'rgba(140,80,220,0.15)')
            sheen.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = sheen
            bevel(L, T, cs, cs, bv)
            ctx.fill()

            // VED wordmark — glow layer
            const vedSz = cs * 0.40
            ctx.font = `400 ${vedSz}px "Bebas Neue", sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.globalAlpha = al * 0.30
            ctx.fillStyle = 'rgba(192,132,252,1)'
            ctx.shadowBlur = cs * 0.20
            ctx.shadowColor = 'rgba(123,53,232,0.95)'
            ctx.fillText('VED', cx_, cy_ - cs * 0.035)

            // VED wordmark — crisp layer
            ctx.globalAlpha = al * 0.88
            ctx.fillStyle = 'rgba(220,190,255,1)'
            ctx.shadowBlur = cs * 0.055
            ctx.shadowColor = 'rgba(168,85,247,0.7)'
            ctx.fillText('VED', cx_, cy_ - cs * 0.035)
            ctx.shadowBlur = 0

            // Sub-text
            ctx.globalAlpha = al * 0.28
            ctx.fillStyle = 'rgba(168,85,247,1)'
            ctx.font = `400 ${cs * 0.040}px "DM Mono", monospace`
            ctx.textBaseline = 'top'
            ctx.fillText('MIT BANGALORE  ·  SKY130', cx_, cy_ + cs * 0.24)

            // Brand mark top-left
            ctx.globalAlpha = al * 0.20
            ctx.fillStyle = 'rgba(192,132,252,1)'
            ctx.font = `400 ${cs * 0.036}px "DM Mono", monospace`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText('VED SEMI', L + cs * 0.06, T + cs * 0.06)

            // Serial bottom-right
            ctx.globalAlpha = al * 0.13
            ctx.fillStyle = 'rgba(168,85,247,1)'
            ctx.font = `300 ${cs * 0.028}px "DM Mono", monospace`
            ctx.textAlign = 'right'
            ctx.textBaseline = 'bottom'
            ctx.fillText('S/N · VED-2026-001', R - cs * 0.05, B - cs * 0.05)

            ctx.restore()
        }

        function drawStatus(prog, impl) {
            if (impl > 0.6) return
            const al = impl ? (1 - impl / 0.6) : 1
            const msgs = ['POWER ON...', 'INIT CACHE...', 'LOAD MICROCODE...', 'ROUTING...', 'READY']
            const msg = msgs[Math.min(Math.floor(prog * msgs.length), msgs.length - 1)]
            const bw = S() * 1.05
            const bx = CX() - bw / 2
            const by = CY() + S() / 2 + S() * 0.20 + 38

            ctx.save()
            ctx.globalAlpha = 0.4 * al
            ctx.fillStyle = 'rgba(168,85,247,1)'
            ctx.font = '400 9px "DM Mono", monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillText(msg, CX(), by - 7)

            ctx.globalAlpha = 0.10 * al
            ctx.fillStyle = 'rgba(123,53,232,1)'
            ctx.beginPath(); ctx.rect(bx, by, bw, 1.5); ctx.fill()

            ctx.globalAlpha = 0.7 * al
            const fg = ctx.createLinearGradient(bx, 0, bx + bw, 0)
            fg.addColorStop(0, 'rgba(100,30,200,1)')
            fg.addColorStop(1, 'rgba(192,132,252,1)')
            ctx.fillStyle = fg
            ctx.shadowBlur = 6
            ctx.shadowColor = 'rgba(168,85,247,0.8)'
            ctx.beginPath(); ctx.rect(bx, by, bw * prog, 1.5); ctx.fill()
            ctx.restore()
        }

        function drawBg() {
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, W(), H())
            const bg = ctx.createRadialGradient(CX(), CY(), 0, CX(), CY(), W() * 0.55)
            bg.addColorStop(0, 'rgba(40,8,70,0.45)')
            bg.addColorStop(0.5, 'rgba(15,3,30,0.25)')
            bg.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, W(), H())
        }

        function loop(now) {
            if (!alive) return
            if (!startTime) startTime = now
            const el = now - startTime
            ctx.clearRect(0, 0, W(), H())
            drawBg()

            if (phase === 'appear') {
                appearProg = Math.min(1, el / 700)
                drawChip(appearProg, 0)
                drawStatus(appearProg * 0.2, 0)
                if (appearProg >= 1) {
                    if (!tracesBuilt) { traces = buildTraces(); tracesBuilt = true }
                    phase = 'wires'; startTime = now
                }
            } else if (phase === 'wires') {
                wireProg = Math.min(1, el / 1300)
                drawChip(1, 0); drawTraces(wireProg)
                pulseTimer += 16
                if (pulseTimer > 110) {
                    pulseTimer = 0
                    traces[Math.floor(Math.random() * traces.length)].pulses.push({ t: 0, speed: 0.009 + Math.random() * 0.012 })
                }
                for (const tr of traces) { tr.pulses = tr.pulses.filter(p => p.t < 1); for (const p of tr.pulses) p.t += p.speed }
                drawStatus(0.2 + wireProg * 0.65, 0)
                if (wireProg >= 1) { phase = 'pulse'; startTime = now }
            } else if (phase === 'pulse') {
                drawChip(1, 0); drawTraces(1)
                pulseTimer += 16
                if (pulseTimer > 75) {
                    pulseTimer = 0
                    traces[Math.floor(Math.random() * traces.length)].pulses.push({ t: 0, speed: 0.009 + Math.random() * 0.012 })
                }
                for (const tr of traces) { tr.pulses = tr.pulses.filter(p => p.t < 1); for (const p of tr.pulses) p.t += p.speed }
                drawStatus(0.85 + (el / 600) * 0.15, 0)
                if (el > 600) { phase = 'implode'; startTime = now }
            } else if (phase === 'implode') {
                implodeProg = Math.min(1, el / 500)
                const e = implodeProg < 0.5 ? 2 * implodeProg * implodeProg : 1 - Math.pow(-2 * implodeProg + 2, 2) / 2
                drawChip(1, e); drawTraces(1 - e); drawStatus(1, e)
                if (implodeProg >= 1) { setFadeOut(true); setTimeout(() => onComplete?.(), 500) }
            }

            rafId = requestAnimationFrame(loop)
        }

        document.fonts.ready.then(() => { rafId = requestAnimationFrame(loop) })
        return () => { alive = false; cancelAnimationFrame(rafId); window.removeEventListener('resize', resize) }
    }, [])

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#000',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: fadeOut ? 'none' : 'all',
        }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} aria-hidden="true" />
        </div>
    )
}