# E2E Testing Suite

This repository contains end-to-end tests for the checkout process of an e-commerce website using Playwright.

## Test Overview

The test suite focuses on validating the checkout flow with various scenarios:

- Checkout with quick add to cart functionality
- Checkout from product detail page
- Checkout with alternate payment methods (check/money order)

Each test verifies:
- Product selection
- Cart functionality
- Price calculations
- Shipping method selection
- Payment processing
- Order confirmation

## Detailed Project Structure

```
├── models/                          # Domain models and test data
│   ├── constants.ts                 # Application constants, timeouts, URLs
│   └── factories/                   # Data factories using factory pattern
│       ├── BillingFactory.ts        # Creates billing address test data
│       ├── CardFactory.ts           # Generates credit card test data
│       └── ProductFactory.ts        # Provides product catalog test data
│
├── pages/                           # Page Object Models (POM)
│   ├── homePage.ts                  # Home page navigation and menu interactions
│   ├── productListingPage.ts        # Product grid, filtering, and quick-add functionality
│   ├── productPage.ts               # Product details, variants selection, and cart actions
│   ├── checkoutPage.ts              # Checkout form, payment selection, and order summary
│   ├── walleeCheckout.ts            # Wallee payment gateway iframe interactions
│   └── cartComponent.ts             # Shopping cart modal and mini-cart functionality
│
├── tests/                           # Test organization
│   ├── e2e/                         # End-to-end test scenarios
│   │   ├── checkout.spec.ts         # Checkout flow tests with different payment methods
│   │   └── [other test files]       # Other test categories (not shown in sample)
│   └── fixtures/                    # Test fixtures and shared state setup
│       └── [fixture files]          # Authentication, session, and other fixtures
│
├── utils/                           # Utility functions
│   ├── selectors.ts                 # Centralized selector management
│   └── testHelpers.ts               # Common test helper functions
│
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── .env.example                     # Example environment variables
```

### Key Components

#### Page Objects

- **HomePage**: Main entry point with menu navigation methods and search functionality
- **ProductListingPage**: Handles category browsing, filtering, and quick-add-to-cart actions
- **ProductPage**: Manages product details including size/color selection and quantity adjustments
- **CheckoutPage**: Controls multi-step checkout process with shipping/billing/payment sections
- **WalleeCheckout**: Handles third-party payment gateway iframe interactions
- **CartComponent**: Manages cart interactions, product verification and checkout initiation

#### Factories

- **BillingFactory**: Generates randomized but valid billing information for test orders
- **CardFactory**: Creates test credit card data with valid formats for payment testing
- **ProductFactory**: Provides consistent product data including variants and pricing

#### Tests

The tests follow the Page Object Model pattern, creating clean separation between:
- Test logic (assertions, flow control)
- Page interactions (clicking, typing, selecting)
- Test data (products, user info, payment details)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Setup

1. Ensure you have Playwright browsers installed:
   ```bash
   npx playwright install
   ```

2. Configure environment variables (if needed):
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with appropriate values.

## Running Tests

### Run all tests:

```bash
npx playwright test
```

### Run specific test file:

```bash
npx playwright test tests/e2e/checkout.spec.ts
```

### Run tests in headed mode (with browser visible):

```bash
npx playwright test --headed
```

### Run tests with specific browser:

```bash
npx playwright test --project=chromium
```

### Debug tests:

```bash
npx playwright test --debug
```

## Test Reports

Generate an HTML report after test execution:

```bash
npx playwright show-report
```

## Continuous Integration

This test suite is designed to be run in CI environments. Sample configuration for common CI platforms:

### GitHub Actions Example:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```


