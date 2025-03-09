using Lumio.Domain;
using Lumio.SupportPortal.Services.Order;
using Microsoft.AspNetCore.Mvc;

namespace Lumio.SupportPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        IServiceProvider serviceProvider;
        IConfiguration configuration;
        IOrderService orderService;
        public OrdersController(IServiceProvider serviceProvider, IConfiguration configuration, IOrderService orderService)
        {
            this.serviceProvider = serviceProvider;
            this.configuration = configuration;
            this.orderService = orderService;
        }

        [Route("{orderId}")]
        [HttpGet]
        public async Task<BaseResponse<OrderDetailDto>> GetOrderAsync(int orderId)
        {
            BaseResponse<OrderDetailDto> response = new BaseResponse<OrderDetailDto>();
            try
            {
                response.Data = await orderService.GetOrderDetailAsync(orderId);
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

        [Route("{orderId}/cancel")]
        [HttpPost]
        public async Task<BaseResponse<string>> CancelOrderAsync(int orderId, [FromForm] string reason, [FromForm] bool refundBalance)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.CancelOrderAsync(orderId, reason, refundBalance);
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
    }
}
