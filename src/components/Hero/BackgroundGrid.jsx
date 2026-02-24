/**
 * BackgroundGrid — Layer 1
 * SVG PCB grid. Very low opacity — felt when squinting, invisible at a glance.
 */
export default function BackgroundGrid() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <rect width="72" height="72" fill="none"/>
      <!-- Main grid lines -->
      <line x1="0" y1="18" x2="72" y2="18" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="0" y1="54" x2="72" y2="54" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="18" y1="0" x2="18" y2="72" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="54" y1="0" x2="54" y2="72" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <!-- PCB routing traces (L-shapes) -->
      <line x1="18" y1="36" x2="36" y2="36" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>
      <line x1="36" y1="36" x2="36" y2="54" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>
      <line x1="54" y1="18" x2="54" y2="36" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>
      <line x1="54" y1="36" x2="72" y2="36" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>
      <!-- Junction nodes -->
      <circle cx="18" cy="18" r="1.5" fill="rgba(255,255,255,0.04)"/>
      <circle cx="54" cy="54" r="1.5" fill="rgba(255,255,255,0.04)"/>
      <circle cx="18" cy="54" r="1.5" fill="rgba(255,255,255,0.03)"/>
      <circle cx="54" cy="18" r="1.5" fill="rgba(255,255,255,0.03)"/>
      <circle cx="36" cy="36" r="1"   fill="rgba(255,255,255,0.025)"/>
    </svg>
  `.trim()

  const encoded = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        backgroundImage: encoded,
        backgroundSize: '72px 72px',
        backgroundRepeat: 'repeat',
        pointerEvents: 'none',
      }}
    />
  )
}
