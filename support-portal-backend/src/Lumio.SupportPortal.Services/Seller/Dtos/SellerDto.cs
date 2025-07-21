namespace Lumio.SupportPortal.Services.Seller
{
    public class SellerDto
    {
        public int seller_id { get; set; }

        public string seller_name { get; set; } = null;

        public string email { get; set; }

        public bool active { get; set; }

        public string site { get; set; } = null;

        public DateTimeOffset created_at { get; set; }
    }
}
