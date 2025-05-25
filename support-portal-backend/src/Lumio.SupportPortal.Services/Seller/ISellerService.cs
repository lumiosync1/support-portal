using Lumio.Balance;
using Lumio.Domain.Entities;

namespace Lumio.SupportPortal.Services.Seller
{
    public interface ISellerService
    {
        IQueryable<seller> GetSellerQueryable();

        Task<SellerDto> GetSellerAsync(int sellerId);

        public Task EnableSellerAsync(int sellerId);

        public Task DisableSellerAsync(int sellerId);

        public IQueryable<BalanceTransactionListDto> GetBalanceTransactionQueryable();

        public Task<string?> GetSettingAsync(int sellerId, string key);

        public Task TopupAsync(BalanceTransactionCreateDto dto);

        public Task WithdrawBalanceAsync(BalanceTransactionCreateDto dto);

        public Task AdjustBalanceAsync(BalanceTransactionCreateDto dto);
    }
}
