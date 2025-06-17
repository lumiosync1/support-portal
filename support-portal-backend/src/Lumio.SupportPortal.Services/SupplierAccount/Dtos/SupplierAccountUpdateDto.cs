namespace Lumio.SupportPortal.Services.SupplierAccount
{
    public class SupplierAccountUpdateDto
    {
        public int account_id { get; set; }

        public string account_name { get; set; } = null!;

        public string account_password { get; set; } = null!;

        public string supplier { get; set; } = null!;

        public string? ml_profile { get; set; }

        public string? protection_settings { get; set; }

        public string site { get; set; } = null!;

        public bool allow_purchase { get; set; }

        public bool enabled { get; set; }

        public string? note { get; set; }
    }
}
