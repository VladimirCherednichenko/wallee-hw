import { test, expect } from '@playwright/test';
import { ProductListingPage, ProductInfo } from '../../pages/productListingPage';

test.describe('Product Listing Page Sorting Tests', () => {
    let productListingPage: ProductListingPage;

    test.beforeEach(async ({ page }) => {
        productListingPage = new ProductListingPage(page);
        await productListingPage.goto('/women/tops-women.html');
        await productListingPage.waitForNavigation();
        
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
    });

    test('should sort products by Product Name in ascending order', async () => {
        await productListingPage.sortBy('name');
        await productListingPage.setSortDirection('asc');
        
        const products = await productListingPage.getVisibleProducts();
        expect(products.length).toBeGreaterThan(1);
        verifyNameSorting(products, 'asc');
    });

    test('should sort products by Product Name in descending order', async () => {
        await productListingPage.sortBy('name');
        await productListingPage.setSortDirection('desc');
        
        const products = await productListingPage.getVisibleProducts();
        expect(products.length).toBeGreaterThan(1);
        verifyNameSorting(products, 'desc');
    });

    test('should sort products by Price in ascending order', async () => {
        await productListingPage.sortBy('price');
        await productListingPage.setSortDirection('asc');
        
        const products = await productListingPage.getVisibleProducts();
        expect(products.length).toBeGreaterThan(1);
        verifyPriceSorting(products, 'asc');
    });

    test('should sort products by Price in descending order', async () => {
        await productListingPage.sortBy('price');
        await productListingPage.setSortDirection('desc');
        
        const products = await productListingPage.getVisibleProducts();
        expect(products.length).toBeGreaterThan(1);
        verifyPriceSorting(products, 'desc');
    });

    test('should verify sort dropdown contains expected options', async () => {
        const sortSelect = productListingPage.sortSelect();
        
        await expect(sortSelect.locator('option[value="position"]')).toHaveText('Position');
        await expect(sortSelect.locator('option[value="name"]')).toHaveText('Product Name');
        await expect(sortSelect.locator('option[value="price"]')).toHaveText('Price');
    });

    test('should change sort direction from ascending to descending', async () => {
        await productListingPage.setSortDirection('asc');
        expect(await productListingPage.getCurrentSortDirection()).toBe('asc');
        
        await productListingPage.setSortDirection('desc');
        expect(await productListingPage.getCurrentSortDirection()).toBe('desc');
    });
});

function verifyNameSorting(products: ProductInfo[], direction: 'asc' | 'desc'): void {
    let isSorted = true;
    const errors: string[] = [];
    
    for (let i = 0; i < products.length - 1; i++) {
        const current = products[i];
        const next = products[i + 1];
        
        const comparison = direction === 'asc' 
            ? current.name.localeCompare(next.name) <= 0
            : current.name.localeCompare(next.name) >= 0;
            
        if (!comparison) {
            isSorted = false;
            errors.push(`Name sorting error at index ${i}: "${current.name}" should be ${direction === 'asc' ? '<=' : '>='} "${next.name}"`);
        }
    }
    
    expect(isSorted, errors.join('\n')).toBeTruthy();
}

function verifyPriceSorting(products: ProductInfo[], direction: 'asc' | 'desc'): void {
    let isSorted = true;
    const errors: string[] = [];
    
    for (let i = 0; i < products.length - 1; i++) {
        const current = products[i];
        const next = products[i + 1];
        
        const comparison = direction === 'asc' 
            ? current.price <= next.price
            : current.price >= next.price;
            
        if (!comparison) {
            isSorted = false;
            errors.push(`Price sorting error at index ${i}: ${current.name} (${current.price}) should be ${direction === 'asc' ? '<=' : '>='} ${next.name} (${next.price})`);
        }
    }
    
    expect(isSorted, errors.join('\n')).toBeTruthy();
} 