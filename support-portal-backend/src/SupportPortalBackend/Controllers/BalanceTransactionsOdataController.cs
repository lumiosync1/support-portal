using Lumio.Domain.Entities;
using Lumio.SupportPortal.Services.Seller;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace SupportPortalBackend.Controllers
{
    public class BalanceTransactionsOdataController : ODataController
    {
        ISellerService sellerService;
        public BalanceTransactionsOdataController(ISellerService sellerService)
        {
            this.sellerService = sellerService;
        }

        [EnableQuery]
        public IQueryable<BalanceTransactionListDto> Get()
        {
            return sellerService.GetBalanceTransactionQueryable();
        }
    }
}
