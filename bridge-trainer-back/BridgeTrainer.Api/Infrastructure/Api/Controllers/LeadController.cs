using Microsoft.AspNetCore.Mvc;
using BridgeTrainer.Api.Infrastructure.Api.Models;
using System.ComponentModel;
using BridgeTrainer.Api.Application.Services;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Infrastructure.Api.Mappers;

namespace BridgeTrainer.Api.Infrastructure.Api.Controllers;

[ApiController]
[Route("api/exercice/lead")]
public class LeadController(ILeadTrainingService service, ILeadApiMapper mapper) : ControllerBase
{
    [HttpGet]
    public IActionResult GetRandomLead()
    {
        var exercise = service.GetLeadExercise(new LeadExerciseQuery());
        var response = mapper.ToRandomLeadResponse(exercise);
        return Ok(response);
    }

    [HttpPost]
    public IActionResult PostLead([FromBody] LeadRequest request)
    {
        var command = mapper.ToSubmitLeadForExerciseCommand(request);
        var result = service.SubmitLeadCardForExercise(command);
        var response = mapper.ToPostLeadResponse(result);
        return Ok(response);
    }
}