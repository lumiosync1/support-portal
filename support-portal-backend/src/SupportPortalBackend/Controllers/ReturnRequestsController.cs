using Lumio.Domain;
using Lumio.SupportPortal.Services.Order;
using Microsoft.AspNetCore.Mvc;

namespace SupportPortalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReturnRequestsController : ControllerBase
    {
        IOrderService orderService;
        public ReturnRequestsController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [HttpPost]
        [Route("reject")]
        public async Task<BaseResponse<string>> RejectReturnRequestAsync([FromBody] ReturnRequestRejectDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.RejectReturnRequestAsync(dto);
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

        [HttpPost]
        [Route("approve")]
        public async Task<BaseResponse<string>> ApproveReturnRequestAsync([FromBody] ReturnRequestApproveDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.ApproveReturnRequestAsync(dto);
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
