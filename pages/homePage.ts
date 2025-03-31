import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
    // Selectors
    readonly logo: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly menuItems: Locator;
    readonly cartIcon: Locator;
    readonly cartCounter: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize selectors
        this.logo = page.locator('.logo');
        this.searchBox = page.locator('#search');
        this.searchButton = page.locator('button[title="Search"]');
        this.menuItems = page.locator('nav.navigation li.level0');
        this.cartIcon = page.locator('.minicart-wrapper');
        this.cartCounter = page.locator('.counter-number');
    }

    /**
     * Search for a product
     */
    async searchProduct(keyword: string): Promise<void> {
        await this.searchBox.fill(keyword);
        await this.searchButton.click();
        await this.waitForNavigation();
    }

    /**
     * Click on a category in the main menu
     */
    async clickCategory(categoryName: string): Promise<void> {
        await this.menuItems.filter({ hasText: categoryName }).first().click();
        await this.waitForNavigation();
    }


    /**
     * Get the number of items in cart
     */
    async getCartItemCount(): Promise<number> {
        const isCounterVisible = await this.cartCounter.isVisible().catch(() => false);
        if (!isCounterVisible) return 0;
        
        const countText = await this.cartCounter.textContent() || '';
        return countText ? parseInt(countText, 10) : 0;
    }

    async navigateMenuPath(path: string[]): Promise<void> {
        if (!path.length) return;

        for (let i = 0; i < path.length; i++) {
            const isLastItem = i === path.length - 1;
            const currentItem = path[i];

           
            const menuItem = this.page
                .getByRole('menuitem')
                .filter({ hasText: new RegExp(`^${currentItem}$`) }) 
                .first();

            await menuItem.waitFor({ state: 'visible' });

            console.log(`Found menu item: ${await menuItem.textContent()}`);

            if (isLastItem) {
                await menuItem.click();
            } else {
                await menuItem.hover();
            }
        }
    }
 
    
    
}