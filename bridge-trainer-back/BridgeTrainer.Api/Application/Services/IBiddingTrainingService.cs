using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;

namespace BridgeTrainer.Api.Application.Services;

public interface IBiddingTrainingService
{
    BiddingExerciseResult GetBiddingExercise(BiddingExerciseQuery query);
    SubmitBidForExerciseResult SubmitBidForExercise(SubmitBidForExerciseCommand command);
}
