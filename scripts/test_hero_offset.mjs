import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9446',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9446/json/list');
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

// Test 1: bottom: 60px
await send('Runtime.evaluate', {
  expression: `(() => {
    const p = document.querySelector('.hr-person');
    p.style.bottom = '70px';
    p.style.transform = 'translateX(-52%)';
  })()`
});
await new Promise(r => setTimeout(r, 500));
let shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_hero_70px.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_hero_70px.png');

// Test 2: bottom: 95px
await send('Runtime.evaluate', {
  expression: `(() => {
    const p = document.querySelector('.hr-person');
    p.style.bottom = '95px';
    p.style.transform = 'translateX(-52%)';
  })()`
});
await new Promise(r => setTimeout(r, 500));
shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_hero_95px.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_hero_95px.png');

// Test 3: bottom: 120px
await send('Runtime.evaluate', {
  expression: `(() => {
    const p = document.querySelector('.hr-person');
    p.style.bottom = '120px';
    p.style.transform = 'translateX(-52%)';
  })()`
});
await new Promise(r => setTimeout(r, 500));
shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_hero_120px.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_hero_120px.png');

ws.close();
chrome.kill();
