const fs = require('fs');

let jsx = fs.readFileSync('src/components/Footer/Footer.jsx', 'utf8');

const newRightCol = `{/* RIGHT COL — Socials */}
                <div className={styles.rightCol}>
                    <span className={styles.rightColLabel}>Also check us out on</span>
                    <ul className={styles.socialList}>
                        <li>
                            <a href="https://www.linkedin.com/company/ved-mitblr/" target="_blank" rel="noopener noreferrer" className={styles.socialLinkItem}>
                                <span className={styles.socialText}>LinkedIn</span>
                                <svg className={styles.socialArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/ved.mitblr?igsh=MTVscmdyZjk0MTRrbQ==" target="_blank" rel="noopener noreferrer" className={styles.socialLinkItem}>
                                <span className={styles.socialText}>Instagram</span>
                                <svg className={styles.socialArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>`;

jsx = jsx.replace(/\{\/\* RIGHT COL — Socials \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<div className=\{styles\.strip\}>/, newRightCol + '\n            </div>\n\n            <div className={styles.strip}>');

fs.writeFileSync('src/components/Footer/Footer.jsx', jsx);
