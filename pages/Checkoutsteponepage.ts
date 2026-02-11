import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { APP_URLS } from '../utils/constants';


export class CheckoutStepOnePage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
  }

  
  async navigateToCheckoutStepOne(): Promise<void> {
    await this.goto(APP_URLS.BASE + APP_URLS.CHECKOUT_STEP_ONE);
  }

  
  async verifyCheckoutStepOneDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.pageTitle);
    await this.verifyElementHasText(this.pageTitle, 'Checkout: Your Information');
  }

  
  async enterFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
  }

  
  async enterLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName);
  }

  
  async enterPostalCode(postalCode: string): Promise<void> {
    await this.fill(this.postalCodeInput, postalCode);
  }

  
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
  }

  
  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  
  async completeCheckoutStepOne(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.clickContinue();
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

 
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    await this.verifyElementContainsText(this.errorMessage, expectedMessage);
  }


  async clearFirstName(): Promise<void> {
    await this.firstNameInput.clear();
  }


  async clearLastName(): Promise<void> {
    await this.lastNameInput.clear();
  }


  async clearPostalCode(): Promise<void> {
    await this.postalCodeInput.clear();
  }


  async clearAllFields(): Promise<void> {
    await this.clearFirstName();
    await this.clearLastName();
    await this.clearPostalCode();
  }
}