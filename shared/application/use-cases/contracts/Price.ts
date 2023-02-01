import { Currency } from './Currency';

export type Price = {
    priceForMarket: {
        value: number;
    };
    currency: Currency;
    value: number;
    identifier: string;
    name: string;
};
