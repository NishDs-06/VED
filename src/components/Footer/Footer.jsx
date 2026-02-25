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
                        Design. Build. Iterate.<br />Silicon to System.
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
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="mailto:ved@mit.edu">ved@mit.edu</a>
                </div>
            </div>

            <div className={styles.strip}>
                <span>© 2026 VED — MIT Bangalore</span>
                <span>Designed in RTL.</span>
            </div>
        </footer>
    )
}
