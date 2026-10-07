const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

// 1. Revert rightCol margin and gap
css = css.replace(/\.rightCol \{[\s\S]*?\}/, `.rightCol {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding-left: 2vw;
    margin-top: 60px;
}`);

// 2. Revert ctaHeading size
css = css.replace(/(\.ctaHeading\s*\{[^}]*font-size:\s*)clamp\([^)]+\)/, '$1clamp(1.5rem, 2.5vw, 2.5rem)');

// 3. Revert ctaHeadingMain size
css = css.replace(/(\.ctaHeadingMain\s*\{[^}]*font-size:\s*)clamp\([^)]+\)/, '$1clamp(2.5rem, 4.5vw, 5rem)');

// 4. Add ctaLabel back
const ctaLabelCSS = `
.ctaLabel {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    padding: 0;
    margin-top: 12px;
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
    align-self: flex-start;
}

.ctaLink:hover .ctaLabel {
    color: #FFFFFF;
}
`;

// insert before .ctaHeading
css = css.replace(/\.ctaHeading \{/, ctaLabelCSS + '\n.ctaHeading {');

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
