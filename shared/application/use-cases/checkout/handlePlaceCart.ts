import { ClientInterface, placeCart } from '@crystallize/js-api-client';
import { fetchCart } from '../crystallize/read/fetchCart';
import { setCartCustomer } from '../crystallize/write/editCart';
import { EnumType } from 'json-to-graphql-query';

type Deps = {
    apiClient: ClientInterface;
};

enum AddressType {
    Billing = 'billing',
    Shipping = 'shipping',
}

export default async (body: any, customer: any, { apiClient }: Deps) => {
    const isGuest = customer?.isGuest || false;

    const cartCustomer = {
        firstName: customer?.firstname || '',
        lastName: customer?.lastname || '',
        identifier: customer?.email || '',
        addresses: [
            {
                type: new EnumType('billing'),
                email: customer?.email || '',
                street: customer?.streetAddress || '',
                country: customer?.country || '',
                city: customer?.city || '',
                postalCode: customer?.zipCode || '',
            },
        ],
    };

    await setCartCustomer(body?.cartId, cartCustomer, isGuest, {
        apiClient,
    });

    const placedCart = await placeCart(body.cartId, { apiClient });

    if (placedCart.id) {
        return await fetchCart(placedCart.id, { apiClient });
    }

    return {} as any;
};
