import { Page, Locator } from "playwright";
import { BasePage } from "./basePage";
import { expect } from "@playwright/test";

export type SortOption = 'position' | 'name' | 'price';
export type SortDirection = 'asc' | 'desc';
export type Category = 'women-tops' | 'men-tops' | 'gear-bags' | 'gear-fitness';

export interface ProductInfo {
    name: string;
    price: number;
}

export class ProductListingPage extends BasePage {
    
    constructor(page: Page) {
        super(page);
    }

    readonly sortSelect = () => this.page.locator('#sorter');
    readonly sortDirectionButton = () => this.page.locator('.action.sorter-action');
    readonly productItems = () => this.page.locator('.product-item-info');
    readonly productNames = () => this.page.locator('.product-item-link');
    readonly productPrices = () => this.page.locator('.price-wrapper .price');
    readonly itemsPerPage = () => this.page.locator('#limiter');

    async quickAddToCart(productName: string, size: string, color: string): Promise<void> {
        const productContainer = this.page.locator(`div.product-item-info:has-text("${productName}")`);
        await productContainer.waitFor({ state: 'visible' });
        await productContainer.hover();

        const sizeContainer = productContainer.locator('div.swatch-attribute.size');
        await sizeContainer.waitFor({ state: 'visible' });
        await sizeContainer.hover();

        await sizeContainer.getByText(size).click();

        const colorContainer = productContainer.locator('div.swatch-attribute.color');
        await colorContainer.waitFor({ state: 'visible' });
        await colorContainer.hover();

        await colorContainer.locator(`div.swatch-option[data-option-label="${color}"]`).click();
        await productContainer.getByRole('button', { name: /add to cart/i }).click();
        await this.page.waitForSelector('.message-success', { state: 'visible', timeout: 10000 });
    }

    async navigateToProductDetails(productName: string): Promise<void> {
        const productLink = this.page.locator(`a.product-item-link:has-text("${productName}")`);
        await productLink.waitFor({ state: 'visible' });
        await productLink.click();
        await this.page.waitForLoadState('networkidle');
        
        const productTitle = this.page.locator('.page-title .base');
        await expect(productTitle).toContainText(productName);
    }

    async navigateToCategory(category: Category): Promise<void> {
        const categoryPaths: Record<Category, string> = {
            'women-tops': '/women/tops-women.html',
            'men-tops': '/men/tops-men.html',
            'gear-bags': '/gear/bags.html',
            'gear-fitness': '/gear/fitness-equipment.html'
        };

        const path = categoryPaths[category];
        await this.goto(path);
        await this.waitForNavigation();
    }

    async setItemsPerPage(count: string): Promise<void> {
        const limiter = this.itemsPerPage();
        if (await limiter.isVisible()) {
            await limiter.selectOption(count);
            await this.waitForNavigation();
        }
    }

    async sortBy(option: SortOption): Promise<void> {
        await this.sortSelect().waitFor({ state: 'visible' });
        await this.sortSelect().selectOption(option);
        await this.waitForNavigation();
    }

    async setSortDirection(direction: SortDirection): Promise<void> {
        await this.sortDirectionButton().waitFor({ state: 'visible' });
        const currentDirection = await this.getCurrentSortDirection();
        if (currentDirection !== direction) {
            await this.sortDirectionButton().click();
            await this.waitForNavigation();
        }
    }

    async getCurrentSortDirection(): Promise<SortDirection> {
        const button = this.sortDirectionButton();
        await button.waitFor({ state: 'visible' });
        const classAttribute = await button.getAttribute('class') || '';
        return classAttribute.includes('sort-asc') ? 'asc' : 'desc';
    }

    async getVisibleProducts(): Promise<ProductInfo[]> {
        await this.productItems().first().waitFor({ state: 'visible' });
        
        const visibleItems = await this.productItems().all();
        const products: ProductInfo[] = [];
        
        const maxProducts = Math.min(12, visibleItems.length);
        
        for (let i = 0; i < maxProducts; i++) {
            const item = visibleItems[i];
            const nameElement = await item.locator('.product-item-link').first();
            const priceElement = await item.locator('.price-wrapper .price').first();
            
            const name = await nameElement.textContent() || '';
            const priceText = await priceElement.textContent() || '';
            
            products.push({
                name: name.trim(),
                price: this.extractPrice(priceText)
            });
        }
        
        return products;
    }

    private extractPrice(priceText: string): number {
        const match = priceText.match(/[\d,.]+/);
        if (match) {
            return parseFloat(match[0].replace(/,/g, ''));
        }
        return 0;
    }
    
}