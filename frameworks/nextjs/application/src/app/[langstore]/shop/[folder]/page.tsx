import { headers } from 'next/headers';
import { isValidLanguageMarket } from '~/use-cases/LanguageAndMarket';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import Category from '~/ui/pages/Category';
import { Category as TCategory } from '~/use-cases/contracts/Category';
import { ProductSlim } from '~/use-cases/contracts/Product';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';

type Data = {
    category: TCategory;
    products: ProductSlim[];
    priceRangeAndAttributes: any;
};

async function getData({
    params,
    searchParams,
}: {
    params: {
        [x: string]: any;
        slug: string;
    };
    searchParams: {
        orderBy: string;
        filters: string;
        attributes: string;
    };
}) {
    const requestContext = getContext({
        url: `https://furniture.superfast.local/en/shop/${params.folder}`,
        headers: headers(),
    });
    if (!isValidLanguageMarket(requestContext.language, requestContext.market)) {
        // HOW?
    }
    const path = `/shop/${params.folder}`;
    const { secret } = await getStoreFront(requestContext.host);

    //TODO: implement authenticatedUser

    //const user = await authenticatedUser(request);

    const user: [] = [];

    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
    });

    const [category, products, priceRangeAndAttributes] = await Promise.all([
        api.fetchFolderWithChildren(path, []),
        api.searchOrderBy(path, searchParams?.orderBy, searchParams?.filters, searchParams?.attributes),
        api.fetchPriceRangeAndAttributes(path),
    ]);
    console.log('category', category);
    return {
        category,
        products,
        priceRangeAndAttributes,
    };
}

export default async function Page({ params, searchParams }: { params: { slug: string }; searchParams: any }) {
    console.log('serchyiio', searchParams);
    const data = await getData({ params, searchParams });
    return <Category data={data as Data} />;
}
