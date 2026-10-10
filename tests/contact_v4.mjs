import { chromium } from 'playwright';
const URL = 'http://localhost:4173/', S = '/workspace/portfolio/shots';
const sizes = [[1920,1080],[1440,900],[1366,768],[1024,768],[430,932],[390,844],[375,812]];
const fail = []; const ok = (c, m) => { if (!c) fail.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function go(w, h, extra = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 600 ? 2 : 1, ...extra });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: URL });
  const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('#contact').scrollIntoView({ block: 'start' })); await p.waitForTimeout(3200);
  return { p, ctx, errs };
}
for (const [w, h] of sizes) {
  const { p, ctx, errs } = await go(w, h);
  const r = await p.evaluate(() => {
    const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const fr = document.querySelector('.cx-frame').getBoundingClientRect();
    const bad = [...document.querySelectorAll('#contact a, #contact button, .cx-meta, .cx-mail a')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > fr.right + 1 || r.left < fr.left - 1; }).length;
    const net = document.querySelector('.cx-net'); const vis = getComputedStyle(net).display !== 'none';
    let align = 0;
    if (vis) { const ends = [...document.querySelectorAll('.cx-end')].map((e) => e.getBoundingClientRect()); const ins = [...document.querySelectorAll('.cx-port-in')].map((e) => e.getBoundingClientRect());
      align = Math.max(...ends.map((e, i) => Math.abs((e.top + e.height / 2) - (ins[i].top + ins[i].height / 2)))); }
    return { over, bad, vis, align, pk: document.querySelectorAll('#contact .fpkt').length };
  });
  ok(r.over <= 0, `${w}x${h} no overflow (${r.over})`); ok(r.bad === 0, `${w} contents inside frame (${r.bad})`);
  if (r.vis) { ok(r.align < 2, `${w} route ends align to channel ports (Δ${r.align.toFixed(1)}px)`); ok(r.pk === 3, `${w} packets ${r.pk}`); }
  ok(errs.length === 0, `${w} console clean ${errs.join('|')}`);
  if (w === 1440) {
    const fr = await p.locator('.cx-frame').boundingBox();
    await p.screenshot({ path: `${S}/v4_contact_desktop.png`, clip: { x: 0, y: fr.y - 40, width: w, height: fr.height + 160 } });
    await p.locator('.cx-ch').nth(1).hover(); await p.waitForTimeout(700);
    ok(await p.locator('.cx-rt.on').count() === 1 && await p.locator('.cx.has-on').count() === 1, 'hover LinkedIn activates one route');
    await p.screenshot({ path: `${S}/v4_contact_hover_linkedin.png`, clip: { x: 0, y: fr.y - 40, width: w, height: fr.height + 160 } });
    const mail = await p.locator('.cx-ch a').first().getAttribute('href'); ok(mail === 'mailto:anilkumarnellore88@gmail.com', 'mailto href ' + mail);
    const li = p.locator('.cx-ch a').nth(1); ok(await li.getAttribute('href') === 'https://www.linkedin.com/in/yw5pbgt1bwfy/' && /noopener/.test(await li.getAttribute('rel')) && await li.getAttribute('target') === '_blank', 'LinkedIn href/target/rel');
    await p.locator('.cx-copy').click(); await p.waitForTimeout(300);
    ok(await p.evaluate(() => navigator.clipboard.readText()) === 'anilkumarnellore88@gmail.com', 'copy email to clipboard');
    ok((await p.locator('.cx-toast[role=status]').innerText()).includes('copied'), 'toast announced'); ok(await p.locator('.cx-copy.done').count() === 1, 'copy check state');
    await p.locator('.cx-ch [data-resume]').click(); await p.waitForTimeout(500);
    ok(await p.evaluate(() => document.querySelector('.lock-dialog')?.open), 'Resume opens lock dialog'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    // keyboard
    await p.locator('.cx-mail a').focus(); const seq = [];
    for (let i = 0; i < 5; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => document.activeElement.className + '|' + document.activeElement.textContent.trim().slice(0, 12))); }
    console.log(seq.join(' -> ')); ok(seq[0].startsWith('cx-copy') && seq[1].includes('cx-ch-a') && seq[3].includes('cx-ch-a'), 'tab order copy -> 3 channels');
    await p.locator('.cx-ch a').nth(1).focus(); ok(await p.locator('.cx-ch.on .cx-ch-a').count() === 1 && await p.locator('.cx-rt.on').count() === 1, 'focus activates route');
    await p.locator('.cx-copy').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200); ok(await p.locator('.cx-copy.done').count() === 1, 'copy via keyboard');
    await p.locator('.cx-top').click(); await p.waitForTimeout(3000); ok(await p.evaluate(() => scrollY) < 50, 'back to top');
  }
  if (w === 390) { const fr = await p.locator('#contact').boundingBox(); await p.screenshot({ path: `${S}/v4_contact_mobile.png`, clip: { x: 0, y: fr.y + await p.evaluate(() => scrollY), width: w, height: Math.min(fr.height + 140, 1700) }, fullPage: true }); }
  await ctx.close();
}
{ const { p, ctx, errs } = await go(1440, 900, { reducedMotion: 'reduce' });
  const r = await p.evaluate(() => ({ live: !!document.querySelector('.cx.live'), drawn: getComputedStyle(document.querySelector('.cx-rt-base')).strokeDashoffset, pk: document.querySelectorAll('#contact .fpkt').length, ring: getComputedStyle(document.querySelector('.cx-router'), '::before').animationName, op: getComputedStyle(document.querySelector('.cx-chs')).opacity }));
  ok(r.live && parseFloat(r.drawn) === 0 && r.op === '1', 'reduce: entrance completes ' + JSON.stringify(r)); ok(r.pk === 0 && r.ring === 'none', 'reduce: ambient pulse/packets off');
  await p.locator('.cx-ch').nth(2).hover(); await p.waitForTimeout(300); ok(await p.locator('.cx-rt.on').count() === 1, 'reduce: hover route works');
  ok(errs.length === 0, 'reduce console clean'); await ctx.close(); }
await b.close(); console.log(fail.length ? `\n${fail.length} FAILED` : '\nALL PASS'); process.exit(fail.length ? 1 : 0);
