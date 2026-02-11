import { Page } from '@playwright/test';

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateRandomEmail(): string {
  return `test_${generateRandomString(8)}@example.com`;
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function parsePriceToNumber(priceString: string): number {
  return parseFloat(priceString.replace(/[^0-9.]/g, ''));
}

export function calculateTotal(prices: string[]): number {
  return prices.reduce((total, price) => total + parsePriceToNumber(price), 0);
}

export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ 
    path: `reports/screenshots/${name}_${Date.now()}.png`,
    fullPage: true 
  });
}

export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await wait(delay);
      }
    }
  }
  
  throw lastError!;
}

export async function isElementInteractable(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  return (await element.isVisible()) && (await element.isEnabled());
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}