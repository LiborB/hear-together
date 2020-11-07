using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace API.Handler
{
    public class OnlyAuthorized : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            context.HttpContext.Request.Headers.TryGetValue("token", out var token);
            if (String.IsNullOrEmpty(token))
            {
                context.Result = new UnauthorizedResult();
            }
            else
            {
                
            }
            
            base.OnActionExecuting(context);
        }
    }
}