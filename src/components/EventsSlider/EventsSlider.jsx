import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsSlider.module.css';

const EVENTS = [
    { id: 1, title: "PowerNext-AI", date: "OCT 10-11, 2026", status: "ONGOING", link: "https://www.powernext-ai.in/", image: "/poster_powernext.jpg" },
    { id: 2, title: "Embedded Systems Workshop", date: "Coming Soon", status: "UPCOMING", link: "#", image: "/poster_embedded_systems.jpg" },
    { id: 3, title: "VLSI Design Sprint", date: "Past Event", status: "COMPLETED", link: "#", image: "/poster_vlsi_sprint.jpg" },
];

export default function EventsSlider() {
    const trackRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        
        // Clone the track for seamless infinite scrolling
        const clone = track.cloneNode(true);
        track.parentElement.appendChild(clone);
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>WHAT WE'VE BEEN DOING</h2>
                <Link to="/events" className={styles.viewAll}>VIEW ALL EVENTS</Link>
            </div>
            
            <div className={styles.sliderContainer}>
                <div className={styles.sliderWrapper}>
                    <div className={styles.sliderTrack} ref={trackRef}>
                        {EVENTS.map((ev, i) => (
                            <a href={ev.link} key={`${ev.id}-${i}`} className={styles.card} target={ev.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                                <div className={styles.cardImage}>
                                    {ev.image && <img src={ev.image} alt={ev.title} className={styles.poster} />}
                                    <div className={styles.noise}></div>
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.badge}>{ev.status}</div>
                                    <h3>{ev.title}</h3>
                                    <p>{ev.date}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
