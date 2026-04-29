import { test, expect } from '@playwright/test';

test('user can open admin panel page', async ({ page }) => {
  await page.goto('https://frontend-black-five-67.vercel.app');

  // Admin Panel butonuna tıkla
  await page.getByText('Admin Panel').click();

  // Sayfa açıldı mı kontrol et
  await expect(page.getByText('QuickPay Management System')).toBeVisible();
});