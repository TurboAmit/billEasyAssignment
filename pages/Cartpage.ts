import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { APP_URLS } from '../utils/constants';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemDescriptions: Locator;
  readonly cartItemQuantities: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemDescriptions = page.locator('.inventory_item_desc');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.removeButtons = page.locator('button[id^="remove"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async navigateToCartPage(): Promise<void> {
    await this.goto(APP_URLS.BASE + APP_URLS.CART);
  }

  async verifyCartPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.pageTitle);
    await this.verifyElementHasText(this.pageTitle, 'Your Cart');
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

  async removeItemByName(productName: string): Promise<void> {
    const productId = this.getProductId(productName);
    const removeButton = this.page.locator(`button[id="remove-${productId}"]`);
    await this.click(removeButton);
  }

  async removeAllItems(): Promise<void> {
    const removeButtonsList = await this.getAllElements(this.removeButtons);
    for (const button of removeButtonsList) {
      await this.click(button);
    }
  }

  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async clickCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async verifyItemInCart(productName: string): Promise<void> {
    const itemLocator = this.page.locator(`.inventory_item_name:has-text("${productName}")`);
    await this.verifyElementVisible(itemLocator);
  }

  async verifyCartIsEmpty(): Promise<void> {
    const count = await this.getCartItemsCount();
    if (count !== 0) {
      throw new Error(`Cart is not empty. Found ${count} items.`);
    }
  }

  private getProductId(productName: string): string {
    return productName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '');
  }

  async verifyMultipleItemsInCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.verifyItemInCart(productName);
    }
  }

  async getItemQuantity(productName: string): Promise<number> {
    const itemLocator = this.page.locator('.cart_item', {
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`)
    });
    const quantityElement = itemLocator.locator('.cart_quantity');
    const quantityText = await this.getText(quantityElement);
    return parseInt(quantityText, 10);
  }
}
