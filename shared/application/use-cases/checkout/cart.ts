import {
    Cart,
    CartItem,
    cartPayload,
    CartPayload,
    CartWrapper,
    handleCartRequestPayload,
    Price,
} from '@crystallize/node-service-api-request-handlers';
import { extractDisountLotFromItemsBasedOnXForYTopic, groupSavingsPerSkus } from './discount';
import { validatePayload } from '../http/utils';
import {
    ClientInterface,
    createProductHydrater,
    Product,
    ProductPriceVariant,
    ProductVariant,
} from '@crystallize/js-api-client';
import { CrystallizeAPI } from '../crystallize/read';
import { marketIdentifiersForUser } from '../marketIdentifiersForUser';
import { Voucher } from '../contracts/Voucher';

export async function hydrateCart(
    apiClient: ClientInterface,
    language: string,
    body: any,
): Promise<[Cart, Voucher | undefined]> {
    const api = CrystallizeAPI({
        apiClient,
        language,
    });

    const tenantConfig = await api.fetchTenantConfig(apiClient.config.tenantIdentifier);
    const currency = tenantConfig.currency;

    const marketIdentifiers = marketIdentifiersForUser(body.user);

    const pickStandardPrice = (
        product: Product,
        selectedVariant: ProductVariant,
        currency: string,
    ): ProductPriceVariant => {
        // opinionated: if we have a `default` Price we take it
        let variant = selectedVariant?.priceVariants?.find(
            (price: ProductPriceVariant) =>
                price?.identifier === 'default' &&
                price?.currency?.toLocaleLowerCase() === currency.toLocaleLowerCase(),
        );

        //if we have a market price, we take that
        if (variant?.priceFor?.price && variant?.priceFor?.price < variant?.price!) {
            variant.price = variant?.priceFor?.price;
        }

        return (
            variant ??
            selectedVariant?.priceVariants?.[0] ?? {
                price: selectedVariant?.price,
                identifier: 'undefined',
            }
        );
    };

    const cart = await handleCartRequestPayload(validatePayload<CartPayload>(body, cartPayload), {
        hydraterBySkus: createProductHydrater(apiClient, {
            useSyncApiForSKUs: false,
            marketIdentifiers,
        }).bySkus,
        currency,
        perProduct: () => {
            return {
                topics: {
                    name: true,
                },
            };
        },
        perVariant: () => {
            return {
                firstImage: {
                    url: true,
                    variants: {
                        url: true,
                        height: true,
                        width: true,
                    },
                },
            };
        },
        selectPriceVariant: (
            product: Product,
            selectedVariant: ProductVariant,
            currency: string,
        ): ProductPriceVariant => {
            // opinionated: if we have a `Sales` Price we take it
            const variant = selectedVariant?.priceVariants?.find(
                (price: ProductPriceVariant) =>
                    price?.identifier === 'sales' && price?.currency?.toLowerCase() === currency.toLocaleLowerCase(),
            );
            const standardPrice = pickStandardPrice(product, selectedVariant, currency);
            if (!variant) {
                return standardPrice;
            }

            if (!variant?.price) {
                return standardPrice;
            }

            return variant;
        },
        basePriceVariant: (
            product: Product,
            selectedVariant: ProductVariant,
            currency: string,
        ): ProductPriceVariant => {
            return pickStandardPrice(product, selectedVariant, currency);
        },
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

    return [cart, voucher];
}
export const alterCartItemsAndCartTotalsBasedOnSavings = (cartWrapper: CartWrapper, savings: Savings): CartWrapper => {
    let newTotals: Price = {
        gross: 0,
        currency: cartWrapper.cart.total.currency,
        net: 0,
        taxAmount: 0,
        discounts: [
            {
                amount: 0,
                percent: 0,
            },
        ],
    };
    const alteredItems: CartItem[] = cartWrapper.cart.cart.items.map((item: CartItem) => {
        const saving = savings[item.variant.sku]?.quantity > 0 ? savings[item.variant.sku] : null;
        const savingAmount = saving?.amount || 0;
        const netAmount = item.price.net - savingAmount;
        const taxAmount = (netAmount * (item.product?.vatType?.percent || 0)) / 100;
        const grossAmount = netAmount + taxAmount;
        const discount = {
            amount: savingAmount,
            percent: (savingAmount / (netAmount + savingAmount)) * 100,
        };
        newTotals.taxAmount += taxAmount;
        newTotals.gross += grossAmount;
        newTotals.net += netAmount;
        newTotals.discounts![0].amount += savingAmount;
        return {
            ...item,
            price: {
                ...item.price,
                gross: grossAmount,
                net: netAmount,
                currency: item.price.currency,
                taxAmount,
                discounts: item.price.discounts ? [...item.price.discounts, discount] : [discount],
            },
        };
    });

    newTotals.discounts![0].percent =
        (newTotals.discounts![0].amount / (newTotals.net + newTotals.discounts![0].amount)) * 100;

    return {
        ...cartWrapper,
        cart: {
            ...cartWrapper.cart,
            cart: {
                ...cartWrapper.cart.cart,
                items: alteredItems,
            },
            total: {
                ...cartWrapper.cart.total,
                ...newTotals,
                discounts: cartWrapper.cart.total.discounts
                    ? [...cartWrapper.cart.total.discounts, ...newTotals?.discounts!]
                    : [...newTotals?.discounts!],
            },
        },
    };
};
export const alterCartTotalsBasedOnVouchers = (wrapper: CartWrapper) => {
    let voucherDiscount = {
        amount: 0,
        percent: 0,
    };
    if (wrapper?.extra?.voucher) {
        if (wrapper.extra.voucher.value.type === 'absolute') {
            voucherDiscount = {
                amount: wrapper.extra.voucher.value.number,
                percent: (wrapper.extra.voucher.value.number / wrapper.cart.total.net) * 100,
            };
        }
        if (wrapper.extra.voucher.value.type === 'percent') {
            voucherDiscount = {
                amount: (wrapper.extra.voucher.value.number / 100) * wrapper.cart.total.net,
                percent: wrapper.extra.voucher.value.number,
            };
        }
    }

    const VoucherDiscountPercentage = (voucherDiscount?.amount / wrapper.cart.total.net) * 100;

    const newWeightedTotal = {
        net: 0,
        taxAmount: 0,
        gross: 0,
    };

    // Using Weighted Average to calculate the new price after Voucher is applied
    // Items after Weighted Voucher can be shown in the cart if a usecase arises
    const itemsAfterWeightedVoucher = wrapper.cart.cart.items.map((item) => {
        const newItemsNet = item.price.net - (item.price.net * VoucherDiscountPercentage) / 100;
        const newTaxAmount = (newItemsNet * (item.product?.vatType?.percent || 0)) / 100;
        const newItemGross = newItemsNet + newTaxAmount;
        newWeightedTotal.net += newItemsNet;
        newWeightedTotal.taxAmount += newTaxAmount;
        newWeightedTotal.gross += newItemGross;
        return {
            ...item,
            price: {
                ...item.price,
                net: newItemsNet,
                taxAmount: newTaxAmount,
                gross: newItemGross,
            },
        };
    });

    wrapper.cart.total.taxAmount = +newWeightedTotal.taxAmount.toFixed(2);
    wrapper.cart.total.gross = +newWeightedTotal.gross.toFixed(2);
    wrapper.cart.total.net = +newWeightedTotal.net.toFixed(2);

    return {
        ...wrapper,
        cart: {
            ...wrapper.cart,
            total: {
                ...wrapper.cart.total,
                discounts: wrapper.cart.total.discounts
                    ? [...wrapper.cart.total.discounts, voucherDiscount]
                    : [voucherDiscount],
            },
        },
    };
};
