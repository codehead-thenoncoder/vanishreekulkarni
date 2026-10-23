import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9447',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9447/json/list');
const pages = await res.json();
const page = pages.find(p => p.type === 'page') || pages[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let id = 1;
const send = (method, params = {}) => new Promise(resolve => {
  const msgId = id++;
  const handler = (e) => {
    const d = JSON.parse(e.data);
    if (d.id === msgId) { ws.removeEventListener('message', handler); resolve(d.result); }
  };
  ws.addEventListener('message', handler);
  ws.send(JSON.stringify({ id: msgId, method, params }));
});

await send('Runtime.enable');
await send('Page.enable');
await new Promise(r => setTimeout(r, 2500));

await send('Runtime.evaluate', {
  expression: `(() => {
    const p = document.querySelector('.hr-person');
    p.src = '/media/photos/homepage/vani_full_cutout.png';
    p.style.aspectRatio = '720 / 820';
    p.style.bottom = '-14px';
    p.style.height = 'calc(100% + 14px)';
    p.style.width = 'auto';
    p.style.maxWidth = '100%';
    p.style.transform = 'translateX(-50%)';
  })()`
});

await new Promise(r => setTimeout(r, 1000));
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_hero_full_cutout.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_hero_full_cutout.png');

ws.close();
chrome.kill();
