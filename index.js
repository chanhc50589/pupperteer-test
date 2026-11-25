import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;
	const value = 611;
	let found = null, foundDiv = null, foundButton = null, foundDiv2 = null, result = null;

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

//
found = await page
  .waitForSelector('#app-root', { timeout: 20000 })
  .then(() => ({ found: true }))
  .catch(e => ({ found: false, error: e.message }));

await new Promise(resolve => setTimeout(resolve, 2100));

//
foundDiv = await page
  .waitForSelector('div[contenteditable="true"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundDiv: true }))
  .catch(e => ({ foundDiv: false, error: e.message }));

await page.$eval('div[contenteditable="true"]', el => {
  const p = document.createElement('p');
  p.textContent = 'reply in a code block. 4321 + 4321 = ?';
  el.replaceChildren(p);
});

//
foundButton = await page
  .waitForSelector('button[aria-label="Send message"]', { visible: true, timeout: 5_000 })
  .then(() => ({ foundButton: true }))
  .catch(e => ({ foundButton: false, error: e.message }));

	await page.click('button[aria-label="Send message"]');

//
foundDiv2 = await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    result = await page.$eval(
      'code',
      (element) => element.outerHTML,
    );



await page.waitForNetworkIdle({
  idleTime: 5500,
  concurrency: 0,
  timeout: 50000,
});


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
		  foundDiv2: foundDiv2,
		  browser: browser,
		  connected: browser.isConnected(),
		  result: result,
        html: await page.content()
      });
    } catch (error) {
      console.error("Puppeteer test failed:", error);

      return Response.json(
        { ok: false, value: value, 
		  found: found,
		  foundDiv: foundDiv,
		  foundButton: foundButton,
		  foundDiv2: foundDiv2,
		  browser: browser,
		 connected: browser.isConnected(),
		  result: result,
		error: String(error) },
        { status: 500 },
      );
    } finally {
      if (browser) {
        await browser.close().catch((error) => {
          console.error("Browser close failed:", error);
        });
console.log(`browser: ${browser}, connected: ${browser.isConnected()}`)
      }
    }
  },
};
