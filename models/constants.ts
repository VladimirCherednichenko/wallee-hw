// Timeouts
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 15000,
  VERY_LONG: 20000,
  EXTRA_LONG: 30000
};

// Waiting times
export const WAIT_TIMES = {
  SHORT: 500,
  MEDIUM: 1000,
  LONG: 5000
};

// Test data
export const TEST_DATA = {
  // Random generation
  EMAIL_RANDOM_MULTIPLIER: 10000,
  ACCOUNT_RANDOM_MULTIPLIER: 100000,
  
  // Default values
  DEFAULT_PASSWORD_LENGTH: 12,
  DEFAULT_ORDER_INDEX: 0,
  
  // Card details
  CARD: {
    NUMBER: '4111 1111 1111 1111',
    EXPIRY_MONTH: '03',
    EXPIRY_YEAR: '28',
    CVV: '123',
    EXPIRY_DATE: '03/28'
  },
  
  // Billing info
  BILLING: {
    ADDRESS: '123 Test Street',
    ZIP: '90210',
    PHONE: '1234567890'
  },
  
  // Product prices
  PRODUCT_PRICES: {
    STANDARD: 45.00,
    PREMIUM: 47.00,
    DELUXE: 74.00
  },
  
  // UI elements
  MAX_PRODUCTS_TO_DISPLAY: 12,
  ITEMS_PER_PAGE: {
    STANDARD: '24',
    LARGE: '36'
  },
  
  // Test thresholds
  THRESHOLDS: {
    DEFAULT_ORDER_THRESHOLD: 0.5,
    LOW_ORDER_THRESHOLD: 0.45,
    DIFFERENCE_THRESHOLD: 0.2,
    STANDARD_DIFFERENCE_THRESHOLD: 0.3,
    MIN_VALID_PERCENTAGE: 70,
    MIN_DIFFERENCE_PERCENTAGE: 30
  },
  
  // Name filtering
  NAME_LENGTH: {
    SHORT: 10,
    LONG: 20
  }
};

// Base URL
export const BASE_URL = 'https://magento-2.showcase-wallee.com';

// Payment methods
export enum PAYMENT_METHODS {
  CREDIT_CARD = 'Credit / Debit Card',
  CHECK_MONEY_ORDER = 'Check / Money order'
}