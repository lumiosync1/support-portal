namespace Lumio.SupportPortal.Services.SupplierAccount
{
    public class SupplierAccountAddDto
    {
        public string account_name { get; set; } = null!;

        public string account_password { get; set; } = null!;

        public string supplier { get; set; } = null!;

        public string? ml_profile { get; set; }

        public string? protection_settings { get; set; }

        public string site { get; set; } = null!;
    }
}
