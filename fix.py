import os

def fix_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace(r'\`', '`').replace(r'\${', '${')
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Fixed:', filepath)

fix_file('js/config/data.js')
fix_file('js/views/auth.js')
