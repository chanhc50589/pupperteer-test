import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

	

 await page.setJavaScriptEnabled(true);

		await page.setExtraHTTPHeaders({
  'accept-language': 'en-US,en;q=0.9',
});


		const url2 = "https://gemini.google.com";

      await page.goto(url2, {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

		const found = await page
  .waitForSelector('#app-root', { timeout: 20000 })
  .then(() => ({ found: true }))
  .catch(e => ({ found: false, error: e.message }));



await page.waitForNetworkIdle({
  idleTime: 5500,
  concurrency: 0,
  timeout: 50000,
});

	//const html = await page.content();

		

      return Response.json({
        ok: true,
		  value: 1147,
        title: await page.title(),
        browserVersion: await browser.version(),
		  found: found,
        html: await page.content();
      });
    } catch (error) {
      console.error("Puppeteer test failed:", error);
      return Response.json(
        { ok: false, error: String(error) },
        { status: 500 },
      );
    } finally {
      if (browser) {
        await browser.close().catch((error) => {
          console.error("Browser close failed:", error);
        });
      }
    }
  },
};
