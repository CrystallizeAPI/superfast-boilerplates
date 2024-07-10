import { CartWrapper } from '@crystallize/node-service-api-request-handlers';

export default (cart: any): CartWrapper => {
    return {
        cartId: cart.id,
        state: cart.state,
        extra: {},
        cart: {
            total: {
                currency: cart.total.currency,
                gross: cart.total.gross,
                net: cart.total.net,
                taxAmount: cart.total.taxAmount,
            },
            cart: {
                items: cart.items.map((item: any) => ({
                    quantity: item.quantity,
                    price: {
                        currency: item.price.currency,
                        gross: item.price.gross,
                        net: item.price.net,
                        taxAmount: item.price.taxAmount,
                    },
                    product: {
                        name: item.product.name,
                    },
                    variant: {
                        name: item.variant.name,
                        sku: item.variant.sku,
                    },
                })),
            },
        },
    };
};
