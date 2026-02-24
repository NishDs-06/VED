import { useEffect, useRef } from 'react'

export default function MagneticCursor() {
    const dotRef = useRef(null)
    const haloRef = useRef(null)

    useEffect(() => {
        // Hide on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return

        const dot = dotRef.current
        const halo = haloRef.current
        if (!dot || !halo) return

        let mx = window.innerWidth / 2
        let my = window.innerHeight / 2
        let hx = mx, hy = my
        let rafId

        function lerp(a, b, t) { return a + (b - a) * t }

        function tick() {
            hx = lerp(hx, mx, 0.08)
            hy = lerp(hy, my, 0.08)
            dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
            halo.style.transform = `translate(${hx}px,${hy}px) translate(-50%,-50%)`
            rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)

        function onMove(e) { mx = e.clientX; my = e.clientY }
        window.addEventListener('mousemove', onMove)

        // Expand halo on interactive elements
        function onEnter(e) {
            if (e.target.closest('a,button,[data-magnetic]')) {
                halo.style.width = '80px'
                halo.style.height = '80px'
                halo.style.background = 'rgba(0,194,255,0.18)'
                halo.style.borderColor = 'rgba(0,194,255,0.9)'
            }
        }
        function onLeave(e) {
            if (e.target.closest('a,button,[data-magnetic]')) {
                halo.style.width = '48px'
                halo.style.height = '48px'
                halo.style.background = 'rgba(0,194,255,0.08)'
                halo.style.borderColor = 'rgba(0,194,255,0.5)'
            }
        }
        document.addEventListener('mouseover', onEnter)
        document.addEventListener('mouseout', onLeave)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseover', onEnter)
            document.removeEventListener('mouseout', onLeave)
        }
    }, [])

    return (
        <>
            {/* sharp dot */}
            <div ref={dotRef} style={{
                position: 'fixed', top: 0, left: 0,
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#fff',
                zIndex: 99999,
                pointerEvents: 'none',
                willChange: 'transform',
            }} />
            {/* lerped halo */}
            <div ref={haloRef} style={{
                position: 'fixed', top: 0, left: 0,
                width: 48, height: 48,
                borderRadius: '50%',
                background: 'rgba(0,194,255,0.08)',
                border: '1px solid rgba(0,194,255,0.5)',
                backdropFilter: 'blur(1px)',
                zIndex: 99998,
                pointerEvents: 'none',
                willChange: 'transform',
                transition: 'width 0.2s, height 0.2s, background 0.2s, border-color 0.2s',
            }} />
        </>
    )
}
