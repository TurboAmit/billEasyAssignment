import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { APP_URLS } from '../utils/constants';


export class CheckoutCompletePage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly completeImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.completeImage = page.locator('.pony_express');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

 
  async navigateToCheckoutComplete(): Promise<void> {
    await this.goto(APP_URLS.BASE + APP_URLS.CHECKOUT_COMPLETE);
  }

  async verifyCheckoutCompleteDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.pageTitle);
    await this.verifyElementHasText(this.pageTitle, 'Checkout: Complete!');
  }


  async getCompleteHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

 
  async getCompleteText(): Promise<string> {
    return await this.getText(this.completeText);
  }

  async verifyOrderConfirmation(): Promise<void> {
    await this.verifyElementVisible(this.completeHeader);
    await this.verifyElementContainsText(this.completeHeader, 'Thank you for your order!');
    await this.verifyElementVisible(this.completeText);
    await this.verifyElementVisible(this.completeImage);
  }

 
  async clickBackHome(): Promise<void> {
    await this.click(this.backHomeButton);
  }

  async verifyBackHomeButtonVisible(): Promise<void> {
    await this.verifyElementVisible(this.backHomeButton);
  }
}