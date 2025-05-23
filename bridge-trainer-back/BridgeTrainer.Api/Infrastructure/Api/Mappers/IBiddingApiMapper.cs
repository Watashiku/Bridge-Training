using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Results;
using BridgeTrainer.Api.Infrastructure.Api.Models;

namespace BridgeTrainer.Api.Infrastructure.Api.Mappers;

public interface IBiddingApiMapper
{
    BiddingDescription ToRandomBiddingResponse(BiddingExerciseResult domain);
    SubmitBidForExerciseCommand ToSubmitBidForExerciseCommand(BiddingRequest dto);
    BiddingResponse ToPostBiddingResponse(SubmitBidForExerciseResult domain);
}
