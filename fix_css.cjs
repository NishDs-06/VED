const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

// 1. Remove margin-top: 60px from .rightCol
css = css.replace(/margin-top: 60px;/, 'margin-top: 0px;');

// 2. Enlarge ctaHeading
css = css.replace(/(\.ctaHeading\s*\{[^}]*font-size:\s*)clamp\([^)]+\)/, '$1clamp(2rem, 3.5vw, 3rem)');

// 3. Enlarge ctaHeadingMain
css = css.replace(/(\.ctaHeadingMain\s*\{[^}]*font-size:\s*)clamp\([^)]+\)/, '$1clamp(3.5rem, 6vw, 7rem)');

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
