import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

old_tl = """            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cinematicRef.current,
                    start: 'top top',
                    end: `+=${(chunks.length + 1.5) * DEPTH_STEP * 1.0}`,
                    scrub: 1,
                    pin: true,
                }
            })"""

new_tl = """            const tl = gsap.timeline()
            
            ScrollTrigger.create({
                trigger: cinematicRef.current,
                start: 'top top',
                end: `+=${(chunks.length + 1.5) * DEPTH_STEP * 1.0}`,
                scrub: 1,
                pin: true,
                animation: tl,
                invalidateOnRefresh: true,
            })"""

content = content.replace(old_tl, new_tl)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
