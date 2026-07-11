const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const widths = [375, 720, 1080, 1440];
  const heights = { 375: 800, 720: 800, 1080: 800, 1440: 800 };
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: heights[w] }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    // Capture full page AND first viewport
    await page.screenshot({ path: `/home/z/my-project/screenshots-rebuilt/home-${w}-01.png` });
    // Scroll and capture more
    const totalH = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Width ${w}: viewport=${heights[w]}px, total=${totalH}px`);
    const steps = Math.min(12, Math.ceil(totalH / heights[w]));
    for (let i = 1; i < steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * heights[w]);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `/home/z/my-project/screenshots-rebuilt/home-${w}-${String(i+1).padStart(2,'0')}.png` });
    }
    await ctx.close();
  }
  await browser.close();
  console.log('Done');
})();
