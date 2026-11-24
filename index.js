import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

		  // Set the test viewport before navigation.
  await page.setViewport({
    width: 1366,
    height: 769,
    deviceScaleFactor: 1,
  });

      await page.evaluateOnNewDocument(() => {
        // 1. webdriver
        Object.defineProperty(navigator, "webdriver", {
          get: () => false,
          configurable: true,
        });
      }

 await page.setJavaScriptEnabled(true);

		await page.setExtraHTTPHeaders({
  'accept-language': 'en-US,en;q=0.9',
});




		const url1 = "https://duck.ai/chat?ia=chat&duckai=1&home=1&prompt=1&origin=funnel_home_website&t=h_&we_feature_name=search-from-homepage&we_started_at=09-44-18_773&q=hello&model=gpt-6-luna&reasoning=low"

		const url2 = "https://gemini.google.com";

		const url3 = "https://duckduckgo.com";

		const url4 = "https://duck.ai";

      await page.goto(url1, {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

		const found = await page
  .waitForSelector('#app', { timeout: 20000 })
  .then(() => ({ found: true }))
  .catch(e => ({ found: false, error: e.message }));

await new Promise(resolve => setTimeout(resolve, 2100));

	await page.click('button[aria-label="Continue"]');

// Wait until in-flight connections drop to 2 or fewer for 500 ms
// waits for 0 active connections for at least 500 ms, throwing a TimeoutError after 15000 ms if that never happens.
await page.waitForNetworkIdle({
  idleTime: 5500,
  concurrency: 0,
  timeout: 50000,
});
/*
	const foundButton = await page
  .waitForSelector('button[aria-label="Continue"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundButton: true }))
  .catch(e => ({ foundButton: false, error: e.message }));
  
	const foundResponse = await page
  .waitForSelector('div[data-activeresponse="true"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundResponse: true }))
  .catch(e => ({ foundResponse: false, error: e.message }));
*/
		//await new Promise(resolve => setTimeout(resolve, 5000));
	const html = await page.content();

		

      return Response.json({
        ok: true,
        title: await page.title(),
        browserVersion: await browser.version(),
		  found: found,
		  //foundButton: foundButton,
		  //foundResponse: foundResponse,
        html: html
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
