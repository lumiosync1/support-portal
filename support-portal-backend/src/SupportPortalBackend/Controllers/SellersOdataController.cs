using Lumio.Domain.Entities;
using Lumio.SupportPortal.Services.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace SupportPortalBackend.Controllers
{
    [Authorize]
    public class SellersOdataController : ODataController
    {
        ISellerService sellerService;
        public SellersOdataController(ISellerService sellerService)
        {
            this.sellerService = sellerService;
        }

        [EnableQuery]
        public IQueryable<seller> Get()
        {
            return sellerService.GetSellerQueryable();
        }
    }
}
