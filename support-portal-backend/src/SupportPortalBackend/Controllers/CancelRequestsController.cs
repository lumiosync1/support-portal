using Lumio.Domain;
using Lumio.SupportPortal.Services.Order;
using Microsoft.AspNetCore.Mvc;

namespace SupportPortalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CancelRequestsController : ControllerBase
    {
        IOrderService orderService;
        public CancelRequestsController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [HttpPost]
        [Route("reject")]
        public async Task<BaseResponse<string>> RejectCancelRequestAsync([FromBody] CancelRequestRejectDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.RejectCancelRequestAsync(dto);
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
        public async Task<BaseResponse<string>> ApproveCancelRequestAsync([FromBody] CancelRequestApproveDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.ApproveCancelRequestAsync(dto);
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
