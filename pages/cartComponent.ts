import { Page } from "playwright";
import { BasePage } from "./basePage";
import { expect } from "@playwright/test";
import { TIMEOUTS, WAIT_TIMES } from "../models/constants";

export class CartComponent extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async clickCartIcon(): Promise<void> {
        await this.page.locator('div.header.content').hover();

        const cartIcon = this.page.locator('[data-block="minicart"]');
        await cartIcon.hover();
        await cartIcon.click();
    }

    async clickProceedToCheckout(): Promise<void> {
        await this.page.locator('#top-cart-btn-checkout').click();
    }

    async verifyItemCount(expectedCount: number): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        const cartCounter = this.page.locator('.minicart-wrapper .counter-number');
        await expect(cartCounter, `Cart should display ${expectedCount} item(s)`).toHaveText(
            expectedCount.toString()
        );
    }

    async getSubtotal(): Promise<string> {
        await this.page.waitForSelector('.subtotal .price-wrapper .price');
        const subtotalElement = this.page.locator('.subtotal .price-wrapper .price');
        return await subtotalElement.innerText();
    }

    async verifySubtotal(expectedSubtotal: number): Promise<void> {
        const subtotal = await this.getSubtotal();
        const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
        await expect(subtotalValue, `Cart subtotal should be ${expectedSubtotal}`).toBeCloseTo(expectedSubtotal, 2);
    }

    async getProductPrice(productName: string): Promise<string> {
        const productItem = this.page.locator(`.item.product.product-item:has-text("${productName}")`);
        const priceElement = productItem.locator('.minicart-price .price');
        return await priceElement.innerText();
    }

    async verifyProductPrice(productName: string, expectedPrice: number): Promise<void> {
        const price = await this.getProductPrice(productName);
        const priceValue = parseFloat(price.replace(/[^0-9.]/g, ''));
        await expect(priceValue, `Product price for "${productName}" should be ${expectedPrice}`).toBeCloseTo(expectedPrice, 2);
    }
    
    async clickViewAndEditCart(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        
        const viewCartButton = this.page.locator('.actions a.viewcart, a.action.viewcart');
        const isButtonVisible = await viewCartButton.isVisible().catch(() => false);
        
        if (isButtonVisible) {
            await viewCartButton.click();
            const navigationSuccessful = await this.page.waitForURL('**/checkout/cart/', { timeout: TIMEOUTS.LONG })
                .then(() => true)
                .catch(() => false);
                
            if (navigationSuccessful) return;
        }
        
        await this.page.goto('/checkout/cart/');
        await this.page.waitForLoadState('networkidle');
    }
    
    async updateQuantityMiniCart(productName: string, qty: number): Promise<void> {
        const productItem = this.page.locator(`.item.product.product-item:has-text("${productName}")`);
        const qtyInput = productItem.locator('.item-qty');
        
        await qtyInput.waitFor({ state: 'visible' });
        await qtyInput.fill(qty.toString());
        
        await qtyInput.blur();
        await this.page.waitForTimeout(WAIT_TIMES.SHORT);
        
        const updateButton = productItem.locator('.update-cart-item');
        await updateButton.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        await updateButton.click({ force: true });
        
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(WAIT_TIMES.MEDIUM);
    }
} 