'use client';

import { useEffect, useRef } from 'react';
import useNavigate from './useNavigate';
import { useAppContext } from '~/ui/app-context/provider';
import { PriceRangeFilter } from '~/ui/components/search/price-range-filter';
import { AttributeFilter } from '~/ui/components/search/attribute-filter';
import useLocation from './useLocation';
import useSearchParams from './useSearchParams';

export default ({ aggregations }: { aggregations: any }) => {
    const { router, pathname } = useNavigate();
    // const searchParams = useSearchParams();
    const location = useLocation();
    let searchParams: any;

    const handleChange = (event: any) => {
        event.preventDefault();
        console.log('event', event.target.value);
        searchParams = new URLSearchParams();
        console.log('searchParams', event.target.name);

        searchParams.append(event.target.name, event.target.value);
        const search = searchParams.toString();
        const currentUrl = window.location.href;
        const newUrl = searchParams ? `${currentUrl}&${search}` : `${currentUrl}?${search}`;
        window.location.replace(newUrl);
    };

    useEffect(() => {}, [window.location.search]);

    const formRef = useRef(null);
    const { _t } = useAppContext();
    const price = aggregations?.search.aggregations.price;
    const attributes = aggregations?.search.aggregations.attributes;
    const grouped = attributes?.reduce(
        (
            memo: Record<string, Array<{ attribute: string; value: string }>>,
            item: { attribute: string; value: string },
        ) => {
            if (!memo[item.attribute]) {
                memo[item.attribute] = [];
            }
            memo[item.attribute].push(item);
            return memo;
        },
        {},
    );

    console.log(window.location);

    return (
        <>
            <form
                method="get"
                action={window.location.pathname}
                onChange={handleChange}
                ref={formRef}
                className="flex gap-4 flex-wrap"
            >
                <label>
                    <select
                        name="orderBy"
                        className="w-60 bg-grey py-2 px-6 rounded-md text-md font-bold "
                        defaultValue={'NAME_ASC'}
                    >
                        <option disabled value="" className="text-textBlack">
                            {_t('search.sort')}
                        </option>
                        <option value="PRICE_ASC">{_t('search.price.lowToHigh')}</option>
                        <option value="PRICE_DESC">{_t('search.price.highToLow')}</option>
                        <option value="NAME_ASC">{_t('search.name.ascending')}</option>
                        <option value="NAME_DESC">{_t('search.name.descending')}</option>
                        <option value="STOCK_ASC">{_t('search.stock.ascending')}</option>
                        <option value="STOCK_DESC">{_t('search.stock.descending')}</option>
                    </select>
                </label>
                <PriceRangeFilter min={price.min} max={price.max} formRef={formRef} />
                <AttributeFilter attributes={grouped} />
            </form>
            {/* {transition.state === 'submitting' ? (
                <p>{_t('loading')}...</p>
            ) : (
                <button onClick={() => navigate(location.pathname)}>{_t('search.removeAllFilters')}</button>
            )} */}
        </>
    );
};
