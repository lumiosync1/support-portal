namespace Lumio.SupportPortal.Services.Order
{
    public record ReturnRequestFinishDto
    {
        public int order_id { get; set; }
        public string? note { get; set; }
        public bool refund_order_price { get; set; }
        public bool refund_processing_fee { get; set; }
    }
}
