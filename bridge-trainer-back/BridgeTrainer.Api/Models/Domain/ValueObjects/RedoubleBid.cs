using BridgeTrainer.Api.Models.Domain.Services;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Infrastructure.Bidding;

public abstract partial record Bid
{
    private sealed record RedoubleBid : Bid
    {
        public override BiddingState ApplyAndValidate(BiddingState state)
        {
            var errorFound = false;
            if (state.DoubleStatus != DoubleStatus.X)
            {
                errorFound = true;
            }
            if (state.PassesSinceLastBid % 2 == 1)
            {
                errorFound = true;
            }
            return new BiddingState(state.MaxBid, 0, state.BiddingHasEnded, DoubleStatus.XX, errorFound);
        }
    }
}