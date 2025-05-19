using Microsoft.AspNetCore.Mvc;
using BridgeTrainer.Api.Services;

namespace BridgeTrainer.Api.Controllers;

[ApiController]
[Route("api/exercice")]
public class ExerciseController(DonneService service) : ControllerBase
{
    [HttpGet("raw")]
    public IActionResult GetRandomRaw()
    {
        var (id, donne) = service.GetRandom();
        return Ok(new { id, donne });
    }
}