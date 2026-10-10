import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4173/'; const S = '/workspace/portfolio/shots';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
await p.goto(URL, { waitUntil: 'networkidle' });
const at = async (sel, off = 90) => { await p.evaluate(([s, o]) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - o), [sel, off]); await p.waitForTimeout(1200); };
await at('#expertise .section-head', 60); await p.screenshot({ path: `${S}/v3_expertise.png` });
await p.locator('.xmod-in').first().hover(); await p.waitForTimeout(700); await p.screenshot({ path: `${S}/v3_expertise_hover.png` });
for (const [id, f] of [['hybrid', 'hybrid'], ['sf', 'successfactors'], ['edi', 'edi'], ['gov', 'governance'], ['sap', 'sap'], ['api', 'api']]) {
  await p.locator(`#cap-tab-${id}`).click(); await at('.ws', 40); await p.mouse.move(5, 5); await p.screenshot({ path: `${S}/v3_arch_${f}.png` });
}
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
await m.goto(URL, { waitUntil: 'networkidle' });
const mat = async (sel, off) => { await m.evaluate(([s, o]) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - o), [sel, off]); await m.waitForTimeout(1200); };
await mat('#expertise .section-head', 70); await m.screenshot({ path: `${S}/v3_mobile_expertise.png` });
await mat('.ws', 70); await m.screenshot({ path: `${S}/v3_mobile_arch.png` });
await b.close();
