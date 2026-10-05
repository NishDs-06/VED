import { Link } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Navigation.css';

export default function Navigation() {
    const navRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useLayoutEffect(() => {
        // Hide initially, then slide down after hero animation (approx 3.5s)
        gsap.fromTo(navRef.current, {
            y: -100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1.5,
            delay: 3.5,
            ease: 'power3.out'
        });
    }, []);

    return (
        <nav className="main-nav" ref={navRef}>
            <div className="nav-logo">
                <Link to="/">
                    <span className="logo-text">VED</span>
                </Link>
            </div>
            
            {/* Hamburger Button */}
            <button 
                className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
                <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
                <Link to="/team" onClick={() => setIsMobileMenuOpen(false)}>Team</Link>
            </div>
        </nav>
    );
}
