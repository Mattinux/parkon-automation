const { chromium } = require("playwright");

const PORTAL_URL = "https://portal.parkon.ch/68e81677";

(async () => {
  // Launch the browser. (Set headless: true for production background use)
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigate to the portal
    await page.goto(PORTAL_URL);
    await page.waitForLoadState("networkidle");

    // 2. Direct Language Check
    const frenchButton = page.locator('button:has-text("En français")');

    if (await frenchButton.isVisible()) {
      console.log("Switching language to French...");
      await frenchButton.click();
      // Wait for the button to disappear to confirm Blazor processed the click
      await frenchButton.waitFor({ state: "detached", timeout: 5000 });
    } else {
      console.log(
        "Page is already in French (or button is missing). Proceeding...",
      );
    }

    // 3. Select Canton Dropdown
    await page.click(
      'label:has-text("Canton") + div, .mud-select:has-text("Canton") input',
    );
    // Change "Fribourg" to your preferred canton if needed
    await page.click('.mud-list-item:has-text("Fribourg")');

    // 4. Fill License Plate ("Plaque")
    // Change "FR123456" to your actual license plate
    await page.fill(
      'label:has-text("Plaque") >> xpath=../..//input',
      "FR123456",
    );

    // 5. Select Duration Dropdown ("Durée")
    await page.click(
      'label:has-text("Durée") + div, .mud-select:has-text("Durée") input',
    );
    // Change "4 heures" to match the exact text of the duration you need
    await page.click('.mud-list-item:has-text("4 heures")');

    // 6. Fill Optional Confirmation Email
    const emailInput = await page.$('input[placeholder="Adresse e-mail"]');
    if (emailInput) {
      await emailInput.fill("your-email@example.com"); // Put your email here
    }

    // 7. Check the Terms and Conditions Box
    await page.click("label.mud-checkbox", { force: true });

    // 8. Submit ("Envoyer")
    await page.click('button:has-text("Envoyer")');

    // Wait for the Blazor WebSocket to finish pushing the post data
    await page.waitForTimeout(3000);
    console.log("🚀 Form submitted successfully!");
  } catch (error) {
    console.error("\n❌ AUTOMATION CRASHED!");
    console.error("Error details:", error.message);
    console.error(
      "\n---------------------------------------------------------",
    );
    console.error(
      `⚠️ Please fill out the form manually here:\n👉 ${PORTAL_URL} 👈`,
    );
    console.error(
      "---------------------------------------------------------\n",
    );
  } finally {
    await browser.close();
  }
})();
