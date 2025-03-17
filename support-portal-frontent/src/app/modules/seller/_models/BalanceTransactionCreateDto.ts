export interface BalanceTransactionCreateDto {
    seller_id: number;
    tx_code: string;
    amount: number;
    debit: boolean;
    note: string;
    created_by: string;
    order_id: number | null;
    ref_id: string;
}