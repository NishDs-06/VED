import re

with open('src/components/Footer/Footer.jsx', 'r') as f:
    jsx_content = f.read()

new_cta_jsx = """            {/* Massive CTA Section */}
            <div className={styles.ctaWrapper}>
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
            </div>"""

jsx_content = re.sub(
    r'\{\/\* Massive CTA Section \*\/\}.*?<\/div>',
    new_cta_jsx,
    jsx_content,
    flags=re.DOTALL
)

with open('src/components/Footer/Footer.jsx', 'w') as f:
    f.write(jsx_content)

with open('src/components/Footer/Footer.module.css', 'r') as f:
    css_content = f.read()

new_cta_css = """/* ── Massive CTA Section ─────────────────────────────────────── */
.ctaWrapper {
    position: relative;
    z-index: 1;
    padding: 140px 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.ctaTitle {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(4rem, 11vw, 15rem);
    line-height: 0.85;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    cursor: pointer;
    align-items: center;
}

.ctaLine {
    display: flex;
    align-items: center;
    gap: 2vw;
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
    height: clamp(3rem, 8vw, 11rem);
    width: clamp(8rem, 20vw, 28rem);
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
    width: clamp(4rem, 9vw, 12rem);
    height: clamp(4rem, 9vw, 12rem);
    background: #FFFFFF;
    color: #050507 !important;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 2.5vw, 3rem);
    transform: rotate(-45deg);
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), background 400ms ease;
    margin-left: 2vw;
}

.ctaTitle:hover .ctaArrow {
    transform: rotate(0deg);
    background: #a87ffb;
    color: #FFFFFF !important;
}"""

css_content = re.sub(
    r'\/\* ── Massive CTA Section ─────────────────────────────────────── \*\/.*?(?=\/\* ── Bottom Bar ─────────────────────────────────────────────── \*\/)',
    new_cta_css + "\n\n",
    css_content,
    flags=re.DOTALL
)

# Also fix the mobile padding for CTA wrapper
mobile_cta_css = """    .ctaWrapper {
        padding: 80px 16px;
    }
    
    .ctaLine {
        flex-wrap: wrap;
        justify-content: center;
    }"""
css_content = re.sub(
    r'    \.ctaWrapper \{\n        padding: 80px 24px;\n    \}',
    mobile_cta_css,
    css_content,
    flags=re.DOTALL
)

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(css_content)

print("CTA updated")
