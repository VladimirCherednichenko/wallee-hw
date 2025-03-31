import { test, expect } from '@playwright/test';
import { HeaderComponent } from '../../pages/headerComponent';
import { HomePage } from '../../pages/homePage';

test.describe('Header Navigation Tests', () => {
    let headerComponent: HeaderComponent;

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHome();
        headerComponent = new HeaderComponent(page);
    });

    test('should display main navigation items', async () => {
        expect(await headerComponent.isMainMenuItemVisible('What\'s New')).toBeTruthy();
        expect(await headerComponent.isMainMenuItemVisible('Women')).toBeTruthy();
        expect(await headerComponent.isMainMenuItemVisible('Men')).toBeTruthy();
    });

    test('should navigate to What\'s New page', async () => {
        await headerComponent.navigateTo('What\'s New');
        expect(await headerComponent.getTitle()).toContain('New');
    });

    test('should navigate to Women page', async () => {
        await headerComponent.navigateTo('Women');
        expect(await headerComponent.getTitle()).toContain('Women');
    });

    test('should navigate to Men page', async () => {
        await headerComponent.navigateTo('Men');
        expect(await headerComponent.getTitle()).toContain('Men');
    });

    test('should navigate to Gear page', async () => {
        await headerComponent.navigateTo('Gear');
        expect(await headerComponent.getTitle()).toContain('Gear');
    });

    test('should navigate to Training page', async () => {
        await headerComponent.navigateTo('Training');
        expect(await headerComponent.getTitle()).toContain('Training');
    });

    test('should navigate to Sale page', async () => {
        await headerComponent.navigateTo('Sale');
        expect(await headerComponent.getTitle()).toContain('Sale');
    });
}); 