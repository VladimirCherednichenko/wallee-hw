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

