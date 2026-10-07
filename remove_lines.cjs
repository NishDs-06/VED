const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

css = css.replace(/border-bottom: 1px solid rgba\(255, 255, 255, 0\.08\);/, '');
css = css.replace(/padding: 24px 0;/, '');
css = css.replace(/\.socialList li:first-child \.socialLinkItem \{[\s\S]*?\}/, '');

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
