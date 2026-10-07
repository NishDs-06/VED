const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

// update midColLabel
css = css.replace(/\.midColLabel \{[^}]+\}/, `.midColLabel {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: -0.02em;
    text-transform: none;
    line-height: 1;
    margin-top: 0;
}`);

// update rightCol gap and margin
css = css.replace(/\.rightCol \{[^}]+\}/, `.rightCol {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    padding-right: 8vw;
    margin-top: 57px;
}`);

// update socialLogos margin-top
css = css.replace(/margin-top: calc\(clamp[^;]+\);/, 'margin-top: 0;');

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
