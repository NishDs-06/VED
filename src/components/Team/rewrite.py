import re

with open('/mnt/hdd/VED/src/components/Team/Team.jsx', 'r') as f:
    content = f.read()

# Extract data section (from ROW1 to just before Team component)
data_match = re.search(r'(const ROW1.*?)export default function Team', content, re.DOTALL)
data_section = data_match.group(1) if data_match else ""

# Also extract icons
icons_match = re.search(r'(const LinkedInIcon.*?)const ROW1', content, re.DOTALL)
icons_section = icons_match.group(1) if icons_match else ""

with open('/mnt/hdd/VED/src/components/Team/TeamLogic.txt', 'r') as f:
    logic = f.read()

with open('/mnt/hdd/VED/src/components/Team/Team.jsx', 'w') as f:
    f.write("import { useEffect, useRef } from 'react'\nimport gsap from 'gsap'\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'\nimport styles from './Team.module.css'\n\ngsap.registerPlugin(ScrollTrigger)\n\n")
    f.write(icons_section + "\n")
    f.write(data_section + "\n")
    f.write(logic)

