using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Lumio.SupportPortal.Services.Auth;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Lumio.SupportPortal.Services.SupplierAccount
{
    public class SupplierAccountService : ISupplierAccountService
    {
        MainDbContext dbContext;
        IAuthService authService;
        public SupplierAccountService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
        }

        public IQueryable<supplier_account> GetSupplierAccountQueryable()
        {
            return dbContext.supplier_accounts;
        }

        public async Task AddAsync(SupplierAccountAddDto dto)
        {
            var supplierAccount = new supplier_account
            {
                account_name = dto.account_name,
                account_password = dto.account_password,
                supplier = dto.supplier,
                ml_profile = $"f/075df555-8092-48c7-ae96-12457bfbeea6/p/{dto.ml_profile}",
                protection_settings = dto.protection_settings,
                site = dto.site,

                allow_purchase = true, // Default value
                enabled = true, // Default value
                is_managed_account = true, // Default value
                created_at = DateTime.UtcNow,
                created_by = authService.CurrentUser.UserName,
            };

            await dbContext.supplier_accounts.AddAsync(supplierAccount);
            await dbContext.SaveChangesAsync();
        }

        public async Task<SupplierAccountUpdateInitDataDto> InitDataUpdateAsync(int accountId)
        {
            var account = await dbContext.supplier_accounts.FindAsync(accountId);
            if (account == null)
            {
                throw new KeyNotFoundException($"Supplier account with ID {accountId} not found.");
            }

            var dto = new SupplierAccountUpdateInitDataDto()
            {
                SupplierAccount = SupplierAccountMapping.ToUpdateDto(account),
            };
            return dto;
        }

        public async Task UpdateAsync(SupplierAccountUpdateDto dto)
        {
            var account = await dbContext.supplier_accounts.FindAsync(dto.account_id);
            if (account == null)
            {
                throw new KeyNotFoundException($"Supplier account with ID {dto.account_id} not found.");
            }

            account.account_name = dto.account_name;
            account.account_password = dto.account_password;
            account.supplier = dto.supplier;
            account.site = dto.site;
            account.ml_profile = $"f/075df555-8092-48c7-ae96-12457bfbeea6/p/{dto.ml_profile}";
            account.protection_settings = dto.protection_settings;
            account.allow_purchase = dto.allow_purchase;
            account.enabled = dto.enabled;
            account.note = dto.note;

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int accountId)
        {
            await dbContext.supplier_accounts
                .Where(x => x.account_id == accountId)
                .ExecuteDeleteAsync();
        }
    }
}
