using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;

namespace BridgeTrainer.Api.Application.Services;

public class BiddingTrainingService(ITrainingContextProvider exerciseContextProvider) : IBiddingTrainingService
{
    public BiddingExerciseResult GetBiddingExercise(BiddingExerciseQuery query)
    {
        var exerciseContext = exerciseContextProvider.GetRandomExercise(new GetRandomExerciseQuery());
        
        return new BiddingExerciseResult(
            exerciseContext.Player,
            exerciseContext.Deal.Id,
            exerciseContext.Deal.Dealer,
            exerciseContext.Deal.Vulnerability,
            exerciseContext.Deal.GetHand(exerciseContext.Player),
            exerciseContext.BiddingSequence.BidsUpToPlayer());
    }

    public SubmitBidForExerciseResult SubmitBidForExercise(SubmitBidForExerciseCommand command)
    {
        var query = new GetSpecificExerciseQuery(command.DealId, command.Player, command.BidNumber);
        var exerciseContext = exerciseContextProvider.GetSpecificExercise(query);
        var isGoodAnswer = exerciseContext.BiddingSequence.IsValidBid(command.BidNumber, command.Bid);
        if (isGoodAnswer)
        {
            var (isOver, bids) = exerciseContext.BiddingSequence.NFirstBids(command.BidNumber + 3);
            return new SubmitBidForExerciseResult(true, isOver, bids);
        }
        else
        {
            var (isOver, bids) = exerciseContext.BiddingSequence.NFirstBids(command.BidNumber - 1);
            return new SubmitBidForExerciseResult(false, isOver, bids);
        }
    }
}