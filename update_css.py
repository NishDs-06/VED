import re

with open('src/components/Team/Team.module.css', 'r') as f:
    content = f.read()

replacement = """
.chunkWrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(4rem, 8vw, 12rem);
    transform-style: preserve-3d;
    opacity: 0;
    will-change: opacity, transform;
}

.memberCardInner {
    display: flex;
    align-items: center;
    gap: clamp(1.5rem, 3vw, 4rem);
    transform-style: preserve-3d;
}

.chunkTitleClip {
    overflow: hidden;
    padding-bottom: 0.1em;
}

.chunkTitle {
    font-family: 'Syne', sans-serif;
    font-size: clamp(3rem, 5vw, 6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin: 0;
    line-height: 1;
    white-space: nowrap;
}
"""

content = re.sub(r'/\* Each member is placed.*?\n\}', replacement.strip(), content, flags=re.DOTALL)

with open('src/components/Team/Team.module.css', 'w') as f:
    f.write(content)
