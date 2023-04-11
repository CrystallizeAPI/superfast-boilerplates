import { ClientInterface } from "@crystallize/js-api-client";
import { CartWrapper } from "@crystallize/node-service-api-request-handlers";
import { Voucher } from "../contracts/Voucher";
import { RequestContext } from "../http/utils";
import {
  alterCartItemsAndCartTotalsBasedOnSavings,
  alterCartTotalsBasedOnVouchers,
  hydrateCart,
} from "./cart";
import { v4 as uuidv4 } from "uuid";
import { cartWrapperRepository } from "../services.server";
import {
  extractDisountLotFromItemsBasedOnXForYTopic,
  groupSavingsPerSkus,
} from "./discount";

export default async (
  apiClient: ClientInterface,
  context: RequestContext,
  body: any
) => {
  const [cart, voucher] = await hydrateCart(apiClient, context.language, body);
  return await handleAndSaveCart(cart, body.cartId as string, voucher);
};

export async function handleAndSaveCart(
  cart: any,
  providedCartId: string,
  voucher?: Voucher
): Promise<CartWrapper> {
  let cartId = providedCartId;
  let cartWrapper: null | CartWrapper = null;
  let storedCartWrapper: null | CartWrapper = null;
  if (cartId) {
    storedCartWrapper = (await cartWrapperRepository.find(cartId)) || null;
  } else {
    cartId = uuidv4();
  }
  if (!storedCartWrapper) {
    cartWrapper = cartWrapperRepository.create(cart, cartId, { voucher });
  } else {
    cartWrapper = { ...storedCartWrapper };
    cartWrapper.cart = cart;
    cartWrapper.extra.voucher = voucher;
  }
  const lots = extractDisountLotFromItemsBasedOnXForYTopic(
    cartWrapper.cart.cart.items
  );
  const savings = groupSavingsPerSkus(lots);
  cartWrapper = alterCartItemsAndCartTotalsBasedOnSavings(cartWrapper, savings);
  if (cartWrapper?.extra?.voucher)
    cartWrapper = alterCartTotalsBasedOnVouchers(cartWrapper);

  cartWrapper.extra = {
    ...cartWrapper.extra,
    discounts: {
      lots,
      savings,
    },
  };

  if (!cartWrapperRepository.save(cartWrapper)) {
    return storedCartWrapper || cartWrapper;
  }
  return cartWrapper;
}
