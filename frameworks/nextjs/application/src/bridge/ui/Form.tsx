'use client';

import { use, useEffect, useRef, useState } from 'react';
import useNavigate from './useNavigate';
import { useAppContext } from '~/ui/app-context/provider';
import { PriceRangeFilter } from '~/ui/components/search/price-range-filter';
import { AttributeFilter } from '~/ui/components/search/attribute-filter';
import useLocation from './useLocation';
import useSearchParams from './useSearchParams';
import { useRouter } from 'next/navigation';

export default ({ aggregations }: { aggregations: any }) => {
    const { pathname } = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    //price range will be changed to accomodate min and max
    const [priceRange, setPriceRange] = useState('');
    const [attr, setAttr] = useState('');
    const Router = useRouter();

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'orderBy') {
            setSearchTerm(value);
        } else if (name === 'filter1') {
            setPriceRange(value);
        } else if (name === 'attr') {
            setAttr(value);
        }

        console.log('jello', searchTerm, priceRange, attr);

        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.set('orderBy', searchTerm);
        if (priceRange) queryParams.set('filter1', priceRange);
        if (attr) queryParams.set('attr', attr);
        const queryString = queryParams.toString();
        const pathname = window.location.pathname;
        Router.push(`${pathname}?${queryString}`);
    };

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

    return (
        <>
            <form method="get" action={window.location.pathname} ref={formRef} className="flex gap-4 flex-wrap">
                <label>
                    <select
                        name="orderBy"
                        className="w-60 bg-grey py-2 px-6 rounded-md text-md font-bold "
                        defaultValue={'NAME_ASC'}
                        onChange={(e) => handleChange(e)}
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
                <AttributeFilter attributes={grouped} handleChange={handleChange} />
            </form>
            {/* {transition.state === 'submitting' ? (
                <p>{_t('loading')}...</p>
            ) : (
                <button onClick={() => navigate(location.pathname)}>{_t('search.removeAllFilters')}</button>
            )} */}
        </>
    );
};
