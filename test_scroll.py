import re

with open('src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Remove the canvas render loop to test if it's breaking ScrollTrigger
content = re.sub(r'const canvas = canvasRef.*?raf = requestAnimationFrame\(render\)', '', content, flags=re.DOTALL)

with open('src/components/Team/Team.jsx', 'w') as f:
    f.write(content)
