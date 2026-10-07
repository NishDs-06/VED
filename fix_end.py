with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

import re
content = re.sub(r'    \.ctaLine \{.*?\n    \}', '', content, flags=re.DOTALL)
content = re.sub(r'    \.ctaArrow \{.*?\n    \}', '', content, flags=re.DOTALL)

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)
