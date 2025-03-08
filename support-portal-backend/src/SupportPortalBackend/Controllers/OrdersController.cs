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
                response.Message = ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }
    }
}
