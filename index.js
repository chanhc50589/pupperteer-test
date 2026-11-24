import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(_request, env) {
    let browser;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        "accept-language": "en-US,en;q=0.9",
      });

      await page.goto("https://gemini.google.com", {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

      async function waitForVisible(selector, timeout) {
        try {
          await page.waitForSelector(selector, { visible: true, timeout });
          return { found: true };
        } catch (error) {
          return { found: false, error: error.message };
        }
      }

      const found = await waitForVisible("#app-root", 20_000);
      if (!found.found) {
        return Response.json(
          { ok: false, found, error: "App root did not appear." },
          { status: 502 },
        );
      }

      const editorSelector = 'div[contenteditable="true"]';
      const foundDiv = await waitForVisible(editorSelector, 10_000);
      if (!foundDiv.found) {
        return Response.json(
          { ok: false, found, foundDiv, error: "Message editor did not appear." },
          { status: 502 },
        );
      }

      // Use keyboard input so the page's event handlers register the text.
      await page.click(editorSelector);
      await page.keyboard.press("Control+A");
      await page.keyboard.type("test");

      const buttonSelector = 'button[aria-label="Send message"]';
      const foundButton = await waitForVisible(buttonSelector, 10_000);
      if (!foundButton.found) {
        return Response.json(
          { ok: false, found, foundDiv, foundButton, error: "Send button did not appear." },
          { status: 502 },
        );
      }

      await page.click(buttonSelector);

      const foundDiv2 = await waitForVisible(
        'div[aria-live="polite"]',
        15_000,
      );

      // Network-idle waits can time out on pages with ongoing requests.
      try {
        await page.waitForNetworkIdle({
          idleTime: 1_000,
          concurrency: 0,
          timeout: 10_000,
        });
      } catch {
        // Continue and return the page state even if it never becomes idle.
      }

      return Response.json({
        ok: true,
        value: 108,
        title: await page.title(),
        browserVersion: await browser.version(),
        found,
        foundDiv,
        foundButton,
        foundDiv2,
        html: await page.content(),
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
