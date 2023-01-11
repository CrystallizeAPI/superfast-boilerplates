import { createClient } from '@crystallize/js-api-client';
import { ErrorComponent } from '~/ui/components/error';
import { Footer } from '~/ui/components/layout/footer';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';

async function getData() {
    const apiClient = createClient({
        tenantIdentifier: 'frntr',
        accessTokenId: `${process.env.SUPERFAST_ACCESS_TOKEN_ID}`,
        accessTokenSecret: `${process.env.SUPERFAST_ACCESS_TOKEN_SECRET}`,
    });

    const api = CrystallizeAPI({
        apiClient: apiClient,
        language: 'en',
    });
    const [navigation, footer] = await Promise.all([api.fetchNavigation('/'), api.fetchFooter('/footer')]);
    return {
        navigation,
        footer,
    };
}

export default async function Page() {
    const data = await getData();

    console.log(data);
    return (
        <div>
            <h1>Hello, Next.js!</h1>
            <ErrorComponent text="Oh Yeah" code={200} />
        </div>
    );
}
