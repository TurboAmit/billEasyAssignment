export const APP_URLS = {
  BASE: 'https://www.saucedemo.com',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
} as const;

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  NAVIGATION: 15000,
} as const;

export const TEST_USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
  ERROR: {
    username: 'error_user',
    password: 'secret_sauce',
  },
  VISUAL: {
    username: 'visual_user',
    password: 'secret_sauce',
  },
} as const;

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  MISSING_USERNAME: 'Epic sadface: Username is required',
  MISSING_PASSWORD: 'Epic sadface: Password is required',
  MISSING_FIRST_NAME: 'Error: First Name is required',
  MISSING_LAST_NAME: 'Error: Last Name is required',
  MISSING_POSTAL_CODE: 'Error: Postal Code is required',
} as const;

export const SORT_OPTIONS = {
  NAME_ASC: 'az',
  NAME_DESC: 'za',
  PRICE_LOW_HIGH: 'lohi',
  PRICE_HIGH_LOW: 'hilo',
} as const;

export const PRODUCT_NAMES = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  TSHIRT_RED: 'Test.allTheThings() T-Shirt (Red)',
} as const;