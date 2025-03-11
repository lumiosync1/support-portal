using Lumio.SupportPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Lumio.DomainServices;
using Lumio.Domain.Order;
using Lumio.Balance;
using Lumio.Domain;

namespace Lumio.SupportPortal.Services.Order
{
    public class OrderService : IOrderService
    {
        MainDbContext dbContext;
        IAuthService authService;
        OrderManager orderManager;
        BalanceManager balanceManager;

        public OrderService(MainDbContext dbContext, IAuthService authService, OrderManager orderManager, BalanceManager balanceManager)
        {
            this.dbContext = dbContext;
            this.authService = authService;
            this.orderManager = orderManager;
            this.balanceManager = balanceManager;
        }

        public IQueryable<om_order> GetOrdersQueryable()
        {
            return dbContext.om_orders
                .AsNoTracking();
        }

        public IQueryable<portal_order_import> GetOrderImportsQueryable()
        {
            return dbContext.portal_order_imports
                .AsNoTracking();
        }

        public async Task<OrderDetailDto> GetOrderDetailAsync(int orderId)
        {
            var order = await dbContext.om_orders
                .Where(e => e.order_id == orderId)
                //.Include(e => e.purchase)
                .Include(e => e.tracking)
                .Include(e => e.buyer_address)
                .AsNoTracking()
                .FirstOrDefaultAsync();
            if (order == null)
            {
                throw new Exception("Order not found");
            }

            var dto = order.ToOrderDetailDto();

            dto.Purchase = await (from p in dbContext.om_order_purchases
                           join a in dbContext.supplier_accounts on p.supplier_account_id equals a.account_id
                           where p.order_id == orderId
                           select new PurchaseDto()
                           {
                               StartTime = p.start_time,
                               EndTime = p.end_time,
                               SupplierAccountId = a.account_id,
                               SupplierAccount = a.account_name,
                               SupplierOrderNumber = p.supplier_order_number,
                               EstimatedArrivalTime = p.estimated_arrival_time,
                               SupplierSubTotal = p.supplier_sub_total,
                               SupplierShippingFee = p.supplier_shipping_fee,
                               SupplierDiscount = p.supplier_discount,
                               SupplierTax = p.supplier_tax,
                               SupplierTotalPrice = p.supplier_total_price,
                               MarketSaleFee = p.market_sale_fee,
                               MarketAdditionalFeePercentage = p.market_additional_fee_percentage,
                               MarketAdditionalFeeFixed = p.market_additional_fee_fixed,
                               OrderFee = p.order_fee,
                               ProcessingFee = p.processing_fee,
                               Profit = p.profit
                           }).FirstOrDefaultAsync();

            dto.PurchaseAttempts = await (from p in dbContext.om_purchase_attempts
                                  where p.order_id == orderId
                                  join a in dbContext.supplier_accounts on p.supplier_account_id equals a.account_id into purchaseAccount
                                  from pa in purchaseAccount.DefaultIfEmpty()
                                  orderby p.start_at descending
                                  select new PurchaseAttemptDto()
                                  {
                                      Id = p.purchase_id,
                                      StartTime = p.start_at,
                                      EndTime = p.end_at,
                                      Status = p.status,
                                      Reason = p.reason,
                                      Note = p.note,
                                      SupplierAccountId = pa.account_id,
                                      SupplierAccount = pa.account_name
                                  })
                .ToListAsync();
            
            return dto;
        }

        public async Task RemoveOrderAsync(int orderId)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == orderId)
                .Include(o => o.purchase)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            if (order.order_status != OrderStatus.Pending && order.order_status != OrderStatus.Error)
            {
                throw new Exception("Order can only be removed if it is pending or error");
            }

            await orderManager.UpdateStatusAsync(order, OrderStatus.Cancelled, "Remove", authService.CurrentUser.UserName);
        }

        public async Task CancelOrderAsync(int orderId, string reason, bool refundBalance)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == orderId)
                .Include(o => o.purchase)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }
            
            if(order.order_status != OrderStatus.Purchased && order.order_status != OrderStatus.Shipped)
            {
                throw new Exception("Order can only be cancelled if it is purchased or shipped");
            }

            await orderManager.UpdateStatusAsync(order, OrderStatus.Cancelled, reason, authService.CurrentUser.UserName);

            if (refundBalance && order.purchase != null)
            {
                BalanceTransactionCreateDto transaction = new()
                {
                    seller_id = order.seller_id,
                    order_id = order.order_id,
                    amount = Math.Abs(order.purchase.supplier_total_price - order.purchase.supplier_shipping_fee), // make sure the amount is positive
                    debit = false,
                    tx_code = BalanceTransactionCodes.PURCHASE,
                    created_by = authService.CurrentUser.UserName,
                    note = "Refund for cancelled order"
                };

                await balanceManager.CreateTransactionAsync(transaction);
            }
        }

        public async Task ReturnOrderAsync(int orderId, string reason, bool refundBalance)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == orderId)
                .Include(o => o.purchase)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            if (order.order_status != OrderStatus.Delivered)
            {
                throw new Exception("Order can only be returned if it is delivered");
            }

            await orderManager.UpdateStatusAsync(order, OrderStatus.Returned, reason, authService.CurrentUser.UserName);

            if (refundBalance && order.purchase != null)
            {
                BalanceTransactionCreateDto transaction = new()
                {
                    seller_id = order.seller_id,
                    order_id = order.order_id,
                    amount = Math.Abs(order.purchase.supplier_total_price - order.purchase.supplier_shipping_fee), // make sure the amount is positive
                    debit = false,
                    tx_code = BalanceTransactionCodes.PURCHASE,
                    created_by = authService.CurrentUser.UserName,
                    note = "Refund for returned order"
                };

                await balanceManager.CreateTransactionAsync(transaction);
            }
        }
    }
}
