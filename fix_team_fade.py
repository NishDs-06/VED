import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# We want to add the fade out right before the `if (chunk.type === 'members')` block.
# Since `<` refers to the `fromTo` tween (which starts at camera+0.4), `<+1.3` would be camera+1.7.

old_block = """                }, '<+0.4')

                if (chunk.type === 'members') {"""

new_block = """                }, '<+0.4')

                tl.to(chunkEl, {
                    opacity: 0,
                    filter: 'blur(20px)',
                    scale: 1.05,
                    duration: 0.8,
                    ease: 'power2.in',
                }, '<+1.3')

                if (chunk.type === 'members') {"""

content = content.replace(old_block, new_block)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
