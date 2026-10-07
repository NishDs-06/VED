import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.mainGrid}>
                {/* LEFT COL — Brand & Connect */}
                <div className={styles.leftCol}>
                    <div className={styles.brandInfo}>
                        <div className={styles.brandLogoRow}>
                            <span className={styles.brandName}>VED</span>
                            <div className={styles.brandText}>
                                <span className={styles.brandFull}>VLSI &amp; Embedded Design Club</span>
                                <span className={styles.brandLocation}>MIT Bangalore</span>
                            </div>
                        </div>
                        <span className={styles.tagline}>
                            Innovate. Integrate. Fabricate.<br />Silicon to System.
                        </span>
                    </div>
                </div>

                {/* MID COL — Interactive CTA */}
                <div className={styles.midCol}>
                    <a href="mailto:vedclub.mit@manipal.edu" className={styles.ctaLink}>
                        <div className={styles.ctaLabel}>Available for new ideas</div>
                        <div className={styles.ctaHeading}>
                            Wanna
                            <div className={styles.ctaHeadingMain}>
                                Connect?
                                <div className={styles.ctaIconWrapper}>
                                    <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17L17 7M17 7H7M17 7V17" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                {/* RIGHT COL — Socials */}
                <div className={styles.rightCol}>
                    <span className={styles.rightColLabel}>Also check us out on</span>
                    <ul className={styles.socialList}>
                        <li>
                            <a href="https://www.linkedin.com/company/ved-mitblr/" target="_blank" rel="noopener noreferrer" className={styles.socialLinkItem}>
                                <span className={`${styles.socialText} ${styles.linkedinText}`}>LinkedIn</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/ved.mitblr?igsh=MTVscmdyZjk0MTRrbQ==" target="_blank" rel="noopener noreferrer" className={styles.socialLinkItem}>
                                <span className={`${styles.socialText} ${styles.instagramText}`}>Instagram</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.strip}>
                <div className={styles.stripLeft}>
                    <span>© 2026 VED — MIT Bangalore</span>
                    <span>The official VLSI &amp; Embedded Design Club of MIT BLR</span>
                </div>
                <div className={styles.madeBy}>
                    <span className={styles.madeByLabel}>CRAFTED BY</span>
                    <a
                        href="https://nishds-06.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.madeByName}
                    >
                        Nishanth D'Souza
                    </a>
                    <span className={styles.designation}>Technical Lead, VED Club</span>
                </div>
            </div>
        </footer>
    )
}
