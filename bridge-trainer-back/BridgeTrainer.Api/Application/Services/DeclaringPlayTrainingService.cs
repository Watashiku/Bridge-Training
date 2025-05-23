using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Interfaces;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;

namespace BridgeTrainer.Api.Application.Services;

public class DeclaringPlayTrainingService(ITrainingContextProvider exerciseContextProvider, IDealRepository dealRepository) : IDeclaringPlayTrainingService
{
    public LeadExerciseResult GetLeadExercise(LeadExerciseQuery query)
    {
        var exerciseContext = exerciseContextProvider.GetRandomExercise(new GetRandomExerciseQuery());

        return new LeadExerciseResult(
            exerciseContext.Player,
            exerciseContext.Deal.Id,
            exerciseContext.Deal.Bids,
            exerciseContext.Deal.Dealer,
            exerciseContext.Deal.Vulnerability,
            exerciseContext.Deal.GetHand(exerciseContext.Player));
    }

    public SubmitLeadCardResult SubmitLeadCardForExercise(SubmitLeadCardCommand command)
    {
        var deal = dealRepository.GetById(command.DealId);
        return new SubmitLeadCardResult(deal.Lead == command.Lead);
    }
}