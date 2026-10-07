import re

with open('src/components/Footer/Footer.jsx', 'r') as f:
    jsx_content = f.read()

new_jsx_cta = """                {/* RIGHT COL — Interactive CTA */}
                <div className={styles.rightCol}>
                    <a href="mailto:vedclub.mit@manipal.edu" className={styles.techCta}>
                        <div className={styles.techCtaTop}>
                            <span className={styles.techCtaLabel}>// COLLABORATE</span>
                            <span className={styles.techCtaStatus}>STATUS: READY</span>
                        </div>
                        <div className={styles.techCtaTitleWrapper}>
                            <span className={styles.techCtaTitle}>Wanna</span>
                            <span className={styles.techCtaTitleBold}>Connect? <span className={styles.techCtaArrow}>↗</span></span>
                        </div>
                    </a>
                </div>"""

jsx_content = re.sub(
    r'\{\/\* RIGHT COL — Interactive CTA \*\/.*?<\/div>',
    new_jsx_cta,
    jsx_content,
    flags=re.DOTALL
)

with open('src/components/Footer/Footer.jsx', 'w') as f:
    f.write(jsx_content)

with open('src/components/Footer/Footer.module.css', 'r') as f:
    css_content = f.read()

# Remove the previously added font imports that ruined the vibe
css_content = css_content.replace("@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Syne:wght@700;800&display=swap');", "")

new_css_cta = """/* ── Right Column (Tech CTA) ──────────────────────────── */
.rightCol {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
}

.techCta {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
    padding: 48px;
    border-radius: 4px;
    width: 100%;
    position: relative;
    overflow: hidden;
    transition: all 400ms cubic-bezier(0.23, 1, 0.32, 1);
    backdrop-filter: blur(10px);
}

.techCta:hover {
    border-color: rgba(168, 127, 251, 0.5);
    background: rgba(168, 127, 251, 0.05);
}

.techCta::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #a87ffb, transparent);
    opacity: 0;
    transform: translateY(-100%);
    transition: opacity 300ms ease;
}

.techCta:hover::before {
    opacity: 1;
    animation: scan 2s infinite linear;
}

@keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(300px); }
}

.techCtaTop {
    display: flex;
    justify-content: space-between;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 40px;
}

.techCtaStatus {
    display: flex;
    align-items: center;
    gap: 8px;
}

.techCtaStatus::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #a87ffb;
    box-shadow: 0 0 8px #a87ffb;
    animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
}

.techCtaTitleWrapper {
    display: flex;
    flex-direction: column;
}

.techCtaTitle {
    font-family: 'DM Mono', monospace;
    font-size: clamp(2rem, 3.5vw, 3rem);
    color: rgba(255, 255, 255, 0.6);
    line-height: 1;
}

.techCtaTitleBold {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(3rem, 5.5vw, 6rem);
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.1;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
    letter-spacing: -0.02em;
}

.techCtaArrow {
    color: #a87ffb;
    font-family: 'DM Mono', monospace;
    font-size: clamp(2rem, 4vw, 4rem);
    font-weight: 400;
    transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
}

.techCta:hover .techCtaArrow {
    transform: translate(12px, -12px);
}"""

css_content = re.sub(
    r'\/\* ── Right Column \(Interactive CTA\) ──────────────────────────── \*\/.*?(?=\/\* ── Bottom strip ────────────────────────────────────────────── \*\/)',
    new_css_cta + "\n\n",
    css_content,
    flags=re.DOTALL
)

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(css_content)

print("Updated theme to Tech/Hardware vibe")
