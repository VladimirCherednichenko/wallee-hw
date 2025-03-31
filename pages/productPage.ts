// pages/productPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
    // Selectors
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly sizeOptions: Locator;
    readonly colorOptions: Locator;
    readonly quantity: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.productTitle = page.locator('.page-title');
        this.productPrice = page.locator('.price-box .price');
        this.addToCartButton = page.locator('#product-addtocart-button');
        this.sizeOptions = page.locator('.swatch-option.text');
        this.colorOptions = page.locator('.swatch-option.color');
        this.quantity = page.locator('#qty');
        this.successMessage = page.locator('[data-ui-id="message-success"]');
    }

    async selectSize(size: string): Promise<void> {
        await this.sizeOptions.filter({ hasText: size }).click();
    }

    async selectColor(color: string): Promise<void> {
        const colorSelector = this.page.locator(`.swatch-option.color[data-option-label="${color}"]`);
        await colorSelector.waitFor({ state: 'visible' });
        await colorSelector.click();
    }

    async setQuantity(qty: number): Promise<void> {
        await this.quantity.fill(qty.toString());
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.successMessage.waitFor({ state: 'visible' });
    }
}