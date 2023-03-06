import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrderRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { LoaderFunction } from '@remix-run/node';
import { authenticatedUser } from '~/core/authentication.server';
import { getContext } from '~/use-cases/http/utils';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getStoreFront } from '~/use-cases/storefront.server';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const auth: any = await authenticatedUser(request);

    return privateJson(
        await handleOrderRequestPayload(null, {
            fetcherById: createOrderFetcher(storefront.apiClient).byId,
            user: auth.email,
            orderId: params.id!,
            checkIfOrderBelongsToUser: () => {
                if (auth.email) {
                    return true;
                }
                return false;
            },
        }),
    );
};
