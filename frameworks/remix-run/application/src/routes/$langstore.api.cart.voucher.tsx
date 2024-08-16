import { ActionFunction, ActionFunctionArgs } from '@remix-run/node';
import { getStoreFront } from '~/use-cases/storefront.server';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getContext } from '~/use-cases/http/utils';
import { validateVoucher } from '~/use-cases/crystallize/read/validateVoucher.server';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();

    const checkVoucher = await validateVoucher(body.voucher, {
        apiClient: storefront.apiClient,
    });

    return privateJson({
        isValid: checkVoucher,
    });
};
