import type { ClientInterface } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

type Deps = {
    apiClient: ClientInterface;
};

export const validateVoucher = async (voucher: string, { apiClient }: Deps) => {
    const query = {
        validateVoucher: {
            __args: {
                voucher,
            },
            isValid: true,
        },
    };

    const rawQuery = jsonToGraphQLQuery({ query });

    try {
        const response = await apiClient.shopCartApi(rawQuery);
        return response.validateVoucher.isValid;
    } catch (exception: any) {
        console.error('Failed to fetch cart', exception.message);
        return {
            valid: false,
        };
    }
};
