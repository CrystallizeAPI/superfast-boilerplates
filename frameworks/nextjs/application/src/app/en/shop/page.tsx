import { headers } from 'next/headers';
import Category from '~/ui/pages/Category';
import { isValidLanguageMarket } from '~/use-cases/LanguageAndMarket';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { Category as TCategory } from '~/use-cases/contracts/Category';

async function getData() {
    const requestContext = getContext({
        url: 'https://furniture.superfast.local/en',
        headers: headers(),
    });
    if (!isValidLanguageMarket(requestContext.language, requestContext.market)) {
        // HOW?
    }
    const path = '/shop';
    const { secret } = await getStoreFront(requestContext.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
    });

    const data = await api.fetchShop(path, []);

    return data;
}

export default async () => {
    const data = await getData();

    console.log('data', data);

    return <p>Hello</p>;
};
