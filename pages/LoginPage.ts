import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { APP_URLS } from '../utils/constants';


export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly logoImage: Locator;
  readonly loginCredentials: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
    this.logoImage = page.locator('.login_logo');
    this.loginCredentials = page.locator('#login_credentials');
  }


  async navigateToLoginPage(): Promise<void> {
    await this.goto(APP_URLS.BASE);
  }


  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }


  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }


  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }


  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }


  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }


  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }


  async closeErrorMessage(): Promise<void> {
    await this.click(this.errorCloseButton);
  }


  async verifyLoginPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.logoImage);
    await this.verifyElementVisible(this.usernameInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
  }


  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    await this.verifyElementContainsText(this.errorMessage, expectedMessage);
  }


  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }


  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }


  async clearLoginFields(): Promise<void> {
    await this.clearUsername();
    await this.clearPassword();
  }


  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }


  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }


  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }
}