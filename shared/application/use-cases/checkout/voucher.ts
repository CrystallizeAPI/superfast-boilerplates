import { ClientInterface, CrystallizeClient } from '@crystallize/js-api-client';

const PATH_PREFIX = '/vouchers/';

const QUERY_GET_VOUCHER = `
query GET_VOUCHER($path: String!, $language: String!) {
  catalogue(language: $language, path: $path) {
    id
    name
    value: component(id: "discount") {
      content {
        ... on ComponentChoiceContent {
            selectedComponent {
            id
            name
            content {
              ... on NumericContent {
                number
                unit
              }
            }
          }
        }
      }
    }
    expires: component(id: "expiry-date") {
      content {
        ... on DatetimeContent {
          datetime
        }
      }
    }
  }
}
`;

type Voucher = {
    itemId: string;
    name: string;
    value: {
        number: number;
        unit?: string;
        type: string;
    };
    expires: Date | null;
};

const voucherTransformer = (input: Record<string, any>): Voucher | null => {
    if (!input) {
        return null;
    }

    const expiresString = input.expires?.content?.datetime || null;
    const expires = expiresString ? new Date(expiresString) : null;
    if (expires && expires < new Date()) {
        return null;
    }

    return {
        itemId: input.id,
        name: input.name,
        value: {
            type: input.value?.content?.selectedComponent?.id,
            number: input.value?.content?.selectedComponent?.content?.number,
        },
        expires,
    };
};

export async function getVoucher(code?: string | null, apiClient?: ClientInterface): Promise<Voucher | null> {
    if (code) {
        try {
            const path = `${PATH_PREFIX}${code.toLowerCase()}`;
            const res = await apiClient?.catalogueApi(QUERY_GET_VOUCHER, {
                path,
                language: 'en',
            });
            const voucher = voucherTransformer(res.catalogue);
            return voucher;
        } catch (err) {
            console.log('getVoucher failed with', err);
            return null;
        }
    }
    return null;
}
