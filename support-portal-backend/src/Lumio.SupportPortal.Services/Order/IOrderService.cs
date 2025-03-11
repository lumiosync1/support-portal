using Lumio.Domain.Entities;

namespace Lumio.SupportPortal.Services.Order
{
    public interface IOrderService
    {
        public IQueryable<portal_order_import> GetOrderImportsQueryable();
        
        public Task<OrderDetailDto> GetOrderDetailAsync(int orderId);

        public IQueryable<om_order> GetOrdersQueryable();

        public Task RemoveOrderAsync(int orderId);

        public Task CancelOrderAsync(int orderId, string reason, bool refundBalance);

        public Task ReturnOrderAsync(int orderId, string reason, bool refundBalance);

        public Task PushOrderToQueueAsync(int orderId);
    }
}
