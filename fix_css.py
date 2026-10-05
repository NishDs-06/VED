import re

# 1. Projects
with open('Projects_css_old.css', 'r') as f:
    old_css = f.read()

# Extract only popup styles and overlay styles
popup_styles = re.findall(r'(\.overlay.*?\})\s*(?=\.|$)', old_css, re.DOTALL)
popup_styles += re.findall(r'(\.popup.*?\})\s*(?=\.|$)', old_css, re.DOTALL)
popup_styles += re.findall(r'(\.closeBtn.*?\})\s*(?=\.|$)', old_css, re.DOTALL)
popup_styles += re.findall(r'(\.meta.*?\})\s*(?=\.|$)', old_css, re.DOTALL)
popup_styles += re.findall(r'(\.tools.*?\})\s*(?=\.|$)', old_css, re.DOTALL)
popup_styles += re.findall(r'(\.action.*?\})\s*(?=\.|$)', old_css, re.DOTALL)

with open('src/components/Projects/Projects.module.css', 'r') as f:
    new_css = f.read()

with open('src/components/Projects/Projects.module.css', 'w') as f:
    f.write(new_css + '\n' + '\n'.join(popup_styles))

# 2. Events
with open('Events_css_old.css', 'r') as f:
    old_events = f.read()

popup_events = re.findall(r'(\.overlay.*?\})\s*(?=\.|$)', old_events, re.DOTALL)
popup_events += re.findall(r'(\.popup.*?\})\s*(?=\.|$)', old_events, re.DOTALL)
popup_events += re.findall(r'(\.closeBtn.*?\})\s*(?=\.|$)', old_events, re.DOTALL)
popup_events += re.findall(r'(\.countdown.*?\})\s*(?=\.|$)', old_events, re.DOTALL)
popup_events += re.findall(r'(\.meta.*?\})\s*(?=\.|$)', old_events, re.DOTALL)
popup_events += re.findall(r'(\.action.*?\})\s*(?=\.|$)', old_events, re.DOTALL)

with open('src/components/Events/Events.module.css', 'r') as f:
    new_events = f.read()

with open('src/components/Events/Events.module.css', 'w') as f:
    f.write(new_events + '\n' + '\n'.join(popup_events))

