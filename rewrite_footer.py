jsx_content = """import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            {/* Massive CTA Section */}
            <div className={styles.ctaWrapper}>
                <p className={styles.ctaSub}>Have an innovative idea?</p>
                <a href="mailto:vedclub.mit@manipal.edu" className={styles.ctaTitle}>
                    Let's Collaborate <span className={styles.ctaArrow}>↗</span>
                </a>
            </div>

            {/* Bottom Bar: Brand & Socials */}
            <div className={styles.bottomBar}>
                <div className={styles.brandInfo}>
                    <div className={styles.brandLogoRow}>
                        <span className={styles.brandName}>VED</span>
                        <div className={styles.brandText}>
                            <span className={styles.brandFull}>VLSI &amp; Embedded Design Club</span>
                            <span className={styles.brandLocation}>MIT Bangalore</span>
                        </div>
                    </div>
                    <span className={styles.tagline}>
                        Innovate. Integrate. Fabricate. Silicon to System.
                    </span>
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
                    <a href="mailto:vedclub.mit@manipal.edu" aria-label="Email" className={styles.socialLink}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
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

css_content = """@import url('https://fonts.googleapis.com/css2?family=Rubik+80s+Fade&display=swap');

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

/* ── Massive CTA Section ─────────────────────────────────────── */
.ctaWrapper {
    position: relative;
    z-index: 1;
    padding: 120px 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.ctaSub {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    margin-bottom: 24px;
}

.ctaTitle {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(3rem, 7vw, 7rem);
    font-weight: 300;
    letter-spacing: -0.03em;
    color: #FFFFFF;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center;
}

.ctaTitle:hover {
    transform: scale(1.02);
}

.ctaArrow {
    font-size: clamp(2rem, 5vw, 5rem);
    font-weight: 200;
    color: rgba(255, 255, 255, 0.3);
    transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), color 300ms ease;
}

.ctaTitle:hover .ctaArrow {
    transform: translate(10px, -10px);
    color: #a87ffb;
}

/* ── Bottom Bar ─────────────────────────────────────────────── */
.bottomBar {
    position: relative;
    z-index: 1;
    padding: 64px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 40px;
}

.brandInfo {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.brandLogoRow {
    display: flex;
    align-items: center;
    gap: 24px;
}

.brandName {
    font-family: 'Rubik 80s Fade', 'DM Mono', monospace;
    font-size: 80px;
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
    margin-top: 8px;
}

.madeBy {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 16px;
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

/* ── Social Logos ────────────────────────────────────────────── */
.socialLogos {
    display: flex;
    gap: 24px;
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
    width: 24px;
    height: 24px;
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
    .ctaWrapper {
        padding: 80px 24px;
    }

    .bottomBar {
        padding: 48px 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 48px;
    }

    .brandLogoRow {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .brandName {
        font-size: 64px;
    }
    
    .socialLogos {
        width: 100%;
        justify-content: center;
        gap: 32px;
    }
    
    .icon {
        width: 28px;
        height: 28px;
    }

    .strip {
        padding: 24px;
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
}
"""

with open('src/components/Footer/Footer.jsx', 'w') as f:
    f.write(jsx_content)

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(css_content)

print("Rewrote Footer files")
