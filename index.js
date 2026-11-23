import puppeteer from "@cloudflare/puppeteer";

interface Env {
  BROWSER: Fetcher;
}

export default {
  async fetch(_request: Request, env: Env): Promise<Response> {
    let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

      await page.goto("https://example.com", {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

      const html = await page.content();

      return Response.json({
        ok: true,
        title: await page.title(),
        browserVersion: await browser.version(),
        //html: await page.content(),
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
} satisfies ExportedHandler<Env>;

