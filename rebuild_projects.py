import re

with open('Projects_old.jsx', 'r') as f:
    old_content = f.read()

# Extract ProjectPopup
popup_match = re.search(r'function ProjectPopup.*?return \(\n.*?</div>\n        </div>\n    \)\n}', old_content, re.DOTALL)
popup_code = popup_match.group(0)

# Replace the closing btn SVG to a simpler one to match styling or keep it.
# Actually I'll just keep the popup code exactly as it was.

projects_jsx = f"""import {{ useState, useRef, useEffect }} from 'react'
import {{ createPortal }} from 'react-dom'
import gsap from 'gsap'
import {{ ScrollTrigger }} from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const STATUS_CONFIG = {{
    'DESIGNING': {{ color: '#FF3366', label: 'Designing' }},
    'BUILDING': {{ color: '#00E5FF', label: 'Building' }},
    'TESTING': {{ color: '#00FF66', label: 'Testing' }},
}}
const CATEGORY_COLOR = {{
    'DEVICE': '#FF3366',
    'CIRCUIT': '#00E5FF',
    'EMBEDDED': '#00FF66',
    'DIGITAL': '#BF00FF'
}}

{popup_code}

const PROJECTS = [
    {{
        id: 'mosfet',
        name: 'Low-Leakage MOSFET',
        domain: 'Device Physics / Low-Power Design',
        category: 'DEVICE',
        status: 'DESIGNING',
        members: 3,
        tools: ['SPICE', 'CADENCE', 'SPECTRE', 'MATLAB'],
        about: 'Simulation and performance analysis of a modified MOSFET structure targeting ultra-low leakage for IoT applications.',
    }},
    {{
        id: 'comparator',
        name: 'Dynamic Comparator',
        domain: 'Analog / Mixed-Signal',
        category: 'CIRCUIT',
        status: 'BUILDING',
        members: 2,
        tools: ['CADENCE', 'SPECTRE', 'MATLAB', 'SPICE'],
        about: 'A low-offset dynamic latch comparator for energy-efficient SAR ADCs. Focuses on kickback noise reduction.',
    }},
    {{
        id: 'puf-boot',
        name: 'PUF Secure Boot',
        domain: 'Embedded Systems / Security',
        category: 'EMBEDDED',
        status: 'BUILDING',
        members: 4,
        tools: ['VIVADO', 'C', 'ARM', 'VERILOG'],
        about: 'Implementation of a physically unclonable function (PUF) to derive a root of trust for embedded system secure boot.',
    }},
    {{
        id: 'accelerator',
        name: 'NN Accelerator',
        domain: 'Digital VLSI',
        category: 'DIGITAL',
        status: 'TESTING',
        members: 5,
        tools: ['VERILOG', 'PYTHON', 'VIVADO'],
        about: 'RTL implementation of a systolic array based neural network accelerator targeting real-time edge inference.',
    }}
]

export default function Projects() {{
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
        <section className={{styles.section}} id="projects" ref={{containerRef}}>
            <div className={{styles.introText}} ref={{introRef}}>
                <h2 className={{styles.title}}>OUR</h2>
                <h2 className={{styles.titleOutline}}>PROJECTS</h2>
            </div>

            <div className={{styles.listWrapper}} ref={{listRef}}>
                <div className={{styles.listContainer}}>
                    {{PROJECTS.map((project, i) => (
                        <div 
                            key={{project.id}} 
                            className={{styles.listItem}}
                            ref={{el => itemsRef.current[i] = el}}
                            onClick={{() => setSelected(project)}}
                            style={{cursor: 'pointer'}}
                        >
                            <div className={{styles.itemCategory}}>
                                {{project.category}}
                            </div>
                            <div>
                                <h3 className={{styles.itemName}}>{{project.name}}</h3>
                                <p className={{styles.itemDesc}}>{{project.about}}</p>
                            </div>
                            <div className={{styles.itemMeta}}>
                                <div>{{project.status}}</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{{project.members}} Team Members</div>
                            </div>
                        </div>
                    ))}}
                </div>
            </div>

            {{selected && createPortal(
                <ProjectPopup project={{selected}} onClose={{() => setSelected(null)}} />,
                document.body
            )}}
        </section>
    )
}}
"""

with open('src/components/Projects/Projects.jsx', 'w') as f:
    f.write(projects_jsx)
