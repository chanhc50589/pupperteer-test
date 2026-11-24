import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

		const url = "https://example.com";

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

      return Response.json({
        ok: true,
		  value: 1147,
        title: await page.title(),
        browserVersion: await browser.version(),
        html: await page.content()
      });
    } catch (error) {
      console.error("failed:", error);
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
