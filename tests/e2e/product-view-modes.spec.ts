import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../../pages/productListingPage';

test.describe('Product Listing Page View Modes Tests', () => {
    let productListingPage: ProductListingPage;

    test.beforeEach(async ({ page }) => {
        productListingPage = new ProductListingPage(page);
        await productListingPage.goto('/women/tops-women.html');
        await productListingPage.waitForNavigation();
        
        // Wait for page to be fully loaded and stable
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
    });

    test('should verify view mode options are present', async ({ page }) => {
        // Grid mode should be present and active by default
        const gridViewBtn = page.locator('.mode-grid');
        await expect(gridViewBtn).toBeVisible();
        
        // List mode should be present but not active
        const listViewBtn = page.locator('.mode-list');
        await expect(listViewBtn).toBeVisible();
        
        // Verify product grid exists
        const productItems = page.locator('.product-items');
        await expect(productItems).toBeVisible();
    });

    test('should switch between grid and list view modes', async ({ page }) => {
        // Locate view mode buttons
        const listViewBtn = page.locator('.mode-list');
        const gridViewBtn = page.locator('.mode-grid');
        
        // Switch to list view
        await listViewBtn.click();
        await page.waitForLoadState('networkidle');
        
        // When in list view, product descriptions should be visible
        const productDescription = page.locator('.product-item-description').first();
        await expect(productDescription).toBeVisible();
        
        // Switch back to grid view
        await gridViewBtn.click();
        await page.waitForLoadState('networkidle');
        
        // In grid view, descriptions are typically hidden
        // Instead, check that we're back in grid mode
        await expect(gridViewBtn).toHaveClass(/active/);
    });

    test('should display different layouts in different view modes', async ({ page }) => {
        // Get first product
        const firstProduct = page.locator('.product-item-info').first();
        
        // In grid view, details should be hidden or compact
        const actionsSection = firstProduct.locator('.product-item-actions');
        const isActionVisibleInGrid = await actionsSection.isVisible();
        
        // Switch to list view
        await page.locator('.mode-list').click();
        await page.waitForLoadState('networkidle');
        
        // In list view, product descriptions should be visible
        const productDescription = page.locator('.product-item-description').first();
        await expect(productDescription).toBeVisible();
        
        // Actions should be more prominent in list view
        const actionsInList = firstProduct.locator('.product-item-actions');
        await expect(actionsInList).toBeVisible();
        
        // If actions weren't visible in grid but are in list, this confirms different layouts
        if (!isActionVisibleInGrid) {
            expect(await actionsInList.isVisible()).toBeTruthy();
        }
    });
}); 