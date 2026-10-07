const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

// 1. Update rightCol
css = css.replace(/\.rightCol \{[\s\S]*?\}/, `.rightCol {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-left: 2vw;
    margin-top: 0px;
    width: 100%;
}`);

// 2. Remove old midColLabel, socialLogos, socialLink, icon, etc.
// We'll just replace everything from .midColLabel to .madeBy (exclusive)
const startIndex = css.indexOf('.midColLabel');
const endIndex = css.indexOf('.madeBy {');

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `
.rightColLabel {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    margin-top: 0;
}

.socialList {
    display: flex;
    flex-direction: column;
    gap: 0;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.socialLinkItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    padding: 24px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.5);
    transition: color 400ms ease-out, border-color 400ms ease-out;
    width: 100%;
}

.socialList li:first-child .socialLinkItem {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.socialText {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.5rem, 2vw, 2rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1;
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.socialArrow {
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.2);
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), color 400ms ease-out;
}

@media (hover: hover) and (pointer: fine) {
    .socialLinkItem:hover {
        color: #FFFFFF;
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    .socialLinkItem:hover .socialText {
        transform: translateX(12px);
    }
    
    .socialLinkItem:hover .socialArrow {
        color: #FFFFFF;
        transform: translate(4px, -4px);
    }
}

`;
    css = css.slice(0, startIndex) + replacement + css.slice(endIndex);
}

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
