import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { ProductListingPage } from '../../pages/productListingPage';
import { ProductPage } from '../../pages/productPage';
import { CartComponent } from '../../pages/cartComponent';
import { CartPage } from '../../pages/cartPage';
import { ProductFactory } from '../../models/factories/ProductFactory';

test.describe('Cart Tests', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHome();
    });

    const getTestProduct = (name: string, size: string, color: string) => {
        const product = ProductFactory.getByNameAndOptions(name, size, color);
        expect(product).toBeTruthy();
        if (!product) {
            throw new Error(`Product data not found for ${name} in size ${size} and color ${color}`);
        }
        return product;
    };

    test('should add product to cart from product listing page', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = getTestProduct(productName, productSize, productColor);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct.price);
        await cartComponent.verifyProductPrice(productName, testProduct.price);
    });

    test('should add product to cart from product detail page', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productPage = new ProductPage(page);
        const cartComponent = new CartComponent(page);
        
        const productName = 'Marco Lightweight Active Hoodie';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = getTestProduct(productName, productSize, productColor);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Hoodies & Sweatshirts']);
        await productListingPage.navigateToProductDetails(productName);
        
        await productPage.selectSize(productSize);
        await productPage.selectColor(productColor);
        await productPage.setQuantity(1);
        await productPage.addToCart();
        
        await cartComponent.clickCartIcon();
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct.price);
        await cartComponent.verifyProductPrice(productName, testProduct.price);
    });

    test('should update product quantity in mini cart', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = getTestProduct(productName, productSize, productColor);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct.price);
        
        const newQuantity = 2;
        await cartComponent.updateQuantityMiniCart(productName, newQuantity);
        
        await cartComponent.verifyItemCount(newQuantity);
        await cartComponent.verifySubtotal(testProduct.price * newQuantity);
    });
    
    test('should navigate to view and edit cart page', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        const cartPage = new CartPage(page);
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = getTestProduct(productName, productSize, productColor);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await page.waitForLoadState('networkidle');
        await cartComponent.clickViewAndEditCart();
        
        await page.waitForLoadState('networkidle');
        const itemCount = await cartPage.getItemCount();
        expect(itemCount).toBe(1);
    });
    
    test('should update quantity in cart page', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        const cartPage = new CartPage(page);
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = getTestProduct(productName, productSize, productColor);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await page.waitForLoadState('networkidle');
        await cartComponent.clickViewAndEditCart();
        
        await page.waitForLoadState('networkidle');
        const newQuantity = 3;
        await cartPage.updateQuantity(0, newQuantity);
        
        await page.waitForLoadState('networkidle');
        const itemCount = await cartPage.getItemCount();
        expect(itemCount).toBe(1);
        
        const total = await cartPage.cartTotal.innerText();
        const totalValue = parseFloat(total.replace(/[^0-9.]/g, ''));
        const expectedTotal = testProduct.price * newQuantity;
        expect(totalValue).toBeCloseTo(expectedTotal, 2);
    });
    
    test('should add multiple products to cart', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        
        const firstProduct = {
            name: 'Proteus Fitness Jackshirt',
            size: 'XS',
            color: 'Blue'
        };
        
        const secondProduct = {
            name: 'Marco Lightweight Active Hoodie',
            size: 'XS',
            color: 'Blue'
        };
        
        const testProduct1 = getTestProduct(firstProduct.name, firstProduct.size, firstProduct.color);
        const testProduct2 = getTestProduct(secondProduct.name, secondProduct.size, secondProduct.color);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(firstProduct.name, firstProduct.size, firstProduct.color);
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Hoodies & Sweatshirts']);
        await productListingPage.quickAddToCart(secondProduct.name, secondProduct.size, secondProduct.color);
        
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(2);
        const expectedSubtotal = testProduct1.price + testProduct2.price;
        await cartComponent.verifySubtotal(expectedSubtotal);
        await cartComponent.verifyProductPrice(firstProduct.name, testProduct1.price);
        await cartComponent.verifyProductPrice(secondProduct.name, testProduct2.price);
    });
}); 