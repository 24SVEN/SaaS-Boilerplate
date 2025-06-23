import { expect, test } from '@playwright/test';

const signinHtml = `<html><body>Email address</body></html>`;

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from English to French using dropdown and verify text on the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText('The perfect SaaS template to build')).toBeVisible();

      await page.getByRole('button', { name: 'lang-switcher' }).click();
      await page.getByText('Français').click();

      await expect(page.getByText('Le parfait SaaS template pour construire')).toBeVisible();
    });

    test('should switch language from English to French using URL and verify text on the sign-in page', async ({ page }) => {
      await page.route('**/sign-in', (route) => {
        route.fulfill({ body: signinHtml, contentType: 'text/html' });
      });
      await page.route('**/fr/sign-in', (route) => {
        route.fulfill({ body: '<html><body>Adresse e-mail</body></html>', contentType: 'text/html' });
      });
      await page.goto('/sign-in');

      await expect(page.getByText('Email address')).toBeVisible();

      await page.goto('/fr/sign-in');

      await expect(page.getByText('Adresse e-mail')).toBeVisible();
    });
  });
});
