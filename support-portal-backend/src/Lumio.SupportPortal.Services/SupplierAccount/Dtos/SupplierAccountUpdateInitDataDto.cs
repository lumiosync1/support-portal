namespace Lumio.SupportPortal.Services.SupplierAccount
{
    public class SupplierAccountUpdateInitDataDto
    {
        public SupplierAccountUpdateDto SupplierAccount { get; set; }

        public List<string> Sellers { get; set; }
    }
}
