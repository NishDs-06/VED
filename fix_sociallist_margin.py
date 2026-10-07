with open('src/components/Footer/Footer.module.css', 'r') as f:
    content = f.read()

content = content.replace('''
.socialList {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    width: max-content;
}''', '''
.socialList {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 5%;
    width: max-content;
}''')

with open('src/components/Footer/Footer.module.css', 'w') as f:
    f.write(content)
