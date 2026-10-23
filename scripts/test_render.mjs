import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9488;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1440,900',
  '--disable-gpu',
  '--no-sandbox',
  'http://localhost:5173/'
]);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  let listRes = null;
  for (let i = 0; i < 10; i++) {
    await sleep(500);
    try {
      listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (listRes.ok) break;
    } catch {}
  }
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page') || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const resolve = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
    }
  };
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  // Wait 6.0s for loader to finish and entrance animations to settle
  await sleep(6000);

  // 1. Capture Desktop Hero
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('test_render_desktop_hero.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_render_desktop_hero.png');

  // 2. Scroll to Contact and capture Desktop Contact
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.ct-card').scrollIntoView({ block: 'center' });`
  });
  await sleep(1500);
  shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('test_render_desktop_contact.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_render_desktop_contact.png');

  // 3. Mobile test at 375x812
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  // Scroll to Mobile Hero Visual
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.hr-visual').scrollIntoView({ block: 'center' });`
  });
  await sleep(800);
  shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('test_render_mobile_hero.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_render_mobile_hero.png');

  // Scroll to Mobile Contact Media
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.ct-media').scrollIntoView({ block: 'center' });`
  });
  await sleep(1000);
  shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('test_render_mobile_contact.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_render_mobile_contact.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
