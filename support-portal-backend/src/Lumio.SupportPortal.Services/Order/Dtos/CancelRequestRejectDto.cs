namespace Lumio.SupportPortal.Services.Order
{
    public record CancelRequestRejectDto
    {
        public int order_id { get; set; }

        public string note { get; set; }
    }
}
