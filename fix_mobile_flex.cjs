const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

css = css.replace(/grid-template-columns: 1fr;/, `flex-direction: column;`);

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
