import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { APP_URLS, SORT_OPTIONS } from '../utils/constants';

/**
 * Inventory Page Object
 * Represents the products inventory page
 */
export class InventoryPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly menuButton: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemDescriptions: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly dropdownSearch: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.pageTitle = page.locator('.title');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.inventoryItemDescriptions = page.locator('.inventory_item_desc');
    this.addToCartButtons = page.locator('button[id^="add-to-cart"]');
    this.removeButtons = page.locator('button[id^="remove"]');
    this.dropdownSearch = page.locator('[data-test="product-sort-container"]');

  }


  async navigateToInventoryPage(): Promise<void> {
    await this.goto(APP_URLS.BASE + APP_URLS.INVENTORY);
  }

  async verifyInventoryPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.pageTitle);
    await this.verifyElementHasText(this.pageTitle, 'Products');
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.isVisible(this.cartBadge);
    if (!isVisible) return 0;
    
    const badgeText = await this.getText(this.cartBadge);
    return parseInt(badgeText, 10);
  }


  async clickCartIcon(): Promise<void> {
    await this.click(this.cartIcon);
  }


  async addProductToCart(productName: string): Promise<void> {
    const productButton = this.page.locator(`button[id="add-to-cart-${this.getProductId(productName)}"]`);
    await this.click(productButton);
  }


  async removeProductFromCart(productName: string): Promise<void> {
    const productButton = this.page.locator(`button[id="remove-${this.getProductId(productName)}"]`);
    await this.click(productButton);
  }


  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }


  private getProductId(productName: string): string {
    return productName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '');
  }


  async getAllProductNames(): Promise<string[]> {
    const names: string[] = [];
    const elements = await this.getAllElements(this.inventoryItemNames);
    
    for (const element of elements) {
      const text = await this.getText(element);
      names.push(text);
    }
    
    return names;
  }


  async getAllProductPrices(): Promise<string[]> {
    const prices: string[] = [];
    const elements = await this.getAllElements(this.inventoryItemPrices);
    
    for (const element of elements) {
      const text = await this.getText(element);
      prices.push(text);
    }
    
    return prices;
  }

 
  async sortProducts(sortOption: string): Promise<void> {
    await this.selectOption(this.sortDropdown, sortOption);
  }

 
  async sortProductsAtoZ(): Promise<void> {
    await this.sortProducts(SORT_OPTIONS.NAME_ASC);
  }

 
  async sortProductsZtoA(): Promise<void> {
    await this.sortProducts(SORT_OPTIONS.NAME_DESC);
  }

 
  async sortProductsPriceLowToHigh(): Promise<void> {
    await this.sortProducts(SORT_OPTIONS.PRICE_LOW_HIGH);
  }

  
  async sortProductsPriceHighToLow(): Promise<void> {
    await this.sortProducts(SORT_OPTIONS.PRICE_HIGH_LOW);
  }


  async clickProductByName(productName: string): Promise<void> {
    const productLink = this.page.locator(`.inventory_item_name:has-text("${productName}")`);
    await this.click(productLink);
  }


  async getProductPrice(productName: string): Promise<string> {
    const productItem = this.page.locator('.inventory_item', {
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`)
    });
    const priceElement = productItem.locator('.inventory_item_price');
    return await this.getText(priceElement);
  }


  async isProductInCart(productName: string): Promise<boolean> {
    const removeButton = this.page.locator(`button[id="remove-${this.getProductId(productName)}"]`);
    return await this.isVisible(removeButton);
  }

 
  async openMenu(): Promise<void> {
    await this.click(this.menuButton);
  }


  async logout(): Promise<void> {
    await this.openMenu();
    const logoutLink = this.page.locator('#logout_sidebar_link');
    await this.click(logoutLink);
  }
}