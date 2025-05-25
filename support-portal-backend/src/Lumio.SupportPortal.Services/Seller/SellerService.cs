using Lumio.Balance;
using Lumio.DataAccess;
using Lumio.Domain;
using Lumio.Domain.Entities;
using Lumio.Domain.Seller;
using Lumio.SupportPortal.Services.Auth;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Lumio.SupportPortal.Services.Seller
{
    public class SellerService : ISellerService
    {
        MainDbContext dbContext;
        IAuthService authService;
        BalanceManager balanceManager;
        public SellerService(MainDbContext dbContext, IAuthService authService, BalanceManager balanceManager)
        {
            this.dbContext = dbContext;
            this.authService = authService;
            this.balanceManager = balanceManager;
        }

        public IQueryable<seller> GetSellerQueryable()
        {
            return dbContext.sellers;
        }

        public async Task<SellerDto> GetSellerAsync(int sellerId)
        {
            var seller = await dbContext.sellers.FindAsync(sellerId);
            if (seller == null)
            {
                throw new Exception("Seller not found");
            }

            return new SellerDto()
            {
                seller_id = seller.seller_id,
                seller_name = seller.seller_name,
                active = seller.active,
                site = seller.site,
                created_at = seller.created_at,
            };
        }

        public async Task EnableSellerAsync(int sellerId)
        {
            await dbContext.sellers.Where(x => x.seller_id == sellerId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.active, true));
        }

        public async Task DisableSellerAsync(int sellerId)
        {
            await dbContext.sellers.Where(x => x.seller_id == sellerId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.active, false));
        }

        public IQueryable<BalanceTransactionListDto> GetBalanceTransactionQueryable()
        {
            return dbContext.balance_transactions
                .Include(e => e.tx_codeNavigation)
                .Select(e => new BalanceTransactionListDto()
                {
                    tx_id = e.tx_id,
                    seller_id = e.seller_id,
                    created_at = e.created_at,
                    tx_code = e.tx_code,
                    amount = e.amount,
                    debit = e.debit,
                    note = e.note,
                    order_id = e.order_id,
                    ref_id = e.ref_id,
                    description = e.tx_codeNavigation.description,
                    category = e.tx_codeNavigation.category,
                })
                .AsNoTracking();
        }

        public async Task<string?> GetSettingAsync(int sellerId, string key)
        {
            var setting = await dbContext.seller_settings
                .Where(x => x.seller_id == sellerId && x.feature == key)
                .FirstOrDefaultAsync();
            return setting?.settings;
        }

        public async Task TopupAsync(BalanceTransactionCreateDto dto)
        {
            decimal loadingFeePercentage = 0;
            string? settings = await GetSettingAsync(dto.seller_id, SettingFeatures.ManagedAccount);
            if (!string.IsNullOrEmpty(settings))
            {
                ManagedAccountSetting settingsObj = JsonSerializer.Deserialize<ManagedAccountSetting>(settings);
                loadingFeePercentage = settingsObj.BalanceLoadingFeePercentage;
            }

            // make sure correct data
            dto.debit = false;
            dto.amount = Math.Abs(dto.amount);
            dto.tx_code = BalanceTransactionCodes.TOPUP;
            dto.created_by = authService.CurrentUser.UserName;

            var dbTransaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                await balanceManager.CreateTransactionAsync(dto);

                if (loadingFeePercentage > 0)
                {
                    var loadingFee = dto.amount * loadingFeePercentage / 100;
                    var loadingFeeDto = new BalanceTransactionCreateDto()
                    {
                        seller_id = dto.seller_id,
                        amount = -1 * loadingFee,
                        tx_code = BalanceTransactionCodes.LOADING_FEE,
                        debit = true,
                        ref_id = dto.ref_id,
                        order_id = null,
                        note = "Loading fee",
                        created_by = dto.created_by,
                    };

                    await balanceManager.CreateTransactionAsync(loadingFeeDto);
                }

                await dbTransaction.CommitAsync();
            }
            catch (Exception e)
            {
                await dbTransaction.RollbackAsync();
                throw e;
            }
        }

        public async Task WithdrawBalanceAsync(BalanceTransactionCreateDto dto)
        {
            // make sure correct data
            dto.debit = true;
            dto.amount = -1 * Math.Abs(dto.amount);
            dto.tx_code = BalanceTransactionCodes.WITHDRAW;
            dto.created_by = authService.CurrentUser.UserName;

            await balanceManager.CreateTransactionAsync(dto);
        }

        public async Task AdjustBalanceAsync(BalanceTransactionCreateDto dto)
        {
            // make sure correct data
            dto.created_by = authService.CurrentUser.UserName;
            dto.tx_code = BalanceTransactionCodes.ADJUSTMENT;
            if (dto.debit)
            {
                dto.amount = -1 * Math.Abs(dto.amount);
            }
            else
            {
                dto.amount = Math.Abs(dto.amount);
            }
            await balanceManager.CreateTransactionAsync(dto);
        }
    }
}
