export interface SupplierAccountUpdateForm {
    account_id: number;
    account_name: string;
    account_password: string;
    supplier: string;
    ml_profile: string | null;
    site: string;
    allow_purchase: boolean;
    enabled: boolean;
    note: string | null;
    max_orders_1h: number;
    max_orders_24h: number;
}