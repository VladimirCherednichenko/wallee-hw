import { Product } from '../models/Product';
import { TEST_DATA } from '../constants';

export class ProductFactory {
    static getByNameAndOptions(name: string, size: string, color: string): Product | null {
        const products = this.getAll();
        return products.find(p => 
            p.name === name && 
            p.size === size && 
            p.color === color
        ) || null;
    }

    static getAll(): Product[] {
        return [
            {
                name: 'Proteus Fitness Jackshirt',
                size: 'XS',
                color: 'Blue',
                price: TEST_DATA.PRODUCT_PRICES.STANDARD,
                sku: 'MJ12-XS-Blue'
            },
            {
                name: 'Proteus Fitness Jackshirt',
                size: 'S',
                color: 'Blue',
                price: TEST_DATA.PRODUCT_PRICES.STANDARD,
                sku: 'MJ12-S-Blue'
            },
            {
                name: 'Proteus Fitness Jackshirt',
                size: 'M',
                color: 'Blue',
                price: TEST_DATA.PRODUCT_PRICES.STANDARD,
                sku: 'MJ12-M-Blue'
            },
            {
                name: 'Proteus Fitness Jackshirt',
                size: 'XS',
                color: 'Black',
                price: TEST_DATA.PRODUCT_PRICES.PREMIUM,
                sku: 'MJ12-XS-Black'
            },
            {
                name: 'Marco Lightweight Active Hoodie',
                size: 'XS',
                color: 'Blue',
                price: TEST_DATA.PRODUCT_PRICES.DELUXE,
                sku: 'MH13-XS-Blue'
            },
            {
                name: 'Marco Lightweight Active Hoodie',
                size: 'S',
                color: 'Blue',
                price: TEST_DATA.PRODUCT_PRICES.DELUXE,
                sku: 'MH13-S-Blue'
            },
            {
                name: 'Marco Lightweight Active Hoodie',
                size: 'XS',
                color: 'Green',
                price: TEST_DATA.PRODUCT_PRICES.DELUXE,
                sku: 'MH13-XS-Green'
            },
            {
                name: 'Marco Lightweight Active Hoodie',
                size: 'XS',
                color: 'Lavender',
                price: TEST_DATA.PRODUCT_PRICES.DELUXE,
                sku: 'MH13-XS-Lavender'
            }
        ];
    }
} 