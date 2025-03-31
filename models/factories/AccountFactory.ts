import { Account } from '../models/Account';
import { User } from '../models/User';
import { getRandomEmail } from '../helpers';
import { TEST_DATA } from '../constants';

export class AccountFactory {
    static create(passwordLength: number = TEST_DATA.DEFAULT_PASSWORD_LENGTH): Account {
        const email = getRandomEmail();
        const password = this.generateRandomPassword(passwordLength);
        
        return {
            firstName: 'Test',
            lastName: 'User',
            email,
            password,
            confirmPassword: password
        };
    }
    
    static createFromUser(user: User): Account {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            confirmPassword: user.password
        };
    }
    
    private static generateRandomPassword(length: number): string {
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '!@#$%^&*()_-+=<>?';
        
        const allChars = upperChars + lowerChars + numbers + specialChars;
        
        let password = '';
        password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
        password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }
} 