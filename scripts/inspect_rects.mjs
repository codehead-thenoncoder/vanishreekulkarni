import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9444',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9444/json/list');
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
// Wait for loader animation to finish
await new Promise(r => setTimeout(r, 2500));

const evalCode = `(() => {
  const p = document.querySelector('.hr-person');
  const v = document.querySelector('.hr-visual');
  const b = document.querySelector('.hr-blob');
  const cs_p = window.getComputedStyle(p);
  const cs_v = window.getComputedStyle(v);
  const ct_s = document.querySelector('.ct-sticker');
  const ct_m = document.querySelector('.ct-media');
  const ct_b = document.querySelector('.ct-bubble');
  const cs_ct_s = window.getComputedStyle(ct_s);

  return {
    person: {
      rect: p.getBoundingClientRect(),
      offsetTop: p.offsetTop,
      offsetParent: p.offsetParent ? p.offsetParent.className : null,
      offsetHeight: p.offsetHeight,
      offsetWidth: p.offsetWidth,
      top: cs_p.top,
      bottom: cs_p.bottom,
      left: cs_p.left,
      right: cs_p.right,
      transform: cs_p.transform,
      inlineStyle: p.getAttribute('style')
    },
    visual: {
      rect: v.getBoundingClientRect(),
      height: cs_v.height,
      clipPath: cs_v.clipPath
    },
    blob: {
      rect: b.getBoundingClientRect()
    },
    contactMedia: {
      rect: ct_m.getBoundingClientRect()
    },
    contactSticker: {
      rect: ct_s.getBoundingClientRect(),
      width: cs_ct_s.width,
      height: cs_ct_s.height,
      maxWidth: cs_ct_s.maxWidth,
      maxHeight: cs_ct_s.maxHeight,
      transform: cs_ct_s.transform,
      inlineStyle: ct_s.getAttribute('style'),
      src: ct_s.currentSrc
    },
    contactBubble: {
      rect: ct_b.getBoundingClientRect(),
      inlineStyle: ct_b.getAttribute('style')
    }
  };
})()`;

const result = await send('Runtime.evaluate', { expression: evalCode, returnByValue: true });
console.log('MEASURED RECTS:', JSON.stringify(result.result.value, null, 2));

ws.close();
chrome.kill();
