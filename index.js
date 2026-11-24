import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

 //await page.setJavaScriptEnabled(true);

		await page.setExtraHTTPHeaders({
  'accept-language': 'en-US,en;q=0.9',
});


		const url1 = "https://duck.ai/chat?ia=chat&duckai=1&home=1&prompt=1&origin=funnel_home_website&t=h_&we_feature_name=search-from-homepage&we_started_at=09-44-18_773&q=hello&model=gpt-6-luna&reasoning=low"

      await page.goto(url1, {
        waitUntil: "domcontentloaded",
        timeout: 10_000,
      });

		const found = await page
  .waitForSelector('#app', { timeout: 15_000 })
  .then(() => ({ found: true }))
  .catch(e => ({ found: false, error: e.message }));

    await clickIfPresent(page, 'button[aria-label="Continue"]');
 /*   await clickIfPresent(page, 'button[data-testid="DUCKAI_ONBOARDING_AGREE"]');



    await page.waitForSelector('div[data-activeresponse="true"]', {
      timeout: 15_000,
    });


    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("span")).some(
          (span) => span.textContent?.trim() === "2nd Opinion",
        ),
      { timeout: 59_000 },
    );

    const result = await page.$eval(
      'div[data-activeresponse="true"]',
      (element) => element.outerHTML,
    );
*/

	const html = await page.content();

      return Response.json({
        ok: true,
        title: await page.title(),
        browserVersion: await browser.version(),
	found: found,
		  html: html
	//result: result,
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


async function clickIfPresent(page, selector) {
  try {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: 2_500,
    });
    await page.click(selector);
  } catch (error) {
    if (error?.name !== "TimeoutError") throw error;
  }
}
