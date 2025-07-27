using Lumio.SupportPortal.Services.Order;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace SupportPortalBackend.Controllers
{
    public class CancelRequestsOdataController : ODataController
    {
        IOrderService orderService;
        public CancelRequestsOdataController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [EnableQuery]
        public IQueryable<CancelRequestListDto> Get()
        {
            return orderService.GetCancelRequestQueryable();
        }
    }
}
