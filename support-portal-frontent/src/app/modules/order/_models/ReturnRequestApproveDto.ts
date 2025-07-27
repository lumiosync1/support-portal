export interface ReturnRequestApproveDto {
    order_id: number;
    note: string | null;
    refund_order_price: boolean;
    refund_processing_fee: boolean;
}