export type Voucher = {
    itemId: string;
    name: string;
    value: {
        number: number;
        unit?: string;
        type: string;
    };
    expires: Date | null;
};