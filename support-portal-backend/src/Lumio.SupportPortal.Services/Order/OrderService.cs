using Lumio.SupportPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Lumio.DomainServices;
using Lumio.Domain.Order;
using Lumio.Balance;
using Lumio.Domain;
using System.Text.Json.Nodes;
using EFCore.BulkExtensions;

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

        public IQueryable<OrderListDto> GetOrdersQueryable()
        {
            FormattableString sql = $@"SELECT o.order_id, o.sale_date, o.created_at, s.seller_name, o.item_title, o.quantity, o.market_total_price, o.order_status
                            FROM om_orders o
                            JOIN sellers s ON o.seller_id = s.seller_id";
            return dbContext.Database.SqlQuery<OrderListDto>(sql)
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

            await orderManager.UpdateStatusAsync(order, OrderStatus.Removed, "Remove by CS", authService.CurrentUser.UserName);
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

            if (order.order_status != OrderStatus.Purchased && order.order_status != OrderStatus.Shipped)
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

        public async Task PushOrderToQueueAsync(PushOrderToQueueDto dto)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == dto.OrderId)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            if (order.order_status != OrderStatus.Error && order.order_status != OrderStatus.Removed)
            {
                throw new Exception("Order can only be pushed to queue if it is error or removed");
            }

            string settings = string.IsNullOrEmpty(order.settings) ? "{}" : order.settings;
            JsonObject jsettings = JsonNode.Parse(settings).AsObject();
            if (dto.MinimalProfitFixed.HasValue)
            {
                jsettings["MinimalProfitFixed"] = dto.MinimalProfitFixed.Value;
            }
            if (dto.MaxShippingDays.HasValue)
            {
                jsettings["MaxShippingDays"] = dto.MaxShippingDays.Value;
            }
            if (dto.MinimalProfitFixed.HasValue || dto.MaxShippingDays.HasValue)
            {
                order.settings = jsettings.ToJsonString();
            }

            await orderManager.UpdateStatusAsync(order, OrderStatus.Pending, "Push to queue by CS", authService.CurrentUser.UserName);
        }

        public async Task BulkUpdateStatusAsync(BulkUpdateStatusDto dto)
        {
            await dbContext.om_orders
                .Where(o => dto.OrderIds.Contains(o.order_id))
                .ExecuteUpdateAsync(u =>
                    u.SetProperty(o => o.order_status, dto.NewStatus)
                    .SetProperty(o => o.reason, dto.Reason)
                );

            List<om_order_status_history> histories = new List<om_order_status_history>();
            
            foreach (var id in dto.OrderIds)
            {
                histories.Add(new om_order_status_history
                {
                    order_id = id,
                    new_status = dto.NewStatus,
                    reason = dto.Reason,
                    updated_by = authService.CurrentUser.UserName,
                    updated_at = DateTime.UtcNow
                });
            }

            if (histories.Count > 0)
            {
                await dbContext
                    .BulkInsertAsync(histories);
            }
        }
    }
}
