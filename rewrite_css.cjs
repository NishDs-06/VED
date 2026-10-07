const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

// Add import if not present
if (!css.includes('Grand+Hotel')) {
    css = css.replace(/@import url\('[^']+'\);/, `$&
@import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&display=swap');`);
}

// Remove old stuff
const start = css.indexOf('.rightColLabel {');
const end = css.indexOf('.madeBy {');

const newCSS = `
.rightColLabel {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    margin-top: 0;
    line-height: 1; /* Match VED logo cap-height closely */
}

.socialList {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Slightly closer without lines */
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.socialLinkItem {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.5);
    transition: color 400ms ease-out;
}

.socialText {
    font-size: clamp(2rem, 3.5vw, 3rem); /* Make them pop without borders */
    letter-spacing: -0.02em;
    line-height: 1;
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), color 400ms ease;
}

.linkedinText {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-weight: 700;
}

.instagramText {
    font-family: 'Grand Hotel', cursive;
    font-weight: 400;
    font-size: clamp(2.5rem, 4.5vw, 4rem); /* Script fonts usually need to be a bit larger */
}

@media (hover: hover) and (pointer: fine) {
    .socialLinkItem:hover .socialText {
        transform: translateX(12px);
    }
    
    .socialLinkItem:hover .linkedinText {
        color: #0a66c2;
    }

    .socialLinkItem:hover .instagramText {
        color: #e1306c; /* Or a fallback instagram pink */
    }
}
`;

if (start !== -1 && end !== -1) {
    css = css.slice(0, start) + newCSS + '\n' + css.slice(end);
}

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
