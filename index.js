import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

 //await page.setJavaScriptEnabled(true);

      await page.setJavaScriptEnabled(true).goto("https://duck.ai/chat?ia=chat&duckai=1&home=1&prompt=1&origin=funnel_home_website&t=h_&we_feature_name=search-from-homepage&we_started_at=09-44-18_773&q=hello&model=gpt-6-luna&reasoning=low", {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

	const html = await page.content();

      return Response.json({
        ok: true,
        title: await page.title(),
        browserVersion: await browser.version(),
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






