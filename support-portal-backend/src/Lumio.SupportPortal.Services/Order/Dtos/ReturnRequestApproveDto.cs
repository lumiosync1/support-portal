namespace Lumio.SupportPortal.Services.Order
{
    public record ReturnRequestApproveDto
    {
        public int order_id { get; set; }
        public string? note { get; set; }
        public bool refund_order_price { get; set; }
        public bool refund_processing_fee { get; set; }
        public string return_label_url { get; set; }
    }
}
