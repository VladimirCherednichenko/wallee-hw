import { Page, Locator, expect } from '@playwright/test';
import { BASE_URL, TIMEOUTS } from '../models/constants';

export class BasePage {
    readonly page: Page;
    readonly baseUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = BASE_URL;
    }

    async navigateToHome(): Promise<void> {
        await this.page.goto(this.baseUrl);
    }

    async waitForNavigation(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async isVisible(locator: Locator): Promise<boolean> {
        return locator.isVisible({ timeout: TIMEOUTS.SHORT })
            .then(() => true)
            .catch(() => false);
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async goto(path: string): Promise<void> {
        await this.page.goto(`${this.baseUrl}${path}`);
    }

    /**
    * Take screenshot
    * @param name - Screenshot name
    */
    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `./screenshots/${name}.png` });
    }
}