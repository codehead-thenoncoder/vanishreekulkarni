import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9448',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9448/json/list');
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

// Apply test styles to verify
const testCode = `(() => {
  // Hero styles
  const hp = document.querySelector('.hr-person');
  hp.src = '/media/photos/homepage/vani_full_cutout.png';
  hp.style.position = 'absolute';
  hp.style.left = '50%';
  hp.style.bottom = '-14px';
  hp.style.transform = 'translateX(-50%)';
  hp.style.width = 'auto';
  hp.style.height = 'calc(100% + 14px)';
  hp.style.maxHeight = 'none';
  hp.style.maxWidth = '100%';
  hp.style.aspectRatio = '720 / 820';
  hp.style.objectFit = 'contain';
  hp.style.objectPosition = 'center bottom';

  // Contact styles
  const ct_m = document.querySelector('.ct-media');
  ct_m.style.position = 'relative';
  ct_m.style.minHeight = '360px';

  const ct_s = document.querySelector('.ct-sticker');
  ct_s.style.position = 'absolute';
  ct_s.style.right = '-2%';
  ct_s.style.bottom = 'calc(-1 * clamp(28px, 4vw, 56px))';
  ct_s.style.height = '126%';
  ct_s.style.maxHeight = '520px';
  ct_s.style.width = 'auto';
  ct_s.style.maxWidth = 'none';
  ct_s.style.objectFit = 'contain';
  ct_s.style.objectPosition = 'bottom right';
  ct_s.style.filter = 'drop-shadow(0 24px 36px rgba(48, 34, 31, 0.32))';

  const ct_b = document.querySelector('.ct-bubble');
  ct_b.style.position = 'absolute';
  ct_b.style.left = '-8%';
  ct_b.style.top = '-10%';
  ct_b.style.zIndex = '3';
})()`;

await send('Runtime.evaluate', { expression: testCode });
await new Promise(r => setTimeout(r, 800));

// 1. Capture Hero
let shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_new_hero.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_new_hero.png');

// 2. Scroll to contact and capture
await send('Runtime.evaluate', { expression: `document.querySelector('.ct-card').scrollIntoView({ block: 'center' });` });
await new Promise(r => setTimeout(r, 1000));
shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_new_contact.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_new_contact.png');

// 3. Mobile test
await send('Emulation.setDeviceMetricsOverride', {
  width: 375,
  height: 812,
  deviceScaleFactor: 2,
  mobile: true
});
await new Promise(r => setTimeout(r, 500));

// Mobile Hero
await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
await new Promise(r => setTimeout(r, 800));
shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_new_mobile_hero.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_new_mobile_hero.png');

// Mobile Contact
await send('Runtime.evaluate', { expression: `
  const ct_s = document.querySelector('.ct-sticker');
  ct_s.style.position = 'relative';
  ct_s.style.right = 'auto';
  ct_s.style.bottom = '-16px';
  ct_s.style.width = 'min(300px, 85%)';
  ct_s.style.height = 'auto';
  ct_s.style.maxHeight = '340px';
  ct_s.style.margin = '0 auto';
  ct_s.style.display = 'block';

  const ct_b = document.querySelector('.ct-bubble');
  ct_b.style.left = '50%';
  ct_b.style.transform = 'translateX(-50%) rotate(-4deg)';
  ct_b.style.top = '-20px';

  document.querySelector('.ct-card').scrollIntoView({ block: 'center' });
` });
await new Promise(r => setTimeout(r, 800));
shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('test_new_mobile_contact.png', Buffer.from(shot.data, 'base64'));
console.log('Saved test_new_mobile_contact.png');

ws.close();
chrome.kill();
