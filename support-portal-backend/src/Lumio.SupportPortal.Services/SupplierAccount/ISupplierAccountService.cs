using Lumio.Domain.Entities;

namespace Lumio.SupportPortal.Services.SupplierAccount
{
    public interface ISupplierAccountService
    {
        public IQueryable<supplier_account> GetSupplierAccountQueryable();

        public Task AddAsync(SupplierAccountAddDto dto);

        public Task<SupplierAccountUpdateInitDataDto> InitDataUpdateAsync(int accountId);

        public Task UpdateAsync(SupplierAccountUpdateDto dto);

        public Task DeleteAsync(int accountId);
    }
}
