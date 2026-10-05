import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Replace the end value
old_end = "end: `+=${(chunks.length + 1.5) * 400}`,"
new_end = "end: `+=${(chunks.length + 1.5) * 800}`,"

content = content.replace(old_end, new_end)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
