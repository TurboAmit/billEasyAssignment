import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/Inventorypage';
import { CartPage } from '@pages/Cartpage';
import { CheckoutStepOnePage } from '@pages/Checkoutsteponepage';
import { CheckoutStepTwoPage } from '@pages/Checkoutsteptwopage';
import { CheckoutCompletePage } from '@pages/Checkoutcompletepage';
import { TEST_USERS, ERROR_MESSAGES, PRODUCT_NAMES } from '../utils/constants';
import testData from 'fixtures/test-data.json';

test.describe('Checkout Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
    await inventoryPage.verifyInventoryPageDisplayed();
  });

  test('TC001: Complete checkout with single item', async () => {
    await test.step('Add product to cart', async () => {
      await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
      expect(await inventoryPage.getCartItemCount()).toBe(1);
    });

    await test.step('Verify cart and proceed to checkout', async () => {
      await inventoryPage.clickCartIcon();
      await cartPage.verifyCartPageDisplayed();
      await cartPage.verifyItemInCart(PRODUCT_NAMES.BACKPACK);
      await cartPage.clickCheckout();
      await checkoutStepOnePage.verifyCheckoutStepOneDisplayed();
    });

    await test.step('Fill checkout information', async () => {
      const customer = testData.checkout.validCustomer;
      await checkoutStepOnePage.completeCheckoutStepOne(customer.firstName, customer.lastName, customer.postalCode);
    });

    await test.step('Verify checkout overview and complete order', async () => {
      await checkoutStepTwoPage.verifyCheckoutStepTwoDisplayed();
      await checkoutStepTwoPage.verifyItemInCheckout(PRODUCT_NAMES.BACKPACK);
      expect(await checkoutStepTwoPage.verifyTotalCalculation()).toBeTruthy();
      await checkoutStepTwoPage.completeCheckout();
      await checkoutCompletePage.verifyCheckoutCompleteDisplayed();
      await checkoutCompletePage.verifyOrderConfirmation();
    });
  });

  test('TC002: Complete checkout with multiple items', async () => {
    const products = [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT, PRODUCT_NAMES.BOLT_TSHIRT];
    await inventoryPage.addMultipleProductsToCart(products);
    expect(await inventoryPage.getCartItemCount()).toBe(products.length);

    await inventoryPage.clickCartIcon();
    await cartPage.verifyCartPageDisplayed();
    await cartPage.verifyMultipleItemsInCart(products);
    await cartPage.clickCheckout();

    const customer = testData.checkout.validCustomer;
    await checkoutStepOnePage.completeCheckoutStepOne(customer.firstName, customer.lastName, customer.postalCode);

    await checkoutStepTwoPage.verifyCheckoutStepTwoDisplayed();
    for (const product of products) {
      await checkoutStepTwoPage.verifyItemInCheckout(product);
    }
    expect(await checkoutStepTwoPage.verifyTotalCalculation()).toBeTruthy();

    await checkoutStepTwoPage.completeCheckout();
    await checkoutCompletePage.verifyOrderConfirmation();
  });

  test('TC003: Show error for missing first name', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    await checkoutStepOnePage.enterLastName('Doe');
    await checkoutStepOnePage.enterPostalCode('12345');
    await checkoutStepOnePage.clickContinue();

    await checkoutStepOnePage.verifyErrorMessage(ERROR_MESSAGES.MISSING_FIRST_NAME);
  });

  test('TC004: Show error for missing last name', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    await checkoutStepOnePage.enterFirstName('John');
    await checkoutStepOnePage.enterPostalCode('12345');
    await checkoutStepOnePage.clickContinue();

    await checkoutStepOnePage.verifyErrorMessage(ERROR_MESSAGES.MISSING_LAST_NAME);
  });

  test('TC005: Show error for missing postal code', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    await checkoutStepOnePage.enterFirstName('John');
    await checkoutStepOnePage.enterLastName('Doe');
    await checkoutStepOnePage.clickContinue();

    await checkoutStepOnePage.verifyErrorMessage(ERROR_MESSAGES.MISSING_POSTAL_CODE);
  });

  test('TC006: Cancel checkout at step one', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    await checkoutStepOnePage.clickCancel();
    await cartPage.verifyCartPageDisplayed();
  });

  test('TC007: Cancel checkout at step two', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    const customer = testData.checkout.validCustomer;
    await checkoutStepOnePage.completeCheckoutStepOne(customer.firstName, customer.lastName, customer.postalCode);

    await checkoutStepTwoPage.clickCancel();
    await inventoryPage.verifyInventoryPageDisplayed();
  });

  test('TC008: Display correct payment and shipping information', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    const customer = testData.checkout.validCustomer;
    await checkoutStepOnePage.completeCheckoutStepOne(customer.firstName, customer.lastName, customer.postalCode);

    const paymentInfo = await checkoutStepTwoPage.getPaymentInformation();
    const shippingInfo = await checkoutStepTwoPage.getShippingInformation();

    expect(paymentInfo).toBeTruthy();
    expect(shippingInfo).toBeTruthy();
  });

  test('TC009: Navigate back home after order completion', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    const customer = testData.checkout.validCustomer;
    await checkoutStepOnePage.completeCheckoutStepOne(customer.firstName, customer.lastName, customer.postalCode);

    await checkoutStepTwoPage.completeCheckout();
    await checkoutCompletePage.verifyOrderConfirmation();
    await checkoutCompletePage.clickBackHome();

    await inventoryPage.verifyInventoryPageDisplayed();
  });

  test('TC010: Handle checkout with most expensive item', async () => {
    await inventoryPage.addProductToCart(PRODUCT_NAMES.FLEECE_JACKET);
    await inventoryPage.clickCartIcon();
    await cartPage.clickCheckout();

    const customer = testData.checkout.validCustomer;
    await checkoutStepOnePage.completeCheckoutStepOne(customer.firstName, customer.lastName, customer.postalCode);

    await checkoutStepTwoPage.verifyItemInCheckout(PRODUCT_NAMES.FLEECE_JACKET);
    const itemTotal = await checkoutStepTwoPage.getItemTotalAsNumber();
    expect(itemTotal).toBeGreaterThan(0);

    await checkoutStepTwoPage.completeCheckout();
    await checkoutCompletePage.verifyOrderConfirmation();
  });

  test.describe('Checkout with test data from JSON', () => {
    test('TC011: Invalid checkout data scenarios', async () => {
      await inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);

      for (const invalidData of testData.invalidCheckoutData) {
        await inventoryPage.clickCartIcon();
        await cartPage.clickCheckout();

        await checkoutStepOnePage.fillCheckoutInformation(invalidData.firstName, invalidData.lastName, invalidData.postalCode);
        await checkoutStepOnePage.clickContinue();

        const errorMessage = await checkoutStepOnePage.getErrorMessage();
        expect(errorMessage).toContain(invalidData.expectedError);

        await checkoutStepOnePage.clickCancel();
        await cartPage.clickContinueShopping();
      }
    });
  });
});
