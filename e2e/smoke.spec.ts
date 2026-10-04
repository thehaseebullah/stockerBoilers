import { test, expect } from "@playwright/test";

test.describe("Stoker Smoke Tests", () => {
  test("home page loads with console, field and simulator links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Stoker");
    await expect(page.locator("text=Console")).toBeVisible();
    await expect(page.locator("text=Field")).toBeVisible();
    await expect(page.locator("text=Simulator")).toBeVisible();
  });

  test("console dashboard loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Operations overview");
  });

  test("field app loads", async ({ page }) => {
    await page.goto("/f/home");
    await expect(page.locator("text=Stoker Field")).toBeVisible();
    await expect(page.locator("text=Riverside Mill")).toBeVisible();
  });

  test("simulator page loads", async ({ page }) => {
    await page.goto("/simulator");
    await expect(page.locator("text=Stoker Simulator")).toBeVisible();
  });
});
