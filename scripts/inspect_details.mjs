import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9445',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9445/json/list');
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
await new Promise(r => setTimeout(r, 2500));

const evalCode = `(() => {
  const p = document.querySelector('.hr-person');
  const v = document.querySelector('.hr-visual');
  const b = document.querySelector('.hr-blob');
  const cs_p = window.getComputedStyle(p);
  const cs_b = window.getComputedStyle(b);
  const cs_v = window.getComputedStyle(v);
  
  const ct_s = document.querySelector('.ct-sticker');
  const ct_m = document.querySelector('.ct-media');
  const cs_ct_s = window.getComputedStyle(ct_s);
  const cs_ct_m = window.getComputedStyle(ct_m);

  return {
    person: {
      rect: p.getBoundingClientRect(),
      transform: cs_p.transform,
      inlineTransform: p.style.transform,
      bottom: cs_p.bottom,
      top: cs_p.top,
      height: cs_p.height,
      width: cs_p.width,
      naturalWidth: p.naturalWidth,
      naturalHeight: p.naturalHeight,
      currentSrc: p.currentSrc
    },
    visual: {
      rect: v.getBoundingClientRect(),
      height: cs_v.height,
      overflow: cs_v.overflow,
      clipPath: cs_v.clipPath
    },
    blob: {
      rect: b.getBoundingClientRect(),
      top: cs_b.top,
      bottom: cs_b.bottom,
      height: cs_b.height,
      transform: cs_b.transform
    },
    contactSticker: {
      rect: ct_s.getBoundingClientRect(),
      width: cs_ct_s.width,
      height: cs_ct_s.height,
      transform: cs_ct_s.transform,
      naturalWidth: ct_s.naturalWidth,
      naturalHeight: ct_s.naturalHeight,
      currentSrc: ct_s.currentSrc
    },
    contactMedia: {
      rect: ct_m.getBoundingClientRect(),
      height: cs_ct_m.height
    }
  };
})()`;

const result = await send('Runtime.evaluate', { expression: evalCode, returnByValue: true });
console.log('COMPUTED DETAILS:\n', JSON.stringify(result.result.value, null, 2));

ws.close();
chrome.kill();
