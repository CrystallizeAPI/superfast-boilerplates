import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { getContext } from '~/use-cases/http/utils';
import { isValidLanguageMarket } from '~/use-cases/LanguageAndMarket';
import { getStoreFront } from '~/use-cases/storefront.server';
import { headers } from 'next/headers';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import LandingPage from '~/ui/pages/LandingPage';
import { LandingPage as TLandingPage } from '~/use-cases/contracts/LandingPage';

async function getData() {
    const requestContext = getContext({
        url: 'https://furniture.superpast.local/en',
        headers: headers(),
    });
    if (!isValidLanguageMarket(requestContext.language, requestContext.market)) {
        // HOW?
    }
    const { shared, secret } = await getStoreFront(requestContext.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
    });
    const map = await api.fetchTreeMap();
    const mappedKey = Object.keys(map).find((key: string) => key === '/frontpage');
    const shapeIdentifier = map[mappedKey as keyof typeof map]?.shape?.identifier || '_topic';
    const data = await dataFetcherForShapePage(shapeIdentifier, '/frontpage', requestContext, {});

    return {
        data,
        shapeIdentifier,
    };
}
export default async () => {
    const { data, shapeIdentifier } = await getData();
    const path = '/en';

    switch (shapeIdentifier) {
        // case 'product':
        //     return <Product data={data} />;
        // case 'category':
        //     return <Category data={data} />;
        // case 'abstract-story':
        //     return <AbstractStory data={data} />;
        // case '_topic':
        //     return <Topic data={data} />;
        case 'landing-page':
            return <LandingPage data={data as TLandingPage} />;
        default:
            return <p>There is no renderer for that page</p>;
    }
};
