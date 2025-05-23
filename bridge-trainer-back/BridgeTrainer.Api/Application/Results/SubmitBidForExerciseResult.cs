using BridgeTrainer.Api.Infrastructure.Bidding;

namespace BridgeTrainer.Api.Application.Results;

public record class SubmitBidForExerciseResult(bool Correct, bool SequenceEnded, IEnumerable<Bid> BidsToNextChoice);
