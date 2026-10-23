import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9333;

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
  await sleep(1500);
  const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
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

  // Wait 5s for page loader and initial animations to fully complete
  await sleep(5000);

  // Capture Hero initial
  let res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_hero_final.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_hero_final.png');

  // Simulate mouse movement across the screen to test parallax stability
  await send('Runtime.evaluate', { expression: `window.dispatchEvent(new PointerEvent('pointermove', { clientX: 1200, clientY: 450 }));` });
  await sleep(1000);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_hero_after_mouse.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_hero_after_mouse.png');

  // Scroll to #about
  await send('Runtime.evaluate', { expression: `document.getElementById('about').scrollIntoView();` });
  await sleep(1000);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_about_1.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_about_1.png');

  // Click on the about card stack to test shuffle
  await send('Runtime.evaluate', { expression: `document.querySelector('.stack').click();` });
  await sleep(800);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_about_2.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_about_2.png (shuffled 1)');

  await send('Runtime.evaluate', { expression: `document.querySelector('.stack').click();` });
  await sleep(800);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_about_3.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_about_3.png (shuffled 2)');

  await send('Runtime.evaluate', { expression: `document.querySelector('.stack').click();` });
  await sleep(800);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_about_4.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_about_4.png (shuffled 3)');

  // Scroll to #work
  await send('Runtime.evaluate', { expression: `document.getElementById('work').scrollIntoView();` });
  await sleep(1000);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_work.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_work.png');

  // Scroll to #journey
  await send('Runtime.evaluate', { expression: `document.getElementById('journey').scrollIntoView();` });
  await sleep(1000);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_journey.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_journey.png');

  // Scroll to #milestones
  await send('Runtime.evaluate', { expression: `document.querySelector('.ms-nums-head').scrollIntoView({ block: 'start' });` });
  await sleep(2500);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_milestones.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_milestones.png');

  // Scroll to .ct-card center
  await send('Runtime.evaluate', { expression: `document.querySelector('.ct-card').scrollIntoView({ block: 'center' });` });
  await sleep(1000);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_contact.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_contact.png');

  // Test mobile view (375x812)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);

  // Mobile Hero
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
  await sleep(800);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_mobile_hero.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_mobile_hero.png');

  // Mobile Contact
  await send('Runtime.evaluate', { expression: `document.querySelector('.ct-card').scrollIntoView({ block: 'center' });` });
  await sleep(800);
  res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('screenshot_mobile_contact.png', Buffer.from(res.data, 'base64'));
  console.log('Saved screenshot_mobile_contact.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
