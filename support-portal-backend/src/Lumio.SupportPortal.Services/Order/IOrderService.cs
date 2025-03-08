using Lumio.Domain.Entities;

namespace Lumio.SupportPortal.Services.Order
{
    public interface IOrderService
    {
        public IQueryable<portal_order_import> GetOrderImportsQueryable();
        
        public Task<OrderDetailDto> GetOrderDetailAsync(int orderId);

        public IQueryable<om_order> GetOrdersQueryable();
    }
}
