namespace Lumio.SupportPortal.Services.Order
{
    public record ReturnRequestApproveDto
    {
        public int order_id { get; set; }
        public string? note { get; set; }
        public string return_label_url { get; set; }
    }
}
