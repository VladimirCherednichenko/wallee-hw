import { Billing } from '../models/Billing';
import { getRandomEmail } from '../helpers';
import { TEST_DATA } from '../constants';

export class BillingFactory {
    static create(): Billing {
        return {
            email: getRandomEmail(),
            firstName: 'Test',
            lastName: 'User',
            address: TEST_DATA.BILLING.ADDRESS,
            city: 'Test City',
            state: 'California',
            zip: TEST_DATA.BILLING.ZIP,
            country: 'US',
            phone: TEST_DATA.BILLING.PHONE,
            shippingMethod: 'flatrate'
        };
    }
} 