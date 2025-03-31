import { Card } from '../models/Card';
import { TEST_DATA } from '../constants';

export class CardFactory {
    static create(): Card {
        return {
            cardNumber: TEST_DATA.CARD.NUMBER,
            expiryMonth: TEST_DATA.CARD.EXPIRY_MONTH,
            expiryYear: TEST_DATA.CARD.EXPIRY_YEAR,
            cvv: TEST_DATA.CARD.CVV,
            nameOnCard: 'Test User',
            expiryDate: TEST_DATA.CARD.EXPIRY_DATE
        };
    }
} 