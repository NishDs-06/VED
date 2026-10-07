const fs = require('fs');
let jsx = fs.readFileSync('src/components/Footer/Footer.jsx', 'utf8');

jsx = jsx.replace(
    '<div className={styles.ctaIconWrapper}>\n                                </div>',
    `<div className={styles.ctaIconWrapper}>
                                    <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17L17 7M17 7H7M17 7V17" />
                                    </svg>
                                </div>`
);

fs.writeFileSync('src/components/Footer/Footer.jsx', jsx);
