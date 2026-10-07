const fs = require('fs');
let jsx = fs.readFileSync('src/components/Footer/Footer.jsx', 'utf8');

jsx = jsx.replace(/<span className=\{styles\.socialText\}>LinkedIn<\/span>/, '<span className={`${styles.socialText} ${styles.linkedinText}`}>LinkedIn</span>');
jsx = jsx.replace(/<span className=\{styles\.socialText\}>Instagram<\/span>/, '<span className={`${styles.socialText} ${styles.instagramText}`}>Instagram</span>');

fs.writeFileSync('src/components/Footer/Footer.jsx', jsx);
