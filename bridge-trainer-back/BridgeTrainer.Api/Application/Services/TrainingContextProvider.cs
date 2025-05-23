using BridgeTrainer.Api.Application.Interfaces;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;
using BridgeTrainer.Api.Models.Domain.Services;

namespace BridgeTrainer.Api.Application.Services;

public class TrainingContextProvider(
    IDealRepository dealRepository,
    IPositionGenerator positionGenerator) : ITrainingContextProvider
{
    const int MaxRetries = 10;
    public ExerciseContext GetRandomExercise(GetRandomExerciseQuery query)
    {
        for (var i = 0; i < MaxRetries; i++)
        {
            var exerciseContext = TryGetRandomValidExercise();
            if (exerciseContext != null)
            {
                return exerciseContext;
            }
        }
        throw new InvalidOperationException("Could not find a valid exercise after maximum retries.");
    }

    public ExerciseContext GetSpecificExercise(GetSpecificExerciseQuery query)
    {
        var deal = dealRepository.GetById(query.DealId);
        if (query.Player is null)
        {
            return new(deal, deal.Dealer, null!);
        }
        return new(deal, deal.Dealer, BiddingSequence.From(deal.Bids, deal.Dealer, query.Player.Value)!);
    }

    private ExerciseContext? TryGetRandomValidExercise()
    {
        var deal = dealRepository.GetRandom();
        var player = positionGenerator.GetRandom();
        var biddingSequence = BiddingSequence.From(deal.Bids, deal.Dealer, player);
        return biddingSequence == null
            ? null 
            : new ExerciseContext(deal, player, biddingSequence);
    }
}
