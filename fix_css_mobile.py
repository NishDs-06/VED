with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

# Fix mobile media query
mobile_css = """/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
    .footer {
        padding: 0 24px 0;
    }

    .inner {
        grid-template-columns: 1fr;
        gap: 64px;
        padding: 48px 0 48px;
    }

    .brandName {
        font-size: 52px;
    }

    .navGrids {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .largeLinks a {
        font-size: 26px;
    }
    
    .arrow {
        font-size: 20px;
    }

    .strip {
        flex-direction: column;
        gap: 8px;
        text-align: center;
    }
}"""

# Find the start of the mobile block
start_index = content.find('/* ── Mobile')
if start_index != -1:
    content = content[:start_index] + mobile_css

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)

print("Done fixing mobile CSS")
