import { test, expect } from '@playwright/test';
import { AccountPage } from '../../pages/accountPage';
import { HomePage } from '../../pages/homePage';
import { ProductListingPage } from '../../pages/productListingPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { BillingFactory } from '../../models/factories/BillingFactory';
import { CardFactory } from '../../models/factories/CardFactory';
import { WalleeCheckout } from '../../pages/walleeCheckout';
import { ProductFactory } from '../../models/factories/ProductFactory';
import { CartComponent } from '../../pages/cartComponent';
import { UserFactory } from '../../models/factories/UserFactory';
import { AccountFactory } from '../../models/factories/AccountFactory';
import { BASE_URL, TIMEOUTS, PAYMENT_METHODS } from '../../models/constants';
import { ProductPage } from '../../pages/productPage';

const testUser = UserFactory.createFixed();

test.describe('Account Tests', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHome();
    });
    
    test('should create new user account', async ({ page }) => {
        const accountPage = new AccountPage(page);
        const accountInfo = AccountFactory.createFromUser(testUser);
        await accountPage.registerAccount(accountInfo);
        await expect(accountPage.successMessage, 'Success message should be visible').toBeVisible();
        await expect(accountPage.successMessage).toContainText('Thank you for registering');
        const isLoggedIn = await accountPage.verifyLoggedIn();
        expect(isLoggedIn, 'User should be logged in after registration').toBeTruthy();
        
        await accountPage.logout();
    });
    
    test('should login with created account', async ({ page }) => {
        const accountPage = new AccountPage(page);
        
        const accountInfo = AccountFactory.createFromUser(testUser);
        await accountPage.registerAccount(accountInfo);
        
        if (await accountPage.verifyLoggedIn()) {
            await accountPage.logout();
        }
        
        await accountPage.navigateToLogin();
        await accountPage.login(testUser.email, testUser.password);
        
        const isLoggedIn = await accountPage.verifyLoggedIn();
        expect(isLoggedIn, 'User should be logged in').toBeTruthy();
    });
    
    test('should change account password', async ({ page }) => {
        const accountPage = new AccountPage(page);
        const newPassword = 'UpdatedPass123!@#';
        
        const accountInfo = AccountFactory.createFromUser(testUser);
        await accountPage.registerAccount(accountInfo);
        
        if (await accountPage.verifyLoggedIn()) {
            await accountPage.logout();
        }
        
        await accountPage.navigateToLogin();
        await accountPage.login(testUser.email, testUser.password);
        
        await accountPage.changePassword(testUser.password, newPassword);
        
        await accountPage.logout();
        
        await accountPage.login(testUser.email, newPassword);
        const isLoggedInWithNewPassword = await accountPage.verifyLoggedIn();
        expect(isLoggedInWithNewPassword, 'User should be able to login with new password').toBeTruthy();
        
        await accountPage.changePassword(newPassword, testUser.password);
        await accountPage.logout();
    });
    
    test('should complete checkout when logged in', async ({ page }) => {
        const accountPage = new AccountPage(page);
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const cartComponent = new CartComponent(page);
        const checkoutPage = new CheckoutPage(page);
        const walleeCheckout = new WalleeCheckout(page);
        const billingInformation = BillingFactory.create();
        
        const accountInfo = AccountFactory.createFromUser(testUser);
        await accountPage.registerAccount(accountInfo);
        
        if (await accountPage.verifyLoggedIn()) {
            await accountPage.logout();
        }
        
        await accountPage.navigateToLogin();
        await accountPage.login(testUser.email, testUser.password);
        
        const isLoggedIn = await accountPage.verifyLoggedIn();
        expect(isLoggedIn, 'User should be logged in').toBeTruthy();
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = ProductFactory.getByNameAndOptions(productName, productSize, productColor);
        expect(testProduct, 'Test product data should exist').toBeTruthy();
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        await productListingPage.quickAddToCart(productName, productSize, productColor);
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct!.price);
        await cartComponent.verifyProductPrice(productName, testProduct!.price);
        await cartComponent.clickProceedToCheckout();
        
        const emailField = page.locator('#customer-email');
        const emailValue = await emailField.isVisible() ? await emailField.inputValue() : testUser.email;
        expect(emailValue).toBe(testUser.email);
        
        await checkoutPage.fillBillingInformation(billingInformation);
        await checkoutPage.pressNextButton();
        
        const subtotal = await checkoutPage.getCartSubtotal();
        const shipping = await checkoutPage.getShippingCost();
        const shippingMethod = await checkoutPage.getShippingMethod();
        const orderTotal = await checkoutPage.getOrderTotal();
        
        const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
        const shippingValue = parseFloat(shipping.replace(/[^0-9.]/g, ''));
        const orderTotalValue = parseFloat(orderTotal.replace(/[^0-9.]/g, ''));
        
        expect(subtotalValue, 'Cart subtotal should match product price').toBeCloseTo(testProduct!.price, 2);
        expect(shippingValue, 'Shipping cost should be a valid number').toBeGreaterThan(0);
        expect(shippingMethod, 'Shipping method should be "Flat Rate - Fixed"').toContain('Flat Rate - Fixed');
        expect(orderTotalValue, 'Order total should be a valid number').toBeGreaterThan(0);
        
        const calculatedTotal = testProduct!.price + shippingValue;
        expect(orderTotalValue, 'Order total should equal product price + shipping').toBeCloseTo(calculatedTotal, 2);
        
        await checkoutPage.selectCheckMoneyOrderPayment();
        await checkoutPage.placeOrder();
        
        const orderNumber = await checkoutPage.verifyOrderConfirmation();
        expect(orderNumber, 'Order number should be displayed').toBeTruthy();
        
        const isStillLoggedIn = await accountPage.verifyLoggedIn();
        expect(isStillLoggedIn, 'User should still be logged in after checkout').toBeTruthy();
    });
    
    test('should create account after order completion', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productPage = new ProductPage(page);
        const cartComponent = new CartComponent(page);
        const checkoutPage = new CheckoutPage(page);
        const accountPage = new AccountPage(page);
        
        const billingInformation = BillingFactory.create();
        const guestEmail = `guest_${Math.floor(Math.random() * 100000)}@example.com`;
        billingInformation.email = guestEmail;
        
        const productName = 'Proteus Fitness Jackshirt';
        const productSize = 'XS';
        const productColor = 'Blue';
        const testProduct = ProductFactory.getByNameAndOptions(productName, productSize, productColor);
        expect(testProduct, 'Test product data should exist').toBeTruthy();
        
        await homePage.navigateMenuPath(['Men', 'Tops', 'Jackets']);
        
        await productListingPage.navigateToProductDetails(productName);
        
        await productPage.selectSize(productSize);
        await productPage.selectColor(productColor);
        await productPage.addToCart();
        
        await cartComponent.clickCartIcon();
        
        await cartComponent.verifyItemCount(1);
        await cartComponent.verifySubtotal(testProduct!.price);
        await cartComponent.verifyProductPrice(productName, testProduct!.price);
        await cartComponent.clickProceedToCheckout();
        
        await checkoutPage.fillBillingInformation(billingInformation);
        await checkoutPage.pressNextButton();
        
        await checkoutPage.selectCheckMoneyOrderPayment();
        await checkoutPage.placeOrder();
        
        const orderNumber = await checkoutPage.verifyOrderConfirmation();
        expect(orderNumber, 'Order number should be displayed').toBeTruthy();
        
        const displayedEmail = await checkoutPage.getGuestEmailFromOrderConfirmation();
        expect(displayedEmail).toBe(guestEmail);
        
        await checkoutPage.clickCreateAccountAfterOrder();
        
        const accountInfo = {
            firstName: 'Guest',
            lastName: 'User',
            password: 'GuestPass123!'
        };
        
        await accountPage.completePostOrderRegistration(
            accountInfo.firstName,
            accountInfo.lastName,
            accountInfo.password
        );
        
        const isLoggedIn = await accountPage.verifyLoggedIn();
        expect(isLoggedIn, 'User should be logged in after registration').toBeTruthy();
        
        await accountPage.navigateToMyOrders();
        const orderCount = await accountPage.getOrderCount();
        expect(orderCount, 'Order should be visible in customer account').toBeGreaterThan(0);
        
        await accountPage.logout();
    });
}); 