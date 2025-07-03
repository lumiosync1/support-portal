namespace Lumio.SupportPortal.Services.Order
{
    public class OrderListDto
    {
        public int order_id { get; set; }

        public string sale_date { get; set; }

        public DateTime created_at { get; set; }

        public string seller_name { get; set; }

        public string item_title { get; set; }

        public int quantity { get; set; }

        public decimal market_total_price { get; set; }

        public string order_status { get; set; }

        public string? supplier_account_name { get; set; }

        public string? supplier_order_number { get; set; }
    }
}
