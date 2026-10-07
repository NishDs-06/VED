with open('src/components/Footer/Footer.jsx', 'r') as f:
    jsx_content = f.read()

new_jsx = """import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.mainGrid}>
                {/* LEFT COL — Brand & Connect */}
                <div className={styles.leftCol}>
                    <div className={styles.brandInfo}>
                        <div className={styles.brandLogoRow}>
                            <span className={styles.brandName}>VED</span>
                            <div className={styles.brandText}>
                                <span className={styles.brandFull}>VLSI &amp; Embedded Design Club</span>
                                <span className={styles.brandLocation}>MIT Bangalore</span>
                            </div>
                        </div>
                        <span className={styles.tagline}>
                            Innovate. Integrate. Fabricate.<br />Silicon to System.
                        </span>
                    </div>

                    <div className={styles.socialsAndCredit}>
                        <div className={styles.socialLogos}>
                            <a href="https://www.linkedin.com/company/ved-mitblr/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialLink}>
                                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/ved.mitblr?igsh=MTVscmdyZjk0MTRrbQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </a>
                        </div>
                        <span className={styles.madeBy}>
                            <span className={styles.madeByLabel}>CRAFTED BY</span>
                            <a
                                href="https://nishds-06.github.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.madeByName}
                            >
                                Nishanth D'Souza <span className={styles.designation}>— Technical Lead</span>
                            </a>
                        </span>
                    </div>
                </div>

                {/* RIGHT COL — Interactive CTA */}
                <div className={styles.rightCol}>
                    <p className={styles.ctaSub}>Have an innovative idea?</p>
                    <a href="mailto:vedclub.mit@manipal.edu" className={styles.ctaTitle}>
                        <div className={styles.ctaLine}>
                            <span>LET'S</span>
                            <div className={styles.ctaPill}>
                                <div className={styles.ctaPillInner}></div>
                            </div>
                        </div>
                        <div className={styles.ctaLine}>
                            <span className={styles.ctaStroke}>COLLABORATE</span>
                            <span className={styles.ctaArrow}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 19L19 5M19 5v10M19 5H9" /></svg>
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            <div className={styles.strip}>
                <span>© 2026 VED — MIT Bangalore</span>
                <span>The official VLSI &amp; Embedded Design Club of MIT BLR</span>
            </div>
        </footer>
    )
}
"""
with open('src/components/Footer/Footer.jsx', 'w') as f:
    f.write(new_jsx)


with open('src/components/Footer/Footer.module.css', 'r') as f:
    css_content = f.read()

new_css = """@import url('https://fonts.googleapis.com/css2?family=Rubik+80s+Fade&display=swap');

.footer {
    background: #050507;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.footer::before {
    content: '';
    position: absolute;
    bottom: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 340px;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}

.footer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 20%, #FFFFFF 50%, rgba(255, 255, 255, 0.4) 80%, transparent 100%);
}

/* ── Main Layout ─────────────────────────────────────────────── */
.mainGrid {
    position: relative;
    z-index: 1;
    padding: 100px 64px 80px;
    display: grid;
    grid-template-columns: 3.5fr 6.5fr;
    gap: 64px;
    align-items: flex-end;
}

/* ── Left Column (Brand) ─────────────────────────────────────── */
.leftCol {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    gap: 64px;
}

.brandInfo {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.brandLogoRow {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.brandName {
    font-family: 'Rubik 80s Fade', 'DM Mono', monospace;
    font-size: 72px;
    font-weight: 400;
    color: #FFFFFF;
    letter-spacing: 0.06em;
    line-height: 1;
    text-shadow: 0 0 16px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.55), 0 0 80px rgba(255, 255, 255, 0.25);
}

.brandText {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.brandFull {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
}

.brandLocation {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.1em;
}

.tagline {
    font-family: 'DM Mono', monospace;
    font-style: italic;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.7;
}

.socialsAndCredit {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.socialLogos {
    display: flex;
    gap: 16px;
    align-items: center;
}

.socialLink {
    color: rgba(255, 255, 255, 0.4);
    transition: color 200ms ease, transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.socialLink:hover {
    color: #FFFFFF;
    transform: scale(1.1) translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.icon {
    width: 20px;
    height: 20px;
}

.madeBy {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.madeByLabel {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.30em;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
}

.madeByName {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: color 200ms ease, text-shadow 200ms ease;
    display: inline-block;
}

.madeByName:hover {
    color: #FFFFFF;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
}

.designation {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.02em;
    font-style: italic;
}

/* ── Right Column (Interactive CTA) ──────────────────────────── */
.rightCol {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.ctaSub {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.25em;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    margin-bottom: 32px;
}

.ctaTitle {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(3rem, 6vw, 8rem);
    line-height: 0.85;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    cursor: pointer;
}

.ctaLine {
    display: flex;
    align-items: center;
    gap: 1.5vw;
}

.ctaTitle span {
    color: #FFFFFF;
    transition: color 500ms cubic-bezier(0.23, 1, 0.32, 1);
}

.ctaStroke {
    color: transparent !important;
    -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.3);
    transition: all 500ms cubic-bezier(0.23, 1, 0.32, 1) !important;
}

.ctaTitle:hover .ctaStroke {
    color: #FFFFFF !important;
    -webkit-text-stroke: 1.5px transparent;
}

.ctaPill {
    height: clamp(2rem, 5vw, 6rem);
    width: clamp(6rem, 12vw, 15rem);
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.0));
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    overflow: hidden;
    position: relative;
    transform: scale(0.95);
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), border-color 500ms ease;
}

.ctaPillInner {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, #a87ffb 0%, transparent 70%);
    opacity: 0.3;
    transition: opacity 600ms cubic-bezier(0.23, 1, 0.32, 1), transform 800ms cubic-bezier(0.23, 1, 0.32, 1);
}

.ctaTitle:hover .ctaPillInner {
    opacity: 0.8;
    transform: scale(1.5);
}

.ctaTitle:hover .ctaPill {
    transform: scale(1);
    border-color: rgba(255, 255, 255, 0.4);
}

.ctaArrow {
    width: clamp(3rem, 5vw, 6rem);
    height: clamp(3rem, 5vw, 6rem);
    background: #FFFFFF;
    color: #050507 !important;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(0.7rem, 1.5vw, 2rem);
    transform: rotate(-45deg);
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), background 400ms ease;
    margin-left: 1.5vw;
}

.ctaTitle:hover .ctaArrow {
    transform: rotate(0deg);
    background: #a87ffb;
    color: #FFFFFF !important;
}

/* ── Bottom strip ────────────────────────────────────────────── */
.strip {
    position: relative;
    z-index: 1;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 24px 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.strip span {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
    .mainGrid {
        grid-template-columns: 1fr;
        padding: 64px 24px;
        gap: 80px;
    }

    .brandName {
        font-size: 64px;
    }
    
    .socialLogos {
        gap: 24px;
    }
    
    .ctaTitle {
        font-size: 4rem;
    }
    
    .ctaLine {
        flex-wrap: wrap;
        gap: 16px;
    }
    
    .ctaArrow {
        margin-left: 0;
    }

    .strip {
        padding: 24px;
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
}
"""
with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(new_css)

print("Updated footer layout")
