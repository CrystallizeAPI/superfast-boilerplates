import { ClientInterface } from '@crystallize/js-api-client';
import { RequestContext } from '../http/utils';
import { handleAndPlaceCart, hydrateCart } from './cart';
import { getVoucher } from './voucher';

export default async (apiClient: ClientInterface, context: RequestContext, body: any, customer: any) => {
    const cart = await hydrateCart(apiClient, context.language, body);
    const voucher = await getVoucher(body.extra?.voucher, apiClient);
    return await handleAndPlaceCart(cart, customer, body.cartId as string, body.options, voucher);
};
