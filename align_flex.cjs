const fs = require('fs');
let css = fs.readFileSync('src/components/Footer/Footer.module.css', 'utf8');

css = css.replace(/\.mainGrid \{[\s\S]*?\}/, `.mainGrid {
    position: relative;
    z-index: 1;
    padding: 100px 64px 80px;
    display: flex;
    justify-content: space-between;
    gap: 32px;
    align-items: flex-start;
}`);

css = css.replace(/\.rightCol \{[\s\S]*?\}/, `.rightCol {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-top: 0px;
    align-items: flex-end; /* Align contents to the right */
}`);

// also remove padding-left: 2vw and width: 100% from rightCol

// socialList width
css = css.replace(/\.socialList \{[\s\S]*?\}/, `.socialList {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    width: max-content;
}`);

// socialLinkItem
css = css.replace(/\.socialLinkItem \{[\s\S]*?\}/, `.socialLinkItem {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* Right align the text */
    text-decoration: none;
    color: rgba(255, 255, 255, 0.5);
    transition: color 400ms ease-out;
    padding: 24px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    width: 100%;
}`);

// fix hover transform translation
// wait, if it's right aligned, hover should probably translate left? Or maybe right is fine.
css = css.replace(/transform: translateX\(12px\);/, 'transform: translateX(-12px);');

fs.writeFileSync('src/components/Footer/Footer.module.css', css);
