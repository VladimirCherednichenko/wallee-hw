import { User } from '../models/User';
import { getRandomEmail } from '../helpers';
import { TEST_DATA } from '../constants';

export class UserFactory {
    static create(): User {
        return {
            firstName: 'Test',
            lastName: 'User',
            email: getRandomEmail(),
            password: 'Test123!'
        };
    }
    
    static createFixed(): User {
        return {
            email: `test_user_${Math.floor(Math.random() * TEST_DATA.ACCOUNT_RANDOM_MULTIPLIER)}@example.com`,
            password: 'Test123!@#',
            firstName: 'Test',
            lastName: 'User'
        };
    }
} 