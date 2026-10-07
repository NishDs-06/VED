import re
with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

mobile_css = """    .techCta {
        padding: 32px;
    }
    
    .techCtaTop {
        margin-bottom: 24px;
        flex-direction: column;
        gap: 12px;
    }
    
    .rightCol {
        align-items: flex-start;
    }"""
    
content = re.sub(
    r'    \.newCta \{.*?\n    \}\n    \.rightCol \{.*?\n    \}\n    \.wannaText \{.*?\n    \}',
    mobile_css,
    content,
    flags=re.DOTALL
)

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)
