import { ClientInterface } from '@crystallize/js-api-client';
import { hydrateCart } from '../crystallize/write/editCart';
import { validateVoucher } from '../crystallize/read/validateVoucher.server';

type Deps = {
    apiClient: ClientInterface;
};

export default async (body: any, { apiClient }: Deps, markets?: string[]) => {
    const cartId = body?.cartId;

    const localCartItems = body?.items?.map((item: any) => ({
        sku: item.sku,
        quantity: item.quantity,
    }));

    const voucher = body.extra?.voucher?.toUpperCase();
    let validVoucher = null;

    if (voucher) {
        try {
            validVoucher = await validateVoucher(voucher, { apiClient });
        } catch (error) {
            console.error('Voucher validation failed:', error);
        }
    }

    try {
        return await hydrateCart(localCartItems, { apiClient }, cartId, markets, validVoucher ? voucher : '');
    } catch (error: any) {
        if (error.message.includes('placed')) {
            console.log('Cart has been placed, creating a new one');
            return await hydrateCart(localCartItems, { apiClient }, undefined, markets, validVoucher ? voucher : '');
        }
        throw error;
    }
};
