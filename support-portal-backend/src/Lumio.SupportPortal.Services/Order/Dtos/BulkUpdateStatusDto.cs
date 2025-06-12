namespace Lumio.SupportPortal.Services.Order
{
    public class BulkUpdateStatusDto
    {
        public string NewStatus { get; set; }
        public string Reason { get; set; }
        public List<int> OrderIds { get; set; }
    }
}
