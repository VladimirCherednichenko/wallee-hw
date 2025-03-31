import { BasePage } from './basePage';
import { Card } from '../models/models/Card';

export class WalleeCheckout extends BasePage {

    async fillCreditCardDetails(cardDetails: Card): Promise<void> {
            await this.page.waitForLoadState('networkidle', { timeout: 20000 });
            const ccNumberInput = this.page.locator('input[name="ccnumber"]');
            await ccNumberInput.waitFor({ state: 'visible', timeout: 15000 });
            await ccNumberInput.fill(cardDetails.cardNumber);
            await this.page.locator('input[id$="field_expiryDate-month"]').fill(cardDetails.expiryMonth);
            await this.page.locator('input[id$="field_expiryDate-year"]').fill(cardDetails.expiryYear);;
            await this.page.locator('input[id$="field_cardVerificationCode-input"]').fill(cardDetails.cvv);
            await this.page.waitForLoadState('networkidle');
    }

    async pressPayButton(): Promise<void> {
            const payButton = this.page.getByRole('button', { name: /^\s*Pay\s*$/ });
            await this.page.waitForLoadState('networkidle', { timeout: 30000 });
            await payButton.click();  
    }

}