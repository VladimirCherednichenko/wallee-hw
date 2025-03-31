import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { expect } from '@playwright/test';
import { Account } from '../models/models/Account';
import { TIMEOUTS, WAIT_TIMES, TEST_DATA } from '../models/constants';

export class AccountPage extends BasePage {
    readonly loginEmailField: Locator;
    readonly loginPasswordField: Locator;
    readonly loginButton: Locator;
    readonly registerLink: Locator;
    readonly successMessage: Locator;
    readonly accountInfoSection: Locator;
    readonly errorMessage: Locator;
    readonly myOrdersLink: Locator;
    readonly orderItems: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly passwordField: Locator;
    readonly confirmPasswordField: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.loginEmailField = page.locator('#email');
        this.loginPasswordField = page.locator('#pass');
        this.loginButton = page.locator('#send2');
        this.registerLink = page.locator('a[href*="customer/account/create"]');
        this.successMessage = page.locator('div.message-success, div.success.message, div.messages div.success');
        this.accountInfoSection = page.locator('.box-information');
        this.errorMessage = page.locator('div.message-error');
        this.myOrdersLink = page.locator('.nav.item a[href*="/sales/order/history/"]');
        this.orderItems = page.locator('table:has(caption:text("Orders")) tbody tr');
        this.firstNameField = page.locator('#firstname');
        this.lastNameField = page.locator('#lastname');
        this.passwordField = page.locator('#password');
        this.confirmPasswordField = page.locator('#password-confirmation');
        this.createAccountButton = page.getByRole('button', { name: 'Create an Account' });
    }

    async navigateToLogin(): Promise<void> {
        await this.goto('/customer/account/login/');
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToRegister(): Promise<void> {
        await this.goto('/customer/account/create/');
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToAccountInfo(): Promise<void> {
        await this.goto('/customer/account/');
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToChangePassword(): Promise<void> {
        await this.goto('/customer/account/edit/changepass/1/');
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToMyOrders(): Promise<void> {
        await this.goto('/sales/order/history/');
        await this.page.waitForLoadState('networkidle');
    }

    async login(email: string, password: string): Promise<void> {
        await this.navigateToLogin();
        await this.page.waitForLoadState('networkidle');
        
        await this.page.waitForSelector('#maincontent', { timeout: TIMEOUTS.MEDIUM });
        
        await this.page.evaluate(([emailVal, passwordVal]) => {
            const emailField = document.getElementById('email') as HTMLInputElement;
            const passwordField = document.getElementById('pass') as HTMLInputElement;
            
            if (emailField) emailField.value = emailVal;
            if (passwordField) passwordField.value = passwordVal;
        }, [email, password]);
        
        await this.page.evaluate(() => {
            const form = document.querySelector('form.form.form-login');
            if (form) {
                const loginBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                if (loginBtn) {
                    loginBtn.click();
                }
            } else {
                const buttons = Array.from(document.querySelectorAll('button'));
                const signInBtn = buttons.find(btn => btn.textContent?.includes('Sign In'));
                if (signInBtn) {
                    signInBtn.click();
                }
            }
        });
        
        await this.page.waitForLoadState('networkidle');
    }

    async registerAccount(accountInfo: Account): Promise<void> {
        await this.navigateToRegister();
        await this.page.waitForLoadState('networkidle');
        
        await this.page.waitForSelector('#maincontent', { timeout: TIMEOUTS.MEDIUM });
        
        await this.page.evaluate(
            (info) => {
                const firstNameField = document.getElementById('firstname') as HTMLInputElement;
                const lastNameField = document.getElementById('lastname') as HTMLInputElement;
                const emailField = document.getElementById('email_address') as HTMLInputElement;
                const passwordField = document.getElementById('password') as HTMLInputElement;
                const confirmPasswordField = document.getElementById('password-confirmation') as HTMLInputElement;
                
                if (firstNameField) firstNameField.value = info.firstName;
                if (lastNameField) lastNameField.value = info.lastName;
                if (emailField) emailField.value = info.email;
                if (passwordField) passwordField.value = info.password;
                if (confirmPasswordField) confirmPasswordField.value = info.confirmPassword;
            },
            accountInfo
        );
        
        await this.createAccountButton.click({ timeout: TIMEOUTS.MEDIUM });
        await this.page.waitForLoadState('networkidle');
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await this.navigateToChangePassword();
        await this.page.waitForLoadState('networkidle');
        
        await this.page.waitForSelector('#maincontent', { timeout: TIMEOUTS.MEDIUM });
        
        await this.page.evaluate(
            ([current, newPass]) => {
                const currentPassField = document.getElementById('current-password') as HTMLInputElement;
                const passwordField = document.getElementById('password') as HTMLInputElement;
                const confirmPasswordField = document.getElementById('password-confirmation') as HTMLInputElement;
                
                if (currentPassField) currentPassField.value = current;
                if (passwordField) passwordField.value = newPass;
                if (confirmPasswordField) confirmPasswordField.value = newPass;
            },
            [currentPassword, newPassword]
        );
        
        await this.page.evaluate(() => {
            const form = document.querySelector('form.form-edit-account') as HTMLFormElement;
            if (form) {
                form.submit();
            } else {
                const buttons = Array.from(document.querySelectorAll('button'));
                const saveBtn = buttons.find(btn => 
                    btn.textContent?.includes('Save') || 
                    btn.className.includes('save')
                );
                if (saveBtn) {
                    saveBtn.click();
                }
            }
        });
        
        const successSelector = 'div.message-success, div.success.message, div.messages div.success';
        const successMessageAppears = await this.page.isVisible(successSelector, { timeout: TIMEOUTS.MEDIUM });
        
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(WAIT_TIMES.MEDIUM);
    }

    async verifyLoggedIn(): Promise<boolean> {
        await this.page.waitForLoadState('networkidle');
        
        const isElementVisible = async (locator: Locator): Promise<boolean> => {
            const count = await locator.count();
            if (count === 0) return false;
            return await locator.first().isVisible({ timeout: TIMEOUTS.SHORT });
        };
        
        const isAccountInfoVisible = await isElementVisible(this.accountInfoSection);
        
        const welcomeMsg = this.page.locator('.box-content .hello, .greet.welcome .logged-in');
        const isWelcomeVisible = await isElementVisible(welcomeMsg);
  
        const myAccountLink = this.page.locator('.header.links a[href*="customer/account"]');
        const isMyAccountVisible = await isElementVisible(myAccountLink);
        
        const signInLink = this.page.locator('.header.links .authorization-link a[href*="customer/account/login"]');
        const isSignInVisible = await isElementVisible(signInLink);
        
        return isAccountInfoVisible || isWelcomeVisible || isMyAccountVisible || !isSignInVisible;
    }

    async verifySuccessMessage(expectedText?: string): Promise<boolean> {
        await this.page.waitForLoadState('networkidle');
        
        const count = await this.successMessage.count();
        if (count === 0) return false;
        
        const isVisible = await this.successMessage.first().isVisible({ timeout: TIMEOUTS.SHORT });
            
        if (!isVisible) {
            return false;
        }
        
        if (expectedText) {
            const text = await this.successMessage.first().textContent() || '';
            return text.includes(expectedText);
        }
        
        return true;
    }

    async getOrderCount(): Promise<number> {
        await this.navigateToMyOrders();
        return await this.orderItems.count();
    }

    async viewOrderDetails(orderIndex: number = TEST_DATA.DEFAULT_ORDER_INDEX): Promise<void> {
        await this.navigateToMyOrders();
        
        const viewButton = this.orderItems.nth(orderIndex).locator('a.action.view');
        await viewButton.waitFor({ state: 'visible' });
        await viewButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getOrderStatusText(orderIndex: number = TEST_DATA.DEFAULT_ORDER_INDEX): Promise<string> {
        await this.navigateToMyOrders();
        
        const statusCell = this.orderItems.nth(orderIndex).locator('td.status');
        await statusCell.waitFor({ state: 'visible' });
        const statusText = await statusCell.textContent();
        return statusText?.trim() || '';
    }

    async logout(): Promise<void> {
        await this.goto('/customer/account/logout/');
        await this.page.waitForLoadState('networkidle');
    }

    async completePostOrderRegistration(firstName: string, lastName: string, password: string): Promise<void> {
        await this.firstNameField.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(password);
        
        await this.createAccountButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.successMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    }
} 