using Lumio.SupportPortal.Services.Order;
using Lumio.Domain.Entities;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.Authorization;

namespace SupportPortalBackend.Controllers
{
    [Authorize]
    public class OrdersOdataController : ODataController
    {
        IOrderService orderService;
        public OrdersOdataController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [EnableQuery]
        public IQueryable<om_order> Get()
        {
            return orderService.GetOrdersQueryable();
        }
    }
}
