using Lumio.Domain.Entities;

namespace Lumio.SupportPortal.Services.SupplierAccount
{
    public static class SupplierAccountMapping
    {
        public static SupplierAccountUpdateDto ToUpdateDto(this supplier_account account)
        {
            return new SupplierAccountUpdateDto
            {
                account_id = account.account_id,
                account_name = account.account_name,
                account_password = account.account_password,
                supplier = account.supplier,
                ml_profile = account.ml_profile.Replace("f/075df555-8092-48c7-ae96-12457bfbeea6/p/", ""),
                protection_settings = account.protection_settings,
                site = account.site,
                allow_purchase = account.allow_purchase,
                enabled = account.enabled,
                note = account.note
            };
        }
    }
}
