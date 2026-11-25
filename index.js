import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

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

//await new Promise(resolve => setTimeout(resolve, 2100));

	const foundDiv = await page
  .waitForSelector('div[contenteditable="true"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundDiv: true }))
  .catch(e => ({ foundDiv: false, error: e.message }));

await page.$eval('div[contenteditable="true"]', el => {
  const p = document.createElement('p');
  p.textContent = 'hello there';
  el.replaceChildren(p);
});

	const foundButton = await page
  .waitForSelector('button[aria-label="Send message"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundButton: true }))
  .catch(e => ({ foundButton: false, error: e.message }));

	await page.click('button[aria-label="Send message"]');

await new Promise(resolve => setTimeout(resolve, 2100));

	  	const foundButton2 = await page
  .waitForSelector('div[aria-live="polite"]', { visible: true, timeout: 15_000 })
  .then(() => ({ foundButton2: true }))
  .catch(e => ({ foundButton2: false, error: e.message }));


await page.waitForNetworkIdle({
  idleTime: 5500,
  concurrency: 0,
  timeout: 50000,
});

console.log("done")

      return Response.json({
        ok: true,
		  value: 410,
        title: await page.title(),
        browserVersion: await browser.version(),
		  found: found,
		  foundDiv: foundDiv,
		  foundButton: foundButton,
		  foundButton2: foundButton2,
		  //foundResponse: foundResponse,
        html: await page.content()
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
