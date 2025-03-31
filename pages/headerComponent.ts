import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HeaderComponent extends BasePage {
    readonly navigation: Locator;
    readonly mainMenuItems: Locator;

    constructor(page: Page) {
        super(page);
        this.navigation = page.locator('nav.navigation');
        this.mainMenuItems = page.locator('nav.navigation li.level0');
    }

    async navigateTo(menuText: string): Promise<void> {
        const menuItem = this.page.locator('nav.navigation').getByText(menuText, { exact: true });
        await menuItem.click();
        await this.waitForNavigation();
    }

    async hoverMenuItem(menuText: string): Promise<void> {
        const menuItem = this.page.locator('nav.navigation').getByText(menuText, { exact: true });
        await menuItem.hover();
    }

    async clickSubmenuItem(text: string): Promise<void> {
        const submenuItem = this.page.locator('.submenu').getByText(text, { exact: true });
        await submenuItem.click();
        await this.waitForNavigation();
    }

    async navigateToSubmenuItem(mainMenu: string, submenuItem: string): Promise<void> {
        await this.hoverMenuItem(mainMenu);
        await this.clickSubmenuItem(submenuItem);
    }

    async getMainMenuItems(): Promise<string[]> {
        return await this.mainMenuItems.allTextContents();
    }

    async isMainMenuItemVisible(menuText: string): Promise<boolean> {
        const item = this.navigation.getByText(menuText, { exact: true });
        return await this.isVisible(item);
    }
} 