import { ClientInterface } from '@crystallize/js-api-client';
import { RequestContext } from '../http/utils';
import { handleAndSaveCart, hydrateCart } from './cart';

export default async (apiClient: ClientInterface, context: RequestContext, body: any, email?: string) => {
    const cart = await hydrateCart(apiClient, context.language, body, email);

    return await handleAndSaveCart(cart, body.cartId as string);
};
