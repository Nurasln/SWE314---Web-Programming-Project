import { test, expect } from "@playwright/test";

const BASE_URL = "https://frontend-black-five-67.vercel.app";

test("homepage loads", async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(/vercel/);
});

test("admin page loads", async ({ page }) => {
  await page.goto(`${BASE_URL}/admin`);
  await expect(page).toHaveURL(/admin/);
});

test("homepage visual snapshot", async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveScreenshot("homepage.png", { fullPage: true });
});

test("mobile homepage visual snapshot", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE_URL);
  await expect(page).toHaveScreenshot("mobile-homepage.png", { fullPage: true });
});