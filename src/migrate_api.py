import os

directory = r'c:\Personal\Portfolio-Admin\src\pages'

replacements = {
    "import axios from 'axios';": "import api, { API_URL } from '../api';",
    "axios.get('http://localhost:5000": "api.get('",
    "axios.post('http://localhost:5000": "api.post('",
    "axios.put('http://localhost:5000": "api.put('",
    "axios.delete('http://localhost:5000": "api.delete('",
    "axios.put(`http://localhost:5000": "api.put(`",
    "axios.post(`http://localhost:5000": "api.post(`",
    "axios.get(`http://localhost:5000": "api.get(`",
    "axios.delete(`http://localhost:5000": "api.delete(`",
    "http://localhost:5000/": "${API_URL}/",
    "http://localhost:5000": "${API_URL}",
    "http://localhost:5500/Portfolio/": "${API_URL}/"
}

for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
        
        # Specific cleanup for axios variable name if used
        new_content = new_content.replace('await axios.', 'await api.')
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
