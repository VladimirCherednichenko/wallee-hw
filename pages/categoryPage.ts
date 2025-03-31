// pages/categoryPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CategoryPage extends BasePage {
    readonly categoryTitle: Locator;
    readonly productItems: Locator;
    readonly sortDropdown: Locator;
    readonly filterOptions: Locator;

    constructor(page: Page) {
        super(page);
        this.categoryTitle = page.locator('.page-title');
        this.productItems = page.locator('.product-item');
        this.sortDropdown = page.locator('#sorter');
        this.filterOptions = page.locator('.filter-options');
    }

    async clickProduct(index: number): Promise<void> {
        await this.productItems.nth(index).click();
        await this.waitForNavigation();
    }

    async sortBy(option: string): Promise<void> {
        await this.sortDropdown.selectOption(option);
        await this.waitForNavigation();
    }
}