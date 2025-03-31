import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly removeItemButton: Locator;
    readonly updateCartButton: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly emptyCartMessage: Locator;
    readonly cartTotal: Locator;
    readonly qtyInputs: Locator;
    readonly viewAndEditCartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.locator('.cart.item');
        this.removeItemButton = page.locator('.action-delete');
        this.updateCartButton = page.locator('button.update');
        this.proceedToCheckoutButton = page.locator('button[data-role="proceed-to-checkout"]');
        this.emptyCartMessage = page.locator('.cart-empty');
        this.cartTotal = page.locator('.grand.totals .price');
        this.qtyInputs = page.locator('.cart.item .input-text.qty');
        this.viewAndEditCartLink = page.locator('a.action.viewcart');
    }

    async navigateToCart(): Promise<void> {
        await this.goto('/checkout/cart/');
    }

    async removeItem(index: number): Promise<void> {
        await this.removeItemButton.nth(index).click();
        await this.page.waitForLoadState('networkidle');
    }

    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        await this.page.waitForNavigation();
    }

    async updateQuantity(index: number, quantity: number): Promise<void> {
        // Get the input field and ensure it's visible
        const qtyInput = this.qtyInputs.nth(index);
        await qtyInput.waitFor({ state: 'visible' });
        
        // Clear and set new quantity
        await qtyInput.clear();
        await qtyInput.fill(quantity.toString());
        await qtyInput.blur();
        
        // Wait for update button and click
        await this.updateCartButton.waitFor({ state: 'visible' });
        await this.updateCartButton.click();
        
        // Wait for the update to be processed
        await this.page.waitForLoadState('networkidle');
        
        // Verify the quantity was updated correctly
        await this.page.waitForTimeout(1000); // Additional wait for UI update
        
        // Verify the value was actually set
        const updatedValue = await qtyInput.inputValue();
        if (updatedValue !== quantity.toString()) {
            // Try again if needed
            await qtyInput.clear();
            await qtyInput.fill(quantity.toString());
            await qtyInput.blur();
            await this.updateCartButton.click();
            await this.page.waitForLoadState('networkidle');
        }
    }

    async getItemCount(): Promise<number> {
        await this.page.waitForLoadState('networkidle');
        return await this.cartItems.count();
    }
}