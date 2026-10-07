with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

content = content.replace('''
.rightColLabel {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    margin-top: 0;
    line-height: 1; /* Match VED logo cap-height closely */
}''', '''
.rightColLabel {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    margin-top: 12px;
    line-height: 1; /* Match VED logo cap-height closely */
}''')

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)
