namespace Lumio.SupportPortal.Services.Order
{
    public record ReturnRequestRejectDto
    {
        public int order_id { get; set; }

        public string note { get; set; }
    }
}
