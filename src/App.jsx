import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import EventsPage from './pages/EventsPage';
import TeamPage from './pages/TeamPage';
import AnnouncementsPage from './pages/AnnouncementsPage';

function AnimatedRoutes() {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const containerRef = useRef(null);

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            // Fade out the current page
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Reset scroll right as the screen goes black
                    if (window.__scrollToTop) window.__scrollToTop();
                    
                    // Swap the route
                    setDisplayLocation(location);
                    
                    // Fade in the new page
                    gsap.to(containerRef.current, {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        clearProps: 'opacity' // clean up inline styles after
                    });
                }
            });
        }
    }, [location, displayLocation.pathname]);

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <Routes location={displayLocation} key={displayLocation.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/team" element={<TeamPage />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Layout>
                <AnimatedRoutes />
            </Layout>
        </Router>
    );
}