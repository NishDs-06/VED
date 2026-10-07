import { Link } from 'react-router-dom';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './Navigation.css';

export default function Navigation() {
    const navRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useLayoutEffect(() => {
        gsap.fromTo(navRef.current, {
            y: -100,
            opacity: 0,
            scale: 0.95
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: 1.5,
            ease: 'expo.out'
        });
    }, []);

    return (
        <>
        <nav className={`main-nav-pill ${scrolled ? 'scrolled' : ''}`} ref={navRef}>
            <div className="nav-pill-inner">
                <div className="nav-logo">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="logo-text">VED</span>
                    </Link>
                </div>
                
                <div className="desktop-links">
                    <Link to="/announcements">Announcements</Link>
                    <Link to="/projects">Projects & Research</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/team">Team</Link>
                </div>

                <button 
                    className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>

        {/* Mobile Menu Side Drawer */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
            
            <div className="mobile-menu-drawer">
                <div className="mobile-menu-close-header">
                    <button 
                        className="mobile-close-btn" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="mobile-links">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/announcements" onClick={() => setIsMobileMenuOpen(false)}>Announcements</Link>
                    <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)}>Projects & Research</Link>
                    <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
                    <Link to="/team" onClick={() => setIsMobileMenuOpen(false)}>Team</Link>
                </div>
            </div>
        </div>
        </>
    );
}
