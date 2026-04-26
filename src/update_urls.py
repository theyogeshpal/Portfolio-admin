import os

directory = r'c:\Personal\Portfolio-Admin\src'
old_url = 'http://localhost:5000'
new_url = 'https://portfolio-backend-95gv.onrender.com'

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_url in content:
        new_content = content.replace(old_url, new_url)
        # Also handle potential trailing slashes or other variations
        new_content = new_content.replace('http://localhost:5500/Portfolio', new_url)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css')):
            replace_in_file(os.path.join(root, file))
