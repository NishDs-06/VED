const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

css = css.replace('.rightCol, .midCol {', `.rightCol {
        margin-top: 0;
        padding-left: 0;
    }
    .rightCol, .midCol {`);

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
