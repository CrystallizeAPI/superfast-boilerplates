import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useState } from 'react';
import { useLocalCart } from '../hooks/useLocalCart';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { Input } from './input';

export const VoucherForm: React.FC = () => {
    const { cart: localCart, setVoucher } = useLocalCart();
    const { loading } = useRemoteCart();
    const [voucherValue, setVoucherValue] = useState(localCart?.extra?.voucher ?? '');

    return (
        <ClientOnly>
            <div className="flex flex-col w-full">
                <Input
                    type="text"
                    name="voucher"
                    label="Coupon Code"
                    placeholder="Coupon Code"
                    onChange={(event) => {
                        setVoucherValue(event.target.value);
                    }}
                    defaultValue={voucherValue}
                />
                <div className="flex gap-2 items-end">
                    <button
                        type="button"
                        disabled={loading}
                        className="bg-[#000] text-[#fff] px-2 py-1 rounded mt-5 text-center h-10"
                        onClick={() => {
                            setVoucher(voucherValue);
                        }}
                    >
                        {loading ? 'Loading' : 'Use voucher'}
                    </button>
                    <button
                        type="button"
                        className="bg-grey py-2 px-5 rounded-md text-center"
                        onClick={() => {
                            setVoucher('deletevoucher');
                            setVoucherValue('');
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </ClientOnly>
    );
};
