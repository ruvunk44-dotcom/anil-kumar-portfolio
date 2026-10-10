import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4173/';
const SHOTS = '/workspace/portfolio/shots';
const CODE = process.env.RESUME_CODE;
if (!CODE) { console.error('Set RESUME_CODE env var'); process.exit(1); }
const widths = [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920];
const fail = []; const ok = (c, m) => { if (!c) fail.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function page(opts = {}) {
  const ctx = await browser.newContext(opts); const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  p.on('requestfailed', (r) => errs.push('requestfailed: ' + r.url()));
  await p.goto(URL, { waitUntil: 'networkidle' }); return { p, ctx, errs };
}
async function scrollAll(p) { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); }); }

for (const w of widths) {
  const { p, ctx, errs } = await page({ viewport: { width: w, height: w < 800 ? 800 : 900 } });
  await p.waitForTimeout(1500); await scrollAll(p);
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(over <= 0, `${w}px no horizontal scroll (overflow ${over})`);
  const bad = errs.filter((e) => !/GPU stall|swiftshader|WebGL.*fallback|Automatic fallback/i.test(e));
  ok(bad.length === 0, `${w}px console clean ${bad.join(' | ')}`);
  if (w === 1440) {
    ok(await p.locator('canvas').count() === 1, '1440 WebGL canvas mounted');
    { const sn = () => p.evaluate(() => [document.querySelector('.hero-static .link')?.getAttribute('d'), document.querySelector('.pkt')?.getAttribute('cx'), document.querySelector('.node-list li').style.transform]);
      const n = await p.locator('.hero-static .link').count(); const a = await sn(); await p.waitForTimeout(500); const b = await sn();
      ok(n === 10 && a.every((x, i) => x && x !== b[i]), 'WebGL mode: animated SVG lines, dots and bobbing nodes present and moving');
      await p.locator('.node', { hasText: 'Ariba' }).hover({ force: true }); await p.waitForTimeout(300);
      ok(await p.locator('.hero-static.has-active .link.on').count() === 1, 'WebGL mode: hover highlights one line');
      await p.mouse.move(5, 5); await p.waitForTimeout(300);
      const box = await p.locator('.hero-system').boundingBox();
      for (let f = 0; f < 30; f++) { if (f === 12) await p.locator('.node', { hasText: 'SuccessFactors' }).hover({ force: true }); await p.screenshot({ path: `/tmp/gifw/f${String(f).padStart(2, '0')}.png`, clip: box }); await p.waitForTimeout(70); }
      await p.mouse.move(5, 5); }
    await p.locator('.node', { hasText: 'SuccessFactors' }).hover({ force: true }); await p.waitForTimeout(600);
    ok((await p.locator('.insight').innerText()).includes('SuccessFactors Integration'), 'hero node updates insight');
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800); await p.screenshot({ path: `${SHOTS}/v2_hero_webgl.png` });
    await p.locator('#architecture').scrollIntoViewIfNeeded(); await p.locator('#cap-tab-edi').click(); await p.waitForTimeout(900);
    await p.evaluate(() => scrollTo(0, document.querySelector('#architecture .ws').getBoundingClientRect().top + scrollY - 140)); await p.waitForTimeout(500); await p.screenshot({ path: `${SHOTS}/v2_architecture.png` });
    const land = p.locator('.landscape'); await land.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
    await p.locator('.sys', { hasText: 'Third-party Payroll' }).hover(); await p.waitForTimeout(400);
    ok((await p.locator('#land-detail').innerText()).includes('Payroll Integration'), 'landscape hover detail');
    await p.evaluate(() => scrollTo(0, document.querySelector('.land').getBoundingClientRect().top + scrollY - 90)); await p.waitForTimeout(300); await p.locator('.sys', { hasText: 'Third-party Payroll' }).hover(); await p.waitForTimeout(400); await p.screenshot({ path: `${SHOTS}/v2_landscape.png` });
    await p.locator('#experience').scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, 500)); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${SHOTS}/v2_timeline.png` });
    // keyboard
    await p.evaluate(() => scrollTo(0, 0)); await p.locator('body').click({ position: { x: 5, y: 300 } });
    await p.goto(URL); await p.keyboard.press('Tab');
    ok(await p.evaluate(() => document.activeElement?.className) === 'skip', 'first Tab focuses skip link');
    await p.locator('#cap-tab-hybrid').focus(); await p.keyboard.press('ArrowDown');
    ok(await p.evaluate(() => document.activeElement?.id) === 'cap-tab-sap', 'arrow keys move between architecture tabs');
    // resume lock
    await p.locator('.nav-resume').click(); await p.fill('#lock-code', 'wrong-code'); await p.keyboard.press('Enter');
    await p.waitForSelector('.lock-msg.err', { timeout: 15000 }); ok(true, 'wrong code rejected');
    await p.fill('#lock-code', CODE); await p.keyboard.press('Enter');
    await p.waitForSelector('.lock-frame', { timeout: 20000 }); ok(true, 'correct code unlocks resume');
    await p.keyboard.press('Escape'); ok(!(await p.locator('.lock-dialog').evaluate((d) => d.open)), 'Escape closes lock');
  }
  await ctx.close();
}
// mobile menu
{
  const { p, ctx, errs } = await page({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.waitForTimeout(1500); await p.screenshot({ path: `${SHOTS}/v2_mobile_hero.png` });
  await p.locator('.menu-btn').click(); await p.waitForTimeout(700);
  ok(await p.locator('.mobile-dialog').evaluate((d) => d.open), 'mobile menu opens');
  ok(await p.locator('.menu-btn').getAttribute('aria-expanded') === 'true', 'aria-expanded true');
  await p.screenshot({ path: `${SHOTS}/v2_mobile_menu.png` });
  await p.locator('.mobile-nav a', { hasText: 'Experience' }).click(); await p.waitForTimeout(1500);
  ok(!(await p.locator('.mobile-dialog').evaluate((d) => d.open)), 'menu closes on navigate');
  ok(await p.evaluate(() => Math.abs(document.getElementById('experience').getBoundingClientRect().top) < 150), 'navigated to Experience');
  await p.locator('.menu-btn').click(); await p.waitForTimeout(400); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  ok(!(await p.locator('.mobile-dialog').evaluate((d) => d.open)), 'Escape closes menu');
  await p.locator('.menu-btn').click(); await p.waitForTimeout(400); await p.locator('.dialog-contact [data-resume]').click(); await p.waitForTimeout(800);
  ok(await p.locator('.lock-dialog').evaluate((d) => d.open), 'resume CTA in mobile menu opens lock');
  ok(errs.length === 0, 'mobile console clean ' + errs.join('|'));
  await ctx.close();
}
// SVG network motion (no-WebGL browser, as on the user's machine)
{
  const b2 = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
  const ctx = await b2.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  ok(await p.locator('canvas').count() === 0 && await p.locator('.hero-static .link').count() === 10, 'no-WebGL: SVG network with 10 links');
  const snap = () => p.evaluate(() => ({ d: document.querySelector('.hero-static .link').getAttribute('d'), dot: document.querySelector('.pkt').getAttribute('cx'), li: document.querySelector('.node-list li').style.transform, off: getComputedStyle(document.querySelector('.hero-static .link')).strokeDashoffset }));
  const a = await snap(); await p.waitForTimeout(500); const b = await snap();
  ok(a.d !== b.d && a.dot !== b.dot && a.li !== b.li && a.off !== b.off, 'SVG lines flow, curve, dots travel and nodes bob');
  await p.locator('.node', { hasText: 'Ariba' }).hover({ force: true }); await p.waitForTimeout(300);
  ok(await p.locator('.hero-static.has-active .link.on').count() === 1, 'hovered node line highlighted, others dimmed');
  await p.mouse.move(5, 5); await p.waitForTimeout(400);
  await p.evaluate(() => scrollTo(0, 3000)); await p.waitForTimeout(400);
  const c = await snap(); await p.waitForTimeout(400); const d = await snap();
  ok(c.d === d.d, 'SVG animation pauses off-screen');
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
  await p.locator('.node', { hasText: 'SuccessFactors' }).hover({ force: true }); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
  await p.screenshot({ path: `${SHOTS}/v2_hero.png` });
  const box = await p.locator('.hero-system').boundingBox();
  for (let f = 0; f < 30; f++) { await p.screenshot({ path: `/tmp/gif/f${String(f).padStart(2, '0')}.png`, clip: box }); await p.waitForTimeout(70); }
  ok(errs.length === 0, 'no-WebGL console clean ' + errs.join('|'));
  await b2.close();
}
// reduced motion
{
  const { p, ctx, errs } = await page({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.waitForTimeout(1500);
  ok(await p.locator('canvas').count() === 0, 'reduced motion: 3D scene disabled');
  ok(await p.locator('.hero-static').count() === 1, 'reduced motion: SVG network shown');
  const sn = () => p.evaluate(() => [document.querySelector('.hero-static .link').getAttribute('d'), document.querySelector('.pkt').getAttribute('cx'), document.querySelector('.node-list li').style.transform, getComputedStyle(document.querySelector('.hero-static .link')).strokeDashoffset]);
  const r1 = await sn(); await p.waitForTimeout(500); const r2 = await sn();
  ok(r1.every((x, i) => x && x !== r2[i]), 'reduced motion: hero lines/dots/nodes/dashes still move (gentle) ' + JSON.stringify([r1, r2]));
  const op = await p.locator('#about .lead').evaluate((e) => getComputedStyle(e.closest('div')).opacity);
  ok(op === '1', 'reduced motion: content visible without scroll animation (opacity ' + op + ')');
  for (const [sel, scope] of [['#cap-panel', '#cap-panel .fpkt'], ['.land', '.land .fpkt']]) {
    await p.locator(sel).scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    const g = () => p.evaluate((q) => [...document.querySelectorAll(q)].map((e) => e.style.transform), scope);
    const a = await g(); await p.waitForTimeout(500); const b = await g();
    ok(a.length > 0 && a.filter((x, i) => x && x !== b[i]).length >= a.length * 0.8, `reduced motion: ${sel} packets still move`);
  }
  ok(await p.locator('.land-lines path').first().evaluate((e) => getComputedStyle(e).animationIterationCount) === 'infinite', 'reduced motion: landscape dashes flow');
  ok(errs.length === 0, 'reduced motion console clean ' + errs.join('|'));
  await ctx.close();
}
// v3: Core Expertise glyphs + architecture workstation
{
  const { p, ctx, errs } = await page({ viewport: { width: 1440, height: 900 } });
  await p.locator('#expertise').scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  ok(await p.locator('.xmod .glyph').count() === 6, 'six custom expertise glyphs');
  ok(await p.locator('.exp-icon').count() === 0, 'generic icon badges removed');
  const sig = () => p.evaluate(() => [...document.querySelectorAll('#cap-panel .anode .lbl-node')].map((t) => t.textContent).join('|') + '#' + document.querySelectorAll('#cap-panel .conn').length);
  await p.locator('#cap-tab-hybrid').click(); await p.waitForTimeout(400); const s1 = await sig();
  ok(/Cloud Connector/.test(s1) && /SAP PO 7.5/.test(s1), 'hybrid topology shows CPI, Cloud Connector, SAP PO 7.5');
  const seen = new Set([s1]);
  for (const id of ['sap', 'api', 'sf', 'edi', 'gov']) { await p.locator(`#cap-tab-${id}`).click(); await p.waitForTimeout(300); seen.add(await sig()); }
  ok(seen.size === 6, 'each capability renders a distinct topology');
  await p.locator('#cap-tab-hybrid').click(); await p.locator('#cap-tab-hybrid').focus();
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
  ok(await p.evaluate(() => document.activeElement?.id) === 'cap-tab-api' && await p.locator('#cap-tab-api').getAttribute('aria-selected') === 'true', 'arrow keys select tabs');
  await p.keyboard.press('End'); ok(await p.locator('#cap-tab-gov').getAttribute('aria-selected') === 'true', 'End selects last tab');
  await p.keyboard.press('Home'); ok(await p.locator('#cap-tab-hybrid').getAttribute('aria-selected') === 'true', 'Home selects first tab');
  { const pos = () => p.evaluate(() => [...document.querySelectorAll('#cap-panel .fpkt')].map((e) => e.style.transform).join('|'));
    await p.locator('#cap-panel').scrollIntoViewIfNeeded(); await p.waitForTimeout(500); const a = await pos(); await p.waitForTimeout(500); const b = await pos();
    ok(a.length > 0 && a !== b, 'explorer packets move (rAF)');
    await p.locator('.land').scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    const lp = () => p.evaluate(() => [...document.querySelectorAll('.land .fpkt')].map((e) => e.style.transform));
    const c = await lp(); await p.waitForTimeout(500); const d = await lp();
    ok(c.length === 24 && c.filter((x, i) => x && x !== d[i]).length >= 20, 'landscape packets travel on all routes ' + c.length); }
  ok(errs.length === 0, 'v3 desktop console clean ' + errs.join('|'));
  await ctx.close();
}
for (const w of [320, 390]) {
  const { p, ctx, errs } = await page({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true });
  await p.locator('#architecture').scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
  ok(await p.locator('#cap-panel .topo-stack .fstage').count() >= 3 && await p.locator('#cap-panel svg.topo').count() === 0, `${w}px architecture is a vertical flow`);
  await p.locator('#cap-tab-sf').click(); await p.waitForTimeout(300);
  ok((await p.locator('#cap-panel .topo-stack').innerText()).includes('Employee Central'), `${w}px mobile tab switch updates flow`);
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(over <= 0, `${w}px v3 sections no horizontal overflow`);
  ok(errs.length === 0, `${w}px v3 mobile console clean ` + errs.join('|'));
  await ctx.close();
}
// links
{
  const { p, ctx } = await page();
  const hrefs = await p.$$eval('a', (as) => as.map((a) => a.getAttribute('href')));
  const ids = await p.$$eval('[id]', (e) => e.map((x) => x.id));
  const dead = hrefs.filter((h) => !h || (h.startsWith('#') && h !== '#resume-access' && !ids.includes(h.slice(1))));
  ok(dead.length === 0, 'no dead anchor links ' + dead.join(','));
  ok(hrefs.every((h) => !/\.pdf$/i.test(h)), 'no plaintext PDF links');
  await ctx.close();
}
await browser.close();
console.log(fail.length ? `\n${fail.length} FAILURES` : '\nALL PASS');
process.exit(fail.length ? 1 : 0);
