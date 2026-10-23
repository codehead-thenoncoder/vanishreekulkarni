import urllib.request
import re

urls_to_check = [
    'https://vanishreekulkarni.in/',
    'https://vanishreekulkarni.in/photos/',
    'https://vanishreekulkarni.in/gallery/',
    'https://vanishreekulkarni.in/about/',
    'https://vanishreekulkarni.in/work/',
    'https://vanishreekulkarni.in/contact/'
]

for url in urls_to_check:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f'=== URL: {url} (status: {resp.status}) ===')
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
            for img in sorted(set(imgs)):
                print('  IMG:', img)
            links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\']', html)
            for link in sorted(set(links)):
                if any(x in link.lower() for x in ['instagram', 'facebook', 'youtube', 'photo', 'media', 'gallery', 'image']):
                    print('  LINK:', link)
    except Exception as e:
        print(f'=== URL: {url} (failed: {e}) ===')
