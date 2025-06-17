using Lumio.Domain;
using Lumio.SupportPortal.Services.SupplierAccount;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace SupportPortalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierAccountsController : ControllerBase
    {
        ISupplierAccountService service;
        IConfiguration configuration;
        public SupplierAccountsController(ISupplierAccountService service, IConfiguration configuration)
        {
            this.service = service;
            this.configuration = configuration;
        }

        [HttpPost]
        public async Task<BaseResponse<string>> AddSupplierAccountAsync(
            [FromBody] SupplierAccountAddDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                dto.account_name = dto.account_name.ToLower().Trim();
                dto.ml_profile = dto.ml_profile.Trim();

                await service.AddAsync(dto);

                await ReloadSupplierAccountService();

                response.Data = "Success";
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [HttpGet("{accountId}/init-data-update")]
        public async Task<BaseResponse<SupplierAccountUpdateInitDataDto>> InitDataUpdateAsync(int accountId)
        {
            BaseResponse<SupplierAccountUpdateInitDataDto> response = new BaseResponse<SupplierAccountUpdateInitDataDto>();
            try
            {
                response.Data = await service.InitDataUpdateAsync(accountId);
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [HttpPut]
        public async Task<BaseResponse<string>> UpdateSupplierAccountAsync(
            [FromBody] SupplierAccountUpdateDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                dto.account_name = dto.account_name.ToLower().Trim();
                dto.ml_profile = dto.ml_profile.Trim();

                await service.UpdateAsync(dto);

                await ReloadSupplierAccountService();

                response.Data = "Success";
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [HttpDelete("{accountId}")]
        public async Task<BaseResponse<string>> DeleteSupplierAccountAsync(int accountId)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await service.DeleteAsync(accountId);
                response.Data = "Success";
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        private async Task ReloadSupplierAccountService()
        {
            try
            {
                string supplierAccountServiceUrl = configuration["SupplierAccountServiceUrl"];
                using HttpClient client = new HttpClient();
                string url = $"{supplierAccountServiceUrl}/accounts/reload";
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                var response = await client.SendAsync(request);
            }
            catch (Exception)
            {
                // do nothing, we just want to reload the service
            }
        }
    }
}
