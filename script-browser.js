import { browser } from "k6/browser";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3333";

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL);

    sleep(3);
    await page.locator('//button[. = "Pizza, Please!"]').click();

    await page.locator("h1").textContent() == "Looking to break out of your pizza routine?";

    sleep(3);
    page.screenshot({ path: "screenshot.png" });
    await check(page, {
      recommendation: page.locator("div#recommendations").textContent() != "",
    });
  } finally {
    await page.close();
  }
}