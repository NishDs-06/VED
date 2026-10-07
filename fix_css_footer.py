import re

with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

# Add designation style
designation_css = """
.designation {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.02em;
    font-style: italic;
}
"""
content = content.replace('.madeByName:hover {', designation_css + '\n.madeByName:hover {')

# Remove newsletter styles
content = re.sub(r'\.newsletterCard \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterDesc \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterForm \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterInput \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterInput::placeholder \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterInput:focus \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterBtn \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterBtn:hover \{.*?\}\n+', '', content, flags=re.DOTALL)

# Also remove from mobile media query
content = re.sub(r'\.newsletterForm \{.*?\}\n+\s+', '', content, flags=re.DOTALL)
content = re.sub(r'\.newsletterBtn \{.*?\}\n+\s+', '', content, flags=re.DOTALL)


# Replace links with largeLinks awwwards style
large_links_css = """
.navCol {
    display: flex;
    flex-direction: column;
}

.largeLinks {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.largeLinks a {
    font-family: 'DM Sans', sans-serif;
    font-size: 32px;
    font-weight: 300;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    align-items: center;
    gap: 12px;
    width: fit-content;
    transform-origin: left center;
}

.arrow {
    font-size: 24px;
    font-weight: 200;
    opacity: 0;
    transform: translate(-10px, 10px) scale(0.8);
    transition: opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1), color 250ms ease;
    color: rgba(255, 255, 255, 0.2);
}

.largeLinks a:hover {
    color: #FFFFFF;
    transform: translateX(4px) scale(1.02);
}

.largeLinks a:hover .arrow {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    color: #a87ffb; /* A nice purple accent */
}
"""

content = re.sub(r'\.links \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.links a \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.arrow \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.links a:hover \{.*?\}\n+', '', content, flags=re.DOTALL)
content = re.sub(r'\.links a:hover \.arrow \{.*?\}\n+', '', content, flags=re.DOTALL)

content = content.replace('.colLabel {', large_links_css + '\n.colLabel {')

# Awwwards layout tweaks
# We want navGrids to be spacious
content = re.sub(r'\.navGrids \{.*?\}', '.navGrids {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 64px;\n    margin-top: auto;\n}', content, flags=re.DOTALL)
content = re.sub(r'\.rightSection \{.*?\}', '.rightSection {\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-end;\n}', content, flags=re.DOTALL)


with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)

print("Done updating CSS")
