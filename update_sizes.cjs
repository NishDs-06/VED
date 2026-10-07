const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

// Reduce font sizes
css = css.replace(/(\.socialText\s*\{[^}]*font-size:\s*)clamp\([^)]+\)/, '$1clamp(1.5rem, 2.5vw, 2.5rem)');
css = css.replace(/(\.instagramText\s*\{[^}]*font-size:\s*)clamp\([^)]+\)/, '$1clamp(2rem, 3vw, 3rem)');

// Add padding-right to rightCol to move it left
css = css.replace(/\.rightCol \{[\s\S]*?\}/, `.rightCol {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-top: 0px;
    align-items: flex-end;
    padding-right: 4vw; /* Move it a little left */
}`);

// Also fix mobile so it doesn't get squished by padding-right
css = css.replace(/\.rightCol \{(\s*)margin-top: 0;(\s*)padding-left: 0;(\s*)\}/, `.rightCol {$1margin-top: 0;$2padding-left: 0;$2padding-right: 0;$3}`);


fs.writeFileSync('src/components/Footer/Footer.module.css', css);
