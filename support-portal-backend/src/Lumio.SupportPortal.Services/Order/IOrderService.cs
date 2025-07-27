using Lumio.Domain.Entities;

namespace Lumio.SupportPortal.Services.Order
{
    public interface IOrderService
    {
        public IQueryable<portal_order_import> GetOrderImportsQueryable();
        
        public Task<OrderDetailDto> GetOrderDetailAsync(int orderId);

        public IQueryable<OrderListDto> GetOrdersQueryable();

        public Task RemoveOrderAsync(int orderId);

        public Task CancelOrderAsync(int orderId, string reason, bool refundBalance);

        public Task ReprocessOrderAsync(int orderId, string reason);

        public Task ReturnOrderAsync(int orderId, string reason, bool refundBalance);

        public Task PushOrderToQueueAsync(PushOrderToQueueDto dto);

        public Task BulkUpdateStatusAsync(BulkUpdateStatusDto dto);

        public IQueryable<CancelRequestListDto> GetCancelRequestQueryable();

        public IQueryable<ReturnRequestListDto> GetReturnRequestQueryable();

        public Task ApproveCancelRequestAsync(CancelRequestApproveDto dto);

        public Task RejectCancelRequestAsync(CancelRequestRejectDto dto);

        public Task ApproveReturnRequestAsync(ReturnRequestApproveDto dto);

        public Task RejectReturnRequestAsync(ReturnRequestRejectDto dto);
    }
}
