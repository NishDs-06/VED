with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

content = content.replace('''
.ctaLink {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    text-decoration: none;
    gap: 32px;
    padding: 0;
    position: relative;
    cursor: pointer;
}''', '''
.ctaLink {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    gap: 32px;
    padding: 0;
    position: relative;
    cursor: pointer;
}''')

content = content.replace('''
.ctaLabel {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    padding: 0;
    margin-top: 12px;
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
    align-self: center;
}''', '''
.ctaLabel {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    padding: 0;
    margin-top: 12px;
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
    align-self: flex-start;
}''')

content = content.replace('''
.ctaHeading {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1;
    position: relative;
    letter-spacing: -0.02em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}''', '''
.ctaHeading {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1;
    position: relative;
    letter-spacing: -0.02em;
    display: flex;
    flex-direction: column;
    gap: 4px;
}''')

content = content.replace('''
.ctaHeadingMain {
    font-size: clamp(2.5rem, 4.5vw, 5rem);
    font-weight: 500;
    color: #FFFFFF;
    letter-spacing: -0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    transition: color 400ms ease;
}''', '''
.ctaHeadingMain {
    font-size: clamp(2.5rem, 4.5vw, 5rem);
    font-weight: 500;
    color: #FFFFFF;
    letter-spacing: -0.04em;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: color 400ms ease;
}''')


content = content.replace('''
    .rightCol {
        align-items: flex-start;
    }
    .midCol {
        align-items: center;
    }''', '''
    .rightCol, .midCol {
        align-items: flex-start;
    }''')

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)
