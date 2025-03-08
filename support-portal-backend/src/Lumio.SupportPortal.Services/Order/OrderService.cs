using Lumio.SupportPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Lumio.SupportPortal.Services.Order
{
    public class OrderService : IOrderService
    {
        MainDbContext dbContext;
        IAuthService authService;

        public OrderService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
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
    }
}
