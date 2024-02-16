import { LoaderFunction, redirect } from '@remix-run/node';
import { availableLanguages } from '~/use-cases/LanguageAndMarket';
export const loader: LoaderFunction = async ({ params }) => {
    console.log('Redirecting to default language');
    return redirect('/' + availableLanguages[0] + '/' + params['*'], 301);
};
