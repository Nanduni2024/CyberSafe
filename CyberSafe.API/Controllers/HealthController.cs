using Microsoft.AspNetCore.Mvc;

namespace CyberSafe.API.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(HealthResponse), StatusCodes.Status200OK)]
    public ActionResult<HealthResponse> Get()
    {
        return Ok(new HealthResponse("CyberSafe API is running."));
    }
}

public sealed record HealthResponse(string Status);