import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { ProductListingPage } from '../../pages/productListingPage'; 
import { ProductPage } from '../../pages/productPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { BillingFactory } from '../../models/factories/BillingFactory';
import { CardFactory } from '../../models/factories/CardFactory';
import { WalleeCheckout } from '../../pages/walleeCheckout';
import { ProductFactory } from '../../models/factories/ProductFactory';
import { CartComponent } from '../../pages/cartComponent';
import { TIMEOUTS } from '../../models/constants';

test.describe('Checkout Tests', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHome();
    });
    
    test('should complete checkout process with quick add to cart', async ({ page }) => {
        const homePage = new HomePage(page);
        const checkoutPage = new CheckoutPage(page);
        const walleeCheckout = new WalleeCheckout(page);
        const billingInformation = BillingFactory.create();
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = ProductFactory.getByNameAndOptions(productName, productSize, productColor);
        expect(testProduct, 'Test product data should exist').toBeTruthy();
        
        if (!testProduct) {
            throw new Error(`Product data not found for ${productName} in size ${productSize} and color ${productColor}`);
        }
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct.price);
        await cartComponent.verifyProductPrice(productName, testProduct.price);
        await cartComponent.clickProceedToCheckout();
        await checkoutPage.fillBillingInformation(billingInformation);
        await checkoutPage.pressNextButton();
        await checkoutPage.selectCreditCardPayment(CardFactory.create());
        
        const subtotal = await checkoutPage.getCartSubtotal();
        const shipping = await checkoutPage.getShippingCost();
        const shippingMethod = await checkoutPage.getShippingMethod();
        const orderTotal = await checkoutPage.getOrderTotal();

        const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
        const shippingValue = parseFloat(shipping.replace(/[^0-9.]/g, ''));
        const orderTotalValue = parseFloat(orderTotal.replace(/[^0-9.]/g, ''));

        expect(subtotalValue, 'Cart subtotal should match product price').toBeCloseTo(testProduct.price, 2);
        expect(shippingValue, 'Shipping cost should be a valid number').toBeGreaterThan(0);
        expect(shippingMethod, 'Shipping method should be "Flat Rate - Fixed"').toContain('Flat Rate - Fixed');
        expect(orderTotalValue, 'Order total should be a valid number').toBeGreaterThan(0);
        
        const calculatedTotal = testProduct.price + shippingValue;
        expect(orderTotalValue, 'Order total should equal product price + shipping').toBeCloseTo(calculatedTotal, 2);

        await checkoutPage.placeOrder();
        await walleeCheckout.fillCreditCardDetails(CardFactory.create());
        await walleeCheckout.pressPayButton();

        const orderNumber = await checkoutPage.verifyOrderConfirmation();
        expect(orderNumber, 'Order number should be displayed').toBeTruthy();
    });
    
    test('should complete checkout from product detail page', async ({ page }) => {
        const homePage = new HomePage(page);
        const checkoutPage = new CheckoutPage(page);
        const walleeCheckout = new WalleeCheckout(page);
        const billingInformation = BillingFactory.create();
        const productListingPage = new ProductListingPage(page);
        const productPage = new ProductPage(page);
        const cartComponent = new CartComponent(page);
        
        const productName = 'Marco Lightweight Active Hoodie';
        const productSize = 'XS';
        const productColor = 'Blue';
        
        const testProduct = ProductFactory.getByNameAndOptions(productName, productSize, productColor);
        expect(testProduct, 'Test product data should exist').toBeTruthy();
        
        if (!testProduct) {
            throw new Error(`Product data not found for ${productName} in size ${productSize} and color ${productColor}`);
        }
        
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
        await cartComponent.clickProceedToCheckout();
        
        await checkoutPage.fillBillingInformation(billingInformation);
        await checkoutPage.pressNextButton();
        await checkoutPage.selectCreditCardPayment(CardFactory.create());

        const subtotal = await checkoutPage.getCartSubtotal();
        const shipping = await checkoutPage.getShippingCost();
        const shippingMethod = await checkoutPage.getShippingMethod();
        const orderTotal = await checkoutPage.getOrderTotal();

        const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
        const shippingValue = parseFloat(shipping.replace(/[^0-9.]/g, ''));
        const orderTotalValue = parseFloat(orderTotal.replace(/[^0-9.]/g, ''));

        expect(subtotalValue, 'Cart subtotal should match product price').toBeCloseTo(testProduct.price, 2);
        expect(shippingValue, 'Shipping cost should be a valid number').toBeGreaterThan(0);
        expect(shippingMethod, 'Shipping method should be "Flat Rate - Fixed"').toContain('Flat Rate - Fixed');
        expect(orderTotalValue, 'Order total should be a valid number').toBeGreaterThan(0);
        
        const calculatedTotal = testProduct.price + shippingValue;
        expect(orderTotalValue, 'Order total should equal product price + shipping').toBeCloseTo(calculatedTotal, 2);

        await checkoutPage.placeOrder();
        await walleeCheckout.fillCreditCardDetails(CardFactory.create());
        await walleeCheckout.pressPayButton();

        const orderNumber = await checkoutPage.verifyOrderConfirmation();
        expect(orderNumber, 'Order number should be displayed').toBeTruthy();
    });
    
    test('should complete checkout with check/money order payment', async ({ page }) => {
        const homePage = new HomePage(page);
        const checkoutPage = new CheckoutPage(page);
        const billingInformation = BillingFactory.create();
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = ProductFactory.getByNameAndOptions(productName, productSize, productColor);
        expect(testProduct, 'Test product data should exist').toBeTruthy();
        
        if (!testProduct) {
            throw new Error(`Product data not found for ${productName} in size ${productSize} and color ${productColor}`);
        }
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct.price);
        await cartComponent.verifyProductPrice(productName, testProduct.price);
        await cartComponent.clickProceedToCheckout();
        
        await checkoutPage.fillBillingInformation(billingInformation);
        await checkoutPage.pressNextButton();
        await checkoutPage.selectCheckMoneyOrderPayment();
        
        const subtotal = await checkoutPage.getCartSubtotal();
        const shipping = await checkoutPage.getShippingCost();
        const shippingMethod = await checkoutPage.getShippingMethod();
        const orderTotal = await checkoutPage.getOrderTotal();

        const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
        const shippingValue = parseFloat(shipping.replace(/[^0-9.]/g, ''));
        const orderTotalValue = parseFloat(orderTotal.replace(/[^0-9.]/g, ''));

        expect(subtotalValue, 'Cart subtotal should match product price').toBeCloseTo(testProduct.price, 2);
        expect(shippingValue, 'Shipping cost should be a valid number').toBeGreaterThan(0);
        expect(shippingMethod, 'Shipping method should be "Flat Rate - Fixed"').toContain('Flat Rate - Fixed');
        expect(orderTotalValue, 'Order total should be a valid number').toBeGreaterThan(0);
        
        const calculatedTotal = testProduct.price + shippingValue;
        expect(orderTotalValue, 'Order total should equal product price + shipping').toBeCloseTo(calculatedTotal, 2);

        await checkoutPage.placeOrder();
        
        const orderNumber = await checkoutPage.verifyOrderConfirmation();
        expect(orderNumber, 'Order number should be displayed').toBeTruthy();
    });
}); 