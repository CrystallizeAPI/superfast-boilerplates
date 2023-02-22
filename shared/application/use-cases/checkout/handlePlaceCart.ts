import { ClientInterface } from '@crystallize/js-api-client';
import { Voucher } from '../contracts/Voucher';
import { CrystallizeAPI } from '../crystallize/read';
import { RequestContext } from '../http/utils';
import { handleAndPlaceCart, hydrateCart } from './cart';

export default async (apiClient: ClientInterface, context: RequestContext, body: any, customer: any) => {
    const cart = await hydrateCart(apiClient, context.language, body);
    const api = CrystallizeAPI({
        apiClient,
        language: context.language,
    });
    let voucher: Voucher | undefined;
    try {
        voucher = (await api.fetchVoucher(body.extra?.voucher)) as Voucher;
        if (voucher.isExpired) {
            voucher = undefined;
        }
    } catch (exception) {
        voucher = undefined;
    }
    return await handleAndPlaceCart(cart, customer, body.cartId as string, body.options, voucher);
};
