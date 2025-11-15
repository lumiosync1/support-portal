using Lumio.Balance;
using Lumio.Domain;
using Lumio.Domain.Seller;
using Lumio.SupportPortal.Services.Auth;
using Lumio.SupportPortal.Services.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace SupportPortalBackend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SellersController : ControllerBase
    {
        BalanceManager balanceManager;
        ISellerService sellerService;
        IAuthService authService;
        IConfiguration configuration;
        public SellersController(BalanceManager balanceManager, ISellerService sellerService, IAuthService authService, IConfiguration configuration)
        {
            this.balanceManager = balanceManager;
            this.sellerService = sellerService;
            this.authService = authService;
            this.configuration = configuration;
        }

        [Route("{sellerId}")]
        [HttpGet]
        public async Task<BaseResponse<SellerDto>> GetSellerAsync(int sellerId)
        {
            BaseResponse<SellerDto> response = new BaseResponse<SellerDto>();
            try
            {
                response.Data = await sellerService.GetSellerAsync(sellerId);
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

        [Route("{sellerId}/status")]
        [HttpPost]
        public async Task<BaseResponse<string>> EnableSellerAsync(int sellerId)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await sellerService.EnableSellerAsync(sellerId);
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

        [Route("{sellerId}/status")]
        [HttpDelete]
        public async Task<BaseResponse<string>> DisableSellerAsync(int sellerId)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await sellerService.DisableSellerAsync(sellerId);
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

        [Route("{sellerId}/balance")]
        [HttpGet]
        public async Task<BaseResponse<string>> GetBalanceAsync(int sellerId)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                decimal balance = await balanceManager.GetBalanceAsync(sellerId);
                response.Data = balance.ToString();
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

        [Route("{sellerId}/balance/topup")]
        [HttpPost]
        public async Task<BaseResponse<string>> TopupAsync(BalanceTransactionCreateDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await sellerService.TopupAsync(dto);
                response.Data = "Success";
                response.Status = ResponseStatus.Success;

                // unlock seller in order purchasing queue
                try
                {
                    SellerDto seller = await sellerService.GetSellerAsync(dto.seller_id);

                    string orderQueueUrl = configuration.GetValue<string>("OrderPurchasingQueueUrl") ?? "";
                    string url = $"{orderQueueUrl}/queue/resume-seller";
                    MultipartFormDataContent form = new MultipartFormDataContent();
                    form.Add(new StringContent(seller.seller_name), "sellerName");
                    using HttpClient httpClient = new HttpClient();
                    await httpClient.PostAsync(url, form);
                }
                catch (Exception ex)
                {

                }

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

        [HttpPost("{sellerId}/balance/withdraw")]
        public async Task<BaseResponse<string>> WithdrawAsync(BalanceTransactionCreateDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await sellerService.WithdrawBalanceAsync(dto);
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

        [HttpPost("{sellerId}/balance/adjust")]
        public async Task<BaseResponse<string>> AdjustBalanceAsync(BalanceTransactionCreateDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await sellerService.AdjustBalanceAsync(dto);
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

        [Route("{sellerId}/settings")]
        [HttpGet]
        public async Task<BaseResponse<string>> GetSettingAsync(int sellerId, string key)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                response.Data = await sellerService.GetSettingAsync(sellerId, key);
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
    }
}
