import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { Billing } from '../models/models/Billing';
import { Card } from '../models/models/Card';
import { test, expect } from '@playwright/test'; 
import { PAYMENT_METHODS, TIMEOUTS } from '../models/constants';

export class CheckoutPage extends BasePage {
    readonly successPageTitle: Locator;
    readonly orderNumberText: Locator;
    readonly thankYouMessage: Locator;
    readonly createAccountButton: Locator;
    readonly emailAddressDisplay: Locator;

    constructor(page: Page) {
        super(page);
        this.successPageTitle = page.locator('h1.page-title');
        this.orderNumberText = page.locator('.checkout-success p span');
        this.thankYouMessage = page.locator('.checkout-success .thank-you-message');
        this.createAccountButton = page.locator('#registration .action.primary:has(span[data-bind="i18n: \'Create an Account\'"])');
        this.emailAddressDisplay = page.locator('#registration span[data-bind="text: getEmailAddress()"]');
    }

    async fillBillingInformation(billingInfo: Billing): Promise<void> {
        const emailField = this.page.locator('#customer-email');
        await expect(emailField).toBeVisible();
        await this.page.fill('#customer-email', billingInfo.email);
        await this.page.fill('input[name="firstname"]', billingInfo.firstName);
        await this.page.fill('input[name="lastname"]', billingInfo.lastName);
        await this.page.fill('input[name="street[0]"]', billingInfo.address);
        await this.page.fill('input[name="city"]', billingInfo.city);
        await this.page.fill('input[name="postcode"]', billingInfo.zip);
        await this.page.fill('input[name="telephone"]', billingInfo.phone);
        await this.page.selectOption('select[name="country_id"]', { value: billingInfo.country });
        await this.page.selectOption('select[name="region_id"]', { label: 'California' });
        const shippingMethod = this.page.locator(`input[type="radio"][value*="${billingInfo.shippingMethod}"]`);
        await shippingMethod.scrollIntoViewIfNeeded();
        await shippingMethod.click();
    }

    async pressNextButton(): Promise<void> {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async selectCreditCardPayment(cardDetails: Card): Promise<void> {
        const paymentGroup = this.page.getByRole('group', { name: 'Payment Information' });
        await paymentGroup.waitFor({ state: 'visible' });
        await paymentGroup.getByRole('radio', { name: PAYMENT_METHODS.CREDIT_CARD }).check();
        const frame = this.page.frameLocator('iframe[id^="paymentForm_"]').first();
        await frame.locator('input[name="ccnumber"]').waitFor({ state: 'visible' });
        await frame.locator('input[name="ccnumber"]').fill(cardDetails.cardNumber);
        await frame.locator('input[id$="field_expiryDate-month"]').fill(cardDetails.expiryMonth);
        await frame.locator('input[id$="field_expiryDate-year"]').fill(cardDetails.expiryYear);
        await frame.locator('input[id$="field_cardVerificationCode-input"]').fill(cardDetails.cvv);
    }

    async selectCheckMoneyOrderPayment(): Promise<void> {
        const paymentGroup = this.page.getByRole('group', { name: 'Payment Information' });
        await paymentGroup.waitFor({ state: 'visible' });
        await paymentGroup.getByRole('radio', { name: PAYMENT_METHODS.CHECK_MONEY_ORDER }).check();
    }
    
    async placeOrder(): Promise<void> {
            await this.page.getByRole('button', { name: 'Place Order' }).click();
            await this.page.waitForTimeout(5000);
    }

    async verifyOrderConfirmation() {
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        await this.successPageTitle.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.successPageTitle).toContainText('Thank you for your purchase!');
        const orderText = await this.orderNumberText.textContent();
        expect(orderText, 'Order number should be displayed').toBeTruthy();
        const orderNumber = orderText ? orderText.trim() : null;
        return orderNumber;
    }

    async getCartSubtotal(): Promise<string> {
        const subtotalPrice = await this.page.locator('tr.totals.sub td.amount span.price').textContent();
        return subtotalPrice ? subtotalPrice.trim() : '';
    }

    async getShippingCost(): Promise<string> {
        const shippingPrice = await this.page.locator('tr.totals.shipping.excl td.amount span.price').textContent();
        return shippingPrice ? shippingPrice.trim() : '';
    }

    async getShippingMethod(): Promise<string> {
        const methodTitle = await this.page.locator('tr.totals.shipping.excl th.mark span.value').textContent();
        return methodTitle ? methodTitle.trim() : '';
    }

    async getOrderTotal(): Promise<string> {
        const totalText = await this.page.locator('text=Order Total').locator('xpath=../following-sibling::td').textContent();
        return totalText ? totalText.trim() : '';
    }

    async getCheckoutTotalByLabel(label: string): Promise<string> {
        if (label === 'Shipping' || label === 'Shipping & Handling') {
            const shippingRow = this.page.locator('.totals.shipping');

            if (await shippingRow.count() > 0) {
                const amount = await shippingRow.locator('.amount .price').textContent();
                return amount ? amount.trim() : '';
            }
        }

        const totalRow = this.page.locator('.totals')
            .filter({ has: this.page.locator('.label').filter({ hasText: label }) });

        if (await totalRow.count() > 0) {
            const amount = await totalRow.locator('.amount .price').textContent();
            return amount ? amount.trim() : '';
        }

        return '';
    }

    async getGuestEmailFromOrderConfirmation(): Promise<string> {
        await this.emailAddressDisplay.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        const text = await this.emailAddressDisplay.textContent();
        return text || '';
    }
    
    async clickCreateAccountAfterOrder(): Promise<void> {
        await this.createAccountButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await this.createAccountButton.click();
        await this.page.waitForURL(/customer\/account\/create/);
    }
}

