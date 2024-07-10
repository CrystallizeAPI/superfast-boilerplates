import { CartItem } from '@crystallize/node-service-api-request-handlers';
import displayPriceFor, { DisplayPrice } from '~/use-cases/checkout/pricing';
import { Price as CrystallizePrice } from '../lib/pricing/pricing-component';
import { useAppContext } from '../app-context/provider';
import { ProductVariant } from '~/use-cases/contracts/ProductVariant';

export const DiscountedPrice: React.FC<{
    price: DisplayPrice;
    size?: string;
}> = ({ price, size = 'medium' }) => {
    const priceSize = {
        small: {
            default: 'text-md font-semibold',
            previous: 'line-through font-semibold pt-1 text-xs',
            discount: 'text-md font-semibold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-medium',
        },
        medium: {
            default: 'text-2xl font-bold',
            previous: 'line-through font-semibold pt-1 text-sm',
            discount: 'text-2xl font-bold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold',
        },
    };
    let {
        default: defaultPrice,
        discounted: discountPrice,
        percent: discountPercentage,
        currency,
        marketPrice,
    } = price;

    const { _t } = useAppContext();

    return (
        <div>
            {discountPrice && discountPrice < defaultPrice ? (
                <div className="flex flex-wrap flex-col">
                    <div className={priceSize[size as keyof typeof priceSize].previous}>
                        <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className={priceSize[size as keyof typeof priceSize].discount}>
                            <CrystallizePrice currencyCode={currency.code}>{discountPrice}</CrystallizePrice>
                        </div>
                        <div className={priceSize[size as keyof typeof priceSize].percentage}>
                            -{discountPercentage}%
                        </div>
                    </div>
                    {marketPrice && marketPrice < defaultPrice && (
                        <p className={`${priceSize[size as keyof typeof priceSize].percentage} w-fit mt-2`}>
                            {_t('marketPriceLabel')}
                        </p>
                    )}
                </div>
            ) : (
                <div className="">
                    <CrystallizePrice
                        currencyCode={currency.code}
                        className={priceSize[size as keyof typeof priceSize].default}
                    >
                        {defaultPrice}
                    </CrystallizePrice>
                </div>
            )}
        </div>
    );
};

export const Price: React.FC<{ variant: ProductVariant; size?: string }> = ({ variant, size = 'medium' }) => {
    const { state } = useAppContext();
    const price = displayPriceFor(
        variant,
        {
            default: 'default',
            discounted: 'sales',
        },
        state.currency.code,
    );
    return <DiscountedPrice price={price} size={size} />;
};

export const CartItemPrice: React.FC<{
    total: number;
    discount?: number;
}> = ({ total, discount }) => {
    const { state, _t } = useAppContext();
    const {
        currency: { code: currencyCode },
    } = state;
    return (
        <div className="flex flex-col ">
            {discount && discount > 0 && (
                <div className="text-sm font-semibold text-green2">
                    {_t('cart.discount')}: <CrystallizePrice currencyCode={currencyCode}>{discount}</CrystallizePrice>
                </div>
            )}
            <div>
                {_t('total')}: <CrystallizePrice currencyCode={currencyCode}>{total}</CrystallizePrice>
            </div>
        </div>
    );
};
