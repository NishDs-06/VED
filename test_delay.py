import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# I will replace `const ctx = gsap.context(() => {` with a setTimeout!
# Wait, gsap.context is fine, but we need to create the ScrollTrigger after a small delay.
# Actually, I can just use a setTimeout inside useEffect.

content = content.replace('useEffect(() => {', 'useEffect(() => {\\n        let timeoutId;\\n        let ctx;\\n        timeoutId = setTimeout(() => {')
content = content.replace('const ctx = gsap.context(() => {', 'ctx = gsap.context(() => {')
content = content.replace('return () => ctx.revert()', '}, 100);\\n        return () => { clearTimeout(timeoutId); if(ctx) ctx.revert(); }')

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
