import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/Inventorypage';
import { TEST_USERS, ERROR_MESSAGES, APP_URLS } from '@utils/constants';
import testData from '@fixtures/test-data.json';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('TC001: Verify Login page displays correctly', async () => {
    await test.step('Verify login page is displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
      await expect(loginPage.page).toHaveURL(APP_URLS.BASE + '/');
    });
  });

  test('TC002: Login successfully with valid credentials - standard user', async () => {
    await test.step('Login with standard user', async () => {
      await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
    });
    await test.step('Verify inventory page is displayed', async () => {
      await inventoryPage.verifyInventoryPageDisplayed();
      await expect(loginPage.page).toHaveURL(new RegExp(APP_URLS.INVENTORY));
    });
  });

  test('TC003: Login successfully with valid credentials - problem user', async () => {
    await loginPage.login(TEST_USERS.PROBLEM.username, TEST_USERS.PROBLEM.password);
    await inventoryPage.verifyInventoryPageDisplayed();
  });

  test('TC004: Login successfully with valid credentials - performance glitch user', async () => {
    await loginPage.login(TEST_USERS.PERFORMANCE_GLITCH.username, TEST_USERS.PERFORMANCE_GLITCH.password);
    await inventoryPage.verifyInventoryPageDisplayed();
  });

  test('TC005: Show error for locked out user', async () => {
    await loginPage.login(TEST_USERS.LOCKED_OUT.username, TEST_USERS.LOCKED_OUT.password);
    await loginPage.verifyErrorMessage(ERROR_MESSAGES.LOCKED_OUT);
    await expect(loginPage.page).toHaveURL(APP_URLS.BASE + '/');
  });

  test('TC006: Show error for empty username', async () => {
    await loginPage.login('', TEST_USERS.STANDARD.password);
    await loginPage.verifyErrorMessage(ERROR_MESSAGES.MISSING_USERNAME);
  });

  test('TC007: Show error for empty password', async () => {
    await loginPage.login(TEST_USERS.STANDARD.username, '');
    await loginPage.verifyErrorMessage(ERROR_MESSAGES.MISSING_PASSWORD);
  });

  test('TC008: Show error for invalid credentials', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.verifyErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('TC009: Close error message', async () => {
    await loginPage.login('', TEST_USERS.STANDARD.password);
    expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
    await loginPage.closeErrorMessage();
    expect(await loginPage.isErrorMessageDisplayed()).toBeFalsy();
  });

  test('TC010: Clear input fields', async () => {
    await loginPage.enterUsername(TEST_USERS.STANDARD.username);
    await loginPage.enterPassword(TEST_USERS.STANDARD.password);
    expect(await loginPage.getUsernameValue()).toBe(TEST_USERS.STANDARD.username);
    expect(await loginPage.getPasswordValue()).toBe(TEST_USERS.STANDARD.password);
    await loginPage.clearLoginFields();
    expect(await loginPage.getUsernameValue()).toBe('');
    expect(await loginPage.getPasswordValue()).toBe('');
  });

  test('TC011: Login button enabled by default', async () => {
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
  });

  test.describe('Login with test data from JSON', () => {
    test('TC012: Invalid credentials from fixture data', async () => {
      for (const invalidCred of testData.invalidCredentials) {
        await loginPage.navigateToLoginPage();
        await loginPage.login(invalidCred.username, invalidCred.password);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(invalidCred.expectedError);
      }
    });

    test('TC013: Login with all valid users from fixture data', async () => {
      const validUsers = [
        testData.users.standard,
        testData.users.problem,
        testData.users.performanceGlitch,
      ];

      for (const user of validUsers) {
        await loginPage.navigateToLoginPage();
        await loginPage.login(user.username, user.password);
        await inventoryPage.verifyInventoryPageDisplayed();
        await inventoryPage.logout();
      }
    });
  });
});