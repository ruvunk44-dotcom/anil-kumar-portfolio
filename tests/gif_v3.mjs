import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
const URL = process.env.URL || 'http://localhost:4173/'; const S = '/workspace/portfolio/shots';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
await p.goto(URL, { waitUntil: 'networkidle' });
for (const [sel, name, hover] of [['.ws-canvas', 'arch', null], ['.land-grid', 'landscape', 'Third-party Payroll']]) {
  await p.locator(sel).scrollIntoViewIfNeeded(); await p.evaluate((s) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - 100), sel); await p.waitForTimeout(1000);
  const box = await p.locator(sel).boundingBox(); execSync(`rm -rf /tmp/g_${name} && mkdir -p /tmp/g_${name}`);
  for (let f = 0; f < 60; f++) { if (hover && f === 30) await p.locator('.sys', { hasText: hover }).hover(); await p.screenshot({ path: `/tmp/g_${name}/f${String(f).padStart(2, '0')}.png`, clip: box }); await p.waitForTimeout(100); }
  execSync(`ffmpeg -y -loglevel error -framerate 8 -i /tmp/g_${name}/f%02d.png -vf "scale=900:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" ${S}/v3_${name}_motion.gif`);
}
await b.close();
