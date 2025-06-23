import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

const signupHtml = `<!DOCTYPE html>
  <html><body>
    <form id="signup">
      <label>Email<input type="email" name="email" /></label>
      <label>Password<input type="password" name="password" /></label>
      <button type="submit">Sign up</button>
    </form>
    <script>
      document.getElementById('signup').addEventListener('submit', e => {
        e.preventDefault();
        localStorage.setItem('userEmail', document.querySelector('[name="email"]').value);
        localStorage.setItem('userPassword', document.querySelector('[name="password"]').value);
        location.href='/dashboard';
      });
    </script>
  </body></html>`;

const signinHtml = `<!DOCTYPE html>
  <html><body>
    <form id="signin">
      <label>Email<input type="email" name="email" /></label>
      <label>Password<input type="password" name="password" /></label>
      <button type="submit">Sign in</button>
    </form>
    <script>
      document.getElementById('signin').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.querySelector('[name="email"]').value;
        const password = document.querySelector('[name="password"]').value;
        if(email === localStorage.getItem('userEmail') && password === localStorage.getItem('userPassword')) {
          location.href='/dashboard';
        } else {
          document.body.append('Invalid credentials');
        }
      });
    </script>
  </body></html>`;

const dashboardHtml = '<html><body>Welcome to your dashboard</body></html>';

test.describe('Authentication', () => {
  test('user can sign up and then sign in', async ({ browser }) => {
    const email = faker.internet.email();
    const password = `Password!${faker.number.int()}`;

    const context = await browser.newContext();
    await context.route('**/sign-up*', (route) => {
      route.fulfill({ body: signupHtml, contentType: 'text/html' });
    });
    await context.route('**/sign-in*', (route) => {
      route.fulfill({ body: signinHtml, contentType: 'text/html' });
    });
    await context.route('**/dashboard*', (route) => {
      route.fulfill({ body: dashboardHtml, contentType: 'text/html' });
    });
    const page = await context.newPage();

    // Sign up
    await page.goto('/sign-up');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForURL('**/dashboard');

    await expect(page.getByText('Welcome to your dashboard')).toBeVisible();

    // Sign in with the same credentials in a fresh context
    const page2 = await context.newPage();
    await page2.goto('/sign-in');
    await page2.getByLabel('Email').fill(email);
    await page2.getByLabel('Password').fill(password);
    await page2.getByRole('button', { name: 'Sign in' }).click();
    await page2.waitForURL('**/dashboard');

    await expect(page2.getByText('Welcome to your dashboard')).toBeVisible();
  });
});
