const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

css = css.replace('.rightCol, .midCol {', `.socialLinkItem { justify-content: flex-start; }\n    .rightCol, .midCol {`);

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
