import re

with open('Events_old.jsx', 'r') as f:
    old_content = f.read()

# Extract EventPopup and CountdownTimer
popup_match = re.search(r'function EventPopup.*?return \(\n.*?</div>\n        </div>\n    \)\n}', old_content, re.DOTALL)
popup_code = popup_match.group(0)

countdown_match = re.search(r'function CountdownTimer.*?return \(\n.*?</div>\n        </div>\n    \)\n}', old_content, re.DOTALL)
countdown_code = countdown_match.group(0) if countdown_match else ''

hooks_match = re.search(r'function useCountdown.*?return timeLeft\n}', old_content, re.DOTALL)
hooks_code = hooks_match.group(0) if hooks_match else ''

events_jsx = f"""import {{ useState, useEffect, useRef }} from 'react'
import {{ createPortal }} from 'react-dom'
import gsap from 'gsap'
import {{ ScrollTrigger }} from 'gsap/ScrollTrigger'
import styles from './Events.module.css'

gsap.registerPlugin(ScrollTrigger)

const TYPE_COLOR = {{
    'CONFERENCE': '#FF3366',
    'WORKSHOP': '#00E5FF',
    'SEMINAR': '#00FF66',
    'COMPETITION': '#BF00FF'
}}

{hooks_code}

{countdown_code}

{popup_code}

const EVENTS = [
    {{
        id: 'silicon-symposium',
        title: 'Silicon Symposium 2026',
        date: 'MARCH 15',
        type: 'CONFERENCE',
        location: 'Main Auditorium',
        summary: 'Annual gathering of VLSI enthusiasts, featuring guest speakers from industry leaders in semiconductor design.',
    }},
    {{
        id: 'fpga-workshop',
        title: 'FPGA Architecture Workshop',
        date: 'APRIL 02',
        type: 'WORKSHOP',
        location: 'Hardware Lab',
        summary: 'Hands-on session on advanced FPGA routing, synthesis optimization, and timing closure techniques.',
    }},
    {{
        id: 'powernext-ai',
        title: 'PowerNext AI',
        date: 'APRIL 10',
        type: 'SEMINAR',
        location: 'Virtual',
        summary: 'Exploring the intersection of artificial intelligence and ultra-low power hardware accelerators.',
    }},
    {{
        id: 'tapeout-talks',
        title: 'Tapeout Talks: First Silicon',
        date: 'APRIL 18',
        type: 'SEMINAR',
        location: 'Virtual',
        summary: 'Alumni share their experiences and challenges taking their first chip from RTL to actual tapeout.',
    }},
    {{
        id: 'hackathon',
        title: 'Embedded Systems Hackathon',
        date: 'MAY 10',
        type: 'COMPETITION',
        location: 'Innovation Center',
        summary: 'A 24-hour hardware hackathon focusing on ultra-low power IoT solutions and embedded security.',
    }}
]

export default function Events() {{
    const [selected, setSelected] = useState(null)
    const containerRef = useRef(null)
    const introRef = useRef(null)
    const listRef = useRef(null)
    const itemsRef = useRef([])

    useEffect(() => {{
        if (!containerRef.current) return;
        
        const tl = gsap.timeline({{
            scrollTrigger: {{
                trigger: containerRef.current,
                start: 'top top',
                end: '+=100%',
                scrub: 1,
                pin: true,
            }}
        }})

        tl.to(introRef.current, {{
            opacity: 0,
            scale: 1.1,
            y: -50,
            duration: 1,
            ease: 'power2.inOut'
        }})
        
        tl.fromTo(listRef.current, {{
            opacity: 0,
            y: 50,
        }}, {{
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }}, '-=0.5')
        
        return () => {{
            ScrollTrigger.getAll().forEach(t => t.kill())
        }}
    }}, [])

    return (
        <section className={{styles.section}} id="events" ref={{containerRef}}>
            <div className={{styles.introText}} ref={{introRef}}>
                <h2 className={{styles.title}}>UPCOMING</h2>
                <h2 className={{styles.titleOutline}}>EVENTS</h2>
            </div>

            <div className={{styles.listWrapper}} ref={{listRef}}>
                <div className={{styles.listContainer}}>
                    {{EVENTS.map((event, i) => (
                        <div 
                            key={{event.id}} 
                            className={{styles.listItem}}
                            ref={{el => itemsRef.current[i] = el}}
                            onClick={{() => setSelected(event)}}
                            style={{cursor: 'pointer'}}
                        >
                            <div className={{styles.itemDate}}>
                                {{event.date}}
                            </div>
                            <div>
                                <h3 className={{styles.itemName}}>{{event.title}}</h3>
                                <p className={{styles.itemDesc}}>{{event.summary}}</p>
                            </div>
                            <div className={{styles.itemMeta}}>
                                <div>{{event.type}}</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '0.8rem' }}>{{event.location}}</div>
                            </div>
                        </div>
                    ))}}
                </div>
            </div>

            {{selected && createPortal(
                <EventPopup event={{selected}} onClose={{() => setSelected(null)}} />,
                document.body
            )}}
        </section>
    )
}}
"""

with open('src/components/Events/Events.jsx', 'w') as f:
    f.write(events_jsx)
