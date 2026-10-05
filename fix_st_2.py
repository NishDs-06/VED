import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Replace the GSAP_VARS line with a simpler tl
new_tl = """            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cinematicRef.current,
                    start: 'top top',
                    end: '+=12600',
                    scrub: 1,
                    pin: true,
                }
            })"""

content = re.sub(r'try \{ window.GSAP_VARS = "running"; \} catch\(e\) \{\} \n            const tl = gsap.timeline\(\).*?invalidateOnRefresh: true,\n            \}\)', new_tl, content, flags=re.DOTALL)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
