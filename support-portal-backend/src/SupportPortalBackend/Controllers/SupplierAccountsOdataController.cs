using Lumio.SupportPortal.Services.SupplierAccount;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace SupportPortalBackend.Controllers
{
    public class SupplierAccountsOdataController : ODataController
    {
        ISupplierAccountService service;
        public SupplierAccountsOdataController(ISupplierAccountService service)
        {
            this.service = service;
        }

        [EnableQuery]
        public IQueryable<Lumio.Domain.Entities.supplier_account> Get()
        {
            return service.GetSupplierAccountQueryable();
        }
    }
}
