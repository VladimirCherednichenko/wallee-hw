import { TEST_DATA } from './constants';

export function getRandomEmail(): string {
    return `test${Math.floor(Math.random() * TEST_DATA.EMAIL_RANDOM_MULTIPLIER)}@example.com`;
} 