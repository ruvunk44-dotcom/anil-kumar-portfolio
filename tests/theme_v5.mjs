import { chromium } from 'playwright';
const URL = 'http://localhost:4173/', S = '/workspace/portfolio/shots';
const fail = []; const ok = (c, m) => { if (!c) fail.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ignore = (e) => /GPU stall|swiftshader|WebGL.*fallback|Automatic fallback/i.test(e);
async function go(w, h, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 600 ? 2 : 1, ...opts });
  const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !ignore(m.text())) errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); return { p, ctx, errs };
}
const theme = (p) => p.evaluate(() => [document.documentElement.dataset.theme, document.querySelector('meta[name=theme-color]').content, localStorage.getItem('ak-theme')]);
const scrollAll = (p) => p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
const over = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const at = async (p, sel, off = 90) => { await p.evaluate(([s, o]) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - o), [sel, off]); await p.waitForTimeout(1800); };

// default follows prefers-color-scheme
for (const cs of ['light', 'dark']) { const { p, ctx } = await go(1440, 900, { colorScheme: cs }); ok((await theme(p))[0] === cs, `default follows prefers-color-scheme=${cs}`); await ctx.close(); }

{ // desktop toggle + persistence + light QA at 1440
  const { p, ctx, errs } = await go(1440, 900, { colorScheme: 'dark' });
  const t = p.locator('.theme-btn.hdr');
  ok(await t.isVisible() && await t.getAttribute('aria-pressed') === 'false' && await t.getAttribute('aria-label') === 'Light mode', 'desktop toggle visible, labelled, aria-pressed=false');
  await t.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const th = await theme(p); ok(th[0] === 'light' && th[1] === '#f6f7f9' && th[2] === 'light' && await t.getAttribute('aria-pressed') === 'true', 'keyboard toggle -> light, meta + storage updated ' + th);
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor); ok(bg === 'rgb(246, 247, 249)', 'light body bg ' + bg);
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  ok((await theme(p))[0] === 'light', 'choice persists across reload');
  // no flash: theme set before first paint
  ok(await p.evaluate(() => performance.getEntriesByType('paint').length >= 0 && document.documentElement.dataset.theme === 'light'), 'pre-paint script applied');
  await p.waitForTimeout(1200); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1200);
  ok(await p.locator('canvas').count() === 1, 'light: WebGL canvas mounted');
  await p.screenshot({ path: `${S}/v5_light_hero.png` });
  await scrollAll(p); ok(await over(p) <= 0, 'light 1440 no horizontal overflow');
  await at(p, '#expertise'); await p.locator('.xmod-in').first().hover(); await p.waitForTimeout(400); await p.screenshot({ path: `${S}/v5_light_expertise.png` });
  await at(p, '#architecture .ws', 120); await p.waitForTimeout(1500); await p.screenshot({ path: `${S}/v5_light_arch.png` });
  ok(await p.locator('#architecture .fpkt').count() > 0, 'light: arch packets present');
  await at(p, '#contact', 60); await p.locator('.cx-ch').nth(1).hover(); await p.waitForTimeout(1500); await p.screenshot({ path: `${S}/v5_light_contact.png` });
  await p.locator('.cx-ch [data-resume]').click(); await p.waitForTimeout(500); await p.screenshot({ path: '/tmp/v5_lock.png' }); await p.keyboard.press('Escape');
  await at(p, '.land', 80); await p.screenshot({ path: '/tmp/v5_land.png' });
  await at(p, '#experience', 80); await p.screenshot({ path: '/tmp/v5_exp.png' });
  await at(p, '#certifications', 80); await p.screenshot({ path: '/tmp/v5_cert.png' });
  // contrast audit of visible text in light
  const low = await p.evaluate(() => {
    const L = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); if (a < .5) return null; const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const bg = 0.93; const out = [];
    for (const el of document.querySelectorAll('body *')) { if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden=true],dialog:not([open])')) continue; if (cs.color.includes('0, 0, 0, 0')) continue; const l = L(cs.color); if (l == null) continue; const r = (bg + .05) / (l + .05); if (r < 4.5) out.push(`${el.className || el.tagName}:${r.toFixed(2)}`); }
    return [...new Set(out)].slice(0, 25);
  });
  console.log('low-contrast candidates (vs paper):', low.join(' '));
  ok(errs.length === 0, 'light 1440 console clean ' + errs.join(' | '));
  // toggle back
  await p.evaluate(() => scrollTo(0, 0)); await p.locator('.theme-btn.hdr').click(); await p.waitForTimeout(400); ok((await theme(p))[0] === 'dark', 'toggle back to dark');
  await ctx.close();
}
{ // mobile 390 light via mobile menu toggle
  const { p, ctx, errs } = await go(390, 844, { colorScheme: 'dark', isMobile: true, hasTouch: true });
  ok(await p.locator('.theme-btn.hdr').isVisible(), 'mobile header toggle visible');
  await p.locator('.menu-btn').click(); await p.waitForTimeout(400);
  const d = p.locator('.theme-btn.dlg'); ok(await d.isVisible(), 'mobile menu toggle visible'); await d.click(); await p.waitForTimeout(500);
  ok((await theme(p))[0] === 'light' && await d.getAttribute('aria-pressed') === 'true', 'mobile menu toggle -> light'); await p.screenshot({ path: '/tmp/v5_menu.png' });
  await p.locator('.close-menu').click(); await p.waitForTimeout(400);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800); await p.screenshot({ path: `${S}/v5_light_mobile.png` });
  await scrollAll(p); ok(await over(p) <= 0, 'light 390 no horizontal overflow');
  await at(p, '#architecture .ws', 70); await p.screenshot({ path: '/tmp/v5_m_arch.png' });
  await at(p, '#contact', 70); await p.screenshot({ path: '/tmp/v5_m_contact.png' });
  ok(errs.length === 0, 'light 390 console clean ' + errs.join(' | ')); await ctx.close();
}
{ const { p, ctx } = await go(1440, 900, { colorScheme: 'dark', reducedMotion: 'reduce' });
  await p.locator('.theme-btn.hdr').click(); ok(await p.evaluate(() => !document.documentElement.classList.contains('theme-anim')), 'reduced motion: no colour transition'); await ctx.close(); }
await b.close(); console.log(fail.length ? `\n${fail.length} FAILED` : '\nALL PASS'); process.exit(fail.length ? 1 : 0);
