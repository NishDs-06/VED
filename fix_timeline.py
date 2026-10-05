import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Change scrub: 1 to scrub: 1.5 for ultra-smoothness
content = content.replace("scrub: 1,", "scrub: 1.5,")

# Replace the GSAP timeline loop
old_loop = r'tl\.to\(stageRef\.current, \{.*?tl\.to\(\{\}, \{ duration: 1\.2 \}\).*?\}\)'

new_loop = """tl.to(stageRef.current, {
                    z: targetZ,
                    duration: i === 0 ? 1.0 : 2.0,
                    ease: 'power2.inOut',
                }, i === 0 ? '-=0.2' : '-=0.5')

                tl.to(camera.current, {
                    z: targetZ,
                    duration: i === 0 ? 1.0 : 2.0,
                    ease: 'power2.inOut',
                }, i === 0 ? '-=0.2' : '<')

                tl.fromTo(chunkEl, {
                    opacity: 0,
                    filter: 'blur(20px)',
                    scale: 0.9,
                }, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: 1,
                    duration: 1.0,
                    ease: 'power2.out',
                }, '<+0.4')

                if (chunk.type === 'members') {
                    const accents = chunkEl.querySelectorAll(`.${styles.memberAccentBar}`)
                    const roles = chunkEl.querySelectorAll(`.${styles.memberRole}`)
                    const names = chunkEl.querySelectorAll(`.${styles.memberName}`)
                    const subs = chunkEl.querySelectorAll(`.${styles.memberSub}`)

                    if (accents.length) {
                        tl.fromTo(accents,
                            { scaleX: 0 },
                            { scaleX: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
                            '<+0.2'
                        )
                    }
                    if (roles.length) {
                        tl.fromTo(roles,
                            { y: 15, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
                            '<+0.1'
                        )
                    }
                    if (names.length) {
                        tl.fromTo(names,
                            { clipPath: 'inset(110% 0% 0% 0%)', y: 20 },
                            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
                            '<+0.1'
                        )
                    }
                    if (subs.length) {
                        tl.fromTo(subs,
                            { y: 10, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
                            '<+0.1'
                        )
                    }
                } else if (chunk.type === 'title') {
                    const titleWord = chunkEl.querySelector(`.${styles.chunkTitle}`)
                    if (titleWord) {
                        tl.fromTo(titleWord,
                            { clipPath: 'inset(110% 0% 0% 0%)', y: 30, filter: 'blur(10px)' },
                            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
                            '<+0.1'
                        )
                    }
                }

                tl.to({}, { duration: 0.8 })

                if (i < chunks.length - 1) {
                    tl.to(chunkEl, {
                        opacity: 0,
                        filter: 'blur(15px)',
                        scale: 1.1,
                        duration: 0.8,
                        ease: 'power2.inOut',
                    }, '-=0.2')
                }
"""

content = re.sub(old_loop, new_loop, content, flags=re.DOTALL)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
