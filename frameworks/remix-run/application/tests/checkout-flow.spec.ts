import { test, expect, Page, Response, APIRequestContext } from '@playwright/test';

let retryCount = 0;
const MAX_RETRY_COUNT = 5;
let orderId: string | null;
let apiContext: APIRequestContext;

const deleteOrderMutation = `
  mutation DELETE_ORDER($id: ID!) {
    order {
        delete(id: $id)
    }
  }
`;

const orderQuery = `
  query GET_ORDER($id: ID!) {
    order {
      get(id: $id) {
        cart {
            sku
            quantity
        }
        customer {
            firstName
            lastName
            addresses {
                city
                country
                email
                postalCode
            }
        }
      }
    }
  }
`;

const getLocalStorage = async (page: Page) => page.evaluate(() => window.localStorage);
const getRequestBody = (query: typeof deleteOrderMutation | typeof orderQuery, id: string | null) =>
    JSON.stringify({ query, variables: { id } });

test.beforeAll(async ({ playwright }) => {
    // Prepare API context with auth headers
    apiContext = await playwright.request.newContext({
        baseURL: process.env.API_URL,
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
            'X-Crystallize-Access-Token-Id': process.env.PLAYWRIGHT_ACCESS_TOKEN_ID ?? '',
            'X-Crystallize-Access-Token-Secret': process.env.PLAYWRIGHT_ACCESS_TOKEN_SECRET ?? '',
        },
    });
});

test.afterAll(async ({}) => {
    // Clean up order
    !!orderId && (await apiContext.post('/graphql', { data: getRequestBody(deleteOrderMutation, orderId) }));
    // Dispose all responses
    await apiContext.dispose();
});

test.describe('Checkout flow', () => {
    test('makes an order using crystal coin with guest user and confirms the order in the API', async ({
        page,
        baseURL,
    }) => {
        const customer = {
            firstname: 'John',
            lastname: 'Smith',
            email: 'john@company.com',
            streetAddress: 'Backer Str. 6',
            country: 'England',
            city: 'London',
            zipCode: '6060',
        };

        await page.goto(baseURL ?? '');

        // Navigate to the first product on the home page
        await page.locator('a[data-testid="product-link"]').first().click();

        // Add the product to the cart and navigate to the cart
        await page.click('[data-testid="add-to-cart-button"]');
        await page.click('[data-testid="go-to-cart-button"]');

        // Navigate to the checkout flow
        await page.click('[data-testid="checkout-button"]');

        await page.waitForResponse(async (response: Response) =>
            response.url().includes('api/cart') ? response.status() === 200 : false,
        );

        // Make sure cartId is present in the local storage
        const localStorageCartAtCheckout = await getLocalStorage(page);
        const { state, cartId } = JSON.parse(localStorageCartAtCheckout.cart);
        expect(state).toBe('cart');
        expect(cartId.length).toBeGreaterThan(0);

        // Select guest checkout
        await page.locator('[data-testid="guest-checkout-button"]').waitFor({ state: 'visible' });
        await page.click('[data-testid="guest-checkout-button"]');

        // Fill in the form
        await page.type('input[name=firstname]', customer.firstname);
        await page.type('input[name=lastname]', customer.lastname);
        await page.type('input[name=email]', customer.email);
        await page.type('input[name=streetAddress]', customer.streetAddress);
        await page.type('input[name=country]', customer.country);
        await page.type('input[name=city]', customer.city);
        await page.type('input[name=zipCode]', customer.zipCode);

        // Make sure customer information in saved in local storage
        const localStorage = await getLocalStorage(page);
        expect(JSON.parse(localStorage.customer)).toEqual(customer);

        // Navigate to next step - payment
        await page.click('[data-testid="checkout-next-step-button"]');

        // Select the Crystal coin payment method
        await page.click('[data-testid="crystal-coin-payment-button"]');

        // Confirm the order is placed
        page.locator('[data-testid="order-placed"]').waitFor({ state: 'visible' });

        // Get the order id
        orderId = await page.locator('[data-testid="guest-order-id"]').textContent();

        // Wait until the order appears in the API
        while (retryCount < MAX_RETRY_COUNT) {
            retryCount += 1;
            // Wait 300 ms before making a new attempt to get the order
            await new Promise((r) => setTimeout(r, 300));

            // Fetch the order from the API
            const orderRes = await apiContext.post('/graphql', { data: getRequestBody(orderQuery, orderId) });
            expect(orderRes.ok()).toBeTruthy();

            const order = (await orderRes.json())?.data?.order?.get;

            if (!!order) {
                // End the waiting loop when we have the order
                retryCount = MAX_RETRY_COUNT;

                const { items } = JSON.parse(localStorage.cart);
                const { firstname, lastname, email, city, country, zipCode } = JSON.parse(localStorage.customer);

                const { sku, quantity } = items[Object.keys(items)[0]];
                const address = { email, city, country, postalCode: zipCode };

                // Make sure order from the API is the same as the one we have in local storage
                expect(order).toEqual({
                    cart: [{ sku, quantity }],
                    customer: { firstName: firstname, lastName: lastname, addresses: [address, address] },
                });
            }
        }
    });
});
