const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

css = css.replace(/\.rightCol \{[^}]+\}/, `.rightCol {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding-left: 2vw;
    margin-top: 60px;
}`);

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
