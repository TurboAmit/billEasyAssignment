import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { APP_URLS } from '../utils/constants';
import { parsePriceToNumber } from '../utils/helpers';


export class CheckoutStepTwoPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.paymentInformation = page.locator('[data-test="payment-info-value"]');
    this.shippingInformation = page.locator('[data-test="shipping-info-value"]');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  
  async navigateToCheckoutStepTwo(): Promise<void> {
    await this.goto(APP_URLS.BASE + APP_URLS.CHECKOUT_STEP_TWO);
  }


  async verifyCheckoutStepTwoDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.pageTitle);
    await this.verifyElementHasText(this.pageTitle, 'Checkout: Overview');
  }


  async getCartItemsCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }


  async getAllCartItemNames(): Promise<string[]> {
    const names: string[] = [];
    const elements = await this.getAllElements(this.cartItemNames);
    
    for (const element of elements) {
      const text = await this.getText(element);
      names.push(text);
    }
    
    return names;
  }


  async getAllCartItemPrices(): Promise<string[]> {
    const prices: string[] = [];
    const elements = await this.getAllElements(this.cartItemPrices);
    
    for (const element of elements) {
      const text = await this.getText(element);
      prices.push(text);
    }
    
    return prices;
  }


  async getPaymentInformation(): Promise<string> {
    return await this.getText(this.paymentInformation);
  }

 
  async getShippingInformation(): Promise<string> {
    return await this.getText(this.shippingInformation);
  }


  async getItemTotal(): Promise<string> {
    const text = await this.getText(this.itemTotalLabel);
    return text.replace('Item total: ', '');
  }


  async getItemTotalAsNumber(): Promise<number> {
    const totalText = await this.getItemTotal();
    return parsePriceToNumber(totalText);
  }


  async getTax(): Promise<string> {
    const text = await this.getText(this.taxLabel);
    return text.replace('Tax: ', '');
  }


  async getTaxAsNumber(): Promise<number> {
    const taxText = await this.getTax();
    return parsePriceToNumber(taxText);
  }


  async getTotal(): Promise<string> {
    const text = await this.getText(this.totalLabel);
    return text.replace('Total: ', '');
  }

 
  async getTotalAsNumber(): Promise<number> {
    const totalText = await this.getTotal();
    return parsePriceToNumber(totalText);
  }


  async clickFinish(): Promise<void> {
    await this.click(this.finishButton);
  }


  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  async verifyItemInCheckout(productName: string): Promise<void> {
    const itemLocator = this.page.locator(`.inventory_item_name:has-text("${productName}")`);
    await this.verifyElementVisible(itemLocator);
  }

  
  async verifyTotalCalculation(): Promise<boolean> {
    const itemTotal = await this.getItemTotalAsNumber();
    const tax = await this.getTaxAsNumber();
    const total = await this.getTotalAsNumber();
    
    const expectedTotal = itemTotal + tax;
    const difference = Math.abs(expectedTotal - total);
    
    // Allow small floating point differences (0.01)
    return difference < 0.01;
  }

  async completeCheckout(): Promise<void> {
    await this.clickFinish();
  }
}