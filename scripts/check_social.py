import urllib.request
import re
import json

def check_youtube():
    url = 'https://www.youtube.com/@reelvani'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract avatar images
            urls = re.findall(r'https://yt3\.googleusercontent\.com/[a-zA-Z0-9_\-=]+', html)
            print('YouTube avatar URLs:', set(urls))
            # Extract video thumbnails
            thumbs = re.findall(r'https://i\.ytimg\.com/vi/[a-zA-Z0-9_-]+/hqdefault\.jpg', html)
            print('YouTube thumbnails:', set(thumbs))
    except Exception as e:
        print('YouTube error:', e)

def check_instagram():
    url = 'https://www.instagram.com/artistin_vanishreekulkarni/'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            og_img = re.findall(r'<meta property="og:image" content="([^"]+)"', html)
            print('Instagram og:image:', og_img)
    except Exception as e:
        print('Instagram error (expected login wall):', e)

def check_facebook():
    url = 'https://www.facebook.com/artistin.vanishreekulkarni'
    req = urllib.request.Request(url, headers={'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            og_img = re.findall(r'property="og:image" content="([^"]+)"', html)
            print('Facebook og:image:', og_img)
    except Exception as e:
        print('Facebook error:', e)

if __name__ == '__main__':
    check_youtube()
    check_instagram()
    check_facebook()
