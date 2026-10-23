import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9470',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  const res = await fetch('http://127.0.0.1:9470/json/list');
  const pages = await res.json();
  const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
  ws.onopen = async () => {
    let id = 1;
    const send = (m, p={}) => new Promise(r => {
      const mid = id++;
      const h = (e) => { const d = JSON.parse(e.data); if (d.id === mid) { ws.removeEventListener('message', h); r(d.result); } };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
    await send('Page.enable');
    await send('Runtime.enable');
    // Wait 3.5s for entrance timeline to finish
    await new Promise(r => setTimeout(r, 3500));
    
    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const p = document.querySelector('.hr-person');
        const v = document.querySelector('.hr-visual');
        const b = document.querySelector('.hr-blob');
        const pr = p.getBoundingClientRect();
        const vr = v.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return {
          scroll: window.scrollY,
          visual: { top: vr.top, bottom: vr.bottom, height: vr.height },
          blob: { top: br.top, bottom: br.bottom, height: br.height },
          person: { top: pr.top, bottom: pr.bottom, height: pr.height, left: pr.left, width: pr.width },
          personStyle: p.getAttribute('style'),
          personComputedTransform: window.getComputedStyle(p).transform
        };
      })()`,
      returnByValue: true
    });
    console.log(result);
    chrome.kill();
    process.exit(0);
  };
}, 2000);
