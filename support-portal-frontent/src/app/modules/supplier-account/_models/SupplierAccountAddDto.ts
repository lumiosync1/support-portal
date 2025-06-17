export interface SupplierAccountAddDto {
    account_name: string;
    account_password: string;
    supplier: string;
    ml_profile: string | null;
    protection_settings: string | null;
    site: string;
}