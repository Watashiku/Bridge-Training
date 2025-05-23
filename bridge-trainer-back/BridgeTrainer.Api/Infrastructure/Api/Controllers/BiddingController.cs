using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Services;
using BridgeTrainer.Api.Infrastructure.Api.Mappers;
using BridgeTrainer.Api.Infrastructure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace BridgeTrainer.Api.Infrastructure.Api.Controllers;

[ApiController]
[Route("api/exercice/bidding")]
public class BiddingController(
    IBiddingTrainingService service,
    IBiddingApiMapper mapper) : ControllerBase
{
    [HttpGet]
    public IActionResult GetRandomBidding()
    {
        var biddingExercise = service.GetBiddingExercise(new BiddingExerciseQuery());
        var response = mapper.ToRandomBiddingResponse(biddingExercise);
        return Ok(response);
    }

    [HttpPost]
    public IActionResult PostBidding([FromBody] BiddingRequest request)
    {
        var command = mapper.ToSubmitBidForExerciseCommand(request);
        var result = service.SubmitBidForExercise(command);
        var response = mapper.ToPostBiddingResponse(result);

        /*
         * FORMAT :
         * 
         
                var response = new
                {
                    id = biddingExercise.DealId,
                    donneur = biddingExercise.Dealer,
                    joueur = biddingExercise.Player,
                    joueurActuel = biddingExercise.Player,
                    mainJoueur = biddingExercise.Hand,
                    encheresDejaFaites = biddingExercise.StartBids,
                };
        
         */
        return Ok(response);
    }
}