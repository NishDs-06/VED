import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                {/* LEFT — Brand */}
                <div className={styles.brand}>
                    <span className={styles.brandName}>VED</span>
                    <span className={styles.brandFull}>VLSI &amp; Embedded Design Club</span>
                    <span className={styles.brandLocation}>MIT Bangalore</span>
                    <span className={styles.tagline}>
                        Innovate. Integrate. Fabricate.<br />Silicon to System.
                    </span>
                    <span className={styles.madeBy}>
                        <span className={styles.madeByLabel}>CRAFTED BY</span>
                        <a
                            href="https://nishds-06.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.madeByName}
                        >Nishanth D'Souza</a>
                    </span>
                </div>

                {/* MIDDLE — Explore */}
                <div className={styles.links}>
                    <span className={styles.colLabel}>Explore</span>
                    <a href="#domains">Domains</a>
                    <a href="#system-board">Projects</a>
                    <a href="#team">Team</a>
                </div>

                {/* RIGHT — Connect */}
                <div className={styles.links}>
                    <span className={styles.colLabel}>Connect</span>
                    <a href="https://www.linkedin.com/company/ved-mitblr/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://www.instagram.com/ved.mitblr?igsh=MTVscmdyZjk0MTRrbQ==" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="mailto:ved@mit.edu">ved@mit.edu</a>
                </div>
            </div>

            <div className={styles.strip}>
                <span>© 2026 VED — MIT Bangalore</span>
                <span>The official VLSI &amp; Embedded Design Club of MIT BLR</span>
            </div>
        </footer>
    )
}