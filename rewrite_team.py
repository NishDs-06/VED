import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# We want to replace the Team function entirely.
start_idx = content.find('export default function Team() {')

new_team_component = """export default function Team() {
    const cinematicRef = useRef(null)
    const stageRef     = useRef(null)
    const introTextRef = useRef(null)
    const chunkRefs    = useRef([])

    const regularMembers = [...ROW1, ...ROW2, ...ROW3].filter(m => m.name)
    const facultyAdvisors = ROW4.filter(m => m.name)

    const chunks = []
    
    for (let i = 0; i < regularMembers.length; i += 2) {
        chunks.push({
            type: 'members',
            id: `chunk_reg_${i}`,
            members: regularMembers.slice(i, i + 2)
        })
    }

    chunks.push({
        type: 'title',
        id: 'title_faculty',
        text: 'FACULTY ADVISORS'
    })

    for (let i = 0; i < facultyAdvisors.length; i += 2) {
        chunks.push({
            type: 'members',
            id: `chunk_fac_${i}`,
            members: facultyAdvisors.slice(i, i + 2)
        })
    }

    const DEPTH_STEP = 1200  

    const stars = useMemo(() => {
        const starCount = 1500;
        const field = [];
        const minZ = -(chunks.length + 3) * DEPTH_STEP;
        const maxZ = 2000; 

        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 8000;
            const y = (Math.random() - 0.5) * 8000;
            const z = Math.random() * (maxZ - minZ) + minZ;
            
            const sizeRandom = Math.random();
            const size = sizeRandom > 0.95 ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5;
            const opacity = Math.random() * 0.6 + 0.2;
            
            field.push({ id: i, x, y, z, size, opacity });
        }
        return field;
    }, [chunks.length]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cinematicRef.current,
                    start: 'top top',
                    end: `+=${(chunks.length + 1.5) * DEPTH_STEP * 1.0}`,
                    scrub: 1,
                    pin: true,
                }
            })

            tl.to(introTextRef.current, {
                opacity: 0,
                y: -50,
                scale: 1.1,
                duration: 1.5,
                ease: 'power2.in',
            })

            chunks.forEach((chunk, i) => {
                const targetZ = (i + 1) * DEPTH_STEP
                const chunkEl = chunkRefs.current[i]

                tl.to(stageRef.current, {
                    z: targetZ,
                    duration: i === 0 ? 0.8 : 1.8,
                    ease: 'power3.inOut',
                }, i === 0 ? '-=0.2' : '+=0')

                tl.to(chunkEl, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                }, '<+0.2')

                if (chunk.type === 'members') {
                    const accents = chunkEl.querySelectorAll(`.${styles.memberAccentBar}`)
                    const roles = chunkEl.querySelectorAll(`.${styles.memberRole}`)
                    const names = chunkEl.querySelectorAll(`.${styles.memberName}`)
                    const subs = chunkEl.querySelectorAll(`.${styles.memberSub}`)

                    if (accents.length) {
                        tl.fromTo(accents,
                            { scaleX: 0 },
                            { scaleX: 1, duration: 0.45, ease: 'power3.out', stagger: 0.1 },
                            '<'
                        )
                    }
                    if (roles.length) {
                        tl.fromTo(roles,
                            { y: 10, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
                            '<+0.05'
                        )
                    }
                    if (names.length) {
                        tl.fromTo(names,
                            { clipPath: 'inset(110% 0% 0% 0%)', y: 16 },
                            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1 },
                            '<+0.06'
                        )
                    }
                    if (subs.length) {
                        tl.fromTo(subs,
                            { y: 8, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
                            '<+0.1'
                        )
                    }
                } else if (chunk.type === 'title') {
                    const titleWord = chunkEl.querySelector(`.${styles.chunkTitle}`)
                    if (titleWord) {
                        tl.fromTo(titleWord,
                            { clipPath: 'inset(110% 0% 0% 0%)', y: 20 },
                            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.0, ease: 'power3.out' },
                            '<+0.06'
                        )
                    }
                }

                tl.to({}, { duration: 1.2 })

                if (i < chunks.length - 1) {
                    tl.to(chunkEl, {
                        opacity: 0,
                        duration: 0.45,
                        ease: 'power2.in',
                    })
                }
            })

        }, cinematicRef)

        return () => ctx.revert()
    }, [chunks.length])

    return (
        <section id="my-team-section" className={styles.cinematicContainer} ref={cinematicRef}>
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.particles} />

            <div className={styles.introText} ref={introTextRef}>
                <span className={styles.introEyebrow}>VED · MIT Bangalore · 2026</span>
                <span className={styles.introWord}>OUR</span>
                <span className={styles.introWord}>TEAM</span>
            </div>

            <div className={styles.perspectiveViewport}>
                <div
                    className={styles.stage}
                    ref={stageRef}
                    style={{ transform: 'translateZ(0px)' }}
                >
                    {stars.map(star => (
                        <div
                            key={star.id}
                            className={styles.star}
                            style={{
                                transform: `translate3d(${star.x}px, ${star.y}px, ${star.z}px)`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                opacity: star.opacity,
                            }}
                        />
                    ))}

                    {chunks.map((chunk, i) => {
                        const worldZ = -(i + 1) * DEPTH_STEP
                        return (
                            <div
                                key={chunk.id}
                                className={styles.chunkWrapper}
                                ref={el => chunkRefs.current[i] = el}
                                style={{
                                    transform: `translate(-50%, -50%) translateZ(${worldZ}px)`,
                                }}
                            >
                                {chunk.type === 'members' && chunk.members.map((member) => (
                                    <div key={member.id} className={styles.memberCardInner}>
                                        {member.photo ? (
                                            <img
                                                src={member.photo}
                                                alt={member.name}
                                                className={styles.memberPhoto}
                                                style={{ objectPosition: member.bgPos || member.photoPosition || 'center 20%' }}
                                            />
                                        ) : (
                                            <div className={styles.memberPhotoPlaceholder}>
                                                <span className={styles.memberPhotoInitials}>{member.initials}</span>
                                            </div>
                                        )}

                                        <div className={styles.memberLabel}>
                                            <div className={styles.memberAccentBar} style={{ transform: 'scaleX(0)' }} />
                                            <span className={styles.memberRole} style={{ opacity: 0 }}>
                                                {member.role}
                                            </span>
                                            <div className={styles.memberNameClip}>
                                                <h3 className={styles.memberName} style={{ clipPath: 'inset(110% 0% 0% 0%)' }}>
                                                    {member.name}
                                                </h3>
                                            </div>
                                            {(member.oneLiner || member.qual) && (
                                                <p className={styles.memberSub} style={{ opacity: 0 }}>
                                                    {member.oneLiner || member.qual}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {chunk.type === 'title' && (
                                    <div className={styles.chunkTitleClip}>
                                        <h2 className={styles.chunkTitle} style={{ clipPath: 'inset(110% 0% 0% 0%)' }}>
                                            {chunk.text}
                                        </h2>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={styles.scrollHint}>
                <span className={styles.scrollHintLine} />
                scroll to explore
                <span className={styles.scrollHintLine} />
            </div>
        </section>
    )
}
"""

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content[:start_idx] + new_team_component)
