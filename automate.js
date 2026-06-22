require("dotenv").config();
const { chromium } = require("playwright");

// Récupérer l'URL depuis le fichier .env avec une valeur par défaut de secours
const PORTAL_URL = process.env.PARKON_URL;
const cantonValue = process.env.VEHICLE_CANTON;
const plateValue = process.env.VEHICLE_PLATE;
const durationValue = process.env.PARKING_DURATION || "4 heures";
const emailValue = process.env.CONFIRMATION_EMAIL;

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

    // OPTIMISATION: Attendre que les éléments de la liste apparaissent à l'écran
    const cantonOption = page.locator(
      `.mud-list-item:has-text("${cantonValue}")`,
    );
    await cantonOption.waitFor({ state: "visible", timeout: 3000 });
    await cantonOption.click();

    // 4. Fill License Plate ("Plaque") - OPTIMISATION: ciblage par placeholder, beaucoup plus stable
    await page.fill('input[placeholder="354484"]', plateValue);

    // 5. Select Duration Dropdown ("Durée")
    await page.click(
      'label:has-text("Durée") + div, .mud-select:has-text("Durée") input',
    );

    // OPTIMISATION: Attendre que les éléments de la liste apparaissent à l'écran
    const dureeOption = page.locator(
      `.mud-list-item:has-text("${durationValue}")`,
    );
    await dureeOption.waitFor({ state: "visible", timeout: 3000 });
    await dureeOption.click();

    // 6. Fill Optional Confirmation Email
    const emailInput = await page.$('input[placeholder="Adresse e-mail"]');
    if (emailInput) {
      await emailInput.fill(emailValue);
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
