import re

with open('src/components/Footer/Footer.jsx', 'r') as f:
    jsx_content = f.read()

new_jsx_cta = """                {/* RIGHT COL — Interactive CTA */}
                <div className={styles.rightCol}>
                    <a href="mailto:vedclub.mit@manipal.edu" className={styles.newCta}>
                        <span className={styles.wannaText}>wanna</span>
                        <div className={styles.connectWrapper}>
                            <span className={styles.connectText}>CONNECT</span>
                            <span className={styles.connectGhost}>CONNECT</span>
                            <span className={styles.connectArrow}>↗</span>
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

# Add fonts to top
font_imports = """@import url('https://fonts.googleapis.com/css2?family=Rubik+80s+Fade&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Syne:wght@700;800&display=swap');"""
css_content = css_content.replace("@import url('https://fonts.googleapis.com/css2?family=Rubik+80s+Fade&display=swap');", font_imports)

# Replace right column CSS
new_css_cta = """/* ── Right Column (Interactive CTA) ──────────────────────────── */
.rightCol {
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Align right to counterbalance left col */
    justify-content: flex-end;
}

.newCta {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    padding-bottom: 20px;
}

.wannaText {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: clamp(5rem, 9vw, 12rem);
    color: rgba(255, 255, 255, 0.8);
    line-height: 0.6;
    margin-left: -2vw;
    z-index: 2;
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), color 400ms ease;
}

.newCta:hover .wannaText {
    color: #a87ffb;
    transform: translateY(-10px);
}

.connectWrapper {
    position: relative;
    display: flex;
    align-items: flex-end;
}

.connectText {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(4rem, 8vw, 11rem);
    color: #FFFFFF;
    line-height: 0.9;
    letter-spacing: -0.02em;
    z-index: 2;
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
}

.connectGhost {
    position: absolute;
    top: 0;
    left: 0;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(4rem, 8vw, 11rem);
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.3);
    line-height: 0.9;
    letter-spacing: -0.02em;
    z-index: 1;
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), opacity 400ms ease;
    opacity: 0;
}

.newCta:hover .connectText {
    transform: translate(-12px, -12px);
}

.newCta:hover .connectGhost {
    opacity: 1;
    transform: translate(8px, 8px);
}

.connectArrow {
    font-size: clamp(3rem, 6vw, 8rem);
    font-family: 'Syne', sans-serif;
    color: rgba(255, 255, 255, 0.2);
    margin-left: 1vw;
    transform: translate(-10px, 10px) scale(0.8);
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), color 400ms ease;
}

.newCta:hover .connectArrow {
    transform: translate(0px, -15px) scale(1);
    color: #FFFFFF;
}"""

css_content = re.sub(
    r'\/\* ── Right Column \(Interactive CTA\) ──────────────────────────── \*\/.*?(?=\/\* ── Bottom strip ────────────────────────────────────────────── \*\/)',
    new_css_cta + "\n\n",
    css_content,
    flags=re.DOTALL
)

# Fix mobile
mobile_css = """    .newCta {
        align-items: flex-start;
    }
    .rightCol {
        align-items: flex-start;
    }
    .wannaText {
        margin-left: 0;
    }"""
css_content = re.sub(
    r'    \.ctaTitle \{.*?\n    \}',
    mobile_css,
    css_content,
    flags=re.DOTALL
)

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(css_content)

print("Updated footer to Wanna Connect")
