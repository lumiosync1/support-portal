export interface SupplierAccountUpdateDto {
    account_id: number;
    account_name: string;
    account_password: string;
    supplier: string;
    ml_profile: string | null;
    protection_settings: string | null;
    site: string;
    allow_purchase: boolean;
    enabled: boolean;
    note: string | null;
}