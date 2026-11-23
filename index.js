import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

  const pad2 = (value) => String(value).padStart(2, "0");
  const timestamp =
    `${pad2(now.getUTCHours())}-${pad2(now.getUTCMinutes())}-` +
    `${pad2(now.getUTCSeconds())}_000`;

  const url = new URL("https://duck.ai/chat");
  for (const [key, value] of Object.entries({
    ia: "chat",
    duckai: "1",
    home: "1",
    prompt: "1",
    origin: "funnel_home_website",
    t: "h_",
    we_feature_name: "search-from-homepage",
    we_started_at: timestamp,
    q: "hello",
    model: "gpt-6-luna",
    reasoning: "low",
  })) {
    url.searchParams.set(key, value);
  }


      await page.goto(url.toString(), {
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



