using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Interfaces;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;

namespace BridgeTrainer.Api.Application.Services;

public class LeadTrainingService(ITrainingContextProvider exerciseContextProvider, IDealRepository dealRepository) : ILeadTrainingService
{
    public LeadExerciseResult GetLeadExercise(LeadExerciseQuery query)
    {
        var exerciseContext = exerciseContextProvider.GetRandomExercise(new GetRandomExerciseQuery());
        var player = exerciseContext.BiddingSequence.Leader();

        return new LeadExerciseResult(
            player,
            exerciseContext.Deal.Id,
            exerciseContext.BiddingSequence.AllBids,
            exerciseContext.Deal.Dealer,
            exerciseContext.Deal.Vulnerability,
            exerciseContext.Deal.GetHand(player));
    }

    public SubmitLeadCardResult SubmitLeadCardForExercise(SubmitLeadCardCommand command)
    {
        var deal = dealRepository.GetById(command.DealId);
        return new SubmitLeadCardResult(deal.Lead == command.Lead);
    }
}