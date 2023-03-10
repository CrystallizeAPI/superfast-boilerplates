import { useEffect, useState } from 'react';
import { useAppContext } from '../app-context/provider';
import { ServiceAPI } from '~/use-cases/service-api';
import { Price } from '../lib/pricing/pricing-component';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { OrderDisplay } from '../components/display-order';

export default ({ id, cartId }: { id: string; cartId?: string }) => {
    const [tryCount, setTryCount] = useState(0);
    const [order, setOrder] = useState<any | null>(null);
    const { state: contextState, _t } = useAppContext();

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrder(
                    await ServiceAPI({
                        language: contextState.language,
                        serviceApiUrl: contextState.serviceApiUrl,
                    }).fetchOrder(id, cartId),
                );
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [id, tryCount]);

    return (
        <div className="min-h-[70vh] items-center flex lg:w-content mx-auto w-full">
            <ClientOnly>
                {order ? (
                    <OrderDisplay order={order} />
                ) : (
                    <div className="min-h-[70vh] items-center justify-center flex max-w-[500px] mx-auto">
                        <div className="loader" />
                    </div>
                )}
            </ClientOnly>
        </div>
    );
};
