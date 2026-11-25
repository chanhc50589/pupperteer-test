import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;
	const value = 453;

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
  p.textContent = 'reply in a code block. 123 + 123 = ?';
  el.replaceChildren(p);
});

	const foundButton = await page
  .waitForSelector('button[aria-label="Send message"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundButton: true }))
  .catch(e => ({ foundButton: false, error: e.message }));

	await page.click('button[aria-label="Send message"]');


await page.waitForNetworkIdle({
  idleTime: 5500,
  concurrency: 0,
  timeout: 50000,
});

await page.waitForSelector('div[inline-copy-host=""]');

    const result = await page.$eval(
      'div[inline-copy-host=""]',
      (element) => element.outerHTML,
    );

console.log("done")

await browser.close();

      return Response.json({
        ok: true,
		  value: value,
        title: await page.title(),
        browserVersion: await browser.version(),
		  found: found,
		  foundDiv: foundDiv,
		  foundButton: foundButton,
		  result: result,
        html: await page.content()
      });
    } catch (error) {
      console.error("Puppeteer test failed:", error);
      return Response.json(
        { ok: false, value: value, error: String(error) },
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
