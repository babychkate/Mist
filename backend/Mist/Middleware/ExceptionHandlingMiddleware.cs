using Microsoft.EntityFrameworkCore;

namespace Mist.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KeyNotFoundException ex)
        {
            await WriteError(context, 404, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            await WriteError(context, 401, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            await WriteError(context, 400, ex.Message);
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate") == true)
        {
            await WriteError(context, 400, "Такий email або нікнейм вже зайнятий");
        }
        catch (Exception)
        {
            await WriteError(context, 500, "Внутрішня помилка сервера");
        }
    }

    private static async Task WriteError(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message });
    }
}