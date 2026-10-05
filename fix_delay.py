import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# I only want to replace the useEffect for the Team component!
# The Team component is at the bottom, so I'll find `export default function Team()` first.
parts = content.split('export default function Team() {')
team_part = parts[1]

team_part = team_part.replace('useEffect(() => {', 'useEffect(() => {\n        let timeoutId;\n        let ctx;\n        timeoutId = setTimeout(() => {', 1)
team_part = team_part.replace('const ctx = gsap.context(() => {', 'ctx = gsap.context(() => {', 1)
team_part = team_part.replace('return () => ctx.revert()', '}, 100);\n        return () => {\n            clearTimeout(timeoutId);\n            if (ctx) ctx.revert();\n        }', 1)

content = parts[0] + 'export default function Team() {' + team_part

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
